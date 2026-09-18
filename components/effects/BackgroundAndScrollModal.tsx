'use client';

import React, { useState } from 'react';
import { BackgroundConfig, BackgroundEffectType, DEFAULT_BG_CONFIG } from './AdvancedBackgroundCanvas';
import { ScrollAnimationType, ScrollAnimationWrapper } from './ScrollAnimationWrapper';
import { X, Sparkles, Layers, SlidersHorizontal, Orbit, Grid, Eye, Check, MoveVertical, Zap, RefreshCw } from 'lucide-react';

interface BackgroundAndScrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig?: BackgroundConfig;
  onUpdateConfig: (newConfig: BackgroundConfig) => void;
  onApplyScrollPresetToBlocks?: (scrollPreset: ScrollAnimationType) => void;
}

const COLOR_PRESETS = [
  { name: 'Cyber Neon', primary: '#6366f1', secondary: '#ec4899', accent: '#10b981' },
  { name: 'Aurora Emerald', primary: '#10b981', secondary: '#06b6d4', accent: '#a855f7' },
  { name: 'Sunset Glow', primary: '#f43f5e', secondary: '#fb923c', accent: '#a855f7' },
  { name: 'Dark Gold Luxury', primary: '#f59e0b', secondary: '#d97706', accent: '#6366f1' },
  { name: 'Deep Space Blue', primary: '#3b82f6', secondary: '#8b5cf6', accent: '#06b6d4' },
];

export const BackgroundAndScrollModal: React.FC<BackgroundAndScrollModalProps> = ({
  isOpen,
  onClose,
  currentConfig = DEFAULT_BG_CONFIG,
  onUpdateConfig,
  onApplyScrollPresetToBlocks
}) => {
  const [activeTab, setActiveTab] = useState<'bg' | 'scroll'>('bg');
  const [bgConfig, setBgConfig] = useState<BackgroundConfig>(currentConfig);
  const [previewScrollType, setPreviewScrollType] = useState<ScrollAnimationType>('fadeUp');

  if (!isOpen) return null;

  const handleApplyConfig = (updated: BackgroundConfig) => {
    setBgConfig(updated);
    onUpdateConfig(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#080b14] border border-indigo-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Bar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#06080f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Orbit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Effets de Fond & Animations au Défilement
                <span className="text-[10px] font-mono text-pink-400 bg-pink-500/10 px-2.5 py-0.5 rounded-full border border-pink-500/20">
                  Pro FX Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Aurores boréales interactives, grilles cyber animées, particules & animations d&apos;entrée scroll.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-white/5 bg-[#090d18] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('bg')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'bg'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Effets de Fond Avancés</span>
          </button>

          <button
            onClick={() => setActiveTab('scroll')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'scroll'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MoveVertical className="w-3.5 h-3.5" />
            <span>Animations au Défilement (Scroll)</span>
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'bg' ? (
            <div className="space-y-6">
              {/* Effect Type Selector Cards */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Grid className="w-4 h-4 text-indigo-400" />
                  <span>Mode d&apos;Effet de Fond</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'auroraOrbs', label: 'Aurores Boréales (Glow Orbs)', desc: 'Sphères lumineuses fluides réactives au survol' },
                    { id: 'animatedGrid', label: 'Grilles Animées Cyber', desc: 'Lignes de réseau néon avec balayage scanline' },
                    { id: 'particles', label: 'Motifs de Particules', desc: 'Noeuds connectés dynamiques sur canvas HTML5' },
                    { id: 'noiseGrain', label: 'Bruit Argentique Subtil', desc: 'Texture grain argentique tactile haut de gamme' },
                    { id: 'combinedAuroraGrid', label: 'Combinaison Totale', desc: 'Superposition complète Aurores + Grilles + Grain' },
                    { id: 'none', label: 'Aucun (Épuré)', desc: 'Arrière-plan sombre unifié sans effets' },
                  ].map((eff) => {
                    const isSelected = bgConfig.type === eff.id;
                    return (
                      <button
                        key={eff.id}
                        onClick={() => {
                          const updated = { ...bgConfig, type: eff.id as BackgroundEffectType };
                          handleApplyConfig(updated);
                        }}
                        className={`p-3.5 rounded-2xl text-left border transition-all relative ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10'
                            : 'bg-slate-900/60 border-white/5 hover:border-indigo-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white">{eff.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight">{eff.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Preset Palette */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Thèmes de Couleurs & Palettes
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        const updated = {
                          ...bgConfig,
                          primaryColor: preset.primary,
                          secondaryColor: preset.secondary,
                          accentColor: preset.accent,
                        };
                        handleApplyConfig(updated);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-indigo-500/50 flex items-center gap-2 text-xs text-slate-200 transition-all"
                    >
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.primary }} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.secondary }} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.accent }} />
                      </div>
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fine Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-900/60 border border-white/5">
                {/* Orb Opacity Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Opacité des Aurores :</span>
                    <span className="font-mono text-indigo-400">{Math.round((bgConfig.orbOpacity || 0.25) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.6"
                    step="0.05"
                    value={bgConfig.orbOpacity || 0.25}
                    onChange={(e) => {
                      const updated = { ...bgConfig, orbOpacity: parseFloat(e.target.value) };
                      handleApplyConfig(updated);
                    }}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Particle Density */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Densité de Particules :</span>
                    <span className="font-mono text-pink-400">{bgConfig.particleDensity || 40} noeuds</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="90"
                    step="5"
                    value={bgConfig.particleDensity || 40}
                    onChange={(e) => {
                      const updated = { ...bgConfig, particleDensity: parseInt(e.target.value, 10) };
                      handleApplyConfig(updated);
                    }}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </div>

                {/* Grain Opacity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Bruit Argentique (Grain) :</span>
                    <span className="font-mono text-emerald-400">{Math.round((bgConfig.grainOpacity || 0.04) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.12"
                    step="0.01"
                    value={bgConfig.grainOpacity || 0.04}
                    onChange={(e) => {
                      const updated = { ...bgConfig, grainOpacity: parseFloat(e.target.value) };
                      handleApplyConfig(updated);
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Mouse Tracking Checkbox */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-300 font-medium">Suivi Interactif de la Souris :</span>
                  <button
                    onClick={() => {
                      const updated = { ...bgConfig, enableMouseTracking: !bgConfig.enableMouseTracking };
                      handleApplyConfig(updated);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      bgConfig.enableMouseTracking
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-white/5'
                    }`}
                  >
                    {bgConfig.enableMouseTracking ? 'Actif' : 'Inactif'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: SCROLL ANIMATIONS */
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
                ⚡ Testez la prévisualisation des animations au défilement et appliquez-les directement sur vos blocs du Canvas.
              </div>

              {/* Scroll Animation Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'fadeUp', label: 'Fade Up', desc: 'Montée progressive avec fondus enchaînés' },
                  { id: 'staggerList', label: 'Stagger List', desc: 'Apparition échelonnée des éléments enfants' },
                  { id: 'zoomIn', label: 'Zoom In', desc: 'Agrandissement subtil avec opacité' },
                  { id: 'parallax', label: 'Effet Parallaxe', desc: 'Décalage vertical synchrone sur le scroll' },
                  { id: 'slideRight', label: 'Slide Right', desc: 'Glissement latéral fluide depuis la gauche' },
                  { id: 'flip3D', label: '3D Perspective Flip', desc: 'Inclusion avec inclinaison 3D en profondeur' },
                ].map((anim) => {
                  const isSelected = previewScrollType === anim.id;
                  return (
                    <button
                      key={anim.id}
                      onClick={() => setPreviewScrollType(anim.id as ScrollAnimationType)}
                      className={`p-3.5 rounded-2xl text-left border transition-all ${
                        isSelected
                          ? 'bg-pink-600/20 border-pink-500 shadow-lg shadow-pink-500/10'
                          : 'bg-slate-900/60 border-white/5 hover:border-pink-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{anim.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-pink-400" />}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">{anim.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Live Preview Playground Box */}
              <div className="p-8 rounded-3xl bg-slate-900/90 border border-white/10 space-y-4 text-center">
                <p className="text-xs uppercase tracking-widest text-slate-400 font-mono">
                  Prévisualisation du Style : <strong className="text-pink-400">{previewScrollType}</strong>
                </p>

                <ScrollAnimationWrapper key={previewScrollType} type={previewScrollType}>
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-2xl max-w-md mx-auto">
                    ✨ Démonstration du Bloc Animé au Défilement
                    <p className="text-xs font-normal text-white/80 mt-1">
                      Cet effet se déclenchera automatiquement lorsque la section entrera dans le viewport.
                    </p>
                  </div>
                </ScrollAnimationWrapper>

                {onApplyScrollPresetToBlocks && (
                  <button
                    onClick={() => {
                      onApplyScrollPresetToBlocks(previewScrollType);
                      onClose();
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition-all shadow-lg shadow-pink-500/25"
                  >
                    Appliquer cette animation Scroll sur tous les blocs
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#06080f] flex items-center justify-between text-xs text-slate-400">
          <span>✨ Modifiez vos effets en direct sur l&apos;ensemble du canevas.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-md"
          >
            Valider & Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
