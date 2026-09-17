'use client';

import React, { useState } from 'react';
import { 
  Monitor, Tablet, Smartphone, 
  Download, Eye, Edit3, Plus, 
  Code2, RotateCcw, ChevronDown, Move, Bot, Sliders, Undo2, Redo2
} from 'lucide-react';
import { ViewportMode, BlockType } from '@/types/builder';

interface TopBarProps {
  projectName: string;
  onUpdateProjectName: (name: string) => void;
  viewportMode: ViewportMode;
  onViewportChange: (mode: ViewportMode) => void;
  isPreviewMode: boolean;
  onTogglePreviewMode: () => void;
  isFreeformMode?: boolean;
  onToggleFreeformMode?: () => void;
  onOpenExportModal: () => void;
  themeAccent: string;
  onUpdateThemeAccent: (color: string) => void;
  onAddBlock: (type: BlockType) => void;
  onResetToDefault: () => void;
  isCodeDrawerOpen?: boolean;
  onToggleCodeDrawer?: () => void;
  onOpenAIModal?: () => void;
  isAIPanelOpen?: boolean;
  onToggleAIPanel?: () => void;
  activeModelName?: string;
  isInspectorOpen?: boolean;
  onToggleInspector?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  projectName,
  onUpdateProjectName,
  viewportMode,
  onViewportChange,
  isPreviewMode,
  onTogglePreviewMode,
  isFreeformMode = false,
  onToggleFreeformMode,
  onOpenExportModal,
  themeAccent,
  onUpdateThemeAccent,
  onAddBlock,
  onResetToDefault,
  isCodeDrawerOpen = false,
  onToggleCodeDrawer,
  onOpenAIModal,
  isAIPanelOpen = true,
  onToggleAIPanel,
  activeModelName,
  isInspectorOpen = true,
  onToggleInspector,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(projectName);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const themePalettes = [
    { label: 'Indigo', color: '#6366f1' },
    { label: 'Violet', color: '#a855f7' },
    { label: 'Cyan', color: '#06b6d4' },
    { label: 'Émeraude', color: '#10b981' },
    { label: 'Rose', color: '#f43f5e' },
  ];

  const handleFinishNameEdit = () => {
    setIsEditingName(false);
    if (tempName.trim()) {
      onUpdateProjectName(tempName.trim());
    }
  };

  return (
    <header className="h-14 w-full bg-[#080b13]/95 border-b border-white/[0.08] backdrop-blur-xl px-2.5 sm:px-4 md:px-6 flex items-center justify-between z-40 shrink-0 select-none">
      {/* Left: Brand + Project Name + Add Section */}
      <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <span className="font-mono font-black text-xs text-white">od</span>
          </div>
          <span className="font-bold text-sm tracking-tight text-white hidden md:inline">opendesign</span>
        </div>

        <div className="h-4 w-[1px] bg-white/10 hidden sm:block shrink-0" />

        {/* Project Name (Click to edit) */}
        {isEditingName ? (
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleFinishNameEdit}
            onKeyDown={(e) => e.key === 'Enter' && handleFinishNameEdit()}
            autoFocus
            className="bg-[#141926] border border-indigo-500/50 rounded-lg px-2 py-0.5 text-xs text-white outline-none w-28 sm:w-40 font-mono"
          />
        ) : (
          <button
            onClick={() => setIsEditingName(true)}
            title="Cliquer pour renommer"
            className="text-xs text-slate-300 hover:text-white font-mono hover:bg-white/5 px-1.5 sm:px-2 py-1 rounded-lg transition-colors truncate max-w-[100px] xs:max-w-[130px] sm:max-w-[180px]"
          >
            {projectName}
          </button>
        )}

        {/* Quick Add Section Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 font-medium transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="hidden sm:inline">Section</span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {isAddMenuOpen && (
            <div
              className="absolute top-10 left-0 z-50 w-48 bg-[#0d1222] border border-white/15 rounded-xl shadow-2xl p-1.5 backdrop-blur-xl animate-in fade-in"
              onClick={() => setIsAddMenuOpen(false)}
            >
              {[
                { type: 'hero' as BlockType, label: 'Section Héros' },
                { type: 'canvas3d' as BlockType, label: 'Élément 3D Spatial' },
                { type: 'canvas2d' as BlockType, label: 'Studio 2D Vectoriel' },
                { type: 'featureGrid' as BlockType, label: 'Grille Bento' },
                { type: 'pricing' as BlockType, label: 'Grille de Tarifs' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => onAddBlock(item.type)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-indigo-600/30 transition-colors flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <Plus className="w-3.5 h-3.5 text-slate-500" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Undo/Redo + Device Switcher */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 bg-black/40 border border-white/10 rounded-xl p-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Annuler (Ctrl+Z)"
            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
              canUndo ? 'text-slate-200 hover:text-white hover:bg-white/10' : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Rétablir (Ctrl+Y)"
            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
              canRedo ? 'text-slate-200 hover:text-white hover:bg-white/10' : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-0.5">
          <button
            onClick={() => onViewportChange('desktop')}
            title="Vue Bureau (1200px)"
            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
              viewportMode === 'desktop'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewportChange('tablet')}
            title="Vue Tablette (768px)"
            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
              viewportMode === 'tablet'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewportChange('mobile')}
            title="Vue Mobile (390px)"
            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
              viewportMode === 'mobile'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Theme Accent Swatches (Hidden on very small screens, visible on md+) */}
        <div className="hidden lg:flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-xl px-2 py-1.5">
          {themePalettes.map((p) => (
            <button
              key={p.color}
              onClick={() => onUpdateThemeAccent(p.color)}
              title={`Thème ${p.label}`}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                themeAccent === p.color
                  ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-[#080b13]'
                  : 'opacity-70 hover:opacity-100 hover:scale-110'
              }`}
              style={{ backgroundColor: p.color }}
            />
          ))}
        </div>
      </div>

      {/* Right: Mode Toggle + Code + Export */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Reset / Revert */}
        <button
          onClick={onResetToDefault}
          title="Réinitialiser le modèle"
          className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors hidden xl:flex items-center gap-1 text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Mode Toggle: Édition Directe vs Aperçu Réel */}
        <button
          onClick={onTogglePreviewMode}
          title={isPreviewMode ? "Passer en mode édition" : "Passer en mode aperçu réel"}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isPreviewMode
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
          }`}
        >
          {isPreviewMode ? (
            <>
              <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">Aperçu</span>
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="hidden sm:inline">Édition</span>
            </>
          )}
        </button>

        {/* Freeform 2D Mode Toggle (Desktop & Tablet) */}
        {!isPreviewMode && onToggleFreeformMode && (
          <button
            onClick={onToggleFreeformMode}
            title="Activer/désactiver le mode libre (déplacement 2D)"
            className={`hidden sm:flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isFreeformMode
                ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40'
                : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/10 hover:bg-white/10'
            }`}
          >
            <Move className={`w-3.5 h-3.5 ${isFreeformMode ? 'text-cyan-300 animate-pulse' : 'text-slate-400'}`} />
            <span className="hidden lg:inline">{isFreeformMode ? 'Libre' : 'Libre'}</span>
          </button>
        )}

        {/* AI Agent Console & Model Toggle */}
        {onToggleAIPanel && (
          <button
            onClick={onToggleAIPanel}
            title={isAIPanelOpen ? "Masquer la console IA" : "Afficher la console IA latérale"}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              isAIPanelOpen
                ? 'bg-purple-600/30 text-purple-200 border-purple-500/50 shadow-md shadow-purple-500/10'
                : 'bg-purple-500/15 hover:bg-purple-500/25 border-purple-500/30 text-purple-300 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="hidden xl:inline font-mono text-[11px] truncate max-w-[110px]">
              {activeModelName || 'Console IA'}
            </span>
          </button>
        )}

        {/* Inspector Panel Toggle */}
        {onToggleInspector && (
          <button
            onClick={onToggleInspector}
            title={isInspectorOpen ? "Masquer le panneau Inspecteur / Propriétés" : "Afficher le panneau Inspecteur / Propriétés"}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              isInspectorOpen
                ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="hidden xl:inline text-[11px]">Inspecteur</span>
          </button>
        )}

        {/* Code Drawer Toggle */}
        {onToggleCodeDrawer && (
          <button
            onClick={onToggleCodeDrawer}
            title="Inspecter le code React"
            className={`p-1.5 sm:p-2 rounded-xl border transition-colors ${
              isCodeDrawerOpen
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'text-slate-400 hover:text-white border-white/10 hover:bg-white/10'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Primary Export Button */}
        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-xs shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Exporter</span>
        </button>
      </div>
    </header>
  );
};
