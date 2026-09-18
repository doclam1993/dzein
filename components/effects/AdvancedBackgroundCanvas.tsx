'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

export type BackgroundEffectType = 'none' | 'animatedGrid' | 'auroraOrbs' | 'particles' | 'noiseGrain' | 'combinedAuroraGrid';

export interface BackgroundConfig {
  type: BackgroundEffectType;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  gridSpeed?: number;
  orbOpacity?: number;
  particleDensity?: number;
  grainOpacity?: number;
  enableMouseTracking?: boolean;
}

export const DEFAULT_BG_CONFIG: BackgroundConfig = {
  type: 'auroraOrbs',
  primaryColor: '#6366f1',
  secondaryColor: '#ec4899',
  accentColor: '#10b981',
  gridSpeed: 1,
  orbOpacity: 0.25,
  particleDensity: 40,
  grainOpacity: 0.04,
  enableMouseTracking: true
};

interface AdvancedBackgroundCanvasProps {
  config?: BackgroundConfig;
  className?: string;
}

export const AdvancedBackgroundCanvas: React.FC<AdvancedBackgroundCanvasProps> = ({
  config = DEFAULT_BG_CONFIG,
  className = ''
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mouse tracking listener for interactive aura / particles
  useEffect(() => {
    if (!config.enableMouseTracking) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [config.enableMouseTracking]);

  // Particle Canvas Renderer if particles or combined is active
  useEffect(() => {
    if (config.type !== 'particles' && config.type !== 'combinedAuroraGrid') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate Particles
    const count = config.particleDensity || 40;
    const particles = Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Draw node dot
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = config.primaryColor || '#6366f1';
        ctx.globalAlpha = p1.alpha;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = config.secondaryColor || '#ec4899';
            ctx.globalAlpha = (1 - dist / 130) * 0.25;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [config.type, config.primaryColor, config.secondaryColor, config.particleDensity]);

  const showGrid = config.type === 'animatedGrid' || config.type === 'combinedAuroraGrid';
  const showAurora = config.type === 'auroraOrbs' || config.type === 'combinedAuroraGrid';
  const showParticles = config.type === 'particles' || config.type === 'combinedAuroraGrid';
  const showGrain = config.type === 'noiseGrain' || config.type === 'combinedAuroraGrid' || (config.grainOpacity && config.grainOpacity > 0);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {/* 1. Animated Cyber Grid Background */}
      {showGrid && (
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"
            style={{
              maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)',
            }}
          />
          {/* Moving Scanline Gradient */}
          <motion.div
            animate={{ y: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 8 / (config.gridSpeed || 1), ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent h-1/3"
          />
        </div>
      )}

      {/* 2. Aurores Boréales (Interactive Glowing Gradient Orbs) */}
      {showAurora && (
        <div className="absolute inset-0">
          {/* Primary Orb - Follows mouse or floats */}
          <motion.div
            animate={{
              x: mousePos.x ? `${mousePos.x - 50}%` : ['-10%', '10%', '-10%'],
              y: mousePos.y ? `${mousePos.y - 50}%` : ['-10%', '15%', '-10%'],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              backgroundColor: config.primaryColor || '#6366f1',
              opacity: config.orbOpacity || 0.25,
            }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
          />

          {/* Secondary Orb */}
          <motion.div
            animate={{
              x: ['10%', '-15%', '10%'],
              y: ['15%', '-10%', '15%'],
              scale: [1.1, 0.9, 1.1],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              backgroundColor: config.secondaryColor || '#ec4899',
              opacity: (config.orbOpacity || 0.25) * 0.8,
            }}
            className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full blur-[130px] pointer-events-none"
          />

          {/* Accent Glow Orb */}
          <motion.div
            animate={{
              x: ['-20%', '20%', '-20%'],
              y: ['20%', '-20%', '20%'],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              backgroundColor: config.accentColor || '#10b981',
              opacity: (config.orbOpacity || 0.25) * 0.6,
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full blur-[140px] pointer-events-none"
          />
        </div>
      )}

      {/* 3. Particle Canvas Layer */}
      {showParticles && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80" />
      )}

      {/* 4. Film Grain Noise Texture Overlay */}
      {showGrain && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            opacity: config.grainOpacity || 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}
    </div>
  );
};
