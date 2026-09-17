'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Plus, Bot, Check, Trash2, Key, Globe, 
  Sparkles, RefreshCw, Eye, EyeOff, 
  Server, ExternalLink, Zap, Search, Loader2, AlertCircle, CheckCircle2
} from 'lucide-react';
import { AIProvider, AIModel, AIProviderType, AIAgentSettings } from '@/types/ai';

interface AIProvidersModalProps {
  isOpen: boolean;
  onClose: () => void;
  providers: AIProvider[];
  onUpdateProviders: (providers: AIProvider[]) => void;
  settings: AIAgentSettings;
  onUpdateSettings: (settings: AIAgentSettings) => void;
}

type ProviderCategory = 'all' | 'configured' | 'cloud' | 'fast' | 'local';

export const AIProvidersModal: React.FC<AIProvidersModalProps> = ({
  isOpen,
  onClose,
  providers,
  onUpdateProviders,
  settings,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'add_provider' | 'add_model'>('overview');
  const [selectedProviderIdForModel, setSelectedProviderIdForModel] = useState<string>(settings.activeProviderId);
  const [visibleKeyProviderId, setVisibleKeyProviderId] = useState<string | null>(null);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProviderCategory>('all');

  // Auto-fetch state
  const [loadingModelsByProvider, setLoadingModelsByProvider] = useState<Record<string, boolean>>({});
  const [fetchStatusByProvider, setFetchStatusByProvider] = useState<Record<string, { type: 'success' | 'error'; message: string }>>({});
  const debounceTimersRef = useRef<Record<string, NodeJS.Timeout>>({});

  // New Provider Form State
  const [newProviderName, setNewProviderName] = useState('');
  const [newProviderType, setNewProviderType] = useState<AIProviderType>('custom_openai');
  const [newProviderBaseUrl, setNewProviderBaseUrl] = useState('');
  const [newProviderApiKey, setNewProviderApiKey] = useState('');
  const [newProviderInitialModelId, setNewProviderInitialModelId] = useState('');
  const [newProviderInitialModelName, setNewProviderInitialModelName] = useState('');

  // New Model Form State
  const [newModelId, setNewModelId] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [newModelContext, setNewModelContext] = useState('128k');
  const [newModelBadge, setNewModelBadge] = useState('Custom');
  const [newModelDesc, setNewModelDesc] = useState('');
  const [setNewModelAsActive, setSetNewModelAsActive] = useState(true);

  // Clean up debounce timers on unmount
  useEffect(() => {
    const timers = debounceTimersRef.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  if (!isOpen) return null;

  // Helpers
  const activeProvider = providers.find((p) => p.id === settings.activeProviderId) || providers[0];
  const activeModel = activeProvider?.models.find((m) => m.id === settings.activeModelId) || activeProvider?.models[0];

  const handleSelectActiveModel = (providerId: string, modelId: string) => {
    onUpdateSettings({
      ...settings,
      activeProviderId: providerId,
      activeModelId: modelId,
    });
  };

  // Fetch models automatically via API endpoint
  const handleFetchModels = async (targetProvider: AIProvider, explicitKey?: string) => {
    const keyToUse = explicitKey !== undefined ? explicitKey : (targetProvider.apiKey || '');
    
    // For cloud providers (except Gemini which has server env fallback, and Ollama/LM Studio which are local), require key
    if (!keyToUse && !['gemini', 'ollama', 'lmstudio', 'openrouter'].includes(targetProvider.type)) {
      setFetchStatusByProvider((prev) => ({
        ...prev,
        [targetProvider.id]: {
          type: 'error',
          message: 'Veuillez renseigner votre clé API pour charger les modèles.',
        },
      }));
      return;
    }

    setLoadingModelsByProvider((prev) => ({ ...prev, [targetProvider.id]: true }));
    setFetchStatusByProvider((prev) => {
      const next = { ...prev };
      delete next[targetProvider.id];
      return next;
    });

    try {
      const res = await fetch('/api/agent/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: targetProvider.id,
          providerType: targetProvider.type,
          baseUrl: targetProvider.baseUrl,
          apiKey: keyToUse,
        }),
      });

      let data: any = null;
      const rawText = await res.text();
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(`Réponse inattendue du serveur (${res.status})`);
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || `Erreur serveur (${res.status})`);
      }

      const fetchedModels: AIModel[] = data.models || [];
      if (fetchedModels.length === 0) {
        throw new Error('Aucun modèle retourné par le provider.');
      }

      // Preserve custom models added manually by the user
      const customExisting = targetProvider.models.filter((m) => m.isCustom);
      const mergedModels = [
        ...fetchedModels,
        ...customExisting.filter((c) => !fetchedModels.some((f) => f.id === c.id)),
      ];

      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Update provider in list
      const updated = providers.map((p) => {
        if (p.id === targetProvider.id) {
          return {
            ...p,
            apiKey: keyToUse || p.apiKey,
            models: mergedModels,
            lastFetchedAt: nowStr,
            modelsCount: mergedModels.length,
          };
        }
        return p;
      });

      onUpdateProviders(updated);

      // If this provider is currently active, ensure activeModelId exists in the new list
      if (settings.activeProviderId === targetProvider.id) {
        const stillExists = mergedModels.some((m) => m.id === settings.activeModelId);
        if (!stillExists && mergedModels.length > 0) {
          onUpdateSettings({
            ...settings,
            activeModelId: mergedModels[0].id,
          });
        }
      }

      setFetchStatusByProvider((prev) => ({
        ...prev,
        [targetProvider.id]: {
          type: 'success',
          message: `${mergedModels.length} modèles chargés avec succès !`,
        },
      }));
    } catch (err: any) {
      setFetchStatusByProvider((prev) => ({
        ...prev,
        [targetProvider.id]: {
          type: 'error',
          message: err.message || 'Échec de la récupération des modèles.',
        },
      }));
    } finally {
      setLoadingModelsByProvider((prev) => ({ ...prev, [targetProvider.id]: false }));
    }
  };

  // Triggered when user edits the API key
  const handleUpdateApiKey = (provider: AIProvider, newKey: string) => {
    // 1. Update key immediately in state
    const updated = providers.map((p) => {
      if (p.id === provider.id) {
        return { ...p, apiKey: newKey };
      }
      return p;
    });
    onUpdateProviders(updated);

    // 2. Clear existing debounce timer for this provider
    if (debounceTimersRef.current[provider.id]) {
      clearTimeout(debounceTimersRef.current[provider.id]);
    }

    // 3. Clear previous status
    setFetchStatusByProvider((prev) => {
      const copy = { ...prev };
      delete copy[provider.id];
      return copy;
    });

    // 4. Auto-fetch models when a valid key is entered / pasted
    const trimmed = newKey.trim();
    if (trimmed.length > 8) {
      // If user pasted a full key (>20 chars), fetch almost immediately (300ms), otherwise wait 700ms debounce
      const delay = trimmed.length > 20 ? 300 : 700;
      debounceTimersRef.current[provider.id] = setTimeout(() => {
        handleFetchModels(provider, trimmed);
      }, delay);
    }
  };

  const handleDeleteProvider = (providerId: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce provider ?')) {
      const updated = providers.filter((p) => p.id !== providerId);
      onUpdateProviders(updated);
      if (settings.activeProviderId === providerId && updated.length > 0) {
        onUpdateSettings({
          ...settings,
          activeProviderId: updated[0].id,
          activeModelId: updated[0].models[0]?.id || '',
        });
      }
    }
  };

  const handleDeleteModel = (providerId: string, modelId: string) => {
    const updated = providers.map((p) => {
      if (p.id === providerId) {
        return {
          ...p,
          models: p.models.filter((m) => m.id !== modelId),
        };
      }
      return p;
    });
    onUpdateProviders(updated);
    if (settings.activeModelId === modelId) {
      const fallbackProvider = updated.find((p) => p.id === providerId);
      if (fallbackProvider && fallbackProvider.models.length > 0) {
        onUpdateSettings({
          ...settings,
          activeModelId: fallbackProvider.models[0].id,
        });
      }
    }
  };

  // Submit New Provider
  const handleCreateProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProviderName.trim()) return;

    const providerId = `custom-${Date.now()}`;
    const initialModels: AIModel[] = [];

    if (newProviderInitialModelId.trim()) {
      initialModels.push({
        id: newProviderInitialModelId.trim(),
        name: newProviderInitialModelName.trim() || newProviderInitialModelId.trim(),
        providerId,
        contextWindow: '128k',
        badge: 'Modèle Custom',
        isCustom: true,
      });
    }

    const newProvider: AIProvider = {
      id: providerId,
      name: newProviderName.trim(),
      type: newProviderType,
      baseUrl: newProviderBaseUrl.trim() || undefined,
      apiKey: newProviderApiKey.trim() || undefined,
      enabled: true,
      isCustom: true,
      autoFetchSupported: true,
      description: 'Provider personnalisé connecté via API.',
      models: initialModels,
    };

    const updated = [...providers, newProvider];
    onUpdateProviders(updated);

    if (initialModels.length > 0) {
      onUpdateSettings({
        ...settings,
        activeProviderId: providerId,
        activeModelId: initialModels[0].id,
      });
    }

    // Auto-fetch if key provided
    if (newProvider.apiKey) {
      handleFetchModels(newProvider, newProvider.apiKey);
    }

    // Reset Form
    setNewProviderName('');
    setNewProviderBaseUrl('');
    setNewProviderApiKey('');
    setNewProviderInitialModelId('');
    setNewProviderInitialModelName('');
    setActiveTab('overview');
  };

  // Submit New Model
  const handleCreateModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelId.trim()) return;

    const newModel: AIModel = {
      id: newModelId.trim(),
      name: newModelName.trim() || newModelId.trim(),
      providerId: selectedProviderIdForModel,
      contextWindow: newModelContext.trim() || '128k',
      badge: newModelBadge.trim() || 'Personnalisé',
      description: newModelDesc.trim() || undefined,
      isCustom: true,
    };

    const updated = providers.map((p) => {
      if (p.id === selectedProviderIdForModel) {
        return {
          ...p,
          models: [...p.models, newModel],
        };
      }
      return p;
    });

    onUpdateProviders(updated);

    if (setNewModelAsActive) {
      onUpdateSettings({
        ...settings,
        activeProviderId: selectedProviderIdForModel,
        activeModelId: newModel.id,
      });
    }

    // Reset Form
    setNewModelId('');
    setNewModelName('');
    setNewModelDesc('');
    setActiveTab('overview');
  };

  // Preset quick templates
  const applyPreset = (name: string, type: AIProviderType, baseUrl: string, modelId: string, modelName: string) => {
    setNewProviderName(name);
    setNewProviderType(type);
    setNewProviderBaseUrl(baseUrl);
    setNewProviderInitialModelId(modelId);
    setNewProviderInitialModelName(modelName);
  };

  // Filtering providers
  const filteredProviders = providers.filter((p) => {
    // Category match
    if (selectedCategory === 'configured') {
      if (!p.apiKey && !['gemini', 'ollama', 'lmstudio'].includes(p.type)) return false;
    } else if (selectedCategory === 'cloud') {
      if (!['gemini', 'openai', 'anthropic', 'mistral', 'deepseek', 'xai', 'cohere'].includes(p.type)) return false;
    } else if (selectedCategory === 'fast') {
      if (!['groq', 'cerebras', 'sambanova', 'fireworks', 'together'].includes(p.type)) return false;
    } else if (selectedCategory === 'local') {
      if (!['ollama', 'lmstudio'].includes(p.type)) return false;
    }

    // Search query match (search by provider name or by model name/id)
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesProvider = p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q);
    const matchesModel = p.models.some((m) => m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q));
    return matchesProvider || matchesModel;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] bg-[#0c101c] border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#080c16]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">Tous les Fournisseurs & Modèles IA du Marché</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  Auto-fetch API Actif
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Collez votre clé API : tous les modèles du provider sont automatiquement interrogés et synchronisés.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between px-6 py-2.5 border-b border-white/10 bg-[#090d18] text-xs gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Fournisseurs ({providers.length})
            </button>
            <button
              onClick={() => setActiveTab('add_provider')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'add_provider'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Nouveau Provider</span>
            </button>
            <button
              onClick={() => setActiveTab('add_model')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'add_model'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-purple-400" />
              <span>Nouveau Modèle</span>
            </button>
          </div>

          {/* Active Model Pill */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-[11px]">
            <span className="text-slate-400">Modèle Actif :</span>
            <span className="font-semibold text-indigo-300 flex items-center gap-1 font-mono">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              {activeModel?.name || 'Gemini 3.8 Flash'}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Active Model Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-[#0c101c] border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">Moteur d&apos;inférence actuel</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                        Prêt pour les prompts
                      </span>
                    </div>
                    <div className="text-sm font-bold text-indigo-200 mt-0.5">
                      {activeProvider?.name} &mdash; {activeModel?.name}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {activeModel?.description || 'Modèle actif pour générer et retoucher instantanément le site.'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('add_model')}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Ajouter un modèle</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('add_provider')}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter un provider</span>
                  </button>
                </div>
              </div>

              {/* Search & Category Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#080b15] p-3 rounded-xl border border-white/10">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrer un provider ou modèle (ex: Claude 3.7, Mistral, Groq, Llama, DeepSeek, R1...)"
                    className="w-full pl-9 pr-4 py-1.5 bg-[#0c101c] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-[11px]">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Tous ({providers.length})
                  </button>
                  <button
                    onClick={() => setSelectedCategory('configured')}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                      selectedCategory === 'configured'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Avec Clé API
                  </button>
                  <button
                    onClick={() => setSelectedCategory('cloud')}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                      selectedCategory === 'cloud'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Cloud Majeurs
                  </button>
                  <button
                    onClick={() => setSelectedCategory('fast')}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                      selectedCategory === 'fast'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Vitesse & LPU
                  </button>
                  <button
                    onClick={() => setSelectedCategory('local')}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                      selectedCategory === 'local'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Locaux (Ollama/LM)
                  </button>
                </div>
              </div>

              {/* Providers List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
                  <span>{filteredProviders.length} FOURNISSEURS DISPONIBLES</span>
                  <span className="text-[11px]">Saisie de clé &rarr; synchronisation automatique en direct</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {filteredProviders.map((provider) => {
                    const isCurrentProviderActive = settings.activeProviderId === provider.id;
                    const isKeyVisible = visibleKeyProviderId === provider.id;
                    const isLoadingThis = loadingModelsByProvider[provider.id] || false;
                    const statusInfo = fetchStatusByProvider[provider.id];

                    return (
                      <div
                        key={provider.id}
                        className={`rounded-2xl p-5 border transition-all ${
                          isCurrentProviderActive
                            ? 'bg-[#0f1424] border-indigo-500/50 shadow-xl shadow-indigo-500/5 ring-1 ring-indigo-500/20'
                            : 'bg-[#0a0e18] border-white/10 hover:border-white/20'
                        }`}
                      >
                        {/* Provider Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-inner ${
                              isCurrentProviderActive 
                                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/20' 
                                : 'bg-white/5 border border-white/10 text-slate-300'
                            }`}>
                              {provider.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-white">{provider.name}</h4>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-slate-400 font-mono border border-white/5">
                                  {provider.type}
                                </span>
                                {provider.isCustom && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-medium">
                                    Custom
                                  </span>
                                )}
                                {provider.apiKeyDocsUrl && (
                                  <a
                                    href={provider.apiKeyDocsUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 underline decoration-indigo-500/40"
                                  >
                                    <span>Obtenir une clé</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">{provider.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            {/* Auto-Fetch / Refresh Button */}
                            <button
                              onClick={() => handleFetchModels(provider)}
                              disabled={isLoadingThis}
                              title="Interroger l'API pour récupérer tous les modèles à jour"
                              className={`px-3 py-1.5 rounded-xl border text-[11px] font-medium flex items-center gap-1.5 transition-all ${
                                isLoadingThis
                                  ? 'bg-indigo-600/30 border-indigo-500/40 text-indigo-300'
                                  : 'bg-white/5 hover:bg-indigo-600/20 text-slate-200 hover:text-white border-white/10 hover:border-indigo-500/30'
                              }`}
                            >
                              {isLoadingThis ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                                  <span>Chargement...</span>
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>Actualiser modèles</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => {
                                setSelectedProviderIdForModel(provider.id);
                                setActiveTab('add_model');
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-[11px] font-medium flex items-center gap-1 transition-all"
                            >
                              <Plus className="w-3 h-3 text-purple-400" />
                              <span className="hidden sm:inline">Ajouter manuel</span>
                            </button>

                            {provider.isCustom && (
                              <button
                                onClick={() => handleDeleteProvider(provider.id)}
                                title="Supprimer ce provider"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Provider Settings (API Key with Instant Auto-Fetch) */}
                        <div className="py-3 flex flex-col gap-2 text-xs border-b border-white/5">
                          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                            {provider.baseUrl && (
                              <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] truncate shrink-0">
                                <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                <span className="truncate max-w-[220px]">{provider.baseUrl}</span>
                              </div>
                            )}

                            {provider.type !== 'ollama' && provider.type !== 'lmstudio' && (
                              <div className="flex-1 flex items-center gap-2 bg-[#060810] border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-indigo-500/60 transition-colors">
                                <Key className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                <span className="text-slate-400 shrink-0 text-[11px]">Clé API :</span>
                                <input
                                  type={isKeyVisible ? 'text' : 'password'}
                                  value={provider.apiKey || ''}
                                  onChange={(e) => handleUpdateApiKey(provider, e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleFetchModels(provider, (e.target as HTMLInputElement).value);
                                    }
                                  }}
                                  placeholder={
                                    provider.type === 'gemini'
                                      ? 'GEMINI_API_KEY active par défaut. Collez une clé personnalisée pour synchroniser...'
                                      : 'Collez votre clé API (auto-chargement immédiat)...'
                                  }
                                  className="flex-1 bg-transparent text-xs text-white placeholder-slate-600 outline-none font-mono"
                                />
                                <button
                                  type="button"
                                  onClick={() => setVisibleKeyProviderId(isKeyVisible ? null : provider.id)}
                                  className="text-slate-500 hover:text-slate-300"
                                >
                                  {isKeyVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            )}

                            {/* Local notice for Ollama / LM Studio */}
                            {(provider.type === 'ollama' || provider.type === 'lmstudio') && (
                              <div className="flex-1 flex items-center justify-between bg-[#060810] border border-white/10 rounded-xl px-3 py-1.5 text-[11px] text-slate-400">
                                <span>Serveur local sans clé requise (port standard)</span>
                                <button
                                  onClick={() => handleFetchModels(provider)}
                                  className="text-indigo-400 hover:text-white font-medium flex items-center gap-1"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                  <span>Scanner modèles locaux</span>
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Auto-Fetch Status Feedback Message */}
                          {statusInfo && (
                            <div className={`flex items-center gap-2 text-xs px-2.5 py-1 rounded-lg ${
                              statusInfo.type === 'success' 
                                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' 
                                : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                            }`}>
                              {statusInfo.type === 'success' ? (
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                              ) : (
                                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                              )}
                              <span>{statusInfo.message}</span>
                            </div>
                          )}
                        </div>

                        {/* Models Grid for this Provider */}
                        <div className="mt-3">
                          <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>Modèles disponibles ({provider.models.length})</span>
                              {provider.lastFetchedAt && (
                                <span className="text-[10px] text-slate-500 font-mono">
                                  &bull; synchro à {provider.lastFetchedAt}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500">Cliquez pour activer</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                            {provider.models.map((model) => {
                              const isSelected = settings.activeProviderId === provider.id && settings.activeModelId === model.id;

                              return (
                                <div
                                  key={model.id}
                                  onClick={() => handleSelectActiveModel(provider.id, model.id)}
                                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                                    isSelected
                                      ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500 text-white shadow-md shadow-indigo-600/20'
                                      : 'bg-[#080b14] border-white/5 hover:border-white/20 text-slate-300 hover:bg-white/5'
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-center justify-between gap-1 mb-1">
                                      <span className="font-semibold text-xs text-white truncate" title={model.name}>
                                        {model.name}
                                      </span>
                                      {isSelected ? (
                                        <span className="p-0.5 rounded-full bg-indigo-500 text-white shrink-0">
                                          <Check className="w-3 h-3" />
                                        </span>
                                      ) : null}
                                    </div>
                                    <div className="font-mono text-[10px] text-slate-400 truncate mb-1" title={model.id}>
                                      {model.id}
                                    </div>
                                    {model.description && (
                                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                                        {model.description}
                                      </p>
                                    )}
                                  </div>

                                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                                    {model.badge ? (
                                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-indigo-300 font-medium border border-white/5">
                                        {model.badge}
                                      </span>
                                    ) : (
                                      <span className="text-slate-500">{model.contextWindow || '128k'}</span>
                                    )}

                                    <div className="flex items-center gap-1.5">
                                      {model.isCustom && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteModel(provider.id, model.id);
                                          }}
                                          title="Supprimer ce modèle"
                                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      )}
                                      <span className={`text-[10px] font-medium ${isSelected ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}>
                                        {isSelected ? 'Actif' : 'Activer'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADD NEW PROVIDER */}
          {activeTab === 'add_provider' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-white">Ajouter un nouveau Fournisseur IA</h3>
                <p className="text-xs text-slate-400">
                  Connectez n&apos;importe quelle API compatible OpenAI, Ollama local, ou service cloud externe.
                </p>
              </div>

              {/* Quick Presets */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Modèles pré-configurés en 1 clic :
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyPreset('OpenCode Zen', 'opencode', 'https://opencode.ai/zen/v1', 'zen-default', 'OpenCode Zen Default')}
                    className="px-2.5 py-1 rounded-lg bg-[#141926] hover:bg-indigo-600/30 border border-white/10 text-xs text-slate-200 hover:text-white transition-all flex items-center gap-1.5"
                  >
                    <Zap className="w-3 h-3 text-cyan-400" />
                    <span>OpenCode Zen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('OpenRouter', 'openrouter', 'https://openrouter.ai/api/v1', 'anthropic/claude-3.7-sonnet', 'Claude 3.7 Sonnet (OpenRouter)')}
                    className="px-2.5 py-1 rounded-lg bg-[#141926] hover:bg-indigo-600/30 border border-white/10 text-xs text-slate-200 hover:text-white transition-all flex items-center gap-1.5"
                  >
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>OpenRouter</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('Mistral AI', 'mistral', 'https://api.mistral.ai/v1', 'codestral-latest', 'Codestral (Latest)')}
                    className="px-2.5 py-1 rounded-lg bg-[#141926] hover:bg-indigo-600/30 border border-white/10 text-xs text-slate-200 hover:text-white transition-all flex items-center gap-1.5"
                  >
                    <Zap className="w-3 h-3 text-orange-400" />
                    <span>Mistral AI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('Together AI', 'together', 'https://api.together.xyz/v1', 'meta-llama/Llama-3.3-70B-Instruct-Turbo', 'Llama 3.3 70B Turbo')}
                    className="px-2.5 py-1 rounded-lg bg-[#141926] hover:bg-indigo-600/30 border border-white/10 text-xs text-slate-200 hover:text-white transition-all flex items-center gap-1.5"
                  >
                    <Zap className="w-3 h-3 text-indigo-400" />
                    <span>Together AI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('LM Studio (Local)', 'lmstudio', 'http://localhost:1234/v1', 'local-model', 'LM Studio Local')}
                    className="px-2.5 py-1 rounded-lg bg-[#141926] hover:bg-indigo-600/30 border border-white/10 text-xs text-slate-200 hover:text-white transition-all flex items-center gap-1.5"
                  >
                    <Server className="w-3 h-3 text-emerald-400" />
                    <span>LM Studio Local</span>
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateProvider} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nom du Provider <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newProviderName}
                    onChange={(e) => setNewProviderName(e.target.value)}
                    placeholder="ex: Mon Serveur d'Inférence, Together AI, vLLM Local..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080b14] border border-white/15 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Type de protocole / format
                    </label>
                    <select
                      value={newProviderType}
                      onChange={(e) => setNewProviderType(e.target.value as AIProviderType)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#080b14] border border-white/15 text-xs text-white outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="custom_openai">OpenAI Compatible (Standard)</option>
                      <option value="opencode">OpenCode Zen / Go API</option>
                      <option value="openrouter">OpenRouter API</option>
                      <option value="mistral">Mistral AI</option>
                      <option value="together">Together AI</option>
                      <option value="groq">Groq Cloud</option>
                      <option value="deepseek">DeepSeek</option>
                      <option value="ollama">Ollama / Serveur Local</option>
                      <option value="lmstudio">LM Studio Local</option>
                      <option value="anthropic">Anthropic Claude</option>
                      <option value="gemini">Google Gemini</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      URL de base / Endpoint (Base URL)
                    </label>
                    <input
                      type="url"
                      value={newProviderBaseUrl}
                      onChange={(e) => setNewProviderBaseUrl(e.target.value)}
                      placeholder="https://api.monservice.com/v1"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#080b14] border border-white/15 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 font-mono transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Clé API (Optionnelle, stockée localement dans votre navigateur)
                  </label>
                  <input
                    type="password"
                    value={newProviderApiKey}
                    onChange={(e) => setNewProviderApiKey(e.target.value)}
                    placeholder="sk-... (les modèles seront scannés dès l'enregistrement)"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080b14] border border-white/15 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 font-mono transition-colors"
                  />
                </div>

                {/* Optional Initial Model */}
                <div className="p-4 rounded-xl bg-[#080b14] border border-white/10 space-y-3">
                  <span className="text-xs font-semibold text-slate-300">Modèle initial à déclarer (optionnel) :</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">ID du modèle (ex: mistral-large)</label>
                      <input
                        type="text"
                        value={newProviderInitialModelId}
                        onChange={(e) => setNewProviderInitialModelId(e.target.value)}
                        placeholder="nom-identifiant-du-modele"
                        className="w-full px-3 py-1.5 rounded-lg bg-[#0c101c] border border-white/10 text-xs text-white placeholder-slate-500 font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Nom d&apos;affichage (ex: Mistral Large)</label>
                      <input
                        type="text"
                        value={newProviderInitialModelName}
                        onChange={(e) => setNewProviderInitialModelName(e.target.value)}
                        placeholder="Nom convivial"
                        className="w-full px-3 py-1.5 rounded-lg bg-[#0c101c] border border-white/10 text-xs text-white placeholder-slate-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Enregistrer le Provider
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: ADD NEW MODEL */}
          {activeTab === 'add_model' && (
            <div className="max-w-xl mx-auto space-y-6 animate-in fade-in">
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-white">Ajouter un Modèle à un Fournisseur</h3>
                <p className="text-xs text-slate-400">
                  Déclarez un identifiant de modèle personnalisé (ex: gpt-4.5, claude-3-7-sonnet, deepseek-r1, llama-3.3).
                </p>
              </div>

              <form onSubmit={handleCreateModel} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Sélectionnez le Provider parent <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={selectedProviderIdForModel}
                    onChange={(e) => setSelectedProviderIdForModel(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080b14] border border-white/15 text-xs text-white outline-none focus:border-indigo-500 transition-colors"
                  >
                    {providers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Identifiant exact du modèle (Model ID) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newModelId}
                    onChange={(e) => setNewModelId(e.target.value)}
                    placeholder="ex: claude-3-7-sonnet-20250219, gpt-4.5-preview, codestral-latest"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080b14] border border-white/15 text-xs text-white placeholder-slate-500 font-mono outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nom affiché dans l&apos;interface
                    </label>
                    <input
                      type="text"
                      value={newModelName}
                      onChange={(e) => setNewModelName(e.target.value)}
                      placeholder="ex: Claude 3.7 Sonnet (Thinking)"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#080b14] border border-white/15 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Badge / Tag visuel
                    </label>
                    <input
                      type="text"
                      value={newModelBadge}
                      onChange={(e) => setNewModelBadge(e.target.value)}
                      placeholder="ex: Raisonnement, Code Pro, Ultra-rapide"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#080b14] border border-white/15 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Description ou spécialité
                  </label>
                  <textarea
                    value={newModelDesc}
                    onChange={(e) => setNewModelDesc(e.target.value)}
                    placeholder="ex: Modèle haute précision pour l'architecture des composants et styles Tailwind."
                    rows={2}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080b14] border border-white/15 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 resize-none transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="set-active-checkbox"
                    checked={setNewModelAsActive}
                    onChange={(e) => setSetNewModelAsActive(e.target.checked)}
                    className="rounded border-white/20 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="set-active-checkbox" className="text-xs text-slate-300 cursor-pointer">
                    Définir immédiatement comme modèle actif de l&apos;agent
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Ajouter le Modèle
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
