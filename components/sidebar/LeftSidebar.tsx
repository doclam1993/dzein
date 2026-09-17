'use client';

import React, { useState } from 'react';
import { 
  Layers, GitBranch, Palette, Eye, EyeOff, Lock, Unlock, 
  Trash2, Copy, Plus, ChevronDown, ChevronRight, GripVertical, 
  Boxes, LayoutTemplate, Box, Sparkles, CreditCard, ArrowDown, 
  CheckCircle2, RotateCcw, Clock, ShieldAlert, FileCode2,
  Type, Link, MousePointerClick
} from 'lucide-react';
import { CanvasBlock, GitCommit, LeftSidebarTab, BlockType, SelectedElementInfo, ElementCategory } from '@/types/builder';

interface LeftSidebarProps {
  blocks: CanvasBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  selectedElement?: SelectedElementInfo | null;
  onSelectElement?: (element: SelectedElementInfo | null) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onDuplicateBlock: (id: string) => void;
  onDeleteBlock: (id: string) => void;
  onMoveBlock: (id: string, direction: 'up' | 'down') => void;
  onAddBlock: (type: BlockType) => void;
  commits: GitCommit[];
  activeBranch: string;
  onCheckoutCommit: (commit: GitCommit) => void;
  onNewCommit: (message: string) => void;
  themeAccent: string;
  onUpdateThemeAccent: (color: string) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  selectedElement,
  onSelectElement,
  onToggleVisibility,
  onToggleLock,
  onDuplicateBlock,
  onDeleteBlock,
  onMoveBlock,
  onAddBlock,
  commits,
  activeBranch,
  onCheckoutCommit,
  onNewCommit,
  themeAccent,
  onUpdateThemeAccent,
}) => {
  const [activeTab, setActiveTab] = useState<LeftSidebarTab>('tree');
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [newCommitMsg, setNewCommitMsg] = useState('');
  const [isCreatingCommit, setIsCreatingCommit] = useState(false);

  const getBlockIcon = (type: BlockType) => {
    switch (type) {
      case 'header':
        return <LayoutTemplate className="w-3.5 h-3.5 text-blue-400" />;
      case 'hero':
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      case 'canvas3d':
        return <Box className="w-3.5 h-3.5 text-cyan-400" />;
      case 'canvas2d':
        return <Layers className="w-3.5 h-3.5 text-pink-400" />;
      case 'featureGrid':
        return <Boxes className="w-3.5 h-3.5 text-emerald-400" />;
      case 'pricing':
        return <CreditCard className="w-3.5 h-3.5 text-amber-400" />;
      case 'ctaBanner':
        return <Sparkles className="w-3.5 h-3.5 text-pink-400" />;
      case 'footer':
        return <LayoutTemplate className="w-3.5 h-3.5 text-slate-400" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const handleCreateCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommitMsg.trim()) return;
    onNewCommit(newCommitMsg.trim());
    setNewCommitMsg('');
    setIsCreatingCommit(false);
  };

  const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>({});

  const toggleBlockExpanded = (blockId: string) => {
    setExpandedBlocks(prev => ({
      ...prev,
      [blockId]: prev[blockId] === false ? true : false // default to true
    }));
  };

  const isBlockExpanded = (blockId: string) => {
    return expandedBlocks[blockId] !== false; // default to expanded (true)
  };

  const getBlockSubElements = (block: CanvasBlock) => {
    switch (block.type) {
      case 'header':
        return [
          { key: 'logo', label: 'Logo / En-tête', category: 'text' as const },
          { key: 'navLinks', label: 'Liens de navigation', category: 'link' as const },
          { key: 'ctaButton', label: 'Bouton d\'Action', category: 'button' as const },
        ];
      case 'hero':
        return [
          { key: 'badge', label: 'Badge d\'accroche', category: 'badge' as const },
          { key: 'title', label: 'Titre Principal', category: 'heading' as const },
          { key: 'subtitle', label: 'Sous-titre descriptif', category: 'text' as const },
          { key: 'primaryCta', label: 'Bouton Principal', category: 'button' as const },
          { key: 'secondaryCta', label: 'Bouton Secondaire', category: 'button' as const },
        ];
      case 'canvas3d':
        return [
          { key: 'title', label: 'Titre de Section', category: 'heading' as const },
          { key: 'subtitle', label: 'Sous-titre / Légende', category: 'text' as const },
          { key: 'canvas', label: 'Zone 3D WebGL Canvas', category: 'canvas3d' as const },
        ];
      case 'canvas2d':
        return [
          { key: 'title', label: 'Titre de Section', category: 'heading' as const },
          { key: 'subtitle', label: 'Sous-titre / Légende', category: 'text' as const },
          { key: 'canvas', label: 'Zone Studio 2D Canvas', category: 'canvas2d' as const },
        ];
      case 'featureGrid':
        return [
          { key: 'badge', label: 'Badge Bento', category: 'badge' as const },
          { key: 'title', label: 'Titre de Grille', category: 'heading' as const },
          { key: 'subtitle', label: 'Sous-titre Bento', category: 'text' as const },
          { key: 'card-0', label: 'Carte Bento 1', category: 'card' as const },
          { key: 'card-1', label: 'Carte Bento 2', category: 'card' as const },
          { key: 'card-2', label: 'Carte Bento 3', category: 'card' as const },
          { key: 'card-3', label: 'Carte Bento 4', category: 'card' as const },
        ];
      case 'pricing':
        return [
          { key: 'badge', label: 'Badge Tarifs', category: 'badge' as const },
          { key: 'title', label: 'Titre de Section', category: 'heading' as const },
          { key: 'subtitle', label: 'Sous-titre Tarifs', category: 'text' as const },
          { key: 'card-0', label: 'Forfait Standard', category: 'pricing-card' as const },
          { key: 'card-1', label: 'Forfait Premium', category: 'pricing-card' as const },
          { key: 'card-2', label: 'Forfait Entreprise', category: 'pricing-card' as const },
        ];
      case 'ctaBanner':
        return [
          { key: 'title', label: 'Titre d\'Appel', category: 'heading' as const },
          { key: 'subtitle', label: 'Message d\'Appel', category: 'text' as const },
          { key: 'primaryCta', label: 'Bouton d\'Action', category: 'button' as const },
        ];
      case 'footer':
        return [
          { key: 'logo', label: 'Logo / Signature', category: 'text' as const },
          { key: 'links', label: 'Liens de pied de page', category: 'link' as const },
          { key: 'copyright', label: 'Copyright & Mentions', category: 'text' as const },
        ];
      default:
        return [];
    }
  };

  const getElementIcon = (category: string) => {
    switch (category) {
      case 'heading':
        return <Type className="w-3 h-3 text-purple-400" />;
      case 'text':
        return <Type className="w-3 h-3 text-slate-400" />;
      case 'button':
        return <MousePointerClick className="w-3 h-3 text-indigo-400" />;
      case 'badge':
        return <Sparkles className="w-3 h-3 text-emerald-400" />;
      case 'link':
        return <Link className="w-3 h-3 text-cyan-400" />;
      case 'card':
      case 'pricing-card':
        return <Boxes className="w-3 h-3 text-amber-400" />;
      case 'canvas3d':
        return <Box className="w-3 h-3 text-pink-400" />;
      case 'canvas2d':
        return <Layers className="w-3 h-3 text-pink-400" />;
      default:
        return <Layers className="w-3 h-3 text-slate-400" />;
    }
  };

  return (
    <aside className="w-72 h-[calc(100vh-3.5rem)] bg-[#0a0d16] border-r border-white/[0.08] flex flex-col shrink-0 select-none z-20">
      {/* Sidebar Header Tabs */}
      <div className="flex items-center border-b border-white/[0.08] px-2 pt-2 gap-1 bg-[#090c14]">
        <button
          onClick={() => setActiveTab('tree')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-xl transition-all border-b-2 ${
            activeTab === 'tree'
              ? 'text-indigo-300 border-indigo-500 bg-white/[0.04]'
              : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/[0.02]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Arborescence</span>
        </button>

        <button
          onClick={() => setActiveTab('git')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-xl transition-all border-b-2 ${
            activeTab === 'git'
              ? 'text-purple-300 border-purple-500 bg-white/[0.04]'
              : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/[0.02]'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>Git History</span>
          <span className="text-[10px] px-1 rounded-full bg-purple-500/20 text-purple-300 font-mono">
            {commits.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('tokens')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-xl transition-all border-b-2 ${
            activeTab === 'tokens'
              ? 'text-cyan-300 border-cyan-500 bg-white/[0.04]'
              : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/[0.02]'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Tokens</span>
        </button>
      </div>

      {/* TAB 1: COMPONENT TREE */}
      {activeTab === 'tree' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header Action: Add Component */}
          <div className="p-3 border-b border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              DOM Elements ({blocks.length})
            </span>

            <div className="relative">
              <button
                onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>

              {/* Add Block Dropdown */}
              {isAddMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-[#0f1422] border border-white/10 rounded-xl p-1.5 shadow-2xl z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-[10px] font-mono uppercase text-slate-400 px-2 py-1">Widgets & Blocs</div>
                  {[
                    { type: 'canvas3d', label: '3D WebGL Canvas', icon: Box },
                    { type: 'canvas2d', label: 'Studio 2D Vectoriel', icon: Layers },
                    { type: 'hero', label: 'Hero Section', icon: Sparkles },
                    { type: 'featureGrid', label: 'Bento Grid Features', icon: Boxes },
                    { type: 'pricing', label: 'Pricing Table', icon: CreditCard },
                    { type: 'header', label: 'Header Navigation', icon: LayoutTemplate },
                    { type: 'footer', label: 'Footer Section', icon: LayoutTemplate },
                  ].map((item) => (
                    <button
                      key={item.type}
                      onClick={() => {
                        onAddBlock(item.type as BlockType);
                        setIsAddMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left"
                    >
                      <item.icon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Component List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {blocks.map((block, index) => {
              const isSelected = selectedBlockId === block.id;
              const expanded = isBlockExpanded(block.id);
              const subElements = getBlockSubElements(block);

              return (
                <div key={block.id} className="flex flex-col gap-1 bg-[#101422]/30 border border-white/[0.03] rounded-xl p-1">
                  {/* Block Main Row */}
                  <div
                    onClick={() => onSelectBlock(block.id)}
                    className={`group relative flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500/40 text-white shadow-sm'
                        : 'bg-transparent hover:bg-white/[0.04] border-transparent text-slate-300'
                    } ${block.layout.isHidden ? 'opacity-40' : ''}`}
                  >
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      {/* Chevron to fold/unfold */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBlockExpanded(block.id);
                        }}
                        className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title={expanded ? 'Replier les éléments' : 'Déplier les éléments'}
                      >
                        {expanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <span className="text-slate-600 group-hover:text-slate-400 cursor-grab">
                        <GripVertical className="w-3 h-3" />
                      </span>
                      <div className="p-1 rounded-md bg-white/5">{getBlockIcon(block.type)}</div>
                      <span className="truncate font-semibold">{block.name}</span>
                    </div>

                    {/* Actions: Move, Visibility, Lock, Duplicate */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      {/* Move up / down */}
                      <div className="hidden group-hover:flex items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveBlock(block.id, 'up');
                          }}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                          title="Move Up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveBlock(block.id, 'down');
                          }}
                          disabled={index === blocks.length - 1}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                          title="Move Down"
                        >
                          ↓
                        </button>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleVisibility(block.id);
                        }}
                        className="p-1 text-slate-400 hover:text-white"
                        title={block.layout.isHidden ? 'Afficher' : 'Masquer'}
                      >
                        {block.layout.isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLock(block.id);
                        }}
                        className="p-1 text-slate-400 hover:text-white"
                        title={block.layout.isLocked ? 'Déverrouiller' : 'Verrouiller'}
                      >
                        {block.layout.isLocked ? (
                          <Lock className="w-3 h-3 text-amber-400" />
                        ) : (
                          <Unlock className="w-3 h-3 opacity-40 hover:opacity-100" />
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateBlock(block.id);
                        }}
                        className="p-1 text-slate-400 hover:text-white hidden group-hover:inline-block"
                        title="Dupliquer"
                      >
                        <Copy className="w-3 h-3" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteBlock(block.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-400 hidden group-hover:inline-block"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Sub-elements list if expanded */}
                  {expanded && subElements.length > 0 && (
                    <div className="pl-5 pr-1 py-1 border-l border-white/5 ml-4.5 space-y-1 flex flex-col">
                      {subElements.map((sub) => {
                        const isSubSelected = selectedElement?.blockId === block.id && selectedElement?.elementKey === sub.key;

                        return (
                          <div
                            key={sub.key}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onSelectElement) {
                                onSelectBlock(block.id);
                                onSelectElement({
                                  blockId: block.id,
                                  elementKey: sub.key,
                                  category: sub.category,
                                  label: sub.label,
                                });
                              }
                            }}
                            className={`group flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer border ${
                              isSubSelected
                                ? 'bg-indigo-600/15 border-indigo-500/40 text-indigo-300 shadow-sm shadow-indigo-500/5'
                                : 'hover:bg-white/[0.04] border-transparent text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 overflow-hidden">
                              {getElementIcon(sub.category)}
                              <span className="truncate font-mono">{sub.label}</span>
                            </div>
                            <span className="text-[9px] font-mono text-slate-600 group-hover:text-slate-400">
                              {sub.key}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: GIT & HISTORY */}
      {activeTab === 'git' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block">
                Git Branch: {activeBranch}
              </span>
              <span className="text-[10px] text-slate-500">Visual commit timeline</span>
            </div>

            <button
              onClick={() => setIsCreatingCommit(!isCreatingCommit)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-lg transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Commit</span>
            </button>
          </div>

          {/* New Commit Input Form */}
          {isCreatingCommit && (
            <form onSubmit={handleCreateCommit} className="p-3 bg-[#0d111d] border-b border-white/10 space-y-2">
              <input
                type="text"
                value={newCommitMsg}
                onChange={(e) => setNewCommitMsg(e.target.value)}
                placeholder="Commit message (e.g. style: update 3D mesh)..."
                className="w-full bg-black/40 border border-purple-500/40 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none font-mono"
                autoFocus
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingCommit(false)}
                  className="px-2 py-1 text-[11px] text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-[11px] font-semibold"
                >
                  Commit changes
                </button>
              </div>
            </form>
          )}

          {/* Visual Branching Git Graph */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            <div className="relative pl-6 border-l-2 border-purple-500/30 space-y-4">
              {commits.map((commit, idx) => (
                <div key={commit.id} className="relative group">
                  {/* Branch node dot */}
                  <span
                    className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#0a0d16] transition-transform group-hover:scale-125 ${
                      idx === 0
                        ? 'bg-purple-400 ring-2 ring-purple-500/40 animate-pulse'
                        : 'bg-slate-600'
                    }`}
                  />

                  <div className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] transition-all">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-[10px] text-purple-400 font-bold">
                        {commit.hash}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {commit.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 font-medium line-clamp-2 mb-2">
                      {commit.message}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-[8px] font-bold text-purple-300">
                          {commit.author.charAt(0)}
                        </div>
                        <span className="truncate max-w-[100px]">{commit.author}</span>
                      </div>

                      <button
                        onClick={() => onCheckoutCommit(commit)}
                        className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 font-medium px-2 py-0.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
                        title="Checkout this commit snapshot"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>Revert to</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DESIGN TOKENS */}
      {activeTab === 'tokens' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-2">
              Primary Accent
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: 'Indigo Core', color: '#6366f1' },
                { name: 'Cyber Violet', color: '#a855f7' },
                { name: 'Emerald Edge', color: '#10b981' },
                { name: 'Electric Cyan', color: '#06b6d4' },
                { name: 'Neon Pink', color: '#ec4899' },
                { name: 'Amber Sunset', color: '#f59e0b' },
                { name: 'Crimson Matrix', color: '#ef4444' },
                { name: 'Pure White', color: '#f8fafc' },
              ].map((token) => (
                <button
                  key={token.color}
                  onClick={() => onUpdateThemeAccent(token.color)}
                  className={`h-10 rounded-xl flex items-center justify-center border transition-all ${
                    themeAccent === token.color
                      ? 'border-white ring-2 ring-white/20 scale-105'
                      : 'border-white/10 hover:scale-105'
                  }`}
                  style={{ backgroundColor: token.color }}
                  title={token.name}
                >
                  {themeAccent === token.color && <CheckCircle2 className="w-4 h-4 text-black" />}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-white/[0.08] pt-3">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Surface Depth
            </span>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-2.5 rounded-xl bg-[#0e1320] border border-white/5 flex items-center justify-between">
                <span>Background Canvas</span>
                <span className="font-mono text-slate-500">#07090e</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#121828] border border-white/10 flex items-center justify-between">
                <span>Elevated Glass Card</span>
                <span className="font-mono text-slate-500">rgba(18,24,40,0.8)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#1a233a] border border-indigo-500/30 flex items-center justify-between">
                <span>Active Bounding Box</span>
                <span className="font-mono text-indigo-400">#6366f1</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
