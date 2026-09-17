'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Sparkles, Send, Loader2, AlertCircle, 
  CheckCircle2, ChevronDown, ChevronRight, X, 
  Settings, RefreshCw, Key, ArrowRight, 
  Check, Layers, Cpu, ShieldAlert, 
  History, Terminal, Eye, ExternalLink, CornerDownLeft, Search
} from 'lucide-react';
import { AIProvider, AIModel, AgentStepTrace, AgentErrorRecord, AgentExecutionLog } from '@/types/ai';
import { AIDiffProposal } from '@/types/builder';

interface LeftPromptPanelProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  onSendPrompt: (promptText: string) => Promise<void>;
  isLoading: boolean;
  providers: AIProvider[];
  activeProviderId: string;
  activeModelId: string;
  onSelectModel: (providerId: string, modelId: string) => void;
  onOpenModelSettings: () => void;
  latestProposal?: AIDiffProposal | null;
  latestError?: AgentErrorRecord | null;
  executionLogs: AgentExecutionLog[];
  onClearLogs?: () => void;
  width?: number;
}

export const LeftPromptPanel: React.FC<LeftPromptPanelProps> = ({
  isOpen,
  onToggleOpen,
  onSendPrompt,
  isLoading,
  providers,
  activeProviderId,
  activeModelId,
  onSelectModel,
  onOpenModelSettings,
  latestProposal,
  latestError,
  executionLogs,
  onClearLogs,
  width,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [activeTab, setActiveTab] = useState<'working' | 'errors' | 'history'>('working');
  const [lastErrorSeen, setLastErrorSeen] = useState<string | null>(null);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [modelSearchQuery, setModelSearchQuery] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // If a new error happens, switch automatically to errors tab during render
  if (latestError && latestError.id !== lastErrorSeen) {
    setLastErrorSeen(latestError.id);
    setActiveTab('errors');
  }

  // Active Provider and Model
  const activeProvider = providers.find((p) => p.id === activeProviderId) || providers[0];
  const activeModel = activeProvider?.models.find((m) => m.id === activeModelId) || activeProvider?.models[0];

  // Track elapsed time during prompt execution
  useEffect(() => {
    if (isLoading) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 100) / 10);
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLoading]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsModelDropdownOpen(false);
        setModelSearchQuery('');
      }
    };
    if (isModelDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isModelDropdownOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptInput.trim() || isLoading) return;
    const text = promptInput.trim();
    setPromptInput('');
    setActiveTab('working');
    onSendPrompt(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const promptPresets = [
    { label: 'Dark Cyberpunk', text: 'Passe tout le site en mode dark cyberpunk avec des bordures néon et des ombres douces.' },
    { label: '+ Torus 3D WebGL', text: 'Ajoute un élément 3D spatial avec géométrie Torus Knot réactive et shader vibrant.' },
    { label: '+ Grille Tarifaire', text: 'Ajoute une grille de tarifs moderne avec 3 forfaits et un badge Pro Studio populaire.' },
    { label: 'Titres Percutants', text: 'Reformule les titres pour une startup SaaS ultra haut de gamme avec CTA percutants.' },
  ];

  // Collapsed Minimal Rail (hidden on mobile/tablet, only shown on desktop lg:)
  if (!isOpen) {
    return (
      <aside className="hidden lg:flex w-12 h-screen bg-[#080b14] border-r border-white/10 flex-col items-center py-4 justify-between z-30 shrink-0 transition-all select-none">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onToggleOpen}
            title="Déplier le panneau de prompt et du modèle"
            className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 hover:scale-105 transition-all"
          >
            <Bot className="w-4 h-4" />
          </button>

          <div className="w-6 h-[1px] bg-white/10" />

          <button
            onClick={onToggleOpen}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Ouvrir la console"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {latestError && (
            <button
              onClick={() => {
                onToggleOpen();
                setActiveTab('errors');
              }}
              className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse"
              title="Erreur détectée"
            >
              <AlertCircle className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={onToggleOpen}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title="Développer le panneau"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </aside>
    );
  }

  return (
    <aside 
      style={{ width: width ? `${width}px` : undefined }}
      className="fixed lg:relative inset-y-0 left-0 w-[90vw] sm:w-[410px] lg:w-[430px] max-w-[95vw] h-full lg:h-screen bg-[#070a13] border-r border-white/10 flex flex-col z-50 lg:z-30 shrink-0 select-none transition-[width] duration-75 shadow-2xl"
    >
      {/* 1. HEADER: Model Selector & Settings */}
      <div className="px-4 py-3 border-b border-white/10 bg-[#080c16] flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-wide">Console Agent IA</span>
                <span className={`w-2 h-2 rounded-full ${
                  isLoading 
                    ? 'bg-amber-400 animate-ping' 
                    : latestError 
                    ? 'bg-rose-500' 
                    : 'bg-emerald-400'
                }`} />
              </div>
              <span className="text-[10px] text-slate-400 block -mt-0.5">
                {isLoading 
                  ? `Inférence en cours (${elapsedTime}s)...` 
                  : latestError 
                  ? 'Attention requise' 
                  : 'Prêt pour les instructions'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onOpenModelSettings}
              title="Gérer les clés API et les providers"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all text-xs flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onToggleOpen}
              title="Réduire le panneau latéral"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Model Selector Button & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#0d1222] hover:bg-[#12182c] border border-white/10 hover:border-indigo-500/40 text-left transition-all"
          >
            <div className="flex items-center gap-2 truncate" suppressHydrationWarning>
              <div 
                suppressHydrationWarning
                className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px] font-bold font-mono"
              >
                {activeProvider?.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                  <span>{activeModel?.name || 'Gemini 3.8 Flash'}</span>
                  {activeModel?.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-normal">
                      {activeModel.badge}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 truncate font-mono">
                  {activeProvider?.name} &bull; {activeModel?.contextWindow || '128k'}
                </div>
              </div>
            </div>

            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu with Search */}
          {isModelDropdownOpen && (
            <div className="absolute top-12 left-0 right-0 z-50 bg-[#0a0e1a] border border-white/15 rounded-2xl shadow-2xl p-2.5 backdrop-blur-2xl animate-in fade-in flex flex-col space-y-2 max-h-80">
              <div className="px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center justify-between border-b border-white/5 pb-1.5">
                <span>Changer de Modèle</span>
                <span className="text-indigo-400">{providers.length} Fournisseurs</span>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={modelSearchQuery}
                  onChange={(e) => setModelSearchQuery(e.target.value)}
                  placeholder="Chercher (Claude, GPT, Mistral, Flash, R1...)"
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-[#070910] border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
                  autoFocus
                />
              </div>

              {/* Providers & Models List */}
              <div className="space-y-2 overflow-y-auto pr-0.5 max-h-48 scrollbar-thin">
                {providers.map((provider) => {
                  const q = modelSearchQuery.trim().toLowerCase();
                  const matchingModels = q
                    ? provider.models.filter(
                        (m) =>
                          m.name.toLowerCase().includes(q) ||
                          m.id.toLowerCase().includes(q) ||
                          provider.name.toLowerCase().includes(q)
                      )
                    : provider.models;

                  if (matchingModels.length === 0) return null;

                  return (
                    <div key={provider.id} className="space-y-1">
                      <div className="text-[10px] font-semibold text-slate-400 px-2 pt-1 flex items-center justify-between">
                        <span>{provider.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono">
                          {matchingModels.length} modèle{matchingModels.length > 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        {matchingModels.map((model) => {
                          const isSelected = activeProviderId === provider.id && activeModelId === model.id;

                          return (
                            <button
                              key={model.id}
                              type="button"
                              onClick={() => {
                                onSelectModel(provider.id, model.id);
                                setIsModelDropdownOpen(false);
                                setModelSearchQuery('');
                              }}
                              className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                                isSelected
                                  ? 'bg-indigo-600 text-white font-medium'
                                  : 'text-slate-300 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <div className="truncate pr-2">
                                <div className="truncate font-medium">{model.name}</div>
                                <div className={`text-[10px] truncate font-mono ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                                  {model.id}
                                </div>
                              </div>
                              {isSelected ? (
                                <Check className="w-3.5 h-3.5 shrink-0" />
                              ) : model.badge ? (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 shrink-0">
                                  {model.badge}
                                </span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Manage All Providers */}
              <div className="pt-1 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setIsModelDropdownOpen(false);
                    setModelSearchQuery('');
                    onOpenModelSettings();
                  }}
                  className="w-full py-1.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Key className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Gérer tous les Providers & Clés API</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 pt-1 text-xs">
          <button
            onClick={() => setActiveTab('working')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'working'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Fonctionnement</span>
          </button>
          <button
            onClick={() => setActiveTab('errors')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all relative ${
              activeTab === 'errors'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Erreurs</span>
            {latestError && (
              <span className="w-2 h-2 rounded-full bg-rose-400 absolute top-1 right-1 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-1.5 px-2.5 rounded-lg font-medium flex items-center justify-center gap-1 transition-all ${
              activeTab === 'history'
                ? 'bg-white/15 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Historique des prompts"
          >
            <History className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono">{executionLogs.length}</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN BODY: THE LARGEST PART (Fonctionnement du modèle & Erreurs) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: FONCTIONNEMENT DU MODÈLE */}
        {activeTab === 'working' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Live Model Status Card */}
            <div className="p-3.5 rounded-2xl bg-[#0d1222] border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  <span className="font-semibold text-white">Moteur d&apos;Inférence</span>
                </div>
                <span className="font-mono text-[11px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  {activeProvider?.type.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                  <div className="text-slate-500 text-[10px]">Modèle actif</div>
                  <div className="font-semibold text-slate-200 truncate font-mono">{activeModel?.name}</div>
                </div>
                <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                  <div className="text-slate-500 text-[10px]">Fenêtre Contexte</div>
                  <div className="font-semibold text-slate-200 truncate font-mono">{activeModel?.contextWindow || '128k'}</div>
                </div>
              </div>

              {activeProvider?.baseUrl && (
                <div className="text-[10px] text-slate-400 font-mono truncate px-1 flex items-center gap-1">
                  <span className="text-slate-500">Endpoint:</span>
                  <span className="truncate">{activeProvider.baseUrl}</span>
                </div>
              )}
            </div>

            {/* In-Flight Execution Timeline (When Prompt is Running) */}
            {isLoading && (
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                    <span className="text-xs font-bold text-white">Exécution en direct</span>
                  </div>
                  <span className="text-[11px] font-mono text-indigo-300">{elapsedTime}s</span>
                </div>

                {/* Animated Pipeline Steps */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    <span>1. Ingestion du prompt & validation</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    <span>2. Capture de l&apos;arborescence JSON des blocs</span>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-300 animate-pulse font-medium">
                    <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin text-indigo-400" />
                    <span>3. Inférence via {activeModel?.name}...</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                    <span>4. Application réactive sur le canvas</span>
                  </div>
                </div>
              </div>
            )}

            {/* Latest Diff Proposal Details (When Done) */}
            {latestProposal && !isLoading && (
              <div className="p-4 rounded-2xl bg-[#090e1c] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">Dernière mise à jour appliquée</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{latestProposal.timestamp}</span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-200 leading-relaxed">
                  <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">Raisonnement & Résumé :</div>
                  {latestProposal.summary}
                </div>

                {/* Detailed Changes Array */}
                {latestProposal.changes && latestProposal.changes.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase font-mono flex items-center justify-between">
                      <span>Détail des modifications ({latestProposal.changes.length})</span>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                      {latestProposal.changes.map((change, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-white/5 border border-white/5 text-[11px] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white truncate">{change.blockName || change.blockId || 'Bloc'}</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                              change.type === 'added'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : change.type === 'removed'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-indigo-500/20 text-indigo-300'
                            }`}>
                              {change.type}
                            </span>
                          </div>
                          <div className="text-slate-400 text-[10px]">{change.label}</div>
                          {change.after && (
                            <div className="text-[10px] font-mono text-emerald-300/90 truncate bg-black/30 px-1.5 py-0.5 rounded">
                              &rarr; {change.after}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Empty State / Guided Steps if no run yet */}
            {!latestProposal && !isLoading && (
              <div className="p-4 rounded-2xl bg-[#090d18] border border-white/5 space-y-3 text-slate-300 text-xs">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Fonctionnement de l&apos;Agent Autonome</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  L&apos;agent reçoit l&apos;arbre de blocs JSON actuel, votre prompt en langage naturel, et demande au modèle IA sélectionné d&apos;effectuer les calculs de styles, de textes, ou d&apos;objets 3D.
                </p>
                <div className="space-y-2 pt-1 text-[11px]">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">1</div>
                    <span>Choisissez votre modèle (Gemini, Claude 3.7, GPT-4o, Codestral, DeepSeek...)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">2</div>
                    <span>Saisissez vos instructions dans le champ en bas</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">3</div>
                    <span>Visualisez en direct les étapes d&apos;inférence et les blocs modifiés</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ERREURS & DIAGNOSTICS */}
        {activeTab === 'errors' && (
          <div className="space-y-4 animate-in fade-in">
            {latestError ? (
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>Dernière Erreur Détectée</span>
                  </div>
                  {latestError.code && (
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {latestError.code}
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-rose-500/20 font-mono text-xs text-rose-200">
                  {latestError.message}
                </div>

                {latestError.details && (
                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    <span className="font-semibold text-slate-300">Diagnostic :</span> {latestError.details}
                  </div>
                )}

                {/* Suggested Resolutions */}
                <div className="pt-2 border-t border-rose-500/20 flex flex-col gap-2">
                  <button
                    onClick={onOpenModelSettings}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Configurer la clé API ({latestError.provider})</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectModel('gemini', 'gemini-3.8-flash');
                      setActiveTab('working');
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Basculer sur Google Gemini (Actif par défaut)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-[#090d18] border border-white/5 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-white">Aucune erreur active</div>
                <p className="text-[11px] text-slate-400">
                  Tous les appels aux modèles et aux blocs UI s&apos;exécutent avec succès. Les erreurs potentielles d&apos;API (clé invalide, quota, réseau) s&apos;afficheront automatiquement ici.
                </p>
              </div>
            )}

            {/* Error Troubleshooting Guide */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-xs">
              <span className="text-[10px] font-semibold text-slate-400 uppercase font-mono">
                Résolution des erreurs fréquentes :
              </span>
              <ul className="space-y-1.5 text-[11px] text-slate-400 list-disc list-inside">
                <li><strong className="text-slate-300">Erreur 401 :</strong> Clé API non renseignée ou expirée. Cliquez sur le bouton de configuration pour la coller.</li>
                <li><strong className="text-slate-300">Erreur 429 :</strong> Limite de requêtes (Rate limit) atteinte sur votre compte chez ce provider.</li>
                <li><strong className="text-slate-300">Ollama/LM Studio :</strong> Vérifiez que votre serveur local est lancé sur le bon port (11434 ou 1234).</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: HISTORIQUE DES PROMPTS */}
        {activeTab === 'history' && (
          <div className="space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{executionLogs.length} prompt{executionLogs.length > 1 ? 's' : ''} dans cette session</span>
              {executionLogs.length > 0 && onClearLogs && (
                <button
                  onClick={onClearLogs}
                  className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors"
                >
                  Effacer
                </button>
              )}
            </div>

            {executionLogs.length === 0 ? (
              <div className="p-5 text-center text-xs text-slate-500">
                Aucun historique pour le moment. Lancez un prompt pour commencer.
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-0.5">
                {executionLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-[#090d18] border border-white/10 hover:border-white/20 transition-all text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white truncate max-w-[200px]">{log.prompt}</span>
                      <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <span className="px-1.5 py-0.2 rounded bg-white/5">{log.modelName}</span>
                      <span>&bull; {log.durationMs}ms</span>
                      {log.status === 'error' ? (
                        <span className="text-rose-400 font-semibold">Erreur</span>
                      ) : (
                        <span className="text-emerald-400">Succès</span>
                      )}
                    </div>

                    <p className="text-[10px] text-slate-400 line-clamp-2">{log.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. BOTTOM: PROMPT INPUT & PRESETS */}
      <div className="p-3 border-t border-white/10 bg-[#080b15] shrink-0 space-y-2.5">
        {/* Preset Prompt Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px]">
          {promptPresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setPromptInput(preset.text);
                if (textareaRef.current) {
                  textareaRef.current.focus();
                }
              }}
              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-indigo-600/30 text-slate-300 hover:text-white border border-white/5 whitespace-nowrap transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col bg-[#0d1222] border border-white/15 focus-within:border-indigo-500/60 rounded-xl p-2.5 transition-all shadow-inner">
            <textarea
              ref={textareaRef}
              rows={2}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Décrivez votre modification ou ajout... (ex: ajoute un héros 3D avec titre néon)"
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span className="truncate max-w-[140px]">{activeModel?.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 hidden sm:inline">
                  Entrée ↵
                </span>
                <button
                  type="submit"
                  disabled={!promptInput.trim() || isLoading}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    !promptInput.trim() || isLoading
                      ? 'bg-white/5 text-slate-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Génération...</span>
                    </>
                  ) : (
                    <>
                      <span>Envoyer</span>
                      <Send className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </aside>
  );
};
