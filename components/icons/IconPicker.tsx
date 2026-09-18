'use client';

import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search, Sparkles, Check } from 'lucide-react';

export const POPULAR_LUCIDE_ICONS = [
  // General & Interface
  'Zap', 'Sparkles', 'ShieldCheck', 'Bot', 'Boxes', 'GitBranch', 'Code2', 'Layers', 
  'Layout', 'Sliders', 'Star', 'Check', 'X', 'ChevronRight', 'ArrowRight', 'Eye', 
  'Edit3', 'Smartphone', 'Tablet', 'Monitor', 'Download', 'Copy', 'CheckCheck', 
  'Search', 'Heart', 'Flame', 'Globe', 'Lock', 'Unlock', 'Bell', 'Calendar', 
  'Clock', 'Compass', 'Crosshair', 'Feather', 'Filter', 'Folder', 'Home', 'Info', 
  'Key', 'Link', 'MapPin', 'Maximize2', 'Minimize2', 'Moon', 'Sun', 'Paperclip', 
  'PieChart', 'Send', 'Share2', 'SlidersHorizontal', 'Trash2', 'User', 'Users', 

  // SaaS & Tech
  'Cpu', 'Database', 'Server', 'Terminal', 'Activity', 'BarChart3', 'Cloud', 
  'CloudLightning', 'Command', 'Fingerprint', 'HardDrive', 'Hash', 'Laptop', 
  'Microchip', 'Network', 'Radio', 'RefreshCw', 'Shield', 'Signal', 'Wifi', 

  // Finance & E-commerce
  'CreditCard', 'DollarSign', 'Euro', 'Percent', 'Receipt', 'ShoppingBag', 
  'ShoppingCart', 'Tag', 'Wallet', 'Coins', 'TrendingUp', 'TrendingDown', 
  'Vault', 'Award', 'BadgePercent', 'Gift', 'Package', 'Truck',

  // Media & Creative
  'Aperture', 'Camera', 'Film', 'Image', 'Instagram', 'Music', 'Palette', 
  'Play', 'Video', 'Volume2', 'Wand2', 'PenTool', 'Brush', 'Shapes'
];

interface IconPickerProps {
  selectedIcon?: string;
  onSelectIcon: (iconName: string) => void;
  title?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon = 'Zap',
  onSelectIcon,
  title = 'Explorateur d\'Icônes Lucide'
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredIcons = POPULAR_LUCIDE_ICONS.filter((name) => {
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const renderIcon = (name: string) => {
    const IconComponent = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{title}</h4>
        </div>
        <span className="text-[10px] text-pink-400 font-mono bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
          {filteredIcons.length} Icônes
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une icône (ex: Zap, Shield, Bot...)"
          className="w-full bg-[#0d111d] border border-white/10 focus:border-pink-500/50 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all"
        />
      </div>

      {/* Icons Grid Selector */}
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-[220px] overflow-y-auto p-1 bg-[#090d18] border border-white/5 rounded-2xl">
        {filteredIcons.map((name) => {
          const isSelected = selectedIcon === name;
          return (
            <button
              key={name}
              onClick={() => onSelectIcon(name)}
              title={name}
              className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative group ${
                isSelected
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30 scale-105'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white hover:scale-105 border border-white/5'
              }`}
            >
              {renderIcon(name)}
              <span className="text-[9px] truncate max-w-full font-mono opacity-80 group-hover:opacity-100">
                {name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
