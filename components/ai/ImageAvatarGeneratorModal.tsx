'use client';

import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, User, Sparkles, X, Check, Copy, 
  Download, Loader2, RefreshCw, Wand2, Search, ArrowRight, 
  Grid, ExternalLink
} from 'lucide-react';

interface ImageAsset {
  id: string;
  title: string;
  url: string;
  type: 'avatar' | 'photo' | 'vector' | '3d';
  alt: string;
  tag: string;
}

interface ImageAvatarGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string, altText?: string) => void;
  selectedElementTarget?: string | null;
}

export const ImageAvatarGeneratorModal: React.FC<ImageAvatarGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  selectedElementTarget,
}) => {
  const [activeTab, setActiveTab] = useState<'avatar' | 'hero' | '3d' | 'custom'>('avatar');
  const [avatarStyle, setAvatarStyle] = useState<'photorealistic' | '3d_memoji' | 'minimal_vector' | 'cyber_neon'>('photorealistic');
  const [prompt, setPrompt] = useState('Portrait professionnel pour témoignage client SaaS');
  const [isLoading, setIsLoading] = useState(false);
  const [assets, setAssets] = useState<ImageAsset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchAssets = async (category: string, style: string, queryPrompt: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/generate-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryPrompt,
          category: category === 'hero' ? 'photo' : category === '3d' ? '3d' : 'avatar',
          style,
          count: 8,
        }),
      });
      const data = await res.json();
      if (data.assets && Array.isArray(data.assets)) {
        setAssets(data.assets);
        if (data.assets.length > 0) setSelectedAssetId(data.assets[0].id);
      }
    } catch (err) {
      console.error('Erreur chargement assets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/ai/generate-avatar?type=${activeTab}&style=${avatarStyle}&prompt=${encodeURIComponent(prompt)}`);
        const data = await res.json();
        if (isMounted && data.assets) {
          setAssets(data.assets);
          if (data.assets.length > 0) setSelectedAssetId(data.assets[0].id);
        }
      } catch (err) {
        console.error('Erreur chargement assets:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, activeTab, avatarStyle, prompt]);

  const handleTabChange = (tab: 'avatar' | 'hero' | '3d' | 'custom') => {
    setActiveTab(tab);
    if (tab === 'avatar') {
      setPrompt('Portrait professionnel pour témoignage client SaaS');
    } else if (tab === 'hero') {
      setPrompt('Photographie futuriste de technologie et intelligence artificielle pour bannière héros');
    } else if (tab === '3d') {
      setPrompt('Forme abstraite 3D WebGL fluide et néon sombre');
    } else {
      setPrompt('Visuel moderne d&apos;interface utilisateur');
    }
  };

  const handleApply = () => {
    const asset = assets.find((a) => a.id === selectedAssetId);
    if (asset) {
      onSelectImage(asset.url, asset.alt);
      onClose();
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in select-none"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-[#090d16] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0d1220]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                Générateur d&apos;Images & Avatars IA Intégré
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                  HD Assets Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {selectedElementTarget 
                  ? `Cible active : ${selectedElementTarget} — Insérez directement en 1 clic` 
                  : 'Générez des visuels sans chercher d’URLs externes.'}
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

        {/* Category Tabs */}
        <div className="px-6 py-2.5 border-b border-white/[0.06] bg-[#070a12] flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'avatar' as const, label: 'Avatars & Avis Clients', icon: User },
            { id: 'hero' as const, label: 'Visuels Héros & Bannières', icon: ImageIcon },
            { id: '3d' as const, label: 'Rendus 3D & Abstraits', icon: Sparkles },
            { id: 'custom' as const, label: 'Prompt Sur-Mesure', icon: Wand2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filters & Prompt Search */}
        <div className="p-6 border-b border-white/[0.06] bg-[#090d18] space-y-3">
          {/* Avatar Styles if tab is avatar */}
          {activeTab === 'avatar' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Style d&apos;avatar :</span>
              {[
                { id: 'photorealistic' as const, label: 'Portraits Réalistes' },
                { id: '3d_memoji' as const, label: '3D Cyber Bots' },
                { id: 'minimal_vector' as const, label: 'Formes Minimalistes' },
                { id: 'cyber_neon' as const, label: 'Neon Identicon' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setAvatarStyle(st.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    avatarStyle === st.id
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                      : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          )}

          {/* Search / Prompt Bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchAssets(activeTab, avatarStyle, prompt)}
                placeholder="Décrivez l'image ou le style souhaité..."
                className="w-full bg-[#05070d] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>
            <button
              onClick={() => fetchAssets(activeTab, avatarStyle, prompt)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>Générer</span>
            </button>
          </div>
        </div>

        {/* Visual Assets Grid */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {isLoading ? (
            <div className="h-48 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <p className="text-xs">Génération et optimisation des assets visuels...</p>
            </div>
          ) : assets.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-xs">
              Aucun asset disponible. Cliquez sur &quot;Générer&quot; pour lancer la recherche.
            </div>
          ) : (
            <div className={`grid gap-3 ${activeTab === 'avatar' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
              {assets.map((asset) => {
                const isSelected = selectedAssetId === asset.id;
                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                    className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-[1.02] shadow-xl shadow-cyan-500/10'
                        : 'border-white/10 hover:border-white/30 bg-black/40'
                    }`}
                  >
                    <div className={`relative ${activeTab === 'avatar' ? 'aspect-square' : 'aspect-video'} bg-[#0d1220] flex items-center justify-center overflow-hidden`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={asset.url}
                        alt={asset.alt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-lg font-bold">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="p-2 bg-[#090d16] flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-300 truncate max-w-[120px]">
                        {asset.title}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUrl(asset.url, asset.id);
                        }}
                        title="Copier le lien direct"
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {copiedId === asset.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-[#0d1220] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Fermer
          </button>

          <button
            onClick={handleApply}
            disabled={!selectedAssetId}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedAssetId
                ? 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-lg shadow-cyan-500/25 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Appliquer le visuel sélectionné</span>
          </button>
        </div>
      </div>
    </div>
  );
};
