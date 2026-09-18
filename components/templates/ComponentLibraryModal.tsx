'use client';

import React, { useState } from 'react';
import { THEMATIC_TEMPLATES, TemplatePreset } from '@/lib/templatesData';
import { TemplateCatalog } from './TemplateCatalog';
import { GoogleFontSelector } from '@/components/fonts/GoogleFontSelector';
import { IconPicker } from '@/components/icons/IconPicker';
import { BentoGridSection } from '@/components/sections/BentoGridSection';
import { CarouselSection } from '@/components/sections/CarouselSection';
import { LeadCaptureSection } from '@/components/sections/LeadCaptureSection';
import { CanvasBlock, BlockType } from '@/types/builder';
import { 
  X, Layers, Layout, Type, Sparkles, Check, ArrowRight, 
  Quote, ShieldCheck, Zap, Bot, Eye, Plus, Code2
} from 'lucide-react';

interface ComponentLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: TemplatePreset) => void;
  onAddInteractiveBlock: (blockType: BlockType) => void;
  onUpdateGlobalFont?: (fontFamily: string) => void;
  activeTemplateId?: string;
  selectedFont?: string;
}

export const ComponentLibraryModal: React.FC<ComponentLibraryModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
  onAddInteractiveBlock,
  onUpdateGlobalFont,
  activeTemplateId = 'saas-minimaliste',
  selectedFont = 'Plus Jakarta Sans'
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'bento' | 'carousel' | 'leadForm' | 'fontsAndIcons'>('templates');
  const [currentFont, setCurrentFont] = useState(selectedFont);
  const [selectedIcon, setSelectedIcon] = useState('Zap');

  if (!isOpen) return null;

  const handleFontSelect = (family: string) => {
    setCurrentFont(family);
    onUpdateGlobalFont?.(family);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-[#080b14] border border-indigo-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#06080f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Bibliothèque de Composants & Design System
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  v3.5 Live
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Catalogue de templates prêts à l&apos;emploi, sections interactives & explorateur visuel d&apos;icônes et Google Fonts.
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-white/5 bg-[#090d18] overflow-x-auto scrollbar-none text-xs">
          {[
            { id: 'templates', label: 'Catalogue de Templates (5)', icon: Layout },
            { id: 'bento', label: 'Grilles Bento Magnétiques', icon: Layers },
            { id: 'carousel', label: 'Carrousels Tactiles', icon: Quote },
            { id: 'leadForm', label: 'Formulaires de Capture', icon: ShieldCheck },
            { id: 'fontsAndIcons', label: 'Sélecteur Google Fonts & Icônes', icon: Type },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: TEMPLATE CATALOG */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-indigo-300">
                  <Sparkles className="w-4 h-4 shrink-0 text-indigo-400" />
                  <span>
                    Sélectionnez un template thématique complet pour remplacer le canevas actuel avec sa palette, ses polices et ses composants optimisés.
                  </span>
                </div>
              </div>

              <TemplateCatalog
                activeTemplateId={activeTemplateId}
                onApplyTemplate={(tpl) => {
                  onApplyTemplate(tpl);
                  onClose();
                }}
              />
            </div>
          )}

          {/* TAB 2: BENTO GRIDS */}
          {activeTab === 'bento' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <p className="text-xs text-indigo-300">
                  ⚡ Effets de survol magnétiques calculant l&apos;angle de perspective et l&apos;intensité du spotlight radial en direct.
                </p>
                <button
                  onClick={() => {
                    onAddInteractiveBlock('featureGrid');
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insérer cette section Bento dans le Canvas</span>
                </button>
              </div>

              <div className="border border-white/10 rounded-3xl p-4 bg-black/40">
                <BentoGridSection />
              </div>
            </div>
          )}

          {/* TAB 3: CAROUSEL */}
          {activeTab === 'carousel' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-pink-500/10 border border-pink-500/20">
                <p className="text-xs text-pink-300">
                  💬 Sliders & carrousels tactiles pour témoignages, galeries et revues clients avec autodéfilement.
                </p>
                <button
                  onClick={() => {
                    onAddInteractiveBlock('featureGrid');
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insérer ce Carrousel dans le Canvas</span>
                </button>
              </div>

              <div className="border border-white/10 rounded-3xl p-4 bg-black/40">
                <CarouselSection />
              </div>
            </div>
          )}

          {/* TAB 4: LEAD CAPTURE FORM */}
          {activeTab === 'leadForm' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-xs text-emerald-300">
                  🛡️ Validation RFC 5322 en temps réel, retour visuel sur la validité des champs et formulaire de contact haute conversion.
                </p>
                <button
                  onClick={() => {
                    onAddInteractiveBlock('ctaBanner');
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insérer ce Formulaire dans le Canvas</span>
                </button>
              </div>

              <div className="border border-white/10 rounded-3xl p-4 bg-black/40">
                <LeadCaptureSection />
              </div>
            </div>
          )}

          {/* TAB 5: FONTS & ICONS */}
          {activeTab === 'fontsAndIcons' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Google Fonts Selector */}
              <div className="p-6 rounded-3xl bg-[#0d111e]/90 border border-white/10 space-y-4">
                <GoogleFontSelector
                  selectedFont={currentFont}
                  onSelectFont={handleFontSelect}
                />
              </div>

              {/* Lucide Icon Picker */}
              <div className="p-6 rounded-3xl bg-[#0d111e]/90 border border-white/10 space-y-4">
                <IconPicker
                  selectedIcon={selectedIcon}
                  onSelectIcon={(icon) => setSelectedIcon(icon)}
                />

                <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Icône sélectionnée :</span>
                    <span className="font-mono font-bold text-pink-400">{selectedIcon}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Cliquez sur n&apos;importe quelle icône pour la tester ou la copier directement dans vos blocs React.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#06080f] flex items-center justify-between text-xs text-slate-400">
          <span>💡 Choisissez un composant ou un template pour enrichir instantanément votre site.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
          >
            Fermer le Design System
          </button>
        </div>
      </div>
    </div>
  );
};
