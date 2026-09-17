'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Layers, 
  Sparkles, 
  Eye, 
  Move, 
  Download, 
  Grid, 
  Maximize2, 
  RotateCw, 
  Heart, 
  Star, 
  Triangle, 
  Square, 
  Circle, 
  Sliders, 
  Zap,
  Play,
  Pause
} from 'lucide-react';
import { TwoDConfig, TwoDShape } from '../../types/builder';

interface TwoDCanvasWidgetProps {
  config?: TwoDConfig;
  isSelected?: boolean;
  onUpdateConfig?: (newCfg: Partial<TwoDConfig>) => void;
}

// Preseeded layouts for 1-click creative presets
export const TWOD_PRESETS: Record<string, { shapes: TwoDShape[]; backgroundColor: string }> = {
  retroGrid: {
    backgroundColor: '#0a0a16',
    shapes: [
      { id: 'grid-rect-1', type: 'rect', x: 50, y: 50, size: 80, width: 80, height: 80, fill: 'none', stroke: '#ff007f', strokeWidth: 1.5, rotation: 45, opacity: 0.4, glow: true, glowColor: '#ff007f', animType: 'spin', animSpeed: 0.5 },
      { id: 'grid-circle-1', type: 'circle', x: 50, y: 50, size: 40, fill: 'none', stroke: '#00ffff', strokeWidth: 2, rotation: 0, opacity: 0.8, glow: true, glowColor: '#00ffff', animType: 'pulse', animSpeed: 1.2 },
      { id: 'grid-triangle-1', type: 'triangle', x: 50, y: 30, size: 15, fill: 'none', stroke: '#ffff00', strokeWidth: 1.5, rotation: 0, opacity: 0.9, glow: true, glowColor: '#ffff00', animType: 'float', animSpeed: 1.5 },
      { id: 'grid-star-1', type: 'star', x: 25, y: 25, size: 12, fill: '#ff00ff', stroke: 'transparent', strokeWidth: 0, rotation: 15, opacity: 0.7, glow: true, glowColor: '#ff00ff', animType: 'bounce', animSpeed: 1.0 },
      { id: 'grid-star-2', type: 'star', x: 75, y: 75, size: 12, fill: '#00ffcc', stroke: 'transparent', strokeWidth: 0, rotation: -30, opacity: 0.7, glow: true, glowColor: '#00ffcc', animType: 'bounce', animSpeed: 0.8 },
    ]
  },
  bauhaus: {
    backgroundColor: '#f2efe9',
    shapes: [
      { id: 'bh-circle-1', type: 'circle', x: 45, y: 45, size: 50, fill: '#db3a34', stroke: '#111111', strokeWidth: 1.5, rotation: 0, opacity: 1, glow: false, animType: 'none' },
      { id: 'bh-rect-1', type: 'rect', x: 60, y: 55, size: 40, width: 50, height: 35, fill: '#084c61', stroke: '#111111', strokeWidth: 2, rotation: -12, opacity: 0.95, glow: false, animType: 'float', animSpeed: 0.6 },
      { id: 'bh-triangle-1', type: 'triangle', x: 30, y: 65, size: 30, fill: '#e5a93b', stroke: '#111111', strokeWidth: 2, rotation: 30, opacity: 1, glow: false, animType: 'spin', animSpeed: 0.3 },
      { id: 'bh-rect-2', type: 'rect', x: 50, y: 15, size: 15, width: 80, height: 4, fill: '#111111', stroke: 'transparent', strokeWidth: 0, rotation: 5, opacity: 1, glow: false, animType: 'none' }
    ]
  },
  synthwave: {
    backgroundColor: '#05030a',
    shapes: [
      { id: 'sw-sun', type: 'circle', x: 50, y: 45, size: 55, fill: '#f15bb5', stroke: '#fee440', strokeWidth: 2, rotation: 0, opacity: 0.95, glow: true, glowColor: '#f15bb5', animType: 'pulse', animSpeed: 0.8 },
      { id: 'sw-grid-back', type: 'rect', x: 50, y: 75, size: 50, width: 90, height: 30, fill: 'none', stroke: '#00f5d4', strokeWidth: 1, rotation: 0, opacity: 0.5, glow: true, glowColor: '#00f5d4', animType: 'none' },
      { id: 'sw-triangle-1', type: 'triangle', x: 50, y: 55, size: 25, fill: 'none', stroke: '#9b5de5', strokeWidth: 2.5, rotation: 180, opacity: 0.9, glow: true, glowColor: '#9b5de5', animType: 'float', animSpeed: 1.2 },
      { id: 'sw-star-1', type: 'star', x: 15, y: 20, size: 10, fill: '#ffffff', stroke: 'transparent', strokeWidth: 0, rotation: 45, opacity: 0.8, glow: true, glowColor: '#ffffff', animType: 'spin', animSpeed: 1.0 },
      { id: 'sw-star-2', type: 'star', x: 85, y: 25, size: 8, fill: '#ffffff', stroke: 'transparent', strokeWidth: 0, rotation: 0, opacity: 0.8, glow: true, glowColor: '#ffffff', animType: 'spin', animSpeed: 0.7 }
    ]
  },
  kawaii: {
    backgroundColor: '#fff0f3',
    shapes: [
      { id: 'kw-heart-1', type: 'heart', x: 50, y: 45, size: 30, fill: '#ffb3c1', stroke: '#ff4d6d', strokeWidth: 2, rotation: 0, opacity: 1, glow: true, glowColor: '#ffb3c1', animType: 'bounce', animSpeed: 1.4 },
      { id: 'kw-star-1', type: 'star', x: 25, y: 40, size: 18, fill: '#ffe5ec', stroke: '#ffb3c1', strokeWidth: 1.5, rotation: 15, opacity: 1, glow: true, glowColor: '#ffe5ec', animType: 'spin', animSpeed: 0.8 },
      { id: 'kw-circle-1', type: 'circle', x: 75, y: 42, size: 16, fill: '#c9e4de', stroke: '#a3c4bc', strokeWidth: 1.5, rotation: 0, opacity: 1, glow: false, animType: 'float', animSpeed: 1.0 },
      { id: 'kw-rect-1', type: 'rect', x: 50, y: 80, size: 15, width: 25, height: 15, fill: '#dbcdf0', stroke: '#c6acfc', strokeWidth: 1.5, rotation: -10, opacity: 1, glow: false, animType: 'float', animSpeed: 0.7 }
    ]
  }
};

const DEFAULT_CONFIG: TwoDConfig = {
  shapes: [
    { id: 'default-rect', type: 'rect', x: 50, y: 50, size: 30, width: 30, height: 30, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 2, rotation: 45, opacity: 0.95, glow: true, glowColor: '#6366f1', animType: 'spin', animSpeed: 1 },
    { id: 'default-circle', type: 'circle', x: 30, y: 35, size: 20, fill: '#ec4899', stroke: '#ffffff', strokeWidth: 2, rotation: 0, opacity: 0.9, glow: true, glowColor: '#ec4899', animType: 'float', animSpeed: 1.2 },
    { id: 'default-star', type: 'star', x: 70, y: 35, size: 22, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 1.5, rotation: 15, opacity: 0.95, glow: true, glowColor: '#f59e0b', animType: 'bounce', animSpeed: 1 }
  ],
  backgroundColor: '#0d111b',
  showGrid: true,
  themePreset: 'custom'
};

export const TwoDCanvasWidget: React.FC<TwoDCanvasWidgetProps> = ({
  config = DEFAULT_CONFIG,
  isSelected = false,
  onUpdateConfig,
}) => {
  const shapes = config.shapes || DEFAULT_CONFIG.shapes;
  const backgroundColor = config.backgroundColor || DEFAULT_CONFIG.backgroundColor;
  const showGrid = config.showGrid ?? DEFAULT_CONFIG.showGrid;
  const themePreset = config.themePreset || DEFAULT_CONFIG.themePreset;

  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [draggedShapeId, setDraggedShapeId] = useState<string | null>(null);
  const [sidebarTab, setSidebarTab] = useState<'shapes' | 'edit' | 'presets'>('presets');

  // Animation ticks ref to bypass react lag during requestAnimationFrame
  const animationFrameId = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const animOffsetsRef = useRef<Record<string, { x: number; y: number; rotation: number; scale: number; opacity: number }>>({});

  // Shape drag tracking in SVG coordinates (0 - 100)
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // Animation tick loop
    const tick = () => {
      if (isPlaying) {
        timeRef.current += 0.016; // Approx 60fps
        
        shapes.forEach((shape) => {
          const speed = shape.animSpeed ?? 1.0;
          const t = timeRef.current * speed;
          let dx = 0;
          let dy = 0;
          let drot = 0;
          let dscale = 1;
          let dopac = 0;

          switch (shape.animType) {
            case 'spin':
              drot = t * 45; // 45 degrees per second base
              break;
            case 'float':
              dy = Math.sin(t * 3) * 4; // float offset
              break;
            case 'bounce':
              dy = -Math.abs(Math.sin(t * 4)) * 6; // bounce offset
              break;
            case 'pulse':
              dscale = 1.0 + Math.sin(t * 5) * 0.15;
              dopac = Math.sin(t * 3) * 0.2;
              break;
            default:
              break;
          }

          animOffsetsRef.current[shape.id] = {
            x: dx,
            y: dy,
            rotation: drot,
            scale: dscale,
            opacity: dopac
          };
        });

        // Trigger light element style transforms using standard browser repaint for fast vector playback
        shapes.forEach((shape) => {
          const el = document.getElementById(`svg-shape-g-${shape.id}`);
          if (el) {
            const offsets = animOffsetsRef.current[shape.id] || { x: 0, y: 0, rotation: 0, scale: 1, opacity: 0 };
            const rotBase = shape.rotation;
            const finalRot = rotBase + offsets.rotation;
            const scaleStr = offsets.scale !== 1 ? `scale(${offsets.scale})` : '';
            const transStr = `translate(${offsets.x}px, ${offsets.y}px)`;
            
            // Set SVG transform
            el.setAttribute(
              'transform', 
              `translate(${shape.x}, ${shape.y}) rotate(${finalRot}) ${scaleStr ? `scale(${offsets.scale})` : ''} translate(${-shape.x}, ${-shape.y})`
            );
            
            // Subtle animated glow pulse
            const glowEl = document.getElementById(`svg-shape-glow-${shape.id}`);
            if (glowEl && shape.glow) {
              const pulseOpac = Math.max(0.2, Math.min(1.0, 0.6 + offsets.opacity));
              glowEl.setAttribute('opacity', pulseOpac.toString());
            }
          }
        });
      }

      animationFrameId.current = requestAnimationFrame(tick);
    };

    animationFrameId.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [shapes, isPlaying]);

  // Handle Dragging
  const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as SVGElement;
    const shapeId = target.getAttribute('data-shape-id');
    if (shapeId) {
      setDraggedShapeId(shapeId);
      setSelectedShapeId(shapeId);
      setSidebarTab('edit');
    } else {
      setSelectedShapeId(null);
    }
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedShapeId || !svgRef.current || !onUpdateConfig) return;

    const rect = svgRef.current.getBoundingClientRect();
    // Map client coordinates to 0 - 100 relative grid
    const x = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((e.clientY - rect.top) / rect.height) * 100)));

    const updatedShapes = shapes.map((shape) => {
      if (shape.id === draggedShapeId) {
        return { ...shape, x, y };
      }
      return shape;
    });

    onUpdateConfig({ shapes: updatedShapes });
  };

  const handleSvgMouseUpOrLeave = () => {
    setDraggedShapeId(null);
  };

  // Add a shape
  const addShape = (type: TwoDShape['type']) => {
    if (!onUpdateConfig) return;
    
    const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#ef4444'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newShape: TwoDShape = {
      id: `shape-${Date.now()}`,
      type,
      x: 50,
      y: 50,
      size: 20,
      width: type === 'rect' ? 25 : undefined,
      height: type === 'rect' ? 20 : undefined,
      fill: randomColor,
      stroke: '#ffffff',
      strokeWidth: 1.5,
      rotation: 0,
      opacity: 0.9,
      glow: true,
      glowColor: randomColor,
      animType: 'none',
      animSpeed: 1.0
    };

    onUpdateConfig({
      shapes: [...shapes, newShape]
    });
    setSelectedShapeId(newShape.id);
    setSidebarTab('edit');
  };

  // Delete shape
  const deleteShape = (id: string) => {
    if (!onUpdateConfig) return;
    const updated = shapes.filter((s) => s.id !== id);
    onUpdateConfig({ shapes: updated });
    if (selectedShapeId === id) setSelectedShapeId(null);
  };

  // Update specific selected shape property
  const updateShapeProp = (prop: keyof TwoDShape, val: any) => {
    if (!selectedShapeId || !onUpdateConfig) return;
    const updated = shapes.map((s) => {
      if (s.id === selectedShapeId) {
        return { ...s, [prop]: val };
      }
      return s;
    });
    onUpdateConfig({ shapes: updated });
  };

  // Preset quick click
  const applyPreset = (key: string) => {
    if (!onUpdateConfig) return;
    const preset = TWOD_PRESETS[key];
    if (preset) {
      onUpdateConfig({
        shapes: JSON.parse(JSON.stringify(preset.shapes)),
        backgroundColor: preset.backgroundColor,
        themePreset: key as any
      });
      setSelectedShapeId(null);
    }
  };

  // Export SVG to download
  const exportAsSvg = () => {
    if (!svgRef.current) return;
    try {
      const svgString = new XMLSerializer().serializeToString(svgRef.current);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `studio-2d-vector-${Date.now()}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (e) {
      console.error('Failed to export SVG', e);
    }
  };

  // Selected shape for edit panel
  const selectedShape = shapes.find((s) => s.id === selectedShapeId);

  // SVG Drawing Helpers
  const renderShapePath = (shape: TwoDShape, isGlowLayer = false) => {
    const size = shape.size;
    const sizeHalf = size / 2;

    switch (shape.type) {
      case 'rect':
        const w = shape.width || size;
        const h = shape.height || size;
        return (
          <rect
            x={shape.x - w / 2}
            y={shape.y - h / 2}
            width={w}
            height={h}
            rx={4}
            fill={isGlowLayer ? 'none' : shape.fill}
            stroke={isGlowLayer ? (shape.glowColor || shape.fill) : shape.stroke}
            strokeWidth={isGlowLayer ? (shape.strokeWidth + 6) : shape.strokeWidth}
            opacity={isGlowLayer ? 0.6 : shape.opacity}
            style={{ cursor: 'pointer' }}
            data-shape-id={shape.id}
          />
        );

      case 'circle':
        return (
          <circle
            cx={shape.x}
            cy={shape.y}
            r={sizeHalf}
            fill={isGlowLayer ? 'none' : shape.fill}
            stroke={isGlowLayer ? (shape.glowColor || shape.fill) : shape.stroke}
            strokeWidth={isGlowLayer ? (shape.strokeWidth + 6) : shape.strokeWidth}
            opacity={isGlowLayer ? 0.6 : shape.opacity}
            style={{ cursor: 'pointer' }}
            data-shape-id={shape.id}
          />
        );

      case 'triangle': {
        const p1 = `${shape.x},${shape.y - sizeHalf}`;
        const p2 = `${shape.x - sizeHalf},${shape.y + sizeHalf}`;
        const p3 = `${shape.x + sizeHalf},${shape.y + sizeHalf}`;
        return (
          <polygon
            points={`${p1} ${p2} ${p3}`}
            fill={isGlowLayer ? 'none' : shape.fill}
            stroke={isGlowLayer ? (shape.glowColor || shape.fill) : shape.stroke}
            strokeWidth={isGlowLayer ? (shape.strokeWidth + 6) : shape.strokeWidth}
            opacity={isGlowLayer ? 0.6 : shape.opacity}
            style={{ cursor: 'pointer' }}
            data-shape-id={shape.id}
          />
        );
      }

      case 'star': {
        // Standard 5-point star
        const points = [];
        const cx = shape.x;
        const cy = shape.y;
        const outerRadius = sizeHalf;
        const innerRadius = sizeHalf * 0.4;
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
          points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
        }
        return (
          <polygon
            points={points.join(' ')}
            fill={isGlowLayer ? 'none' : shape.fill}
            stroke={isGlowLayer ? (shape.glowColor || shape.fill) : shape.stroke}
            strokeWidth={isGlowLayer ? (shape.strokeWidth + 6) : shape.strokeWidth}
            opacity={isGlowLayer ? 0.6 : shape.opacity}
            style={{ cursor: 'pointer' }}
            data-shape-id={shape.id}
          />
        );
      }

      case 'heart': {
        // SVG Heart curve centered on shape.x, shape.y
        const sVal = size / 24; // Base multiplier for path scale
        const cx = shape.x;
        const cy = shape.y;
        const path = `M ${cx} ${cy + 8 * sVal} 
                      C ${cx - 12 * sVal} ${cy - 10 * sVal}, ${cx - 24 * sVal} ${cy + 2 * sVal}, ${cx} ${cy + 18 * sVal} 
                      C ${cx + 24 * sVal} ${cy + 2 * sVal}, ${cx + 12 * sVal} ${cy - 10 * sVal}, ${cx} ${cy + 8 * sVal} Z`;
        return (
          <path
            d={path}
            fill={isGlowLayer ? 'none' : shape.fill}
            stroke={isGlowLayer ? (shape.glowColor || shape.fill) : shape.stroke}
            strokeWidth={isGlowLayer ? (shape.strokeWidth + 6) : shape.strokeWidth}
            opacity={isGlowLayer ? 0.6 : shape.opacity}
            style={{ cursor: 'pointer' }}
            data-shape-id={shape.id}
          />
        );
      }

      case 'polygon': {
        // Hexagon points
        const points = [];
        const cx = shape.x;
        const cy = shape.y;
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI * 2 * i) / 6 - Math.PI / 6;
          points.push(`${cx + sizeHalf * Math.cos(angle)},${cy + sizeHalf * Math.sin(angle)}`);
        }
        return (
          <polygon
            points={points.join(' ')}
            fill={isGlowLayer ? 'none' : shape.fill}
            stroke={isGlowLayer ? (shape.glowColor || shape.fill) : shape.stroke}
            strokeWidth={isGlowLayer ? (shape.strokeWidth + 6) : shape.strokeWidth}
            opacity={isGlowLayer ? 0.6 : shape.opacity}
            style={{ cursor: 'pointer' }}
            data-shape-id={shape.id}
          />
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full gap-4 p-2 bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden">
      
      {/* 2D Active Vector Preview Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 bg-black/60 rounded-xl relative min-h-[360px] md:min-h-[440px]">
        
        {/* Dynamic HUD header */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-2 bg-slate-950/80 border border-white/10 px-2.5 py-1 rounded-full shadow-lg">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] text-slate-300 font-mono">
              Shapes: <strong>{shapes.length}</strong>
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-950/80 border border-white/10 p-1 rounded-full shadow-lg">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Pause animations' : 'Play animations'}
              className="p-1 rounded-full hover:bg-white/5 text-slate-300 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-indigo-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
            <button
              onClick={exportAsSvg}
              title="Exporter en SVG vectoriel"
              className="p-1 rounded-full hover:bg-white/5 text-slate-300 active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Vector SVG Canvas */}
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          className="w-full max-w-[400px] aspect-square rounded-lg shadow-2xl transition-all"
          style={{ 
            backgroundColor, 
            touchAction: 'none',
            backgroundImage: showGrid ? 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 0)' : 'none',
            backgroundSize: showGrid ? '8px 8px' : 'none'
          }}
          onMouseDown={handleSvgMouseDown}
          onMouseMove={handleSvgMouseMove}
          onMouseUp={handleSvgMouseUpOrLeave}
          onMouseLeave={handleSvgMouseUpOrLeave}
        >
          {/* Definitions for Glow Filter and patterns if needed */}
          <defs>
            <filter id="svg-neon-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Render individual shapes */}
          {shapes.map((shape) => {
            const isSel = selectedShapeId === shape.id;

            return (
              <g
                key={shape.id}
                id={`svg-shape-g-${shape.id}`}
                transform={`translate(0, 0)`}
                style={{ transition: draggedShapeId === shape.id ? 'none' : 'transform 0.05s ease-out' }}
              >
                {/* 1. Behind Glow Layer (Conditional) */}
                {shape.glow && (
                  <g id={`svg-shape-glow-${shape.id}`} filter="url(#svg-neon-glow)">
                    {renderShapePath(shape, true)}
                  </g>
                )}

                {/* 2. Primary Vector Graphic shape */}
                {renderShapePath(shape)}

                {/* 3. Selection visual ring helper */}
                {isSel && (
                  <circle
                    cx={shape.x}
                    cy={shape.y}
                    r={shape.size / 2 + 3}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth={0.8}
                    strokeDasharray="1.5, 1"
                    className="animate-[spin_20s_linear_infinite]"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Status bar */}
        <div className="absolute bottom-3 text-slate-500 text-[10px] flex items-center gap-1 font-mono">
          <Move className="w-3 h-3 text-slate-500" />
          <span>Glissez les formes pour réarranger l&apos;art vectoriel</span>
        </div>
      </div>

      {/* 2D Studio Graphic Toolbox & Designer Controls */}
      <div className="w-full lg:w-[320px] bg-slate-950/40 border border-white/5 rounded-xl p-3 flex flex-col gap-3">
        <div className="flex bg-black/60 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setSidebarTab('presets')}
            className={`flex-1 flex items-center justify-center gap-1 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
              sidebarTab === 'presets' ? 'bg-indigo-600/25 border border-indigo-500/30 text-indigo-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Presets</span>
          </button>
          <button
            onClick={() => setSidebarTab('shapes')}
            className={`flex-1 flex items-center justify-center gap-1 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
              sidebarTab === 'shapes' ? 'bg-indigo-600/25 border border-indigo-500/30 text-indigo-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter</span>
          </button>
          <button
            onClick={() => setSidebarTab('edit')}
            disabled={!selectedShapeId}
            className={`flex-1 flex items-center justify-center gap-1 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-30 ${
              sidebarTab === 'edit' ? 'bg-indigo-600/25 border border-indigo-500/30 text-indigo-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Éditer</span>
          </button>
        </div>

        {/* Tab 1: Presets 1-Click layouts */}
        {sidebarTab === 'presets' && (
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">🌟 Designs Thématiques Clé-en-main</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => applyPreset('retroGrid')}
                className={`flex flex-col items-start p-2 rounded-lg border text-left transition-all ${
                  themePreset === 'retroGrid' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-200' : 'bg-black/30 border-white/5 hover:border-white/10 text-slate-300'
                }`}
              >
                <span className="text-xs font-bold">📼 Retro Cyber</span>
                <span className="text-[9px] text-slate-400">Néons, grille violette & étoiles fluo</span>
              </button>

              <button
                onClick={() => applyPreset('bauhaus')}
                className={`flex flex-col items-start p-2 rounded-lg border text-left transition-all ${
                  themePreset === 'bauhaus' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-200' : 'bg-black/30 border-white/5 hover:border-white/10 text-slate-300'
                }`}
              >
                <span className="text-xs font-bold">📐 Bauhaus Kraft</span>
                <span className="text-[9px] text-slate-400">Formes asymétriques & tons brique</span>
              </button>

              <button
                onClick={() => applyPreset('synthwave')}
                className={`flex flex-col items-start p-2 rounded-lg border text-left transition-all ${
                  themePreset === 'synthwave' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-200' : 'bg-black/30 border-white/5 hover:border-white/10 text-slate-300'
                }`}
              >
                <span className="text-xs font-bold">🌅 Outrun Sunset</span>
                <span className="text-[9px] text-slate-400">Soleil rétro-futuriste chaud</span>
              </button>

              <button
                onClick={() => applyPreset('kawaii')}
                className={`flex flex-col items-start p-2 rounded-lg border text-left transition-all ${
                  themePreset === 'kawaii' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-200' : 'bg-black/30 border-white/5 hover:border-white/10 text-slate-300'
                }`}
              >
                <span className="text-xs font-bold">🌸 Kawaii Pastel</span>
                <span className="text-[9px] text-slate-400">Cœurs & étoiles chamallow mignons</span>
              </button>
            </div>

            {/* Canvas Global controls */}
            <div className="bg-black/30 p-2 rounded-lg border border-white/5 space-y-2 mt-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">🎛️ Espace de travail</span>
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-300">Grille de précision</span>
                <button
                  onClick={() => onUpdateConfig && onUpdateConfig({ showGrid: !showGrid })}
                  className={`text-[9px] px-2 py-0.5 rounded border transition-all ${
                    showGrid ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-black/40 border-white/10 text-slate-400'
                  }`}
                >
                  {showGrid ? 'Activée' : 'Désactivée'}
                </button>
              </div>

              <div>
                <label className="text-[10px] text-slate-300 block mb-1">Arrière-plan</label>
                <div className="flex gap-1">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => onUpdateConfig && onUpdateConfig({ backgroundColor: e.target.value })}
                    className="w-8 h-6 rounded border border-white/10 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => onUpdateConfig && onUpdateConfig({ backgroundColor: e.target.value })}
                    className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-0.5 text-xs text-mono text-white text-[10px]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Add Shapes */}
        {sidebarTab === 'shapes' && (
          <div className="space-y-3">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">📐 Choisissez un vecteur graphique</span>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addShape('rect')}
                className="flex items-center gap-2 p-2 bg-black/30 border border-white/5 rounded-lg hover:border-white/10 text-xs text-slate-200 transition-all active:scale-95"
              >
                <Square className="w-4 h-4 text-indigo-400" />
                <span>Carré / Rectangle</span>
              </button>

              <button
                onClick={() => addShape('circle')}
                className="flex items-center gap-2 p-2 bg-black/30 border border-white/5 rounded-lg hover:border-white/10 text-xs text-slate-200 transition-all active:scale-95"
              >
                <Circle className="w-4 h-4 text-emerald-400" />
                <span>Cercle parfait</span>
              </button>

              <button
                onClick={() => addShape('triangle')}
                className="flex items-center gap-2 p-2 bg-black/30 border border-white/5 rounded-lg hover:border-white/10 text-xs text-slate-200 transition-all active:scale-95"
              >
                <Triangle className="w-4 h-4 text-amber-400" />
                <span>Triangle équilatéral</span>
              </button>

              <button
                onClick={() => addShape('star')}
                className="flex items-center gap-2 p-2 bg-black/30 border border-white/5 rounded-lg hover:border-white/10 text-xs text-slate-200 transition-all active:scale-95"
              >
                <Star className="w-4 h-4 text-yellow-400" />
                <span>Étoile 5 Branches</span>
              </button>

              <button
                onClick={() => addShape('heart')}
                className="flex items-center gap-2 p-2 bg-black/30 border border-white/5 rounded-lg hover:border-white/10 text-xs text-slate-200 transition-all active:scale-95"
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Cœur Vectoriel</span>
              </button>

              <button
                onClick={() => addShape('polygon')}
                className="flex items-center gap-2 p-2 bg-black/30 border border-white/5 rounded-lg hover:border-white/10 text-xs text-slate-200 transition-all active:scale-95"
              >
                <Maximize2 className="w-4 h-4 text-cyan-400" />
                <span>Hexagone Régulier</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Edit selected Shape properties */}
        {sidebarTab === 'edit' && selectedShape && (
          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            <div className="flex items-center justify-between border-b border-white/5 pb-1.5 mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-1.5 py-0.5 rounded">
                  {selectedShape.type}
                </span>
                <span className="text-[9px] text-slate-500 font-mono">#{selectedShape.id.slice(-4)}</span>
              </div>
              <button
                onClick={() => deleteShape(selectedShape.id)}
                className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/20 active:scale-95 transition-all"
                title="Supprimer la forme"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Geometry settings */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Taille globale (Radius)</span>
                  <span>{selectedShape.size}px</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={selectedShape.size}
                  onChange={(e) => updateShapeProp('size', parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              {selectedShape.type === 'rect' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] text-slate-500 block">Largeur</span>
                    <input
                      type="number"
                      value={selectedShape.width || selectedShape.size}
                      onChange={(e) => updateShapeProp('width', parseInt(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block">Hauteur</span>
                    <input
                      type="number"
                      value={selectedShape.height || selectedShape.size}
                      onChange={(e) => updateShapeProp('height', parseInt(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[9px] text-slate-500 block">Position X (%)</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={selectedShape.x}
                    onChange={(e) => updateShapeProp('x', parseInt(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block">Position Y (%)</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={selectedShape.y}
                    onChange={(e) => updateShapeProp('y', parseInt(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Rotation</span>
                  <span>{selectedShape.rotation}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={selectedShape.rotation}
                  onChange={(e) => updateShapeProp('rotation', parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Opacité</span>
                  <span>{Math.round(selectedShape.opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={selectedShape.opacity}
                  onChange={(e) => updateShapeProp('opacity', parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>

            {/* Colors and Fills */}
            <div className="space-y-2 bg-black/30 p-2 rounded border border-white/5">
              <span className="text-[9px] text-slate-400 font-bold block uppercase">🎨 Remplissage & Contours</span>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-slate-500 block">Remplissage</label>
                  <div className="flex gap-1 items-center">
                    <input
                      type="color"
                      value={selectedShape.fill === 'none' ? '#000000' : selectedShape.fill}
                      onChange={(e) => updateShapeProp('fill', e.target.value)}
                      className="w-6 h-6 rounded border border-white/10 cursor-pointer bg-transparent"
                    />
                    <select
                      value={selectedShape.fill === 'none' ? 'none' : 'color'}
                      onChange={(e) => updateShapeProp('fill', e.target.value === 'none' ? 'none' : '#6366f1')}
                      className="flex-1 bg-black/40 border border-white/10 rounded text-[10px] py-0.5 px-1 text-white"
                    >
                      <option value="color">Couleur</option>
                      <option value="none">Aucun (Transparent)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] text-slate-500 block">Bordure</label>
                  <div className="flex gap-1 items-center">
                    <input
                      type="color"
                      value={selectedShape.stroke === 'transparent' ? '#ffffff' : selectedShape.stroke}
                      onChange={(e) => updateShapeProp('stroke', e.target.value)}
                      className="w-6 h-6 rounded border border-white/10 cursor-pointer bg-transparent"
                    />
                    <select
                      value={selectedShape.stroke === 'transparent' ? 'transparent' : 'color'}
                      onChange={(e) => updateShapeProp('stroke', e.target.value === 'transparent' ? 'transparent' : '#ffffff')}
                      className="flex-1 bg-black/40 border border-white/10 rounded text-[10px] py-0.5 px-1 text-white"
                    >
                      <option value="color">Couleur</option>
                      <option value="transparent">Aucun</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Épaisseur contour</span>
                  <span>{selectedShape.strokeWidth}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  step="0.5"
                  value={selectedShape.strokeWidth}
                  onChange={(e) => updateShapeProp('strokeWidth', parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
                <span className="text-[10px] text-slate-300">Effet Glow Néon</span>
                <button
                  onClick={() => updateShapeProp('glow', !selectedShape.glow)}
                  className={`text-[9px] px-2 py-0.5 rounded border transition-all ${
                    selectedShape.glow ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 animate-pulse' : 'bg-black/40 border-white/10 text-slate-400'
                  }`}
                >
                  {selectedShape.glow ? 'Activé' : 'Désactivé'}
                </button>
              </div>

              {selectedShape.glow && (
                <div>
                  <label className="text-[9px] text-slate-500 block">Couleur du Glow</label>
                  <div className="flex gap-1">
                    <input
                      type="color"
                      value={selectedShape.glowColor || selectedShape.fill}
                      onChange={(e) => updateShapeProp('glowColor', e.target.value)}
                      className="w-8 h-6 rounded border border-white/10 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={selectedShape.glowColor || selectedShape.fill}
                      onChange={(e) => updateShapeProp('glowColor', e.target.value)}
                      className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-0.5 text-[10px] text-mono text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Kinetic Animation logic */}
            <div className="space-y-2 bg-black/30 p-2 rounded border border-white/5">
              <span className="text-[9px] text-slate-400 font-bold block uppercase flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>🏃 Comportement Animé</span>
              </span>

              <div>
                <label className="text-[9px] text-slate-500 block mb-0.5">Mouvement dynamique</label>
                <select
                  value={selectedShape.animType || 'none'}
                  onChange={(e) => updateShapeProp('animType', e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded px-2.5 py-1 text-xs text-white"
                >
                  <option value="none">⏹️ Statique (Aucun)</option>
                  <option value="spin">🔄 Rotation (Spin 360°)</option>
                  <option value="float">🎈 Flottaison Douce (Oscillation)</option>
                  <option value="bounce">🏀 Rebond Physique</option>
                  <option value="pulse">✨ Respiration de Taille & Opacité</option>
                </select>
              </div>

              {selectedShape.animType && selectedShape.animType !== 'none' && (
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Vitesse cinétique</span>
                    <span>{selectedShape.animSpeed ?? 1.0}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={selectedShape.animSpeed ?? 1.0}
                    onChange={(e) => updateShapeProp('animSpeed', parseFloat(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
