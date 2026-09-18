import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { text, action, context } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback transformation if no API key is set
      let transformed = text;
      if (action === 'uppercase') transformed = text.toUpperCase();
      else if (action === 'lowercase') transformed = text.toLowerCase();
      else if (action === 'capitalize') {
        transformed = text.replace(/\b\w/g, (l) => l.toUpperCase());
      } else if (action === 'shorten') {
        transformed = text.split(' ').slice(0, Math.ceil(text.split(' ').length * 0.65)).join(' ');
      }
      return NextResponse.json({ result: transformed });
    }

    const ai = new GoogleGenAI({ apiKey });

    let systemPrompt = 'Tu es un copywriter et designer UI d\'élite. Réécris UNIQUEMENT le texte demandé sans explications, sans guillemets superflus, sans markdown superflu.';
    let userPrompt = '';

    switch (action) {
      case 'punchy':
        userPrompt = `Rends ce texte beaucoup plus percutant, captivant et moderne pour une landing page SaaS : "${text}"`;
        break;
      case 'shorten':
        userPrompt = `Raccourcis ce texte au maximum tout en gardant l'impact et la clarté : "${text}"`;
        break;
      case 'professional':
        userPrompt = `Réécris ce texte avec un ton professionnel, crédible et haut de gamme B2B : "${text}"`;
        break;
      case 'translate_en':
        userPrompt = `Traduis fidèlement ce texte en anglais de niveau natif pour site web moderne : "${text}"`;
        break;
      case 'translate_fr':
        userPrompt = `Traduis fidèlement ce texte en français naturel et soigné pour site web : "${text}"`;
        break;
      case 'expand':
        userPrompt = `Développe légèrement ce texte pour donner plus de détails et de valeur : "${text}"`;
        break;
      default:
        userPrompt = `Améliore ce texte pour un site web : "${text}"`;
    }

    if (context) {
      userPrompt += ` (Contexte de l'élément : ${context})`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
        },
      ],
    });

    const resultText = response.text?.trim() || text;
    // Clean up potential wrap quotes if Gemini wrapped in quotes
    const cleaned = resultText.replace(/^["']|["']$/g, '');

    return NextResponse.json({ result: cleaned });
  } catch (err: any) {
    console.error('Error in text-transform API:', err);
    return NextResponse.json({ error: err.message || 'Transform failed' }, { status: 500 });
  }
}
