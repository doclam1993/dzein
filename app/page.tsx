'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  CanvasBlock, ViewportMode, BlockType, AIDiffProposal, SelectedElementInfo, GitCommit 
} from '@/types/builder';
import { INITIAL_BLOCKS } from '@/lib/initialData';
import { generateReactCode } from '@/lib/codeGenerator';
import { TopBar } from '@/components/topbar/TopBar';
import { BuilderCanvas } from '@/components/canvas/BuilderCanvas';
import { LeftPromptPanel } from '@/components/ai/LeftPromptPanel';
import { LeftSidebar } from '@/components/sidebar/LeftSidebar';
import { RightSidebar } from '@/components/sidebar/RightSidebar';
import { ExportModal } from '@/components/export/ExportModal';
import { AIProvidersModal } from '@/components/ai/AIProvidersModal';
import { AIProvider, AIAgentSettings, AgentErrorRecord, AgentExecutionLog } from '@/types/ai';
import { 
  loadStoredProviders, saveStoredProviders, 
  loadStoredSettings, saveStoredSettings,
  DEFAULT_AI_PROVIDERS, DEFAULT_AGENT_SETTINGS
} from '@/lib/defaultAIProviders';
import { 
  X, Copy, Check, Code2, GripVertical, 
  Bot, Sliders, Layout, Sparkles, Download, 
  Eye, Edit3, Smartphone, Tablet, Monitor, Layers
} from 'lucide-react';

export default function OpenDesignStudio() {
  // State: Project
  const [projectName, setProjectName] = useState('mon-site-saas.tsx');

  // State: Canvas Blocks & Undo/Redo History
  const [blocks, setBlocks] = useState<CanvasBlock[]>([]);
  const [history, setHistory] = useState<CanvasBlock[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<SelectedElementInfo | null>(null);
  const [showSetupModal, setShowSetupModal] = useState<boolean>(true);

  const commitBlocksChange = (newBlocksOrFn: CanvasBlock[] | ((prev: CanvasBlock[]) => CanvasBlock[])) => {
    setBlocks((prev) => {
      const nextBlocks = typeof newBlocksOrFn === 'function' ? newBlocksOrFn(prev) : newBlocksOrFn;
      if (JSON.stringify(prev) === JSON.stringify(nextBlocks)) return prev;
      const updatedHistory = history.slice(0, historyIndex + 1);
      updatedHistory.push(nextBlocks);
      if (updatedHistory.length > 35) updatedHistory.shift();
      setHistory(updatedHistory);
      setHistoryIndex(updatedHistory.length - 1);
      return nextBlocks;
    });
  };

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setBlocks(history[prevIdx]);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setBlocks(history[nextIdx]);
    }
  }, [historyIndex, history]);

  // Keyboard shortcut listener for Ctrl+Z and Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger undo/redo if typing inside an input/textarea/contenteditable
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // State: Viewport & Mode
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [zoomLevel] = useState<number>(100);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isFreeformMode, setIsFreeformMode] = useState<boolean>(true);
  const [themeAccent, setThemeAccent] = useState<string>('#6366f1');

  // State: Resizable Side Panels Widths
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(390);
  const [rightSidebarWidth, setRightSidebarWidth] = useState<number>(380);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);
  const [isResizingLeft, setIsResizingLeft] = useState<boolean>(false);
  const [isResizingRight, setIsResizingRight] = useState<boolean>(false);

  // State: Optional Code Drawer (Slide-over)
  const [isCodeDrawerOpen, setIsCodeDrawerOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // State: AI Prompt Loading & AI Providers/Models Configuration
  const [isAgentLoading, setIsAgentLoading] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState<boolean>(true);
  const [latestProposal, setLatestProposal] = useState<AIDiffProposal | null>(null);
  const [latestError, setLatestError] = useState<AgentErrorRecord | null>(null);
  const [executionLogs, setExecutionLogs] = useState<AgentExecutionLog[]>([]);
  const [providers, setProviders] = useState<AIProvider[]>(DEFAULT_AI_PROVIDERS);
  const [aiSettings, setAiSettings] = useState<AIAgentSettings>(DEFAULT_AGENT_SETTINGS);

  // State: Left Panel Mode (Tree vs AI Assistant) & Git Commits
  const [leftPanelTab, setLeftPanelTab] = useState<'ai' | 'tree'>('tree');
  const [commits, setCommits] = useState<GitCommit[]>([
    {
      id: 'commit-init',
      hash: 'a1b2c3d',
      message: 'Configuration initiale et arborescence pro',
      branch: 'main',
      author: 'AI Studio',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      timestamp: 'Il y a 2h',
      diffCount: 12,
      snapshot: INITIAL_BLOCKS,
    }
  ]);
  const [activeBranch, setActiveBranch] = useState('main');

  const handleToggleVisibility = (id: string) => {
    const updated = blocks.map((b) => b.id === id ? { ...b, layout: { ...b.layout, isHidden: !b.layout.isHidden } } : b);
    commitBlocksChange(updated);
  };

  const handleToggleLock = (id: string) => {
    const updated = blocks.map((b) => b.id === id ? { ...b, layout: { ...b.layout, isLocked: !b.layout.isLocked } } : b);
    commitBlocksChange(updated);
  };

  const handleNewCommit = (message: string) => {
    const newCommit: GitCommit = {
      id: `commit-${Date.now()}`,
      hash: Math.random().toString(16).substring(2, 9),
      message,
      branch: activeBranch,
      author: 'Utilisateur',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      timestamp: "À l'instant",
      diffCount: blocks.length,
      snapshot: JSON.parse(JSON.stringify(blocks)),
    };
    setCommits([newCommit, ...commits]);
  };

  const handleCheckoutCommit = (commit: GitCommit) => {
    if (commit.snapshot) {
      commitBlocksChange(commit.snapshot);
    }
  };

  // Sync client-side stored providers and settings after initial mount (hydration safe)
  useEffect(() => {
    const timer = setTimeout(() => {
      const storedProviders = loadStoredProviders();
      const storedSettings = loadStoredSettings();
      if (storedProviders && storedProviders.length > 0) {
        setProviders(storedProviders);
      }
      if (storedSettings && storedSettings.activeProviderId) {
        setAiSettings(storedSettings);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateProviders = (newProviders: AIProvider[]) => {
    setProviders(newProviders);
    saveStoredProviders(newProviders);
  };

  const handleUpdateSettings = (newSettings: AIAgentSettings) => {
    setAiSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  const handleSelectModel = (providerId: string, modelId: string) => {
    const updated = {
      ...aiSettings,
      activeProviderId: providerId,
      activeModelId: modelId,
    };
    setAiSettings(updated);
    saveStoredSettings(updated);
  };

  // State: Export Modal
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Real-time generated React + Tailwind code
  const generatedCode = useMemo(() => {
    return generateReactCode(blocks);
  }, [blocks]);

  // Find currently selected block
  const selectedBlock = useMemo(() => {
    return blocks.find((b) => b.id === selectedBlockId) || null;
  }, [blocks, selectedBlockId]);

  // Handle panel resizing with pointer move and up listeners
  const handleStartLeftResize = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsResizingLeft(true);
  };

  const handleStartRightResize = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsResizingRight(true);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isResizingLeft) {
        const newWidth = Math.min(Math.max(260, e.clientX), 680);
        setLeftPanelWidth(newWidth);
      }
      if (isResizingRight) {
        const newWidth = Math.min(Math.max(280, window.innerWidth - e.clientX), 680);
        setRightSidebarWidth(newWidth);
      }
    };

    const handlePointerUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
    };

    if (isResizingLeft || isResizingRight) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizingLeft, isResizingRight]);

  // Update a specific block directly
  const handleUpdateBlock = (updated: CanvasBlock) => {
    commitBlocksChange((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  // Reorder Blocks via step
  const handleMoveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex((b) => b.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, moved);
    commitBlocksChange(newBlocks);
  };

  // Reorder Blocks via mouse drag-and-drop
  const handleReorderBlocks = (sourceIndex: number, targetIndex: number) => {
    if (sourceIndex === targetIndex) return;
    commitBlocksChange((prev) => {
      const newBlocks = [...prev];
      const [moved] = newBlocks.splice(sourceIndex, 1);
      newBlocks.splice(targetIndex, 0, moved);
      return newBlocks;
    });
  };

  // Duplicate Block
  const handleDuplicateBlock = (id: string) => {
    const target = blocks.find((b) => b.id === id);
    if (!target) return;
    const newBlock: CanvasBlock = {
      ...JSON.parse(JSON.stringify(target)),
      id: `block-${Date.now()}`,
      name: `${target.name} (Copie)`,
    };
    const index = blocks.findIndex((b) => b.id === id);
    const updated = [...blocks];
    updated.splice(index + 1, 0, newBlock);
    commitBlocksChange(updated);
    setSelectedBlockId(newBlock.id);
  };

  // Delete Block
  const handleDeleteBlock = (id: string) => {
    commitBlocksChange((prev) => prev.filter((b) => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  // Add New Block (with optional insertion index)
  const handleAddBlock = (type: BlockType, afterIndex?: number) => {
    const newId = `block-${Date.now()}`;
    let newBlock: CanvasBlock;

    switch (type) {
      case 'hero':
        newBlock = {
          id: newId,
          name: 'Section Héros',
          type: 'hero',
          layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
          style: {
            paddingTop: 48,
            paddingBottom: 48,
            paddingLeft: 24,
            paddingRight: 24,
            marginTop: 8,
            marginBottom: 8,
            backgroundColor: 'rgba(10, 13, 22, 0.75)',
            borderRadius: 24,
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            opacity: 1,
            backdropBlur: 16,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            maxWidth: '1200px',
          },
          content: {
            badgeText: '✨ Nouvelle Section IA',
            title: 'Accélérez votre projet avec',
            titleHighlight: 'notre moteur haute performance',
            subtitle: 'Cliquez directement sur ce texte pour rédiger votre proposition de valeur.',
            primaryCtaText: 'Démarrer gratuitement',
            secondaryCtaText: 'Documentation',
          },
        };
        break;

      case 'canvas3d':
        newBlock = {
          id: newId,
          name: 'Élément 3D Spatial',
          type: 'canvas3d',
          layout: { x: 0, y: 0, width: '100%', height: 420, isLocked: false, isHidden: false },
          style: {
            paddingTop: 16,
            paddingBottom: 16,
            paddingLeft: 16,
            paddingRight: 16,
            marginTop: 8,
            marginBottom: 8,
            backgroundColor: 'rgba(10, 13, 22, 0.75)',
            borderRadius: 24,
            borderColor: 'rgba(99, 102, 241, 0.25)',
            borderWidth: 1,
            opacity: 1,
            backdropBlur: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
            maxWidth: '1200px',
          },
          content: {
            badgeText: 'Shader WebGL Actif',
            title: 'Géométrie 3D Réactive',
            subtitle: 'Manipulez la 3D directement depuis les gizmos de l&apos;aperçu',
          },
          threeConfig: {
            meshType: 'torusKnot',
            wireframe: false,
            glassFactor: 0.8,
            rotationSpeed: 1.2,
            floatSpeed: 1.4,
            lightIntensity: 1.5,
            color: '#a855f7',
            glowColor: '#ec4899',
            rx: 25,
            ry: 35,
            rz: 15,
            scale: 1,
            particleCount: 90,
            showGizmo: true,
          },
        };
        break;

      case 'canvas2d':
        newBlock = {
          id: newId,
          name: 'Studio Graphique 2D',
          type: 'canvas2d',
          layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
          style: {
            paddingTop: 16,
            paddingBottom: 16,
            paddingLeft: 16,
            paddingRight: 16,
            marginTop: 8,
            marginBottom: 8,
            backgroundColor: 'rgba(10, 13, 22, 0.75)',
            borderRadius: 24,
            borderColor: 'rgba(99, 102, 241, 0.25)',
            borderWidth: 1,
            opacity: 1,
            backdropBlur: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
            maxWidth: '1200px',
          },
          content: {
            title: 'Studio Vectoriel 2D',
            subtitle: 'Concevez, animez & exportez vos tracés géométriques',
          },
          twoConfig: {
            shapes: [
              { id: 'start-rect', type: 'rect', x: 50, y: 50, size: 30, width: 30, height: 30, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 2, rotation: 45, opacity: 0.95, glow: true, glowColor: '#6366f1', animType: 'spin', animSpeed: 1 },
              { id: 'start-circle', type: 'circle', x: 30, y: 35, size: 20, fill: '#ec4899', stroke: '#ffffff', strokeWidth: 2, rotation: 0, opacity: 0.9, glow: true, glowColor: '#ec4899', animType: 'float', animSpeed: 1.2 },
              { id: 'start-star', type: 'star', x: 70, y: 35, size: 22, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 1.5, rotation: 15, opacity: 0.95, glow: true, glowColor: '#f59e0b', animType: 'bounce', animSpeed: 1 }
            ],
            backgroundColor: '#0d111b',
            showGrid: true,
            themePreset: 'custom'
          },
        };
        break;

      case 'featureGrid':
        newBlock = {
          id: newId,
          name: 'Grille Bento',
          type: 'featureGrid',
          layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
          style: {
            paddingTop: 40,
            paddingBottom: 40,
            paddingLeft: 24,
            paddingRight: 24,
            marginTop: 8,
            marginBottom: 8,
            backgroundColor: 'rgba(10, 13, 22, 0.75)',
            borderRadius: 24,
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            opacity: 1,
            backdropBlur: 16,
            display: 'grid',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            maxWidth: '1200px',
          },
          content: {
            badgeText: 'CAPACITÉS',
            title: 'Tout ce dont vous avez besoin',
            subtitle: 'Fonctionnalités modifiables directement sur chaque carte.',
            gridColumns: 3,
            features: [
              {
                id: `f-${Date.now()}-1`,
                icon: 'Zap',
                title: 'Temps réel ultra-rapide',
                description: 'Latence sous les 12ms avec synchronisation instantanée.',
                tag: 'Noyau',
              },
              {
                id: `f-${Date.now()}-2`,
                icon: 'Bot',
                title: 'Agent Génératif Intégré',
                description: 'Automatisez vos flux sans effort de maintenance.',
                tag: 'IA',
              },
              {
                id: `f-${Date.now()}-3`,
                icon: 'ShieldCheck',
                title: 'Sécurité Dédiée',
                description: 'Chiffrement de bout en bout et conformité certifiée.',
                tag: 'Sécurité',
              },
            ],
          },
        };
        break;

      case 'pricing':
        newBlock = {
          id: newId,
          name: 'Tarifs',
          type: 'pricing',
          layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
          style: {
            paddingTop: 48,
            paddingBottom: 48,
            paddingLeft: 24,
            paddingRight: 24,
            marginTop: 8,
            marginBottom: 8,
            backgroundColor: 'rgba(10, 13, 22, 0.75)',
            borderRadius: 24,
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            opacity: 1,
            backdropBlur: 16,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 20,
            maxWidth: '1200px',
          },
          content: {
            badgeText: 'INVESTISSEMENT',
            title: 'Des forfaits clairs et transparents',
            subtitle: 'Modifiez directement les montants et avantages en un clic.',
            pricingPlans: [
              {
                id: `p-${Date.now()}-1`,
                name: 'Starter',
                priceMonthly: 0,
                priceAnnual: 0,
                description: 'Pour découvrir la plateforme et tester vos idées.',
                features: ['Jusqu&apos;à 3 projets', 'Export React & HTML', 'Support communautaire'],
                ctaText: 'Commencer gratuitement',
                isPopular: false,
              },
              {
                id: `p-${Date.now()}-2`,
                name: 'Pro Studio',
                priceMonthly: 39,
                priceAnnual: 29,
                description: 'Pour les créateurs exigeants et applications en production.',
                features: ['Projets illimités', 'Moteur 3D WebGL complet', 'Agent IA autonome', 'Support prioritaire 24/7'],
                ctaText: 'Débloquer Pro',
                isPopular: true,
              },
            ],
          },
        };
        break;

      default:
        newBlock = {
          id: newId,
          name: 'Pied de page',
          type: 'footer',
          layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
          style: {
            paddingTop: 24,
            paddingBottom: 24,
            paddingLeft: 24,
            paddingRight: 24,
            marginTop: 8,
            marginBottom: 8,
            backgroundColor: 'transparent',
            borderRadius: 0,
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            opacity: 1,
            backdropBlur: 0,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            maxWidth: '1200px',
          },
          content: {
            title: 'opendesign',
            subtitle: 'Conçu avec passion.',
            copyrightText: '© 2026 opendesign. Tous droits réservés.',
          },
        };
    }

    if (afterIndex !== undefined && afterIndex >= 0) {
      const updated = [...blocks];
      updated.splice(afterIndex + 1, 0, newBlock);
      commitBlocksChange(updated);
    } else {
      commitBlocksChange((prev) => [...prev, newBlock]);
    }
    setSelectedBlockId(newBlock.id);
  };

  // Reset to default template
  const handleResetToDefault = () => {
    setShowSetupModal(true);
    setSelectedBlockId(null);
  };

  // Find active provider and model
  const activeProvider = providers.find((p) => p.id === aiSettings.activeProviderId) || providers[0];
  const activeModel = activeProvider?.models.find((m) => m.id === aiSettings.activeModelId) || activeProvider?.models[0];

  // Agent Code Prompt Handling with Full Telemetry & Diagnostics
  const handleAgentPrompt = async (promptText: string) => {
    setIsAgentLoading(true);
    setLatestError(null);
    const startTime = Date.now();
    const curProvider = providers.find((p) => p.id === aiSettings.activeProviderId) || providers[0];
    const curModel = curProvider?.models.find((m) => m.id === aiSettings.activeModelId) || curProvider?.models[0];

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          currentBlocks: blocks,
          provider: {
            id: curProvider?.id,
            type: curProvider?.type,
            baseUrl: curProvider?.baseUrl,
            apiKey: curProvider?.apiKey,
          },
          model: aiSettings.activeModelId,
        }),
      });

      const data = await res.json();

      if (!res.ok && !data.proposal) {
        throw new Error(data.error || 'Erreur lors de l\'appel à l\'agent');
      }

      // Check if provider returned an error or triggered a fallback
      if (data.providerError) {
        const errorRecord: AgentErrorRecord = {
          id: `err-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          provider: curProvider?.name || 'Fournisseur',
          model: curModel?.name || aiSettings.activeModelId,
          message: data.providerError.message || 'Erreur d\'inférence',
          code: data.providerError.code,
          details: data.providerError.details,
          suggestedAction: data.providerError.code === 'MISSING_API_KEY' ? 'check_api_key' : 'switch_model',
        };
        setLatestError(errorRecord);
      }

      if (data.proposal) {
        setLatestProposal(data.proposal);
        if (data.proposal.proposedBlocks) {
          setBlocks(data.proposal.proposedBlocks);
        }
      }

      // Append to execution logs
      const duration = data.durationMs || (Date.now() - startTime);
      const newLog: AgentExecutionLog = {
        id: `log-${Date.now()}`,
        prompt: promptText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        providerId: curProvider?.id || 'gemini',
        providerName: curProvider?.name || 'Google Gemini',
        modelId: aiSettings.activeModelId,
        modelName: curModel?.name || aiSettings.activeModelId,
        durationMs: duration,
        status: data.providerError ? 'error' : (data.fallbackUsed ? 'fallback' : 'success'),
        summary: data.proposal?.summary || 'Requête traitée.',
        changesCount: data.proposal?.changes?.length || 0,
        steps: [],
        error: data.providerError ? {
          id: `err-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          provider: curProvider?.name || '',
          model: curModel?.name || '',
          message: data.providerError.message,
          code: data.providerError.code,
        } : undefined,
      };
      setExecutionLogs((prev) => [newLog, ...prev]);

    } catch (err: any) {
      console.error('Error invoking agent:', err);
      const errorRecord: AgentErrorRecord = {
        id: `err-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        provider: curProvider?.name || 'Fournisseur',
        model: curModel?.name || aiSettings.activeModelId,
        message: err.message || 'Erreur de connexion lors de l\'exécution du prompt',
        code: 'NETWORK_OR_SERVER_ERROR',
        details: 'Vérifiez la connexion réseau ou le statut du serveur.',
      };
      setLatestError(errorRecord);

      const newLog: AgentExecutionLog = {
        id: `log-${Date.now()}`,
        prompt: promptText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        providerId: curProvider?.id || 'unknown',
        providerName: curProvider?.name || 'Inconnu',
        modelId: aiSettings.activeModelId,
        modelName: curModel?.name || aiSettings.activeModelId,
        durationMs: Date.now() - startTime,
        status: 'error',
        summary: 'Échec de la requête.',
        changesCount: 0,
        steps: [],
        error: errorRecord,
      };
      setExecutionLogs((prev) => [newLog, ...prev]);
    } finally {
      setIsAgentLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07090e] text-slate-100 selection:bg-indigo-500 selection:text-white font-sans antialiased relative">
      {/* 🏁 START POINT CHOOSER MODAL (Scratch vs Template) */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#090c15] border border-indigo-500/30 rounded-2xl p-6 md:p-8 shadow-2xl shadow-indigo-500/10 max-h-[90vh] overflow-y-auto">
            {/* Background design accents */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

            <div className="relative space-y-6 text-center">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                  ⚡ OpenDesign Studio
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-3">
                  Comment souhaitez-vous démarrer ?
                </h2>
                <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
                  Choisissez entre une feuille blanche prête à être modélisée par l&apos;IA, ou un modèle de démonstration complet pour explorer nos capacités 3D et 2D.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {/* CHOICE 1: FROM SCRATCH */}
                <button
                  onClick={() => {
                    setBlocks([]);
                    setHistory([[]]);
                    setHistoryIndex(0);
                    setShowSetupModal(false);
                    setSelectedBlockId(null);
                  }}
                  className="group relative p-6 bg-[#0d111e]/80 border border-white/5 hover:border-indigo-500/40 rounded-xl text-left transition-all hover:bg-slate-900/60 duration-200 shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-950 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/30 transition-all">
                      <Layers className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-100 group-hover:text-white transition-colors">
                        🚀 Partir de Zéro (Scratch)
                      </h3>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                        Commencez sur un canevas 100% vide. Idéal pour construire pas à pas à l&apos;aide de l&apos;Assistant IA ou en ajoutant vos propres blocs sur-mesure.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-[10px] font-mono font-bold text-indigo-400 group-hover:text-indigo-300">
                    <span>Créer un projet vide</span>
                    <span>→</span>
                  </div>
                </button>

                {/* CHOICE 2: TEMPLATE PRESETS */}
                <button
                  onClick={() => {
                    setBlocks(INITIAL_BLOCKS);
                    setHistory([INITIAL_BLOCKS]);
                    setHistoryIndex(0);
                    setShowSetupModal(false);
                    setSelectedBlockId(null);
                  }}
                  className="group relative p-6 bg-[#0d111e]/80 border border-white/5 hover:border-pink-500/40 rounded-xl text-left transition-all hover:bg-slate-900/60 duration-200 shadow-lg flex flex-col justify-between"
                >
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-[8px] font-bold text-pink-300">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Recommandé</span>
                  </div>
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-950 flex items-center justify-center border border-white/10 group-hover:border-pink-500/30 transition-all">
                      <Sparkles className="w-6 h-6 text-pink-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-100 group-hover:text-white transition-colors">
                        ✨ Modèle Prédéfini (Template)
                      </h3>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                        Découvrez le potentiel d&apos;OpenDesign avec un site SaaS complet pré-installé : zone 3D WebGL, Studio Vectoriel 2D animable, Grille Bento et Grille de Tarifs.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-[10px] font-mono font-bold text-pink-400 group-hover:text-pink-300">
                    <span>Charger le modèle démo</span>
                    <span>→</span>
                  </div>
                </button>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-center gap-4 text-[10px] text-slate-500">
                <span>🛡️ Aucune donnée n&apos;est écrasée sans votre accord</span>
                <span>•</span>
                <span>💡 Réinitialisable à tout moment</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Backdrop for Left AI Panel */}
      {isAIPanelOpen && (
        <div 
          onClick={() => setIsAIPanelOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Left Panel: Professional Dual-Mode Container (Arborescence Pro & Assistant IA) */}
      <div className="flex flex-col h-screen shrink-0 relative bg-[#0a0d16] border-r border-white/[0.08]" style={{ width: leftPanelWidth }}>
        {/* Top Professional Left Panel Tab Switcher */}
        <div className="flex items-center bg-[#07090e] border-b border-white/[0.08] px-2 py-2 gap-1.5 shrink-0">
          <button
            onClick={() => setLeftPanelTab('tree')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              leftPanelTab === 'tree'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-300" />
            <span>Arborescence</span>
            <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-mono">
              {blocks.length}
            </span>
          </button>
          <button
            onClick={() => setLeftPanelTab('ai')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              leftPanelTab === 'ai'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-indigo-300" />
            <span>Assistant IA</span>
          </button>
        </div>

        {leftPanelTab === 'tree' ? (
          <LeftSidebar
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={(id) => setSelectedBlockId(id)}
            selectedElement={selectedElement}
            onSelectElement={setSelectedElement}
            onToggleVisibility={handleToggleVisibility}
            onToggleLock={handleToggleLock}
            onDuplicateBlock={handleDuplicateBlock}
            onDeleteBlock={handleDeleteBlock}
            onMoveBlock={handleMoveBlock}
            onAddBlock={handleAddBlock}
            commits={commits}
            activeBranch={activeBranch}
            onCheckoutCommit={handleCheckoutCommit}
            onNewCommit={handleNewCommit}
            themeAccent={themeAccent}
            onUpdateThemeAccent={setThemeAccent}
          />
        ) : (
          <LeftPromptPanel
            isOpen={isAIPanelOpen}
            onToggleOpen={() => setIsAIPanelOpen(!isAIPanelOpen)}
            onSendPrompt={handleAgentPrompt}
            isLoading={isAgentLoading}
            providers={providers}
            activeProviderId={aiSettings.activeProviderId}
            activeModelId={aiSettings.activeModelId}
            onSelectModel={handleSelectModel}
            onOpenModelSettings={() => setIsAIModalOpen(true)}
            latestProposal={latestProposal}
            latestError={latestError}
            executionLogs={executionLogs}
            onClearLogs={() => setExecutionLogs([])}
            width={leftPanelWidth}
          />
        )}
      </div>

      {/* Resizer Divider between Left Panel and Studio Canvas (Desktop only) */}
      {isAIPanelOpen && (
        <div
          onPointerDown={handleStartLeftResize}
          onDoubleClick={() => setLeftPanelWidth(390)}
          title="Glisser pour redimensionner le panneau gauche (Double-clic pour réinitialiser à 390px)"
          className={`hidden lg:flex w-1.5 hover:w-2.5 z-40 bg-white/[0.04] hover:bg-indigo-500/50 active:bg-indigo-500 cursor-col-resize select-none transition-all items-center justify-center shrink-0 group ${
            isResizingLeft ? 'bg-indigo-500 w-2.5 shadow-lg shadow-indigo-500/50' : ''
          }`}
        >
          <div className="w-0.5 h-7 rounded-full bg-white/20 group-hover:bg-indigo-200 transition-colors" />
        </div>
      )}

      {/* Right Studio Area: TopBar + Interactive 2D/3D Canvas + Right Sidebar Inspector */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative min-w-0">
        <TopBar
          projectName={projectName}
          onUpdateProjectName={setProjectName}
          viewportMode={viewportMode}
          onViewportChange={setViewportMode}
          isPreviewMode={isPreviewMode}
          onTogglePreviewMode={() => setIsPreviewMode(!isPreviewMode)}
          isFreeformMode={isFreeformMode}
          onToggleFreeformMode={() => setIsFreeformMode(!isFreeformMode)}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          themeAccent={themeAccent}
          onUpdateThemeAccent={setThemeAccent}
          onAddBlock={(type) => handleAddBlock(type)}
          onResetToDefault={handleResetToDefault}
          isCodeDrawerOpen={isCodeDrawerOpen}
          onToggleCodeDrawer={() => setIsCodeDrawerOpen(!isCodeDrawerOpen)}
          onOpenAIModal={() => setIsAIModalOpen(true)}
          isAIPanelOpen={isAIPanelOpen}
          onToggleAIPanel={() => {
            if (!isAIPanelOpen && isInspectorOpen && typeof window !== 'undefined' && window.innerWidth < 1024) {
              setIsInspectorOpen(false);
            }
            setIsAIPanelOpen(!isAIPanelOpen);
          }}
          activeModelName={activeModel?.name}
          isInspectorOpen={isInspectorOpen}
          onToggleInspector={() => {
            if (!isInspectorOpen && isAIPanelOpen && typeof window !== 'undefined' && window.innerWidth < 1024) {
              setIsAIPanelOpen(false);
            }
            setIsInspectorOpen(!isInspectorOpen);
          }}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
        />

        {/* Main Studio Canvas and Panels */}
        <div className="flex-1 flex overflow-hidden relative min-w-0 pb-14 lg:pb-0">
          <BuilderCanvas
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            selectedElement={selectedElement}
            onSelectBlock={(id) => {
              setSelectedBlockId(id);
              if (!id) {
                setSelectedElement(null);
              }
              if (id && !isInspectorOpen) {
                if (isAIPanelOpen && typeof window !== 'undefined' && window.innerWidth < 1024) {
                  setIsAIPanelOpen(false);
                }
                setIsInspectorOpen(true);
              }
            }}
            onSelectElement={(elem) => {
              setSelectedElement(elem);
              if (elem) {
                setSelectedBlockId(elem.blockId);
                if (!isInspectorOpen) {
                  if (isAIPanelOpen && typeof window !== 'undefined' && window.innerWidth < 1024) {
                    setIsAIPanelOpen(false);
                  }
                  setIsInspectorOpen(true);
                }
              }
            }}
            onUpdateBlock={handleUpdateBlock}
            onDeleteBlock={handleDeleteBlock}
            onDuplicateBlock={handleDuplicateBlock}
            onMoveBlock={handleMoveBlock}
            onReorderBlocks={handleReorderBlocks}
            onAddBlock={handleAddBlock}
            viewportMode={viewportMode}
            zoomLevel={zoomLevel}
            isPreviewMode={isPreviewMode}
            isFreeformMode={isFreeformMode}
            onToggleFreeformMode={() => setIsFreeformMode(!isFreeformMode)}
            themeAccent={themeAccent}
          />

          {/* Resizer Divider between Canvas and Right Inspector (Desktop only) */}
          {isInspectorOpen && (
            <div
              onPointerDown={handleStartRightResize}
              onDoubleClick={() => setRightSidebarWidth(380)}
              title="Glisser pour redimensionner le panneau droit (Double-clic pour réinitialiser à 380px)"
              className={`hidden lg:flex w-1.5 hover:w-2.5 z-30 bg-white/[0.04] hover:bg-indigo-500/50 active:bg-indigo-500 cursor-col-resize select-none transition-all items-center justify-center shrink-0 group ${
                isResizingRight ? 'bg-indigo-500 w-2.5 shadow-lg shadow-indigo-500/50' : ''
              }`}
            >
              <div className="w-0.5 h-7 rounded-full bg-white/20 group-hover:bg-indigo-200 transition-colors" />
            </div>
          )}

          {/* Mobile Backdrop for Right Inspector */}
          {isInspectorOpen && (
            <div 
              onClick={() => setIsInspectorOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
            />
          )}

          {/* Right Inspector Panel */}
          <RightSidebar
            selectedBlock={selectedBlock}
            selectedElement={selectedElement}
            onSelectElement={setSelectedElement}
            onUpdateBlock={handleUpdateBlock}
            onDeleteBlock={handleDeleteBlock}
            onDuplicateBlock={handleDuplicateBlock}
            onMoveBlock={handleMoveBlock}
            generatedCode={generatedCode}
            activeDiff={latestProposal}
            onAcceptDiff={() => {
              if (latestProposal?.proposedBlocks) {
                setBlocks(latestProposal.proposedBlocks);
              }
              setLatestProposal(null);
            }}
            onRejectDiff={() => setLatestProposal(null)}
            themeAccent={themeAccent}
            isOpen={isInspectorOpen}
            onClose={() => {
              setIsInspectorOpen(false);
              setSelectedElement(null);
            }}
            width={rightSidebarWidth}
            blocks={blocks}
            onSelectBlockId={setSelectedBlockId}
            onAddBlock={handleAddBlock}
          />

          {/* Optional Slide-Over Code Drawer (Clean & Non-Intrusive) */}
          {isCodeDrawerOpen && (
            <>
              <div 
                onClick={() => setIsCodeDrawerOpen(false)}
                className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 lg:hidden animate-in fade-in duration-200"
              />
              <aside className="fixed lg:absolute top-0 right-0 bottom-0 w-full sm:w-[460px] bg-[#090d18]/95 border-l border-white/10 shadow-2xl backdrop-blur-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
                <div className="h-14 px-5 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Code React + Tailwind
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">Copié</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setIsCodeDrawerOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4 font-mono text-[11px] leading-relaxed text-slate-300 bg-[#060810]/70 select-text">
                  <pre className="whitespace-pre-wrap">{generatedCode}</pre>
                </div>
              </aside>
            </>
          )}
        </div>

        {/* High-Craft Mobile & Tablet Quick Bottom Navigation Bar */}
        <nav 
          aria-label="Navigation mobile"
          className="fixed bottom-0 inset-x-0 h-14 bg-[#080b15]/95 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around px-2 z-30 lg:hidden shadow-2xl select-none"
        >
          {/* AI Console Button */}
          <button
            onClick={() => {
              if (isInspectorOpen) setIsInspectorOpen(false);
              setIsAIPanelOpen(!isAIPanelOpen);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
              isAIPanelOpen
                ? 'text-purple-300 bg-purple-500/20 shadow-inner'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Bot className="w-4 h-4 text-purple-400" />
              {isAgentLoading && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </div>
            <span className="text-[10px] font-medium tracking-tight">Agent IA</span>
          </button>

          {/* Viewport Cycle Button */}
          <button
            onClick={() => {
              if (viewportMode === 'desktop') setViewportMode('tablet');
              else if (viewportMode === 'tablet') setViewportMode('mobile');
              else setViewportMode('desktop');
            }}
            className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl text-slate-400 hover:text-slate-200 transition-all"
          >
            {viewportMode === 'mobile' ? (
              <Smartphone className="w-4 h-4 text-indigo-400" />
            ) : viewportMode === 'tablet' ? (
              <Tablet className="w-4 h-4 text-indigo-400" />
            ) : (
              <Monitor className="w-4 h-4 text-indigo-400" />
            )}
            <span className="text-[10px] font-medium tracking-tight uppercase">
              {viewportMode === 'mobile' ? 'Mobile' : viewportMode === 'tablet' ? 'Tablette' : 'Bureau'}
            </span>
          </button>

          {/* Inspector / Properties Button */}
          <button
            onClick={() => {
              if (isAIPanelOpen) setIsAIPanelOpen(false);
              setIsInspectorOpen(!isInspectorOpen);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
              isInspectorOpen
                ? 'text-indigo-300 bg-indigo-500/20 shadow-inner'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Sliders className="w-4 h-4 text-indigo-400" />
              {selectedBlockId && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400" />
              )}
            </div>
            <span className="text-[10px] font-medium tracking-tight">Inspecteur</span>
          </button>

          {/* Mode Switch (Preview vs Edit) */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
              isPreviewMode
                ? 'text-emerald-300 bg-emerald-500/15'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isPreviewMode ? (
              <Eye className="w-4 h-4 text-emerald-400" />
            ) : (
              <Edit3 className="w-4 h-4 text-slate-300" />
            )}
            <span className="text-[10px] font-medium tracking-tight">
              {isPreviewMode ? 'Aperçu' : 'Édition'}
            </span>
          </button>

          {/* Export Code Button */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl text-indigo-300 hover:text-white transition-all"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-medium tracking-tight">Export</span>
          </button>
        </nav>
      </div>

      {/* Export Code Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        reactCode={generatedCode}
      />

      {/* AI Providers & Models Management Modal */}
      <AIProvidersModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        providers={providers}
        onUpdateProviders={handleUpdateProviders}
        settings={aiSettings}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  );
}
