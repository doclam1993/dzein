import { CanvasBlock, ElementCustomStyle } from '@/types/builder';

function getStyleObject(custom?: ElementCustomStyle): Record<string, any> {
  if (!custom || custom.hidden) return {};
  const styles: Record<string, any> = {};
  if (custom.fontFamily) styles.fontFamily = custom.fontFamily;
  if (custom.textColor) styles.color = custom.textColor;
  if (custom.color) styles.color = custom.color;
  if (custom.isGradientText) {
    const bg = custom.background || (custom.backgroundColor?.includes('gradient') ? custom.backgroundColor : undefined);
    if (bg) {
      styles.background = bg;
      styles.WebkitBackgroundClip = 'text';
      styles.backgroundClip = 'text';
      styles.color = 'transparent';
      styles.WebkitTextFillColor = 'transparent';
    }
  } else if (custom.background) {
    styles.background = custom.background;
  } else if (custom.backgroundColor && custom.backgroundColor !== 'transparent') {
    if (custom.backgroundColor.includes('gradient')) {
      styles.background = custom.backgroundColor;
    } else {
      styles.backgroundColor = custom.backgroundColor;
    }
  }
  if (custom.fontSize) styles.fontSize = `${custom.fontSize}px`;
  if (custom.fontWeight) styles.fontWeight = custom.fontWeight;
  if (custom.textAlign) styles.textAlign = custom.textAlign;
  if (custom.lineHeight !== undefined) styles.lineHeight = custom.lineHeight;
  if (custom.letterSpacing !== undefined) styles.letterSpacing = `${custom.letterSpacing}px`;
  if (custom.textTransform) styles.textTransform = custom.textTransform;
  if (custom.textDecoration) styles.textDecoration = custom.textDecoration;
  if (custom.borderRadius !== undefined) styles.borderRadius = `${custom.borderRadius}px`;
  if (custom.borderWidth !== undefined) {
    styles.borderWidth = `${custom.borderWidth}px`;
    styles.borderStyle = custom.borderStyle || 'solid';
  }
  if (custom.borderColor) styles.borderColor = custom.borderColor;
  if (custom.opacity !== undefined) styles.opacity = custom.opacity;
  if (custom.paddingTop !== undefined) styles.paddingTop = `${custom.paddingTop}px`;
  if (custom.paddingBottom !== undefined) styles.paddingBottom = `${custom.paddingBottom}px`;
  if (custom.paddingLeft !== undefined) styles.paddingLeft = `${custom.paddingLeft}px`;
  if (custom.paddingRight !== undefined) styles.paddingRight = `${custom.paddingRight}px`;
  return styles;
}

function getStyleAttr(custom?: ElementCustomStyle): string {
  const obj = getStyleObject(custom);
  if (Object.keys(obj).length === 0) return '';
  return ` style={${JSON.stringify(obj)}}`;
}

function isHidden(custom?: ElementCustomStyle): boolean {
  return Boolean(custom?.hidden);
}

function getBlockStyleAttr(block: CanvasBlock): string {
  const s = block.style || {};
  const bgVal = s.background || s.backgroundColor;
  const isTransparent = !bgVal || bgVal === 'transparent';
  const obj: Record<string, any> = {};
  if (!isTransparent) {
    if (bgVal?.includes('gradient')) obj.background = bgVal;
    else obj.backgroundColor = bgVal;
  }
  if (s.borderRadius !== undefined) obj.borderRadius = `${s.borderRadius}px`;
  if (s.borderColor) obj.borderColor = s.borderColor;
  if (s.borderWidth !== undefined) {
    obj.borderWidth = `${s.borderWidth}px`;
    obj.borderStyle = 'solid';
  }
  if (s.paddingTop !== undefined) obj.paddingTop = `${s.paddingTop}px`;
  if (s.paddingBottom !== undefined) obj.paddingBottom = `${s.paddingBottom}px`;
  if (s.paddingLeft !== undefined) obj.paddingLeft = `${s.paddingLeft}px`;
  if (s.paddingRight !== undefined) obj.paddingRight = `${s.paddingRight}px`;
  if (s.opacity !== undefined && s.opacity !== 1) obj.opacity = s.opacity;

  if (Object.keys(obj).length === 0) return '';
  return ` style={${JSON.stringify(obj)}}`;
}

export function generateReactCode(blocks: CanvasBlock[]): string {
  const visibleBlocks = blocks.filter((b) => !b.layout.isHidden);

  const imports = `import React, { useState } from 'react';
import { 
  Boxes, GitBranch, Bot, Zap, ShieldCheck, Code2, 
  ArrowRight, Check, Sparkles, Layers, ChevronRight, Menu, X 
} from 'lucide-react';
`;

  let blockSections = '';

  for (const block of visibleBlocks) {
    const elemStyles = block.content.elementStyles || {};
    const bStyleAttr = getBlockStyleAttr(block);

    if (block.type === 'header') {
      const showPri = !isHidden(elemStyles.primaryCta);
      const showSec = !isHidden(elemStyles.secondaryCta);

      blockSections += `
      {/* --- HEADER NAVBAR --- */}
      <header${bStyleAttr} className="w-full sticky top-4 z-50 px-4 md:px-8 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 rounded-2xl bg-[#0d111a]/80 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25">
              <Boxes className="w-5 h-5" />
            </div>
            ${!isHidden(elemStyles.title) ? `<span${getStyleAttr(elemStyles.title)} className="font-semibold tracking-wider text-white text-lg">${block.content.title || 'SYNAPSE AI'}</span>` : ''}
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            ${(block.content.links || [])
              .map(
                (l) =>
                  `<a href="${l.href}" className="hover:text-white transition-colors duration-200">${l.label}</a>`
              )
              .join('\n            ')}
          </nav>

          <div className="flex items-center gap-3">
            ${showSec ? `<button${getStyleAttr(elemStyles.secondaryCta)} className="hidden sm:inline-flex text-sm text-slate-300 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors">
              ${block.content.secondaryCtaText || 'Sign In'}
            </button>` : ''}
            ${showPri ? `<button${getStyleAttr(elemStyles.primaryCta)} className="text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
              ${block.content.primaryCtaText || 'Launch Studio'}
            </button>` : ''}
          </div>
        </div>
      </header>
`;
    } else if (block.type === 'hero') {
      const showBadge = block.content.badgeText && !isHidden(elemStyles.badge);
      const showTitle = !isHidden(elemStyles.title);
      const showSubtitle = !isHidden(elemStyles.subtitle);
      const showPri = !isHidden(elemStyles.primaryCta);
      const showSec = !isHidden(elemStyles.secondaryCta);

      blockSections += `
      {/* --- HERO SECTION --- */}
      <section${bStyleAttr} className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-16 max-w-5xl mx-auto text-center flex flex-col items-center">
        ${
          showBadge
            ? `<div${getStyleAttr(elemStyles.badge)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-8 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>${block.content.badgeText}</span>
        </div>`
            : ''
        }

        ${showTitle ? `<h1${getStyleAttr(elemStyles.title)} className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.15]">
          ${block.content.title || 'Design Autonomous Software with'}{' '}
          ${!isHidden(elemStyles.titleHighlight) ? `<span${getStyleAttr(elemStyles.titleHighlight)} className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            ${block.content.titleHighlight || 'Real-Time Spatial Intelligence'}
          </span>` : (block.content.titleHighlight || '')}
        </h1>` : ''}

        ${showSubtitle ? `<p${getStyleAttr(elemStyles.subtitle)} className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          ${block.content.subtitle || ''}
        </p>` : ''}

        ${(showPri || showSec) ? `<div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          ${showPri ? `<button${getStyleAttr(elemStyles.primaryCta)} className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium px-7 py-3.5 rounded-xl shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.02]">
            <span>${block.content.primaryCtaText || 'Deploy to Cloud'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>` : ''}
          ${showSec ? `<button${getStyleAttr(elemStyles.secondaryCta)} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 text-slate-200 font-medium transition-all backdrop-blur-md">
            <span>${block.content.secondaryCtaText || 'Watch Demo'}</span>
          </button>` : ''}
        </div>` : ''}
      </section>
`;
    } else if (block.type === 'canvas3d') {
      const cfg = block.threeConfig;
      blockSections += `
      {/* --- 3D INTERACTIVE WEBGL COMPONENT --- */}
      <section${bStyleAttr} className="relative px-4 sm:px-6 max-w-5xl mx-auto my-6">
        <div className="relative w-full h-[420px] rounded-3xl bg-[#0c101a]/80 border border-indigo-500/20 backdrop-blur-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center">
          {/* Spatial 3D Mesh: ${cfg?.meshType || 'torusKnot'}, wireframe: ${cfg?.wireframe || false}, color: ${cfg?.color || '#6366f1'} */}
          ${!isHidden(elemStyles.badge) ? `<div${getStyleAttr(elemStyles.badge)} className="absolute top-4 left-6 flex items-center gap-2 text-xs text-indigo-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>${block.content.badgeText || '3D WebGL Shader Pipeline Active'}</span>
          </div>` : ''}

          <div className="text-center z-10 pointer-events-none select-none">
            ${!isHidden(elemStyles.title) ? `<p${getStyleAttr(elemStyles.title)} className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-1">
              ${block.content.title || 'Interactive 3D Geometry Core'}
            </p>` : ''}
            ${!isHidden(elemStyles.subtitle) ? `<p${getStyleAttr(elemStyles.subtitle)} className="text-sm text-slate-400">
              ${block.content.subtitle || 'Drag to rotate • Spatial depth rendering'}
            </p>` : ''}
          </div>
        </div>
      </section>
`;
    } else if (block.type === 'canvas2d') {
      const cfg = block.twoConfig || { shapes: [], backgroundColor: '#0d111b', showGrid: true };
      const shapesSvgMarkup = (cfg.shapes || []).map((s) => {
        const fillAttr = s.fill === 'none' ? 'none' : s.fill;
        const strokeAttr = s.stroke === 'transparent' ? 'none' : s.stroke;
        if (s.type === 'circle') {
          return `<circle cx="${s.x}" cy="${s.y}" r="${s.size / 2}" fill="${fillAttr}" stroke="${strokeAttr}" strokeWidth="${s.strokeWidth}" opacity="${s.opacity}" />`;
        } else if (s.type === 'rect') {
          return `<rect x="${s.x - (s.width || s.size)/2}" y="${s.y - (s.height || s.size)/2}" width="${s.width || s.size}" height="${s.height || s.size}" rx="4" fill="${fillAttr}" stroke="${strokeAttr}" strokeWidth="${s.strokeWidth}" opacity="${s.opacity}" />`;
        } else if (s.type === 'triangle') {
          return `<polygon points="${s.x},${s.y - s.size/2} ${s.x - s.size/2},${s.y + s.size/2} ${s.x + s.size/2},${s.y + s.size/2}" fill="${fillAttr}" stroke="${strokeAttr}" strokeWidth="${s.strokeWidth}" opacity="${s.opacity}" />`;
        } else {
          return `<circle cx="${s.x}" cy="${s.y}" r="${s.size / 2}" fill="${fillAttr}" stroke="${strokeAttr}" strokeWidth="${s.strokeWidth}" opacity="${s.opacity}" />`;
        }
      }).join('\n            ');

      blockSections += `
      {/* --- 2D GRAPHICS VECTOR DESIGNER --- */}
      <section${bStyleAttr} className="relative px-4 sm:px-6 max-w-5xl mx-auto my-6">
        <div className="relative w-full rounded-3xl bg-[#0c101a]/80 border border-indigo-500/20 backdrop-blur-2xl p-6 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            ${!isHidden(elemStyles.title) ? `<h3${getStyleAttr(elemStyles.title)} className="text-xl font-bold text-slate-100 mb-1">
              ${block.content.title || 'Studio 2D Graphic Design Core'}
            </h3>` : ''}
            ${!isHidden(elemStyles.subtitle) ? `<p${getStyleAttr(elemStyles.subtitle)} className="text-sm text-slate-400">
              ${block.content.subtitle || 'Custom 2D vector compositions with fluid kinematics'}
            </p>` : ''}
          </div>

          <div className="w-full max-w-[280px] aspect-square rounded-2xl p-2 bg-[#05070f] flex items-center justify-center border border-white/5 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full rounded-lg" style={{ backgroundColor: '${cfg.backgroundColor || '#0d111b'}' }}>
              ${shapesSvgMarkup}
            </svg>
          </div>
        </div>
      </section>
`;
    } else if (block.type === 'featureGrid') {
      const cols = block.content.gridColumns || 3;
      const colClass = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3';
      blockSections += `
      {/* --- BENTO FEATURE GRID --- */}
      <section${bStyleAttr} className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          ${!isHidden(elemStyles.badge) ? `<p${getStyleAttr(elemStyles.badge)} className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">${block.content.badgeText || 'Features'}</p>` : ''}
          ${!isHidden(elemStyles.title) ? `<h2${getStyleAttr(elemStyles.title)} className="text-3xl sm:text-4xl font-bold text-white tracking-tight">${block.content.title || 'Engineered for Velocity'}</h2>` : ''}
          ${!isHidden(elemStyles.subtitle) ? `<p${getStyleAttr(elemStyles.subtitle)} className="mt-4 text-slate-400">${block.content.subtitle || ''}</p>` : ''}
        </div>

        <div className="grid grid-cols-1 ${colClass} gap-6">
          ${(block.content.features || [])
            .map(
              (feat) => {
                const cardStyle = getStyleAttr(elemStyles[feat.id]);
                const tagStyle = getStyleAttr(elemStyles[`tag-${feat.id}`]);
                return `
          <div key="${feat.id}"${cardStyle} className="p-6 rounded-2xl bg-[#0e1320]/70 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                <Boxes className="w-5 h-5" />
              </div>
              ${(feat.tag && !isHidden(elemStyles[`tag-${feat.id}`])) ? `<span${tagStyle} className="text-[10px] font-mono font-medium px-2.5 py-1 rounded-full bg-white/5 text-slate-400">${feat.tag}</span>` : ''}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">${feat.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">${feat.description}</p>
          </div>`;
              }
            )
            .join('')}
        </div>
      </section>
`;
    } else if (block.type === 'pricing') {
      blockSections += `
      {/* --- PRICING SECTION --- */}
      <section${bStyleAttr} className="px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          ${!isHidden(elemStyles.badge) ? `<p${getStyleAttr(elemStyles.badge)} className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">${block.content.badgeText || 'Pricing'}</p>` : ''}
          ${!isHidden(elemStyles.title) ? `<h2${getStyleAttr(elemStyles.title)} className="text-3xl sm:text-4xl font-bold text-white tracking-tight">${block.content.title || 'Predictable Scale'}</h2>` : ''}
          ${!isHidden(elemStyles.subtitle) ? `<p${getStyleAttr(elemStyles.subtitle)} className="mt-4 text-slate-400">${block.content.subtitle || ''}</p>` : ''}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          ${(block.content.pricingPlans || [])
            .map(
              (plan) => {
                const planCardStyle = getStyleAttr(elemStyles[`plan-${plan.id}`]);
                const ctaStyle = getStyleAttr(elemStyles[`cta-${plan.id}`]);

                return `
          <div key="${plan.id}"${planCardStyle} className="relative rounded-3xl p-8 flex flex-col justify-between ${
                  plan.isPopular
                    ? 'bg-gradient-to-b from-[#161c2e] to-[#0d1220] border-2 border-indigo-500/50 shadow-2xl shadow-indigo-500/10'
                    : 'bg-[#0e1320]/80 border border-white/5'
                }">
            ${
              (plan.isPopular && !isHidden(elemStyles.popularTag))
                ? `<div${getStyleAttr(elemStyles.popularTag)} className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-semibold uppercase tracking-wider">
              Most Popular
            </div>`
                : ''
            }
            <div>
              <h3 className="text-xl font-bold text-white mb-1">${plan.name}</h3>
              <p className="text-xs text-slate-400 mb-6">${plan.description}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">$${plan.priceMonthly}</span>
                <span className="text-slate-400 text-sm">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                ${plan.features
                  .map(
                    (f) => `
                <li key="${f}" className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>${f}</span>
                </li>`
                  )
                  .join('')}
              </ul>
            </div>
            ${!isHidden(elemStyles[`cta-${plan.id}`]) ? `<button${ctaStyle} className="w-full py-3 rounded-xl font-medium text-sm transition-all ${
              plan.isPopular
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
            }">
              ${plan.ctaText}
            </button>` : ''}
          </div>`;
              }
            )
            .join('')}
        </div>
      </section>
`;
    } else if (block.type === 'footer') {
      blockSections += `
      {/* --- FOOTER --- */}
      <footer${bStyleAttr} className="w-full border-t border-white/5 py-10 px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          ${!isHidden(elemStyles.title) ? `<span${getStyleAttr(elemStyles.title)} className="font-semibold text-slate-300 mr-2">${block.content.title || 'opendesign'}</span>` : ''}
          ${!isHidden(elemStyles.subtitle) ? `<span${getStyleAttr(elemStyles.subtitle)}>${block.content.subtitle || ''}</span>` : ''}
        </div>
        ${!isHidden(elemStyles.copyright) ? `<p${getStyleAttr(elemStyles.copyright)}>${block.content.copyrightText || '© 2026 opendesign Inc. All rights reserved.'}</p>` : ''}
      </footer>
`;
    }
  }

  return `${imports}

export default function SaaSLandingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[600px] right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      ${blockSections}
    </div>
  );
}
`;
}
