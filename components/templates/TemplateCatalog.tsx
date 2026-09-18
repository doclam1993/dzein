'use client';

import React, { useState } from 'react';
import { THEMATIC_TEMPLATES, TemplatePreset } from '@/lib/templatesData';
import { CanvasBlock } from '@/types/builder';
import { Sparkles, Check, ArrowRight, Layers, Layout, ShieldCheck, Zap, Bot, Smartphone, ShoppingBag } from 'lucide-react';

interface TemplateCatalogProps {
  activeTemplateId?: string;
  onApplyTemplate: (template: TemplatePreset) => void;
}

export const TemplateCatalog: React.FC<TemplateCatalogProps> = ({
  activeTemplateId = 'saas-minimaliste',
  onApplyTemplate
}) => {
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const filteredTemplates = THEMATIC_TEMPLATES.filter(
    (t) => selectedCat === 'all' || t.category === selectedCat
  );

  return (
    <div className="space-y-6">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {[
          { id: 'all', label: 'Tous les Templates (5)' },
          { id: 'saas', label: 'SaaS Minimaliste' },
          { id: 'fintech', label: 'Dark Luxury Fintech' },
          { id: 'portfolio', label: 'Portfolio Créatif' },
          { id: 'ecommerce', label: 'E-commerce Store' },
          { id: 'mobile', label: 'App Mobile Showcase' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              selectedCat === cat.id
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Templates Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((tpl) => {
          const isActive = activeTemplateId === tpl.id;

          return (
            <div
              key={tpl.id}
              className={`group relative rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                isActive
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-xl shadow-indigo-500/10'
                  : 'bg-[#0d1220]/80 border-white/10 hover:border-indigo-500/40 hover:bg-slate-900/80'
              }`}
            >
              {/* Badge Tag */}
              <div className="flex items-center justify-between mb-4">
                <span
                  style={{ color: tpl.accentColor, backgroundColor: `${tpl.accentColor}15`, borderColor: `${tpl.accentColor}30` }}
                  className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border"
                >
                  {tpl.badge}
                </span>

                <span className="text-[10px] text-slate-500 font-mono">
                  {tpl.blocks.length} Blocs Réactifs
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2 mb-6">
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {tpl.description}
                </p>

                {/* Typography tokens */}
                <div className="pt-2 flex items-center gap-2 text-[10px] font-mono text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                    Heading: {tpl.fontHeading}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                    Body: {tpl.fontBody}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onApplyTemplate(tpl)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-white/5 hover:bg-indigo-600 text-slate-200 hover:text-white border border-white/10'
                }`}
              >
                {isActive ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Template Actif sur le Canvas</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Charger le Template ({tpl.name})</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
