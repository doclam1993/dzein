'use client';

import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle, X, Sparkles, 
  Wand2, RefreshCw, Eye, Check, ArrowRight, Activity, 
  Layers, Palette, Type, Ruler
} from 'lucide-react';
import { CanvasBlock } from '@/types/builder';

interface AuditIssue {
  id: string;
  blockId: string;
  blockName: string;
  category: 'contrast' | 'typography' | 'spacing' | 'accessibility';
  severity: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  recommendation: string;
  fixable: boolean;
}

interface DesignAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  blocks: CanvasBlock[];
  onApplyAutoFix: (fixedBlocks: CanvasBlock[]) => void;
}

// Helper to compute luminance & contrast ratio
function getLuminance(hexOrRgb: string): number {
  let r = 255, g = 255, b = 255;
  if (!hexOrRgb) return 1;

  if (hexOrRgb.startsWith('#')) {
    const hex = hexOrRgb.replace('#', '');
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length >= 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
  } else if (hexOrRgb.includes('rgb')) {
    const match = hexOrRgb.match(/\d+/g);
    if (match && match.length >= 3) {
      r = parseInt(match[0], 10);
      g = parseInt(match[1], 10);
      b = parseInt(match[2], 10);
    }
  }

  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(fgColor: string, bgColor: string): number {
  const l1 = getLuminance(fgColor);
  const l2 = getLuminance(bgColor);
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export const DesignAuditModal: React.FC<DesignAuditModalProps> = ({
  isOpen,
  onClose,
  blocks,
  onApplyAutoFix,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'contrast' | 'typography' | 'spacing'>('all');
  const [isFixing, setIsFixing] = useState(false);
  const [fixedSuccess, setFixedSuccess] = useState(false);

  // Perform full scan
  const issues = useMemo(() => {
    const list: AuditIssue[] = [];

    blocks.forEach((block) => {
      const bg = block.style.backgroundColor || 'rgba(10, 13, 20, 0.7)';
      const textCol = block.style.textColor || '#cbd5e1';
      const headCol = block.style.headingColor || '#ffffff';

      // 1. Contrast Check
      const textRatio = getContrastRatio(textCol, bg);
      if (textRatio < 4.5) {
        list.push({
          id: `contrast-text-${block.id}`,
          blockId: block.id,
          blockName: block.name,
          category: 'contrast',
          severity: textRatio < 3.0 ? 'error' : 'warning',
          title: `Ratio de contraste texte insuffisant (${textRatio.toFixed(1)}:1)`,
          description: `Le texte de couleur "${textCol}" sur le fond "${bg}" ne respecte pas le minimum WCAG AA de 4.5:1.`,
          recommendation: 'Éclaircir le texte vers #ffffff ou #f1f5f9 pour garantir une lisibilité optimale.',
          fixable: true,
        });
      }

      const headRatio = getContrastRatio(headCol, bg);
      if (headRatio < 3.0) {
        list.push({
          id: `contrast-head-${block.id}`,
          blockId: block.id,
          blockName: block.name,
          category: 'contrast',
          severity: 'error',
          title: `Ratio de contraste titre non conforme (${headRatio.toFixed(1)}:1)`,
          description: `Les grands titres requièrent un contraste minimal de 3.0:1 avec leur conteneur.`,
          recommendation: 'Augmenter la luminosité du titre ou assombrir le fond.',
          fixable: true,
        });
      }

      // 2. Typography Hierarchy Check
      if (block.style.fontSize && block.style.fontSize < 13) {
        list.push({
          id: `typo-size-${block.id}`,
          blockId: block.id,
          blockName: block.name,
          category: 'typography',
          severity: 'warning',
          title: 'Taille de police minimale trop basse',
          description: `La taille de police (${block.style.fontSize}px) est inférieure au standard de lisibilité moderne (14px).`,
          recommendation: 'Passer la taille minimale du corps de texte à 14px ou 15px.',
          fixable: true,
        });
      }

      // 3. Spacing Rhythm Check
      const pt = block.style.paddingTop ?? 16;
      const pb = block.style.paddingBottom ?? 16;
      if (Math.abs(pt - pb) > 32) {
        list.push({
          id: `spacing-balance-${block.id}`,
          blockId: block.id,
          blockName: block.name,
          category: 'spacing',
          severity: 'info',
          title: 'Asymétrie de padding vertical',
          description: `Padding haut (${pt}px) et bas (${pb}px) très asymétriques pouvant créer un déséquilibre visuel.`,
          recommendation: 'Équilibrer les paddings de section pour une cadence harmonique uniforme.',
          fixable: true,
        });
      }

      if (block.type === 'hero' && pt < 32) {
        list.push({
          id: `spacing-hero-${block.id}`,
          blockId: block.id,
          blockName: block.name,
          category: 'spacing',
          severity: 'warning',
          title: 'Section Héros trop compressée',
          description: 'La section Héros manque de respiration verticale (padding actuel < 32px).',
          recommendation: 'Augmenter le padding vertical du Héros à 48px ou 56px.',
          fixable: true,
        });
      }
    });

    return list;
  }, [blocks]);

  // Overall Visual Health Score (0 - 100)
  const healthScore = useMemo(() => {
    const errorCount = issues.filter((i) => i.severity === 'error').length;
    const warnCount = issues.filter((i) => i.severity === 'warning').length;
    const score = Math.max(20, Math.min(100, 100 - errorCount * 15 - warnCount * 5));
    return score;
  }, [issues]);

  const filteredIssues = useMemo(() => {
    if (filterCategory === 'all') return issues;
    return issues.filter((i) => i.category === filterCategory);
  }, [issues, filterCategory]);

  const handleRunAutoFix = () => {
    setIsFixing(true);
    setFixedSuccess(false);

    setTimeout(() => {
      const fixedBlocks: CanvasBlock[] = blocks.map((b) => {
        const updated = { ...b, style: { ...b.style } };

        // 1. Fix contrast issues
        if (!updated.style.textColor || updated.style.textColor.includes('#33') || updated.style.textColor.includes('#44')) {
          updated.style.textColor = '#e2e8f0';
        }
        if (!updated.style.headingColor || updated.style.headingColor.includes('#55')) {
          updated.style.headingColor = '#ffffff';
        }

        // 2. Fix spacing rhythm
        if (b.type === 'hero') {
          updated.style.paddingTop = Math.max(48, updated.style.paddingTop);
          updated.style.paddingBottom = Math.max(48, updated.style.paddingBottom);
        } else if (b.type === 'featureGrid' || b.type === 'pricing') {
          updated.style.paddingTop = Math.max(56, updated.style.paddingTop);
          updated.style.paddingBottom = Math.max(56, updated.style.paddingBottom);
        }

        // 3. Fix font size
        if (updated.style.fontSize && updated.style.fontSize < 14) {
          updated.style.fontSize = 15;
        }

        return updated;
      });

      onApplyAutoFix(fixedBlocks);
      setIsFixing(false);
      setFixedSuccess(true);
    }, 500);
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
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                Audit de Design & Accessibilité IA (UI Linter)
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                  Norme WCAG AA
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Analyse en temps réel des contrastes, hiérarchie typographique et équilibre des espacements.
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

        {/* Health Score Overview Banner */}
        <div className="p-6 bg-[#070a12] border-b border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Score Ring Gauge */}
            <div className="relative w-16 h-16 rounded-full flex items-center justify-center border-4 border-emerald-500/30 bg-emerald-950/40 text-white font-black text-lg font-mono shadow-inner shadow-emerald-500/20">
              <span>{healthScore}</span>
              <span className="text-[10px] text-emerald-400 absolute bottom-1.5 font-sans font-bold">/100</span>
            </div>

            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                Score de Santé UI & Accessibilité :
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  healthScore >= 90 ? 'bg-emerald-500/20 text-emerald-300' : healthScore >= 75 ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {healthScore >= 90 ? 'Excellent' : healthScore >= 75 ? 'Conforme avec alertes' : 'Corrections requises'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {issues.length === 0 
                  ? 'Aucun problème détecté. Votre interface respecte les standards les plus stricts.' 
                  : `${issues.length} points d&apos;optimisation identifiés sur l&apos;ensemble de vos sections.`}
              </p>
            </div>
          </div>

          <button
            onClick={handleRunAutoFix}
            disabled={issues.length === 0 || isFixing}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-lg ${
              issues.length === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/25 active:scale-95'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Appliquer les corrections auto</span>
          </button>
        </div>

        {/* Filter Categories */}
        <div className="px-6 py-2.5 border-b border-white/[0.06] bg-[#090d18] flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all' as const, label: `Tous les points (${issues.length})`, icon: Activity },
            { id: 'contrast' as const, label: `Contraste WCAG (${issues.filter((i) => i.category === 'contrast').length})`, icon: Palette },
            { id: 'typography' as const, label: `Typographie (${issues.filter((i) => i.category === 'typography').length})`, icon: Type },
            { id: 'spacing' as const, label: `Espacement & Rythme (${issues.filter((i) => i.category === 'spacing').length})`, icon: Ruler },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = filterCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Issues List */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-3">
          {fixedSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Corrections automatiques appliquées avec succès sur l&apos;ensemble du Canvas !</span>
            </div>
          )}

          {filteredIssues.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
              <p className="font-semibold text-white">Aucun problème dans cette catégorie</p>
              <p className="text-slate-500">Tous les critères sont conformes aux normes de design.</p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all flex items-start gap-3"
              >
                <div className={`p-2 rounded-lg shrink-0 ${
                  issue.severity === 'error'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : issue.severity === 'warning'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-white truncate">{issue.title}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-slate-300 shrink-0">
                      {issue.blockName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {issue.description}
                  </p>
                  <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span>Recommandation IA : {issue.recommendation}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-[#0d1220] flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {issues.length} élément(s) scanné(s) &bull; Normes WCAG 2.1 AA
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/15 text-white transition-colors"
          >
            Fermer le scanner
          </button>
        </div>
      </div>
    </div>
  );
};
