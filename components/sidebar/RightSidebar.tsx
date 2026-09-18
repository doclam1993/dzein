'use client';

import React, { useState, useMemo, useRef } from 'react';
import { 
  SlidersHorizontal, Code2, GitPullRequest, Copy, Check, Download, 
  Rotate3d, Sparkles, LayoutGrid, Box, Eye, CheckCircle, 
  XCircle, ArrowRight, Layers, Type, Move, Palette, Undo, 
  RefreshCw, Orbit, Maximize2, Paintbrush, Square, 
  X, ChevronDown, ChevronRight, MousePointerClick, Tag, Link2, DollarSign, 
  Zap, Plus, Trash2, AlignLeft, AlignCenter, AlignRight, Bold, MoveUp, MoveDown,
  Info, ExternalLink, Image as ImageIcon, Sliders, Sun, Target, RotateCcw,
  Play, Activity, Gauge, Flame, Wand2, Compass
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
  const [studioSubTab, setStudioSubTab] = useState<'presets' | 'logic' | 'motion' | 'styles'>('logic');
  const [copiedCode, setCopiedCode] = useState(false);

  // Auto switch tab when selecting a 3D or 2D block
  const [prevBlockId, setPrevBlockId] = useState<string | null>(null);
  if (selectedBlock && selectedBlock.id !== prevBlockId) {
    setPrevBlockId(selectedBlock.id);
    if (selectedBlock.type === 'canvas3d') {
      setActiveTab('three');
    } else if (selectedBlock.type === 'canvas2d') {
      setActiveTab('two');
    }
  }

  // Canvas element selection -> Animation Studio target auto-sync
  const lastSyncedTargetRef = useRef<string | null>(null);
  React.useEffect(() => {
    if (activeTab === 'two' && selectedElement && selectedBlock && selectedElement.blockId === selectedBlock.id) {
      const key = selectedElement.elementKey;
      if (key && lastSyncedTargetRef.current !== `${selectedBlock.id}-${key}`) {
        lastSyncedTargetRef.current = `${selectedBlock.id}-${key}`;
        if (selectedBlock.style?.animationTarget !== key || (selectedBlock.style?.advancedAnimEnabled && selectedBlock.style?.advancedAnimTarget !== key)) {
          onUpdateBlock({
            ...selectedBlock,
            style: {
              ...selectedBlock.style,
              animationTarget: key,
              ...(selectedBlock.style?.advancedAnimEnabled ? { advancedAnimTarget: key } : {})
            }
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedElement?.blockId, selectedElement?.elementKey, selectedBlock?.id]);

  // Collapsible Accordion Sections State
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    selector: true,
    presets: true,
    layout: true,
    spacing: false,
    typography: true,
    background: true,
    patterns: false,
    border: true,
    shadow: true,
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

  // Quick Professional Style Presets (1-Click Application)
  const STYLE_PRESETS = [
    {
      id: 'glass',
      name: 'Glassmorphism Pro',
      badge: 'Verre Dépoli',
      icon: '💎',
      desc: 'Translucidité premium, flou backdrop & liseré fin',
      styles: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        background: 'rgba(255, 255, 255, 0.05)',
        backgroundType: 'solid' as const,
        backdropBlur: 16,
        borderRadius: 16,
        borderColor: 'rgba(255, 255, 255, 0.18)',
        borderWidth: 1,
        borderStyle: 'solid' as const,
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
      },
    },
    {
      id: 'cyber-cyan',
      name: 'Cyberpunk Neon',
      badge: 'Glow Cyan',
      icon: '⚡',
      desc: 'Obsidienne sombre & aura lumineuse haute tension',
      styles: {
        backgroundColor: '#070d18',
        background: '#070d18',
        backgroundType: 'solid' as const,
        backdropBlur: 0,
        borderRadius: 12,
        borderColor: '#06b6d4',
        borderWidth: 1,
        borderStyle: 'solid' as const,
        boxShadow: '0 0 25px rgba(6, 182, 212, 0.45), inset 0 0 15px rgba(6, 182, 212, 0.1)',
      },
    },
    {
      id: 'neon-purple',
      name: 'Ultra Violet Glow',
      badge: 'Futuriste',
      icon: '🔮',
      desc: 'Halo ultraviolet profond et bordure pourpre',
      styles: {
        backgroundColor: '#0c071e',
        background: '#0c071e',
        backgroundType: 'solid' as const,
        backdropBlur: 0,
        borderRadius: 14,
        borderColor: '#a855f7',
        borderWidth: 1,
        borderStyle: 'solid' as const,
        boxShadow: '0 0 30px rgba(168, 85, 247, 0.5), inset 0 0 12px rgba(168, 85, 247, 0.15)',
      },
    },
    {
      id: 'dark-gold',
      name: 'Luxury Champagne Or',
      badge: 'Haute Horlogerie',
      icon: '👑',
      desc: 'Noir profond, liseré doré champagne et ombre 3D',
      styles: {
        backgroundColor: '#09090b',
        background: '#09090b',
        backgroundType: 'solid' as const,
        backdropBlur: 0,
        borderRadius: 14,
        borderColor: 'rgba(234, 179, 8, 0.4)',
        borderWidth: 1,
        borderStyle: 'solid' as const,
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 15px rgba(234, 179, 8, 0.15)',
      },
    },
    {
      id: 'neo-brutalist',
      name: 'Neo-Brutalisme',
      badge: 'Contraste Brut',
      icon: '📦',
      desc: 'Bordure noire 3px, ombre décalée franche',
      styles: {
        backgroundColor: '#ffffff',
        background: '#ffffff',
        backgroundType: 'solid' as const,
        textColor: '#0f172a',
        backdropBlur: 0,
        borderRadius: 4,
        borderColor: '#000000',
        borderWidth: 3,
        borderStyle: 'solid' as const,
        boxShadow: '5px 5px 0px #000000',
      },
    },
    {
      id: 'obsidian-slate',
      name: 'Obsidienne Slate Pro',
      badge: 'SaaS Moderne',
      icon: '🖤',
      desc: 'Élévation feutrée, liseré métallique discret',
      styles: {
        backgroundColor: '#0f1422',
        background: '#0f1422',
        backgroundType: 'solid' as const,
        backdropBlur: 10,
        borderRadius: 16,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderStyle: 'solid' as const,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
      },
    },
    {
      id: 'emerald-matrix',
      name: 'Bio-Tech Émeraude',
      badge: 'Quantum',
      icon: '🌿',
      desc: 'Lueur bioluminescente verte et noir absolu',
      styles: {
        backgroundColor: '#041712',
        background: '#041712',
        backgroundType: 'solid' as const,
        backdropBlur: 0,
        borderRadius: 14,
        borderColor: 'rgba(16, 185, 129, 0.5)',
        borderWidth: 1,
        borderStyle: 'solid' as const,
        boxShadow: '0 0 25px rgba(16, 185, 129, 0.35)',
      },
    },
    {
      id: 'sunset-aura',
      name: 'Aurore Sunset Glow',
      badge: 'Chaleureux',
      icon: '🌅',
      desc: 'Dégradé velours coucher de soleil et ombre satinée',
      styles: {
        backgroundType: 'linear' as const,
        gradientStartColor: '#431407',
        gradientEndColor: '#701a75',
        gradientAngle: 135,
        background: 'linear-gradient(135deg, #431407, #701a75)',
        backgroundColor: 'linear-gradient(135deg, #431407, #701a75)',
        borderRadius: 16,
        borderColor: 'rgba(251, 146, 60, 0.3)',
        borderWidth: 1,
        borderStyle: 'solid' as const,
        boxShadow: '0 20px 35px -5px rgba(244, 63, 94, 0.3)',
      },
    },
    {
      id: 'holographic-prism',
      name: 'Holographique Irisé',
      badge: 'Prismatique',
      icon: '✨',
      desc: 'Reflets nacrés irisés, verre dépoli & contour prismatique',
      styles: {
        backgroundType: 'linear' as const,
        gradientStartColor: 'rgba(244, 114, 182, 0.15)',
        gradientEndColor: 'rgba(56, 189, 248, 0.15)',
        gradientAngle: 120,
        background: 'linear-gradient(120deg, rgba(244, 114, 182, 0.15), rgba(56, 189, 248, 0.15))',
        backgroundColor: 'linear-gradient(120deg, rgba(244, 114, 182, 0.15), rgba(56, 189, 248, 0.15))',
        backdropBlur: 20,
        borderRadius: 16,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        borderStyle: 'solid' as const,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 16px rgba(255, 255, 255, 0.2)',
      },
    },
    {
      id: 'brushed-titanium',
      name: 'Titane Brossé & Métal',
      badge: 'Métallique',
      icon: '⚙️',
      desc: 'Nuances aluminium, reflets métalliques & chanfrein précis',
      styles: {
        backgroundType: 'linear' as const,
        gradientStartColor: '#1e2430',
        gradientEndColor: '#0f131a',
        gradientAngle: 145,
        background: 'linear-gradient(145deg, #1e2430, #0f131a)',
        backgroundColor: 'linear-gradient(145deg, #1e2430, #0f131a)',
        borderRadius: 12,
        borderColor: 'rgba(148, 163, 184, 0.35)',
        borderWidth: 1,
        borderStyle: 'solid' as const,
        boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.15), 0 20px 40px -10px rgba(0,0,0,0.85)',
      },
    },
    {
      id: 'cyber-terminal',
      name: 'Terminal Cyber Matrix',
      badge: 'Phosphore Vert',
      icon: '📟',
      desc: 'Noir absolu console, vert phosphorescent & aura rétro',
      styles: {
        backgroundColor: '#030804',
        background: '#030804',
        backgroundType: 'solid' as const,
        textColor: '#4ade80',
        borderRadius: 6,
        borderColor: '#22c55e',
        borderWidth: 1,
        borderStyle: 'solid' as const,
        boxShadow: '0 0 20px rgba(34, 197, 94, 0.4), inset 0 0 10px rgba(34, 197, 94, 0.1)',
      },
    },
    {
      id: 'aurora-borealis',
      name: 'Aurore Boréale Polaire',
      badge: 'Nordique Glow',
      icon: '🌌',
      desc: 'Fusion cyan polaire, indigo mystique et velours nocturne',
      styles: {
        backgroundType: 'linear' as const,
        gradientStartColor: '#083344',
        gradientEndColor: '#1e1b4b',
        gradientAngle: 135,
        background: 'linear-gradient(135deg, #083344, #1e1b4b)',
        backgroundColor: 'linear-gradient(135deg, #083344, #1e1b4b)',
        borderRadius: 16,
        borderColor: 'rgba(6, 182, 212, 0.4)',
        borderWidth: 1,
        borderStyle: 'solid' as const,
        boxShadow: '0 15px 35px -5px rgba(6, 182, 212, 0.35), 0 0 20px rgba(99, 102, 241, 0.25)',
      },
    },
    {
      id: 'crimson-stealth',
      name: 'Crimson Stealth Carbone',
      badge: 'Dark Vermillon',
      icon: '🩸',
      desc: 'Carbone sombre, biseau vermillon incandescent et relief furtif',
      styles: {
        backgroundColor: '#0a0507',
        background: '#0a0507',
        backgroundType: 'solid' as const,
        borderRadius: 12,
        borderColor: '#e11d48',
        borderWidth: 1,
        borderStyle: 'solid' as const,
        boxShadow: '0 0 25px rgba(225, 29, 72, 0.4), 0 20px 40px rgba(0,0,0,0.9)',
      },
    },
    {
      id: 'retrowave-neon',
      name: 'Synthwave 80s Sunset',
      badge: 'Rétro Vapor',
      icon: '🌴',
      desc: 'Ambiance néon rose chaud, violet électrique et crépuscule vintage',
      styles: {
        backgroundType: 'linear' as const,
        gradientStartColor: '#831843',
        gradientEndColor: '#3b0764',
        gradientAngle: 160,
        background: 'linear-gradient(160deg, #831843, #3b0764)',
        backgroundColor: 'linear-gradient(160deg, #831843, #3b0764)',
        borderRadius: 14,
        borderColor: '#f43f5e',
        borderWidth: 1,
        borderStyle: 'solid' as const,
        boxShadow: '0 0 30px rgba(244, 63, 94, 0.45), inset 0 0 15px rgba(244, 63, 94, 0.15)',
      },
    },
  ];

  const applyStylePreset = (presetStyles: Record<string, any>) => {
    if (!selectedBlock) return;
    if (isElementSelected && selectedElement) {
      const { elementKey } = selectedElement;
      const elementStyles = selectedBlock.content.elementStyles || {};
      const current = elementStyles[elementKey] || {};
      onUpdateBlock({
        ...selectedBlock,
        content: {
          ...selectedBlock.content,
          elementStyles: {
            ...elementStyles,
            [elementKey]: {
              ...current,
              ...presetStyles,
            },
          },
        },
      });
    } else {
      onUpdateBlock({
        ...selectedBlock,
        style: {
          ...selectedBlock.style,
          ...presetStyles,
        },
      });
    }
  };

  return (
    <aside 
      className="h-full bg-[#0a0d17]/95 border-l border-white/[0.06] backdrop-blur-2xl flex flex-col shrink-0 text-slate-200 select-none overflow-hidden z-20 shadow-2xl transition-all"
      style={{ width }}
    >
      {/* HEADER */}
      <div className="h-13 px-4 border-b border-white/[0.06] flex items-center justify-between bg-[#07090f]/80 shrink-0">
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
      <div className="flex items-center border-b border-white/[0.06] bg-[#07090f]/60 p-1.5 gap-1 shrink-0 overflow-x-auto">
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
                {/* STUDIO PRESETS DE STYLES (1-CLICK QUICK STYLING) */}
                <AccordionSection
                  title="Studio de Styles Préréglés (1-Clic)"
                  isOpen={openSections.presets}
                  onToggle={() => toggleSection('presets')}
                >
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Appliquez instantanément une charte graphique professionnelle complète sur {isElementSelected ? 'cet élément' : 'cette section'}.
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                      {STYLE_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => applyStylePreset(preset.styles)}
                          className="group/preset p-2 rounded-lg bg-[#0e121d] hover:bg-[#161c2e] border border-white/10 hover:border-indigo-400/50 text-left transition-all active:scale-95 shadow-sm relative overflow-hidden"
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-sm select-none">{preset.icon}</span>
                            <span className="text-[10px] font-bold text-white group-hover/preset:text-indigo-300 transition-colors truncate">
                              {preset.name}
                            </span>
                          </div>
                          <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-mono font-semibold bg-white/5 border border-white/10 text-slate-300">
                            {preset.badge}
                          </span>
                          <p className="text-[9px] text-slate-400 mt-1 line-clamp-1">
                            {preset.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </AccordionSection>

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
                        value={isElementSelected ? (currentElemStyle.fontFamily || 'Plus Jakarta Sans') : (selectedBlock.style.fontFamily || 'Plus Jakarta Sans')}
                        onChange={(e) => {
                          if (isElementSelected) updateElementStyle('fontFamily', e.target.value);
                          else updateBlockStyle('fontFamily', e.target.value);
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="Plus Jakarta Sans">Plus Jakarta Sans (Moderne UI)</option>
                        <option value="Inter">Inter (Clean Neutre)</option>
                        <option value="Playfair Display">Playfair Display (Élégant Serif)</option>
                        <option value="Outfit">Outfit (Géométrique)</option>
                        <option value="Syne">Syne (Design & Créatif)</option>
                        <option value="Space Grotesk">Space Grotesk (Tech Futuriste)</option>
                        <option value="Clash Display">Clash Display (Display Impact)</option>
                        <option value="JetBrains Mono">JetBrains Mono (Code / Mono)</option>
                        <option value="Cinzel">Cinzel (Luxe Impérial)</option>
                        <option value="Roboto">Roboto (Classique)</option>
                        <option value="monospace">Monospace Standard</option>
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
                          value={isElementSelected ? (currentElemStyle.fontWeight || 'normal') : (selectedBlock.style.fontWeight || 'normal')}
                          onChange={(e) => {
                            if (isElementSelected) updateElementStyle('fontWeight', e.target.value);
                            else updateBlockStyle('fontWeight', e.target.value);
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

                    {/* Letter Spacing & Line Height */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>Interlettrage</span>
                          <span className="font-mono text-[10px] text-indigo-300">
                            {(isElementSelected ? currentElemStyle.letterSpacing : selectedBlock.style.letterSpacing) ?? 0}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="-2"
                          max="12"
                          step="0.5"
                          value={(isElementSelected ? currentElemStyle.letterSpacing : selectedBlock.style.letterSpacing) ?? 0}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (isElementSelected) updateElementStyle('letterSpacing', val);
                            else updateBlockStyle('letterSpacing', val);
                          }}
                          className="w-full accent-indigo-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>Interligne</span>
                          <span className="font-mono text-[10px] text-indigo-300">
                            {(isElementSelected ? currentElemStyle.lineHeight : selectedBlock.style.lineHeight) ?? 1.5}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.9"
                          max="2.4"
                          step="0.1"
                          value={(isElementSelected ? currentElemStyle.lineHeight : selectedBlock.style.lineHeight) ?? 1.5}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (isElementSelected) updateElementStyle('lineHeight', val);
                            else updateBlockStyle('lineHeight', val);
                          }}
                          className="w-full accent-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Text Transform & Decoration Buttons */}
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Transformation & Décoration</label>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Transform */}
                        <div className="flex rounded bg-black/40 border border-white/10 p-0.5">
                          {[
                            { id: 'none', label: 'Aa' },
                            { id: 'uppercase', label: 'AA' },
                            { id: 'lowercase', label: 'aa' },
                            { id: 'capitalize', label: 'Ab' },
                          ].map((t) => {
                            const active = isElementSelected 
                              ? (currentElemStyle.textTransform || 'none') === t.id
                              : (selectedBlock.style.textTransform || 'none') === t.id;
                            return (
                              <button
                                key={t.id}
                                onClick={() => {
                                  if (isElementSelected) updateElementStyle('textTransform', t.id);
                                  else updateBlockStyle('textTransform', t.id);
                                }}
                                className={`flex-1 py-1 text-[10px] font-mono rounded transition-colors ${
                                  active ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                                }`}
                              >
                                {t.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Decoration */}
                        <div className="flex rounded bg-black/40 border border-white/10 p-0.5">
                          {[
                            { id: 'none', label: 'Norm' },
                            { id: 'underline', label: 'Souligné' },
                            { id: 'line-through', label: 'Barré' },
                          ].map((d) => {
                            const active = isElementSelected 
                              ? (currentElemStyle.textDecoration || 'none') === d.id
                              : (selectedBlock.style.textDecoration || 'none') === d.id;
                            return (
                              <button
                                key={d.id}
                                onClick={() => {
                                  if (isElementSelected) updateElementStyle('textDecoration', d.id);
                                  else updateBlockStyle('textDecoration', d.id);
                                }}
                                className={`flex-1 py-1 text-[9px] font-mono rounded transition-colors ${
                                  active ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                                }`}
                              >
                                {d.label}
                              </button>
                            );
                          })}
                        </div>
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

                    {/* Background Textures & Patterns */}
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-slate-300">
                          Motif & Texture CSS
                        </label>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {selectedBlock.style.patternOverlay || 'none'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: 'none', label: 'Aucun' },
                          { id: 'dots', label: 'Points' },
                          { id: 'grid', label: 'Grille' },
                          { id: 'stripes', label: 'Rayures' },
                          { id: 'circuit', label: 'Circuit' },
                          { id: 'mesh', label: 'Mesh' },
                        ].map((pat) => {
                          const currentPattern = selectedBlock.style.patternOverlay || 'none';
                          const isSelected = currentPattern === pat.id;
                          return (
                            <button
                              key={pat.id}
                              onClick={() => updateBlockStyle('patternOverlay', pat.id)}
                              className={`py-1 px-1.5 text-[10px] rounded font-medium border transition-all ${
                                isSelected
                                  ? 'bg-indigo-600/30 text-indigo-200 border-indigo-400/50 font-bold'
                                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              {pat.label}
                            </button>
                          );
                        })}
                      </div>

                      {selectedBlock.style.patternOverlay && selectedBlock.style.patternOverlay !== 'none' && (
                        <div>
                          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                            <span>Opacité du motif</span>
                            <span className="font-mono text-indigo-300">
                              {Math.round((selectedBlock.style.patternOpacity ?? 0.15) * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.02"
                            max="0.6"
                            step="0.02"
                            value={selectedBlock.style.patternOpacity ?? 0.15}
                            onChange={(e) => updateBlockStyle('patternOpacity', Number(e.target.value))}
                            className="w-full accent-indigo-500"
                          />
                        </div>
                      )}
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
                    {/* Border Style (Solid, Dashed, Dotted, Double, None) */}
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Style de contour</label>
                      <div className="grid grid-cols-5 gap-1 p-0.5 bg-black/40 rounded border border-white/10">
                        {[
                          { id: 'solid', label: 'Plein' },
                          { id: 'dashed', label: 'Tirets' },
                          { id: 'dotted', label: 'Points' },
                          { id: 'double', label: 'Double' },
                          { id: 'none', label: 'Aucun' },
                        ].map((st) => {
                          const active = isElementSelected
                            ? (currentElemStyle.borderStyle || (currentElemStyle.borderWidth ? 'solid' : 'none')) === st.id
                            : (selectedBlock.style.borderStyle || (selectedBlock.style.borderWidth ? 'solid' : 'none')) === st.id;
                          return (
                            <button
                              key={st.id}
                              onClick={() => {
                                if (isElementSelected) {
                                  updateElementStyle('borderStyle', st.id);
                                  if (st.id !== 'none' && (!currentElemStyle.borderWidth || currentElemStyle.borderWidth === 0)) {
                                    updateElementStyle('borderWidth', 1);
                                  }
                                } else {
                                  updateBlockStyle('borderStyle', st.id);
                                  if (st.id !== 'none' && (!selectedBlock.style.borderWidth || selectedBlock.style.borderWidth === 0)) {
                                    updateBlockStyle('borderWidth', 1);
                                  }
                                }
                              }}
                              className={`py-1 text-[9px] font-medium rounded transition-colors ${
                                active ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {st.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Rayon des coins (px)</label>
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

                    {/* Quick Radius Presets */}
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Arrondis rapides</label>
                      <div className="grid grid-cols-5 gap-1">
                        {[
                          { label: '0px', val: 0 },
                          { label: '4px', val: 4 },
                          { label: '8px', val: 8 },
                          { label: '16px', val: 16 },
                          { label: 'Pilule', val: 9999 },
                        ].map((r) => (
                          <button
                            key={r.label}
                            onClick={() => {
                              if (isElementSelected) updateElementStyle('borderRadius', r.val);
                              else updateBlockStyle('borderRadius', r.val);
                            }}
                            className="py-0.5 text-[9px] font-mono rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
                          >
                            {r.label}
                          </button>
                        ))}
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

                    {/* Contour externe (Outline & Offset) */}
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <label className="text-[11px] text-slate-400 block font-medium">Contour externe (Outline)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-400 block mb-0.5">Épaisseur (px)</label>
                          <input
                            type="number"
                            min="0"
                            max="12"
                            value={isElementSelected ? (currentElemStyle.outlineWidth ?? 0) : (selectedBlock.style.outlineWidth ?? 0)}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (isElementSelected) updateElementStyle('outlineWidth', val);
                              else updateBlockStyle('outlineWidth', val);
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 block mb-0.5">Décalage / Offset (px)</label>
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={isElementSelected ? (currentElemStyle.outlineOffset ?? 0) : (selectedBlock.style.outlineOffset ?? 0)}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (isElementSelected) updateElementStyle('outlineOffset', val);
                              else updateBlockStyle('outlineOffset', val);
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={isElementSelected ? (currentElemStyle.outlineColor || '#38bdf8') : (selectedBlock.style.outlineColor || '#38bdf8')}
                          onChange={(e) => {
                            if (isElementSelected) updateElementStyle('outlineColor', e.target.value);
                            else updateBlockStyle('outlineColor', e.target.value);
                          }}
                          className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={isElementSelected ? (currentElemStyle.outlineColor || '#38bdf8') : (selectedBlock.style.outlineColor || '#38bdf8')}
                          onChange={(e) => {
                            if (isElementSelected) updateElementStyle('outlineColor', e.target.value);
                            else updateBlockStyle('outlineColor', e.target.value);
                          }}
                          className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionSection>

                {/* ACCORDION 6: OMBRES & ÉLÉVATION (BOX SHADOW & GLOW) */}
                <AccordionSection
                  title="Ombres & Élévation (Shadows & Glow)"
                  isOpen={openSections.shadow}
                  onToggle={() => toggleSection('shadow')}
                >
                  <div className="space-y-3">
                    {/* Shadow Presets Swatches */}
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1.5 font-medium">
                        Préréglages d&apos;Ombres & Lueurs
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { label: 'Aucune', val: 'none', sub: 'À plat' },
                          { label: 'Subtile Douce', val: '0 2px 10px rgba(0,0,0,0.25)', sub: 'Discrète' },
                          { label: 'Carte Flottante', val: '0 14px 28px rgba(0,0,0,0.38), 0 10px 10px rgba(0,0,0,0.22)', sub: '3D Pro' },
                          { label: 'Cinématique', val: '0 30px 60px -12px rgba(0,0,0,0.75)', sub: 'Profonde' },
                          { label: 'Glow Cyan Néon', val: '0 0 25px rgba(6,182,212,0.65)', sub: 'Cyber #06b6d4' },
                          { label: 'Glow Violet', val: '0 0 25px rgba(168,85,247,0.65)', sub: 'Futuriste' },
                          { label: 'Glow Rose', val: '0 0 25px rgba(236,72,153,0.65)', sub: 'Punchy' },
                          { label: 'Lueur Émeraude', val: '0 0 25px rgba(16,185,129,0.65)', sub: 'Bio-tech' },
                          { label: 'Lueur Or Champagne', val: '0 0 25px rgba(234,179,8,0.55)', sub: 'Luxe' },
                          { label: 'Ombre Inset', val: 'inset 0 2px 8px rgba(0,0,0,0.7)', sub: 'Creusée' },
                          { label: 'Neo-Brutalisme', val: '5px 5px 0px rgba(0,0,0,1)', sub: 'Contraste pur' },
                        ].map((sh) => {
                          const currentVal = isElementSelected ? (currentElemStyle.boxShadow || 'none') : (selectedBlock.style.boxShadow || 'none');
                          const active = currentVal === sh.val;
                          return (
                            <button
                              key={sh.label}
                              onClick={() => {
                                const finalVal = sh.val === 'none' ? undefined : sh.val;
                                if (isElementSelected) updateElementStyle('boxShadow', finalVal);
                                else updateBlockStyle('boxShadow', finalVal);
                              }}
                              className={`p-1.5 rounded-md text-left transition-all border ${
                                active
                                  ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold'
                                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <div className="text-[10px] font-semibold leading-tight">{sh.label}</div>
                              <div className="text-[8px] text-slate-400 font-mono mt-0.5">{sh.sub}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Box-Shadow CSS field */}
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">
                        Valeur CSS Libre (box-shadow)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 0 10px 30px rgba(0,0,0,0.5)"
                        value={(isElementSelected ? currentElemStyle.boxShadow : selectedBlock.style.boxShadow) || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (isElementSelected) updateElementStyle('boxShadow', val);
                          else updateBlockStyle('boxShadow', val);
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </AccordionSection>

                {/* ACCORDION 7: EFFETS VISUELS & FILTRES CSS (FX & GLASS) */}
                <AccordionSection
                  title="Effets Visuels & Filtres CSS (FX & Verre)"
                  isOpen={openSections.effects}
                  onToggle={() => toggleSection('effects')}
                >
                  <div className="space-y-3">
                    {/* Backdrop Blur (Glassmorphism) */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span className="flex items-center gap-1">
                          <span>Flou Arrière-plan (Backdrop Blur)</span>
                        </span>
                        <span className="font-mono text-indigo-300 text-[10px]">
                          {(isElementSelected ? currentElemStyle.backdropBlur : selectedBlock.style.backdropBlur) ?? 0}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        step="1"
                        value={(isElementSelected ? currentElemStyle.backdropBlur : selectedBlock.style.backdropBlur) ?? 0}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (isElementSelected) updateElementStyle('backdropBlur', val);
                          else updateBlockStyle('backdropBlur', val);
                        }}
                        className="w-full accent-indigo-500"
                      />
                      <div className="grid grid-cols-4 gap-1 mt-1">
                        {[0, 8, 16, 24].map((px) => (
                          <button
                            key={px}
                            onClick={() => {
                              if (isElementSelected) updateElementStyle('backdropBlur', px);
                              else updateBlockStyle('backdropBlur', px);
                            }}
                            className="py-0.5 text-[9px] rounded font-mono bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                          >
                            {px}px
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Opacity */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Opacité Globale</span>
                        <span className="font-mono text-indigo-300 text-[10px]">
                          {Math.round(((isElementSelected ? currentElemStyle.opacity : selectedBlock.style.opacity) ?? 1) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="1"
                        step="0.05"
                        value={(isElementSelected ? currentElemStyle.opacity : selectedBlock.style.opacity) ?? 1}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (isElementSelected) updateElementStyle('opacity', val);
                          else updateBlockStyle('opacity', val);
                        }}
                        className="w-full accent-indigo-500"
                      />
                    </div>

                    {/* Overflow */}
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Débordement (Overflow)</label>
                      <div className="grid grid-cols-3 gap-1 p-0.5 bg-black/40 rounded border border-white/10">
                        {['visible', 'hidden', 'auto'].map((ov) => {
                          const active = isElementSelected
                            ? (currentElemStyle.overflow || 'visible') === ov
                            : (selectedBlock.style.overflow || 'visible') === ov;
                          return (
                            <button
                              key={ov}
                              onClick={() => {
                                if (isElementSelected) updateElementStyle('overflow', ov);
                                else updateBlockStyle('overflow', ov);
                              }}
                              className={`py-1 text-[10px] font-mono rounded capitalize transition-colors ${
                                active ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {ov}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* CSS Graphical Filters Grid */}
                    <div className="pt-2 border-t border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-slate-300">
                          Filtres Graphiques CSS (Visual FX)
                        </label>
                        <button
                          onClick={() => {
                            const zeroFilters = {
                              filterBlur: 0,
                              filterBrightness: 1,
                              filterContrast: 1,
                              filterSaturate: 1,
                              filterHueRotate: 0,
                              filterGrayscale: 0,
                              filterInvert: 0,
                            };
                            if (isElementSelected) {
                              Object.entries(zeroFilters).forEach(([k, v]) => updateElementStyle(k as any, v));
                            } else {
                              Object.entries(zeroFilters).forEach(([k, v]) => updateBlockStyle(k as any, v));
                            }
                          }}
                          className="text-[9px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5 border border-white/10"
                        >
                          Réinitialiser
                        </button>
                      </div>

                      {/* Flou Graphique (Filter Blur) */}
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>Flou visuel (Filter Blur)</span>
                          <span className="font-mono text-indigo-300">
                            {(isElementSelected ? currentElemStyle.filterBlur : selectedBlock.style.filterBlur) ?? 0}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="25"
                          step="1"
                          value={(isElementSelected ? currentElemStyle.filterBlur : selectedBlock.style.filterBlur) ?? 0}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (isElementSelected) updateElementStyle('filterBlur', val);
                            else updateBlockStyle('filterBlur', val);
                          }}
                          className="w-full accent-indigo-500"
                        />
                      </div>

                      {/* Luminosité (Brightness) */}
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>Luminosité</span>
                          <span className="font-mono text-indigo-300">
                            {Math.round(((isElementSelected ? currentElemStyle.filterBrightness : selectedBlock.style.filterBrightness) ?? 1) * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.05"
                          value={(isElementSelected ? currentElemStyle.filterBrightness : selectedBlock.style.filterBrightness) ?? 1}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (isElementSelected) updateElementStyle('filterBrightness', val);
                            else updateBlockStyle('filterBrightness', val);
                          }}
                          className="w-full accent-indigo-500"
                        />
                      </div>

                      {/* Contraste (Contrast) */}
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>Contraste</span>
                          <span className="font-mono text-indigo-300">
                            {Math.round(((isElementSelected ? currentElemStyle.filterContrast : selectedBlock.style.filterContrast) ?? 1) * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="2.5"
                          step="0.05"
                          value={(isElementSelected ? currentElemStyle.filterContrast : selectedBlock.style.filterContrast) ?? 1}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (isElementSelected) updateElementStyle('filterContrast', val);
                            else updateBlockStyle('filterContrast', val);
                          }}
                          className="w-full accent-indigo-500"
                        />
                      </div>

                      {/* Saturation */}
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>Saturation</span>
                          <span className="font-mono text-indigo-300">
                            {Math.round(((isElementSelected ? currentElemStyle.filterSaturate : selectedBlock.style.filterSaturate) ?? 1) * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="3"
                          step="0.1"
                          value={(isElementSelected ? currentElemStyle.filterSaturate : selectedBlock.style.filterSaturate) ?? 1}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (isElementSelected) updateElementStyle('filterSaturate', val);
                            else updateBlockStyle('filterSaturate', val);
                          }}
                          className="w-full accent-indigo-500"
                        />
                      </div>

                      {/* Teinte Chromatique (Hue Rotate) */}
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>Rotation Teinte (Hue Rotate)</span>
                          <span className="font-mono text-indigo-300">
                            {(isElementSelected ? currentElemStyle.filterHueRotate : selectedBlock.style.filterHueRotate) ?? 0}°
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          step="5"
                          value={(isElementSelected ? currentElemStyle.filterHueRotate : selectedBlock.style.filterHueRotate) ?? 0}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (isElementSelected) updateElementStyle('filterHueRotate', val);
                            else updateBlockStyle('filterHueRotate', val);
                          }}
                          className="w-full accent-indigo-500"
                        />
                      </div>

                      {/* Niveaux de gris & Inversion */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                            <span>Noir & Blanc</span>
                            <span className="font-mono text-indigo-300">
                              {(isElementSelected ? currentElemStyle.filterGrayscale : selectedBlock.style.filterGrayscale) ?? 0}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={(isElementSelected ? currentElemStyle.filterGrayscale : selectedBlock.style.filterGrayscale) ?? 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (isElementSelected) updateElementStyle('filterGrayscale', val);
                              else updateBlockStyle('filterGrayscale', val);
                            }}
                            className="w-full accent-indigo-500"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                            <span>Inversion</span>
                            <span className="font-mono text-indigo-300">
                              {(isElementSelected ? currentElemStyle.filterInvert : selectedBlock.style.filterInvert) ?? 0}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={(isElementSelected ? currentElemStyle.filterInvert : selectedBlock.style.filterInvert) ?? 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (isElementSelected) updateElementStyle('filterInvert', val);
                              else updateBlockStyle('filterInvert', val);
                            }}
                            className="w-full accent-indigo-500"
                          />
                        </div>
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

                // Dynamic target options including elements selected directly from the canvas
                const targetOptions = [
                  { value: 'block', label: '🏢 La section entière (Conteneur)' },
                ];

                if (selectedElement && selectedElement.blockId === selectedBlock.id && selectedElement.elementKey) {
                  targetOptions.push({
                    value: selectedElement.elementKey,
                    label: `🎯 ${selectedElement.label || selectedElement.elementKey} (Sélectionné sur le canva)`
                  });
                }

                const standardElements = [
                  { value: 'title', label: 'Titre principal' },
                  { value: 'subtitle', label: 'Sous-titre' },
                  { value: 'badge', label: 'Badge / Tag' },
                  { value: 'primaryCta', label: 'Bouton d\'action principal (CTA 1)' },
                  { value: 'secondaryCta', label: 'Bouton d\'action secondaire (CTA 2)' },
                  { value: 'visuals', label: 'Visuels / Grille / Cartes' },
                  { value: 'footerBrand', label: 'Marque (Pied de page)' },
                  { value: 'footerCopyright', label: 'Copyright' },
                  { value: 'nav', label: 'Navigation / Logo' }
                ];

                standardElements.forEach(item => {
                  if (!targetOptions.some(x => x.value === item.value)) {
                    targetOptions.push(item);
                  }
                });

                if (selectedBlock.content.elementStyles) {
                  Object.keys(selectedBlock.content.elementStyles).forEach(key => {
                    if (!targetOptions.some(x => x.value === key)) {
                      targetOptions.push({ value: key, label: `Élément: ${key}` });
                    }
                  });
                }

                if (currentTarget && !targetOptions.some(x => x.value === currentTarget)) {
                  targetOptions.push({ value: currentTarget, label: `Élément: ${currentTarget}` });
                }

                return (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-4">
                      {/* Title Header */}
                      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div>
                          <span className="text-[11px] font-bold text-slate-200 block uppercase tracking-wider">✨ Studio d&apos;Animation</span>
                          <span className="text-[10px] text-slate-400 block">Cinématiques, Déclencheurs & Styles 3D</span>
                        </div>
                      </div>

                      {/* 🧭 Studio Navigation Tabs */}
                      <div className="grid grid-cols-4 gap-1 p-1 bg-black/60 rounded-xl border border-white/10 text-[9px] font-medium">
                        {[
                          { id: 'presets', label: 'Presets', icon: '⚡' },
                          { id: 'logic', label: 'Déclencheurs', icon: '🎯' },
                          { id: 'motion', label: 'Mouvement', icon: '🎬' },
                          { id: 'styles', label: 'Styles CSS', icon: '🎨' },
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setStudioSubTab(m.id as any)}
                            className={`p-1.5 rounded-lg text-center transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                              studioSubTab === m.id
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                            }`}
                          >
                            <span>{m.icon}</span>
                            <span>{m.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* 🎯 Direct Canvas Target Inspector */}
                      <div className="p-3 bg-gradient-to-br from-indigo-950/70 via-purple-950/50 to-slate-900/80 border border-indigo-500/40 rounded-xl space-y-2.5 shadow-lg shadow-indigo-950/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
                              <Target className="w-3.5 h-3.5 animate-pulse" />
                            </span>
                            <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                              Cible depuis le Canva
                            </span>
                          </div>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            Canva Connecté
                          </span>
                        </div>

                        {/* Current Target Display */}
                        <div className="bg-black/40 border border-white/10 rounded-lg p-2.5 flex items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-wide">
                              Cible active :
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs font-bold text-indigo-200 truncate">
                                {currentTarget === 'block'
                                  ? '🏢 Section Entière (Conteneur)'
                                  : (selectedElement?.elementKey === currentTarget 
                                      ? `🎯 ${selectedElement.label || currentTarget}` 
                                      : (targetOptions.find(t => t.value === currentTarget)?.label || `🎯 ${currentTarget}`))}
                              </span>
                              {currentTarget !== 'block' && (
                                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 shrink-0">
                                  {currentTarget}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Reset to Block Container Button */}
                          {currentTarget !== 'block' ? (
                            <button
                              type="button"
                              onClick={() => {
                                updateAnim('animationTarget', 'block');
                                if (style.advancedAnimEnabled) {
                                  updateAnim('advancedAnimTarget', 'block');
                                }
                                onSelectElement?.(null);
                              }}
                              title="Cibler tout le bloc de la section"
                              className="px-2 py-1 text-[10px] font-medium bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 rounded-lg transition-all flex items-center gap-1 shrink-0"
                            >
                              <RotateCcw className="w-2.5 h-2.5" />
                              Toute la section
                            </button>
                          ) : (
                            <span className="text-[9px] text-slate-500 italic shrink-0">
                              Conteneur global
                            </span>
                          )}
                        </div>

                        {/* Canvas Target Assistant Banner */}
                        {selectedElement && selectedElement.blockId === selectedBlock.id ? (
                          <div className="space-y-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <span className="text-[9px] text-indigo-300 block">
                                  Élément sélectionné sur le canva :
                                </span>
                                <span className="text-[11px] font-semibold text-white truncate block">
                                  {selectedElement.label || selectedElement.elementKey}
                                </span>
                              </div>
                              {currentTarget !== selectedElement.elementKey && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateAnim('animationTarget', selectedElement.elementKey);
                                    if (style.advancedAnimEnabled) {
                                      updateAnim('advancedAnimTarget', selectedElement.elementKey);
                                    }
                                  }}
                                  className="px-2.5 py-1 text-[10px] font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition-all flex items-center gap-1 shrink-0"
                                >
                                  <Sparkles className="w-3 h-3 text-yellow-300" />
                                  Cibler cet élément
                                </button>
                              )}
                            </div>
                            
                            {/* Quick shortcuts for hover triggers */}
                            <div className="flex items-center gap-1.5 pt-1 border-t border-indigo-500/20">
                              <span className="text-[8px] font-mono text-indigo-300/70">Survol :</span>
                              <button
                                type="button"
                                onClick={() => updateAnim('hoverTriggerSource', selectedElement.elementKey)}
                                className={`px-1.5 py-0.5 text-[8px] rounded transition-all font-mono ${
                                  style.hoverTriggerSource === selectedElement.elementKey
                                    ? 'bg-purple-600 text-white font-bold'
                                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                                }`}
                                title="Définir comme déclencheur au survol de la souris"
                              >
                                👆 Source de survol
                              </button>
                              <button
                                type="button"
                                onClick={() => updateAnim('hoverTriggerTarget', selectedElement.elementKey)}
                                className={`px-1.5 py-0.5 text-[8px] rounded transition-all font-mono ${
                                  style.hoverTriggerTarget === selectedElement.elementKey
                                    ? 'bg-purple-600 text-white font-bold'
                                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                                }`}
                                title="Définir comme élément à animer lors du survol de la source"
                              >
                                ✨ Cible de survol
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-[10px] text-indigo-200/80 bg-indigo-500/10 border border-indigo-500/15 rounded-lg p-2 leading-relaxed flex items-start gap-1.5">
                            <MousePointerClick className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5 animate-bounce" />
                            <span>
                              <strong>Sélection directe :</strong> Cliquez sur n&apos;importe quel texte, bouton, badge ou image directement sur le canevas pour le désigner instantanément comme cible d&apos;animation !
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 🌟 Professional Studio Presets Gallery */}
                      {studioSubTab === 'presets' && (
                        <div className="p-3 bg-gradient-to-r from-violet-950/40 via-purple-950/30 to-slate-900/50 border border-violet-500/20 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Flame className="w-3.5 h-3.5 text-amber-400" />
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200">
                                Presets Cinématiques Pro
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const cur = style.animationDuration || 0.6;
                                updateAnim('animationDuration', cur + 0.0001);
                                setTimeout(() => updateAnim('animationDuration', cur), 50);
                              }}
                              className="px-2 py-0.5 rounded-full bg-violet-600/30 hover:bg-violet-600/60 border border-violet-400/30 text-[9px] text-violet-200 flex items-center gap-1 transition-all cursor-pointer"
                              title="Rejouer l'animation en direct sur le canevas"
                            >
                              <Play className="w-2.5 h-2.5 fill-violet-200" />
                              Rejouer le rendu
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { name: 'Apple Reveal', icon: '🍎', desc: 'Fondu & Mouvement', act: 'fade', ease: 'cubicBezier', dur: 0.8, loop: 'none', trig: 'load' },
                              { name: 'Spring Pop', icon: '🚀', desc: 'Ressort dynamique', act: 'pop', ease: 'spring', dur: 0.6, loop: 'none', trig: 'load' },
                              { name: 'Float Drift', icon: '🍃', desc: 'Flottement continu', act: 'float', ease: 'easeInOut', dur: 2.5, loop: 'floatDrift', trig: 'load' },
                              { name: '3D Flip Card', icon: '🔄', desc: 'Rotation 3D au survol', act: 'flip', ease: 'spring', dur: 0.7, loop: 'none', trig: 'hover' },
                              { name: 'Neon Pulse', icon: '⚡', desc: 'Lumière vibrante', act: 'zoom', ease: 'easeInOut', dur: 1.8, loop: 'neonGlow', trig: 'load' },
                              { name: 'Cinematic Blur', icon: '✨', desc: 'Défloutage progressif', act: 'blurIn', ease: 'easeOut', dur: 0.9, loop: 'none', trig: 'scroll' },
                              { name: 'Elastic Bounce', icon: '🎈', desc: 'Rebond au clic', act: 'swing', ease: 'bounce', dur: 1.2, loop: 'none', trig: 'click' },
                              { name: 'Cyber Glitch', icon: '🕹️', desc: 'Secousse numérique', act: 'shake', ease: 'spring', dur: 0.5, loop: 'none', trig: 'hover' },
                            ].map((pre) => (
                              <button
                                key={pre.name}
                                type="button"
                                onClick={() => {
                                  onUpdateBlock({
                                    ...selectedBlock,
                                    style: {
                                      ...style,
                                      animationAction: pre.act as any,
                                      animationEasing: pre.ease as any,
                                      animationDuration: pre.dur,
                                      animationLoopType: pre.loop as any,
                                      animationTrigger: pre.trig as any,
                                    }
                                  });
                                }}
                                className="p-2 rounded-xl bg-black/40 hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/40 text-left transition-all group cursor-pointer space-y-0.5"
                              >
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-200 group-hover:text-violet-200">
                                  <span>{pre.icon}</span>
                                  <span>{pre.name}</span>
                                </div>
                                <p className="text-[9px] text-slate-400 group-hover:text-slate-300 leading-tight">
                                  {pre.desc}
                                </p>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 🚀 5 CATEGORIES OF ANIMATION STUDIO LOGIC */}
                      {studioSubTab === 'logic' && (
                        <div className="space-y-4">
                          <div className="space-y-3 pt-2 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            Logique du Studio (5 Catégories)
                          </span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Framer Engine
                          </span>
                        </div>

                        {/* Category Selector Navigation Tabs */}
                        <div className="grid grid-cols-5 gap-1 p-1 bg-black/60 rounded-xl border border-white/10 text-[9px] font-medium">
                          {[
                            { id: 'userAction', label: 'Actions', icon: '👆', desc: 'Directs' },
                            { id: 'scrollDriven', label: 'Scroll', icon: '📜', desc: 'Défilement' },
                            { id: 'sequence', label: 'Séquence', icon: '🔗', desc: 'Chain/Stagger' },
                            { id: 'systemState', label: 'Système', icon: '⚙️', desc: 'Mount/Idle' },
                            { id: 'dragPhysics', label: 'Glisser', icon: '🖐️', desc: 'Physique' },
                          ].map((cat) => {
                            const active = (style.studioAnimCategory || 'userAction') === cat.id;
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => updateAnim('studioAnimCategory', cat.id)}
                                className={`p-1.5 rounded-lg flex flex-col items-center justify-center gap-0.5 text-center transition-all cursor-pointer ${
                                  active
                                    ? 'bg-gradient-to-b from-indigo-600 to-indigo-700 text-white font-bold shadow-md shadow-indigo-900/50 border border-indigo-400/40'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                                }`}
                                title={cat.desc}
                              >
                                <span className="text-xs">{cat.icon}</span>
                                <span className="text-[8px] leading-tight truncate w-full">{cat.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* PANEL 1: ACTIONS UTILISATEUR (Événements Directs) */}
                        {((style.studioAnimCategory || 'userAction') === 'userAction') && (
                          <div className="space-y-3 bg-gradient-to-b from-indigo-950/30 to-black/40 border border-indigo-500/30 p-3.5 rounded-2xl animate-in fade-in duration-200">
                            <div className="flex items-center gap-2 border-b border-indigo-500/20 pb-2">
                              <MousePointerClick className="w-4 h-4 text-indigo-400 shrink-0" />
                              <div>
                                <h4 className="text-xs font-bold text-indigo-200">1. Déclenchement par Action Utilisateur</h4>
                                <p className="text-[9px] text-slate-400">Clic direct, survol intent, appui long ou focus de champ</p>
                              </div>
                            </div>

                            {/* Trigger Mode Selector */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Mode d&apos;Action Directe</label>
                              <select
                                value={style.studioAnimTriggerMode || 'clickSelf'}
                                onChange={(e) => updateAnim('studioAnimTriggerMode', e.target.value)}
                                className="w-full bg-black/50 border border-indigo-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-400 cursor-pointer"
                              >
                                <option value="clickSelf">1. Clic direct (Self-state: [A] anime [A])</option>
                                <option value="clickTarget">2. Clic ciblé (Target-state: [A] déclenche [B])</option>
                                <option value="hover">3. Survol simple (Hover: [A] anime [A] ou [B])</option>
                                <option value="hoverIntent">4. Survol prolongé (Hover intent: [A] pendant X ms)</option>
                                <option value="pressHold">5. Maintien / Appui long (Press & Hold)</option>
                                <option value="inputFocus">6. Saisie / Focus (Input focus :focus)</option>
                              </select>
                            </div>

                            {/* Mode Specific Controls */}
                            {style.studioAnimTriggerMode === 'clickSelf' && (
                              <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10 text-xs">
                                <label className="flex items-center justify-between cursor-pointer">
                                  <span className="text-[10px] font-semibold text-slate-300">Bascule On/Off au clic (Toggle State)</span>
                                  <input
                                    type="checkbox"
                                    checked={style.studioClickSelfToggle ?? true}
                                    onChange={(e) => updateAnim('studioClickSelfToggle', e.target.checked)}
                                    className="accent-indigo-500"
                                  />
                                </label>
                                <span className="text-[9px] text-slate-500 block">Chaque clic bascule l&apos;élément entre son état de repos et son état actif.</span>
                              </div>
                            )}

                            {style.studioAnimTriggerMode === 'clickTarget' && (
                              <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-semibold text-slate-400 uppercase">1. Élément Déclencheur [A]</label>
                                  <select
                                    value={style.studioClickTargetSource || 'block'}
                                    onChange={(e) => updateAnim('studioClickTargetSource', e.target.value)}
                                    className="w-full bg-black/60 border border-white/15 rounded-lg p-1.5 text-xs text-slate-200"
                                  >
                                    {targetOptions.map((opt) => (
                                      <option key={`ctsrc-${opt.value}`} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-semibold text-slate-400 uppercase">2. Élément Cible Animé [B]</label>
                                  <select
                                    value={style.studioClickTargetTarget || 'subtitle'}
                                    onChange={(e) => updateAnim('studioClickTargetTarget', e.target.value)}
                                    className="w-full bg-black/60 border border-white/15 rounded-lg p-1.5 text-xs text-slate-200"
                                  >
                                    {targetOptions.map((opt) => (
                                      <option key={`cttgt-${opt.value}`} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-semibold text-slate-400 uppercase">3. Effet déclenché sur [B]</label>
                                  <select
                                    value={style.studioClickTargetAction || 'pop'}
                                    onChange={(e) => updateAnim('studioClickTargetAction', e.target.value)}
                                    className="w-full bg-black/60 border border-white/15 rounded-lg p-1.5 text-xs text-slate-200"
                                  >
                                    <option value="pop">Pop & Rebond</option>
                                    <option value="fade">Apparition / Disparition Fondu</option>
                                    <option value="slide">Glissement / Élévation</option>
                                    <option value="rotate">Rotation 3D</option>
                                    <option value="shake">Vibration Secousse</option>
                                    <option value="glow">Luminescence & Halo Néon</option>
                                  </select>
                                </div>
                                <label className="flex items-center justify-between cursor-pointer pt-1 border-t border-white/10">
                                  <span className="text-[9px] text-slate-300">Réinitialiser [B] au 2nd clic sur [A]</span>
                                  <input
                                    type="checkbox"
                                    checked={style.studioClickTargetReset ?? true}
                                    onChange={(e) => updateAnim('studioClickTargetReset', e.target.checked)}
                                    className="accent-indigo-500"
                                  />
                                </label>
                              </div>
                            )}

                            {style.studioAnimTriggerMode === 'hover' && (
                              <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-semibold text-slate-400 uppercase">Source de survol [A]</label>
                                  <select
                                    value={style.hoverTriggerSource || 'block'}
                                    onChange={(e) => updateAnim('hoverTriggerSource', e.target.value)}
                                    className="w-full bg-black/60 border border-white/15 rounded-lg p-1.5 text-xs text-slate-200"
                                  >
                                    {targetOptions.map((opt) => (
                                      <option key={`hvrsrc-${opt.value}`} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-semibold text-slate-400 uppercase">Cible de survol [B]</label>
                                  <select
                                    value={style.hoverTriggerTarget || 'primaryCta'}
                                    onChange={(e) => updateAnim('hoverTriggerTarget', e.target.value)}
                                    className="w-full bg-black/60 border border-white/15 rounded-lg p-1.5 text-xs text-slate-200"
                                  >
                                    {targetOptions.map((opt) => (
                                      <option key={`hvrtgt-${opt.value}`} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            )}

                            {style.studioAnimTriggerMode === 'hoverIntent' && (
                              <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[10px]">
                                    <span className="font-semibold text-slate-300">Délai d&apos;intention de survol (Hover Intent)</span>
                                    <span className="font-mono text-indigo-400 font-bold">{style.studioHoverIntentDelayMs || 300} ms</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="100"
                                    max="1500"
                                    step="50"
                                    value={style.studioHoverIntentDelayMs || 300}
                                    onChange={(e) => updateAnim('studioHoverIntentDelayMs', parseInt(e.target.value))}
                                    className="w-full accent-indigo-500 cursor-pointer"
                                  />
                                </div>
                                <span className="text-[9px] text-slate-400 block">L&apos;animation ne se déclenche que si l&apos;utilisateur survole l&apos;élément sans interruption pendant la durée spécifiée.</span>
                              </div>
                            )}

                            {style.studioAnimTriggerMode === 'pressHold' && (
                              <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[10px]">
                                    <span className="font-semibold text-slate-300">Temps de maintien requis (Press & Hold)</span>
                                    <span className="font-mono text-indigo-400 font-bold">{style.studioPressHoldMinTimeMs || 500} ms</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="200"
                                    max="3000"
                                    step="100"
                                    value={style.studioPressHoldMinTimeMs || 500}
                                    onChange={(e) => updateAnim('studioPressHoldMinTimeMs', parseInt(e.target.value))}
                                    className="w-full accent-indigo-500 cursor-pointer"
                                  />
                                </div>
                                <label className="flex items-center justify-between cursor-pointer pt-1">
                                  <span className="text-[9px] text-slate-300">Inverser / Stoper au relâchement</span>
                                  <input
                                    type="checkbox"
                                    checked={style.studioPressHoldReverseOnRelease ?? true}
                                    onChange={(e) => updateAnim('studioPressHoldReverseOnRelease', e.target.checked)}
                                    className="accent-indigo-500"
                                  />
                                </label>
                              </div>
                            )}

                            {style.studioAnimTriggerMode === 'inputFocus' && (
                              <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-semibold text-slate-400 uppercase">Champ Saisie Source [A]</label>
                                  <input
                                    type="text"
                                    placeholder="Ex: #email-input ou input"
                                    value={style.studioInputFocusSource || 'input'}
                                    onChange={(e) => updateAnim('studioInputFocusSource', e.target.value)}
                                    className="w-full bg-black/60 border border-white/15 rounded-lg p-1.5 text-xs text-slate-200 font-mono"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-semibold text-slate-400 uppercase">Réaction sur l&apos;Élément [B]</label>
                                  <select
                                    value={style.studioInputFocusAction || 'labelRise'}
                                    onChange={(e) => updateAnim('studioInputFocusAction', e.target.value)}
                                    className="w-full bg-black/60 border border-white/15 rounded-lg p-1.5 text-xs text-slate-200"
                                  >
                                    <option value="labelRise">Élévation de label (Rising Label)</option>
                                    <option value="glow">Aura lumineuse & halo (:focus glow)</option>
                                    <option value="borderPulse">Pulsation de la bordure active</option>
                                    <option value="zoom">Agrandissement indicateur</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* PANEL 2: DÉCLENCHEMENT PAR DÉFILEMENT (Scroll-driven) */}
                        {((style.studioAnimCategory) === 'scrollDriven') && (
                          <div className="space-y-3 bg-gradient-to-b from-blue-950/30 to-black/40 border border-blue-500/30 p-3.5 rounded-2xl animate-in fade-in duration-200">
                            <div className="flex items-center gap-2 border-b border-blue-500/20 pb-2">
                              <Compass className="w-4 h-4 text-blue-400 shrink-0" />
                              <div>
                                <h4 className="text-xs font-bold text-blue-200">2. Déclenchement par Défilement (Scroll-Driven)</h4>
                                <p className="text-[9px] text-slate-400">IntersectionObserver, Scrub direct, Parallaxe & Direction</p>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Mode de Défilement</label>
                              <select
                                value={style.studioAnimTriggerMode || 'scrollTrigger'}
                                onChange={(e) => updateAnim('studioAnimTriggerMode', e.target.value)}
                                className="w-full bg-black/50 border border-blue-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-blue-400 cursor-pointer"
                              >
                                <option value="scrollTrigger">1. Entrée Viewport (Scroll-trigger / Threshold)</option>
                                <option value="scrollScrub">2. Liaison directe au Scroll (Scrub animation 0-100%)</option>
                                <option value="scrollDirection">3. Direction du Scroll (Down vs Up)</option>
                                <option value="scrollParallax">4. Déplacement Parallaxe (Scroll offset delta)</option>
                              </select>
                            </div>

                            {style.studioAnimTriggerMode === 'scrollTrigger' && (
                              <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[10px]">
                                    <span className="font-semibold text-slate-300">Seuil de visibilité (Threshold % Viewport)</span>
                                    <span className="font-mono text-blue-400 font-bold">{style.studioScrollThresholdPercent ?? 20}%</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="80"
                                    step="5"
                                    value={style.studioScrollThresholdPercent ?? 20}
                                    onChange={(e) => updateAnim('studioScrollThresholdPercent', parseInt(e.target.value))}
                                    className="w-full accent-blue-500 cursor-pointer"
                                  />
                                </div>
                                <label className="flex items-center justify-between cursor-pointer">
                                  <span className="text-[9px] text-slate-300">S&apos;exécute une seule fois (Once)</span>
                                  <input
                                    type="checkbox"
                                    checked={style.studioScrollTriggerOnce ?? true}
                                    onChange={(e) => updateAnim('studioScrollTriggerOnce', e.target.checked)}
                                    className="accent-blue-500"
                                  />
                                </label>
                              </div>
                            )}

                            {style.studioAnimTriggerMode === 'scrollScrub' && (
                              <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <span className="text-[9px] font-semibold text-slate-400 uppercase">Début (Scrub Start)</span>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={style.studioScrollScrubStartOffset ?? 0}
                                      onChange={(e) => updateAnim('studioScrollScrubStartOffset', parseInt(e.target.value))}
                                      className="w-full bg-black/60 border border-white/15 rounded-lg p-1.5 text-xs font-mono text-blue-300"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[9px] font-semibold text-slate-400 uppercase">Fin (Scrub End)</span>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={style.studioScrollScrubEndOffset ?? 100}
                                      onChange={(e) => updateAnim('studioScrollScrubEndOffset', parseInt(e.target.value))}
                                      className="w-full bg-black/60 border border-white/15 rounded-lg p-1.5 text-xs font-mono text-blue-300"
                                    />
                                  </div>
                                </div>
                                <span className="text-[9px] text-slate-400 block">L&apos;avancement temporel de l&apos;animation suit pixel par pixel le niveau de molette du navigateur.</span>
                              </div>
                            )}

                            {style.studioAnimTriggerMode === 'scrollDirection' && (
                              <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-semibold text-slate-400 uppercase">Action au Défilement BAS (Scroll Down)</label>
                                  <select
                                    value={style.studioScrollDirectionDownAction || 'slide'}
                                    onChange={(e) => updateAnim('studioScrollDirectionDownAction', e.target.value)}
                                    className="w-full bg-black/60 border border-white/15 rounded-lg p-1.5 text-xs text-slate-200"
                                  >
                                    <option value="slide">Cacher / Slide Out Vers le haut</option>
                                    <option value="fade">Fondu de masque</option>
                                    <option value="zoom">Réduction d&apos;échelle</option>
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-semibold text-slate-400 uppercase">Action au Défilement HAUT (Scroll Up)</label>
                                  <select
                                    value={style.studioScrollDirectionUpAction || 'revealMask'}
                                    onChange={(e) => updateAnim('studioScrollDirectionUpAction', e.target.value)}
                                    className="w-full bg-black/60 border border-white/15 rounded-lg p-1.5 text-xs text-slate-200"
                                  >
                                    <option value="revealMask">Faire réapparaître / Slide In Sticky</option>
                                    <option value="fade">Fondu d&apos;apparition</option>
                                    <option value="zoom">Agrandissement</option>
                                  </select>
                                </div>
                              </div>
                            )}

                            {style.studioAnimTriggerMode === 'scrollParallax' && (
                              <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[10px]">
                                    <span className="font-semibold text-slate-300">Vitesse relative de Parallaxe</span>
                                    <span className="font-mono text-blue-400 font-bold">{style.studioScrollParallaxSpeed ?? 0.5}x</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="-2"
                                    max="2"
                                    step="0.1"
                                    value={style.studioScrollParallaxSpeed ?? 0.5}
                                    onChange={(e) => updateAnim('studioScrollParallaxSpeed', parseFloat(e.target.value))}
                                    className="w-full accent-blue-500 cursor-pointer"
                                  />
                                </div>
                                <span className="text-[9px] text-slate-400 block">Provoque une impression de profondeur 3D en déplaçant cet élément à une vitesse différente du reste du flux.</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* PANEL 3: SÉQUENCE ET PROPAGATION (Chaining & Stagger) */}
                        {((style.studioAnimCategory) === 'sequence') && (
                          <div className="space-y-3 bg-gradient-to-b from-purple-950/30 to-black/40 border border-purple-500/30 p-3.5 rounded-2xl animate-in fade-in duration-200">
                            <div className="flex items-center gap-2 border-b border-purple-500/20 pb-2">
                              <GitPullRequest className="w-4 h-4 text-purple-400 shrink-0" />
                              <div>
                                <h4 className="text-xs font-bold text-purple-200">3. Séquence et Propagation</h4>
                                <p className="text-[9px] text-slate-400">Enchaînement domino A ➔ B ➔ C, Stagger de liste et Branchement</p>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Mode de Séquençage</label>
                              <select
                                value={style.studioAnimTriggerMode || 'chainReaction'}
                                onChange={(e) => updateAnim('studioAnimTriggerMode', e.target.value)}
                                className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-purple-400 cursor-pointer"
                              >
                                <option value="chainReaction">1. Enchaînement séquentiel (Chain Reaction: A ➔ B ➔ C)</option>
                                <option value="staggerGroup">2. Décalage temporel en groupe (Stagger list N ms)</option>
                                <option value="branchingState">3. Déclenchement conditionnel (Branching State X)</option>
                              </select>
                            </div>

                            {style.studioAnimTriggerMode === 'chainReaction' && (
                              <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                                <label className="text-[9px] font-semibold text-slate-300 uppercase">Ordre de la chaîne en domino</label>
                                <div className="p-2 bg-purple-950/20 border border-purple-500/20 rounded-lg text-[10px] text-purple-200 space-y-1 font-mono">
                                  <div className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[8px]">1</span> <span>Élément A : Titre principal</span></div>
                                  <div className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[8px]">2</span> <span>Élément B : Sous-titre descriptif</span></div>
                                  <div className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[8px]">3</span> <span>Élément C : Bouton d&apos;action CTA</span></div>
                                </div>
                                <span className="text-[9px] text-slate-400 block">Dès la fin d&apos;animation de A (`onComplete`), B se lance automatiquement, suivi de C.</span>
                              </div>
                            )}

                            {style.studioAnimTriggerMode === 'staggerGroup' && (
                              <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[10px]">
                                    <span className="font-semibold text-slate-300">Décalage entre éléments (Stagger Interval)</span>
                                    <span className="font-mono text-purple-400 font-bold">{style.studioStaggerDelayMs ?? 120} ms</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="30"
                                    max="600"
                                    step="10"
                                    value={style.studioStaggerDelayMs ?? 120}
                                    onChange={(e) => updateAnim('studioStaggerDelayMs', parseInt(e.target.value))}
                                    className="w-full accent-purple-500 cursor-pointer"
                                  />
                                </div>
                                <span className="text-[9px] text-slate-400 block">Cascade harmonieuse sur toutes les cartes, colonnes ou éléments enfants.</span>
                              </div>
                            )}

                            {style.studioAnimTriggerMode === 'branchingState' && (
                              <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-semibold text-slate-400 uppercase">Nom de la variable d&apos;état [X]</label>
                                  <input
                                    type="text"
                                    placeholder="Ex: isActive ou isLoggedIn"
                                    value={style.studioBranchingStateKey || 'isActive'}
                                    onChange={(e) => updateAnim('studioBranchingStateKey', e.target.value)}
                                    className="w-full bg-black/60 border border-white/15 rounded-lg p-1.5 text-xs text-slate-200 font-mono"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <span className="text-[9px] font-semibold text-emerald-400 uppercase">Si VRAI ➔ Anime [B]</span>
                                    <select
                                      value={style.studioBranchingTrueAction || 'pop'}
                                      onChange={(e) => updateAnim('studioBranchingTrueAction', e.target.value)}
                                      className="w-full bg-black/60 border border-emerald-500/30 rounded-lg p-1.5 text-xs text-slate-200"
                                    >
                                      <option value="pop">Pop & Glow Vert</option>
                                      <option value="slide">Slide In Success</option>
                                    </select>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[9px] font-semibold text-rose-400 uppercase">Si FAUX ➔ Anime [C]</span>
                                    <select
                                      value={style.studioBranchingFalseAction || 'shake'}
                                      onChange={(e) => updateAnim('studioBranchingFalseAction', e.target.value)}
                                      className="w-full bg-black/60 border border-rose-500/30 rounded-lg p-1.5 text-xs text-slate-200"
                                    >
                                      <option value="shake">Secousse Shake</option>
                                      <option value="fade">Disparition / Warning</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* PANEL 4: SYSTÈME ET ÉTATS DE DONNÉES */}
                        {((style.studioAnimCategory) === 'systemState') && (
                          <div className="space-y-3 bg-gradient-to-b from-emerald-950/30 to-black/40 border border-emerald-500/30 p-3.5 rounded-2xl animate-in fade-in duration-200">
                            <div className="flex items-center gap-2 border-b border-emerald-500/20 pb-2">
                              <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                              <div>
                                <h4 className="text-xs font-bold text-emerald-200">4. Système et États de Données</h4>
                                <p className="text-[9px] text-slate-400">Montage DOM, Exit suspendu, Mutation de variable & Inactivité</p>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Événement Système</label>
                              <select
                                value={style.studioAnimTriggerMode || 'mounting'}
                                onChange={(e) => updateAnim('studioAnimTriggerMode', e.target.value)}
                                className="w-full bg-black/50 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-400 cursor-pointer"
                              >
                                <option value="mounting">1. Chargement / Montage DOM (Mounting)</option>
                                <option value="unmountingExit">2. Démontage / Suppression (Unmounting/Exit)</option>
                                <option value="stateMutation">3. Mutation de variable / état (State mutation listener)</option>
                                <option value="idleTrigger">4. Inactivité utilisateur (Idle trigger après X sec)</option>
                              </select>
                            </div>

                            {style.studioAnimTriggerMode === 'mounting' && (
                              <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                                <label className="text-[9px] font-semibold text-slate-400 uppercase">Effet d&apos;entrée au montage</label>
                                <select
                                  value={style.studioMountingAction || 'blurIn'}
                                  onChange={(e) => updateAnim('studioMountingAction', e.target.value)}
                                  className="w-full bg-black/60 border border-white/15 rounded-lg p-1.5 text-xs text-slate-200"
                                >
                                  <option value="blurIn">Apparition Floutée Cinématographique (Blur-In)</option>
                                  <option value="fade">Fondu Doux</option>
                                  <option value="slide">Glissement d&apos;entrée</option>
                                  <option value="zoom">Agrandissement Progressif</option>
                                  <option value="pop">Élasticité Rebondissante</option>
                                </select>
                              </div>
                            )}

                            {style.studioAnimTriggerMode === 'unmountingExit' && (
                              <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                                <label className="text-[9px] font-semibold text-slate-400 uppercase">Animation de sortie (AnimatePresence Exit)</label>
                                <select
                                  value={style.studioExitAction || 'blurOut'}
                                  onChange={(e) => updateAnim('studioExitAction', e.target.value)}
                                  className="w-full bg-black/60 border border-white/15 rounded-lg p-1.5 text-xs text-slate-200"
                                >
                                  <option value="blurOut">Dissolution Floue (Cinematic Blur-Out)</option>
                                  <option value="fade">Disparition en Fondu</option>
                                  <option value="shrink">Contraction & Retrait</option>
                                  <option value="slide">Glissement Hors Écran</option>
                                </select>
                                <span className="text-[9px] text-slate-400 block">Suspend le retrait du DOM le temps de jouer l&apos;animation de fermeture.</span>
                              </div>
                            )}

                            {style.studioAnimTriggerMode === 'stateMutation' && (
                              <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-semibold text-slate-400 uppercase">Variable sous écoute</label>
                                  <input
                                    type="text"
                                    placeholder="Ex: itemQuantity ou activeTab"
                                    value={style.studioStateMutationVarName || 'itemQuantity'}
                                    onChange={(e) => updateAnim('studioStateMutationVarName', e.target.value)}
                                    className="w-full bg-black/60 border border-white/15 rounded-lg p-1.5 text-xs text-slate-200 font-mono"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-semibold text-slate-400 uppercase">Effet de Réactivité</label>
                                  <select
                                    value={style.studioStateMutationAction || 'scaleBounce'}
                                    onChange={(e) => updateAnim('studioStateMutationAction', e.target.value)}
                                    className="w-full bg-black/60 border border-white/15 rounded-lg p-1.5 text-xs text-slate-200"
                                  >
                                    <option value="scaleBounce">Brebond d&apos;Échelle (Scale Bounce)</option>
                                    <option value="flashColor">Flash Chromatique de Confirmation</option>
                                    <option value="pulse">Pulsation d&apos;Attention</option>
                                    <option value="shake">Secousse Micro-Haptique</option>
                                  </select>
                                </div>
                              </div>
                            )}

                            {style.studioAnimTriggerMode === 'idleTrigger' && (
                              <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[10px]">
                                    <span className="font-semibold text-slate-300">Délai d&apos;inactivité requis</span>
                                    <span className="font-mono text-emerald-400 font-bold">{style.studioIdleTimeoutSeconds || 5} sec</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="1"
                                    max="30"
                                    step="1"
                                    value={style.studioIdleTimeoutSeconds || 5}
                                    onChange={(e) => updateAnim('studioIdleTimeoutSeconds', parseInt(e.target.value))}
                                    className="w-full accent-emerald-500 cursor-pointer"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-semibold text-slate-400 uppercase">Animation de Rappel / Attirer le regard</label>
                                  <select
                                    value={style.studioIdleAction || 'heartbeat'}
                                    onChange={(e) => updateAnim('studioIdleAction', e.target.value)}
                                    className="w-full bg-black/60 border border-white/15 rounded-lg p-1.5 text-xs text-slate-200"
                                  >
                                    <option value="heartbeat">Double Pulsation Cardiaque (Heartbeat)</option>
                                    <option value="glowPulse">Pulsation du Halo Lumineux</option>
                                    <option value="wobble">Oscillation Balancement (Wobble)</option>
                                    <option value="shake">Secousse de Notification</option>
                                    <option value="bounce">Rebond d&apos;Inviter à Cliquers</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* PANEL 5: GLISSER-DÉPOSER ET GESTE (Drag & Physics) */}
                        {((style.studioAnimCategory) === 'dragPhysics') && (
                          <div className="space-y-3 bg-gradient-to-b from-amber-950/30 to-black/40 border border-amber-500/30 p-3.5 rounded-2xl animate-in fade-in duration-200">
                            <div className="flex items-center gap-2 border-b border-amber-500/20 pb-2">
                              <Move className="w-4 h-4 text-amber-400 shrink-0" />
                              <div>
                                <h4 className="text-xs font-bold text-amber-200">5. Glisser-Déposer et Gestes (Drag & Physics)</h4>
                                <p className="text-[9px] text-slate-400">Inertie Spring, Suivi de position & Franchissement de seuil</p>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Mode de Geste</label>
                              <select
                                value={style.studioAnimTriggerMode || 'dragTracking'}
                                onChange={(e) => updateAnim('studioAnimTriggerMode', e.target.value)}
                                className="w-full bg-black/50 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-400 cursor-pointer"
                              >
                                <option value="dragTracking">1. Déplacement continu (Drag tracking + Spring physics)</option>
                                <option value="dragThreshold">2. Franchissement de seuil (Threshold trigger & Snap back)</option>
                              </select>
                            </div>

                            {style.studioAnimTriggerMode === 'dragTracking' && (
                              <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-semibold text-slate-400 uppercase">Axe de glissement autorisé</label>
                                  <select
                                    value={style.studioDragAxis || 'all'}
                                    onChange={(e) => updateAnim('studioDragAxis', e.target.value)}
                                    className="w-full bg-black/60 border border-white/15 rounded-lg p-1.5 text-xs text-slate-200"
                                  >
                                    <option value="all">Toutes directions (X et Y multidimensionnel)</option>
                                    <option value="x">Horizontal uniquement (Axe X)</option>
                                    <option value="y">Vertical uniquement (Axe Y)</option>
                                  </select>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <span className="text-[9px] text-slate-400">Tension Ressort</span>
                                    <input
                                      type="number"
                                      value={style.studioDragSpringStiffness || 150}
                                      onChange={(e) => updateAnim('studioDragSpringStiffness', parseInt(e.target.value))}
                                      className="w-full bg-black/60 border border-white/15 rounded-lg p-1 text-xs font-mono text-amber-300"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[9px] text-slate-400">Amortissement</span>
                                    <input
                                      type="number"
                                      value={style.studioDragSpringDamping || 15}
                                      onChange={(e) => updateAnim('studioDragSpringDamping', parseInt(e.target.value))}
                                      className="w-full bg-black/60 border border-white/15 rounded-lg p-1 text-xs font-mono text-amber-300"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {style.studioAnimTriggerMode === 'dragThreshold' && (
                              <div className="space-y-2 bg-black/40 p-2.5 rounded-xl border border-white/10">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[10px]">
                                    <span className="font-semibold text-slate-300">Seuil de franchissement (px)</span>
                                    <span className="font-mono text-amber-400 font-bold">{style.studioDragThresholdPx || 100} px</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="20"
                                    max="400"
                                    step="10"
                                    value={style.studioDragThresholdPx || 100}
                                    onChange={(e) => updateAnim('studioDragThresholdPx', parseInt(e.target.value))}
                                    className="w-full accent-amber-500 cursor-pointer"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-semibold text-slate-400 uppercase">Action de validation au franchissement</label>
                                  <select
                                    value={style.studioDragThresholdSuccessAction || 'unlock'}
                                    onChange={(e) => updateAnim('studioDragThresholdSuccessAction', e.target.value)}
                                    className="w-full bg-black/60 border border-white/15 rounded-lg p-1.5 text-xs text-slate-200"
                                  >
                                    <option value="unlock">Déverrouillage & Slide-out (Swipe to Confirm)</option>
                                    <option value="glow">Aura Néon & Explosion de particules</option>
                                    <option value="pop">Pop d&apos;ouverture</option>
                                  </select>
                                </div>
                                <span className="text-[9px] text-slate-400 block">Si relâché avant {style.studioDragThresholdPx || 100}px, l&apos;élément revient automatiquement à sa position d&apos;origine avec effet ressort.</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* 1. Déclencheur Standard (Trigger) */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center justify-between">
                          <span className="flex items-center gap-1.5">⚡ Déclencheur (Trigger Event)</span>
                          <span className="text-[9px] font-mono text-indigo-400 font-normal">Événement d&apos;entrée</span>
                        </label>
                        <select
                          value={currentTrigger}
                          onChange={(e) => updateAnim('animationTrigger', e.target.value)}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                        >
                          <option value="load">Au chargement de la page (On Load)</option>
                          <option value="hover">Au survol de la souris (On Hover)</option>
                          <option value="click">Au clic de l&apos;utilisateur (On Click)</option>
                          <option value="scroll">Au défilement de l&apos;écran (On Scroll Into View)</option>
                        </select>
                        <span className="text-[9px] text-slate-500 block">Détermine à quel moment exact l&apos;animation se déclenche.</span>
                      </div>

                      {/* 2. Élément Cible (Target Element) */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center justify-between">
                          <span className="flex items-center gap-1.5">🎯 Élément Cible (Hierarchy Target)</span>
                          <span className="text-[9px] font-mono text-indigo-400 font-normal">Cible DOM</span>
                        </label>
                        <select
                          value={currentTarget}
                          onChange={(e) => updateAnim('animationTarget', e.target.value)}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                        >
                          {targetOptions.map((opt) => (
                            <option key={`anim-${opt.value}`} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <span className="text-[9px] text-slate-500 block">Synchronisé en temps réel avec vos clics sur le canevas.</span>
                      </div>

                      {/* 3. L'action à jouer (Action to Play) */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center justify-between">
                          <span className="flex items-center gap-1.5">🎬 Cinématique & Mouvement (Action)</span>
                          <span className="text-[9px] font-mono text-indigo-400 font-normal">Type d&apos;effet</span>
                        </label>
                        <select
                          value={currentAction}
                          onChange={(e) => updateAnim('animationAction', e.target.value)}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                        >
                          <option value="fade">Apparition en fondu (Fade In)</option>
                          <option value="slide">Glissement fluide (Smooth Slide)</option>
                          <option value="zoom">Zoom progressif (Zoom In)</option>
                          <option value="rotate">Rotation & pivotement (Rotate)</option>
                          <option value="shake">Vibration & secousse (Shake / Micro-haptic)</option>
                          <option value="float">Lévitation en apesanteur (Float Drift)</option>
                          <option value="flip">Basculement 3D (3D Flip)</option>
                          <option value="blurIn">Apparition Floutée Cinématographique (Cinematic Blur-In)</option>
                          <option value="pop">Élasticité Rebondissante (Pop & Stretch)</option>
                          <option value="swing">Balancement Pendulaire (Organic Swing)</option>
                          <option value="revealMask">Dévoilement par Masque Linéaire (Mask Reveal)</option>
                        </select>
                        <span className="text-[9px] text-slate-500 block">La cinématique principale appliquée sur l&apos;élément ou conteneur.</span>
                      </div>

                      {/* 4. Courbe d'accélération (Easing curve) */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center justify-between">
                          <span className="flex items-center gap-1.5">📈 Courbe d&apos;Accélération (Easing)</span>
                          <span className="text-[9px] font-mono text-indigo-400 font-normal">Interpolation</span>
                        </label>
                        <select
                          value={currentEasing}
                          onChange={(e) => updateAnim('animationEasing', e.target.value)}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                        >
                          <option value="cubicBezier">Ultra-Smooth Apple Deceleration (Cubic Bezier)</option>
                          <option value="spring">Ressort Physique (Spring Dynamique)</option>
                          <option value="bounce">Rebonds Organiques (Bounce Réaliste)</option>
                          <option value="anticipate">Anticipation Énergique (Anticipate Recoil)</option>
                          <option value="easeInOut">Harmonieux Naturel (Ease-In-Out)</option>
                          <option value="easeOut">Décélération Douce (Ease-Out)</option>
                          <option value="easeIn">Accélération Progressive (Ease-In)</option>
                          <option value="linear">Linéaire Constant (Linear)</option>
                        </select>
                        <span className="text-[9px] text-slate-500 block">Définit la courbe d&apos;accélération et le rythme physique du mouvement.</span>
                      </div>

                      {/* 5. Type de boucle (Loop type) */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center justify-between">
                          <span className="flex items-center gap-1.5">🔁 Boucle & Mouvement Continu (Loop)</span>
                          <span className="text-[9px] font-mono text-indigo-400 font-normal">Cycle infini</span>
                        </label>
                        <select
                          value={currentLoopType}
                          onChange={(e) => updateAnim('animationLoopType', e.target.value)}
                          className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                        >
                          <option value="none">Aucune boucle (S&apos;exécute une seule fois)</option>
                          <option value="yoyo">Va-et-vient élégant (Yoyo)</option>
                          <option value="loop">Répétition infinie (Loop continue)</option>
                          <option value="pulse">Battement de coeur pulsé (Heartbeat Pulse)</option>
                          <option value="breathe">Respiration organique (Zen Breathe)</option>
                          <option value="neonGlow">Halo lumineux vibrant (Neon Glow Cycle)</option>
                          <option value="floatDrift">Flottaison multidimensionnelle (Float & Drift)</option>
                          <option value="spin">Rotation 360° infinie (Spin)</option>
                        </select>
                        <span className="text-[9px] text-slate-500 block">Anime l&apos;élément en continu pour attirer le regard sans surcharger.</span>
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
                            max="4"
                            step="0.05"
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
                            step="0.05"
                            value={currentDelay}
                            onChange={(e) => updateAnim('animationDelay', parseFloat(e.target.value))}
                            className="w-full accent-indigo-500 cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-4">
                      {/* Title Header */}
                      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                        <MousePointerClick className="w-4 h-4 text-purple-400 shrink-0" />
                        <div>
                          <span className="text-[11px] font-bold text-slate-200 block uppercase tracking-wider">👆 Interactions Avancées (Survol Réactif)</span>
                          <span className="text-[10px] text-slate-400 block">Survolez un élément pour déclencher une réaction sur un autre</span>
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
                          {targetOptions.map((opt) => (
                            <option key={`hsrc-${opt.value}`} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <span className="text-[9px] text-slate-500 block">L&apos;élément que l&apos;utilisateur doit survoler avec sa souris.</span>
                      </div>

                      {style.hoverTriggerSource && style.hoverTriggerSource !== 'none' && (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                              <span>✨ Élément à animer en réaction</span>
                            </label>
                            <select
                              value={style.hoverTriggerTarget || 'none'}
                              onChange={(e) => updateAnim('hoverTriggerTarget', e.target.value)}
                              className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
                            >
                              <option value="none">Aucun (Désactivé)</option>
                              {targetOptions.map((opt) => (
                                <option key={`htgt-${opt.value}`} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                            <span className="text-[9px] text-slate-500 block">L&apos;élément qui s&apos;animera lorsque la source est survolée.</span>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                              <span>🎬 Effet interactif de réaction</span>
                            </label>
                            <select
                              value={style.hoverTriggerAction || 'fade'}
                              onChange={(e) => updateAnim('hoverTriggerAction', e.target.value)}
                              className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
                            >
                              <option value="fade">Apparition / Surbrillance (Fade)</option>
                              <option value="slide">Élévation / Translation (Slide)</option>
                              <option value="zoom">Agrandissement Subtil (Scale / Zoom)</option>
                              <option value="rotate">Rotation Dynamique (Rotate)</option>
                              <option value="shake">Vibration / Haptic (Shake)</option>
                              <option value="float">Lévitation en apesanteur (Float)</option>
                              <option value="glow">Luminescence & Halo Néon (Glow)</option>
                              <option value="liftShadow">Élévation & Ombre Portée 3D (Lift Shadow)</option>
                              <option value="tilt3D">Inclinaison 3D Interactive (Tilt 3D)</option>
                              <option value="colorShift">Mutation Chromatique (Color Shift)</option>
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
                              <option value="spring">Ressort Réactif (Spring)</option>
                              <option value="bounce">Rebond Organique (Bounce)</option>
                            </select>
                          </div>
                        </>
                      )}

                      </div>
                      </div>
                    )}

                  {/* Orchestre d&apos;Animation Avancé (Total Freedom & Pro Physics) */}
                  {studioSubTab === 'motion' && (
                    <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <span className="text-[11px] font-bold text-slate-200 block uppercase tracking-wider">🎼 Orchestre Cinématique Avancé</span>
                            <span className="text-[10px] text-slate-400 block">Total Freedom • Physique 3D & Keyframes</span>
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
                            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">🎯 Élément Cible Avancé</label>
                            <select
                              value={style.advancedAnimTarget || 'block'}
                              onChange={(e) => updateAnim('advancedAnimTarget', e.target.value)}
                              className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 transition-all cursor-pointer"
                            >
                              {targetOptions.map((opt) => (
                                <option key={`advtgt-${opt.value}`} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>

                          {/* Moteur Physique */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">⚙️ Moteur de Calcul</label>
                            <select
                              value={style.advancedAnimType || 'spring'}
                              onChange={(e) => updateAnim('advancedAnimType', e.target.value)}
                              className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 transition-all cursor-pointer"
                            >
                              <option value="spring">Ressort Réaliste (Spring Physics)</option>
                              <option value="tween">Interpolation Linéaire / Bézier (Tween)</option>
                              <option value="keyframes">Keyframes Studio Multi-Étapes (Complex Sequences)</option>
                            </select>
                          </div>

                          {/* Keyframes Mode Selection */}
                          {style.advancedAnimType === 'keyframes' && (
                            <div className="space-y-2 bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl">
                              <label className="text-[10px] font-bold text-emerald-300 uppercase tracking-wide flex items-center gap-1">
                                <Wand2 className="w-3.5 h-3.5" />
                                Modèle de Séquence Keyframe
                              </label>
                              <select
                                value={style.animationKeyframesMode || 'cinematicZoom'}
                                onChange={(e) => updateAnim('animationKeyframesMode', e.target.value)}
                                className="w-full bg-black/50 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-400 cursor-pointer"
                              >
                                <option value="cinematicZoom">Cinematic Zoom & Exposure ([0.9, 1.05, 1])</option>
                                <option value="heartbeat">Heartbeat Dual Pulse ([1, 1.15, 0.95, 1.2, 1])</option>
                                <option value="rubberBand">Rubber Band Stretch ([1, 1.25, 0.75, 1.15, 1])</option>
                                <option value="jello">Jello Distortion Skew (Fluide gélatineux)</option>
                                <option value="glitch">Digital Glitch Micro-Displacement (Cyberpunk)</option>
                                <option value="magneticFloat">Magnetic 3D Float (Lévitation magnétique)</option>
                              </select>
                            </div>
                          )}

                          {/* Spring Physics Parameters */}
                          {style.advancedAnimType === 'spring' && (
                            <div className="grid grid-cols-2 gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Tension (Stiffness)</span>
                                  <span className="text-emerald-400 font-bold">{style.advancedAnimStiffness || 100}</span>
                                </div>
                                <input type="range" min="10" max="600" step="10" value={style.advancedAnimStiffness || 100} onChange={(e) => updateAnim('advancedAnimStiffness', parseFloat(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Friction (Damping)</span>
                                  <span className="text-emerald-400 font-bold">{style.advancedAnimDamping || 10}</span>
                                </div>
                                <input type="range" min="1" max="100" step="1" value={style.advancedAnimDamping || 10} onChange={(e) => updateAnim('advancedAnimDamping', parseFloat(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Masse (Mass)</span>
                                  <span className="text-emerald-400 font-bold">{style.advancedAnimMass || 1}</span>
                                </div>
                                <input type="range" min="0.1" max="10" step="0.1" value={style.advancedAnimMass || 1} onChange={(e) => updateAnim('advancedAnimMass', parseFloat(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Vélocité Initiale</span>
                                  <span className="text-emerald-400 font-bold">{style.advancedAnimVelocity || 0}</span>
                                </div>
                                <input type="range" min="-100" max="100" step="5" value={style.advancedAnimVelocity || 0} onChange={(e) => updateAnim('advancedAnimVelocity', parseFloat(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
                              </div>
                            </div>
                          )}

                          {/* Tween Cubic Bezier */}
                          {style.advancedAnimType === 'tween' && (
                            <div className="space-y-1.5 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                <span>Courbe Bézier (x1, y1, x2, y2)</span>
                                <span className="text-emerald-400 font-bold">{style.advancedAnimCubicBezier || "0.16, 1, 0.3, 1"}</span>
                              </div>
                              <select
                                value={style.advancedAnimCubicBezier || "0.16, 1, 0.3, 1"}
                                onChange={(e) => updateAnim('advancedAnimCubicBezier', e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 focus:border-emerald-500 cursor-pointer"
                              >
                                <option value="0.16, 1, 0.3, 1">Apple Smooth (0.16, 1, 0.3, 1)</option>
                                <option value="0.25, 0.1, 0.25, 1">Material Standard (0.25, 0.1, 0.25, 1)</option>
                                <option value="0.34, 1.56, 0.64, 1">Energetic Overshoot (0.34, 1.56, 0.64, 1)</option>
                                <option value="0.7, 0, 0.84, 0">Power Ease-In (0.7, 0, 0.84, 0)</option>
                                <option value="0, 0, 0.2, 1">Deceleration Fast Out (0, 0, 0.2, 1)</option>
                              </select>
                            </div>
                          )}

                          {/* Transformations 2D & 3D de départ */}
                          <div className="space-y-2 pt-2 border-t border-white/5">
                            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center justify-between">
                              <span>📐 Transformations Spatiales (Départ ➔ Arrivée)</span>
                              <span className="text-[9px] font-mono text-emerald-400">Espace 3D</span>
                            </label>
                            
                            <div className="space-y-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                              {/* Translate X & Y */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                    <span>Translate X</span>
                                    <span className="text-emerald-400">{style.advancedAnimTranslateX || 0}px</span>
                                  </div>
                                  <input type="range" min="-400" max="400" step="5" value={style.advancedAnimTranslateX || 0} onChange={(e) => updateAnim('advancedAnimTranslateX', parseFloat(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                    <span>Translate Y</span>
                                    <span className="text-emerald-400">{style.advancedAnimTranslateY || 0}px</span>
                                  </div>
                                  <input type="range" min="-400" max="400" step="5" value={style.advancedAnimTranslateY || 0} onChange={(e) => updateAnim('advancedAnimTranslateY', parseFloat(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
                                </div>
                              </div>

                              {/* Translate Z (Profondeur 3D) */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Translate Z (Profondeur 3D)</span>
                                  <span className="text-emerald-400">{style.advancedAnimTranslateZ || 0}px</span>
                                </div>
                                <input type="range" min="-300" max="300" step="10" value={style.advancedAnimTranslateZ || 0} onChange={(e) => updateAnim('advancedAnimTranslateZ', parseFloat(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
                              </div>

                              {/* Rotations 3D (X, Y, Z) */}
                              <div className="grid grid-cols-3 gap-2">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[8px] font-mono text-slate-400">
                                    <span>Rot X (Tilt)</span>
                                    <span className="text-emerald-400">{style.advancedAnimRotateX || 0}°</span>
                                  </div>
                                  <input type="range" min="-90" max="90" step="5" value={style.advancedAnimRotateX || 0} onChange={(e) => updateAnim('advancedAnimRotateX', parseFloat(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[8px] font-mono text-slate-400">
                                    <span>Rot Y (Pan)</span>
                                    <span className="text-emerald-400">{style.advancedAnimRotateY || 0}°</span>
                                  </div>
                                  <input type="range" min="-90" max="90" step="5" value={style.advancedAnimRotateY || 0} onChange={(e) => updateAnim('advancedAnimRotateY', parseFloat(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[8px] font-mono text-slate-400">
                                    <span>Rot Z (Roll)</span>
                                    <span className="text-emerald-400">{style.advancedAnimRotate || 0}°</span>
                                  </div>
                                  <input type="range" min="-180" max="180" step="10" value={style.advancedAnimRotate || 0} onChange={(e) => updateAnim('advancedAnimRotate', parseFloat(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
                                </div>
                              </div>

                              {/* Scale & Skew */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                    <span>Échelle (Scale)</span>
                                    <span className="text-emerald-400">{style.advancedAnimScale !== undefined ? style.advancedAnimScale : 1}x</span>
                                  </div>
                                  <input type="range" min="0.1" max="2.5" step="0.05" value={style.advancedAnimScale !== undefined ? style.advancedAnimScale : 1} onChange={(e) => updateAnim('advancedAnimScale', parseFloat(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                    <span>Biseautage (Skew X)</span>
                                    <span className="text-emerald-400">{style.advancedAnimSkewX || 0}°</span>
                                  </div>
                                  <input type="range" min="-45" max="45" step="5" value={style.advancedAnimSkewX || 0} onChange={(e) => updateAnim('advancedAnimSkewX', parseFloat(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
                                </div>
                              </div>
                              
                              {/* Flou Cinématographique & Opacité */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                    <span>Flou (Blur de départ)</span>
                                    <span className="text-emerald-400">{style.advancedAnimBlur || 0}px</span>
                                  </div>
                                  <input type="range" min="0" max="24" step="1" value={style.advancedAnimBlur || 0} onChange={(e) => updateAnim('advancedAnimBlur', parseFloat(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                    <span>Opacité (Opacity)</span>
                                    <span className="text-emerald-400">{style.advancedAnimOpacity !== undefined ? style.advancedAnimOpacity : 1}</span>
                                  </div>
                                  <input type="range" min="0" max="1" step="0.05" value={style.advancedAnimOpacity !== undefined ? style.advancedAnimOpacity : 1} onChange={(e) => updateAnim('advancedAnimOpacity', parseFloat(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Timing & Enchaînement (Stagger Children) */}
                          <div className="space-y-2 pt-2 border-t border-white/5">
                            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">⏱️ Enchaînement Cascade (Stagger Children)</label>
                            
                            <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5 space-y-1">
                              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                <span>Décalage par sous-élément (Stagger)</span>
                                <span className="text-emerald-400 font-bold">{style.advancedAnimStagger || 0}s</span>
                              </div>
                              <input type="range" min="0" max="0.5" step="0.02" value={style.advancedAnimStagger || 0} onChange={(e) => updateAnim('advancedAnimStagger', parseFloat(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
                              <span className="text-[8px] text-slate-500 block">Anime en cascade les enfants de la section (cartes, boutons, puces) de manière séquentielle.</span>
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  )}

                  {/* 5. Studio d'Animation des Propriétés Style (CSS & Visuals) */}
                  {studioSubTab === 'styles' && (
                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Palette className="w-4 h-4 text-pink-400" />
                          <h4 className="text-xs font-bold text-slate-200">Animation des Propriétés Style (CSS)</h4>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!style.animStylePropsEnabled}
                            onChange={(e) => updateAnim('animStylePropsEnabled', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-pink-500"></div>
                        </label>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Animez toutes les caractéristiques visuelles : couleurs de fond et de texte, rayons de bordure, halos néon, flous glassmorphism et typographie.
                      </p>

                      {style.animStylePropsEnabled && (
                        <div className="space-y-4 bg-gradient-to-b from-pink-950/20 to-black/40 border border-pink-500/20 p-3.5 rounded-2xl animate-in fade-in duration-300">
                          
                          {/* Cible des styles animés */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center justify-between">
                              <span className="flex items-center gap-1">🎯 Élément Cible du Style</span>
                              <span className="text-[9px] font-mono text-pink-400">Cible spécifique</span>
                            </label>
                            <select
                              value={style.animStyleTarget || 'block'}
                              onChange={(e) => updateAnim('animStyleTarget', e.target.value)}
                              className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-pink-500 transition-all cursor-pointer"
                            >
                              {targetOptions.map((opt) => (
                                <option key={`styletgt-${opt.value}`} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>

                          {/* Presets de Styles Animés (1-Clic) */}
                          <div className="space-y-2 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-pink-300 uppercase tracking-wide flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-pink-400" />
                                Presets de Style Cinématiques (1-Clic)
                              </span>
                              <span className="text-[9px] text-pink-400 font-mono">Prêts à l&apos;emploi</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                {
                                  name: 'Glass Morph',
                                  icon: '💎',
                                  apply: {
                                    animBgColorStart: 'rgba(255, 255, 255, 0.02)',
                                    animBgColorEnd: 'rgba(255, 255, 255, 0.12)',
                                    animBorderColorStart: 'rgba(255, 255, 255, 0.05)',
                                    animBorderColorEnd: 'rgba(255, 255, 255, 0.35)',
                                    animBackdropBlurStart: 0,
                                    animBackdropBlurEnd: 20,
                                    animBorderRadiusStart: 12,
                                    animBorderRadiusEnd: 24,
                                    animBoxShadowStart: '0px 0px 0px rgba(0,0,0,0)',
                                    animBoxShadowEnd: '0 20px 40px -15px rgba(0,0,0,0.5)',
                                  }
                                },
                                {
                                  name: 'Neon Glow',
                                  icon: '⚡',
                                  apply: {
                                    animBgColorStart: 'rgba(15, 23, 42, 0.8)',
                                    animBgColorEnd: 'rgba(88, 28, 135, 0.5)',
                                    animBorderColorStart: 'rgba(255, 255, 255, 0.1)',
                                    animBorderColorEnd: '#c084fc',
                                    animBorderWidthStart: 1,
                                    animBorderWidthEnd: 2,
                                    animBoxShadowStart: '0 0 0px rgba(192, 132, 252, 0)',
                                    animBoxShadowEnd: '0 0 35px rgba(192, 132, 252, 0.75)',
                                    animTextColorStart: '#e2e8f0',
                                    animTextColorEnd: '#ffffff',
                                  }
                                },
                                {
                                  name: 'Morphing Pill',
                                  icon: '💊',
                                  apply: {
                                    animBorderRadiusStart: 6,
                                    animBorderRadiusEnd: 40,
                                    animPaddingStart: 10,
                                    animPaddingEnd: 22,
                                    animLetterSpacingStart: 0,
                                    animLetterSpacingEnd: 3,
                                    animBorderColorStart: 'rgba(255, 255, 255, 0.15)',
                                    animBorderColorEnd: '#ec4899',
                                  }
                                },
                                {
                                  name: 'Technicolor',
                                  icon: '🎨',
                                  apply: {
                                    animFilterGrayscale: 0,
                                    animFilterSaturate: 1.6,
                                    animFilterContrast: 1.25,
                                    animFilterBrightness: 1.1,
                                  }
                                },
                                {
                                  name: 'Dark Luxury',
                                  icon: '👑',
                                  apply: {
                                    animBorderRadiusStart: 12,
                                    animBorderRadiusEnd: 20,
                                    animBoxShadowStart: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                    animBoxShadowEnd: '0 30px 60px -15px rgba(0,0,0,0.9)',
                                    animBorderColorStart: 'rgba(255,255,255,0.06)',
                                    animBorderColorEnd: 'rgba(250, 204, 21, 0.4)',
                                    animBgColorStart: 'rgba(15, 23, 42, 0.95)',
                                    animBgColorEnd: 'rgba(2, 6, 23, 0.98)',
                                  }
                                },
                                {
                                  name: 'Hue Cycle',
                                  icon: '🌈',
                                  apply: {
                                    animFilterHueRotate: 180,
                                    animFilterBrightness: 1.15,
                                    animFilterSaturate: 1.3,
                                  }
                                },
                                {
                                  name: 'Kinetic Type',
                                  icon: '⚡',
                                  apply: {
                                    animFontSizeStart: 24,
                                    animFontSizeEnd: 32,
                                    animFontWeightStart: 400,
                                    animFontWeightEnd: 800,
                                    animLetterSpacingStart: 0,
                                    animLetterSpacingEnd: 4,
                                    animTextColorStart: '#94a3b8',
                                    animTextColorEnd: '#38bdf8',
                                    animTextShadowEnd: '0 0 20px rgba(56, 189, 248, 0.8)',
                                  }
                                },
                                {
                                  name: 'Cyber Hologram',
                                  icon: '🔮',
                                  apply: {
                                    animFilterHueRotate: 220,
                                    animOutlineWidthStart: 0,
                                    animOutlineWidthEnd: 2,
                                    animOutlineColorEnd: '#06b6d4',
                                    animOutlineOffsetEnd: 4,
                                    animBoxShadowEnd: '0 0 35px rgba(6, 182, 212, 0.7)',
                                    animTextShadowEnd: '0 0 15px rgba(6, 182, 212, 0.9)',
                                  }
                                },
                                {
                                  name: 'Vintage Sepia',
                                  icon: '🎞️',
                                  apply: {
                                    animFilterSepiaStart: 0,
                                    animFilterSepiaEnd: 85,
                                    animFilterContrast: 1.25,
                                    animFilterBrightness: 1.05,
                                  }
                                },
                              ].map((preset) => (
                                <button
                                  key={preset.name}
                                  type="button"
                                  onClick={() => {
                                    onUpdateBlock({
                                      ...selectedBlock,
                                      style: {
                                        ...style,
                                        animStylePropsEnabled: true,
                                        ...preset.apply
                                      }
                                    });
                                  }}
                                  className="p-1.5 rounded-lg bg-black/50 hover:bg-pink-600/20 border border-white/10 hover:border-pink-500/40 text-left transition-all group cursor-pointer"
                                >
                                  <div className="flex items-center gap-1 text-[10px] font-medium text-slate-200 group-hover:text-pink-200">
                                    <span>{preset.icon}</span>
                                    <span className="truncate">{preset.name}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 1. Couleurs (Background, Text, Border) */}
                          <div className="space-y-2.5 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center justify-between">
                              <span>🎨 Couleurs (Départ ➔ Arrivée)</span>
                              <span className="text-[9px] text-pink-400 font-mono">Transition chromatique</span>
                            </label>

                            {/* Couleur de fond */}
                            <div className="space-y-1">
                              <span className="text-[9px] font-mono text-slate-400">Couleur d&apos;arrière-plan (Background)</span>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-lg p-1.5">
                                  <input type="color" value={style.animBgColorStart?.startsWith('#') ? style.animBgColorStart : '#1e1b4b'} onChange={(e) => updateAnim('animBgColorStart', e.target.value)} className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent" />
                                  <input type="text" placeholder="Départ (ex: transparent)" value={style.animBgColorStart || ''} onChange={(e) => updateAnim('animBgColorStart', e.target.value)} className="w-full bg-transparent text-[10px] text-slate-300 focus:outline-none" />
                                </div>
                                <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-lg p-1.5">
                                  <input type="color" value={style.animBgColorEnd?.startsWith('#') ? style.animBgColorEnd : '#7c3aed'} onChange={(e) => updateAnim('animBgColorEnd', e.target.value)} className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent" />
                                  <input type="text" placeholder="Arrivée (ex: #7c3aed)" value={style.animBgColorEnd || ''} onChange={(e) => updateAnim('animBgColorEnd', e.target.value)} className="w-full bg-transparent text-[10px] text-slate-300 focus:outline-none" />
                                </div>
                              </div>
                            </div>

                            {/* Couleur du texte */}
                            <div className="space-y-1">
                              <span className="text-[9px] font-mono text-slate-400">Couleur du texte (Color)</span>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-lg p-1.5">
                                  <input type="color" value={style.animTextColorStart?.startsWith('#') ? style.animTextColorStart : '#94a3b8'} onChange={(e) => updateAnim('animTextColorStart', e.target.value)} className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent" />
                                  <input type="text" placeholder="Départ (ex: #94a3b8)" value={style.animTextColorStart || ''} onChange={(e) => updateAnim('animTextColorStart', e.target.value)} className="w-full bg-transparent text-[10px] text-slate-300 focus:outline-none" />
                                </div>
                                <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-lg p-1.5">
                                  <input type="color" value={style.animTextColorEnd?.startsWith('#') ? style.animTextColorEnd : '#ffffff'} onChange={(e) => updateAnim('animTextColorEnd', e.target.value)} className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent" />
                                  <input type="text" placeholder="Arrivée (ex: #ffffff)" value={style.animTextColorEnd || ''} onChange={(e) => updateAnim('animTextColorEnd', e.target.value)} className="w-full bg-transparent text-[10px] text-slate-300 focus:outline-none" />
                                </div>
                              </div>
                            </div>

                            {/* Couleur de bordure */}
                            <div className="space-y-1">
                              <span className="text-[9px] font-mono text-slate-400">Couleur de bordure (Border Color)</span>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-lg p-1.5">
                                  <input type="color" value={style.animBorderColorStart?.startsWith('#') ? style.animBorderColorStart : '#334155'} onChange={(e) => updateAnim('animBorderColorStart', e.target.value)} className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent" />
                                  <input type="text" placeholder="Départ (ex: #334155)" value={style.animBorderColorStart || ''} onChange={(e) => updateAnim('animBorderColorStart', e.target.value)} className="w-full bg-transparent text-[10px] text-slate-300 focus:outline-none" />
                                </div>
                                <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-lg p-1.5">
                                  <input type="color" value={style.animBorderColorEnd?.startsWith('#') ? style.animBorderColorEnd : '#ec4899'} onChange={(e) => updateAnim('animBorderColorEnd', e.target.value)} className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent" />
                                  <input type="text" placeholder="Arrivée (ex: #ec4899)" value={style.animBorderColorEnd || ''} onChange={(e) => updateAnim('animBorderColorEnd', e.target.value)} className="w-full bg-transparent text-[10px] text-slate-300 focus:outline-none" />
                                </div>
                              </div>
                            </div>

                            {/* Opacité Start / End */}
                            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/5">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Opacité Départ</span>
                                  <span className="text-pink-400 font-bold">{Math.round((style.animOpacityStart ?? 1) * 100)}%</span>
                                </div>
                                <input type="range" min="0" max="1" step="0.05" value={style.animOpacityStart ?? 1} onChange={(e) => updateAnim('animOpacityStart', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Opacité Arrivée</span>
                                  <span className="text-pink-400 font-bold">{Math.round((style.animOpacityEnd ?? 1) * 100)}%</span>
                                </div>
                                <input type="range" min="0" max="1" step="0.05" value={style.animOpacityEnd ?? 1} onChange={(e) => updateAnim('animOpacityEnd', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                            </div>
                          </div>

                          {/* 2. Bordures, Rayons & Ombres */}
                          <div className="space-y-2.5 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center justify-between">
                              <span>📐 Bordures & Rayons (Morphing)</span>
                              <span className="text-[9px] text-pink-400 font-mono">Géométrie</span>
                            </label>

                            {/* Rayon de bordure */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Rayon Départ</span>
                                  <span className="text-pink-400 font-bold">{style.animBorderRadiusStart ?? 0}px</span>
                                </div>
                                <input type="range" min="0" max="60" step="2" value={style.animBorderRadiusStart ?? 0} onChange={(e) => updateAnim('animBorderRadiusStart', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Rayon Arrivée</span>
                                  <span className="text-pink-400 font-bold">{style.animBorderRadiusEnd ?? 16}px</span>
                                </div>
                                <input type="range" min="0" max="60" step="2" value={style.animBorderRadiusEnd ?? 16} onChange={(e) => updateAnim('animBorderRadiusEnd', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                            </div>

                            {/* Épaisseur de bordure */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Épaisseur Départ</span>
                                  <span className="text-pink-400 font-bold">{style.animBorderWidthStart ?? 0}px</span>
                                </div>
                                <input type="range" min="0" max="10" step="1" value={style.animBorderWidthStart ?? 0} onChange={(e) => updateAnim('animBorderWidthStart', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Épaisseur Arrivée</span>
                                  <span className="text-pink-400 font-bold">{style.animBorderWidthEnd ?? 2}px</span>
                                </div>
                                <input type="range" min="0" max="10" step="1" value={style.animBorderWidthEnd ?? 2} onChange={(e) => updateAnim('animBorderWidthEnd', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                            </div>

                            {/* Contour externe (Outline Glow & Offset) */}
                            <div className="space-y-2 pt-1 border-t border-white/5">
                              <span className="text-[9px] font-mono text-slate-400">Contour externe (Outline Glow & Offset)</span>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="space-y-1">
                                  <span className="text-[8px] text-slate-400">Épaisseur</span>
                                  <input type="number" min="0" max="8" value={style.animOutlineWidthEnd ?? 0} onChange={(e) => updateAnim('animOutlineWidthEnd', parseFloat(e.target.value) || 0)} className="w-full bg-black/40 border border-white/10 rounded p-1 text-[10px] text-pink-300" />
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[8px] text-slate-400">Décalage (Offset)</span>
                                  <input type="number" min="0" max="12" value={style.animOutlineOffsetEnd ?? 0} onChange={(e) => updateAnim('animOutlineOffsetEnd', parseFloat(e.target.value) || 0)} className="w-full bg-black/40 border border-white/10 rounded p-1 text-[10px] text-pink-300" />
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[8px] text-slate-400">Couleur</span>
                                  <input type="color" value={style.animOutlineColorEnd?.startsWith('#') ? style.animOutlineColorEnd : '#38bdf8'} onChange={(e) => updateAnim('animOutlineColorEnd', e.target.value)} className="w-full h-6 rounded cursor-pointer border-0 bg-transparent" />
                                </div>
                              </div>
                            </div>

                            {/* Ombre & Halo Lumineux (Box Shadow) */}
                            <div className="space-y-1.5 pt-1 border-t border-white/5">
                              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                <span>Halo Lumineux / Ombre Arrivée (Box Shadow)</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1.5">
                                {[
                                  { label: 'Aucune', val: 'none' },
                                  { label: 'Glow Violet', val: '0 0 35px rgba(168, 85, 247, 0.65)' },
                                  { label: 'Glow Cyan', val: '0 0 35px rgba(6, 182, 212, 0.7)' },
                                  { label: 'Glow Rose', val: '0 0 35px rgba(236, 72, 153, 0.7)' },
                                  { label: 'Élévation 3D', val: '0 25px 50px -12px rgba(0,0,0,0.8)' },
                                  { label: 'Halo Blanc Inset', val: 'inset 0 0 20px rgba(255,255,255,0.25)' },
                                ].map((sh) => (
                                  <button
                                    key={sh.label}
                                    type="button"
                                    onClick={() => updateAnim('animBoxShadowEnd', sh.val)}
                                    className={`p-1.5 rounded-lg border text-[9px] truncate transition-all cursor-pointer ${
                                      style.animBoxShadowEnd === sh.val
                                        ? 'bg-pink-600/30 border-pink-400 text-pink-200'
                                        : 'bg-black/30 border-white/10 text-slate-300 hover:border-white/20'
                                    }`}
                                  >
                                    {sh.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Lueur de Texte / Néon (Text Shadow) */}
                            <div className="space-y-1.5 pt-1 border-t border-white/5">
                              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                <span>Lueur de Texte / Néon (Text Shadow)</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1.5">
                                {[
                                  { label: 'Aucun', val: 'none' },
                                  { label: 'Néon Cyan', val: '0 0 15px rgba(6, 182, 212, 0.9)' },
                                  { label: 'Néon Violet', val: '0 0 15px rgba(168, 85, 247, 0.9)' },
                                  { label: 'Lueur Dorée', val: '0 0 15px rgba(234, 179, 8, 0.85)' },
                                  { label: 'Halo Rose', val: '0 0 18px rgba(236, 72, 153, 0.9)' },
                                  { label: 'Ombre 3D Sombre', val: '2px 4px 8px rgba(0,0,0,0.75)' },
                                ].map((tsh) => (
                                  <button
                                    key={tsh.label}
                                    type="button"
                                    onClick={() => updateAnim('animTextShadowEnd', tsh.val)}
                                    className={`p-1.5 rounded-lg border text-[9px] truncate transition-all cursor-pointer ${
                                      style.animTextShadowEnd === tsh.val
                                        ? 'bg-pink-600/30 border-pink-400 text-pink-200'
                                        : 'bg-black/30 border-white/10 text-slate-300 hover:border-white/20'
                                    }`}
                                  >
                                    {tsh.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* 3. Verre & Filtres Graphiques (CSS Filters: Blur, Brightness, Saturation, Hue, Grayscale, Invert, Sepia) */}
                          <div className="space-y-2.5 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center justify-between">
                              <span>🔮 Verre & Filtres Graphiques (CSS Filters)</span>
                              <span className="text-[9px] text-pink-400 font-mono">Effets Visuels</span>
                            </label>

                            {/* Flou de verre (Backdrop Blur) */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Glass Blur Départ</span>
                                  <span className="text-pink-400 font-bold">{style.animBackdropBlurStart ?? 0}px</span>
                                </div>
                                <input type="range" min="0" max="30" step="2" value={style.animBackdropBlurStart ?? 0} onChange={(e) => updateAnim('animBackdropBlurStart', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Glass Blur Arrivée</span>
                                  <span className="text-pink-400 font-bold">{style.animBackdropBlurEnd ?? 16}px</span>
                                </div>
                                <input type="range" min="0" max="30" step="2" value={style.animBackdropBlurEnd ?? 16} onChange={(e) => updateAnim('animBackdropBlurEnd', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                            </div>

                            {/* Flou Graphique direct (Filter Blur) */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Flou Filtre Départ</span>
                                  <span className="text-pink-400 font-bold">{style.animFilterBlurStart ?? 0}px</span>
                                </div>
                                <input type="range" min="0" max="25" step="1" value={style.animFilterBlurStart ?? 0} onChange={(e) => updateAnim('animFilterBlurStart', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Flou Filtre Arrivée</span>
                                  <span className="text-pink-400 font-bold">{style.animFilterBlurEnd ?? 0}px</span>
                                </div>
                                <input type="range" min="0" max="25" step="1" value={style.animFilterBlurEnd ?? 0} onChange={(e) => updateAnim('animFilterBlurEnd', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                            </div>

                            {/* Saturation & Rotation Teinte */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Saturation</span>
                                  <span className="text-pink-400 font-bold">{Math.round((style.animFilterSaturate ?? 1) * 100)}%</span>
                                </div>
                                <input type="range" min="0" max="2.5" step="0.1" value={style.animFilterSaturate ?? 1} onChange={(e) => updateAnim('animFilterSaturate', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Rotation Teinte (Hue)</span>
                                  <span className="text-pink-400 font-bold">{style.animFilterHueRotate ?? 0}°</span>
                                </div>
                                <input type="range" min="0" max="360" step="15" value={style.animFilterHueRotate ?? 0} onChange={(e) => updateAnim('animFilterHueRotate', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                            </div>

                            {/* Luminosité & Contraste */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Luminosité</span>
                                  <span className="text-pink-400 font-bold">{Math.round((style.animFilterBrightness ?? 1) * 100)}%</span>
                                </div>
                                <input type="range" min="0.5" max="2" step="0.05" value={style.animFilterBrightness ?? 1} onChange={(e) => updateAnim('animFilterBrightness', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Contraste</span>
                                  <span className="text-pink-400 font-bold">{Math.round((style.animFilterContrast ?? 1) * 100)}%</span>
                                </div>
                                <input type="range" min="0.5" max="2" step="0.05" value={style.animFilterContrast ?? 1} onChange={(e) => updateAnim('animFilterContrast', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                            </div>

                            {/* Niveaux de gris, Inversion & Sépia */}
                            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[8px] font-mono text-slate-400">
                                  <span>Gris</span>
                                  <span className="text-pink-400 font-bold">{style.animFilterGrayscale ?? 0}%</span>
                                </div>
                                <input type="range" min="0" max="100" step="5" value={style.animFilterGrayscale ?? 0} onChange={(e) => updateAnim('animFilterGrayscale', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[8px] font-mono text-slate-400">
                                  <span>Inversion</span>
                                  <span className="text-pink-400 font-bold">{style.animFilterInvertEnd ?? 0}%</span>
                                </div>
                                <input type="range" min="0" max="100" step="5" value={style.animFilterInvertEnd ?? 0} onChange={(e) => updateAnim('animFilterInvertEnd', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[8px] font-mono text-slate-400">
                                  <span>Sépia</span>
                                  <span className="text-pink-400 font-bold">{style.animFilterSepiaEnd ?? 0}%</span>
                                </div>
                                <input type="range" min="0" max="100" step="5" value={style.animFilterSepiaEnd ?? 0} onChange={(e) => updateAnim('animFilterSepiaEnd', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                            </div>
                          </div>

                          {/* 4. Typographie & Texte Dynamique (Font Size, Font Weight, Tracking) */}
                          <div className="space-y-2.5 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center justify-between">
                              <span>✍️ Typographie & Texte Dynamique</span>
                              <span className="text-[9px] text-pink-400 font-mono">Taille, Graisse & Tracking</span>
                            </label>

                            {/* Taille de police (Font Size) */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Taille Départ</span>
                                  <span className="text-pink-400 font-bold">{style.animFontSizeStart ?? 16}px</span>
                                </div>
                                <input type="range" min="10" max="72" step="1" value={style.animFontSizeStart ?? 16} onChange={(e) => updateAnim('animFontSizeStart', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Taille Arrivée</span>
                                  <span className="text-pink-400 font-bold">{style.animFontSizeEnd ?? 16}px</span>
                                </div>
                                <input type="range" min="10" max="72" step="1" value={style.animFontSizeEnd ?? 16} onChange={(e) => updateAnim('animFontSizeEnd', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                            </div>

                            {/* Graisse de police (Font Weight) */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <span className="text-[9px] font-mono text-slate-400">Graisse Départ</span>
                                <select value={style.animFontWeightStart ?? 400} onChange={(e) => updateAnim('animFontWeightStart', parseInt(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded p-1 text-[10px] text-slate-200">
                                  <option value="300">300 (Light)</option>
                                  <option value="400">400 (Regular)</option>
                                  <option value="500">500 (Medium)</option>
                                  <option value="600">600 (SemiBold)</option>
                                  <option value="700">700 (Bold)</option>
                                  <option value="800">800 (ExtraBold)</option>
                                  <option value="900">900 (Black)</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[9px] font-mono text-slate-400">Graisse Arrivée</span>
                                <select value={style.animFontWeightEnd ?? 700} onChange={(e) => updateAnim('animFontWeightEnd', parseInt(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded p-1 text-[10px] text-slate-200">
                                  <option value="300">300 (Light)</option>
                                  <option value="400">400 (Regular)</option>
                                  <option value="500">500 (Medium)</option>
                                  <option value="600">600 (SemiBold)</option>
                                  <option value="700">700 (Bold)</option>
                                  <option value="800">800 (ExtraBold)</option>
                                  <option value="900">900 (Black)</option>
                                </select>
                              </div>
                            </div>

                            {/* Espacement des lettres (Tracking) */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Tracking Départ</span>
                                  <span className="text-pink-400 font-bold">{style.animLetterSpacingStart ?? 0}px</span>
                                </div>
                                <input type="range" min="-2" max="16" step="0.5" value={style.animLetterSpacingStart ?? 0} onChange={(e) => updateAnim('animLetterSpacingStart', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Tracking Arrivée</span>
                                  <span className="text-pink-400 font-bold">{style.animLetterSpacingEnd ?? 2}px</span>
                                </div>
                                <input type="range" min="-2" max="16" step="0.5" value={style.animLetterSpacingEnd ?? 2} onChange={(e) => updateAnim('animLetterSpacingEnd', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                            </div>
                          </div>

                          {/* 5. Espacements & Dimensions (Padding, Marges, Gap) */}
                          <div className="space-y-2.5 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wide flex items-center justify-between">
                              <span>📏 Espacements & Dimensions</span>
                              <span className="text-[9px] text-pink-400 font-mono">Padding, Marges & Gap</span>
                            </label>

                            {/* Marge interne (Padding) */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Padding Départ</span>
                                  <span className="text-pink-400 font-bold">{style.animPaddingStart ?? 0}px</span>
                                </div>
                                <input type="range" min="0" max="60" step="2" value={style.animPaddingStart ?? 0} onChange={(e) => updateAnim('animPaddingStart', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Padding Arrivée</span>
                                  <span className="text-pink-400 font-bold">{style.animPaddingEnd ?? 16}px</span>
                                </div>
                                <input type="range" min="0" max="60" step="2" value={style.animPaddingEnd ?? 16} onChange={(e) => updateAnim('animPaddingEnd', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                            </div>

                            {/* Marge externe (Margin) */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Marge Départ</span>
                                  <span className="text-pink-400 font-bold">{style.animMarginStart ?? 0}px</span>
                                </div>
                                <input type="range" min="0" max="40" step="2" value={style.animMarginStart ?? 0} onChange={(e) => updateAnim('animMarginStart', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Marge Arrivée</span>
                                  <span className="text-pink-400 font-bold">{style.animMarginEnd ?? 0}px</span>
                                </div>
                                <input type="range" min="0" max="40" step="2" value={style.animMarginEnd ?? 0} onChange={(e) => updateAnim('animMarginEnd', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                            </div>

                            {/* Espacement (Gap) */}
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Gap Départ</span>
                                  <span className="text-pink-400 font-bold">{style.animGapStart ?? 0}px</span>
                                </div>
                                <input type="range" min="0" max="40" step="2" value={style.animGapStart ?? 0} onChange={(e) => updateAnim('animGapStart', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                                  <span>Gap Arrivée</span>
                                  <span className="text-pink-400 font-bold">{style.animGapEnd ?? 16}px</span>
                                </div>
                                <input type="range" min="0" max="40" step="2" value={style.animGapEnd ?? 16} onChange={(e) => updateAnim('animGapEnd', parseFloat(e.target.value))} className="w-full accent-pink-500 cursor-pointer" />
                              </div>
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  )}
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
