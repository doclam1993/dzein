import { AIProvider, AIAgentSettings } from '@/types/ai';

export const DEFAULT_AI_PROVIDERS: AIProvider[] = [
  {
    id: 'google',
    name: 'Google Gemini',
    type: 'gemini',
    baseUrl: 'https://generativelanguage.googleapis.com',
    enabled: true,
    isCustom: false,
    description: 'Modèles officiels Google DeepMind haute performance.',
    websiteUrl: 'https://ai.google.dev',
    apiKeyDocsUrl: 'https://aistudio.google.com/app/apikey',
    autoFetchSupported: true,
    models: [
      {
        id: 'gemini-3.8-flash',
        name: 'Gemini 3.8 Flash',
        providerId: 'google',
        contextWindow: '1M tokens',
        badge: 'Recommandé',
        description: 'Vitesse instantanée et compréhension multimodale pour le code UI.',
      },
      {
        id: 'gemini-3.1-flash-lite',
        name: 'Gemini 3.1 Flash Lite',
        providerId: 'google',
        contextWindow: '1M tokens',
        badge: 'Ultra-rapide',
        description: 'Faible latence pour itérations visuelles immédiates.',
      },
      {
        id: 'gemini-flash-latest',
        name: 'Gemini Flash Latest',
        providerId: 'google',
        contextWindow: '1M tokens',
        badge: 'Stable',
        description: 'Dernière révision éprouvée de la famille Flash.',
      },
      {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        providerId: 'google',
        contextWindow: '2M tokens',
        badge: 'Raisonnement',
        description: 'Capacité analytique avancée pour structures complexes et 3D.',
      },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    type: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    enabled: true,
    isCustom: false,
    description: 'Modèles phares GPT-4o & raisonnement o-series.',
    websiteUrl: 'https://platform.openai.com',
    apiKeyDocsUrl: 'https://platform.openai.com/api-keys',
    autoFetchSupported: true,
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        providerId: 'openai',
        contextWindow: '128k',
        badge: 'Omni',
        description: 'Modèle phare multimodal équilibré entre vitesse et précision.',
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        providerId: 'openai',
        contextWindow: '128k',
        badge: 'Économique',
        description: 'Version compacte pour génération de maquettes rapides.',
      },
      {
        id: 'o3-mini',
        name: 'o3-mini',
        providerId: 'openai',
        contextWindow: '200k',
        badge: 'Raisonnement Code',
        description: 'Moteur de raisonnement profond optimisé pour le code.',
      },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    type: 'anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    enabled: true,
    isCustom: false,
    description: 'Modèles Claude réputés pour la qualité et le respect du design.',
    websiteUrl: 'https://anthropic.com',
    apiKeyDocsUrl: 'https://console.anthropic.com/settings/keys',
    autoFetchSupported: true,
    models: [
      {
        id: 'claude-3-7-sonnet',
        name: 'Claude 3.7 Sonnet',
        providerId: 'anthropic',
        contextWindow: '200k',
        badge: 'Hybride Réflexion',
        description: 'Modèle hybride dernière génération avec réflexion dynamique pour UI.',
      },
      {
        id: 'claude-3-5-sonnet',
        name: 'Claude 3.5 Sonnet',
        providerId: 'anthropic',
        contextWindow: '200k',
        badge: 'Spécialiste UI',
        description: 'Excellence reconnue dans la rédaction de composants React/Tailwind.',
      },
      {
        id: 'claude-3-5-haiku',
        name: 'Claude 3.5 Haiku',
        providerId: 'anthropic',
        contextWindow: '200k',
        badge: 'Rapide',
        description: 'Vitesse d’exécution fulgurante pour ajustements de style.',
      },
    ],
  },
  {
    id: 'opencode',
    name: 'OpenCode Zen / Go',
    type: 'opencode',
    baseUrl: 'https://opencode.ai/zen/v1',
    enabled: true,
    isCustom: false,
    description: 'Modèles IA spécialisés pour le code et le développement UI (OpenCode Zen, Big Pickle, MiMo).',
    websiteUrl: 'https://opencode.ai',
    apiKeyDocsUrl: 'https://opencode.ai/zen',
    autoFetchSupported: true,
    models: [
      {
        id: 'zen-default',
        name: 'OpenCode Zen Default',
        providerId: 'opencode',
        contextWindow: '128k',
        badge: 'Optimisé Code',
        description: 'Modèle par défaut optimisé pour la génération et retouche de code UI.',
      },
      {
        id: 'zen-advanced',
        name: 'OpenCode Zen Advanced',
        providerId: 'opencode',
        contextWindow: '200k',
        badge: 'Raisonnement Fort',
        description: 'Moteur de raisonnement profond pour architectures et composants avancés.',
      },
      {
        id: 'zen-fast',
        name: 'OpenCode Zen Fast',
        providerId: 'opencode',
        contextWindow: '32k',
        badge: 'Ultra-rapide',
        description: 'Faible latence pour retouches de style et ajustements rapides.',
      },
      {
        id: 'big-pickle',
        name: 'Big Pickle (Special Code)',
        providerId: 'opencode',
        contextWindow: '128k',
        badge: 'Code Expert',
        description: 'Modèle expert réputé pour la précision du code React/TypeScript.',
      },
      {
        id: 'mimo-v2-pro-free',
        name: 'MiMo V2 Pro Free',
        providerId: 'opencode',
        contextWindow: '128k',
        badge: 'Gratuit / Pro',
        description: 'Modèle Xiaomi pour le code haute performance.',
      },
      {
        id: 'minimax-m2.5-free',
        name: 'MiniMax M2.5 Free',
        providerId: 'opencode',
        contextWindow: '200k',
        badge: 'Gratuit / Long Ctx',
        description: 'Contexte étendu et raisonnement pour composants complets.',
      },
      {
        id: 'nemotron-3-super-free',
        name: 'Nemotron 3 Super Free',
        providerId: 'opencode',
        contextWindow: '64k',
        badge: 'NVIDIA Free',
        description: 'Modèle NVIDIA haute vitesse pour itérations rapides.',
      },
      {
        id: 'deepseek-v4-flash-free',
        name: 'DeepSeek V4 Flash Free',
        providerId: 'opencode',
        contextWindow: '128k',
        badge: 'DeepSeek Zen',
        description: 'Modèle DeepSeek optimisé via le réseau OpenCode Zen.',
      },
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    type: 'openrouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    enabled: true,
    isCustom: false,
    description: 'Accès universel à plus de 200+ modèles IA en un seul compte et clé API.',
    websiteUrl: 'https://openrouter.ai',
    apiKeyDocsUrl: 'https://openrouter.ai/keys',
    autoFetchSupported: true,
    models: [
      {
        id: 'anthropic/claude-3.7-sonnet',
        name: 'Claude 3.7 Sonnet (OpenRouter)',
        providerId: 'openrouter',
        contextWindow: '200k',
        badge: 'Top Code',
        description: 'Servi via l’infrastructure OpenRouter.',
      },
      {
        id: 'openai/gpt-4o',
        name: 'GPT-4o (OpenRouter)',
        providerId: 'openrouter',
        contextWindow: '128k',
        badge: 'Omni',
      },
      {
        id: 'deepseek/deepseek-r1',
        name: 'DeepSeek R1 (OpenRouter)',
        providerId: 'openrouter',
        contextWindow: '64k',
        badge: 'R1 Reasoning',
      },
    ],
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    type: 'mistral',
    baseUrl: 'https://api.mistral.ai/v1',
    enabled: true,
    isCustom: false,
    description: 'Pionnier européen des modèles IA de pointe (Codestral, Mistral Large).',
    websiteUrl: 'https://mistral.ai',
    apiKeyDocsUrl: 'https://console.mistral.ai/api-keys',
    autoFetchSupported: true,
    models: [
      {
        id: 'codestral-latest',
        name: 'Codestral (Latest)',
        providerId: 'mistral',
        contextWindow: '256k',
        badge: 'Spécial Code',
        description: 'Modèle génératif spécialisé dans 80+ langages dont TypeScript & React.',
      },
      {
        id: 'mistral-large-latest',
        name: 'Mistral Large 2',
        providerId: 'mistral',
        contextWindow: '128k',
        badge: 'Raisonnement',
        description: 'Le modèle flagship de Mistral avec raisonnement multilingue de premier plan.',
      },
      {
        id: 'pixtral-large-latest',
        name: 'Pixtral Large',
        providerId: 'mistral',
        contextWindow: '128k',
        badge: 'Vision & Code',
        description: 'Compréhension avancée des interfaces visuelles et wireframes.',
      },
    ],
  },
  {
    id: 'groq',
    name: 'Groq Cloud',
    type: 'groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    enabled: true,
    isCustom: false,
    description: 'Inférence LPU ultra-rapide avec plusieurs centaines de tokens par seconde.',
    websiteUrl: 'https://groq.com',
    apiKeyDocsUrl: 'https://console.groq.com/keys',
    autoFetchSupported: true,
    models: [
      {
        id: 'llama-3.3-70b-versatile',
        name: 'Llama 3.3 70B Versatile',
        providerId: 'groq',
        contextWindow: '128k',
        badge: 'Vitesse LPU',
        description: 'Modèle open-source de Meta servi à vitesse instantanée.',
      },
      {
        id: 'deepseek-r1-distill-llama-70b',
        name: 'DeepSeek R1 Distill 70B (Groq)',
        providerId: 'groq',
        contextWindow: '128k',
        badge: 'Raisonnement Rapide',
      },
      {
        id: 'mixtral-8x7b-32768',
        name: 'Mixtral 8x7B',
        providerId: 'groq',
        contextWindow: '32k',
        badge: 'MoE',
      },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    type: 'deepseek',
    baseUrl: 'https://api.deepseek.com/v1',
    enabled: true,
    isCustom: false,
    description: 'Modèles de pointe pour le code et le raisonnement (DeepSeek-V3, R1).',
    websiteUrl: 'https://deepseek.com',
    apiKeyDocsUrl: 'https://platform.deepseek.com/api_keys',
    autoFetchSupported: true,
    models: [
      {
        id: 'deepseek-chat',
        name: 'DeepSeek-V3',
        providerId: 'deepseek',
        contextWindow: '64k',
        badge: 'Performant',
        description: 'Modèle polyvalent 671B pour le développement web rapide.',
      },
      {
        id: 'deepseek-reasoner',
        name: 'DeepSeek-R1',
        providerId: 'deepseek',
        contextWindow: '64k',
        badge: 'Raisonnement R1',
        description: 'Raisonnement logique poussé pour la modélisation et l’algorithmie.',
      },
    ],
  },
  {
    id: 'together',
    name: 'Together AI',
    type: 'together',
    baseUrl: 'https://api.together.xyz/v1',
    enabled: true,
    isCustom: false,
    description: 'Plateforme cloud ultra-performante pour les modèles open-source.',
    websiteUrl: 'https://together.ai',
    apiKeyDocsUrl: 'https://api.together.ai/settings/api-keys',
    autoFetchSupported: true,
    models: [
      {
        id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
        name: 'Llama 3.3 70B Turbo',
        providerId: 'together',
        contextWindow: '128k',
        badge: 'Turbo',
      },
      {
        id: 'Qwen/Qwen2.5-Coder-32B-Instruct',
        name: 'Qwen 2.5 Coder 32B',
        providerId: 'together',
        contextWindow: '32k',
        badge: 'Code Expert',
      },
      {
        id: 'deepseek-ai/DeepSeek-R1',
        name: 'DeepSeek R1 (Together)',
        providerId: 'together',
        contextWindow: '64k',
        badge: 'Reasoning',
      },
    ],
  },
  {
    id: 'xai',
    name: 'xAI (Grok)',
    type: 'xai',
    baseUrl: 'https://api.x.ai/v1',
    enabled: true,
    isCustom: false,
    description: 'Modèles Groq par xAI avec capacités d’analyse et vision avancée.',
    websiteUrl: 'https://x.ai',
    apiKeyDocsUrl: 'https://console.x.ai',
    autoFetchSupported: true,
    models: [
      {
        id: 'grok-2-latest',
        name: 'Grok 2 Latest',
        providerId: 'xai',
        contextWindow: '128k',
        badge: 'Flagship',
        description: 'Modèle Grok dernière génération avec raisonnement affûté.',
      },
      {
        id: 'grok-2-vision-1212',
        name: 'Grok 2 Vision',
        providerId: 'xai',
        contextWindow: '128k',
        badge: 'Multimodal',
      },
    ],
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    type: 'perplexity',
    baseUrl: 'https://api.perplexity.ai',
    enabled: true,
    isCustom: false,
    description: 'Modèles Sonar avec recherche web en temps réel intégrée.',
    websiteUrl: 'https://perplexity.ai',
    apiKeyDocsUrl: 'https://perplexity.ai/settings/api',
    autoFetchSupported: true,
    models: [
      {
        id: 'sonar-pro',
        name: 'Sonar Pro',
        providerId: 'perplexity',
        contextWindow: '200k',
        badge: 'Web Grounded',
        description: 'Modèle avec citations temps réel et analyse web.',
      },
      {
        id: 'sonar-reasoning',
        name: 'Sonar Reasoning',
        providerId: 'perplexity',
        contextWindow: '128k',
        badge: 'Raisonnement',
      },
    ],
  },
  {
    id: 'cohere',
    name: 'Cohere',
    type: 'cohere',
    baseUrl: 'https://api.cohere.com/v1',
    enabled: true,
    isCustom: false,
    description: 'Modèles Command R+ optimisés pour les flux de travail entreprise et RAG.',
    websiteUrl: 'https://cohere.com',
    apiKeyDocsUrl: 'https://dashboard.cohere.com/api-keys',
    autoFetchSupported: true,
    models: [
      {
        id: 'command-r-plus',
        name: 'Command R+',
        providerId: 'cohere',
        contextWindow: '128k',
        badge: 'Enterprise',
      },
      {
        id: 'command-r',
        name: 'Command R',
        providerId: 'cohere',
        contextWindow: '128k',
        badge: 'Equilibré',
      },
    ],
  },
  {
    id: 'fireworks',
    name: 'Fireworks AI',
    type: 'fireworks',
    baseUrl: 'https://api.fireworks.ai/inference/v1',
    enabled: true,
    isCustom: false,
    description: 'Moteur d’inférence générative ultra-rapide pour modèles open-source.',
    websiteUrl: 'https://fireworks.ai',
    apiKeyDocsUrl: 'https://fireworks.ai/account/api-keys',
    autoFetchSupported: true,
    models: [
      {
        id: 'accounts/fireworks/models/llama-v3p3-70b-instruct',
        name: 'Llama 3.3 70B (Fireworks)',
        providerId: 'fireworks',
        contextWindow: '128k',
        badge: 'Vitesse Éclair',
      },
      {
        id: 'accounts/fireworks/models/deepseek-r1',
        name: 'DeepSeek R1 (Fireworks)',
        providerId: 'fireworks',
        contextWindow: '64k',
        badge: 'Reasoning',
      },
    ],
  },
  {
    id: 'cerebras',
    name: 'Cerebras Cloud',
    type: 'cerebras',
    baseUrl: 'https://api.cerebras.ai/v1',
    enabled: true,
    isCustom: false,
    description: 'Puce Wafer-Scale Engine offrant jusqu’à 2000 tokens par seconde.',
    websiteUrl: 'https://cerebras.ai',
    apiKeyDocsUrl: 'https://cloud.cerebras.ai',
    autoFetchSupported: true,
    models: [
      {
        id: 'llama3.3-70b',
        name: 'Llama 3.3 70B (Cerebras LPU)',
        providerId: 'cerebras',
        contextWindow: '128k',
        badge: '1800+ tok/s',
      },
      {
        id: 'llama3.1-8b',
        name: 'Llama 3.1 8B (Cerebras Ultra)',
        providerId: 'cerebras',
        contextWindow: '128k',
        badge: 'Instant',
      },
    ],
  },
  {
    id: 'sambanova',
    name: 'SambaNova Cloud',
    type: 'sambanova',
    baseUrl: 'https://api.sambanova.ai/v1',
    enabled: true,
    isCustom: false,
    description: 'Inférence haute densité optimisée sur puces SN40L Reconfigurable Dataflow.',
    websiteUrl: 'https://sambanova.ai',
    apiKeyDocsUrl: 'https://cloud.sambanova.ai/apis',
    autoFetchSupported: true,
    models: [
      {
        id: 'Meta-Llama-3.3-70B-Instruct',
        name: 'Llama 3.3 70B (SambaNova)',
        providerId: 'sambanova',
        contextWindow: '128k',
        badge: 'Dataflow',
      },
      {
        id: 'DeepSeek-R1',
        name: 'DeepSeek R1 (SambaNova)',
        providerId: 'sambanova',
        contextWindow: '64k',
        badge: 'Reasoning Full',
      },
    ],
  },
  {
    id: 'replicate',
    name: 'Replicate',
    type: 'replicate',
    baseUrl: 'https://api.replicate.com/v1',
    enabled: true,
    isCustom: false,
    description: 'Hébergement et exécution de milliers de modèles IA open-source dans le cloud.',
    websiteUrl: 'https://replicate.com',
    apiKeyDocsUrl: 'https://replicate.com/account/api-tokens',
    autoFetchSupported: false,
    models: [
      {
        id: 'meta/meta-llama-3-70b-instruct',
        name: 'Llama 3 70B (Replicate)',
        providerId: 'replicate',
        contextWindow: '8k',
        badge: 'Cloud Host',
      },
    ],
  },
  {
    id: 'huggingface',
    name: 'Hugging Face Inference',
    type: 'huggingface',
    baseUrl: 'https://api-inference.huggingface.co/v1',
    enabled: true,
    isCustom: false,
    description: 'Inférence serverless sur l’écosystème open-source Hugging Face Hub.',
    websiteUrl: 'https://huggingface.co',
    apiKeyDocsUrl: 'https://huggingface.co/settings/tokens',
    autoFetchSupported: true,
    models: [
      {
        id: 'Qwen/Qwen2.5-Coder-32B-Instruct',
        name: 'Qwen 2.5 Coder 32B (HF)',
        providerId: 'huggingface',
        contextWindow: '32k',
        badge: 'HF Hub',
      },
      {
        id: 'meta-llama/Llama-3.3-70B-Instruct',
        name: 'Llama 3.3 70B (HF)',
        providerId: 'huggingface',
        contextWindow: '128k',
        badge: 'HF Hub',
      },
    ],
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    type: 'ollama',
    baseUrl: 'http://localhost:11434/v1',
    enabled: true,
    isCustom: false,
    description: 'Exécutez vos modèles IA en local sans dépendance externe ni frais d’API.',
    websiteUrl: 'https://ollama.ai',
    autoFetchSupported: true,
    models: [
      {
        id: 'qwen2.5-coder:7b',
        name: 'Qwen 2.5 Coder 7B',
        providerId: 'ollama',
        contextWindow: '32k',
        badge: 'Local Code',
        description: 'Spécialisé en génération de code frontend et logique de composants.',
      },
      {
        id: 'llama3.2:latest',
        name: 'Llama 3.2',
        providerId: 'ollama',
        contextWindow: '128k',
        badge: 'Local Léger',
        description: 'Modèle compact pour ordinateurs portables sans GPU dédié.',
      },
    ],
  },
  {
    id: 'lmstudio',
    name: 'LM Studio (Local)',
    type: 'lmstudio',
    baseUrl: 'http://localhost:1234/v1',
    enabled: true,
    isCustom: false,
    description: 'Interface de modèles locaux avec serveur compatible OpenAI prêt à l’emploi.',
    websiteUrl: 'https://lmstudio.ai',
    autoFetchSupported: true,
    models: [
      {
        id: 'local-model',
        name: 'Modèle Chargé dans LM Studio',
        providerId: 'lmstudio',
        contextWindow: 'Auto',
        badge: 'Local',
        description: 'Connecté directement au serveur local LM Studio.',
      },
    ],
  },
];

export const DEFAULT_AGENT_SETTINGS: AIAgentSettings = {
  activeProviderId: 'google',
  activeModelId: 'gemini-3.8-flash',
  temperature: 0.2,
};

const STORAGE_KEY_PROVIDERS = 'opendesign_ai_providers_v3';
const STORAGE_KEY_SETTINGS = 'opendesign_ai_settings_v3';

export function loadStoredProviders(): AIProvider[] {
  if (typeof window === 'undefined') return DEFAULT_AI_PROVIDERS;
  try {
    // Check v3 or v2
    const raw = localStorage.getItem(STORAGE_KEY_PROVIDERS) || localStorage.getItem('opendesign_ai_providers_v2');
    if (!raw) return DEFAULT_AI_PROVIDERS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Merge with default providers so newly added providers always appear
      const storedMap = new Map<string, AIProvider>(parsed.map((p: AIProvider) => [p.id, p]));
      
      const merged: AIProvider[] = DEFAULT_AI_PROVIDERS.map((def) => {
        const stored = storedMap.get(def.id);
        if (stored) {
          return {
            ...def,
            apiKey: stored.apiKey || def.apiKey,
            baseUrl: stored.baseUrl || def.baseUrl,
            enabled: stored.enabled ?? def.enabled,
            // If user has fetched models dynamically, keep them, otherwise keep def
            models: (stored.models && stored.models.length > 0) ? stored.models : def.models,
            lastFetchedAt: stored.lastFetchedAt,
          };
        }
        return def;
      });

      // Add any custom providers user created
      parsed.forEach((p: AIProvider) => {
        if (p.isCustom && !merged.some((m) => m.id === p.id)) {
          merged.push(p);
        }
      });

      return merged;
    }
  } catch (e) {
    console.warn('Failed to parse stored AI providers:', e);
  }
  return DEFAULT_AI_PROVIDERS;
}

export function saveStoredProviders(providers: AIProvider[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PROVIDERS, JSON.stringify(providers));
  } catch (e) {
    console.warn('Failed to save AI providers:', e);
  }
}

export function loadStoredSettings(): AIAgentSettings {
  if (typeof window === 'undefined') return DEFAULT_AGENT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS) || localStorage.getItem('opendesign_ai_settings_v2');
    if (!raw) return DEFAULT_AGENT_SETTINGS;
    const parsed = JSON.parse(raw);
    if (parsed.activeProviderId && parsed.activeModelId) {
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse stored AI settings:', e);
  }
  return DEFAULT_AGENT_SETTINGS;
}

export function saveStoredSettings(settings: AIAgentSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save AI settings:', e);
  }
}
