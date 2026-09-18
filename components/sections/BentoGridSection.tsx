'use client';

import React, { useState, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import { Sparkles, ArrowRight, CheckCircle2, Layers, ExternalLink } from 'lucide-react';

export interface BentoCardItem {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  description: string;
  tag?: string;
  badge?: string;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  gradient?: string;
  accentColor?: string;
}

const DEFAULT_BENTO_ITEMS: BentoCardItem[] = [
  {
    id: 'b-1',
    icon: 'Zap',
    title: 'Moteur Réactif Latence Sub-10ms',
    subtitle: 'Traitement Asynchrone Parallelisé',
    description: 'Une infrastructure distribuée capable d’exécuter des milliers d’opérations graphiques et de requêtes IA par seconde sans blocage d’I/O.',
    tag: 'Noyau v4.2',
    badge: '⚡ ÉLECTRON HIGH-SPEED',
    colSpan: 2,
    gradient: 'from-indigo-500/20 via-purple-500/10 to-transparent',
    accentColor: '#6366f1'
  },
  {
    id: 'b-2',
    icon: 'Bot',
    title: 'Agent Copilote IA Autonome',
    description: 'Génération directe de blocs React, ajustement automatique des palettes contrastées et audit d’accessibilité en un clic.',
    tag: 'IA Générative',
    badge: '✨ GEMINI 3.5 FLASH',
    colSpan: 1,
    gradient: 'from-pink-500/20 via-purple-500/10 to-transparent',
    accentColor: '#ec4899'
  },
  {
    id: 'b-3',
    icon: 'ShieldCheck',
    title: 'Isolation Cryptographique SOC2',
    description: 'Sécurité de niveau bancaire avec chiffrement AES-256 des tokens et contrôle d’accès basé sur les rôles (RBAC).',
    tag: 'Vault Sécurisé',
    badge: '🛡️ ISO 27001',
    colSpan: 1,
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    accentColor: '#10b981'
  },
  {
    id: 'b-4',
    icon: 'Boxes',
    title: 'Studio Vectoriel & Shaders 3D',
    subtitle: 'Composition Graphique WebGL',
    description: 'Interactions spatiales 3D et tracés vectoriels dynamiques exportables directement en JSX et CSS Tailwind.',
    tag: 'Spatial UI',
    badge: '💎 THREE.JS & WEBGL',
    colSpan: 2,
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    accentColor: '#06b6d4'
  }
];

interface BentoCardProps {
  item: BentoCardItem;
  onCardClick?: (item: BentoCardItem) => void;
}

const MagneticBentoCard: React.FC<BentoCardProps> = ({ item, onCardClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, isHovered: false });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y, isHovered: true });

    // Calculate 3D tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rx = ((y - centerY) / centerY) * -6; // max 6 deg
    const ry = ((x - centerX) / centerX) * 6;
    setTilt({ rx, ry });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, isHovered: false }));
    setTilt({ rx: 0, ry: 0 });
  };

  const IconComp = (LucideIcons as any)[item.icon] || LucideIcons.Zap;
  const colSpanClass = item.colSpan === 2 ? 'md:col-span-2' : item.colSpan === 3 ? 'md:col-span-3' : 'md:col-span-1';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onCardClick?.(item)}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${mousePos.isHovered ? 1.015 : 1})`,
        transition: mousePos.isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`group relative rounded-3xl p-6 sm:p-8 cursor-pointer overflow-hidden border border-white/10 bg-[#0d121f]/80 backdrop-blur-xl shadow-xl hover:border-indigo-500/40 ${colSpanClass}`}
    >
      {/* Dynamic Cursor Spotlight Radial Effect */}
      {mousePos.isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-3xl opacity-100 z-0"
          style={{
            background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, ${item.accentColor || '#6366f1'}25, transparent 80%)`,
          }}
        />
      )}

      {/* Background Subtle Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient || 'from-indigo-500/10 to-transparent'} opacity-50 group-hover:opacity-80 transition-opacity pointer-events-none`} />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div
              style={{ backgroundColor: `${item.accentColor || '#6366f1'}15`, borderColor: `${item.accentColor || '#6366f1'}35` }}
              className="w-11 h-11 rounded-2xl border flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300"
            >
              <IconComp className="w-5 h-5" style={{ color: item.accentColor || '#6366f1' }} />
            </div>

            {item.badge && (
              <span
                style={{ color: item.accentColor || '#a5b4fc', borderColor: `${item.accentColor || '#6366f1'}30`, backgroundColor: `${item.accentColor || '#6366f1'}10` }}
                className="text-[10px] font-mono font-bold px-3 py-1 rounded-full border backdrop-blur-md"
              >
                {item.badge}
              </span>
            )}
          </div>

          {item.subtitle && (
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">
              {item.subtitle}
            </p>
          )}

          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight group-hover:text-indigo-200 transition-colors">
            {item.title}
          </h3>

          <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-white/5 text-xs">
          {item.tag && (
            <span className="text-slate-400 font-mono text-[11px] bg-white/5 px-2.5 py-1 rounded-lg">
              #{item.tag}
            </span>
          )}
          <div className="flex items-center gap-1.5 text-indigo-400 group-hover:text-indigo-300 font-medium transition-colors ml-auto">
            <span>Explorer</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const BentoGridSection: React.FC<{ items?: BentoCardItem[]; title?: string; subtitle?: string }> = ({
  items = DEFAULT_BENTO_ITEMS,
  title = "Architecture Bento & Composants Magnétiques",
  subtitle = "Des cartes interactives réactives calculant l'angle et la position du curseur en temps réel."
}) => {
  const [selectedCard, setSelectedCard] = useState<BentoCardItem | null>(null);

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Section Interactive Bento</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {title}
        </h2>
        <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <MagneticBentoCard key={item.id} item={item} onCardClick={(card) => setSelectedCard(card)} />
        ))}
      </div>

      {/* Expanded Modal Detail */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0d121f] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedCard.title}</h3>
                  <span className="text-xs text-indigo-400 font-mono">{selectedCard.badge || 'Bento Component'}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedCard.description}
            </p>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2 text-xs font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Rendu Spotlight:</span>
                <span className="text-emerald-400">Gradients Radial CSS 60fps</span>
              </div>
              <div className="flex justify-between">
                <span>Inclinomètre 3D:</span>
                <span className="text-indigo-400">Perspective 1000px</span>
              </div>
              <div className="flex justify-between">
                <span>Export Code:</span>
                <span className="text-purple-400">React + Tailwind Native</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedCard(null)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-500/20"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
