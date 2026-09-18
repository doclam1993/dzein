'use client';

import React, { useState } from 'react';
import { 
  Sparkles, X, Wand2, ArrowRight, Loader2, Check, 
  Layers, Palette, Layout, ShieldCheck, Zap, Globe, 
  ChevronRight, RefreshCw
} from 'lucide-react';
import { CanvasBlock } from '@/types/builder';

interface OnePromptGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBlocks: (blocks: CanvasBlock[], projectName?: string, accentColor?: string) => void;
  currentThemeAccent?: string;
}

export const OnePromptGeneratorModal: React.FC<OnePromptGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApplyBlocks,
  currentThemeAccent = '#6366f1',
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string>('saas_ai');
  const [tone, setTone] = useState<string>('Moderne & Épuré');
  const [accentColor, setAccentColor] = useState<string>(currentThemeAccent);
  const [isLoading, setIsLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [generatedResult, setGeneratedResult] = useState<{
    projectName: string;
    themeAccent: string;
    summary: string;
    blocks: CanvasBlock[];
  } | null>(null);

  const presets = [
    {
      id: 'saas_ai',
      label: 'SaaS IA Copilot',
      icon: Sparkles,
      color: '#6366f1',
      prompt: 'Plateforme SaaS B2B de copilot IA pour équipes produit, analyse prédictive et flux automatisés en temps réel.',
    },
    {
      id: 'fintech_crypto',
      label: 'FinTech & Néobanque',
      icon: Zap,
      color: '#06b6d4',
      prompt: 'Néobanque internationale avec cartes virtuelles, rendement instantané, passerelle crypto et sécurité bancaire de niveau 4.',
    },
    {
      id: 'studio_3d',
      label: 'Studio Créatif 3D',
      icon: Layers,
      color: '#a855f7',
      prompt: 'Agence de design 3D spatial, expériences WebGL immersives et direction artistique pour marques de luxe mondiales.',
    },
    {
      id: 'cybersecurity',
      label: 'CyberSécurité & Zero Trust',
      icon: ShieldCheck,
      color: '#10b981',
      prompt: 'Suite de protection contre les menaces avancées, audit automatisé des vulnérabilités cloud et conformité SOC2 en continu.',
    },
    {
      id: 'ecommerce_luxe',
      label: 'E-commerce Premium & Luxe',
      icon: Palette,
      color: '#f43f5e',
      prompt: 'Boutique exclusive de haute horlogerie et objets connectés avec configurateur 3D temps réel et conciergerie privée.',
    },
  ];

  const generationSteps = [
    'Analyse sémantique du projet et du positionnement...',
    'Architecture de l’arborescence : Navbar, Hero, Bento & Tarifs...',
    'Configuration du composant WebGL 3D interactif...',
    'Rédaction des titres percutants et propositions de valeur...',
    'Harmonisation de la palette chromatique et des contrastes WCAG...',
    'Validation de la mise en page finale...',
  ];

  const handleSelectPreset = (preset: typeof presets[0]) => {
    setSelectedPreset(preset.id);
    setPrompt(preset.prompt);
    setAccentColor(preset.color);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setGeneratedResult(null);
    setStepIndex(0);

    // Simulation of granular step progress for UX feedback
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < generationSteps.length - 1 ? prev + 1 : prev));
    }, 600);

    try {
      const response = await fetch('/api/ai/generate-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          industryPreset: selectedPreset,
          themeAccent: accentColor,
          tone,
        }),
      });

      const data = await response.json();
      clearInterval(interval);

      if (data.blocks && Array.isArray(data.blocks)) {
        setGeneratedResult({
          projectName: data.projectName || 'landing-page.tsx',
          themeAccent: data.themeAccent || accentColor,
          summary: data.summary || 'Landing page générée avec succès.',
          blocks: data.blocks,
        });
      } else {
        throw new Error(data.error || 'Format de réponse invalide');
      }
    } catch (err: any) {
      clearInterval(interval);
      console.error('Erreur de génération:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!generatedResult) return;
    onApplyBlocks(generatedResult.blocks, generatedResult.projectName, generatedResult.themeAccent);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in select-none"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#090d16] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0d1220]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                Générateur de Landing Pages en 1 Prompt
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
                  AI Studio v3.5
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Créez un site complet et cohérent (Navbar + Hero + Bento + 3D + Tarifs + FAQ + Footer) instantanément.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          {!generatedResult ? (
            <>
              {/* Presets Grid */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5 text-indigo-400" />
                  Modèles de départ sectoriels :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {presets.map((preset) => {
                    const Icon = preset.icon;
                    const isSelected = selectedPreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                          isSelected 
                            ? 'bg-indigo-600/20 border-indigo-500/60 ring-1 ring-indigo-500/50 text-white' 
                            : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div 
                            className="w-6 h-6 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${preset.color}25`, color: preset.color }}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                        </div>
                        <span className="text-xs font-semibold">{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Prompt Input Area */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Description détaillée de votre projet :
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {prompt.length} caractères
                  </span>
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex : Une application web SaaS de marketing automatisé pour agences immobilières avec tableau de bord analytique, tarification mensuelle et démonstration 3D du flux de leads..."
                  rows={3}
                  className="w-full bg-[#05070d] border border-white/15 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Settings Controls (Tone & Palette) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Tone Selector */}
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                    Ton rédactionnel :
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-[#05070d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Moderne & Épuré">Moderne & Épuré</option>
                    <option value="B2B Haut de Gamme">B2B Haut de Gamme & Sérieux</option>
                    <option value="Futuriste & Cyberpunk">Futuriste & Cyberpunk</option>
                    <option value="Minimaliste & Élégant">Minimaliste & Élégant</option>
                    <option value="Audacieux & Dynamique">Audacieux & Dynamique</option>
                  </select>
                </div>

                {/* Color Accent Picker */}
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block flex items-center justify-between">
                    <span>Couleur d&apos;accent dominante :</span>
                    <span className="font-mono text-[10px] text-slate-500">{accentColor}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {['#6366f1', '#a855f7', '#06b6d4', '#10b981', '#f43f5e', '#f59e0b'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setAccentColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full transition-all ${
                          accentColor === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#090d16]' : 'opacity-70 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* In Progress Loader state */}
              {isLoading && (
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-indigo-400 animate-spin shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-indigo-200">
                        {generationSteps[stepIndex]}
                      </div>
                      <div className="text-[11px] text-indigo-400/80">
                        Étape {stepIndex + 1} sur {generationSteps.length}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
                      style={{ width: `${((stepIndex + 1) / generationSteps.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Generated Result Preview & Verification */
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-emerald-200">
                    Landing Page générée avec succès !
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {generatedResult.summary}
                  </p>
                </div>
              </div>

              {/* Sections Breakdown List */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Sections créées et prêtes à être intégrées ({generatedResult.blocks.length}) :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {generatedResult.blocks.map((block, i) => (
                    <div
                      key={block.id || i}
                      className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-md bg-white/10 text-[10px] font-mono font-bold flex items-center justify-center text-slate-300">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-white truncate">{block.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono uppercase">{block.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-[#0d1220] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Annuler
          </button>

          {!generatedResult ? (
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isLoading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xl ${
                !prompt.trim() || isLoading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-indigo-500/25 active:scale-95'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Génération en cours...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Générer la Landing Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGeneratedResult(null)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Régénérer</span>
              </button>
              <button
                onClick={handleApply}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Appliquer sur le Canvas</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
