'use client';

import React, { useState } from 'react';
import { 
  SlidersHorizontal, Code2, GitPullRequest, Copy, Check, Download, 
  Rotate3d, Sparkles, LayoutGrid, Box, Eye, CheckCircle, 
  XCircle, ArrowRight, Layers, Type, Move, Palette, Undo, 
  RefreshCw, Orbit, Maximize2, Paintbrush, Square, 
  X, ChevronDown, ChevronRight, MousePointerClick, Tag, Link2, DollarSign, 
  Zap, Plus, Trash2, AlignLeft, AlignCenter, AlignRight, Bold, MoveUp, MoveDown,
  Info, ExternalLink, Image as ImageIcon, Sliders, Sun
} from 'lucide-react';
import { 
  CanvasBlock, AIDiffProposal, RightSidebarTab, ThreeDConfig, TwoDConfig,
  SelectedElementInfo, ElementCustomStyle, BlockType
} from '@/types/builder';
import { TWOD_PRESETS } from '../canvas/TwoDCanvasWidget';

interface RightSidebarProps {
  selectedBlock: CanvasBlock | null;
  selectedElement: SelectedElementInfo | null;
  onSelectElement?: (elem: SelectedElementInfo | null) => void;
  onUpdateBlock: (updated: CanvasBlock) => void;
  onDeleteBlock?: (id: string) => void;
  onDuplicateBlock?: (id: string) => void;
  onMoveBlock?: (id: string, direction: 'up' | 'down') => void;
  generatedCode: string;
  activeDiff: AIDiffProposal | null;
  onAcceptDiff: () => void;
  onRejectDiff: () => void;
  themeAccent?: string;
  isOpen?: boolean;
  onClose?: () => void;
  width?: number;
  blocks?: CanvasBlock[];
  onSelectBlockId?: (id: string | null) => void;
  onAddBlock?: (type: BlockType) => void;
}

const ANIMATION_TARGET_OPTIONS = [
  { value: 'block', label: 'La section entière' },
  { value: 'title', label: 'Le titre principal' },
  { value: 'subtitle', label: 'Le sous-titre' },
  { value: 'badge', label: 'Badge / Tag' },
  { value: 'primaryCta', label: 'Bouton d\'action principal' },
  { value: 'secondaryCta', label: 'Bouton d\'action secondaire' },
  { value: 'visuals', label: 'Visuels / Grille / Cartes' },
  { value: 'footerBrand', label: 'Marque (Pied de page)' },
  { value: 'nav', label: 'Navigation / Logo' }
];

export const RightSidebar: React.FC<RightSidebarProps> = ({
  selectedBlock,
  selectedElement,
  onSelectElement,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onMoveBlock,
  generatedCode,
  activeDiff,
  onAcceptDiff,
  onRejectDiff,
  themeAccent = '#6366f1',
  isOpen = true,
  onClose,
  width = 380,
  blocks = [],
  onSelectBlockId,
  onAddBlock,
}) => {
  const [activeTab, setActiveTab] = useState<RightSidebarTab>('style');
  const [copiedCode, setCopiedCode] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  // Auto switch tab when selecting a 3D or 2D block
  React.useEffect(() => {
    if (selectedBlock?.type === 'canvas3d') {
      setActiveTab('three');
    } else if (selectedBlock?.type === 'canvas2d') {
      setActiveTab('two');
    }
  }, [selectedBlock?.id, selectedBlock?.type]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  // Collapsible Accordion Sections State
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    selector: true,
    layout: true,
    spacing: true,
    typography: true,
    background: true,
    border: true,
    effects: true,
    content: true,
    threed: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hasPendingDiff = activeDiff && !activeDiff.applied;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'OpenDesignPage.tsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper for updating section-level style
  const updateBlockStyle = (key: keyof CanvasBlock['style'], value: any) => {
    if (!selectedBlock) return;
    onUpdateBlock({
      ...selectedBlock,
      style: {
        ...selectedBlock.style,
        [key]: value,
      },
    });
  };

  // Helper for updating 3D Canvas config
  const update3DConfig = (key: keyof ThreeDConfig, value: any) => {
    if (!selectedBlock || selectedBlock.type !== 'canvas3d') return;
    const current3D = selectedBlock.threeConfig || (selectedBlock.content as any).threeDConfig || {
      meshType: 'icosahedron',
      wireframe: true,
      glassFactor: 0.8,
      rotationSpeed: 0.01,
      floatSpeed: 0.005,
      lightIntensity: 1.5,
      color: '#6366f1',
      glowColor: '#38bdf8',
      rx: 25,
      ry: 45,
      rz: 0,
      scale: 1,
      particleCount: 150,
      showGizmo: true,
    };

    onUpdateBlock({
      ...selectedBlock,
      threeConfig: {
        ...current3D,
        [key]: value,
      },
      content: {
        ...selectedBlock.content,
        threeDConfig: {
          ...current3D,
          [key]: value,
        },
      } as any,
    });
  };

  // Helper for updating child element styles
  const updateElementStyle = (styleKey: keyof ElementCustomStyle, value: any) => {
    if (!selectedBlock || !selectedElement) return;
    const { elementKey } = selectedElement;
    const elementStyles = selectedBlock.content.elementStyles || {};
    const currentElemStyle = elementStyles[elementKey] || {};

    onUpdateBlock({
      ...selectedBlock,
      content: {
        ...selectedBlock.content,
        elementStyles: {
          ...elementStyles,
          [elementKey]: {
            ...currentElemStyle,
            [styleKey]: value,
          },
        },
      },
    });
  };

  // Helper for updating text content directly
  const updateContentField = (key: string, value: any) => {
    if (!selectedBlock) return;
    onUpdateBlock({
      ...selectedBlock,
      content: {
        ...selectedBlock.content,
        [key]: value,
      },
    });
  };

  if (!isOpen) return null;

  // Determine current active styles
  const isElementSelected = Boolean(selectedElement && selectedElement.elementKey !== 'section');
  const currentElemKey = selectedElement ? selectedElement.elementKey : 'section';
  const elementStyles = selectedBlock?.content.elementStyles || {};
  const currentElemStyle: ElementCustomStyle = isElementSelected
    ? elementStyles[currentElemKey] || {}
    : {};

  const currentCategory = selectedElement?.category || 'section';

  // Helper to generate CSS gradient string
  const buildCssGradient = (
    type: 'solid' | 'linear' | 'radial' | 'diamond',
    c1: string,
    c2: string,
    ang: number
  ) => {
    if (type === 'solid') return c1;
    if (type === 'linear') return `linear-gradient(${ang}deg, ${c1}, ${c2})`;
    if (type === 'radial') return `radial-gradient(circle at center, ${c1}, ${c2})`;
    if (type === 'diamond') {
      return `conic-gradient(from ${ang}deg at 50% 50%, ${c1} 0deg 90deg, ${c2} 90deg 180deg, ${c1} 180deg 270deg, ${c2} 270deg 360deg)`;
    }
    return c1;
  };

  const updateGradientBackground = (
    type: 'solid' | 'linear' | 'radial' | 'diamond',
    c1: string,
    c2: string,
    ang: number
  ) => {
    if (!selectedBlock) return;
    const finalBg = buildCssGradient(type, c1, c2, ang);

    if (isElementSelected && selectedElement) {
      const { elementKey } = selectedElement;
      const elementStyles = selectedBlock.content.elementStyles || {};
      const currentElemStyle = elementStyles[elementKey] || {};

      onUpdateBlock({
        ...selectedBlock,
        content: {
          ...selectedBlock.content,
          elementStyles: {
            ...elementStyles,
            [elementKey]: {
              ...currentElemStyle,
              backgroundType: type,
              gradientStartColor: c1,
              gradientEndColor: c2,
              gradientAngle: ang,
              background: finalBg,
              backgroundColor: finalBg,
            },
          },
        },
      });
    } else {
      onUpdateBlock({
        ...selectedBlock,
        style: {
          ...selectedBlock.style,
          backgroundType: type,
          gradientStartColor: c1,
          gradientEndColor: c2,
          gradientAngle: ang,
          background: finalBg,
          backgroundColor: finalBg,
        },
      });
    }
  };

  const currentBgType = isElementSelected
    ? (currentElemStyle.backgroundType || (currentElemStyle.background?.includes('gradient') || currentElemStyle.backgroundColor?.includes('gradient') ? 'linear' : 'solid'))
    : (selectedBlock?.style.backgroundType || (selectedBlock?.style.background?.includes('gradient') || selectedBlock?.style.backgroundColor?.includes('gradient') ? 'linear' : 'solid'));

  const currentC1 = isElementSelected
    ? (currentElemStyle.gradientStartColor || (currentElemStyle.backgroundColor && !currentElemStyle.backgroundColor.includes('gradient') ? currentElemStyle.backgroundColor : '#4f46e5'))
    : (selectedBlock?.style.gradientStartColor || (selectedBlock?.style.backgroundColor && !selectedBlock?.style.backgroundColor.includes('gradient') ? selectedBlock?.style.backgroundColor : '#111827'));

  const currentC2 = isElementSelected
    ? (currentElemStyle.gradientEndColor || '#a855f7')
    : (selectedBlock?.style.gradientEndColor || '#311042');

  const currentAngle = isElementSelected
    ? (currentElemStyle.gradientAngle ?? 135)
    : (selectedBlock?.style.gradientAngle ?? 135);

  const currentIsGradientText = isElementSelected
    ? Boolean(currentElemStyle.isGradientText)
    : Boolean(selectedBlock?.style.isGradientText);

  return (
    <aside 
      className="h-full bg-[#121318] border-l border-white/10 flex flex-col shrink-0 text-slate-200 select-none overflow-hidden z-20 shadow-2xl transition-all"
      style={{ width }}
    >
      {/* HEADER */}
      <div className="h-13 px-4 border-b border-white/10 flex items-center justify-between bg-[#161820] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white tracking-wide">Propriétés & Inspector</h2>
            <p className="text-[10px] text-slate-400 font-mono">
              {selectedBlock ? selectedBlock.name : 'Aucune sélection'}
            </p>
          </div>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Fermer le panneau"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center border-b border-white/10 bg-[#161820]/60 p-1 gap-1 shrink-0">
        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
            activeTab === 'style' 
              ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-sm' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-indigo-400" />
          <span>Style</span>
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
            activeTab === 'content' 
              ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-sm' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Type className="w-3.5 h-3.5 text-sky-400" />
          <span>Contenu</span>
        </button>

        <button
          onClick={() => setActiveTab('three')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
            activeTab === 'three' 
              ? 'bg-pink-600/30 text-white border border-pink-500/40 shadow-sm' 
              : 'text-pink-400 hover:text-pink-300 hover:bg-white/5'
          }`}
        >
          <Rotate3d className="w-3.5 h-3.5 text-pink-400" />
          <span>Studio 3D</span>
        </button>

        <button
          onClick={() => setActiveTab('two')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
            activeTab === 'two' 
              ? 'bg-pink-600/30 text-white border border-pink-500/40 shadow-sm' 
              : 'text-pink-400 hover:text-pink-300 hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Studio Anim.</span>
        </button>

        {hasPendingDiff && (
          <button
            onClick={() => setActiveTab('diff')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium relative transition-all ${
              activeTab === 'diff' 
                ? 'bg-emerald-600/30 text-white border border-emerald-500/40 shadow-sm' 
                : 'text-emerald-400 hover:bg-emerald-500/10'
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            <span>Diff IA</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-1 right-1" />
          </button>
        )}

        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
            activeTab === 'code' 
              ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-sm' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-purple-400" />
          <span>Code</span>
        </button>
      </div>

      {/* MAIN SIDEBAR CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        {!selectedBlock ? (
          /* EMPTY SELECTION STATE */
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 my-auto">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
              <Box className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Aucun élément sélectionné</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
                Cliquez sur n&apos;importe quel bloc ou élément dans le Canvas pour modifier ses propriétés en temps réel.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* ELEMENT / SECTION IDENTITY BAR */}
            <div className="p-3 rounded-lg bg-[#181a22] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-indigo-400 font-bold uppercase tracking-wider text-[10px]">Cible Active</span>
                </div>
                {isElementSelected && (
                  <button
                    onClick={() => {
                      if (onSelectElement && selectedBlock) {
                        onSelectElement({
                          blockId: selectedBlock.id,
                          elementKey: 'section',
                          category: 'section',
                          label: `Section: ${selectedBlock.name}`,
                        });
                      }
                    }}
                    className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded border border-white/10 transition-colors"
                  >
                    <Box className="w-3 h-3 text-indigo-400" />
                    <span>Sélectionner Section</span>
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between bg-[#101116] rounded-md px-2.5 py-1.5 border border-white/10">
                <div className="flex items-center gap-2 font-mono text-xs min-w-0">
                  <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px] border border-indigo-500/30">
                    &lt;{currentElemStyle.htmlTag || getDefaultTag(currentCategory, currentElemKey)}&gt;
                  </span>
                  <span className="text-white font-semibold truncate">
                    .{currentElemKey}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {isElementSelected && (
                    <button
                      onClick={() => updateElementStyle('hidden', true)}
                      className="p-1 px-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-[10px] flex items-center gap-1 transition-colors"
                      title="Masquer / Supprimer cet élément"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Masquer</span>
                    </button>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono">
                    {isElementSelected ? 'Élément' : 'Section'}
                  </span>
                </div>
              </div>
            </div>

            {/* TAB 1: STYLE */}
            {activeTab === 'style' && (
              <div className="space-y-3">
                {/* ACCORDION 1: DISPOSITION (LAYOUT) */}
                <AccordionSection
                  title="Disposition & Alignement"
                  isOpen={openSections.layout}
                  onToggle={() => toggleSection('layout')}
                >
                  <div className="space-y-3">
                    {/* Display type */}
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Display</label>
                      <div className="grid grid-cols-4 gap-1 p-1 bg-white/5 rounded-md border border-white/10">
                        {['block', 'flex', 'grid', 'inline-block'].map((disp) => {
                          const active = isElementSelected 
                            ? currentElemStyle.display === disp
                            : selectedBlock.style.display === disp;
                          return (
                            <button
                              key={disp}
                              onClick={() => {
                                if (isElementSelected) {
                                  updateElementStyle('display', disp);
                                } else if (disp === 'flex' || disp === 'grid') {
                                  updateBlockStyle('display', disp);
                                }
                              }}
                              className={`py-1 text-[10px] font-mono capitalize rounded transition-colors ${
                                active ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {disp}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Text Align */}
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Alignement du texte</label>
                      <div className="flex rounded-md border border-white/10 bg-white/5 p-0.5">
                        {[
                          { key: 'left', icon: AlignLeft },
                          { key: 'center', icon: AlignCenter },
                          { key: 'right', icon: AlignRight },
                        ].map((item) => {
                          const IconComp = item.icon;
                          const currentAlign = isElementSelected ? currentElemStyle.textAlign : 'left';
                          const active = currentAlign === item.key;
                          return (
                            <button
                              key={item.key}
                              onClick={() => {
                                if (isElementSelected) {
                                  updateElementStyle('textAlign', item.key);
                                }
                              }}
                              className={`flex-1 py-1 flex items-center justify-center rounded transition-colors ${
                                active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              <IconComp className="w-3.5 h-3.5" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {isElementSelected && (currentElemStyle.x || currentElemStyle.y) && (
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">Position 2D (X: {currentElemStyle.x || 0}px, Y: {currentElemStyle.y || 0}px)</span>
                        <button
                          onClick={() => {
                            updateElementStyle('x', 0);
                            updateElementStyle('y', 0);
                          }}
                          className="text-[10px] text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-2 py-1 rounded transition-colors"
                        >
                          Réinitialiser Position 2D
                        </button>
                      </div>
                    )}
                  </div>
                </AccordionSection>

                {/* ACCORDION 2: MARGINS & PADDINGS (SPACING) */}
                <AccordionSection
                  title="Marges & Espacement"
                  isOpen={openSections.spacing}
                  onToggle={() => toggleSection('spacing')}
                >
                  <div className="space-y-3">
                    {/* Visual Box Model */}
                    <div className="p-3 bg-white/[0.02] border border-white/10 rounded-lg space-y-2">
                      <div className="text-[10px] uppercase font-mono text-slate-400 text-center">Modèle de Boîte (Box Model)</div>
                      
                      {/* Padding Controls */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Padding Haut (px)</label>
                          <input
                            type="number"
                            value={isElementSelected ? (currentElemStyle.paddingTop ?? 0) : selectedBlock.style.paddingTop}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (isElementSelected) updateElementStyle('paddingTop', val);
                              else updateBlockStyle('paddingTop', val);
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Padding Bas (px)</label>
                          <input
                            type="number"
                            value={isElementSelected ? (currentElemStyle.paddingBottom ?? 0) : selectedBlock.style.paddingBottom}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (isElementSelected) updateElementStyle('paddingBottom', val);
                              else updateBlockStyle('paddingBottom', val);
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Padding Gauche (px)</label>
                          <input
                            type="number"
                            value={isElementSelected ? (currentElemStyle.paddingLeft ?? 0) : selectedBlock.style.paddingLeft}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (isElementSelected) updateElementStyle('paddingLeft', val);
                              else updateBlockStyle('paddingLeft', val);
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Padding Droite (px)</label>
                          <input
                            type="number"
                            value={isElementSelected ? (currentElemStyle.paddingRight ?? 0) : selectedBlock.style.paddingRight}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (isElementSelected) updateElementStyle('paddingRight', val);
                              else updateBlockStyle('paddingRight', val);
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                      </div>

                      {/* Margin controls if element is selected */}
                      {isElementSelected && (
                        <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Marge Haut (px)</label>
                            <input
                              type="number"
                              value={currentElemStyle.marginTop ?? 0}
                              onChange={(e) => updateElementStyle('marginTop', Number(e.target.value))}
                              className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Marge Bas (px)</label>
                            <input
                              type="number"
                              value={currentElemStyle.marginBottom ?? 0}
                              onChange={(e) => updateElementStyle('marginBottom', Number(e.target.value))}
                              className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionSection>

                {/* ACCORDION 3: TYPOGRAPHY */}
                <AccordionSection
                  title="Typographie & Texte"
                  isOpen={openSections.typography}
                  onToggle={() => toggleSection('typography')}
                >
                  <div className="space-y-3">
                    {/* Font Family */}
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Police de caractères</label>
                      <select
                        value={isElementSelected ? (currentElemStyle.fontFamily || 'Inter') : 'Inter'}
                        onChange={(e) => {
                          if (isElementSelected) updateElementStyle('fontFamily', e.target.value);
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                        <option value="Inter">Inter</option>
                        <option value="Playfair Display">Playfair Display (Serif)</option>
                        <option value="Roboto">Roboto</option>
                        <option value="monospace">Monospace</option>
                      </select>
                    </div>

                    {/* Font Size & Weight */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Taille (px)</label>
                        <input
                          type="number"
                          value={isElementSelected ? (currentElemStyle.fontSize ?? 16) : (selectedBlock.style.fontSize ?? 16)}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (isElementSelected) updateElementStyle('fontSize', val);
                            else updateBlockStyle('fontSize', val);
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Graisse (Weight)</label>
                        <select
                          value={isElementSelected ? (currentElemStyle.fontWeight || 'normal') : 'normal'}
                          onChange={(e) => {
                            if (isElementSelected) updateElementStyle('fontWeight', e.target.value);
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                        >
                          <option value="normal">Normal (400)</option>
                          <option value="medium">Medium (500)</option>
                          <option value="semibold">Semi-Bold (600)</option>
                          <option value="bold">Bold (700)</option>
                          <option value="extrabold">Extra-Bold (800)</option>
                        </select>
                      </div>
                    </div>

                    {/* Text Color */}
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Couleur du texte</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={isElementSelected ? (currentElemStyle.textColor || currentElemStyle.color || '#ffffff') : (selectedBlock.style.textColor || '#ffffff')}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (isElementSelected) {
                              updateElementStyle('textColor', val);
                              updateElementStyle('color', val);
                            } else {
                              updateBlockStyle('textColor', val);
                              updateBlockStyle('headingColor', val);
                            }
                          }}
                          className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={isElementSelected ? (currentElemStyle.textColor || currentElemStyle.color || '#ffffff') : (selectedBlock.style.textColor || '#ffffff')}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (isElementSelected) {
                              updateElementStyle('textColor', val);
                              updateElementStyle('color', val);
                            } else {
                              updateBlockStyle('textColor', val);
                              updateBlockStyle('headingColor', val);
                            }
                          }}
                          className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionSection>

                {/* ACCORDION 4: BACKGROUND & GRADIENTS */}
                <AccordionSection
                  title="Arrière-plan & Dégradés"
                  isOpen={openSections.background}
                  onToggle={() => toggleSection('background')}
                >
                  <div className="space-y-3.5">
                    {/* Gradient Type Selector Tabs */}
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                        Type d&apos;arrière-plan
                      </label>
                      <div className="grid grid-cols-4 gap-1 p-1 bg-black/40 rounded-lg border border-white/10">
                        {[
                          { id: 'solid', label: 'Uni' },
                          { id: 'linear', label: 'Linéaire' },
                          { id: 'radial', label: 'Radial' },
                          { id: 'diamond', label: 'Losange' },
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => updateGradientBackground(t.id as any, currentC1, currentC2, currentAngle)}
                            className={`py-1 text-[10px] font-semibold rounded-md transition-all ${
                              currentBgType === t.id
                                ? 'bg-indigo-600 text-white shadow-md font-bold'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color inputs */}
                    {currentBgType === 'solid' ? (
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Couleur Unie</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={currentC1.startsWith('#') ? currentC1 : '#111827'}
                            onChange={(e) => updateGradientBackground('solid', e.target.value, currentC2, currentAngle)}
                            className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer shrink-0"
                          />
                          <input
                            type="text"
                            value={currentC1}
                            onChange={(e) => updateGradientBackground('solid', e.target.value, currentC2, currentAngle)}
                            className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Couleur 1 (Départ)</label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={currentC1.startsWith('#') ? currentC1 : '#4f46e5'}
                                onChange={(e) => updateGradientBackground(currentBgType, e.target.value, currentC2, currentAngle)}
                                className="w-7 h-7 rounded border border-white/20 bg-transparent cursor-pointer shrink-0"
                              />
                              <input
                                type="text"
                                value={currentC1}
                                onChange={(e) => updateGradientBackground(currentBgType, e.target.value, currentC2, currentAngle)}
                                className="w-full bg-black/40 border border-white/10 rounded px-1.5 py-1 text-[10px] text-white font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Couleur 2 (Fin)</label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={currentC2.startsWith('#') ? currentC2 : '#a855f7'}
                                onChange={(e) => updateGradientBackground(currentBgType, currentC1, e.target.value, currentAngle)}
                                className="w-7 h-7 rounded border border-white/20 bg-transparent cursor-pointer shrink-0"
                              />
                              <input
                                type="text"
                                value={currentC2}
                                onChange={(e) => updateGradientBackground(currentBgType, currentC1, e.target.value, currentAngle)}
                                className="w-full bg-black/40 border border-white/10 rounded px-1.5 py-1 text-[10px] text-white font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Reverse gradient button */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => updateGradientBackground(currentBgType, currentC2, currentC1, currentAngle)}
                            className="text-[10px] text-indigo-300 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Inverser les couleurs</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Angle Slider for Linear & Diamond */}
                    {(currentBgType === 'linear' || currentBgType === 'diamond') && (
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span>Angle / Orientation</span>
                          <span className="font-mono text-indigo-300 font-bold">{currentAngle}°</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={360}
                          step={5}
                          value={currentAngle}
                          onChange={(e) => updateGradientBackground(currentBgType, currentC1, currentC2, Number(e.target.value))}
                          className="w-full accent-indigo-500 bg-white/10 h-1.5 rounded-lg cursor-pointer"
                        />
                        <div className="grid grid-cols-4 gap-1 mt-1.5">
                          {[45, 90, 135, 180].map((deg) => (
                            <button
                              key={deg}
                              onClick={() => updateGradientBackground(currentBgType, currentC1, currentC2, deg)}
                              className={`py-0.5 text-[9px] rounded font-mono transition-colors ${
                                currentAngle === deg
                                  ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/50 font-bold'
                                  : 'bg-white/5 text-slate-400 hover:text-white'
                              }`}
                            >
                              {deg}°
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Gradient Text Mode Toggle */}
                    {currentBgType !== 'solid' && (
                      <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-semibold text-indigo-200">Mode Texte en Dégradé</p>
                          <p className="text-[9px] text-slate-400">Applique le dégradé directement sur le texte</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (isElementSelected) {
                              updateElementStyle('isGradientText', !currentIsGradientText);
                            } else {
                              updateBlockStyle('isGradientText', !currentIsGradientText);
                            }
                          }}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors relative shrink-0 ${
                            currentIsGradientText ? 'bg-indigo-600' : 'bg-white/20'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform ${
                              currentIsGradientText ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    )}

                    {/* Live Gradient Preview Swatch */}
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Aperçu du Rendu</label>
                      <div
                        className="w-full h-9 rounded-lg border border-white/20 shadow-inner flex items-center justify-center text-[10px] font-mono font-bold tracking-wider drop-shadow overflow-hidden"
                        style={
                          currentIsGradientText
                            ? {
                                background: buildCssGradient(currentBgType, currentC1, currentC2, currentAngle),
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                                WebkitTextFillColor: 'transparent',
                              }
                            : {
                                background: buildCssGradient(currentBgType, currentC1, currentC2, currentAngle),
                                color: '#ffffff',
                              }
                        }
                      >
                        {currentIsGradientText ? 'TEXTE EN DÉGRADÉ' : currentBgType.toUpperCase()}
                      </div>
                    </div>

                    {/* Presets Swatches Gallery */}
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1.5">Préréglages de Dégradés</label>
                      <div className="grid grid-cols-5 gap-1.5">
                        {[
                          { label: 'Indigo Dusk', type: 'linear', c1: '#4f46e5', c2: '#a855f7', angle: 135 },
                          { label: 'Cyber Ocean', type: 'linear', c1: '#0284c7', c2: '#06b6d4', angle: 135 },
                          { label: 'Neon Diamond', type: 'diamond', c1: '#6366f1', c2: '#ec4899', angle: 45 },
                          { label: 'Dark Radial', type: 'radial', c1: '#312e81', c2: '#0f172a', angle: 0 },
                          { label: 'Sunset Fire', type: 'linear', c1: '#f97316', c2: '#ef4444', angle: 135 },
                          { label: 'Emerald Mint', type: 'linear', c1: '#059669', c2: '#10b981', angle: 135 },
                          { label: 'Glass Dark', type: 'linear', c1: '#1e293b', c2: '#0f172a', angle: 180 },
                          { label: 'Golden Luxury', type: 'linear', c1: '#eab308', c2: '#ca8a04', angle: 135 },
                          { label: 'Pure White', type: 'solid', c1: '#ffffff', c2: '#ffffff', angle: 0 },
                          { label: 'Transparent', type: 'solid', c1: 'transparent', c2: 'transparent', angle: 0 },
                        ].map((p, idx) => {
                          const bgCss = buildCssGradient(p.type as any, p.c1, p.c2, p.angle);
                          return (
                            <button
                              key={idx}
                              onClick={() => updateGradientBackground(p.type as any, p.c1, p.c2, p.angle)}
                              style={{ background: bgCss }}
                              className="h-6 rounded-md border border-white/20 hover:scale-105 active:scale-95 transition-all shadow-sm"
                              title={p.label}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </AccordionSection>

                {/* ACCORDION 5: BORDERS & RADIUS */}
                <AccordionSection
                  title="Bordures & Coins"
                  isOpen={openSections.border}
                  onToggle={() => toggleSection('border')}
                >
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Border Radius (px)</label>
                        <input
                          type="number"
                          value={isElementSelected ? (currentElemStyle.borderRadius ?? 8) : selectedBlock.style.borderRadius}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (isElementSelected) updateElementStyle('borderRadius', val);
                            else updateBlockStyle('borderRadius', val);
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Épaisseur bordure (px)</label>
                        <input
                          type="number"
                          value={isElementSelected ? (currentElemStyle.borderWidth ?? 0) : selectedBlock.style.borderWidth}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (isElementSelected) updateElementStyle('borderWidth', val);
                            else updateBlockStyle('borderWidth', val);
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Couleur de bordure</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={isElementSelected ? (currentElemStyle.borderColor || '#334155') : selectedBlock.style.borderColor}
                          onChange={(e) => {
                            if (isElementSelected) updateElementStyle('borderColor', e.target.value);
                            else updateBlockStyle('borderColor', e.target.value);
                          }}
                          className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={isElementSelected ? (currentElemStyle.borderColor || '#334155') : selectedBlock.style.borderColor}
                          onChange={(e) => {
                            if (isElementSelected) updateElementStyle('borderColor', e.target.value);
                            else updateBlockStyle('borderColor', e.target.value);
                          }}
                          className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionSection>

                {/* ACCORDION 6: CANVAS 3D SPECIFIC CONFIG */}
                {selectedBlock.type === 'canvas3d' && (() => {
                  const threeConfig = selectedBlock.threeConfig || (selectedBlock.content as any).threeDConfig || {};
                  return (
                    <AccordionSection
                      title="Paramètres Objet 3D Studio"
                      isOpen={openSections.threed}
                      onToggle={() => toggleSection('threed')}
                    >
                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">Forme 3D (Mesh)</label>
                          <select
                            value={threeConfig.meshType || 'icosahedron'}
                            onChange={(e) => update3DConfig('meshType', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                          >
                            <option value="icosahedron">Icosaèdre Réseau</option>
                            <option value="torusKnot">Noeud Torique Quantum</option>
                            <option value="cyberCube">Cube Cybernéthique</option>
                            <option value="sphere">Sphère Luminescente</option>
                            <option value="rings">Anneaux Concentriques</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-300">Mode Fil de Fer (Wireframe)</span>
                          <input
                            type="checkbox"
                            checked={threeConfig.wireframe ?? true}
                            onChange={(e) => update3DConfig('wireframe', e.target.checked)}
                            className="w-4 h-4 rounded border-white/20 accent-indigo-600"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                            <span>Vitesse de Rotation</span>
                            <span>{threeConfig.rotationSpeed || 0.01}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="0.05"
                            step="0.002"
                            value={threeConfig.rotationSpeed || 0.01}
                            onChange={(e) => update3DConfig('rotationSpeed', Number(e.target.value))}
                            className="w-full accent-indigo-500"
                          />
                        </div>
                      </div>
                    </AccordionSection>
                  );
                })()}

                {/* Hidden Elements Manager */}
                {activeTab === 'style' && selectedBlock && (() => {
                  const hiddenElements = Object.entries(selectedBlock.content.elementStyles || {}).filter(
                    ([_, st]) => st && (st as ElementCustomStyle).hidden
                  );
                  if (hiddenElements.length === 0) return null;
                  return (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          Éléments masqués ({hiddenElements.length})
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {hiddenElements.map(([key]) => (
                          <div key={key} className="flex items-center justify-between bg-black/40 rounded px-2.5 py-1.5 border border-white/10 text-xs">
                            <span className="font-mono text-slate-300 truncate">.{key}</span>
                            <button
                              onClick={() => {
                                const updatedStyles = { ...(selectedBlock.content.elementStyles || {}) };
                                if (updatedStyles[key]) {
                                  updatedStyles[key] = { ...updatedStyles[key], hidden: false };
                                }
                                onUpdateBlock({
                                  ...selectedBlock,
                                  content: {
                                    ...selectedBlock.content,
                                    elementStyles: updatedStyles,
                                  },
                                });
                              }}
                              className="text-[10px] text-indigo-300 hover:text-white bg-indigo-500/20 hover:bg-indigo-500/30 px-2 py-0.5 rounded border border-indigo-500/30 transition-colors"
                            >
                              Rétablir (Afficher)
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB: THREE.JS STUDIO */}
            {activeTab === 'three' && (() => {
              if (selectedBlock?.type === 'canvas3d') {
                const threeConfig = selectedBlock.threeConfig || (selectedBlock.content as any).threeDConfig || {
                meshType: 'icosahedron',
                wireframe: false,
                glassFactor: 0.8,
                rotationSpeed: 0.8,
                floatSpeed: 1.2,
                lightIntensity: 1.5,
                color: '#6366f1',
                glowColor: '#a855f7',
                rx: 20,
                ry: 35,
                rz: 15,
                scale: 1,
                particleCount: 80,
                showGizmo: true,
              };

              // Helper to update three config field
              const set3D = (key: keyof ThreeDConfig, val: any) => {
                update3DConfig(key, val);
              };

              const handleModelFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = URL.createObjectURL(file);
                onUpdateBlock({
                  ...selectedBlock,
                  threeConfig: {
                    ...threeConfig,
                    meshType: 'customModel',
                    customModelFile: url,
                    customModelName: file.name,
                  },
                  content: {
                    ...selectedBlock.content,
                    threeDConfig: {
                      ...threeConfig,
                      meshType: 'customModel',
                      customModelFile: url,
                      customModelName: file.name,
                    },
                  } as any,
                });
              };

              return (
                <div className="space-y-4 pb-12 animate-fade-in">
                  {/* Section 1: Geometry & Model Loader */}
                  <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-pink-400 uppercase tracking-wider">
                      <Box className="w-3.5 h-3.5" />
                      <span>Géométrie & Modèles 3D</span>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Type d&apos;objet</label>
                      <select
                        value={threeConfig.meshType}
                        onChange={(e) => set3D('meshType', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="icosahedron">Icosaèdre Réseau</option>
                        <option value="torusKnot">Noeud Torique Quantum</option>
                        <option value="cyberCube">Cube Cybernéthique</option>
                        <option value="sphere">Sphère Luminescente</option>
                        <option value="rings">Anneaux Concentriques</option>
                        <option value="gltfPreset">Presets Low-Poly 3D</option>
                        <option value="customModel">Importer modèle GLTF / GLB</option>
                      </select>
                    </div>

                    {threeConfig.meshType === 'gltfPreset' && (
                      <div className="space-y-2 p-2 bg-black/30 rounded border border-white/5">
                        <label className="text-[10px] text-slate-400 block">Choisissez un modèle 3D Pro</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { id: 'astronaut', label: 'Astronaute' },
                            { id: 'cybercar', label: 'Voiture Cyber' },
                            { id: 'drone', label: 'Drone Sci-Fi' },
                            { id: 'terminal', label: 'Console Arcade' },
                          ].map((p) => (
                            <button
                              key={p.id}
                              onClick={() => set3D('gltfModelPreset', p.id)}
                              className={`py-1.5 px-2 rounded text-xs transition-all ${
                                threeConfig.gltfModelPreset === p.id
                                  ? 'bg-pink-600/30 text-white border border-pink-500/40 font-semibold'
                                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {threeConfig.meshType === 'customModel' && (
                      <div className="space-y-2.5 p-2.5 bg-black/30 rounded border border-white/5">
                        <div className="flex flex-col items-center justify-center border border-dashed border-white/10 rounded-lg p-4 hover:bg-white/[0.02] transition-colors relative cursor-pointer">
                          <input
                            type="file"
                            accept=".gltf,.glb"
                            onChange={handleModelFileUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <RefreshCw className="w-6 h-6 text-pink-400 mb-1.5 animate-pulse" />
                          <span className="text-[11px] text-slate-300 font-semibold">Téléverser .gltf / .glb</span>
                          <span className="text-[9px] text-slate-500 mt-0.5">Drag & drop ou cliquez pour naviguer</span>
                        </div>
                        {threeConfig.customModelName && (
                          <div className="flex items-center gap-1.5 justify-between bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                            <span className="text-[10px] text-emerald-300 truncate font-mono max-w-[80%]">
                              {threeConfig.customModelName}
                            </span>
                            <span className="text-[8px] bg-emerald-500 text-white font-mono px-1 rounded uppercase shrink-0">Loaded</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Échelle (Scale Factor)</span>
                        <span>{threeConfig.scale ?? 1}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.4"
                        max="2.5"
                        step="0.05"
                        value={threeConfig.scale ?? 1}
                        onChange={(e) => set3D('scale', parseFloat(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>
                  </div>

                  {/* Section 2: Studio Materials & Textures */}
                  <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase tracking-wider">
                      <Palette className="w-3.5 h-3.5" />
                      <span>Matériaux & Shaders Shading</span>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Preset de matériel</label>
                      <select
                        value={threeConfig.materialPreset || 'custom'}
                        onChange={(e) => set3D('materialPreset', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                      >
                        <optgroup label="Skins Cyber & Virtuels" className="bg-slate-900 text-slate-300">
                          <option value="custom">Manuel (Ajustements fins)</option>
                          <option value="matte">Mat Standard Pur</option>
                          <option value="cyberPlastic">Plastique Futuriste</option>
                          <option value="cyberGlass">Verre Cybernéthique</option>
                          <option value="chrome">Chrome Métallique Brillant</option>
                          <option value="hologram">Hologramme Fluorescent</option>
                          <option value="glowWireframe">Réseau Fil de fer Néon</option>
                        </optgroup>
                        <optgroup label="Métaux Réels" className="bg-slate-900 text-slate-300">
                          <option value="gold">Or Pur (Gold)</option>
                          <option value="copper">Cuivre Poli (Copper)</option>
                          <option value="brushedAluminum">Aluminium Brossé</option>
                          <option value="rustedIron">Fer Rouillé (Rust)</option>
                        </optgroup>
                        <optgroup label="Minéraux & Solides" className="bg-slate-900 text-slate-300">
                          <option value="marble">Marbre Blanc de Carrare</option>
                          <option value="concrete">Béton Brut</option>
                          <option value="ceramic">Céramique / Porcelaine</option>
                          <option value="asphalt">Asphalte Noir</option>
                        </optgroup>
                        <optgroup label="Matériaux Organiques" className="bg-slate-900 text-slate-300">
                          <option value="polishedWood">Bois de Séquoia Verni</option>
                          <option value="rawWood">Bois de Chêne Brut</option>
                          <option value="fabric">Tissu / Velours Doux</option>
                          <option value="rubber">Caoutchouc Souple</option>
                        </optgroup>
                        <optgroup label="Fluides & Transparents" className="bg-slate-900 text-slate-300">
                          <option value="clearGlass">Verre Cristal Clair</option>
                          <option value="water">Eau de Lagon Liquide</option>
                        </optgroup>
                        <optgroup label="Plastiques Classiques" className="bg-slate-900 text-slate-300">
                          <option value="glossyPlastic">Plastique Brillant</option>
                          <option value="mattePlastic">Plastique Mat</option>
                        </optgroup>
                      </select>
                    </div>

                    {(!threeConfig.materialPreset || threeConfig.materialPreset === 'custom') && (
                      <div className="space-y-3 p-2 bg-black/20 rounded border border-white/5">
                        <div>
                          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                            <span>Rugosité (Roughness)</span>
                            <span>{threeConfig.roughness ?? 0.15}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={threeConfig.roughness ?? 0.15}
                            onChange={(e) => set3D('roughness', parseFloat(e.target.value))}
                            className="w-full accent-sky-500 h-1 bg-white/10 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                            <span>Métallisme (Metalness)</span>
                            <span>{threeConfig.metalness ?? 0.85}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={threeConfig.metalness ?? 0.85}
                            onChange={(e) => set3D('metalness', parseFloat(e.target.value))}
                            className="w-full accent-sky-500 h-1 bg-white/10 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    )}

                    {(threeConfig.materialPreset === 'cyberGlass' || threeConfig.materialPreset === 'clearGlass' || threeConfig.materialPreset === 'water') && (
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>Opacité / Transparence</span>
                          <span>{(threeConfig.glassFactor ?? 0.85).toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={threeConfig.glassFactor ?? 0.85}
                          onChange={(e) => set3D('glassFactor', parseFloat(e.target.value))}
                          className="w-full accent-sky-400 h-1 bg-white/10 rounded-lg cursor-pointer"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between py-1">
                      <span className="text-xs text-slate-300">Affichage fil de fer</span>
                      <input
                        type="checkbox"
                        checked={threeConfig.wireframe}
                        onChange={(e) => set3D('wireframe', e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 accent-sky-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Textures Procédurales</label>
                      <select
                        value={threeConfig.texturePreset || 'none'}
                        onChange={(e) => set3D('texturePreset', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="none">Aucune texture</option>
                        <option value="grid">Grille Vectorielle Cyber</option>
                        <option value="neonWaves">Ondes Synthwave Dégradées</option>
                        <option value="carbon">Fibre de Carbone Tissée</option>
                        <option value="hologramLines">Lignes Entrelacées d&apos;Hologramme</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Couleur Base</label>
                        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded border border-white/10">
                          <input
                            type="color"
                            value={threeConfig.color}
                            onChange={(e) => set3D('color', e.target.value)}
                            className="w-6 h-6 rounded border border-white/20 bg-transparent cursor-pointer shrink-0"
                          />
                          <input
                            type="text"
                            value={threeConfig.color}
                            onChange={(e) => set3D('color', e.target.value)}
                            className="w-full bg-transparent border-0 text-[10px] text-white font-mono p-0 focus:ring-0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Couleur Émission</label>
                        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded border border-white/10">
                          <input
                            type="color"
                            value={threeConfig.glowColor}
                            onChange={(e) => set3D('glowColor', e.target.value)}
                            className="w-6 h-6 rounded border border-white/20 bg-transparent cursor-pointer shrink-0"
                          />
                          <input
                            type="text"
                            value={threeConfig.glowColor}
                            onChange={(e) => set3D('glowColor', e.target.value)}
                            className="w-full bg-transparent border-0 text-[10px] text-white font-mono p-0 focus:ring-0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Environment, Lights & Cameras */}
                  <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      <Sun className="w-3.5 h-3.5" />
                      <span>Environnement & Éclairage</span>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Intensité Lumineuse Globale</span>
                        <span>{threeConfig.lightIntensity}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="4.0"
                        step="0.1"
                        value={threeConfig.lightIntensity}
                        onChange={(e) => set3D('lightIntensity', parseFloat(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>

                    {/* Granular Lights Control */}
                    <div className="space-y-3.5 pt-2.5 border-t border-white/5">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Sources lumineuses individuelles</span>

                      {/* 1. Ambient Light */}
                      <div className="bg-black/30 p-2 rounded-lg border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium text-slate-300">1. Lumière Ambiante</span>
                          <div className="flex items-center gap-1.5 bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                            <input
                              type="color"
                              value={threeConfig.ambientLightColor || '#ffffff'}
                              onChange={(e) => set3D('ambientLightColor', e.target.value)}
                              className="w-4 h-4 rounded border border-white/20 bg-transparent cursor-pointer shrink-0"
                            />
                            <span className="text-[9px] text-slate-400 font-mono uppercase">{threeConfig.ambientLightColor || '#ffffff'}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                            <span>Luminosité diffuse</span>
                            <span>{threeConfig.ambientLightIntensity ?? 0.6}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.05"
                            value={threeConfig.ambientLightIntensity ?? 0.6}
                            onChange={(e) => set3D('ambientLightIntensity', parseFloat(e.target.value))}
                            className="w-full accent-indigo-400 h-1 bg-white/10 rounded"
                          />
                        </div>
                      </div>

                      {/* 2. Directional Light */}
                      <div className="bg-black/30 p-2 rounded-lg border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium text-slate-300">2. Lumière Directionnelle (Key)</span>
                          <div className="flex items-center gap-1.5 bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                            <input
                              type="color"
                              value={threeConfig.directionalLightColor || '#818cf8'}
                              onChange={(e) => set3D('directionalLightColor', e.target.value)}
                              className="w-4 h-4 rounded border border-white/20 bg-transparent cursor-pointer shrink-0"
                            />
                            <span className="text-[9px] text-slate-400 font-mono uppercase">{threeConfig.directionalLightColor || '#818cf8'}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                            <span>Puissance du faisceau</span>
                            <span>{threeConfig.directionalLightIntensity ?? 2.0}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="4"
                            step="0.1"
                            value={threeConfig.directionalLightIntensity ?? 2.0}
                            onChange={(e) => set3D('directionalLightIntensity', parseFloat(e.target.value))}
                            className="w-full accent-indigo-400 h-1 bg-white/10 rounded"
                          />
                        </div>
                      </div>

                      {/* 3. Point Light */}
                      <div className="bg-black/30 p-2 rounded-lg border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium text-slate-300">3. Projecteur de Détail (Point)</span>
                          <div className="flex items-center gap-1.5 bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                            <input
                              type="color"
                              value={threeConfig.pointLightColor || '#06b6d4'}
                              onChange={(e) => set3D('pointLightColor', e.target.value)}
                              className="w-4 h-4 rounded border border-white/20 bg-transparent cursor-pointer shrink-0"
                            />
                            <span className="text-[9px] text-slate-400 font-mono uppercase">{threeConfig.pointLightColor || '#06b6d4'}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                            <span>Concentration lumineuse</span>
                            <span>{threeConfig.pointLightIntensity ?? 2.0}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.1"
                            value={threeConfig.pointLightIntensity ?? 2.0}
                            onChange={(e) => set3D('pointLightIntensity', parseFloat(e.target.value))}
                            className="w-full accent-indigo-400 h-1 bg-white/10 rounded"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Poussières d&apos;étoiles (Particules)</span>
                        <span>{threeConfig.particleCount}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="400"
                        step="10"
                        value={threeConfig.particleCount}
                        onChange={(e) => set3D('particleCount', parseInt(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                      <div className="flex items-center justify-between py-1">
                        <span className="text-[11px] text-slate-300">Grille Helper (2D)</span>
                        <input
                          type="checkbox"
                          checked={threeConfig.showGridHelper ?? false}
                          onChange={(e) => set3D('showGridHelper', e.target.checked)}
                          className="w-3.5 h-3.5 rounded border-white/20 accent-indigo-500"
                        />
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <span className="text-[11px] text-slate-300">Grille Polaire (3D)</span>
                        <input
                          type="checkbox"
                          checked={threeConfig.showPolarGrid ?? false}
                          onChange={(e) => set3D('showPolarGrid', e.target.checked)}
                          className="w-3.5 h-3.5 rounded border-white/20 accent-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Kinetics & Studio Gizmos */}
                  <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      <Rotate3d className="w-3.5 h-3.5" />
                      <span>Cinétique & Caméras</span>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Vitesse de rotation</span>
                        <span>{threeConfig.rotationSpeed}x</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.1"
                        value={threeConfig.rotationSpeed}
                        onChange={(e) => set3D('rotationSpeed', parseFloat(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Intensité de flottaison</span>
                        <span>{threeConfig.floatSpeed}x</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.1"
                        value={threeConfig.floatSpeed}
                        onChange={(e) => set3D('floatSpeed', parseFloat(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>

                    <div className="flex items-center justify-between py-1 border-t border-white/5 pt-2">
                      <span className="text-xs text-slate-300">Afficher Gizmo Spatial</span>
                      <input
                        type="checkbox"
                        checked={threeConfig.showGizmo}
                        onChange={(e) => set3D('showGizmo', e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 accent-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Section 5: Studio d'Animation Intuitif (No-Code & Pour les Nuls) */}
                  <div className="p-3.5 bg-white/[0.02] border border-white/10 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Studio d&apos;Animation Intuitif</span>
                      </div>
                      <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider animate-pulse">
                        Pro V2
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 bg-white/[0.02] p-2.5 rounded-lg border border-white/5 leading-relaxed space-y-1.5">
                      <p>💡 <strong>Pour les débutants :</strong> Connectez simplement un <strong>déclencheur</strong> à une <strong>cible</strong> pour jouer une animation instantanément, sans coder !</p>
                      <div className="flex items-center gap-1 text-[9px] text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 w-fit font-mono font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        <span>Moteur d&apos;interpolation progressive actif</span>
                      </div>
                    </div>

                    {/* 0. Cinematic Presets (1-Click) */}
                    <div className="bg-amber-500/5 p-2 rounded-lg border border-amber-500/10 space-y-1.5">
                      <label className="text-[10px] text-amber-300 block font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>0. Presets Cinématiques 1-Clic</span>
                      </label>
                      <select
                        value={threeConfig.animationPreset || 'none'}
                        onChange={(e) => set3D('animationPreset', e.target.value)}
                        className="w-full bg-black/50 border border-amber-500/20 rounded px-2.5 py-1.5 text-xs text-amber-100"
                      >
                        <option value="none">✨ Aucun preset (Configuration manuelle)</option>
                        <option value="heartbeat">🫁 Pulsation Cardiaque Organique (Respiration)</option>
                        <option value="disco">🪩 Club Néon Disco (Jeux de lumière)</option>
                        <option value="blackhole">🌪️ Vortex Trou Noir Cosmique (Particules)</option>
                        <option value="hyperspace">🚀 Vitesse-Lumière Hyper-Espace (Caméra Zoom)</option>
                      </select>
                    </div>

                    {threeConfig.animationPreset && threeConfig.animationPreset !== 'none' ? (
                      <div className="bg-black/30 p-2.5 rounded-lg border border-white/5 space-y-2 text-[10px]">
                        <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[9px]">⚙️ Paramètres appliqués par le preset :</span>
                        <div className="grid grid-cols-2 gap-1.5 text-slate-300 font-mono">
                          <div className="bg-white/[0.02] p-1 rounded border border-white/5">
                            <span className="text-slate-500 block text-[8px]">CIBLE</span>
                            <span className="text-amber-400 uppercase">
                              {threeConfig.animationPreset === 'heartbeat' ? '🧊 Objet' : 
                               threeConfig.animationPreset === 'disco' ? '💡 Lumière' : 
                               threeConfig.animationPreset === 'blackhole' ? '✨ Particules' : '📹 Caméra'}
                            </span>
                          </div>
                          <div className="bg-white/[0.02] p-1 rounded border border-white/5">
                            <span className="text-slate-500 block text-[8px]">ACTION</span>
                            <span className="text-amber-400 uppercase">
                              {threeConfig.animationPreset === 'heartbeat' ? 'Respiration' : 
                               threeConfig.animationPreset === 'disco' ? 'Pulsation Glow' : 
                               threeConfig.animationPreset === 'blackhole' ? 'Vortex' : 'Zoom avant-arrière'}
                            </span>
                          </div>
                          <div className="bg-white/[0.02] p-1 rounded border border-white/5">
                            <span className="text-slate-500 block text-[8px]">ACCÉLÉRATION</span>
                            <span className="text-indigo-400 uppercase">
                              {threeConfig.animationPreset === 'heartbeat' ? 'Rebond' : 
                               threeConfig.animationPreset === 'disco' ? 'Sinusoïde' : 
                               threeConfig.animationPreset === 'blackhole' ? 'Élastique' : 'Linéaire'}
                            </span>
                          </div>
                          <div className="bg-white/[0.02] p-1 rounded border border-white/5">
                            <span className="text-slate-500 block text-[8px]">RÉPÉTITION</span>
                            <span className="text-emerald-400 uppercase">
                              {threeConfig.animationPreset === 'heartbeat' ? 'Va-et-vient' : 
                               threeConfig.animationPreset === 'disco' ? 'Boucle' : 
                               threeConfig.animationPreset === 'blackhole' ? 'Boucle' : 'Va-et-vient'}
                            </span>
                          </div>
                        </div>
                        <p className="text-[9px] text-slate-500 leading-normal italic">
                          ℹ️ Pour modifier ces paramètres individuellement, remettez les presets sur &quot;Aucun preset&quot;.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* 1. Trigger */}
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1 font-semibold flex items-center gap-1">
                            <MousePointerClick className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            <span>1. Choisissez le déclencheur (Trigger)</span>
                          </label>
                          <select
                            value={threeConfig.animationTrigger || 'onload'}
                            onChange={(e) => set3D('animationTrigger', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                          >
                            <option value="onload">🚀 Au chargement (En continu)</option>
                            <option value="hover">✨ Au survol du curseur (Hover)</option>
                            <option value="click">🖱️ Au clic de souris (Toggle On/Off)</option>
                          </select>
                        </div>

                        {/* 2. Target */}
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1 font-semibold flex items-center gap-1">
                            <Box className="w-3.5 h-3.5 text-amber-400" />
                            <span>2. Sélectionnez l&apos;élément cible (Target)</span>
                          </label>
                          <select
                            value={threeConfig.animationTarget || 'mesh'}
                            onChange={(e) => set3D('animationTarget', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                          >
                            <option value="mesh">🧊 Objet Principal (La géométrie 3D)</option>
                            <option value="particles">✨ Effet Particules (Poussières d&apos;étoiles)</option>
                            <option value="camera">📹 Caméra de Vue (Mouvement de scène)</option>
                            <option value="light">💡 Éclairage (Jeux d&apos;ombres & reflets)</option>
                          </select>
                        </div>

                        {/* 3. Animation Type */}
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1 font-semibold flex items-center gap-1">
                            <Orbit className="w-3.5 h-3.5 text-amber-400" />
                            <span>3. Sélectionnez l&apos;action à jouer (Action)</span>
                          </label>
                          <select
                            value={threeConfig.animationType || 'none'}
                            onChange={(e) => set3D('animationType', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                          >
                            <option value="none">⏹️ Aucune animation</option>
                            <option value="spin">🔄 Rotation Infinie (Spin 360°)</option>
                            <option value="float">🎈 Flottaison Cosmique (Haut / Bas)</option>
                            {threeConfig.animationTarget === 'mesh' && (
                              <>
                                <option value="scalePulse">🫁 Respiration (Grossit / Rétrécit)</option>
                                <option value="pulse">💡 Pulsation Émissive (Glow Néon)</option>
                              </>
                            )}
                            {threeConfig.animationTarget === 'particles' && (
                              <>
                                <option value="vortex">🌪️ Vortex Stellaire (Vitesse accrue)</option>
                                <option value="pulse">✨ Scintillement des Étoiles</option>
                              </>
                            )}
                            {threeConfig.animationTarget === 'camera' && (
                              <>
                                <option value="cameraZoom">🔍 Zoom Avant-Arrière Oscillant</option>
                                <option value="float">↕️ Flottement Vertical de l&apos;angle</option>
                              </>
                            )}
                            {threeConfig.animationTarget === 'light' && (
                              <>
                                <option value="pulse">⚡ Pulsation d&apos;intensité (Flash)</option>
                                <option value="spin">🛸 Balayage Lumineux Orbital</option>
                              </>
                            )}
                          </select>
                        </div>

                        {/* 3b. Rotation Axis Locking (Conditional) */}
                        {threeConfig.animationTarget === 'mesh' && threeConfig.animationType === 'spin' && (
                          <div className="bg-black/20 p-2 rounded border border-white/5 space-y-1">
                            <label className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">🔒 Verrouillage de l&apos;Axe de rotation</label>
                            <select
                              value={threeConfig.animationAxis || 'all'}
                              onChange={(e) => set3D('animationAxis', e.target.value)}
                              className="w-full bg-black/50 border border-white/10 rounded px-2.5 py-1 text-xs text-white"
                            >
                              <option value="all">💫 Tous les axes (Rotation diagonale complète)</option>
                              <option value="x">↔️ Axe X uniquement (Roulis horizontal)</option>
                              <option value="y">↕️ Axe Y uniquement (Lacet vertical)</option>
                              <option value="z">🔄 Axe Z uniquement (Tangage orbital)</option>
                            </select>
                          </div>
                        )}

                        {/* 3c. Easing and Curves */}
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1 font-semibold flex items-center gap-1">
                            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                            <span>📈 Courbe d&apos;Accélération (Easing)</span>
                          </label>
                          <select
                            value={threeConfig.animationEasing || 'linear'}
                            onChange={(e) => set3D('animationEasing', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                          >
                            <option value="linear">📉 Linéaire (Vitesse constante robotique)</option>
                            <option value="sine">🌊 Sinusoïdale (Fluide, progressif & organique)</option>
                            <option value="elastic">🔮 Élastique (Effet ressort moderne cinétique)</option>
                            <option value="bounce">🏀 Rebondissement (Physique réaliste dynamique)</option>
                          </select>
                        </div>

                        {/* 3d. Loop Types */}
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1 font-semibold flex items-center gap-1">
                            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                            <span>🔄 Type de boucle (Loop mode)</span>
                          </label>
                          <select
                            value={threeConfig.animationLoop || 'loop'}
                            onChange={(e) => set3D('animationLoop', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                          >
                            <option value="loop">🔁 Boucle Infinie standard (Restart à zéro)</option>
                            <option value="pingpong">🏓 Va-et-Vient (Ping-pong sans raccord)</option>
                            <option value="once">☝️ Jouer une seule fois au déclenchement</option>
                          </select>
                        </div>
                      </>
                    )}

                    {/* 4. Speed multiplier */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>🚀 Multiplicateur de Vitesse</span>
                        <span>{threeConfig.animationSpeed ?? 1.0}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="3.0"
                        step="0.1"
                        value={threeConfig.animationSpeed ?? 1.0}
                        onChange={(e) => set3D('animationSpeed', parseFloat(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                    </div>
                  </div>
                </div>
              );
            } else {
              const first3DBlock = blocks?.find((b) => b.type === 'canvas3d');
              return (
                <div className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto border border-pink-500/20 animate-pulse">
                    <Rotate3d className="w-8 h-8 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">Studio d&apos;Animation 3D Spatial</h3>
                    <p className="text-xs text-slate-400 mt-2 max-w-[240px] mx-auto leading-relaxed">
                      Pour configurer un objet 3D interactif (Torus, Shaders, Vitesse, Particules), sélectionnez un élément 3D sur votre scène.
                    </p>
                  </div>

                  {first3DBlock ? (
                    <button
                      onClick={() => onSelectBlockId?.(first3DBlock.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 text-xs font-bold text-pink-300 transition-all"
                    >
                      ⚡ Sélectionner l&apos;élément 3D existant
                    </button>
                  ) : (
                    <button
                      onClick={() => onAddBlock?.('canvas3d')}
                      className="w-full py-2.5 px-4 rounded-xl bg-pink-600 hover:bg-pink-500 border border-pink-400 text-xs font-bold text-white transition-all shadow-lg shadow-pink-500/20"
                    >
                      ➕ Insérer un élément 3D Spatial
                    </button>
                  )}
                </div>
              );
            }
          })()}

            {/* TAB: 2D VECTOR GRAPHICS STUDIO */}
            {activeTab === 'two' && (() => {
              if (selectedBlock) {
                const style = selectedBlock.style || {};
                const currentTrigger = style.animationTrigger || 'load';
                const currentTarget = style.animationTarget || 'block';
                const currentAction = style.animationAction || 'fade';
                const currentEasing = style.animationEasing || 'easeInOut';
                const currentLoopType = style.animationLoopType || 'none';
                const currentDuration = style.animationDuration ?? 0.6;
                const currentDelay = style.animationDelay ?? 0;

                const updateAnim = (key: string, val: any) => {
                  onUpdateBlock({
                    ...selectedBlock,
                    style: {
                      ...selectedBlock.style,
                      [key]: val,
                    },
                  });
                };

                return (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-4">
                      {/* Title Header */}
                      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div>
                          <span className="text-[11px] font-bold text-slate-200 block uppercase tracking-wider">✨ Studio d&apos;Animation d&apos;Éléments</span>
                          <span className="text-[10px] text-slate-400 block">Configurez les cinématiques avancées en temps réel</span>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-300 leading-relaxed bg-indigo-500/10 p-2.5 rounded-lg border border-indigo-500/20">
                        ⚡ <strong>Sélection :</strong> Vous animez la section <strong className="text-indigo-300 font-mono">{selectedBlock.name}</strong>.
                      </div>

                      {/* 1. Déclencheur (Trigger) */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                          <span>⚡ Déclencheur (Trigger)</span>
                        </label>
                        <select
                          value={currentTrigger}
                          onChange={(e) => updateAnim('animationTrigger', e.target.value)}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                        >
                          <option value="load">Au chargement de la page (On Load)</option>
                          <option value="hover">Au survol de la souris (On Hover)</option>
                          <option value="click">Au clic de l&apos;utilisateur (On Click)</option>
                          <option value="scroll">Au défilement de l&apos;écran (On Scroll)</option>
                        </select>
                        <span className="text-[9px] text-slate-500 block">Détermine l&apos;événement qui déclenche le mouvement.</span>
                      </div>

                      {/* 2. Élément Cible (Target Element) */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                          <span>🎯 Élément Cible (Target)</span>
                        </label>
                        <select
                          value={currentTarget}
                          onChange={(e) => updateAnim('animationTarget', e.target.value)}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                        >
                          {ANIMATION_TARGET_OPTIONS.map((opt) => (
                            <option key={`anim-${opt.value}`} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <span className="text-[9px] text-slate-500 block">Choisissez l&apos;élément interne qui doit bouger.</span>
                      </div>

                      {/* 3. L'action à jouer (Action to Play) */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                          <span>🎬 Action à Jouer (Action)</span>
                        </label>
                        <select
                          value={currentAction}
                          onChange={(e) => updateAnim('animationAction', e.target.value)}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                        >
                          <option value="fade">Apparaître en fondu (Fade In)</option>
                          <option value="slide">Glisser élégamment (Slide)</option>
                          <option value="zoom">Zoomer progressivement (Zoom)</option>
                          <option value="rotate">Tourner & pivoter (Rotate)</option>
                          <option value="shake">Secouer & vibrer (Shake)</option>
                          <option value="float">Flotter en apesanteur (Float)</option>
                        </select>
                        <span className="text-[9px] text-slate-500 block">Le mouvement ou l&apos;effet visuel appliqué à la cible.</span>
                      </div>

                      {/* 4. Courbe d'accélération (Easing curve) */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                          <span>📈 Courbe d&apos;Accélération (Easing)</span>
                        </label>
                        <select
                          value={currentEasing}
                          onChange={(e) => updateAnim('animationEasing', e.target.value)}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                        >
                          <option value="linear">Linéaire (Vitesse constante)</option>
                          <option value="easeIn">Progressif (Départ doux - Ease-In)</option>
                          <option value="easeOut">Décélération (Fin douce - Ease-Out)</option>
                          <option value="easeInOut">Harmonieux (Début & fin doux - Ease-In-Out)</option>
                          <option value="spring">Ressort Élastique (Spring dynamique)</option>
                          <option value="bounce">Rebonds Réalistes (Bounce organique)</option>
                        </select>
                        <span className="text-[9px] text-slate-500 block">Définit la courbe d&apos;accélération et le rythme physique de l&apos;effet.</span>
                      </div>

                      {/* 5. Type de boucle (Loop type) */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                          <span>🔁 Type de Boucle (Loop type)</span>
                        </label>
                        <select
                          value={currentLoopType}
                          onChange={(e) => updateAnim('animationLoopType', e.target.value)}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                        >
                          <option value="none">Aucune boucle (S&apos;exécute une seule fois)</option>
                          <option value="yoyo">Va-et-vient continu (Yoyo)</option>
                          <option value="loop">Répétition infinie (Loop)</option>
                          <option value="pulse">Battement de coeur continu (Pulse)</option>
                          <option value="spin">Rotation continue infinie (Spin)</option>
                        </select>
                        <span className="text-[9px] text-slate-500 block">Définit si l&apos;effet doit se répéter en boucle de façon continue.</span>
                      </div>

                      {/* Durée & Délai */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="font-semibold text-slate-400 uppercase">Durée</span>
                            <span className="font-mono text-indigo-400 font-bold">{currentDuration}s</span>
                          </div>
                          <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.1"
                            value={currentDuration}
                            onChange={(e) => updateAnim('animationDuration', parseFloat(e.target.value))}
                            className="w-full accent-indigo-500 cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="font-semibold text-slate-400 uppercase">Délai</span>
                            <span className="font-mono text-indigo-400 font-bold">{currentDelay}s</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="3"
                            step="0.1"
                            value={currentDelay}
                            onChange={(e) => updateAnim('animationDelay', parseFloat(e.target.value))}
                            className="w-full accent-indigo-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-4">
                      {/* Title Header */}
                      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                        <MousePointerClick className="w-4 h-4 text-purple-400 shrink-0" />
                        <div>
                          <span className="text-[11px] font-bold text-slate-200 block uppercase tracking-wider">👆 Interactions Avancées (Survol)</span>
                          <span className="text-[10px] text-slate-400 block">Survolez un élément pour en animer un autre</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                          <span>🎯 Source du survol</span>
                        </label>
                        <select
                          value={style.hoverTriggerSource || 'none'}
                          onChange={(e) => updateAnim('hoverTriggerSource', e.target.value)}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
                        >
                          <option value="none">Aucun (Désactivé)</option>
                          {ANIMATION_TARGET_OPTIONS.map((opt) => (
                            <option key={`hsrc-${opt.value}`} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <span className="text-[9px] text-slate-500 block">L&apos;élément que l&apos;utilisateur doit survoler avec sa souris.</span>
                      </div>

                      {style.hoverTriggerSource && style.hoverTriggerSource !== 'none' && (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                              <span>✨ Élément à animer</span>
                            </label>
                            <select
                              value={style.hoverTriggerTarget || 'none'}
                              onChange={(e) => updateAnim('hoverTriggerTarget', e.target.value)}
                              className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
                            >
                              <option value="none">Aucun (Désactivé)</option>
                              {ANIMATION_TARGET_OPTIONS.map((opt) => (
                                <option key={`htgt-${opt.value}`} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                            <span className="text-[9px] text-slate-500 block">L&apos;élément qui s&apos;animera lorsque la source est survolée.</span>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                              <span>🎬 Effet au survol</span>
                            </label>
                            <select
                              value={style.hoverTriggerAction || 'fade'}
                              onChange={(e) => updateAnim('hoverTriggerAction', e.target.value)}
                              className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
                            >
                              <option value="fade">Apparition (Fade)</option>
                              <option value="slide">Décalage (Slide)</option>
                              <option value="zoom">Agrandissement (Zoom)</option>
                              <option value="rotate">Rotation (Rotate)</option>
                              <option value="shake">Secousse (Shake)</option>
                              <option value="float">Lévitation (Float)</option>
                              <option value="glow">Luminescence (Glow)</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                              <span>📈 Courbe d&apos;accélération</span>
                            </label>
                            <select
                              value={style.hoverTriggerEasing || 'easeInOut'}
                              onChange={(e) => updateAnim('hoverTriggerEasing', e.target.value)}
                              className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
                            >
                              <option value="linear">Linéaire (Constant)</option>
                              <option value="easeIn">Progressif (Ease-In)</option>
                              <option value="easeOut">Décélération (Ease-Out)</option>
                              <option value="easeInOut">Harmonieux (Ease-In-Out)</option>
                              <option value="spring">Ressort (Spring)</option>
                              <option value="bounce">Rebond (Bounce)</option>
                            </select>
                          </div>
                        </>
                      )}

                    </div>

                    {/* Orchestre d&apos;Animation Avancé */}
                    <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <span className="text-[11px] font-bold text-slate-200 block uppercase tracking-wider">🎼 Orchestre d&apos;Animation Avancé</span>
                            <span className="text-[10px] text-slate-400 block">Total Freedom Configuration</span>
                          </div>
                        </div>
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              className="sr-only" 
                              checked={style.advancedAnimEnabled || false}
                              onChange={(e) => updateAnim('advancedAnimEnabled', e.target.checked)}
                            />
                            <div className={`block w-8 h-4.5 rounded-full transition-colors ${style.advancedAnimEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-2.5 h-2.5 rounded-full transition-transform ${style.advancedAnimEnabled ? 'translate-x-3.5' : ''}`}></div>
                          </div>
                        </label>
                      </div>

                      {style.advancedAnimEnabled && (
                        <div className="space-y-4 pt-1">
                          
                          {/* Cible de l'animation */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">🎯 Élément Cible</label>
                            <select
                              value={style.advancedAnimTarget || 'block'}
                              onChange={(e) => updateAnim('advancedAnimTarget', e.target.value)}
                              className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 transition-all cursor-pointer"
                            >
                              {ANIMATION_TARGET_OPTIONS.map((opt) => (
                                <option key={`advtgt-${opt.value}`} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>

                          {/* Moteur Physique */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">⚙️ Moteur Physique</label>
                            <select
                              value={style.advancedAnimType || 'spring'}
                              onChange={(e) => updateAnim('advancedAnimType', e.target.value)}
                              className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 transition-all cursor-pointer"
                            >
                              <option value="spring">Ressort (Spring Physics)</option>
                              <option value="tween">Linéaire/Courbe (Tween)</option>
                            </select>
                          </div>

                          {style.advancedAnimType === 'spring' && (
                            <div className="grid grid-cols-2 gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Tension (Stiffness)</span>
                                  <span className="text-emerald-400">{style.advancedAnimStiffness || 100}</span>
                                </div>
                                <input type="range" min="10" max="500" step="10" value={style.advancedAnimStiffness || 100} onChange={(e) => updateAnim('advancedAnimStiffness', parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Friction (Damping)</span>
                                  <span className="text-emerald-400">{style.advancedAnimDamping || 10}</span>
                                </div>
                                <input type="range" min="1" max="100" step="1" value={style.advancedAnimDamping || 10} onChange={(e) => updateAnim('advancedAnimDamping', parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                              </div>
                              <div className="space-y-1 col-span-2">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Masse (Mass)</span>
                                  <span className="text-emerald-400">{style.advancedAnimMass || 1}</span>
                                </div>
                                <input type="range" min="0.1" max="10" step="0.1" value={style.advancedAnimMass || 1} onChange={(e) => updateAnim('advancedAnimMass', parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                              </div>
                            </div>
                          )}

                          {/* Transformations de départ */}
                          <div className="space-y-2 pt-2 border-t border-white/5">
                            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">📐 Transformations de Départ</label>
                            
                            <div className="space-y-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                              {/* Translate X */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Translate X</span>
                                  <span className="text-emerald-400">{style.advancedAnimTranslateX || 0}px</span>
                                </div>
                                <input type="range" min="-500" max="500" step="10" value={style.advancedAnimTranslateX || 0} onChange={(e) => updateAnim('advancedAnimTranslateX', parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                              </div>
                              
                              {/* Translate Y */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Translate Y</span>
                                  <span className="text-emerald-400">{style.advancedAnimTranslateY || 0}px</span>
                                </div>
                                <input type="range" min="-500" max="500" step="10" value={style.advancedAnimTranslateY || 0} onChange={(e) => updateAnim('advancedAnimTranslateY', parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                              </div>

                              {/* Scale & Rotate */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                    <span>Échelle (Scale)</span>
                                    <span className="text-emerald-400">{style.advancedAnimScale !== undefined ? style.advancedAnimScale : 1}</span>
                                  </div>
                                  <input type="range" min="0" max="3" step="0.1" value={style.advancedAnimScale !== undefined ? style.advancedAnimScale : 1} onChange={(e) => updateAnim('advancedAnimScale', parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                    <span>Rotation</span>
                                    <span className="text-emerald-400">{style.advancedAnimRotate || 0}°</span>
                                  </div>
                                  <input type="range" min="-360" max="360" step="15" value={style.advancedAnimRotate || 0} onChange={(e) => updateAnim('advancedAnimRotate', parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                                </div>
                              </div>
                              
                              {/* Opacity */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Opacité (Opacity)</span>
                                  <span className="text-emerald-400">{style.advancedAnimOpacity !== undefined ? style.advancedAnimOpacity : 1}</span>
                                </div>
                                <input type="range" min="0" max="1" step="0.1" value={style.advancedAnimOpacity !== undefined ? style.advancedAnimOpacity : 1} onChange={(e) => updateAnim('advancedAnimOpacity', parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                              </div>
                            </div>
                          </div>

                          {/* Timing & Stagger */}
                          <div className="space-y-2 pt-2 border-t border-white/5">
                            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">⏱️ Timing & Stagger</label>
                            
                            <div className="grid grid-cols-2 gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Délai d&apos;Enchaînement (Stagger)</span>
                                  <span className="text-emerald-400">{style.advancedAnimStagger || 0}s</span>
                                </div>
                                <input type="range" min="0" max="1" step="0.05" value={style.advancedAnimStagger || 0} onChange={(e) => updateAnim('advancedAnimStagger', parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                              </div>
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto border border-indigo-500/20 animate-pulse">
                      <Sparkles className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-200">Studio d&apos;Animation d&apos;Éléments</h3>
                      <p className="text-xs text-slate-400 mt-2 max-w-[240px] mx-auto leading-relaxed">
                        Pour animer, faire flotter ou faire réagir les sections et boutons du site final au survol du curseur, sélectionnez une section sur votre scène.
                      </p>
                    </div>

                    {blocks && blocks.length > 0 ? (
                      <div className="space-y-1.5 pt-2">
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Sélectionner une section à animer :</span>
                        <div className="space-y-1 max-h-[160px] overflow-y-auto">
                          {blocks.map((b) => (
                            <button
                              key={b.id}
                              onClick={() => onSelectBlockId?.(b.id)}
                              className="w-full text-left p-2 rounded-lg bg-black/30 hover:bg-white/5 border border-white/5 hover:border-white/15 text-[11px] text-slate-300 flex items-center justify-between transition-all"
                            >
                              <span>{b.name}</span>
                              <span className="text-[9px] font-mono text-slate-500 uppercase">{b.type}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-500 bg-black/20 p-3 rounded-xl border border-white/5">
                        Aucune section présente. Ajoutez des sections pour commencer à les animer !
                      </div>
                    )}
                  </div>
                );
              }
            })()}

            {/* TAB 2: CONTENT */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                {/* HTML Tag Selector */}
                {isElementSelected && (
                  <div className="p-3 bg-white/[0.02] border border-white/10 rounded-lg space-y-2">
                    <label className="text-[11px] font-semibold text-slate-300 block">Balise HTML sémantique</label>
                    <div className="grid grid-cols-4 gap-1">
                      {['h1', 'h2', 'h3', 'p', 'button', 'a', 'span', 'div'].map((tag) => {
                        const active = (currentElemStyle.htmlTag || getDefaultTag(currentCategory, currentElemKey)) === tag;
                        return (
                          <button
                            key={tag}
                            onClick={() => updateElementStyle('htmlTag', tag)}
                            className={`py-1 text-[10px] font-mono rounded uppercase transition-colors ${
                              active ? 'bg-indigo-600 text-white font-bold' : 'bg-white/5 text-slate-400 hover:text-white'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Text Content Editors */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Champs de Textes & Métadonnées</h4>

                  {selectedBlock.content.badgeText !== undefined && (
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Texte du Badge</label>
                      <input
                        type="text"
                        value={selectedBlock.content.badgeText}
                        onChange={(e) => updateContentField('badgeText', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  )}

                  {selectedBlock.content.title !== undefined && (
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Titre principal</label>
                      <textarea
                        rows={2}
                        value={selectedBlock.content.title}
                        onChange={(e) => updateContentField('title', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white resize-none"
                      />
                    </div>
                  )}

                  {selectedBlock.content.subtitle !== undefined && (
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Sous-titre / Description</label>
                      <textarea
                        rows={3}
                        value={selectedBlock.content.subtitle}
                        onChange={(e) => updateContentField('subtitle', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white resize-none"
                      />
                    </div>
                  )}

                  {selectedBlock.content.primaryCtaText !== undefined && (
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Bouton Principal (CTA)</label>
                      <input
                        type="text"
                        value={selectedBlock.content.primaryCtaText}
                        onChange={(e) => updateContentField('primaryCtaText', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  )}

                  {selectedBlock.content.secondaryCtaText !== undefined && (
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Bouton Secondaire</label>
                      <input
                        type="text"
                        value={selectedBlock.content.secondaryCtaText}
                        onChange={(e) => updateContentField('secondaryCtaText', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  )}

                  {/* Link Href settings */}
                  {isElementSelected && (
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <label className="text-[11px] font-semibold text-slate-300 block">Lien & Redirection (href)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="https://example.com"
                          value={currentElemStyle.linkUrl || ''}
                          onChange={(e) => updateElementStyle('linkUrl', e.target.value)}
                          className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white font-mono"
                        />
                        <select
                          value={currentElemStyle.linkTarget || '_self'}
                          onChange={(e) => updateElementStyle('linkTarget', e.target.value as any)}
                          className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                        >
                          <option value="_self">Même onglet</option>
                          <option value="_blank">Nouvel onglet</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section Management Actions */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Actions sur le bloc</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {onDuplicateBlock && (
                      <button
                        onClick={() => onDuplicateBlock(selectedBlock.id)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Dupliquer</span>
                      </button>
                    )}

                    {onDeleteBlock && (
                      <button
                        onClick={() => onDeleteBlock(selectedBlock.id)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-medium text-rose-300 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Supprimer</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CODE PREVIEW */}
            {activeTab === 'code' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">React + Tailwind TSX</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyCode}
                      className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copié !' : 'Copier'}</span>
                    </button>
                    <button
                      onClick={handleDownloadCode}
                      className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>.tsx</span>
                    </button>
                  </div>
                </div>

                <div className="bg-[#0b0c0f] border border-white/10 rounded-lg p-3 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-[500px] leading-relaxed custom-scrollbar">
                  <pre>{generatedCode}</pre>
                </div>
              </div>
            )}

            {/* TAB 4: AI DIFF PROPOSAL */}
            {activeTab === 'diff' && activeDiff && (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <GitPullRequest className="w-4 h-4" />
                    <span>Proposition de modification IA</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeDiff.summary || activeDiff.prompt}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={onAcceptDiff}
                    className="flex-1 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-900/30"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Appliquer</span>
                  </button>
                  <button
                    onClick={onRejectDiff}
                    className="flex-1 py-2 rounded bg-rose-600/30 hover:bg-rose-600/40 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Rejeter</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
};

// Helper Accordion Wrapper Component
interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className="border border-white/10 rounded-lg bg-[#161820]/80 overflow-hidden transition-colors">
      <button
        onClick={onToggle}
        className="w-full px-3 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-200 hover:bg-white/5 transition-colors"
      >
        <span>{title}</span>
        {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>
      {isOpen && <div className="p-3 border-t border-white/5 bg-[#121318]/50">{children}</div>}
    </div>
  );
};

// Default HTML tags helper based on category/key
function getDefaultTag(category: string, elementKey: string): string {
  if (elementKey === 'title' || category === 'heading') return 'h1';
  if (elementKey === 'subtitle' || category === 'text') return 'p';
  if (category === 'button') return 'button';
  if (category === 'badge') return 'span';
  if (category === 'link') return 'a';
  if (category === 'canvas3d') return 'canvas';
  return 'div';
}
