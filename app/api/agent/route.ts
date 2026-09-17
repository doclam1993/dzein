import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { CanvasBlock, AIDiffProposal } from '@/types/builder';

interface ProviderRequestData {
  id?: string;
  type?: string;
  baseUrl?: string;
  apiKey?: string;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let providerError: { message: string; code?: string; details?: string } | null = null;

  try {
    const { prompt, currentBlocks, provider, model } = (await req.json()) as {
      prompt: string;
      currentBlocks: CanvasBlock[];
      provider?: ProviderRequestData;
      model?: string;
    };

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const systemInstruction = `You are OpenDesign AI Agent, an autonomous UI/UX and WebGL engineer.
You are given the user prompt and current state of website blocks.
You must return a JSON object with:
- "summary": A crisp explanation of changes made.
- "changes": Array of { "blockId": string, "blockName": string, "label": string, "type": "modified"|"added"|"removed", "before": string, "after": string }
- "updatedBlocks": The full updated array of blocks following the CanvasBlock schema.
Always return ONLY valid JSON matching this schema.`;

    const promptPayload = `${systemInstruction}\n\nUSER PROMPT: "${prompt}"\n\nCURRENT BLOCKS JSON:\n${JSON.stringify(
      currentBlocks,
      null,
      2
    )}`;

    const providerType = provider?.type || 'gemini';

    // 1. Google Gemini Provider
    if (providerType === 'gemini') {
      const apiKey = provider?.apiKey || process.env.GEMINI_API_KEY;
      const candidateModels = [
        model || 'gemini-3.8-flash',
        'gemini-3.1-flash-lite',
        'gemini-flash-latest',
      ];

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        for (const modelName of candidateModels) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: [
                {
                  role: 'user',
                  parts: [{ text: promptPayload }],
                },
              ],
              config: {
                responseMimeType: 'application/json',
              },
            });

            const rawText = response.text || '';
            if (rawText.trim()) {
              const parsed = JSON.parse(rawText);
              const proposal: AIDiffProposal = {
                id: `diff-${Date.now()}`,
                prompt,
                summary: parsed.summary || `[${modelName}] AI agent updated your website layout and style.`,
                changes: parsed.changes || [],
                proposedBlocks: parsed.updatedBlocks || currentBlocks,
                timestamp: 'Just now',
                applied: false,
              };

              return NextResponse.json({ 
                proposal, 
                providerUsed: 'gemini', 
                modelUsed: modelName,
                durationMs: Date.now() - startTime,
                fallbackUsed: false 
              });
            }
          } catch (e: any) {
            console.warn(`Gemini model ${modelName} error:`, e?.message || e);
            providerError = {
              message: e?.message || `Erreur du modèle Gemini ${modelName}`,
              code: 'GEMINI_API_ERROR',
              details: e?.status || 'Inférence interrompue',
            };
            continue;
          }
        }
      } else {
        providerError = {
          message: 'Clé API Gemini introuvable',
          code: 'NO_API_KEY',
          details: 'Veuillez configurer votre clé API Gemini dans les paramètres du fournisseur.',
        };
      }
    }

    // 2. OpenAI / Groq / DeepSeek / Ollama / OpenRouter / OpenCode / Mistral / Together / xAI / Fireworks / Cerebras / SambaNova / LM Studio / etc.
    const openAICompatibleTypes = [
      'openai', 'opencode', 'groq', 'deepseek', 'ollama', 'openrouter', 'mistral', 
      'together', 'perplexity', 'xai', 'fireworks', 'cerebras', 'sambanova', 
      'huggingface', 'lmstudio', 'custom_openai'
    ];

    if (openAICompatibleTypes.includes(providerType)) {
      if (!provider?.apiKey && !['ollama', 'lmstudio'].includes(providerType)) {
        providerError = {
          message: `Clé API manquante pour ${providerType.toUpperCase()}`,
          code: 'MISSING_API_KEY',
          details: 'Renseignez votre clé API dans le menu des fournisseurs IA pour utiliser ce modèle.',
        };
      } else {
        let endpoint = provider?.baseUrl;
        if (!endpoint) {
          if (providerType === 'openai') endpoint = 'https://api.openai.com/v1';
          else if (providerType === 'opencode') endpoint = 'https://opencode.ai/zen/v1';
          else if (providerType === 'groq') endpoint = 'https://api.groq.com/openai/v1';
          else if (providerType === 'deepseek') endpoint = 'https://api.deepseek.com/v1';
          else if (providerType === 'openrouter') endpoint = 'https://openrouter.ai/api/v1';
          else if (providerType === 'mistral') endpoint = 'https://api.mistral.ai/v1';
          else if (providerType === 'together') endpoint = 'https://api.together.xyz/v1';
          else if (providerType === 'perplexity') endpoint = 'https://api.perplexity.ai';
          else if (providerType === 'xai') endpoint = 'https://api.x.ai/v1';
          else if (providerType === 'fireworks') endpoint = 'https://api.fireworks.ai/inference/v1';
          else if (providerType === 'cerebras') endpoint = 'https://api.cerebras.ai/v1';
          else if (providerType === 'sambanova') endpoint = 'https://api.sambanova.ai/v1';
          else if (providerType === 'huggingface') endpoint = 'https://api-inference.huggingface.co/v1';
          else if (providerType === 'ollama') endpoint = 'http://localhost:11434/v1';
          else if (providerType === 'lmstudio') endpoint = 'http://localhost:1234/v1';
          else endpoint = 'https://api.openai.com/v1';
        }
        const url = `${endpoint.replace(/\/$/, '')}/chat/completions`;

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (provider?.apiKey) {
          headers['Authorization'] = `Bearer ${provider.apiKey}`;
        }
        if (providerType === 'openrouter') {
          headers['HTTP-Referer'] = 'https://opendesign.studio';
          headers['X-Title'] = 'OpenDesign Studio';
        }

        try {
          let defaultModel = 'gpt-4o';
          if (providerType === 'opencode') defaultModel = 'zen-default';
          else if (providerType === 'groq') defaultModel = 'llama-3.3-70b-versatile';
          else if (providerType === 'deepseek') defaultModel = 'deepseek-chat';
          else if (providerType === 'openrouter') defaultModel = 'anthropic/claude-3.7-sonnet';
          else if (providerType === 'mistral') defaultModel = 'codestral-latest';
          else if (providerType === 'together') defaultModel = 'meta-llama/Llama-3.3-70B-Instruct-Turbo';
          else if (providerType === 'xai') defaultModel = 'grok-2-latest';
          else if (providerType === 'cerebras') defaultModel = 'llama3.3-70b';
          else if (providerType === 'ollama') defaultModel = 'qwen2.5-coder:7b';
          
          const selectedModel = model || defaultModel;
          let res = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              model: selectedModel,
              messages: [
                { role: 'system', content: systemInstruction },
                { role: 'user', content: `USER PROMPT: "${prompt}"\n\nCURRENT BLOCKS JSON:\n${JSON.stringify(currentBlocks, null, 2)}` },
              ],
              response_format: { type: 'json_object' },
              temperature: 0.2,
            }),
          });

          // If provider failed with 400 (e.g. some models don't support response_format: { type: 'json_object' }), retry without response_format
          if (!res.ok && res.status === 400) {
            res = await fetch(url, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                model: selectedModel,
                messages: [
                  { role: 'system', content: `${systemInstruction}\nReturn purely raw valid JSON.` },
                  { role: 'user', content: `USER PROMPT: "${prompt}"\n\nCURRENT BLOCKS JSON:\n${JSON.stringify(currentBlocks, null, 2)}` },
                ],
                temperature: 0.2,
              }),
            });
          }

          if (res.ok) {
            const rawText = await res.text();
            let jsonRes: any = {};
            try {
              jsonRes = JSON.parse(rawText);
            } catch {
              throw new Error('Réponse non-JSON renvoyée par le provider');
            }
            const content = jsonRes.choices?.[0]?.message?.content || '';
            const cleaned = content.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
            if (cleaned) {
              let parsed: any = null;
              try {
                parsed = JSON.parse(cleaned);
              } catch {
                const match = cleaned.match(/\{[\s\S]*\}/);
                if (match) {
                  parsed = JSON.parse(match[0]);
                }
              }

              if (parsed) {
                const proposal: AIDiffProposal = {
                  id: `diff-${Date.now()}`,
                  prompt,
                  summary: parsed.summary || `[${selectedModel}] ${providerType.toUpperCase()} agent processed your prompt.`,
                  changes: parsed.changes || [],
                  proposedBlocks: parsed.updatedBlocks || currentBlocks,
                  timestamp: 'Just now',
                  applied: false,
                };
                return NextResponse.json({ 
                  proposal, 
                  providerUsed: providerType, 
                  modelUsed: selectedModel,
                  durationMs: Date.now() - startTime,
                  fallbackUsed: false 
                });
              }
            }
          } else {
            const errData = await res.json().catch(() => ({}));
            const errObj = errData.error || errData;
            providerError = {
              message: errObj.message || errData.message || `Erreur API fournisseur HTTP ${res.status}`,
              code: errObj.type || errObj.code || `${res.status}`,
              details: errObj.message || errData.error?.type || res.statusText || 'Erreur requête API',
            };
          }
        } catch (err: any) {
          console.warn(`Error calling OpenAI-compatible provider ${providerType}:`, err?.message);
          providerError = {
            message: err?.message || `Impossible de joindre le fournisseur ${providerType}`,
            code: 'NETWORK_ERROR',
            details: 'Vérifiez la connexion internet ou l\'URL du serveur.',
          };
        }
      }
    }

    // 3. Anthropic Claude Provider
    if (providerType === 'anthropic') {
      if (!provider?.apiKey) {
        providerError = {
          message: 'Clé API Anthropic manquante',
          code: 'MISSING_API_KEY',
          details: 'Veuillez saisir votre clé API Anthropic (sk-ant-...) dans les paramètres.',
        };
      } else {
        try {
          const selectedModel = model || 'claude-3-7-sonnet-20250219';
          const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': provider.apiKey,
              'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
              model: selectedModel,
              max_tokens: 4096,
              system: systemInstruction,
              messages: [
                {
                  role: 'user',
                  content: `USER PROMPT: "${prompt}"\n\nCURRENT BLOCKS JSON:\n${JSON.stringify(currentBlocks, null, 2)}`,
                },
              ],
            }),
          });

          if (res.ok) {
            const jsonRes = await res.json();
            const textBlock = jsonRes.content?.find((c: any) => c.type === 'text')?.text || '';
            const cleaned = textBlock.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
            if (cleaned) {
              const parsed = JSON.parse(cleaned);
              const proposal: AIDiffProposal = {
                id: `diff-${Date.now()}`,
                prompt,
                summary: parsed.summary || `[${selectedModel}] Claude agent updated your website layout.`,
                changes: parsed.changes || [],
                proposedBlocks: parsed.updatedBlocks || currentBlocks,
                timestamp: 'Just now',
                applied: false,
              };
              return NextResponse.json({ 
                proposal, 
                providerUsed: 'anthropic', 
                modelUsed: selectedModel,
                durationMs: Date.now() - startTime,
                fallbackUsed: false 
              });
            }
          } else {
            const errData = await res.json().catch(() => ({}));
            providerError = {
              message: errData.error?.message || `Erreur API Claude HTTP ${res.status}`,
              code: `${res.status}`,
              details: errData.error?.type || 'Inférence Claude rejetée',
            };
          }
        } catch (err: any) {
          console.warn('Anthropic API error:', err?.message);
          providerError = {
            message: err?.message || 'Erreur réseau vers l\'API Anthropic',
            code: 'NETWORK_ERROR',
          };
        }
      }
    }

    // Deterministic Rule Engine Fallback (Guaranteed to succeed and never leave user stranded)
    const proposal = generateLocalProposal(prompt, currentBlocks);
    const activeModelName = model || 'gemini-3.8-flash';
    proposal.summary = `[Moteur Studio Local] ${proposal.summary}`;
    return NextResponse.json({ 
      proposal, 
      providerUsed: providerType, 
      modelUsed: activeModelName,
      durationMs: Date.now() - startTime,
      fallbackUsed: true,
      providerError: providerError || {
        message: 'Le modèle sélectionné n\'a pas répondu ou aucune clé API valide n\'était présente.',
        code: 'FALLBACK_TRIGGERED',
        details: 'Le moteur Studio Local a pris le relais avec succès pour appliquer vos instructions.'
      }
    });
  } catch (error: any) {
    console.error('Agent API Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to process prompt',
      durationMs: Date.now() - startTime
    }, { status: 500 });
  }
}

// Local smart agent parser that handles French and English commands
function generateLocalProposal(prompt: string, blocks: CanvasBlock[]): AIDiffProposal {
  const p = prompt.toLowerCase();
  const nextBlocks: CanvasBlock[] = JSON.parse(JSON.stringify(blocks));
  const changes: AIDiffProposal['changes'] = [];
  let summary = '';

  // 1. 3D effects / Three.js adjustments
  if (p.includes('3d') || p.includes('mesh') || p.includes('torus') || p.includes('icosahedron') || p.includes('rotat') || p.includes('vitesse') || p.includes('speed') || p.includes('cube') || p.includes('gizmo')) {
    const canvas3d = nextBlocks.find((b) => b.type === 'canvas3d');
    if (canvas3d && canvas3d.threeConfig) {
      const prevMesh = canvas3d.threeConfig.meshType;
      if (p.includes('torus')) {
        canvas3d.threeConfig.meshType = 'torusKnot';
      } else if (p.includes('icosahedron') || p.includes('poly')) {
        canvas3d.threeConfig.meshType = 'icosahedron';
      } else if (p.includes('cube')) {
        canvas3d.threeConfig.meshType = 'cyberCube';
      } else if (p.includes('sphere')) {
        canvas3d.threeConfig.meshType = 'sphere';
      } else if (p.includes('ring')) {
        canvas3d.threeConfig.meshType = 'rings';
      }

      if (p.includes('wireframe') || p.includes('fil de fer')) {
        canvas3d.threeConfig.wireframe = !canvas3d.threeConfig.wireframe;
      }
      if (p.includes('violet') || p.includes('purple') || p.includes('neon')) {
        canvas3d.threeConfig.color = '#a855f7';
        canvas3d.threeConfig.glowColor = '#ec4899';
      } else if (p.includes('cyan') || p.includes('blue') || p.includes('bleu')) {
        canvas3d.threeConfig.color = '#06b6d4';
        canvas3d.threeConfig.glowColor = '#3b82f6';
      } else if (p.includes('emerald') || p.includes('vert') || p.includes('green')) {
        canvas3d.threeConfig.color = '#10b981';
        canvas3d.threeConfig.glowColor = '#059669';
      }

      canvas3d.threeConfig.rotationSpeed = Math.min(2.5, canvas3d.threeConfig.rotationSpeed + 0.5);
      canvas3d.threeConfig.floatSpeed = 1.8;

      changes.push({
        blockId: canvas3d.id,
        blockName: canvas3d.name,
        label: '3D Spatial Geometry & Material',
        type: 'modified',
        before: `meshType: ${prevMesh}, color: ${canvas3d.threeConfig.color}`,
        after: `meshType: ${canvas3d.threeConfig.meshType}, rotationSpeed: ${canvas3d.threeConfig.rotationSpeed.toFixed(1)}, wireframe: ${canvas3d.threeConfig.wireframe}`,
      });
      summary = `Optimized 3D WebGL element with ${canvas3d.threeConfig.meshType} geometry, reactive rotational kinetics, and neon shader highlights.`;
    }
  }

  // 2. Feature grid columns (2, 3, 4 colonnes)
  if (p.includes('colonne') || p.includes('column') || p.includes('grille') || p.includes('grid') || p.includes('bento')) {
    const featBlock = nextBlocks.find((b) => b.type === 'featureGrid');
    if (featBlock && featBlock.content) {
      const prevCols = featBlock.content.gridColumns || 3;
      let newCols = 3;
      if (p.includes('2') || p.includes('deux')) newCols = 2;
      else if (p.includes('4') || p.includes('quatre')) newCols = 4;
      else if (p.includes('3') || p.includes('trois')) newCols = 3;
      else newCols = prevCols === 3 ? 2 : 3;

      featBlock.content.gridColumns = newCols;
      changes.push({
        blockId: featBlock.id,
        blockName: featBlock.name,
        label: 'Bento Grid Columns',
        type: 'modified',
        before: `grid-cols-${prevCols}`,
        after: `grid-cols-${newCols}`,
      });
      summary = summary ? `${summary} And converted feature grid to ${newCols} columns.` : `Updated feature grid layout to ${newCols} balanced responsive columns.`;
    }
  }

  // 3. Hero CTA / Button / Colors / Cyber Neon
  if (p.includes('hero') || p.includes('bouton') || p.includes('cta') || p.includes('neon') || p.includes('titre') || p.includes('headline')) {
    const heroBlock = nextBlocks.find((b) => b.type === 'hero');
    if (heroBlock && heroBlock.content) {
      if (p.includes('purple') || p.includes('violet') || p.includes('neon')) {
        heroBlock.content.titleHighlight = 'Autonomous Neural Synthesis & Edge Compute';
        heroBlock.content.primaryCtaText = '⚡ Deploy Instant AI Stack';
      } else {
        heroBlock.content.badgeText = '🚀 Ultra-Fast v4.0 Release Live';
        heroBlock.content.primaryCtaText = 'Get Started with 3D Preview';
      }
      changes.push({
        blockId: heroBlock.id,
        blockName: heroBlock.name,
        label: 'Hero Headline & Micro-interactions',
        type: 'modified',
        before: 'Standard CTA & highlight',
        after: `CTA: "${heroBlock.content.primaryCtaText}" with enhanced glow hover`,
      });
      if (!summary) summary = 'Refreshed Hero section typography, glowing badge, and high-conversion call to action.';
    }
  }

  // 4. Pricing / Annual discount / tiers
  if (p.includes('pricing') || p.includes('prix') || p.includes('annuel') || p.includes('annual') || p.includes('discount') || p.includes('remise')) {
    const pricingBlock = nextBlocks.find((b) => b.type === 'pricing');
    if (pricingBlock && pricingBlock.content?.pricingPlans) {
      pricingBlock.content.badgeText = '🎉 Limited Offer: -25% on Annual Billing';
      pricingBlock.content.pricingPlans[1].priceMonthly = 29;
      pricingBlock.content.pricingPlans[1].ctaText = 'Claim Pro Discount';
      changes.push({
        blockId: pricingBlock.id,
        blockName: pricingBlock.name,
        label: 'Annual Discount Promotion',
        type: 'modified',
        before: 'Pro Studio at $39/mo standard',
        after: 'Pro Studio adjusted to $29/mo with 25% annual badge',
      });
      if (!summary) summary = 'Applied 25% annual discount promotional tokens to the Pro tier.';
    }
  }

  // Default fallback if no specific keywords matched
  if (changes.length === 0) {
    const heroBlock = nextBlocks.find((b) => b.type === 'hero');
    if (heroBlock && heroBlock.content) {
      heroBlock.content.badgeText = '✨ AI Agent Customized Layout';
      heroBlock.style.borderColor = 'rgba(168, 85, 247, 0.4)';
      changes.push({
        blockId: heroBlock.id,
        blockName: heroBlock.name,
        label: 'Agentic Layout Refinement',
        type: 'modified',
        before: 'Default border and neutral styling',
        after: 'Accent border glow and refreshed AI badge',
      });
    }
    summary = `Agent successfully interpreted: "${prompt}" and composed layout improvements.`;
  }

  return {
    id: `diff-${Date.now()}`,
    prompt,
    summary,
    changes,
    proposedBlocks: nextBlocks,
    timestamp: 'Just now',
    applied: false,
  };
}
