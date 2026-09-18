'use client';

import React, { useState, useEffect } from 'react';
import { Type, Check, Search, Sparkles } from 'lucide-react';

export interface FontOption {
  family: string;
  category: 'sans-serif' | 'serif' | 'display' | 'monospace';
  weights: string;
  previewText?: string;
  popularFor?: string;
}

export const POPULAR_GOOGLE_FONTS: FontOption[] = [
  { family: 'Plus Jakarta Sans', category: 'sans-serif', weights: '400;600;700;800', popularFor: 'SaaS Modern UI' },
  { family: 'Inter', category: 'sans-serif', weights: '400;500;600;700', popularFor: 'Dashboard & Clean Text' },
  { family: 'Outfit', category: 'sans-serif', weights: '400;600;700;800', popularFor: 'Mobile App & Consumer UI' },
  { family: 'Space Grotesk', category: 'display', weights: '400;600;700', popularFor: 'Tech & Fintech Dark Mode' },
  { family: 'Playfair Display', category: 'serif', weights: '400;600;700;800', popularFor: 'Luxury & Editorial' },
  { family: 'Syne', category: 'display', weights: '500;700;800', popularFor: 'Creative Portfolio' },
  { family: 'Cabinet Grotesk', category: 'display', weights: '500;700;800', popularFor: 'Brand Headings' },
  { family: 'Montserrat', category: 'sans-serif', weights: '400;600;700;800', popularFor: 'E-commerce & Banners' },
  { family: 'Poppins', category: 'sans-serif', weights: '400;500;600;700', popularFor: 'Startup & Mobile Apps' },
  { family: 'Urbanist', category: 'sans-serif', weights: '400;600;700', popularFor: 'Minimalist Fashion' },
  { family: 'Fira Code', category: 'monospace', weights: '400;600', popularFor: 'Code Snippets & Tech' },
  { family: 'Cinzel', category: 'serif', weights: '500;700', popularFor: 'Dark Luxury & High-end' },
];

export function loadGoogleFont(fontFamily: string) {
  if (typeof window === 'undefined') return;
  const linkId = `google-font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    const formattedFamily = fontFamily.replace(/\s+/g, '+');
    link.href = `https://fonts.googleapis.com/css2?family=${formattedFamily}:wght@400;500;600;700;800&display=swap`;
    document.head.appendChild(link);
  }
}

interface GoogleFontSelectorProps {
  selectedFont?: string;
  onSelectFont: (fontFamily: string) => void;
  title?: string;
}

export const GoogleFontSelector: React.FC<GoogleFontSelectorProps> = ({
  selectedFont = 'Plus Jakarta Sans',
  onSelectFont,
  title = 'Typographies Google Fonts'
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    POPULAR_GOOGLE_FONTS.forEach((f) => loadGoogleFont(f.family));
  }, []);

  const filteredFonts = POPULAR_GOOGLE_FONTS.filter((font) => {
    const matchesSearch = font.family.toLowerCase().includes(search.toLowerCase()) ||
                          (font.popularFor && font.popularFor.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = activeCategory === 'all' || font.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const handleChoose = (family: string) => {
    loadGoogleFont(family);
    onSelectFont(family);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{title}</h4>
        </div>
        <span className="text-[10px] text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
          Prévisualisation Directe
        </span>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une police (ex: Playfair, Space...)"
            className="w-full bg-[#0d111d] border border-white/10 focus:border-indigo-500/50 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px]">
          {['all', 'sans-serif', 'serif', 'display', 'monospace'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat === 'all' ? 'Toutes' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Font Cards Grid */}
      <div className="grid grid-cols-1 gap-2 max-h-[260px] overflow-y-auto pr-1">
        {filteredFonts.map((font) => {
          const isSelected = selectedFont === font.family;
          return (
            <button
              key={font.family}
              onClick={() => handleChoose(font.family)}
              className={`group p-3 rounded-xl text-left border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'bg-[#0d111d]/90 border-white/5 hover:border-indigo-500/30 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors">
                    {font.family}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 px-1.5 py-0.5 rounded bg-white/5">
                    {font.category}
                  </span>
                </div>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>

              {/* Sample Live Typography Text */}
              <p
                style={{ fontFamily: `'${font.family}', sans-serif` }}
                className="text-base text-slate-200 mt-1 truncate leading-tight"
              >
                Design System & Interfaces Tendance 2026
              </p>

              {font.popularFor && (
                <div className="mt-2 flex items-center gap-1 text-[9px] text-indigo-400/80 font-mono">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{font.popularFor}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
