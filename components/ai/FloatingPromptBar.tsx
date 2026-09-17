'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, ArrowUp, Bot, ChevronUp, ChevronDown, 
  Loader2, Settings, Check, Plus
} from 'lucide-react';
import { AIProvider } from '@/types/ai';

interface FloatingPromptBarProps {
  onSendPrompt: (promptText: string) => Promise<void>;
  isLoading?: boolean;
  providers?: AIProvider[];
  activeProviderId?: string;
  activeModelId?: string;
  onSelectModel?: (providerId: string, modelId: string) => void;
  onOpenModelSettings?: () => void;
}

export const FloatingPromptBar: React.FC<FloatingPromptBarProps> = ({
  onSendPrompt,
  isLoading = false,
  providers = [],
  activeProviderId,
  activeModelId,
  onSelectModel,
  onOpenModelSettings,
}) => {
  const [promptText, setPromptText] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [modelSearchQuery, setModelSearchQuery] = useState('');

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

  const activeProvider = providers.find((p) => p.id === activeProviderId) || providers[0];
  const activeModel = activeProvider?.models.find((m) => m.id === activeModelId) || activeProvider?.models[0];

  const quickPills = [
    'Néon violet & Torus Knot 3D',
    'Grille en 2 colonnes',
    'Offre annuelle -25%',
    'Mesh 3D en cube cyber',
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptText.trim() || isLoading) return;
    const text = promptText.trim();
    setPromptText('');
    await onSendPrompt(text);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4 pointer-events-auto select-none">
      {/* Mini Toggle if collapsed */}
      {!isExpanded ? (
        <div className="flex justify-center">
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1220]/95 border border-indigo-500/40 text-xs font-medium text-slate-200 shadow-2xl backdrop-blur-xl hover:scale-105 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Agent IA &bull; {activeModel?.name || 'Gemini 3.8'}</span>
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      ) : (
        <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
          {/* Header pill & collapse */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
              {quickPills.map((pill) => (
                <button
                  key={pill}
                  onClick={() => onSendPrompt(pill)}
                  disabled={isLoading}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#0d121f]/90 hover:bg-indigo-900/40 text-slate-300 hover:text-white border border-white/10 hover:border-indigo-500/40 backdrop-blur-md transition-all whitespace-nowrap active:scale-95"
                >
                  {pill}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              title="Réduire la barre"
              className="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors shrink-0 ml-1"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Floating Prompt Input Box */}
          <div className="relative">
            <form
              onSubmit={handleSubmit}
              className="relative flex items-center gap-2 p-1.5 pl-2.5 rounded-2xl bg-[#0c101c]/95 border border-white/15 backdrop-blur-2xl shadow-2xl shadow-black/80 ring-1 ring-white/5 focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all"
            >
              {/* Quick Model Selector Dropdown Trigger */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  title="Changer de modèle ou provider IA"
                  className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white/5 hover:bg-indigo-600/20 border border-white/10 hover:border-indigo-500/40 text-xs text-indigo-300 hover:text-white transition-all shrink-0 max-w-[130px] sm:max-w-[170px]"
                >
                  <Bot className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate text-[11px] font-semibold">
                    {activeModel?.name || 'Gemini 3.8 Flash'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                </button>

                {/* Dropdown Menu */}
                {isModelDropdownOpen && (
                  <div className="absolute bottom-11 left-0 z-50 w-80 max-h-96 overflow-hidden bg-[#090d18] border border-white/15 rounded-2xl shadow-2xl p-2.5 backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2 space-y-2 flex flex-col">
                    <div className="px-1.5 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center justify-between border-b border-white/5 pb-1.5">
                      <span>Sélectionner un Modèle</span>
                      <span className="text-indigo-400">{providers.length} Providers</span>
                    </div>

                    {/* Quick Search */}
                    <div className="relative">
                      <input
                        type="text"
                        value={modelSearchQuery}
                        onChange={(e) => setModelSearchQuery(e.target.value)}
                        placeholder="Chercher (Claude, GPT, Flash, R1...)"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#0c101c] border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
                        autoFocus
                      />
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-0.5 scrollbar-thin">
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
                                      if (onSelectModel) onSelectModel(provider.id, model.id);
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

                    {/* Manage Providers link */}
                    {onOpenModelSettings && (
                      <div className="pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => {
                            setIsModelDropdownOpen(false);
                            setModelSearchQuery('');
                            onOpenModelSettings();
                          }}
                          className="w-full py-1.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Gérer tous les Providers & Modèles</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder={`Demander à ${activeModel?.name || 'l\'IA'} de modifier le design, les couleurs ou la 3D...`}
                disabled={isLoading}
                className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 outline-none min-w-0"
              />

              {/* Settings button */}
              {onOpenModelSettings && (
                <button
                  type="button"
                  onClick={onOpenModelSettings}
                  title="Gérer les Providers et Modèles IA"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="submit"
                disabled={!promptText.trim() || isLoading}
                className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white disabled:opacity-40 disabled:pointer-events-none hover:scale-105 active:scale-95 transition-all shadow-md shadow-indigo-500/30 shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ArrowUp className="w-3.5 h-3.5" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
