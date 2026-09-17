import { NextRequest, NextResponse } from 'next/server';
import { AIModel, AIProviderType } from '@/types/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      providerId, 
      providerType, 
      baseUrl, 
      apiKey 
    } = body as {
      providerId: string;
      providerType: AIProviderType;
      baseUrl?: string;
      apiKey?: string;
    };

    if (!providerType) {
      return NextResponse.json({ error: 'providerType is required' }, { status: 400 });
    }

    const effectiveApiKey = apiKey || (providerType === 'gemini' ? process.env.GEMINI_API_KEY : '');
    const models: AIModel[] = [];

    // 1. Google Gemini
    if (providerType === 'gemini') {
      const keyToUse = effectiveApiKey;
      if (!keyToUse) {
        return NextResponse.json({ 
          error: 'Clé API Gemini manquante. Renseignez votre clé ou activez GEMINI_API_KEY.' 
        }, { status: 400 });
      }

      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${keyToUse}`;
        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData?.error?.message || `Erreur HTTP ${res.status}`);
        }
        const data = await res.json();
        const rawModels: any[] = data.models || [];

        // Filter and map
        for (const m of rawModels) {
          const name: string = m.name?.replace(/^models\//, '') || '';
          const methods: string[] = m.supportedGenerationMethods || [];
          if (!methods.includes('generateContent')) continue;

          // Priority labels
          let badge = 'Gemini';
          if (name.includes('flash')) badge = 'Rapide';
          if (name.includes('pro')) badge = 'Raisonnement';
          if (name.includes('lite')) badge = 'Ultra-léger';

          let context = '1M tokens';
          if (m.inputTokenLimit) {
            context = `${Math.round(m.inputTokenLimit / 1000)}k`;
          }

          models.push({
            id: name,
            name: m.displayName || name,
            providerId,
            contextWindow: context,
            badge,
            description: m.description?.substring(0, 140) || 'Modèle officiel Google Gemini.',
          });
        }

        // Sort: flash models first, then pro
        models.sort((a, b) => {
          if (a.id.includes('3.8') && !b.id.includes('3.8')) return -1;
          if (b.id.includes('3.8') && !a.id.includes('3.8')) return 1;
          if (a.id.includes('flash') && !b.id.includes('flash')) return -1;
          return a.name.localeCompare(b.name);
        });

        return NextResponse.json({ success: true, count: models.length, models });
      } catch (err: any) {
        return NextResponse.json({ 
          error: `Impossible de récupérer les modèles Gemini : ${err.message}` 
        }, { status: 502 });
      }
    }

    // 2. OpenRouter (Can fetch public catalogue even without key!)
    if (providerType === 'openrouter') {
      try {
        const headers: Record<string, string> = {};
        if (effectiveApiKey) {
          headers['Authorization'] = `Bearer ${effectiveApiKey}`;
        }
        const res = await fetch('https://openrouter.ai/api/v1/models', { headers });
        if (!res.ok) {
          throw new Error(`OpenRouter HTTP ${res.status}`);
        }
        const data = await res.json();
        const rawModels = data.data || [];

        for (const m of rawModels) {
          if (!m.id) continue;
          let ctx = '128k';
          if (m.context_length) {
            ctx = `${Math.round(m.context_length / 1000)}k`;
          }

          models.push({
            id: m.id,
            name: m.name || m.id,
            providerId,
            contextWindow: ctx,
            badge: m.id.split('/')[0] || 'OpenRouter',
            description: m.description?.substring(0, 140) || `Modèle servi via OpenRouter (${ctx}).`,
            pricing: m.pricing ? {
              prompt: `$${(parseFloat(m.pricing.prompt || '0') * 1000000).toFixed(2)}/M`,
              completion: `$${(parseFloat(m.pricing.completion || '0') * 1000000).toFixed(2)}/M`,
            } : undefined,
          });
        }

        return NextResponse.json({ success: true, count: models.length, models });
      } catch (err: any) {
        return NextResponse.json({ error: `Erreur OpenRouter : ${err.message}` }, { status: 502 });
      }
    }

    // 3. Anthropic Claude
    if (providerType === 'anthropic') {
      if (!effectiveApiKey) {
        return NextResponse.json({ error: 'Clé API Anthropic requise.' }, { status: 400 });
      }
      try {
        const res = await fetch('https://api.anthropic.com/v1/models', {
          headers: {
            'x-api-key': effectiveApiKey,
            'anthropic-version': '2023-06-01',
          },
        });

        if (res.ok) {
          const data = await res.json();
          const rawModels = data.data || [];
          for (const m of rawModels) {
            let badge = 'Claude';
            if (m.id.includes('3-7')) badge = 'Hybride Réflexion';
            else if (m.id.includes('3-5-sonnet')) badge = 'Spécialiste UI';
            else if (m.id.includes('haiku')) badge = 'Rapide';

            models.push({
              id: m.id,
              name: m.display_name || m.id,
              providerId,
              contextWindow: '200k',
              badge,
              description: `Modèle Anthropic Claude haute fidélité pour le code et l'UI.`,
            });
          }
          if (models.length > 0) {
            return NextResponse.json({ success: true, count: models.length, models });
          }
        }

        // Fallback standard catalogue if Anthropic models endpoint restricted
        const anthropicCatalogue: AIModel[] = [
          { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet', providerId, contextWindow: '200k', badge: 'Dernière Version' },
          { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet v2', providerId, contextWindow: '200k', badge: 'Spécialiste UI' },
          { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', providerId, contextWindow: '200k', badge: 'Ultra-rapide' },
          { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', providerId, contextWindow: '200k', badge: 'Raisonnement Lourd' },
        ];
        return NextResponse.json({ success: true, count: anthropicCatalogue.length, models: anthropicCatalogue });
      } catch (err: any) {
        return NextResponse.json({ error: `Erreur Anthropic : ${err.message}` }, { status: 502 });
      }
    }

    // 4. Ollama (Local)
    if (providerType === 'ollama') {
      const host = (baseUrl || 'http://localhost:11434').replace(/\/$/, '');
      try {
        const res = await fetch(`${host}/api/tags`, { method: 'GET' });
        if (!res.ok) throw new Error(`Ollama local non joignable (${res.status})`);
        const data = await res.json();
        const raw = data.models || [];
        for (const m of raw) {
          const modelName = m.name || m.model || '';
          models.push({
            id: modelName,
            name: modelName,
            providerId,
            contextWindow: m.details?.parameter_size ? `${m.details.parameter_size} params` : 'Local',
            badge: 'Local Ollama',
            description: `Modèle local hébergé sur votre machine (${(m.size / (1024 * 1024 * 1024)).toFixed(1)} GB).`,
          });
        }
        return NextResponse.json({ success: true, count: models.length, models });
      } catch (err: any) {
        return NextResponse.json({ 
          error: `Impossible de contacter Ollama sur ${host}. Vérifiez que 'ollama serve' est lancé.` 
        }, { status: 502 });
      }
    }

    // 5. OpenAI & All OpenAI-compatible APIs (OpenCode, Mistral, Groq, DeepSeek, Together, xAI, Fireworks, Cerebras, SambaNova, etc.)
    let endpoint = baseUrl;
    if (!endpoint) {
      switch (providerType) {
        case 'openai': endpoint = 'https://api.openai.com/v1'; break;
        case 'opencode': endpoint = 'https://opencode.ai/zen/v1'; break;
        case 'mistral': endpoint = 'https://api.mistral.ai/v1'; break;
        case 'groq': endpoint = 'https://api.groq.com/openai/v1'; break;
        case 'deepseek': endpoint = 'https://api.deepseek.com/v1'; break;
        case 'together': endpoint = 'https://api.together.xyz/v1'; break;
        case 'perplexity': endpoint = 'https://api.perplexity.ai'; break;
        case 'xai': endpoint = 'https://api.x.ai/v1'; break;
        case 'fireworks': endpoint = 'https://api.fireworks.ai/inference/v1'; break;
        case 'cerebras': endpoint = 'https://api.cerebras.ai/v1'; break;
        case 'sambanova': endpoint = 'https://api.sambanova.ai/v1'; break;
        case 'lmstudio': endpoint = 'http://localhost:1234/v1'; break;
        default: endpoint = 'https://api.openai.com/v1'; break;
      }
    }

    const modelsUrl = `${endpoint.replace(/\/$/, '')}/models`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (effectiveApiKey) {
      headers['Authorization'] = `Bearer ${effectiveApiKey}`;
    }

    try {
      const res = await fetch(modelsUrl, { headers });
      const rawText = await res.text().catch(() => '');

      if (!res.ok) {
        // If provider is opencode and endpoint doesn't support /models list, provide curated list
        if (providerType === 'opencode') {
          const opencodeCatalogue: AIModel[] = [
            { id: 'zen-default', name: 'OpenCode Zen Default', providerId, contextWindow: '128k', badge: 'Optimisé Code', description: 'Modèle de référence pour l\'édition et la génération de code.' },
            { id: 'zen-advanced', name: 'OpenCode Zen Advanced', providerId, contextWindow: '200k', badge: 'Raisonnement Fort', description: 'Raisonnement architectural profond pour UI complexe.' },
            { id: 'zen-fast', name: 'OpenCode Zen Fast', providerId, contextWindow: '32k', badge: 'Ultra-rapide', description: 'Latence minimale pour retouches immédiates.' },
            { id: 'big-pickle', name: 'Big Pickle (Special Code)', providerId, contextWindow: '128k', badge: 'Expert Code', description: 'Modèle expert pour le code TypeScript/React.' },
            { id: 'mimo-v2-pro-free', name: 'MiMo V2 Pro Free', providerId, contextWindow: '128k', badge: 'Gratuit / Pro' },
            { id: 'minimax-m2.5-free', name: 'MiniMax M2.5 Free', providerId, contextWindow: '200k', badge: 'Gratuit / Long Ctx' },
            { id: 'nemotron-3-super-free', name: 'Nemotron 3 Super Free', providerId, contextWindow: '64k', badge: 'NVIDIA Free' },
            { id: 'deepseek-v4-flash-free', name: 'DeepSeek V4 Flash Free', providerId, contextWindow: '128k', badge: 'DeepSeek Zen' },
          ];
          return NextResponse.json({ success: true, count: opencodeCatalogue.length, models: opencodeCatalogue });
        }
        throw new Error(`API a retourné le code HTTP ${res.status}: ${rawText.substring(0, 100)}`);
      }

      let json: any = null;
      try {
        json = JSON.parse(rawText);
      } catch {
        if (providerType === 'opencode') {
          const opencodeCatalogue: AIModel[] = [
            { id: 'zen-default', name: 'OpenCode Zen Default', providerId, contextWindow: '128k', badge: 'Optimisé Code', description: 'Modèle de référence pour l\'édition et la génération de code.' },
            { id: 'zen-advanced', name: 'OpenCode Zen Advanced', providerId, contextWindow: '200k', badge: 'Raisonnement Fort', description: 'Raisonnement architectural profond pour UI complexe.' },
            { id: 'zen-fast', name: 'OpenCode Zen Fast', providerId, contextWindow: '32k', badge: 'Ultra-rapide', description: 'Latence minimale pour retouches immédiates.' },
            { id: 'big-pickle', name: 'Big Pickle (Special Code)', providerId, contextWindow: '128k', badge: 'Expert Code', description: 'Modèle expert pour le code TypeScript/React.' },
            { id: 'mimo-v2-pro-free', name: 'MiMo V2 Pro Free', providerId, contextWindow: '128k', badge: 'Gratuit / Pro' },
            { id: 'minimax-m2.5-free', name: 'MiniMax M2.5 Free', providerId, contextWindow: '200k', badge: 'Gratuit / Long Ctx' },
            { id: 'nemotron-3-super-free', name: 'Nemotron 3 Super Free', providerId, contextWindow: '64k', badge: 'NVIDIA Free' },
            { id: 'deepseek-v4-flash-free', name: 'DeepSeek V4 Flash Free', providerId, contextWindow: '128k', badge: 'DeepSeek Zen' },
          ];
          return NextResponse.json({ success: true, count: opencodeCatalogue.length, models: opencodeCatalogue });
        }
        throw new Error('Réponse invalide du serveur de modèles (non-JSON)');
      }

      const rawData = Array.isArray(json) ? json : (json.data || json.models || []);

      for (const item of rawData) {
        const id = item.id || item.name;
        if (!id) continue;

        // Skip binary, embedding or audio only models if obvious
        const lower = id.toLowerCase();
        if (
          lower.includes('embedding') || 
          lower.includes('tts-') || 
          lower.includes('whisper') || 
          lower.includes('moderation') || 
          lower.includes('dall-e') ||
          lower.includes('bge-')
        ) {
          continue;
        }

        let badge = providerType.toUpperCase();
        if (lower.includes('coder') || lower.includes('code') || lower.includes('pickle')) badge = 'Spécial Code';
        else if (lower.includes('reason') || lower.includes('r1') || lower.includes('o3') || lower.includes('o1') || lower.includes('advanced')) badge = 'Raisonnement';
        else if (lower.includes('mini') || lower.includes('haiku') || lower.includes('turbo') || lower.includes('small') || lower.includes('fast') || lower.includes('flash')) badge = 'Rapide';

        let ctx = '128k';
        if (item.context_length) ctx = `${Math.round(item.context_length / 1000)}k`;
        else if (item.context_window) ctx = `${Math.round(item.context_window / 1000)}k`;

        models.push({
          id,
          name: item.display_name || item.name || id,
          providerId,
          contextWindow: ctx,
          badge,
          description: item.description?.substring(0, 140) || `Modèle chargé dynamiquement depuis ${providerType}.`,
        });
      }

      // If nothing parsed or filtered, keep fallback
      if (models.length === 0) {
        models.push({
          id: 'zen-default',
          name: 'OpenCode Zen Default',
          providerId,
          contextWindow: '128k',
          badge: 'Actif',
        });
      }

      return NextResponse.json({ success: true, count: models.length, models });
    } catch (err: any) {
      return NextResponse.json({ 
        error: `Erreur lors de la récupération des modèles chez ${providerType} : ${err.message}` 
      }, { status: 502 });
    }
  } catch (globalErr: any) {
    console.error('Error fetching AI models:', globalErr);
    return NextResponse.json({ error: globalErr.message || 'Internal error' }, { status: 500 });
  }
}
