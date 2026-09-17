export type AIProviderType = 
  | 'gemini'
  | 'openai'
  | 'anthropic'
  | 'openrouter'
  | 'opencode'
  | 'mistral'
  | 'groq'
  | 'deepseek'
  | 'together'
  | 'perplexity'
  | 'xai'
  | 'cohere'
  | 'fireworks'
  | 'cerebras'
  | 'sambanova'
  | 'replicate'
  | 'huggingface'
  | 'ollama'
  | 'lmstudio'
  | 'custom_openai';

export interface AIModel {
  id: string;
  name: string;
  providerId: string;
  contextWindow?: string;
  description?: string;
  isCustom?: boolean;
  badge?: string;
  pricing?: {
    prompt?: string;
    completion?: string;
  };
}

export interface AIProvider {
  id: string;
  name: string;
  type: AIProviderType;
  baseUrl?: string;
  apiKey?: string;
  enabled: boolean;
  isCustom?: boolean;
  description?: string;
  websiteUrl?: string;
  apiKeyDocsUrl?: string;
  models: AIModel[];
  lastFetchedAt?: string;
  autoFetchSupported?: boolean;
  modelsCount?: number;
}

export interface AIAgentSettings {
  activeProviderId: string;
  activeModelId: string;
  temperature?: number;
  systemPrompt?: string;
}

export type AgentStatus = 'idle' | 'preparing' | 'reasoning' | 'generating' | 'applying' | 'completed' | 'error';

export interface AgentStepTrace {
  id: string;
  name: string;
  timestamp: string;
  status: 'pending' | 'running' | 'success' | 'error';
  detail?: string;
  durationMs?: number;
}

export interface AgentErrorRecord {
  id: string;
  timestamp: string;
  provider: string;
  model: string;
  message: string;
  code?: string;
  details?: string;
  suggestedAction?: 'check_api_key' | 'switch_model' | 'retry' | 'local_fallback';
}

export interface AgentExecutionLog {
  id: string;
  prompt: string;
  timestamp: string;
  providerId: string;
  providerName: string;
  modelId: string;
  modelName: string;
  durationMs: number;
  status: 'success' | 'error' | 'fallback';
  summary: string;
  changesCount: number;
  steps: AgentStepTrace[];
  error?: AgentErrorRecord;
}
