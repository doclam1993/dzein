'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CanvasBlock, ViewportMode, ThreeDConfig, TwoDConfig, BlockType,
  SelectedElementInfo, ElementCategory, ElementCustomStyle
} from '@/types/builder';
import { ThreeDCanvasWidget } from './ThreeDCanvasWidget';
import { TwoDCanvasWidget } from './TwoDCanvasWidget';
import { 
  Boxes, GitBranch, Bot, Zap, ShieldCheck, Code2, 
  ArrowRight, Check, Sparkles, MoveUp, MoveDown, Copy, 
  Trash2, Plus, LayoutGrid, Palette, Orbit, X, Eye, 
  MousePointerClick, HelpCircle, GripVertical, Move, RotateCcw, Target,
  Monitor, Tablet, Smartphone, ZoomIn, ZoomOut, Maximize2,
  Type, Wand2, Loader2, CornerDownLeft, RefreshCw,
  Bold, Italic, AlignLeft, AlignCenter, AlignRight, Paintbrush, SlidersHorizontal
} from 'lucide-react';

export const applyStylePropsAnimation = (style: CanvasBlock['style'], initial: any, animate: any, interactiveState?: any) => {
  if (!style?.animStylePropsEnabled) return;

  // 1. Couleurs (Background, Text, Border)
  if (style.animBgColorStart && style.animBgColorEnd) {
    initial.backgroundColor = style.animBgColorStart;
    animate.backgroundColor = style.animBgColorEnd;
    if (interactiveState) interactiveState.backgroundColor = style.animBgColorEnd;
  }
  if (style.animTextColorStart && style.animTextColorEnd) {
    initial.color = style.animTextColorStart;
    animate.color = style.animTextColorEnd;
    if (interactiveState) interactiveState.color = style.animTextColorEnd;
  }
  if (style.animBorderColorStart && style.animBorderColorEnd) {
    initial.borderColor = style.animBorderColorStart;
    animate.borderColor = style.animBorderColorEnd;
    if (interactiveState) interactiveState.borderColor = style.animBorderColorEnd;
  }

  // 2. Bordures, Rayons & Contours (Border, Radius & Outline)
  if (style.animBorderRadiusStart !== undefined && style.animBorderRadiusEnd !== undefined) {
    initial.borderRadius = `${style.animBorderRadiusStart}px`;
    animate.borderRadius = `${style.animBorderRadiusEnd}px`;
    if (interactiveState) interactiveState.borderRadius = `${style.animBorderRadiusEnd}px`;
  }
  if (style.animBorderWidthStart !== undefined && style.animBorderWidthEnd !== undefined) {
    initial.borderWidth = `${style.animBorderWidthStart}px`;
    animate.borderWidth = `${style.animBorderWidthEnd}px`;
    if (interactiveState) interactiveState.borderWidth = `${style.animBorderWidthEnd}px`;
  }
  if (style.animOutlineColorStart || style.animOutlineColorEnd || style.animOutlineWidthStart !== undefined || style.animOutlineWidthEnd !== undefined) {
    const oColorStart = style.animOutlineColorStart || 'transparent';
    const oColorEnd = style.animOutlineColorEnd || 'currentColor';
    const oWidthStart = style.animOutlineWidthStart ?? 0;
    const oWidthEnd = style.animOutlineWidthEnd ?? 2;
    const oOffsetStart = style.animOutlineOffsetStart ?? 0;
    const oOffsetEnd = style.animOutlineOffsetEnd ?? 0;
    initial.outline = `${oWidthStart}px solid ${oColorStart}`;
    initial.outlineOffset = `${oOffsetStart}px`;
    animate.outline = `${oWidthEnd}px solid ${oColorEnd}`;
    animate.outlineOffset = `${oOffsetEnd}px`;
    if (interactiveState) {
      interactiveState.outline = `${oWidthEnd}px solid ${oColorEnd}`;
      interactiveState.outlineOffset = `${oOffsetEnd}px`;
    }
  }

  // 3. Ombres, Halos & Glow (Box Shadow & Text Shadow)
  if (style.animBoxShadowStart || style.animBoxShadowEnd) {
    if (style.animBoxShadowStart) initial.boxShadow = style.animBoxShadowStart;
    if (style.animBoxShadowEnd) {
      animate.boxShadow = style.animBoxShadowEnd;
      if (interactiveState) interactiveState.boxShadow = style.animBoxShadowEnd;
    }
  }
  if (style.animTextShadowStart || style.animTextShadowEnd) {
    if (style.animTextShadowStart) initial.textShadow = style.animTextShadowStart;
    if (style.animTextShadowEnd) {
      animate.textShadow = style.animTextShadowEnd;
      if (interactiveState) interactiveState.textShadow = style.animTextShadowEnd;
    }
  }

  // 4. Verre & Translucidité (Backdrop Filter / Glassmorphism)
  if (style.animBackdropBlurStart !== undefined || style.animBackdropBlurEnd !== undefined) {
    initial.backdropFilter = `blur(${style.animBackdropBlurStart ?? 0}px)`;
    animate.backdropFilter = `blur(${style.animBackdropBlurEnd ?? 16}px)`;
    if (interactiveState) interactiveState.backdropFilter = `blur(${style.animBackdropBlurEnd ?? 16}px)`;
  }

  // 5. Filtres Graphiques & FX (Visual Filters: Blur, Brightness, Contrast, Saturate, Hue, Grayscale, Invert, Sepia)
  const filtersStart: string[] = [];
  const filtersEnd: string[] = [];
  if (style.animFilterBlurStart !== undefined || style.animFilterBlurEnd !== undefined) {
    filtersStart.push(`blur(${style.animFilterBlurStart ?? 0}px)`);
    filtersEnd.push(`blur(${style.animFilterBlurEnd ?? 0}px)`);
  }
  if (style.animFilterBrightness !== undefined) {
    filtersStart.push('brightness(1)');
    filtersEnd.push(`brightness(${style.animFilterBrightness})`);
  }
  if (style.animFilterContrast !== undefined) {
    filtersStart.push('contrast(1)');
    filtersEnd.push(`contrast(${style.animFilterContrast})`);
  }
  if (style.animFilterSaturate !== undefined) {
    filtersStart.push('saturate(1)');
    filtersEnd.push(`saturate(${style.animFilterSaturate})`);
  }
  if (style.animFilterHueRotate !== undefined) {
    filtersStart.push('hue-rotate(0deg)');
    filtersEnd.push(`hue-rotate(${style.animFilterHueRotate}deg)`);
  }
  if (style.animFilterGrayscale !== undefined) {
    filtersStart.push('grayscale(0%)');
    filtersEnd.push(`grayscale(${style.animFilterGrayscale}%)`);
  }
  if (style.animFilterInvertStart !== undefined || style.animFilterInvertEnd !== undefined) {
    filtersStart.push(`invert(${style.animFilterInvertStart ?? 0}%)`);
    filtersEnd.push(`invert(${style.animFilterInvertEnd ?? 100}%)`);
  }
  if (style.animFilterSepiaStart !== undefined || style.animFilterSepiaEnd !== undefined) {
    filtersStart.push(`sepia(${style.animFilterSepiaStart ?? 0}%)`);
    filtersEnd.push(`sepia(${style.animFilterSepiaEnd ?? 100}%)`);
  }
  if (filtersStart.length > 0 || filtersEnd.length > 0) {
    const s = filtersStart.join(' ');
    const e = filtersEnd.join(' ');
    if (s) initial.filter = initial.filter && initial.filter !== 'blur(0px)' ? `${initial.filter} ${s}` : s;
    if (e) {
      animate.filter = animate.filter && animate.filter !== 'blur(0px)' ? `${animate.filter} ${e}` : e;
      if (interactiveState) interactiveState.filter = interactiveState.filter && interactiveState.filter !== 'blur(0px)' ? `${interactiveState.filter} ${e}` : e;
    }
  }

  // 6. Typographie & Texte (Font Size, Font Weight, Line Height, Tracking)
  if (style.animFontSizeStart !== undefined && style.animFontSizeEnd !== undefined) {
    initial.fontSize = `${style.animFontSizeStart}px`;
    animate.fontSize = `${style.animFontSizeEnd}px`;
    if (interactiveState) interactiveState.fontSize = `${style.animFontSizeEnd}px`;
  }
  if (style.animFontWeightStart !== undefined && style.animFontWeightEnd !== undefined) {
    initial.fontWeight = style.animFontWeightStart;
    animate.fontWeight = style.animFontWeightEnd;
    if (interactiveState) interactiveState.fontWeight = style.animFontWeightEnd;
  }
  if (style.animLineHeightStart !== undefined && style.animLineHeightEnd !== undefined) {
    initial.lineHeight = style.animLineHeightStart;
    animate.lineHeight = style.animLineHeightEnd;
    if (interactiveState) interactiveState.lineHeight = style.animLineHeightEnd;
  }
  if (style.animLetterSpacingStart !== undefined && style.animLetterSpacingEnd !== undefined) {
    initial.letterSpacing = `${style.animLetterSpacingStart}px`;
    animate.letterSpacing = `${style.animLetterSpacingEnd}px`;
    if (interactiveState) interactiveState.letterSpacing = `${style.animLetterSpacingEnd}px`;
  }

  // 7. Espacement, Dimensions & Opacité (Padding, Margin, Gap, Width, Height, Opacity)
  if (style.animPaddingStart !== undefined && style.animPaddingEnd !== undefined) {
    initial.padding = `${style.animPaddingStart}px`;
    animate.padding = `${style.animPaddingEnd}px`;
    if (interactiveState) interactiveState.padding = `${style.animPaddingEnd}px`;
  }
  if (style.animMarginStart !== undefined && style.animMarginEnd !== undefined) {
    initial.margin = `${style.animMarginStart}px`;
    animate.margin = `${style.animMarginEnd}px`;
    if (interactiveState) interactiveState.margin = `${style.animMarginEnd}px`;
  }
  if (style.animGapStart !== undefined && style.animGapEnd !== undefined) {
    initial.gap = `${style.animGapStart}px`;
    animate.gap = `${style.animGapEnd}px`;
    if (interactiveState) interactiveState.gap = `${style.animGapEnd}px`;
  }
  if (style.animWidthStart !== undefined && style.animWidthEnd !== undefined) {
    initial.width = `${style.animWidthStart}px`;
    animate.width = `${style.animWidthEnd}px`;
    if (interactiveState) interactiveState.width = `${style.animWidthEnd}px`;
  }
  if (style.animHeightStart !== undefined && style.animHeightEnd !== undefined) {
    initial.height = `${style.animHeightStart}px`;
    animate.height = `${style.animHeightEnd}px`;
    if (interactiveState) interactiveState.height = `${style.animHeightEnd}px`;
  }
  if (style.animOpacityStart !== undefined && style.animOpacityEnd !== undefined) {
    initial.opacity = style.animOpacityStart;
    animate.opacity = style.animOpacityEnd;
    if (interactiveState) interactiveState.opacity = style.animOpacityEnd;
  }
};

export const resolveFramerAnimation = (block: CanvasBlock, targetType: string, isInterHoverActive?: boolean) => {
  const style = block.style || {};
  
  // Style properties matching check
  const styleTarget = style.animStyleTarget || 'block';
  const isStyleMatched = !!style.animStylePropsEnabled && (
    styleTarget === targetType ||
    (styleTarget === 'cta' && (targetType === 'primaryCta' || targetType === 'secondaryCta')) ||
    (targetType === 'cta' && (styleTarget === 'primaryCta' || styleTarget === 'secondaryCta'))
  );

  // 1. Orchestre d'Animation Avancé (Total Freedom & Pro Level)
  const advTarget = style.advancedAnimTarget || 'block';
  const isAdvMatched = style.advancedAnimEnabled && (
    advTarget === targetType ||
    (advTarget === 'cta' && (targetType === 'primaryCta' || targetType === 'secondaryCta')) ||
    (targetType === 'cta' && (advTarget === 'primaryCta' || advTarget === 'secondaryCta'))
  );

  if (isAdvMatched) {
    const isSpring = style.advancedAnimType === 'spring';
    const isKeyframes = style.advancedAnimType === 'keyframes';
    
    // Parse custom bezier if specified
    let easeVal: any = undefined;
    if (style.advancedAnimCubicBezier) {
      const parts = style.advancedAnimCubicBezier.split(',').map(n => parseFloat(n.trim()));
      if (parts.length === 4 && parts.every(n => !isNaN(n))) {
        easeVal = parts;
      }
    }

    const transition: any = {
      type: isSpring ? 'spring' : 'tween',
      stiffness: style.advancedAnimStiffness ?? 100,
      damping: style.advancedAnimDamping ?? 10,
      mass: style.advancedAnimMass ?? 1,
      velocity: style.advancedAnimVelocity ?? 0,
      duration: style.animationDuration ?? 0.6,
      delay: style.animationDelay ?? 0,
      staggerChildren: style.advancedAnimStagger ?? 0,
      ease: !isSpring && easeVal ? easeVal : undefined,
    };
    
    const initial: any = {
      x: style.advancedAnimTranslateX ?? 0,
      y: style.advancedAnimTranslateY ?? 0,
      z: style.advancedAnimTranslateZ ?? 0,
      scale: style.advancedAnimScale ?? 1,
      rotate: style.advancedAnimRotate ?? 0,
      rotateX: style.advancedAnimRotateX ?? 0,
      rotateY: style.advancedAnimRotateY ?? 0,
      skewX: style.advancedAnimSkewX ?? 0,
      opacity: style.advancedAnimOpacity ?? 1,
      filter: (style.advancedAnimBlur && style.advancedAnimBlur > 0) ? `blur(${style.advancedAnimBlur}px)` : 'blur(0px)',
    };

    let animate: any = {
      x: 0,
      y: 0,
      z: 0,
      scale: 1,
      rotate: 0,
      rotateX: 0,
      rotateY: 0,
      skewX: 0,
      opacity: 1,
      filter: 'blur(0px)',
    };

    // Keyframes Studio Presets
    if (isKeyframes && style.animationKeyframesMode && style.animationKeyframesMode !== 'none') {
      switch (style.animationKeyframesMode) {
        case 'heartbeat':
          animate.scale = [1, 1.15, 0.95, 1.2, 1];
          transition.repeat = Infinity;
          transition.duration = 1.2;
          break;
        case 'cinematicZoom':
          animate.scale = [0.9, 1.05, 1];
          animate.opacity = [0, 0.8, 1];
          transition.duration = 1.4;
          break;
        case 'rubberBand':
          animate.scale = [1, 1.25, 0.75, 1.15, 0.95, 1];
          transition.duration = 0.9;
          break;
        case 'jello':
          animate.skewX = [0, -12, 10, -6, 3, 0];
          transition.duration = 1;
          break;
        case 'glitch':
          animate.x = [0, -4, 4, -2, 3, 0];
          animate.filter = ['blur(0px)', 'blur(2px)', 'blur(0px)'];
          transition.repeat = Infinity;
          transition.repeatDelay = 2;
          transition.duration = 0.4;
          break;
        case 'magneticFloat':
          animate.y = [0, -10, 2, -6, 0];
          animate.rotate = [0, 2, -2, 1, 0];
          transition.repeat = Infinity;
          transition.repeatType = 'reverse';
          transition.duration = 3;
          break;
      }
    }

    // Apply animatable style properties if matched
    if (isStyleMatched) {
      applyStylePropsAnimation(style, initial, animate);
    }

    const trigger = style.animationTrigger || 'load';
    
    if (trigger === 'scroll') {
      return {
        initial,
        whileInView: animate,
        viewport: { once: true, margin: "-80px" },
        transition
      };
    } else if (trigger === 'hover') {
      return {
        initial: animate,
        whileHover: initial,
        transition
      };
    } else if (trigger === 'click') {
      return {
        initial: animate,
        whileTap: initial,
        transition
      };
    }

    return {
      initial,
      animate,
      transition
    };
  }

  // 2. Cross-element interactive hover trigger handling
  const hoverTarget = style.hoverTriggerTarget || 'none';
  const isHoverMatched = style.hoverTriggerSource && style.hoverTriggerSource !== 'none' && (
    hoverTarget === targetType ||
    (hoverTarget === 'cta' && (targetType === 'primaryCta' || targetType === 'secondaryCta')) ||
    (targetType === 'cta' && (hoverTarget === 'primaryCta' || hoverTarget === 'secondaryCta'))
  );

  if (isHoverMatched) {
    const action = style.hoverTriggerAction || 'fade';
    const easing = style.hoverTriggerEasing || 'easeInOut';
    const duration = style.hoverTriggerDuration ?? 0.5;

    // Easing configuration
    let easeConfig: any = "easeInOut";
    let typeConfig: string | undefined = undefined;
    let stiffness = 100;
    let damping = 15;

    switch (easing) {
      case 'linear': easeConfig = "linear"; break;
      case 'easeIn': easeConfig = "easeIn"; break;
      case 'easeOut': easeConfig = "easeOut"; break;
      case 'easeInOut': easeConfig = "easeInOut"; break;
      case 'spring': typeConfig = "spring"; stiffness = 130; damping = 12; break;
      case 'bounce': typeConfig = "spring"; stiffness = 160; damping = 8; break;
    }

    const hoverTransition: any = {
      duration,
      ease: typeConfig ? undefined : easeConfig,
      type: typeConfig,
      stiffness,
      damping
    };

    let initial: any = {};
    let animate: any = {};

    switch (action) {
      case 'fade':
        initial = { opacity: 0.7 };
        animate = isInterHoverActive ? { opacity: 1 } : { opacity: 0.7 };
        break;
      case 'slide':
        initial = { y: 0 };
        animate = isInterHoverActive ? { y: -15 } : { y: 0 };
        break;
      case 'zoom':
        initial = { scale: 1 };
        animate = isInterHoverActive ? { scale: 1.12 } : { scale: 1 };
        break;
      case 'rotate':
        initial = { rotate: 0 };
        animate = isInterHoverActive ? { rotate: 6 } : { rotate: 0 };
        break;
      case 'shake':
        initial = { x: 0 };
        animate = isInterHoverActive ? { x: [-6, 6, -6, 6, 0] } : { x: 0 };
        break;
      case 'float':
        initial = { y: 0 };
        animate = isInterHoverActive ? { y: [0, -8, 0] } : { y: 0 };
        if (isInterHoverActive) {
          hoverTransition.repeat = Infinity;
          hoverTransition.repeatType = "reverse";
        }
        break;
      case 'glow':
        initial = { boxShadow: "0px 0px 0px rgba(0,0,0,0)" };
        animate = isInterHoverActive ? { boxShadow: "0 12px 28px rgba(168, 85, 247, 0.45)" } : { boxShadow: "0px 0px 0px rgba(0,0,0,0)" };
        break;
      case 'liftShadow':
        initial = { y: 0, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" };
        animate = isInterHoverActive ? { y: -8, boxShadow: "0 20px 30px rgba(0,0,0,0.35)" } : { y: 0, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" };
        break;
      case 'tilt3D':
        initial = { rotateX: 0, rotateY: 0, scale: 1 };
        animate = isInterHoverActive ? { rotateX: 10, rotateY: -10, scale: 1.05 } : { rotateX: 0, rotateY: 0, scale: 1 };
        break;
      case 'colorShift':
        initial = { filter: "hue-rotate(0deg)" };
        animate = isInterHoverActive ? { filter: "hue-rotate(60deg) brightness(1.1)" } : { filter: "hue-rotate(0deg)" };
        break;
    }

    return {
      initial,
      animate,
      transition: hoverTransition
    };
  }

  const currentTrigger = style.animationTrigger || 'load';
  const currentTarget = style.animationTarget || 'block';
  const currentAction = style.animationAction || 'fade';
  const currentEasing = style.animationEasing || 'easeInOut';
  const currentLoopType = style.animationLoopType || 'none';
  const duration = style.animationDuration ?? 0.6;
  const delay = style.animationDelay ?? 0;

  // Fallback to older properties for compatibility
  const oldEntrance = style.animationEntrance;

  // If we are applying block-level animation but the target is set to something specific inside the block,
  // we should only apply standard subtle entrance to the block container so it doesn't stay hidden.
  const isTargetMatched = (
    currentTarget === targetType ||
    (currentTarget === 'cta' && (targetType === 'primaryCta' || targetType === 'secondaryCta')) ||
    (targetType === 'cta' && (currentTarget === 'primaryCta' || currentTarget === 'secondaryCta')) ||
    isStyleMatched
  );

  if (!isTargetMatched) {
    if (targetType === 'block') {
      let entranceInitial: any = { opacity: 0 };
      let entranceAnimate: any = { opacity: 1 };
      let entranceTransition: any = { duration: 0.5, delay: 0.1 };

      if (oldEntrance && oldEntrance !== 'none') {
        switch (oldEntrance) {
          case 'fade':
            entranceInitial = { opacity: 0 };
            entranceAnimate = { opacity: 1 };
            break;
          case 'slideUp':
            entranceInitial = { opacity: 0, y: 30 };
            entranceAnimate = { opacity: 1, y: 0 };
            break;
          case 'zoom':
            entranceInitial = { opacity: 0, scale: 0.95 };
            entranceAnimate = { opacity: 1, scale: 1 };
            break;
        }
      }
      return {
        initial: entranceInitial,
        animate: entranceAnimate,
        transition: entranceTransition
      };
    }
    return {};
  }

  // 1. Build Easing & Physics configuration
  let easeConfig: any = "easeInOut";
  let typeConfig: string | undefined = undefined;
  let stiffness = 100;
  let damping = 15;

  switch (currentEasing) {
    case 'linear':
      easeConfig = "linear";
      break;
    case 'easeIn':
      easeConfig = "easeIn";
      break;
    case 'easeOut':
      easeConfig = "easeOut";
      break;
    case 'easeInOut':
      easeConfig = "easeInOut";
      break;
    case 'spring':
      typeConfig = "spring";
      stiffness = 120;
      damping = 12;
      break;
    case 'bounce':
      typeConfig = "spring";
      stiffness = 160;
      damping = 8;
      break;
    case 'anticipate':
      easeConfig = "anticipate";
      break;
    case 'cubicBezier':
      easeConfig = [0.16, 1, 0.3, 1]; // Apple-grade smooth deceleration
      break;
  }

  const transition: any = {
    duration,
    delay,
    ease: typeConfig ? undefined : easeConfig,
    type: typeConfig,
    stiffness,
    damping
  };

  // 2. Build Action variants (Initial & Animate states)
  let initial: any = {};
  let animate: any = {};
  let whileHover: any = undefined;
  let whileTap: any = undefined;

  switch (currentAction) {
    case 'fade':
      initial = { opacity: 0 };
      animate = { opacity: 1 };
      break;
    case 'slide':
      initial = { opacity: 0, y: 40 };
      animate = { opacity: 1, y: 0 };
      break;
    case 'zoom':
      initial = { opacity: 0, scale: 0.85 };
      animate = { opacity: 1, scale: 1 };
      break;
    case 'rotate':
      initial = { opacity: 0, rotate: -8, scale: 0.9 };
      animate = { opacity: 1, rotate: 0, scale: 1 };
      break;
    case 'shake':
      initial = { x: 0 };
      animate = {
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.5, delay }
      };
      break;
    case 'float':
      initial = { y: 0 };
      animate = { y: [0, -8, 0] };
      transition.repeat = Infinity;
      transition.repeatType = "reverse";
      break;
    case 'flip':
      initial = { opacity: 0, rotateX: 90 };
      animate = { opacity: 1, rotateX: 0 };
      break;
    case 'blurIn':
      initial = { opacity: 0, filter: 'blur(12px)', scale: 0.95 };
      animate = { opacity: 1, filter: 'blur(0px)', scale: 1 };
      break;
    case 'pop':
      initial = { opacity: 0, scale: 0.5 };
      animate = { opacity: 1, scale: [0.5, 1.08, 1] };
      break;
    case 'swing':
      initial = { opacity: 0, rotate: 15 };
      animate = { opacity: 1, rotate: [15, -10, 5, -2, 0] };
      break;
    case 'revealMask':
      initial = { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' };
      animate = { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' };
      break;
  }

  // 2.5 Apply animatable style properties for load/scroll before trigger overrides
  if (isStyleMatched && (currentTrigger === 'load' || currentTrigger === 'scroll')) {
    applyStylePropsAnimation(style, initial, animate);
  }

  // 3. Handle Triggers (load, click, hover, scroll)
  if (currentTrigger === 'hover') {
    initial = {};
    animate = {};
    whileHover = {};
    
    switch (currentAction) {
      case 'fade':
        whileHover = { opacity: [0.8, 1] };
        break;
      case 'slide':
        whileHover = { y: -12 };
        break;
      case 'zoom':
        whileHover = { scale: 1.06 };
        break;
      case 'rotate':
        whileHover = { rotate: 4, scale: 1.02 };
        break;
      case 'shake':
        whileHover = { x: [-3, 3, -3, 3, 0], transition: { duration: 0.4 } };
        break;
      case 'float':
        whileHover = { 
          y: [0, -12, 0],
          transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
        };
        break;
      case 'flip':
        whileHover = { rotateY: 180, transition: { duration: 0.6 } };
        break;
      case 'blurIn':
        whileHover = { filter: 'drop-shadow(0 0 16px rgba(147, 51, 234, 0.5))' };
        break;
      case 'pop':
        whileHover = { scale: 1.1 };
        break;
      case 'swing':
        whileHover = { rotate: [-5, 5, -3, 3, 0], transition: { duration: 0.5 } };
        break;
      case 'revealMask':
        whileHover = { scale: 1.03 };
        break;
    }

    if (isStyleMatched) {
      applyStylePropsAnimation(style, initial, animate, whileHover);
    }
  } else if (currentTrigger === 'click') {
    initial = {};
    animate = {};
    whileTap = {};
    
    switch (currentAction) {
      case 'zoom':
        whileTap = { scale: 0.92 };
        break;
      case 'rotate':
        whileTap = { rotate: -15, scale: 0.95 };
        break;
      case 'shake':
        whileTap = { x: [-10, 10, -10, 10, 0] };
        break;
      case 'slide':
        whileTap = { y: 10 };
        break;
      default:
        whileTap = { scale: 0.95 };
        break;
    }

    if (isStyleMatched) {
      applyStylePropsAnimation(style, initial, animate, whileTap);
    }
  } else if (currentTrigger === 'scroll') {
    return {
      initial,
      whileInView: animate,
      viewport: { once: true, margin: "-100px" },
      transition,
      whileHover,
      whileTap
    };
  }

  // 4. Handle Loops (if trigger is On Load / scroll and we have a loop type)
  if ((currentTrigger === 'load' || currentTrigger === 'scroll') && currentLoopType !== 'none') {
    let loopTransition: any = {
      repeat: Infinity,
      ease: "easeInOut",
      duration: 2
    };

    switch (currentLoopType) {
      case 'yoyo':
        animate = {
          ...animate,
          y: [0, -12, 0]
        };
        break;
      case 'loop':
        animate = {
          ...animate,
          x: [0, 8, 0]
        };
        break;
      case 'pulse':
        animate = {
          ...animate,
          scale: [1, 1.04, 1]
        };
        break;
      case 'spin':
        animate = {
          ...animate,
          rotate: 360
        };
        loopTransition.ease = "linear";
        loopTransition.duration = 8;
        break;
      case 'breathe':
        animate = {
          ...animate,
          scale: [1, 1.03, 1],
          opacity: [1, 0.85, 1]
        };
        loopTransition.duration = 3.5;
        break;
      case 'neonGlow':
        animate = {
          ...animate,
          filter: [
            'drop-shadow(0 0 4px rgba(168, 85, 247, 0.4))',
            'drop-shadow(0 0 16px rgba(168, 85, 247, 0.85))',
            'drop-shadow(0 0 4px rgba(168, 85, 247, 0.4))'
          ]
        };
        loopTransition.duration = 2.2;
        break;
      case 'floatDrift':
        animate = {
          ...animate,
          y: [0, -10, 0],
          x: [0, 4, 0],
          rotate: [0, 1.5, 0]
        };
        loopTransition.duration = 4;
        break;
    }

    return {
      initial,
      animate,
      whileHover,
      whileTap,
      transition: {
        ...transition,
        ...loopTransition
      }
    };
  }

  return { initial, animate, whileHover, whileTap, transition };
};

interface BuilderCanvasProps {
  blocks: CanvasBlock[];
  selectedBlockId: string | null;
  selectedElement?: SelectedElementInfo | null;
  onSelectBlock: (id: string | null) => void;
  onSelectElement?: (elem: SelectedElementInfo | null) => void;
  onUpdateBlock: (updated: CanvasBlock) => void;
  onDeleteBlock: (id: string) => void;
  onDuplicateBlock: (id: string) => void;
  onMoveBlock: (id: string, direction: 'up' | 'down') => void;
  onReorderBlocks?: (sourceIndex: number, targetIndex: number) => void;
  onAddBlock: (type: BlockType, afterIndex?: number) => void;
  viewportMode: ViewportMode;
  onViewportChange?: (mode: ViewportMode) => void;
  zoomLevel: number;
  onZoomChange?: (zoom: number) => void;
  isPreviewMode: boolean;
  onTogglePreviewMode?: () => void;
  isFreeformMode?: boolean;
  onToggleFreeformMode?: () => void;
  themeAccent: string;
}

// Inline WYSIWYG Text Editor Component for direct on-canvas double-click editing
const InlineText: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  multiline?: boolean;
  label?: string;
}> = ({ value, onChange, placeholder = 'Tapez votre texte...', className = '', disabled = false, multiline = false, label }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const contentRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  const prevValueRef = useRef(value);

  // Sync DOM content whenever external value changes
  useEffect(() => {
    if (contentRef.current && contentRef.current.textContent !== value && !isEditing) {
      contentRef.current.textContent = value;
    }
    prevValueRef.current = value;
  }, [value, isEditing]);

  // When entering editing mode, focus and select text
  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
      try {
        const range = document.createRange();
        range.selectNodeContents(contentRef.current);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      } catch {
        // Fallback focus
      }
    }
  }, [isEditing]);

  const commitChange = (newValue?: string) => {
    const textToSave = (newValue !== undefined ? newValue : (contentRef.current?.textContent ?? draft)).trim();
    setIsEditing(false);
    setShowAiMenu(false);
    if (textToSave !== value && textToSave.length > 0) {
      onChange(textToSave);
    } else if (textToSave.length === 0 && placeholder) {
      onChange(placeholder);
    }
  };

  const cancelChange = () => {
    setIsEditing(false);
    setShowAiMenu(false);
    setDraft(value);
    if (contentRef.current) {
      contentRef.current.textContent = value;
    }
  };

  const handleCaseTransform = (type: 'upper' | 'lower' | 'title') => {
    const current = contentRef.current?.textContent || draft;
    let res = current;
    if (type === 'upper') res = current.toUpperCase();
    else if (type === 'lower') res = current.toLowerCase();
    else if (type === 'title') {
      res = current.replace(/\b\w/g, (l) => l.toUpperCase());
    }
    setDraft(res);
    if (contentRef.current) contentRef.current.textContent = res;
  };

  const handleAiTransform = async (action: string) => {
    const current = contentRef.current?.textContent || draft;
    if (!current) return;
    setIsAiLoading(true);
    setShowAiMenu(false);
    try {
      const res = await fetch('/api/ai/text-transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: current,
          action,
          context: label || 'Website Text',
        }),
      });
      const data = await res.json();
      if (data.result) {
        setDraft(data.result);
        if (contentRef.current) {
          contentRef.current.textContent = data.result;
        }
      }
    } catch (err) {
      console.error('AI Text transform failed:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  if (disabled) {
    return <span className={className}>{value || placeholder}</span>;
  }

  return (
    <span
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (!isEditing) setShowAiMenu(false);
      }}
      className={`relative inline-block align-baseline transition-all duration-150 ${className}`}
    >
      {/* Floating Hover Badge when not editing */}
      {isHovered && !isEditing && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 z-40 px-2 py-0.5 rounded-md bg-[#080d1a]/95 text-[10px] text-cyan-300 font-sans font-medium whitespace-nowrap shadow-xl border border-cyan-500/30 backdrop-blur-md pointer-events-none flex items-center gap-1 animate-in fade-in duration-100">
          <Type className="w-2.5 h-2.5 text-cyan-400" />
          <span>Double-clic pour éditer</span>
        </span>
      )}

      {/* Floating WYSIWYG Quick Toolbar when editing */}
      {isEditing && (
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.preventDefault()}
          className="absolute -top-11 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-1 rounded-xl bg-[#080d1a]/95 border border-indigo-500/40 shadow-2xl backdrop-blur-2xl text-white text-xs animate-in fade-in zoom-in-95 duration-150 select-none whitespace-nowrap"
        >
          {/* AI Quick Rewriter Button */}
          <div className="relative">
            <button
              onClick={() => setShowAiMenu(!showAiMenu)}
              title="Assistant IA Réécriture"
              disabled={isAiLoading}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-300 border border-indigo-400/30 text-[11px] font-medium transition-colors"
            >
              {isAiLoading ? (
                <Loader2 className="w-3 h-3 animate-spin text-indigo-300" />
              ) : (
                <Wand2 className="w-3 h-3 text-indigo-400" />
              )}
              <span>IA</span>
            </button>

            {/* AI Action Popover */}
            {showAiMenu && (
              <div className="absolute top-8 left-0 z-50 w-48 p-1 rounded-xl bg-[#090e1d]/98 border border-white/15 shadow-2xl backdrop-blur-2xl text-xs flex flex-col gap-0.5 animate-in fade-in duration-150">
                <button
                  onClick={() => handleAiTransform('punchy')}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-indigo-500/20 text-slate-200 hover:text-white text-left text-[11px] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Plus percutant</span>
                </button>
                <button
                  onClick={() => handleAiTransform('shorten')}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-indigo-500/20 text-slate-200 hover:text-white text-left text-[11px] transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Raccourcir (Concis)</span>
                </button>
                <button
                  onClick={() => handleAiTransform('professional')}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-indigo-500/20 text-slate-200 hover:text-white text-left text-[11px] transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Ton Pro B2B</span>
                </button>
                <div className="h-[1px] bg-white/10 my-0.5" />
                <button
                  onClick={() => handleAiTransform('translate_en')}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-indigo-500/20 text-slate-200 hover:text-white text-left text-[11px] transition-colors"
                >
                  <span>🇬🇧</span>
                  <span>Traduire en Anglais</span>
                </button>
                <button
                  onClick={() => handleAiTransform('translate_fr')}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-indigo-500/20 text-slate-200 hover:text-white text-left text-[11px] transition-colors"
                >
                  <span>🇫🇷</span>
                  <span>Traduire en Français</span>
                </button>
              </div>
            )}
          </div>

          <div className="h-3.5 w-[1px] bg-white/10 mx-0.5" />

          {/* Quick Case Transforms */}
          <button
            onClick={() => handleCaseTransform('upper')}
            title="Tout en majuscules (MAJ)"
            className="px-1.5 py-1 rounded-md text-[10px] font-mono text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            AA
          </button>
          <button
            onClick={() => handleCaseTransform('title')}
            title="Première lettre en majuscule (Titre)"
            className="px-1.5 py-1 rounded-md text-[10px] font-mono text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            Aa
          </button>
          <button
            onClick={() => handleCaseTransform('lower')}
            title="Tout en minuscules (min)"
            className="px-1.5 py-1 rounded-md text-[10px] font-mono text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            aa
          </button>

          <div className="h-3.5 w-[1px] bg-white/10 mx-0.5" />

          {/* Validate Button */}
          <button
            onClick={() => commitChange()}
            title="Valider la modification (Entrée)"
            className="p-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/30 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
          </button>

          {/* Cancel Button */}
          <button
            onClick={cancelChange}
            title="Annuler (Échap)"
            className="p-1 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/20 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Editable Text Surface */}
      <span
        ref={contentRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onDoubleClick={(e) => {
          e.stopPropagation();
          setDraft(contentRef.current?.textContent || value);
          setIsEditing(true);
        }}
        onClick={(e) => {
          if (!isEditing) {
            // Let the single click select the container or element normally
          } else {
            e.stopPropagation();
          }
        }}
        onBlur={() => {
          if (isEditing && !showAiMenu) {
            // Slight delay so toolbar buttons can be clicked without immediate blur cancellation
            setTimeout(() => {
              if (isEditing) commitChange();
            }, 180);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            cancelChange();
          } else if (!multiline && e.key === 'Enter') {
            e.preventDefault();
            commitChange();
          } else if (multiline && e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            commitChange();
          }
        }}
        className={`outline-none transition-all duration-150 inline-block align-baseline ${
          isEditing
            ? 'ring-2 ring-indigo-400 bg-indigo-500/20 text-white rounded px-1.5 py-0.5 shadow-lg shadow-indigo-500/20 cursor-text min-w-[30px]'
            : 'hover:ring-1 hover:ring-indigo-400/40 hover:bg-white/[0.04] rounded px-0.5 cursor-pointer'
        }`}
      >
        {value || placeholder}
      </span>
    </span>
  );
};

export const BuilderCanvas: React.FC<BuilderCanvasProps> = ({
  blocks,
  selectedBlockId,
  selectedElement,
  onSelectBlock,
  onSelectElement,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onMoveBlock,
  onReorderBlocks,
  onAddBlock,
  viewportMode,
  onViewportChange,
  zoomLevel,
  onZoomChange,
  isPreviewMode,
  onTogglePreviewMode,
  isFreeformMode = false,
  onToggleFreeformMode,
  themeAccent,
}) => {
  const [isAnnualBilling, setIsAnnualBilling] = useState(false);
  const [insertMenuIndex, setInsertMenuIndex] = useState<number | null>(null);
  const [hoveredElements, setHoveredElements] = useState<Record<string, string>>({});
  const currentSelectedBlock = blocks.find((b) => b.id === selectedBlockId);

  // Helper to compute element-level text color taking elementStyles, block section styles, and fallbacks into account
  const getElemTextColor = (
    block: CanvasBlock,
    elementKey: string,
    isHeading: boolean = false,
    defaultColor?: string
  ): string => {
    const elemCustom = block.content.elementStyles?.[elementKey];
    if (elemCustom?.textColor) return elemCustom.textColor;
    if (elemCustom?.color) return elemCustom.color;
    if (isHeading && block.style?.headingColor) return block.style.headingColor;
    if (block.style?.textColor) return block.style.textColor;
    return defaultColor || (isHeading ? '#ffffff' : '#94a3b8');
  };

  // Helper to compute element-level custom style from block.content.elementStyles
  const getElemStyle = (block: CanvasBlock, elementKey: string): React.CSSProperties => {
    const custom = block.content.elementStyles?.[elementKey];
    if (!custom) return {};
    const styleObj: React.CSSProperties = {};
    if (custom.fontFamily) styleObj.fontFamily = custom.fontFamily;
    if (custom.textColor) styleObj.color = custom.textColor;
    if (custom.color) styleObj.color = custom.color;
    
    const bgVal = custom.background || custom.backgroundColor;
    if (custom.isGradientText) {
      const bg = bgVal?.includes('gradient') ? bgVal : (bgVal || 'linear-gradient(135deg, #6366f1, #a855f7)');
      styleObj.background = bg;
      styleObj.WebkitBackgroundClip = 'text';
      styleObj.backgroundClip = 'text';
      styleObj.color = 'transparent';
      styleObj.WebkitTextFillColor = 'transparent';
    } else if (bgVal && bgVal !== 'transparent') {
      if (bgVal.includes('gradient')) {
        styleObj.background = bgVal;
      } else {
        styleObj.backgroundColor = bgVal;
      }
    }
    if (styleObj.background && styleObj.backgroundColor) {
      delete styleObj.backgroundColor;
    }

    if (custom.fontSize) styleObj.fontSize = `${custom.fontSize}px`;
    if (custom.fontWeight) styleObj.fontWeight = custom.fontWeight;
    if (custom.textAlign) styleObj.textAlign = custom.textAlign;
    if (custom.lineHeight !== undefined) styleObj.lineHeight = custom.lineHeight;
    if (custom.letterSpacing !== undefined) styleObj.letterSpacing = `${custom.letterSpacing}px`;
    if (custom.textTransform) styleObj.textTransform = custom.textTransform;
    if (custom.textDecoration) styleObj.textDecoration = custom.textDecoration;
    if (custom.borderRadius !== undefined) styleObj.borderRadius = `${custom.borderRadius}px`;
    if (custom.borderWidth !== undefined) {
      styleObj.borderWidth = `${custom.borderWidth}px`;
      styleObj.borderStyle = custom.borderStyle || (custom.borderWidth > 0 ? 'solid' : undefined);
    }
    if (custom.borderColor) styleObj.borderColor = custom.borderColor;
    if (custom.display) styleObj.display = custom.display;
    if (custom.paddingTop !== undefined) styleObj.paddingTop = `${custom.paddingTop}px`;
    if (custom.paddingBottom !== undefined) styleObj.paddingBottom = `${custom.paddingBottom}px`;
    if (custom.paddingLeft !== undefined) styleObj.paddingLeft = `${custom.paddingLeft}px`;
    if (custom.paddingRight !== undefined) styleObj.paddingRight = `${custom.paddingRight}px`;
    if (custom.marginTop !== undefined) styleObj.marginTop = `${custom.marginTop}px`;
    if (custom.marginBottom !== undefined) styleObj.marginBottom = `${custom.marginBottom}px`;
    if (custom.marginLeft !== undefined) styleObj.marginLeft = `${custom.marginLeft}px`;
    if (custom.marginRight !== undefined) styleObj.marginRight = `${custom.marginRight}px`;
    if (custom.opacity !== undefined) styleObj.opacity = custom.opacity;
    if (custom.boxShadow) styleObj.boxShadow = custom.boxShadow;
    if (custom.overflow) styleObj.overflow = custom.overflow;
    if (custom.backdropBlur !== undefined) {
      styleObj.backdropFilter = `blur(${custom.backdropBlur}px)`;
      styleObj.WebkitBackdropFilter = `blur(${custom.backdropBlur}px)`;
    }

    // CSS Visual Filters
    const filterParts: string[] = [];
    if (custom.filterBlur) filterParts.push(`blur(${custom.filterBlur}px)`);
    if (custom.filterBrightness !== undefined && custom.filterBrightness !== 1) filterParts.push(`brightness(${custom.filterBrightness})`);
    if (custom.filterContrast !== undefined && custom.filterContrast !== 1) filterParts.push(`contrast(${custom.filterContrast})`);
    if (custom.filterSaturate !== undefined && custom.filterSaturate !== 1) filterParts.push(`saturate(${custom.filterSaturate})`);
    if (custom.filterHueRotate) filterParts.push(`hue-rotate(${custom.filterHueRotate}deg)`);
    if (custom.filterGrayscale) filterParts.push(`grayscale(${custom.filterGrayscale}%)`);
    if (custom.filterInvert) filterParts.push(`invert(${custom.filterInvert}%)`);
    if (filterParts.length > 0) {
      styleObj.filter = filterParts.join(' ');
      (styleObj as any).WebkitFilter = filterParts.join(' ');
    }
    return styleObj;
  };

  // 2D Freeform Pointer Dragging state for Sections/Blocks
  const [freeDraggingBlock, setFreeDraggingBlock] = useState<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  // 2D Freeform Pointer Dragging state for Bento Cards
  const [freeDraggingCard, setFreeDraggingCard] = useState<{
    blockId: string;
    index: number;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  // 2D Freeform Pointer Dragging state for Pricing Plans
  const [freeDraggingPlan, setFreeDraggingPlan] = useState<{
    blockId: string;
    index: number;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  // Smart Snap Guides interface & state
  interface SnapGuide {
    id: string;
    orientation: 'vertical' | 'horizontal';
    positionPercent: number;
    label: string;
    color: 'cyan' | 'magenta';
    coordText?: string;
  }

  const [activeSnapGuides, setActiveSnapGuides] = useState<SnapGuide[]>([]);

  // 2D Freeform Pointer Dragging state for individual Elements (Texts, Buttons, Badges, etc.)
  const [freeDraggingElement, setFreeDraggingElement] = useState<{
    blockId: string;
    elementKey: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  // Global window listeners for high-precision 2D free dragging with Smart Snap Guides
  useEffect(() => {
    if (!freeDraggingBlock && !freeDraggingCard && !freeDraggingPlan && !freeDraggingElement) return;

    const scale = Math.max(0.1, zoomLevel / 100);

    const handleWindowPointerMove = (e: PointerEvent) => {
      const guides: SnapGuide[] = [];

      if (freeDraggingBlock) {
        const dx = (e.clientX - freeDraggingBlock.startX) / scale;
        const dy = (e.clientY - freeDraggingBlock.startY) / scale;
        let nx = Math.round(freeDraggingBlock.origX + dx);
        let ny = Math.round(freeDraggingBlock.origY + dy);

        // Magnetic snap to canvas center X=0
        if (Math.abs(nx) < 14) {
          nx = 0;
          guides.push({
            id: 'guide-center-x',
            orientation: 'vertical',
            positionPercent: 50,
            label: 'Centre Canvas',
            color: 'cyan',
            coordText: 'X: 0px',
          });
        }

        // Magnetic snap to vertical origin Y=0
        if (Math.abs(ny) < 14) {
          ny = 0;
          guides.push({
            id: 'guide-origin-y',
            orientation: 'horizontal',
            positionPercent: 50,
            label: 'Origine Section',
            color: 'magenta',
            coordText: 'Y: 0px',
          });
        }

        setActiveSnapGuides(guides);
        setFreeDraggingBlock((prev) => (prev ? { ...prev, currentX: nx, currentY: ny } : null));
      } else if (freeDraggingCard) {
        const dx = (e.clientX - freeDraggingCard.startX) / scale;
        const dy = (e.clientY - freeDraggingCard.startY) / scale;
        let nx = Math.round(freeDraggingCard.origX + dx);
        let ny = Math.round(freeDraggingCard.origY + dy);

        if (Math.abs(nx) < 10) {
          nx = 0;
          guides.push({
            id: 'guide-card-col',
            orientation: 'vertical',
            positionPercent: 50,
            label: 'Alignement Colonne',
            color: 'cyan',
            coordText: 'X: 0px',
          });
        }
        if (Math.abs(ny) < 10) {
          ny = 0;
          guides.push({
            id: 'guide-card-row',
            orientation: 'horizontal',
            positionPercent: 50,
            label: 'Alignement Rangée de Cartes',
            color: 'magenta',
            coordText: 'Y: 0px',
          });
        }

        setActiveSnapGuides(guides);
        setFreeDraggingCard((prev) => (prev ? { ...prev, currentX: nx, currentY: ny } : null));
      } else if (freeDraggingPlan) {
        const dx = (e.clientX - freeDraggingPlan.startX) / scale;
        const dy = (e.clientY - freeDraggingPlan.startY) / scale;
        let nx = Math.round(freeDraggingPlan.origX + dx);
        let ny = Math.round(freeDraggingPlan.origY + dy);

        if (Math.abs(nx) < 10) {
          nx = 0;
          guides.push({
            id: 'guide-plan-col',
            orientation: 'vertical',
            positionPercent: 50,
            label: 'Alignement Colonne Forfait',
            color: 'cyan',
            coordText: 'X: 0px',
          });
        }
        if (Math.abs(ny) < 10) {
          ny = 0;
          guides.push({
            id: 'guide-plan-row',
            orientation: 'horizontal',
            positionPercent: 50,
            label: 'Alignement Grille Tarifaire',
            color: 'magenta',
            coordText: 'Y: 0px',
          });
        }

        setActiveSnapGuides(guides);
        setFreeDraggingPlan((prev) => (prev ? { ...prev, currentX: nx, currentY: ny } : null));
      } else if (freeDraggingElement) {
        const dx = (e.clientX - freeDraggingElement.startX) / scale;
        const dy = (e.clientY - freeDraggingElement.startY) / scale;
        let nx = Math.round(freeDraggingElement.origX + dx);
        let ny = Math.round(freeDraggingElement.origY + dy);

        if (Math.abs(nx) < 10) {
          nx = 0;
          guides.push({
            id: 'guide-elem-x',
            orientation: 'vertical',
            positionPercent: 50,
            label: 'Axe Central',
            color: 'cyan',
            coordText: 'X: 0px',
          });
        }
        if (Math.abs(ny) < 10) {
          ny = 0;
          guides.push({
            id: 'guide-elem-y',
            orientation: 'horizontal',
            positionPercent: 50,
            label: 'Ligne de Base',
            color: 'magenta',
            coordText: 'Y: 0px',
          });
        }

        setActiveSnapGuides(guides);
        setFreeDraggingElement((prev) => (prev ? { ...prev, currentX: nx, currentY: ny } : null));
      }
    };

    const handleWindowPointerUp = () => {
      setActiveSnapGuides([]);

      if (freeDraggingBlock) {
        const target = blocks.find((b) => b.id === freeDraggingBlock.id);
        if (target) {
          onUpdateBlock({
            ...target,
            layout: {
              ...target.layout,
              x: freeDraggingBlock.currentX,
              y: freeDraggingBlock.currentY,
              isFreePosition: true,
            },
          });
        }
        setFreeDraggingBlock(null);
      }

      if (freeDraggingCard) {
        const target = blocks.find((b) => b.id === freeDraggingCard.blockId);
        if (target && target.content.features) {
          const updatedFeatures = [...target.content.features];
          if (updatedFeatures[freeDraggingCard.index]) {
            updatedFeatures[freeDraggingCard.index] = {
              ...updatedFeatures[freeDraggingCard.index],
              x: freeDraggingCard.currentX,
              y: freeDraggingCard.currentY,
            };
            onUpdateBlock({
              ...target,
              content: { ...target.content, features: updatedFeatures },
            });
          }
        }
        setFreeDraggingCard(null);
      }

      if (freeDraggingPlan) {
        const target = blocks.find((b) => b.id === freeDraggingPlan.blockId);
        if (target && target.content.pricingPlans) {
          const updatedPlans = [...target.content.pricingPlans];
          if (updatedPlans[freeDraggingPlan.index]) {
            updatedPlans[freeDraggingPlan.index] = {
              ...updatedPlans[freeDraggingPlan.index],
              x: freeDraggingPlan.currentX,
              y: freeDraggingPlan.currentY,
            };
            onUpdateBlock({
              ...target,
              content: { ...target.content, pricingPlans: updatedPlans },
            });
          }
        }
        setFreeDraggingPlan(null);
      }

      if (freeDraggingElement) {
        const target = blocks.find((b) => b.id === freeDraggingElement.blockId);
        if (target) {
          const currentOffsets = { ...(target.content.elementOffsets || {}) };
          if (freeDraggingElement.currentX === 0 && freeDraggingElement.currentY === 0) {
            delete currentOffsets[freeDraggingElement.elementKey];
          } else {
            currentOffsets[freeDraggingElement.elementKey] = {
              x: freeDraggingElement.currentX,
              y: freeDraggingElement.currentY,
            };
          }
          onUpdateBlock({
            ...target,
            content: {
              ...target.content,
              elementOffsets: currentOffsets,
            },
          });
        }
        setFreeDraggingElement(null);
      }
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
    };
  }, [freeDraggingBlock, freeDraggingCard, freeDraggingPlan, freeDraggingElement, zoomLevel, blocks, onUpdateBlock]);

  // Pointer drag triggers
  const handleStartBlockFreeDrag = (e: React.PointerEvent, block: CanvasBlock) => {
    if (isPreviewMode) return;
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    onSelectBlock(block.id);
    setFreeDraggingBlock({
      id: block.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: block.layout.x || 0,
      origY: block.layout.y || 0,
      currentX: block.layout.x || 0,
      currentY: block.layout.y || 0,
    });
  };

  const handleStartCardFreeDrag = (e: React.PointerEvent, blockId: string, cardIndex: number, currentCardX: number = 0, currentCardY: number = 0) => {
    if (isPreviewMode) return;
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    setFreeDraggingCard({
      blockId,
      index: cardIndex,
      startX: e.clientX,
      startY: e.clientY,
      origX: currentCardX,
      origY: currentCardY,
      currentX: currentCardX,
      currentY: currentCardY,
    });
  };

  const handleStartPlanFreeDrag = (e: React.PointerEvent, blockId: string, planIndex: number, currentPlanX: number = 0, currentPlanY: number = 0) => {
    if (isPreviewMode) return;
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    setFreeDraggingPlan({
      blockId,
      index: planIndex,
      startX: e.clientX,
      startY: e.clientY,
      origX: currentPlanX,
      origY: currentPlanY,
      currentX: currentPlanX,
      currentY: currentPlanY,
    });
  };

  const handleStartElementFreeDrag = (
    e: React.PointerEvent,
    blockId: string,
    elementKey: string,
    currentElemX: number = 0,
    currentElemY: number = 0
  ) => {
    if (isPreviewMode) return;
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    onSelectBlock(blockId);
    setFreeDraggingElement({
      blockId,
      elementKey,
      startX: e.clientX,
      startY: e.clientY,
      origX: currentElemX,
      origY: currentElemY,
      currentX: currentElemX,
      currentY: currentElemY,
    });
  };

  const resetElementOffset = (blockId: string, elementKey: string) => {
    const target = blocks.find((b) => b.id === blockId);
    if (!target) return;
    const currentOffsets = { ...(target.content.elementOffsets || {}) };
    delete currentOffsets[elementKey];
    onUpdateBlock({
      ...target,
      content: {
        ...target.content,
        elementOffsets: currentOffsets,
      },
    });
  };

  // Interactive Floating Quick Action Toolbar for Selected Canvas Elements
  const ElementQuickHUD: React.FC<{
    block: CanvasBlock;
    elementKey: string;
    label?: string;
    activeHtmlTag?: string;
    isAnimationTarget?: boolean;
    themeAccent: string;
    hasOffset: boolean;
    onResetOffset: () => void;
    onUpdateElemStyle: (updates: Partial<ElementCustomStyle>) => void;
    onUpdateBlock: (block: CanvasBlock) => void;
    onClose: () => void;
  }> = ({
    block,
    elementKey,
    label,
    activeHtmlTag,
    isAnimationTarget,
    themeAccent,
    hasOffset,
    onResetOffset,
    onUpdateElemStyle,
    onUpdateBlock,
    onClose,
  }) => {
    const [openPopover, setOpenPopover] = useState<'color' | 'ai' | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const currentStyle = block.content.elementStyles?.[elementKey] || {};

    const currentFontSize = currentStyle.fontSize || (elementKey.includes('title') || elementKey.includes('Title') ? 32 : 14);
    const isBold = (currentStyle.fontWeight && Number(currentStyle.fontWeight) >= 600) || false;
    const isItalic = currentStyle.fontStyle === 'italic';

    const handleStepFontSize = (delta: number) => {
      const newSize = Math.max(10, Math.min(96, currentFontSize + delta));
      onUpdateElemStyle({ fontSize: newSize });
    };

    const handleToggleBold = () => {
      onUpdateElemStyle({ fontWeight: isBold ? 400 : 700 });
    };

    const handleToggleItalic = () => {
      onUpdateElemStyle({ fontStyle: isItalic ? 'normal' : 'italic' });
    };

    const handleCycleAlign = () => {
      const current = currentStyle.textAlign || 'left';
      const nextAlign = current === 'left' ? 'center' : current === 'center' ? 'right' : 'left';
      onUpdateElemStyle({ textAlign: nextAlign });
    };

    const colorSwatches = [
      { label: 'Thème Accent', color: themeAccent },
      { label: 'Blanc Pur', color: '#ffffff' },
      { label: 'Gris Ardoise', color: '#94a3b8' },
      { label: 'Indigo', color: '#6366f1' },
      { label: 'Cyan Cyber', color: '#06b6d4' },
      { label: 'Émeraude', color: '#10b981' },
      { label: 'Rose Néon', color: '#f43f5e' },
      { label: 'Ambre Vif', color: '#f59e0b' },
      { label: 'Violet Profond', color: '#a855f7' },
    ];

    const handleAiAction = async (action: 'punchy' | 'shorten' | 'professional' | 'en' | 'fr') => {
      setIsAiLoading(true);
      try {
        let textToTransform = '';
        if (elementKey === 'title' || elementKey === 'featuresTitle' || elementKey === 'pricingTitle' || elementKey === 'ctaBannerTitle') {
          textToTransform = (block.content as any)[elementKey] || block.content.title || '';
        } else if (elementKey === 'subtitle' || elementKey === 'featuresSubtitle' || elementKey === 'pricingSubtitle' || elementKey === 'ctaBannerSubtitle') {
          textToTransform = (block.content as any)[elementKey] || block.content.subtitle || '';
        } else if (elementKey === 'badgeText' || elementKey === 'featuresBadge' || elementKey === 'pricingBadge') {
          textToTransform = block.content.badgeText || '';
        } else if (elementKey === 'primaryCta' || elementKey === 'secondaryCta') {
          textToTransform = elementKey === 'primaryCta' ? (block.content.primaryCtaText || '') : (block.content.secondaryCtaText || '');
        }

        if (textToTransform) {
          const res = await fetch('/api/ai/text-transform', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textToTransform, action, context: label || elementKey }),
          });
          const data = await res.json();
          if (data.text) {
            const contentUpdates: any = {};
            if (elementKey === 'title' || elementKey === 'featuresTitle' || elementKey === 'pricingTitle' || elementKey === 'ctaBannerTitle') {
              contentUpdates[elementKey] = data.text;
              contentUpdates.title = data.text;
            } else if (elementKey === 'subtitle' || elementKey === 'featuresSubtitle' || elementKey === 'pricingSubtitle' || elementKey === 'ctaBannerSubtitle') {
              contentUpdates[elementKey] = data.text;
              contentUpdates.subtitle = data.text;
            } else if (elementKey === 'badgeText' || elementKey === 'featuresBadge' || elementKey === 'pricingBadge') {
              contentUpdates.badgeText = data.text;
            } else if (elementKey === 'primaryCta') {
              contentUpdates.primaryCtaText = data.text;
            } else if (elementKey === 'secondaryCta') {
              contentUpdates.secondaryCtaText = data.text;
            }

            onUpdateBlock({
              ...block,
              content: { ...block.content, ...contentUpdates },
            });
          }
        }
      } catch (e) {
        console.error('AI quick transform error:', e);
      } finally {
        setIsAiLoading(false);
        setOpenPopover(null);
      }
    };

    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute -top-11 left-0 z-50 flex items-center gap-1 p-1 rounded-xl bg-[#080d1a]/95 border border-indigo-500/40 shadow-2xl backdrop-blur-xl text-xs select-none animate-in fade-in slide-in-from-bottom-2 duration-150 whitespace-nowrap"
      >
        {/* Label Badge */}
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-white font-mono text-[10px] font-semibold ${
          isAnimationTarget ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600' : 'bg-indigo-600/50 text-indigo-200'
        }`}>
          {isAnimationTarget ? <Sparkles className="w-2.5 h-2.5 text-yellow-300 animate-pulse" /> : <MousePointerClick className="w-2.5 h-2.5" />}
          <span>{label || elementKey}{activeHtmlTag ? ` <${activeHtmlTag}>` : ''}</span>
        </div>

        <div className="h-3.5 w-[1px] bg-white/10 mx-0.5" />

        {/* Font Size A- / A+ */}
        <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/5">
          <button
            onClick={() => handleStepFontSize(-2)}
            title="Diminuer la taille (A-)"
            className="px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            A-
          </button>
          <span className="text-[10px] font-mono text-slate-400 px-1">{currentFontSize}px</span>
          <button
            onClick={() => handleStepFontSize(2)}
            title="Augmenter la taille (A+)"
            className="px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            A+
          </button>
        </div>

        {/* Bold & Italic */}
        <button
          onClick={handleToggleBold}
          title="Gras"
          className={`p-1 rounded-lg transition-colors ${
            isBold ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Bold className="w-3 h-3" />
        </button>
        <button
          onClick={handleToggleItalic}
          title="Italique"
          className={`p-1 rounded-lg transition-colors ${
            isItalic ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Italic className="w-3 h-3" />
        </button>

        {/* Alignment */}
        <button
          onClick={handleCycleAlign}
          title={`Alignement (${currentStyle.textAlign || 'gauche'})`}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          {currentStyle.textAlign === 'center' ? (
            <AlignCenter className="w-3 h-3 text-indigo-300" />
          ) : currentStyle.textAlign === 'right' ? (
            <AlignRight className="w-3 h-3 text-indigo-300" />
          ) : (
            <AlignLeft className="w-3 h-3" />
          )}
        </button>

        <div className="h-3.5 w-[1px] bg-white/10 mx-0.5" />

        {/* Color Popover */}
        <div className="relative">
          <button
            onClick={() => setOpenPopover(openPopover === 'color' ? null : 'color')}
            title="Palette de Couleurs Rapide"
            className={`p-1 rounded-lg transition-colors flex items-center gap-1 ${
              openPopover === 'color' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Palette className="w-3 h-3 text-indigo-400" />
          </button>

          {openPopover === 'color' && (
            <div className="absolute top-8 left-0 z-50 p-2 rounded-xl bg-[#0a0f20]/98 border border-white/15 shadow-2xl backdrop-blur-2xl flex flex-col gap-2 w-48 animate-in fade-in duration-150">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Couleur du texte</span>
              <div className="grid grid-cols-5 gap-1.5">
                {colorSwatches.map((swatch, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onUpdateElemStyle({ color: swatch.color, textColor: swatch.color, isGradientText: false });
                      setOpenPopover(null);
                    }}
                    title={swatch.label}
                    className="w-5 h-5 rounded-full border border-white/20 transition-transform hover:scale-125"
                    style={{ backgroundColor: swatch.color }}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  onUpdateElemStyle({
                    isGradientText: true,
                    background: `linear-gradient(135deg, ${themeAccent}, #c084fc, #f472b6)`,
                  });
                  setOpenPopover(null);
                }}
                className="px-2 py-1 rounded-lg text-[10px] font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity text-center shadow-md"
              >
                Texte Dégradé Cyber
              </button>
            </div>
          )}
        </div>

        {/* AI Polish Popover */}
        <div className="relative">
          <button
            onClick={() => setOpenPopover(openPopover === 'ai' ? null : 'ai')}
            title="Assistant IA Réécriture & Polish"
            disabled={isAiLoading}
            className={`flex items-center gap-1 px-1.5 py-1 rounded-lg border text-[10px] font-medium transition-colors ${
              openPopover === 'ai' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-300 border-indigo-400/30'
            }`}
          >
            {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin text-indigo-300" /> : <Wand2 className="w-3 h-3 text-indigo-400" />}
            <span>IA</span>
          </button>

          {openPopover === 'ai' && (
            <div className="absolute top-8 left-0 z-50 w-44 p-1 rounded-xl bg-[#0a0f20]/98 border border-white/15 shadow-2xl backdrop-blur-2xl flex flex-col gap-0.5 text-xs animate-in fade-in duration-150">
              <button
                onClick={() => handleAiAction('punchy')}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-indigo-500/20 text-slate-200 hover:text-white text-left text-[10px] transition-colors"
              >
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Plus percutant</span>
              </button>
              <button
                onClick={() => handleAiAction('shorten')}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-indigo-500/20 text-slate-200 hover:text-white text-left text-[10px] transition-colors"
              >
                <Zap className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>Raccourcir (Concis)</span>
              </button>
              <button
                onClick={() => handleAiAction('professional')}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-indigo-500/20 text-slate-200 hover:text-white text-left text-[10px] transition-colors"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Ton Pro B2B</span>
              </button>
              <div className="h-[1px] bg-white/10 my-0.5" />
              <button
                onClick={() => handleAiAction('en')}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-indigo-500/20 text-slate-200 hover:text-white text-left text-[10px] transition-colors"
              >
                <span>🇬🇧</span>
                <span>Traduire en Anglais</span>
              </button>
              <button
                onClick={() => handleAiAction('fr')}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-indigo-500/20 text-slate-200 hover:text-white text-left text-[10px] transition-colors"
              >
                <span>🇫🇷</span>
                <span>Traduire en Français</span>
              </button>
            </div>
          )}
        </div>

        {/* Recenter button if moved */}
        {hasOffset && (
          <button
            onClick={onResetOffset}
            title="Recentrer cet élément (X:0, Y:0)"
            className="p-1 rounded-lg text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        )}

        {/* Close / Deselect */}
        <button
          onClick={onClose}
          title="Fermer la sélection"
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-0.5"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  };

  // Reusable 2D Freeform Movable Element Wrapper
  const renderMovable = ({
    block,
    elementKey,
    category = 'text',
    subId,
    label,
    inline = false,
    className = '',
    children,
  }: {
    block: CanvasBlock;
    elementKey: string;
    category?: ElementCategory;
    subId?: string | number;
    label?: string;
    inline?: boolean;
    className?: string;
    children: React.ReactNode;
  }) => {
    const isThisElementDragging =
      freeDraggingElement?.blockId === block.id && freeDraggingElement?.elementKey === elementKey;
    const storedOffset = block.content.elementOffsets?.[elementKey] || { x: 0, y: 0 };
    const elemOffsetX = isThisElementDragging ? freeDraggingElement.currentX : storedOffset.x;
    const elemOffsetY = isThisElementDragging ? freeDraggingElement.currentY : storedOffset.y;
    const hasElemOffset = elemOffsetX !== 0 || elemOffsetY !== 0;

    const isElementSelected = 
      !isPreviewMode && 
      selectedElement?.blockId === block.id && 
      selectedElement?.elementKey === elementKey;

    const customElemStyle = getElemStyle(block, elementKey);
    if (customElemStyle.display === 'none' || block.content.elementStyles?.[elementKey]?.hidden) {
      return null;
    }
    const isAnimationTarget = 
      (block.style?.animationTarget === elementKey) || 
      (block.style?.animationTarget === 'cta' && (elementKey === 'primaryCta' || elementKey === 'secondaryCta')) ||
      (block.style?.advancedAnimEnabled && (
        block.style?.advancedAnimTarget === elementKey ||
        (block.style?.advancedAnimTarget === 'cta' && (elementKey === 'primaryCta' || elementKey === 'secondaryCta'))
      )) ||
      (block.style?.animStylePropsEnabled && (
        block.style?.animStyleTarget === elementKey ||
        (block.style?.animStyleTarget === 'cta' && (elementKey === 'primaryCta' || elementKey === 'secondaryCta'))
      ));

    const activeHtmlTag = block.content.elementStyles?.[elementKey]?.htmlTag;
    const baseTag = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'button', 'a', 'span', 'div', 'section', 'header', 'footer'].includes(activeHtmlTag || '') ? activeHtmlTag : 'div');
    
    const animProps = resolveFramerAnimation(block, elementKey, hoveredElements[block.id] === block.style?.hoverTriggerSource);
    const hoverProps = block.style?.hoverTriggerSource === elementKey ? {
      onMouseEnter: () => setHoveredElements(prev => ({ ...prev, [block.id]: elementKey })),
      onMouseLeave: () => setHoveredElements(prev => ({ ...prev, [block.id]: 'none' }))
    } : {};
    
    const isAnimated = Object.keys(animProps).length > 0 || Object.keys(hoverProps).length > 0;
    const Tag: any = isAnimated ? (motion as any)[baseTag] : baseTag;

    const combinedStyle: React.CSSProperties = {
      ...customElemStyle,
      transform: (hasElemOffset || isThisElementDragging)
        ? `translate3d(${elemOffsetX}px, ${elemOffsetY}px, 0px)`
        : undefined,
      zIndex: isThisElementDragging ? 50 : isElementSelected ? 30 : undefined,
      transition: isThisElementDragging ? 'none' : isAnimated ? undefined : 'transform 0.15s ease-out, color 0.15s, background-color 0.15s',
    };

    if (isPreviewMode) {
      if (!hasElemOffset && Object.keys(customElemStyle).length === 0 && !activeHtmlTag && !isAnimated) return <>{children}</>;
      return (
        <Tag
          {...animProps}
          {...hoverProps}
          className={inline ? 'inline-block' : className}
          style={combinedStyle}
        >
          {children}
        </Tag>
      );
    }

    return (
      <Tag
        {...animProps}
        {...hoverProps}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onSelectBlock(block.id);
          if (onSelectElement) {
            onSelectElement({
              blockId: block.id,
              elementKey,
              category,
              label: label || elementKey,
              subId,
              htmlTag: activeHtmlTag,
            });
          }
        }}
        className={`${inline ? 'inline-block' : ''} relative group/movable cursor-pointer ${className} ${
          isThisElementDragging
            ? 'z-40 ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#07090e] rounded-lg'
            : isElementSelected
            ? isAnimationTarget
              ? 'ring-2 ring-fuchsia-500 ring-offset-2 ring-offset-[#07090e] rounded-lg shadow-lg shadow-fuchsia-500/30'
              : 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#07090e] rounded-lg shadow-lg shadow-indigo-500/20'
            : isAnimationTarget
            ? 'ring-1.5 ring-fuchsia-500/80 shadow-sm shadow-fuchsia-500/25 rounded-lg'
            : isFreeformMode
            ? 'hover:ring-1 hover:ring-indigo-400/40 rounded-lg'
            : 'hover:ring-1 hover:ring-white/20 rounded-lg'
        }`}
        style={combinedStyle}
      >
        {/* Selected Element Floating Quick Action Toolbar HUD */}
        {isElementSelected && (
          <>
            <ElementQuickHUD
              block={block}
              elementKey={elementKey}
              label={label}
              activeHtmlTag={activeHtmlTag}
              isAnimationTarget={isAnimationTarget}
              themeAccent={themeAccent}
              hasOffset={hasElemOffset}
              onResetOffset={() => resetElementOffset(block.id, elementKey)}
              onUpdateElemStyle={(updates) => {
                const currentStyles = { ...(block.content.elementStyles || {}) };
                const currentElemStyle = { ...(currentStyles[elementKey] || {}) };
                currentStyles[elementKey] = {
                  ...currentElemStyle,
                  ...updates,
                };
                onUpdateBlock({
                  ...block,
                  content: {
                    ...block.content,
                    elementStyles: currentStyles,
                  },
                });
              }}
              onUpdateBlock={onUpdateBlock}
              onClose={() => {
                if (onSelectElement) onSelectElement(null);
              }}
            />

            {/* Figma-style 4 Corner Handles */}
            <div className={`w-2 h-2 bg-white border-2 ${isAnimationTarget ? 'border-fuchsia-500' : 'border-indigo-500'} rounded-sm absolute -top-1 -left-1 z-50 pointer-events-none shadow-sm`} />
            <div className={`w-2 h-2 bg-white border-2 ${isAnimationTarget ? 'border-fuchsia-500' : 'border-indigo-500'} rounded-sm absolute -top-1 -right-1 z-50 pointer-events-none shadow-sm`} />
            <div className={`w-2 h-2 bg-white border-2 ${isAnimationTarget ? 'border-fuchsia-500' : 'border-indigo-500'} rounded-sm absolute -bottom-1 -left-1 z-50 pointer-events-none shadow-sm`} />
            <div className={`w-2 h-2 bg-white border-2 ${isAnimationTarget ? 'border-fuchsia-500' : 'border-indigo-500'} rounded-sm absolute -bottom-1 -right-1 z-50 pointer-events-none shadow-sm`} />
          </>
        )}

        {/* Animation Target Indicator Badge when not directly selected */}
        {isAnimationTarget && !isElementSelected && (
          <div className="absolute -top-2.5 -right-2 z-30 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white text-[8px] font-mono font-bold shadow-md flex items-center gap-1 pointer-events-none group-hover/movable:scale-105 transition-transform">
            <span>🎯</span>
            <span className="hidden sm:inline">Cible Animée</span>
          </div>
        )}

        {/* Floating coordinates indicator during dragging */}
        {isThisElementDragging && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#080d1a]/95 border border-cyan-400 text-white text-[10px] font-mono shadow-xl pointer-events-none whitespace-nowrap">
            <Move className="w-2.5 h-2.5 text-cyan-300 animate-pulse" />
            <span>{label ? `${label}: ` : ''}X: {elemOffsetX > 0 ? `+${elemOffsetX}` : elemOffsetX}px</span>
            <span className="text-white/20">|</span>
            <span>Y: {elemOffsetY > 0 ? `+${elemOffsetY}` : elemOffsetY}px</span>
          </div>
        )}

        {/* 2D Free-Move Grip Handle on hover */}
        <div
          onPointerDown={(e) => handleStartElementFreeDrag(e, block.id, elementKey, storedOffset.x, storedOffset.y)}
          title={`Maintenez le clic pour déplacer ${label || 'cet élément'} librement en 2D (X, Y)`}
          className={`absolute -top-3 -right-2.5 z-30 p-1 rounded-md bg-[#0b101d]/95 border border-cyan-400/70 text-cyan-300 hover:text-white hover:bg-cyan-500 cursor-grab active:cursor-grabbing shadow-lg transition-all hover:scale-110 flex items-center gap-0.5 select-none ${
            isFreeformMode ? 'opacity-40 group-hover/movable:opacity-100' : 'opacity-0 group-hover/movable:opacity-100'
          }`}
        >
          <Move className="w-2.5 h-2.5" />
        </div>

        {/* Instant Reset / Recenter Button if moved */}
        {hasElemOffset && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              resetElementOffset(block.id, elementKey);
            }}
            title="Recentrer cet élément (X: 0, Y: 0)"
            className="absolute -top-3 -left-2.5 z-30 p-1 rounded-md bg-[#0b101d]/95 border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-500/20 shadow-lg opacity-0 group-hover/movable:opacity-100 transition-all hover:scale-110"
          >
            <RotateCcw className="w-2.5 h-2.5" />
          </button>
        )}

        {children}
      </Tag>
    );
  };

  // Drag-and-drop state for sections/blocks
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragPosition, setDragPosition] = useState<'before' | 'after' | null>(null);

  // Drag-and-drop state for feature cards within Bento Grid
  const [draggedFeatureIdx, setDraggedFeatureIdx] = useState<{ blockId: string; index: number } | null>(null);
  const [dragOverFeatureIdx, setDragOverFeatureIdx] = useState<number | null>(null);

  // Drag-and-drop state for pricing plans
  const [draggedPlanIdx, setDraggedPlanIdx] = useState<{ blockId: string; index: number } | null>(null);
  const [dragOverPlanIdx, setDragOverPlanIdx] = useState<number | null>(null);

  // Block drag & drop handlers
  const handleBlockDragStart = (e: React.DragEvent, blockId: string) => {
    e.stopPropagation();
    setDraggedBlockId(blockId);
    e.dataTransfer.setData('text/plain', blockId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleBlockDragOver = (e: React.DragEvent, index: number) => {
    if (!draggedBlockId) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';

    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const pos = e.clientY < midY ? 'before' : 'after';

    setDragOverIndex(index);
    setDragPosition(pos);
  };

  const handleBlockDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedBlockId) {
      setDraggedBlockId(null);
      setDragOverIndex(null);
      setDragPosition(null);
      return;
    }

    const sourceIndex = blocks.findIndex((b) => b.id === draggedBlockId);
    if (sourceIndex === -1) return;

    let destIndex = targetIndex;
    if (dragPosition === 'after' && sourceIndex < targetIndex) {
      destIndex = targetIndex;
    } else if (dragPosition === 'after' && sourceIndex > targetIndex) {
      destIndex = targetIndex + 1;
    } else if (dragPosition === 'before' && sourceIndex < targetIndex) {
      destIndex = targetIndex - 1;
    } else if (dragPosition === 'before' && sourceIndex > targetIndex) {
      destIndex = targetIndex;
    }

    destIndex = Math.max(0, Math.min(destIndex, blocks.length - 1));

    if (onReorderBlocks) {
      onReorderBlocks(sourceIndex, destIndex);
    } else if (sourceIndex !== destIndex) {
      const direction = destIndex < sourceIndex ? 'up' : 'down';
      onMoveBlock(draggedBlockId, direction);
    }

    setDraggedBlockId(null);
    setDragOverIndex(null);
    setDragPosition(null);
  };

  const handleBlockDragEnd = () => {
    setDraggedBlockId(null);
    setDragOverIndex(null);
    setDragPosition(null);
  };

  // Feature Card drag & drop handlers
  const handleFeatureDragStart = (e: React.DragEvent, blockId: string, index: number) => {
    e.stopPropagation();
    setDraggedFeatureIdx({ blockId, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleFeatureDragOver = (e: React.DragEvent, index: number) => {
    if (!draggedFeatureIdx) return;
    e.preventDefault();
    e.stopPropagation();
    setDragOverFeatureIdx(index);
  };

  const handleFeatureDrop = (e: React.DragEvent, block: CanvasBlock, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedFeatureIdx || draggedFeatureIdx.blockId !== block.id) {
      setDraggedFeatureIdx(null);
      setDragOverFeatureIdx(null);
      return;
    }

    const sourceIndex = draggedFeatureIdx.index;
    if (sourceIndex === targetIndex) {
      setDraggedFeatureIdx(null);
      setDragOverFeatureIdx(null);
      return;
    }

    const updatedFeatures = [...(block.content.features || [])];
    const [moved] = updatedFeatures.splice(sourceIndex, 1);
    updatedFeatures.splice(targetIndex, 0, moved);

    onUpdateBlock({
      ...block,
      content: { ...block.content, features: updatedFeatures },
    });

    setDraggedFeatureIdx(null);
    setDragOverFeatureIdx(null);
  };

  // Pricing Plan drag & drop handlers
  const handlePlanDragStart = (e: React.DragEvent, blockId: string, index: number) => {
    e.stopPropagation();
    setDraggedPlanIdx({ blockId, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handlePlanDragOver = (e: React.DragEvent, index: number) => {
    if (!draggedPlanIdx) return;
    e.preventDefault();
    e.stopPropagation();
    setDragOverPlanIdx(index);
  };

  const handlePlanDrop = (e: React.DragEvent, block: CanvasBlock, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedPlanIdx || draggedPlanIdx.blockId !== block.id) {
      setDraggedPlanIdx(null);
      setDragOverPlanIdx(null);
      return;
    }

    const sourceIndex = draggedPlanIdx.index;
    if (sourceIndex === targetIndex) {
      setDraggedPlanIdx(null);
      setDragOverPlanIdx(null);
      return;
    }

    const updatedPlans = [...(block.content.pricingPlans || [])];
    const [moved] = updatedPlans.splice(sourceIndex, 1);
    updatedPlans.splice(targetIndex, 0, moved);

    onUpdateBlock({
      ...block,
      content: { ...block.content, pricingPlans: updatedPlans },
    });

    setDraggedPlanIdx(null);
    setDragOverPlanIdx(null);
  };

  // Viewport responsive widths
  const getViewportWidth = () => {
    switch (viewportMode) {
      case 'tablet':
        return '768px';
      case 'mobile':
        return '390px';
      default:
        return '1200px';
    }
  };

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'Boxes':
        return <Boxes className="w-5 h-5" />;
      case 'GitBranch':
        return <GitBranch className="w-5 h-5" />;
      case 'Bot':
        return <Bot className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      default:
        return <Code2 className="w-5 h-5" />;
    }
  };

  const nextIcon = (current: string) => {
    const icons = ['Boxes', 'Zap', 'Bot', 'ShieldCheck', 'GitBranch', 'Code2'];
    const idx = icons.indexOf(current);
    return icons[(idx + 1) % icons.length];
  };

  // Background tint presets
  const bgPresets = [
    { label: 'Obsidienne', color: 'rgba(10, 13, 22, 0.75)' },
    { label: 'Indigo Nuit', color: 'rgba(19, 23, 42, 0.85)' },
    { label: 'Cyber Cyan', color: 'rgba(8, 28, 36, 0.85)' },
    { label: 'Violet Sombre', color: 'rgba(28, 14, 40, 0.85)' },
  ];

  // Helper to compute block container styling from block.style
  const getBlockContainerStyle = (b: CanvasBlock): React.CSSProperties => {
    const s = b.style || {};
    const bgVal = s.background || s.backgroundColor;
    const isTransparent = !bgVal || bgVal === 'transparent';
    const isGrad = bgVal?.includes('gradient');
    const styleObj: React.CSSProperties = {
      borderRadius: s.borderRadius !== undefined ? `${s.borderRadius}px` : undefined,
      borderColor: s.borderColor || undefined,
      borderWidth: s.borderWidth !== undefined ? `${s.borderWidth}px` : undefined,
      borderStyle: s.borderStyle || (s.borderWidth ? 'solid' : undefined),
      boxShadow: s.boxShadow || undefined,
      paddingTop: s.paddingTop !== undefined ? `${s.paddingTop}px` : undefined,
      paddingBottom: s.paddingBottom !== undefined ? `${s.paddingBottom}px` : undefined,
      paddingLeft: s.paddingLeft !== undefined ? `${s.paddingLeft}px` : undefined,
      paddingRight: s.paddingRight !== undefined ? `${s.paddingRight}px` : undefined,
      maxWidth: s.maxWidth || '1200px',
      opacity: s.opacity !== undefined ? s.opacity : 1,
      backdropFilter: s.backdropBlur ? `blur(${s.backdropBlur}px)` : undefined,
      WebkitBackdropFilter: s.backdropBlur ? `blur(${s.backdropBlur}px)` : undefined,
      color: s.textColor || undefined,
      fontSize: s.fontSize ? `${s.fontSize}px` : undefined,
      fontFamily: s.fontFamily || undefined,
      letterSpacing: s.letterSpacing !== undefined ? `${s.letterSpacing}px` : undefined,
      lineHeight: s.lineHeight !== undefined ? s.lineHeight : undefined,
      overflow: s.overflow || undefined,
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box',
      transition: 'all 0.15s ease-out',
    };

    // CSS Visual Filters
    const filterParts: string[] = [];
    if (s.filterBlur) filterParts.push(`blur(${s.filterBlur}px)`);
    if (s.filterBrightness !== undefined && s.filterBrightness !== 1) filterParts.push(`brightness(${s.filterBrightness})`);
    if (s.filterContrast !== undefined && s.filterContrast !== 1) filterParts.push(`contrast(${s.filterContrast})`);
    if (s.filterSaturate !== undefined && s.filterSaturate !== 1) filterParts.push(`saturate(${s.filterSaturate})`);
    if (s.filterHueRotate) filterParts.push(`hue-rotate(${s.filterHueRotate}deg)`);
    if (s.filterGrayscale) filterParts.push(`grayscale(${s.filterGrayscale}%)`);
    if (s.filterInvert) filterParts.push(`invert(${s.filterInvert}%)`);
    if (filterParts.length > 0) {
      styleObj.filter = filterParts.join(' ');
      (styleObj as any).WebkitFilter = filterParts.join(' ');
    }

    if (!isTransparent && bgVal) {
      if (isGrad) {
        styleObj.background = bgVal;
      } else {
        styleObj.backgroundColor = bgVal;
      }
    }

    // Pattern Overlay integration
    if (s.patternOverlay && s.patternOverlay !== 'none') {
      const pOp = s.patternOpacity !== undefined ? s.patternOpacity : 0.15;
      let patternBg = '';
      if (s.patternOverlay === 'dots') {
        patternBg = `radial-gradient(rgba(255, 255, 255, ${pOp}) 1px, transparent 1px)`;
        styleObj.backgroundSize = '24px 24px';
      } else if (s.patternOverlay === 'grid') {
        patternBg = `linear-gradient(rgba(255, 255, 255, ${pOp * 0.7}) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, ${pOp * 0.7}) 1px, transparent 1px)`;
        styleObj.backgroundSize = '32px 32px';
      } else if (s.patternOverlay === 'stripes') {
        patternBg = `repeating-linear-gradient(45deg, rgba(255, 255, 255, ${pOp * 0.5}), rgba(255, 255, 255, ${pOp * 0.5}) 2px, transparent 2px, transparent 16px)`;
      } else if (s.patternOverlay === 'circuit') {
        patternBg = `radial-gradient(circle at 50% 50%, rgba(99, 102, 241, ${pOp}) 0%, transparent 60%), linear-gradient(rgba(255, 255, 255, ${pOp * 0.4}) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, ${pOp * 0.4}) 1px, transparent 1px)`;
        styleObj.backgroundSize = '100% 100%, 40px 40px, 40px 40px';
      } else if (s.patternOverlay === 'mesh') {
        patternBg = `radial-gradient(at 0% 0%, rgba(236, 72, 153, ${pOp * 1.5}) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(99, 102, 241, ${pOp * 1.5}) 0px, transparent 50%)`;
      }

      if (patternBg) {
        if (styleObj.background) {
          styleObj.backgroundImage = `${patternBg}, ${styleObj.background}`;
        } else {
          styleObj.backgroundImage = patternBg;
        }
      }
    }

    return styleObj;
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative select-none">
      {/* Floating Canvas Studio HUD Dock (Superposed Over Canvas Viewport, Modern Studio UX) */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="absolute top-3.5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full studio-dock text-xs select-none max-w-[94vw] overflow-x-auto shadow-2xl transition-all"
      >
        {isPreviewMode ? (
          <div className="flex items-center gap-2 px-1">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Mode Aperçu Réel
            </span>
            {onTogglePreviewMode && (
              <button
                onClick={onTogglePreviewMode}
                className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-medium border border-emerald-500/30 transition-colors"
              >
                Quitter l&apos;aperçu
              </button>
            )}
          </div>
        ) : (
          <>
            {/* 1. Selection Breadcrumb Pill */}
            <div className="flex items-center gap-1.5 px-1 text-[11px] text-slate-300 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              {selectedElement && currentSelectedBlock ? (
                <div className="flex items-center gap-1 font-mono">
                  <span className="text-slate-400 truncate max-w-[90px]">{currentSelectedBlock.name}</span>
                  <span className="text-white/30">›</span>
                  <span className="text-indigo-300 font-medium truncate max-w-[110px]">{selectedElement.label}</span>
                  <button
                    onClick={() => {
                      if (onSelectElement) onSelectElement(null);
                    }}
                    title="Désélectionner l'élément"
                    className="p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : currentSelectedBlock ? (
                <div className="flex items-center gap-1 font-mono">
                  <span className="text-indigo-300 font-medium truncate max-w-[130px]">{currentSelectedBlock.name}</span>
                  <button
                    onClick={() => onSelectBlock(null)}
                    title="Désélectionner la section"
                    className="p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <span className="text-slate-400 font-mono text-[11px]">
                  Canvas Studio <span className="text-white/30">•</span> {blocks.length} sections
                </span>
              )}
            </div>

            <div className="h-3.5 w-[1px] bg-white/10 shrink-0" />

            {/* 2. Responsive Viewport Mode Switcher */}
            {onViewportChange && (
              <div className="flex items-center bg-black/40 rounded-full p-0.5 border border-white/5 shrink-0">
                <button
                  onClick={() => onViewportChange('desktop')}
                  title="Vue Bureau (1200px)"
                  className={`p-1 rounded-full transition-colors ${
                    viewportMode === 'desktop'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onViewportChange('tablet')}
                  title="Vue Tablette (768px)"
                  className={`p-1 rounded-full transition-colors ${
                    viewportMode === 'tablet'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Tablet className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onViewportChange('mobile')}
                  title="Vue Mobile (390px)"
                  className={`p-1 rounded-full transition-colors ${
                    viewportMode === 'mobile'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="h-3.5 w-[1px] bg-white/10 shrink-0" />

            {/* 3. Interactive Zoom Controller */}
            {onZoomChange && (
              <div className="flex items-center gap-1 bg-black/40 rounded-full px-1.5 py-0.5 border border-white/5 text-[11px] shrink-0 font-mono">
                <button
                  onClick={() => onZoomChange(Math.max(40, zoomLevel - 10))}
                  title="Zoom arrière (-10%)"
                  disabled={zoomLevel <= 40}
                  className="p-0.5 rounded text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onZoomChange(100)}
                  title="Réinitialiser à 100%"
                  className="px-1 text-slate-300 hover:text-white font-medium hover:underline transition-all"
                >
                  {zoomLevel}%
                </button>
                <button
                  onClick={() => onZoomChange(Math.min(160, zoomLevel + 10))}
                  title="Zoom avant (+10%)"
                  disabled={zoomLevel >= 160}
                  className="p-0.5 rounded text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="h-3.5 w-[1px] bg-white/10 shrink-0" />

            {/* 4. Freeform 2D Mode Toggle */}
            {onToggleFreeformMode && (
              <button
                onClick={onToggleFreeformMode}
                title={isFreeformMode ? "Mode Libre 2D actif (Déplacement X/Y libre)" : "Activer le Mode Libre 2D"}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium transition-all shrink-0 ${
                  isFreeformMode
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm shadow-cyan-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10'
                }`}
              >
                <Move className={`w-3 h-3 ${isFreeformMode ? 'text-cyan-300 animate-pulse' : ''}`} />
                <span className="hidden sm:inline">{isFreeformMode ? 'Libre 2D' : 'Mode Libre'}</span>
              </button>
            )}

            {/* 5. Viewport Width Badge */}
            <span className="hidden md:inline text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded-md shrink-0">
              {getViewportWidth()}
            </span>
          </>
        )}
      </div>

      {/* Main Canvas Stage Scroll Area */}
      <main
        onClick={() => onSelectBlock(null)}
        className="flex-1 overflow-auto canvas-grid relative flex justify-center p-4 md:p-8 pt-16 select-none"
      >
        {/* Scaled Device Viewport Frame */}
      <div
        id="canvas-stage"
        style={{
          width: getViewportWidth(),
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: 'top center',
        }}
        className={`transition-all duration-200 shrink-0 pb-36 relative ${
          viewportMode === 'mobile'
            ? 'rounded-[44px] border-[8px] border-[#1e2333] shadow-2xl overflow-hidden bg-[#07090e]'
            : viewportMode === 'tablet'
            ? 'rounded-[28px] border-[6px] border-[#1e2333] shadow-2xl overflow-hidden bg-[#07090e]'
            : 'bg-transparent'
        }`}
      >
        {/* Mobile Notch Bar */}
        {viewportMode === 'mobile' && (
          <div className="h-6 w-full bg-[#121624] flex items-center justify-center relative px-6 text-[10px] text-slate-400 font-mono">
            <span className="text-[9px]">9:41</span>
            <div className="w-20 h-3.5 bg-black rounded-full mx-auto" />
            <div className="flex items-center gap-1 text-[8px]">5G 100%</div>
          </div>
        )}

        {/* Smart Snap Guides Visual Overlay (Magenta & Cyan Laser Alignment Lines) */}
        {Boolean(freeDraggingBlock || freeDraggingCard || freeDraggingPlan || freeDraggingElement) && activeSnapGuides.length > 0 && (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            {activeSnapGuides.map((guide) => {
              const isVertical = guide.orientation === 'vertical';
              const isCyan = guide.color === 'cyan';
              return (
                <div
                  key={guide.id}
                  style={isVertical ? { left: `${guide.positionPercent}%` } : { top: `${guide.positionPercent}%` }}
                  className={`absolute pointer-events-none flex items-center justify-center animate-in fade-in duration-150 ${
                    isVertical
                      ? 'top-0 bottom-0 -translate-x-1/2 w-4 flex-col'
                      : 'left-0 right-0 -translate-y-1/2 h-4'
                  }`}
                >
                  {/* Glowing Laser Guide Line */}
                  <div
                    className={`${
                      isVertical
                        ? 'w-[2px] h-full shadow-[0_0_12px_rgba(6,182,212,1)]'
                        : 'h-[2px] w-full shadow-[0_0_12px_rgba(217,70,239,1)]'
                    } ${isCyan ? 'bg-cyan-400' : 'bg-fuchsia-400'}`}
                    style={{
                      backgroundImage: isVertical
                        ? (isCyan
                            ? 'repeating-linear-gradient(to bottom, #22d3ee 0, #22d3ee 8px, transparent 8px, transparent 14px)'
                            : 'repeating-linear-gradient(to bottom, #e879f9 0, #e879f9 8px, transparent 8px, transparent 14px)')
                        : (isCyan
                            ? 'repeating-linear-gradient(to right, #22d3ee 0, #22d3ee 8px, transparent 8px, transparent 14px)'
                            : 'repeating-linear-gradient(to right, #e879f9 0, #e879f9 8px, transparent 8px, transparent 14px)'),
                    }}
                  />

                  {/* Magnetic Alignment Badge */}
                  <div
                    className={`absolute px-3 py-1 rounded-full text-[11px] font-mono font-bold shadow-2xl backdrop-blur-xl border flex items-center gap-1.5 whitespace-nowrap ${
                      isVertical ? 'top-6' : 'left-8'
                    } ${
                      isCyan
                        ? 'bg-[#041624]/95 border-cyan-400 text-cyan-200 shadow-cyan-500/40 ring-1 ring-cyan-500/40'
                        : 'bg-[#24041e]/95 border-fuchsia-400 text-fuchsia-200 shadow-fuchsia-500/40 ring-1 ring-fuchsia-500/40'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isCyan ? 'bg-cyan-400' : 'bg-fuchsia-400'}`} />
                    <span>{guide.label}</span>
                    {guide.coordText && (
                      <span className="opacity-70 text-[10px]">({guide.coordText})</span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Magnetic Crosshair Target if both axes are snapped */}
            {activeSnapGuides.some((g) => g.orientation === 'vertical') &&
              activeSnapGuides.some((g) => g.orientation === 'horizontal') && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full border-2 border-cyan-400/80 animate-ping opacity-60 shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
                  <div className="absolute w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 to-fuchsia-400 shadow-2xl flex items-center justify-center text-[10px] text-black font-black">
                    ⌖
                  </div>
                </div>
              )}
          </div>
        )}

        {/* WEBSITE CONTENT RENDER CANVAS */}
        <div className="space-y-4 relative">
          {blocks
            .filter((b) => !b.layout.isHidden)
            .map((block, blockIndex) => {
              const isSelected = selectedBlockId === block.id && !isPreviewMode;
              const isBeingDragged = draggedBlockId === block.id;
              const isDropTargetBefore = dragOverIndex === blockIndex && dragPosition === 'before' && !isBeingDragged;
              const isDropTargetAfter = dragOverIndex === blockIndex && dragPosition === 'after' && !isBeingDragged;

              const isThisBlockFreeDragging = freeDraggingBlock?.id === block.id;
              const offsetX = isThisBlockFreeDragging ? freeDraggingBlock.currentX : (block.layout.x || 0);
              const offsetY = isThisBlockFreeDragging ? freeDraggingBlock.currentY : (block.layout.y || 0);
              const hasOffset = offsetX !== 0 || offsetY !== 0;

              return (
                <React.Fragment key={block.id}>
                  {/* Drop indicator above block */}
                  {isDropTargetBefore && (
                    <div className="w-full py-2 flex items-center justify-center animate-in fade-in duration-150">
                      <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500 shadow-xl shadow-indigo-500/50 flex items-center justify-center relative">
                        <span className="absolute text-[10px] font-mono font-bold text-white bg-indigo-950 px-3 py-0.5 rounded-full border border-indigo-400 shadow-md">
                          Déposer ici (au-dessus)
                        </span>
                      </div>
                    </div>
                  )}

                  <div
                    id={`block-${block.id}`}
                    onDragOver={(e) => handleBlockDragOver(e, blockIndex)}
                    onDrop={(e) => handleBlockDrop(e, blockIndex)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isPreviewMode) onSelectBlock(block.id);
                    }}
                    style={{
                      transform: (hasOffset || isThisBlockFreeDragging)
                        ? `translate3d(${offsetX}px, ${offsetY}px, 0px)`
                        : undefined,
                      zIndex: isThisBlockFreeDragging ? 60 : isSelected ? 20 : undefined,
                      transition: isThisBlockFreeDragging ? 'none' : 'transform 0.15s ease-out',
                    }}
                    className={`relative group/block ${
                      isThisBlockFreeDragging
                        ? 'cursor-grabbing shadow-2xl shadow-cyan-500/20 ring-2 ring-cyan-400 rounded-2xl'
                        : isBeingDragged
                        ? 'opacity-30 border-2 border-dashed border-indigo-400 scale-[0.98]'
                        : isSelected
                        ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#07090e] shadow-2xl shadow-indigo-500/20 rounded-2xl'
                        : !isPreviewMode
                        ? 'hover:ring-1 hover:ring-indigo-400/40 rounded-2xl'
                        : ''
                    }`}
                  >
                    {/* Floating live coordinates HUD during 2D free dragging */}
                    {isThisBlockFreeDragging && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#080d1a]/95 border border-cyan-400 text-white text-xs font-mono shadow-2xl shadow-cyan-500/30 backdrop-blur-xl pointer-events-none">
                        <Move className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        <span>X: <strong className={offsetX !== 0 ? 'text-cyan-300' : 'text-slate-400'}>{offsetX > 0 ? `+${offsetX}` : offsetX}px</strong></span>
                        <span className="text-white/20">|</span>
                        <span>Y: <strong className={offsetY !== 0 ? 'text-cyan-300' : 'text-slate-400'}>{offsetY > 0 ? `+${offsetY}` : offsetY}px</strong></span>
                        {offsetX === 0 && (
                          <span className="text-[10px] font-sans font-bold text-emerald-300 bg-emerald-500/25 px-1.5 py-0.5 rounded border border-emerald-400/40">
                            Centré
                          </span>
                        )}
                      </div>
                    )}

                    {/* Tactile Side Grip Handle for free 2D mouse drag or list reorder */}
                    {!isPreviewMode && (
                      <div
                        onPointerDown={(e) => handleStartBlockFreeDrag(e, block)}
                        draggable
                        onDragStart={(e) => handleBlockDragStart(e, block.id)}
                        onDragEnd={handleBlockDragEnd}
                        title="Maintenez le clic et déplacez librement cette section avec la souris dans toutes les directions (X, Y)"
                        className="absolute -left-3.5 top-1/2 -translate-y-1/2 z-30 hidden md:flex items-center justify-center w-8 h-12 rounded-xl bg-[#0c101c]/95 border border-cyan-500/50 shadow-xl shadow-cyan-500/25 text-cyan-300 hover:text-white hover:bg-cyan-600 cursor-grab active:cursor-grabbing opacity-0 group-hover/block:opacity-100 transition-all hover:scale-110 active:scale-95"
                      >
                        <Move className="w-4 h-4" />
                      </div>
                    )}

                    {/* FLOATING ACTION TOOLBAR ATTACHED DIRECTLY ON THE BLOCK */}
                    {!isPreviewMode && (isSelected || selectedBlockId === null) && (
                      <div
                        className={`absolute -top-10 left-4 z-30 flex items-center gap-1.5 p-1 rounded-xl bg-[#0c101c]/95 border border-white/15 shadow-2xl backdrop-blur-xl transition-all ${
                          isSelected ? 'opacity-100 scale-100' : 'opacity-0 group-hover/block:opacity-100 scale-95 group-hover/block:scale-100'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* 2D Freeform Move Handle */}
                        <div
                          onPointerDown={(e) => handleStartBlockFreeDrag(e, block)}
                          title="Maintenez le clic gauche et déplacez librement cette section en 2D (X, Y)"
                          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/60 border border-cyan-400/50 text-cyan-200 cursor-grab active:cursor-grabbing text-[11px] font-semibold select-none transition-all hover:scale-105 active:scale-95 shadow-sm"
                        >
                          <Move className="w-3.5 h-3.5 text-cyan-300" />
                          <span>Déplacer librement</span>
                        </div>

                        {/* Reset to center if offset */}
                        {hasOffset && (
                          <button
                            onClick={() => {
                              onUpdateBlock({
                                ...block,
                                layout: {
                                  ...block.layout,
                                  x: 0,
                                  y: 0,
                                  isFreePosition: false,
                                },
                              });
                            }}
                            title="Recentrer cette section (X: 0, Y: 0)"
                            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-[10px] font-mono border border-white/10 transition-colors"
                          >
                            <RotateCcw className="w-3 h-3 text-cyan-400" />
                            <span>Recentrer ({offsetX}, {offsetY})</span>
                          </button>
                        )}

                        {/* Block Name Badge */}
                        <span className="text-[10px] font-semibold text-indigo-300 font-mono px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30">
                          {block.name}
                        </span>

                        <div className="h-3 w-[1px] bg-white/10 mx-0.5" />

                        {/* List Reorder Slot Drag Handle */}
                        <div
                          draggable
                          onDragStart={(e) => handleBlockDragStart(e, block.id)}
                          onDragEnd={handleBlockDragEnd}
                          title="Glisser pour insérer dans la liste"
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-slate-400 hover:text-white hover:bg-white/10 cursor-grab text-[10px]"
                        >
                          <GripVertical className="w-3 h-3" />
                        </div>

                        {/* Move Up / Down Buttons */}
                        <button
                          onClick={() => onMoveBlock(block.id, 'up')}
                          disabled={blockIndex === 0}
                          title="Monter cette section"
                          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onMoveBlock(block.id, 'down')}
                          disabled={blockIndex === blocks.length - 1}
                          title="Descendre cette section"
                          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>

                      {/* Block-specific tools */}
                      {block.type === 'featureGrid' && (
                        <div className="flex items-center gap-1 bg-black/40 px-1 py-0.5 rounded-lg border border-white/5">
                          <LayoutGrid className="w-3 h-3 text-slate-400 ml-1" />
                          {[2, 3, 4].map((cols) => (
                            <button
                              key={cols}
                              onClick={() => {
                                onUpdateBlock({
                                  ...block,
                                  content: { ...block.content, gridColumns: cols },
                                });
                              }}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                                (block.content.gridColumns || 3) === cols
                                  ? 'bg-indigo-600 text-white font-bold'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {cols}c
                            </button>
                          ))}
                          <button
                            onClick={() => {
                              const currentFeatures = block.content.features || [];
                              const newFeature = {
                                id: `feat-${Date.now()}`,
                                icon: 'Zap',
                                title: 'Nouvelle Fonctionnalité',
                                description: 'Description instantanément modifiable en direct.',
                                tag: 'Nouveau',
                              };
                              onUpdateBlock({
                                ...block,
                                content: {
                                  ...block.content,
                                  features: [...currentFeatures, newFeature],
                                },
                              });
                            }}
                            className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40 font-medium ml-1"
                          >
                            + Carte
                          </button>
                        </div>
                      )}

                      {block.type === 'pricing' && (
                        <button
                          onClick={() => {
                            const plans = block.content.pricingPlans || [];
                            const newPlan = {
                              id: `plan-${Date.now()}`,
                              name: 'Enterprise Ultra',
                              priceMonthly: 89,
                              priceAnnual: 69,
                              description: 'Pour les équipes à forte volumétrie.',
                              features: ['Clusters GPU dédiés', 'SLA 99.99%', 'Support dédié 24/7'],
                              ctaText: 'Contacter l&apos;équipe',
                              isPopular: false,
                            };
                            onUpdateBlock({
                              ...block,
                              content: {
                                ...block.content,
                                pricingPlans: [...plans, newPlan],
                              },
                            });
                          }}
                          className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40 font-medium"
                        >
                          + Forfait
                        </button>
                      )}

                      {/* Quick Spacing & Width Controls */}
                      <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded-lg border border-white/5">
                        {/* Max Width */}
                        <button
                          onClick={() => {
                            const widths = ['800px', '1200px', '100%'];
                            const curr = block.style?.maxWidth || '1200px';
                            const next = widths[(widths.indexOf(curr) + 1) % widths.length];
                            onUpdateBlock({
                              ...block,
                              style: { ...block.style, maxWidth: next },
                            });
                          }}
                          title={`Largeur max: ${block.style?.maxWidth || '1200px'} (cliquer pour changer)`}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        >
                          {block.style?.maxWidth === '800px' ? '800px' : block.style?.maxWidth === '100%' ? '100%' : '1200px'}
                        </button>

                        {/* Padding */}
                        <button
                          onClick={() => {
                            const paddings = [24, 48, 80];
                            const curr = block.style?.paddingTop || 48;
                            const next = paddings[(paddings.indexOf(curr) + 1) % paddings.length];
                            onUpdateBlock({
                              ...block,
                              style: { ...block.style, paddingTop: next, paddingBottom: next },
                            });
                          }}
                          title={`Espacement vertical: ${block.style?.paddingTop || 48}px (cliquer pour changer)`}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        >
                          P:{block.style?.paddingTop || 48}px
                        </button>
                      </div>

                      {/* Quick Background Color Switch */}
                      <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded-lg border border-white/5">
                        <Palette className="w-3 h-3 text-slate-400" />
                        {bgPresets.map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              onUpdateBlock({
                                ...block,
                                style: {
                                  ...block.style,
                                  backgroundColor: preset.color,
                                },
                              });
                            }}
                            title={`Fond: ${preset.label}`}
                            className="w-3.5 h-3.5 rounded-full border border-white/20 transition-transform hover:scale-125"
                            style={{ backgroundColor: preset.color }}
                          />
                        ))}
                      </div>

                      {/* Duplicate */}
                      <button
                        onClick={() => onDuplicateBlock(block.id)}
                        title="Dupliquer"
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteBlock(block.id)}
                        title="Supprimer la section"
                        className="p-1 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Motion Animation Wrapper */}
                  <motion.div
                    {...resolveFramerAnimation(block, 'block', hoveredElements[block.id] === block.style?.hoverTriggerSource)}
                    className="w-full flex flex-col items-center"
                    {...(block.style?.hoverTriggerSource === 'block' ? {
                      onMouseEnter: () => setHoveredElements(prev => ({ ...prev, [block.id]: 'block' })),
                      onMouseLeave: () => setHoveredElements(prev => ({ ...prev, [block.id]: 'none' }))
                    } : {})}
                  >
                  {/* 1. HEADER BLOCK */}
                  {block.type === 'header' && (
                    <header className="w-full px-4 md:px-6">
                      <div
                        style={getBlockContainerStyle(block)}
                        className="flex items-center justify-between shadow-2xl"
                      >
                        {/* Logo & Brand Name (Inline Editable & 2D Movable) */}
                        {renderMovable({
                          block,
                          elementKey: 'brand',
                          label: 'Logo & Marque',
                          inline: true,
                          children: (
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0"
                                style={{
                                  background: `linear-gradient(135deg, ${themeAccent}, #a855f7)`,
                                }}
                              >
                                <Boxes className="w-4 h-4" />
                              </div>
                               <span
                                className="font-bold tracking-wider text-base"
                                style={{ color: getElemTextColor(block, 'brand', true, '#ffffff') }}
                              >
                                <InlineText
                                  value={block.content.title || 'SYNAPSE AI'}
                                  onChange={(val) => {
                                    onUpdateBlock({
                                      ...block,
                                      content: { ...block.content, title: val },
                                    });
                                  }}
                                  disabled={isPreviewMode}
                                />
                              </span>
                            </div>
                          ),
                        })}

                        {/* Nav Links (Inline Editable, Removable & 2D Movable) */}
                        {renderMovable({
                          block,
                          elementKey: 'nav',
                          label: 'Menu Navigation',
                          inline: true,
                          children: (
                            <nav
                              className="hidden md:flex items-center gap-6 text-xs font-medium"
                              style={{ color: getElemTextColor(block, 'nav', false, '#94a3b8') }}
                            >
                              {block.content.links?.map((l, lIdx) => (
                                <div key={lIdx} className="relative group/link flex items-center">
                                  <InlineText
                                    value={l.label}
                                    onChange={(val) => {
                                      const updatedLinks = [...(block.content.links || [])];
                                      updatedLinks[lIdx] = { ...updatedLinks[lIdx], label: val };
                                      onUpdateBlock({
                                        ...block,
                                        content: { ...block.content, links: updatedLinks },
                                      });
                                    }}
                                    disabled={isPreviewMode}
                                    className="hover:text-white transition-colors"
                                  />
                                  {!isPreviewMode && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const updatedLinks = block.content.links?.filter((_, idx) => idx !== lIdx);
                                        onUpdateBlock({
                                          ...block,
                                          content: { ...block.content, links: updatedLinks },
                                        });
                                      }}
                                      title="Retirer ce lien"
                                      className="ml-1 opacity-0 group-hover/link:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              ))}
                              {!isPreviewMode && (
                                <button
                                  onClick={() => {
                                    const currentLinks = block.content.links || [];
                                    onUpdateBlock({
                                      ...block,
                                      content: {
                                        ...block.content,
                                        links: [...currentLinks, { label: 'Nouveau Lien', href: '#' }],
                                      },
                                    });
                                  }}
                                  className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                >
                                  + Lien
                                </button>
                              )}
                            </nav>
                          ),
                        })}

                        {/* CTA Buttons (Inline Editable & 2D Movable) */}
                        <div className="flex items-center gap-2.5">
                          {renderMovable({
                            block,
                            elementKey: 'secondaryCta',
                            label: 'Bouton Connexion',
                            inline: true,
                            children: (() => {
                              const secStyle = getElemStyle(block, 'secondaryCta');
                              return (
                                <button
                                  className="hidden sm:inline-flex text-xs hover:text-white px-3 py-1.5 font-medium transition-colors rounded-lg"
                                  style={{
                                    color: getElemTextColor(block, 'secondaryCta', false, '#cbd5e1'),
                                    ...secStyle,
                                  }}
                                >
                                  <InlineText
                                    value={block.content.secondaryCtaText || 'Connexion'}
                                    onChange={(val) => {
                                      onUpdateBlock({
                                        ...block,
                                        content: { ...block.content, secondaryCtaText: val },
                                      });
                                    }}
                                    disabled={isPreviewMode}
                                  />
                                </button>
                              );
                            })(),
                          })}
                          {renderMovable({
                            block,
                            elementKey: 'primaryCta',
                            label: 'Bouton Commencer',
                            inline: true,
                            children: (() => {
                              const priStyle = getElemStyle(block, 'primaryCta');
                              return (
                                <button
                                  className="text-xs text-white font-medium px-4 py-2 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                                  style={{
                                    background: priStyle.backgroundColor || `linear-gradient(135deg, ${themeAccent}, #a855f7)`,
                                    color: getElemTextColor(block, 'primaryCta', false, '#ffffff'),
                                    boxShadow: priStyle.boxShadow || `0 4px 14px ${themeAccent}40`,
                                    ...priStyle,
                                  }}
                                >
                                  <InlineText
                                    value={block.content.primaryCtaText || 'Commencer'}
                                    onChange={(val) => {
                                      onUpdateBlock({
                                        ...block,
                                        content: { ...block.content, primaryCtaText: val },
                                      });
                                    }}
                                    disabled={isPreviewMode}
                                  />
                                </button>
                              );
                            })(),
                          })}
                        </div>
                      </div>
                    </header>
                  )}

                  {/* 2. HERO SECTION */}
                  {block.type === 'hero' && (
                    <section
                      style={getBlockContainerStyle(block)}
                      className="relative text-center flex flex-col items-center"
                    >
                      {/* Badge (Inline Editable & 2D Movable) */}
                      {block.content.badgeText && (
                        renderMovable({
                          block,
                          elementKey: 'badge',
                          label: 'Badge',
                          inline: true,
                          className: 'mb-6',
                          children: (() => {
                            const badgeCustom = getElemStyle(block, 'badge');
                            const badgeColor = getElemTextColor(block, 'badge', false, '#a5b4fc');
                            return (
                              <div
                                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium backdrop-blur-md"
                                style={{
                                  color: badgeColor,
                                  background: badgeCustom.backgroundColor,
                                  ...badgeCustom,
                                }}
                              >
                                <Sparkles className="w-3 h-3 text-indigo-400" style={{ color: badgeColor }} />
                                <InlineText
                                  value={block.content.badgeText}
                                  onChange={(val) => {
                                    onUpdateBlock({
                                      ...block,
                                      content: { ...block.content, badgeText: val },
                                    });
                                  }}
                                  disabled={isPreviewMode}
                                />
                              </div>
                            );
                          })(),
                        })
                      )}

                      {/* Title & Highlighted Text (Inline Editable & 2D Movable) */}
                      {renderMovable({
                        block,
                        elementKey: 'title',
                        label: 'Titre Principal',
                        className: 'w-full flex justify-center',
                        children: (
                          <div className="w-full text-center flex flex-col items-center">
                            <h1
                              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] max-w-3xl"
                              style={{ color: getElemTextColor(block, 'title', true, '#ffffff') }}
                            >
                              <InlineText
                                value={block.content.title || ''}
                                onChange={(val) => {
                                  onUpdateBlock({
                                    ...block,
                                    content: { ...block.content, title: val },
                                  });
                                }}
                                disabled={isPreviewMode}
                              />{' '}
                              <span
                                className="bg-clip-text text-transparent inline-block"
                                style={{
                                  backgroundImage: `linear-gradient(135deg, ${themeAccent}, #c084fc, #f472b6)`,
                                }}
                              >
                                <InlineText
                                  value={block.content.titleHighlight || ''}
                                  onChange={(val) => {
                                    onUpdateBlock({
                                      ...block,
                                      content: { ...block.content, titleHighlight: val },
                                    });
                                  }}
                                  disabled={isPreviewMode}
                                />
                              </span>
                            </h1>
                          </div>
                        ),
                      })}

                      {/* Subtitle (Inline Editable & 2D Movable) */}
                      {renderMovable({
                        block,
                        elementKey: 'subtitle',
                        label: 'Sous-titre',
                        className: 'w-full flex justify-center mt-5',
                        children: (
                          <p
                            className="text-sm sm:text-base max-w-2xl leading-relaxed"
                            style={{ color: getElemTextColor(block, 'subtitle', false, '#94a3b8') }}
                          >
                            <InlineText
                              value={block.content.subtitle || ''}
                              onChange={(val) => {
                                onUpdateBlock({
                                  ...block,
                                  content: { ...block.content, subtitle: val },
                                });
                              }}
                              disabled={isPreviewMode}
                              multiline
                            />
                          </p>
                        ),
                      })}

                      {/* CTAs (Inline Editable & 2D Movable) */}
                      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        {renderMovable({
                          block,
                          elementKey: 'primaryCta',
                          label: 'Bouton CTA 1',
                          inline: true,
                          children: (() => {
                            const heroPriStyle = getElemStyle(block, 'primaryCta');
                            return (
                              <div className="inline-block">
                                <button
                                  className="inline-flex items-center gap-2 text-white font-medium px-6 py-3 rounded-xl shadow-xl transition-all hover:scale-[1.02] text-xs sm:text-sm"
                                  style={{
                                    background: heroPriStyle.backgroundColor || `linear-gradient(135deg, ${themeAccent}, #9333ea)`,
                                    boxShadow: heroPriStyle.boxShadow || `0 8px 24px ${themeAccent}40`,
                                    color: getElemTextColor(block, 'primaryCta', false, '#ffffff'),
                                    ...heroPriStyle,
                                  }}
                                >
                                  <InlineText
                                    value={block.content.primaryCtaText || 'Découvrir'}
                                    onChange={(val) => {
                                      onUpdateBlock({
                                        ...block,
                                        content: { ...block.content, primaryCtaText: val },
                                      });
                                    }}
                                    disabled={isPreviewMode}
                                  />
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          })(),
                        })}

                        {renderMovable({
                          block,
                          elementKey: 'secondaryCta',
                          label: 'Bouton CTA 2',
                          inline: true,
                          children: (() => {
                            const heroSecStyle = getElemStyle(block, 'secondaryCta');
                            return (
                              <button
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 font-medium transition-all text-xs sm:text-sm backdrop-blur-md"
                                style={{
                                  color: getElemTextColor(block, 'secondaryCta', false, '#e2e8f0'),
                                  ...heroSecStyle,
                                }}
                              >
                                <InlineText
                                  value={block.content.secondaryCtaText || 'En savoir plus'}
                                  onChange={(val) => {
                                    onUpdateBlock({
                                      ...block,
                                      content: { ...block.content, secondaryCtaText: val },
                                    });
                                  }}
                                  disabled={isPreviewMode}
                                />
                              </button>
                            );
                          })(),
                        })}
                      </div>
                    </section>
                  )}

                  {/* 3. 3D INTERACTIVE WEBGL CANVAS WIDGET */}
                  {block.type === 'canvas3d' && (
                    <div style={getBlockContainerStyle(block)}>
                      {renderMovable({
                        block,
                        elementKey: 'widget3d',
                        label: 'Widget 3D Spatial',
                        children: (
                          <div
                            style={{
                              backgroundColor: block.style.backgroundColor || 'rgba(13, 17, 27, 0.65)',
                              borderRadius: `${block.style.borderRadius ?? 24}px`,
                              borderColor: block.style.borderColor || 'rgba(99, 102, 241, 0.25)',
                              borderWidth: `${block.style.borderWidth ?? 1}px`,
                              borderStyle: (block.style.borderWidth ?? 1) > 0 ? 'solid' : undefined,
                              backdropFilter: block.style.backdropBlur ? `blur(${block.style.backdropBlur}px)` : undefined,
                              WebkitBackdropFilter: block.style.backdropBlur ? `blur(${block.style.backdropBlur}px)` : undefined,
                            }}
                            className="relative w-full overflow-hidden shadow-2xl"
                          >
                            <ThreeDCanvasWidget
                              config={block.threeConfig}
                              isSelected={isSelected || !isPreviewMode}
                              onUpdateConfig={(newCfg) => {
                                onUpdateBlock({
                                  ...block,
                                  threeConfig: {
                                    ...(block.threeConfig as ThreeDConfig),
                                    ...newCfg,
                                  },
                                });
                              }}
                            />
                          </div>
                        ),
                      })}
                    </div>
                  )}

                  {/* 3b. 2D INTERACTIVE GRAPHICS STUDIO WIDGET */}
                  {block.type === 'canvas2d' && (
                    <div style={getBlockContainerStyle(block)}>
                      {renderMovable({
                        block,
                        elementKey: 'widget2d',
                        label: 'Studio 2D Vectoriel',
                        children: (
                          <div
                            style={{
                              backgroundColor: block.style.backgroundColor || 'rgba(13, 17, 27, 0.65)',
                              borderRadius: `${block.style.borderRadius ?? 24}px`,
                              borderColor: block.style.borderColor || 'rgba(99, 102, 241, 0.25)',
                              borderWidth: `${block.style.borderWidth ?? 1}px`,
                              borderStyle: (block.style.borderWidth ?? 1) > 0 ? 'solid' : undefined,
                              backdropFilter: block.style.backdropBlur ? `blur(${block.style.backdropBlur}px)` : undefined,
                              WebkitBackdropFilter: block.style.backdropBlur ? `blur(${block.style.backdropBlur}px)` : undefined,
                            }}
                            className="relative w-full overflow-hidden shadow-2xl"
                          >
                            <TwoDCanvasWidget
                              config={block.twoConfig}
                              isSelected={isSelected || !isPreviewMode}
                              onUpdateConfig={(newCfg) => {
                                onUpdateBlock({
                                  ...block,
                                  twoConfig: {
                                    ...(block.twoConfig as TwoDConfig),
                                    ...newCfg,
                                  },
                                });
                              }}
                            />
                          </div>
                        ),
                      })}
                    </div>
                  )}

                  {/* 4. FEATURE BENTO GRID */}
                  {block.type === 'featureGrid' && (
                    <section style={getBlockContainerStyle(block)} className="relative">
                      <div className="text-center max-w-2xl mx-auto mb-10 flex flex-col items-center">
                        {renderMovable({
                          block,
                          elementKey: 'featuresBadge',
                          label: 'Badge Fonctionnalités',
                          inline: true,
                          className: 'mb-1.5',
                          children: (() => {
                            const badgeCustom = getElemStyle(block, 'featuresBadge');
                            return (
                              <p
                                className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                                style={{
                                  color: getElemTextColor(block, 'featuresBadge', false, themeAccent),
                                  background: badgeCustom.backgroundColor,
                                  ...badgeCustom,
                                }}
                              >
                                <InlineText
                                  value={block.content.badgeText || 'FONCTIONNALITÉS'}
                                  onChange={(val) => {
                                    onUpdateBlock({
                                      ...block,
                                      content: { ...block.content, badgeText: val },
                                    });
                                  }}
                                  disabled={isPreviewMode}
                                />
                              </p>
                            );
                          })(),
                        })}

                        {renderMovable({
                          block,
                          elementKey: 'featuresTitle',
                          label: 'Titre Fonctionnalités',
                          className: 'w-full flex justify-center',
                          children: (
                            <h2
                              className="text-2xl sm:text-3xl font-bold tracking-tight"
                              style={{ color: getElemTextColor(block, 'featuresTitle', true, '#ffffff') }}
                            >
                              <InlineText
                                value={block.content.title || ''}
                                onChange={(val) => {
                                  onUpdateBlock({
                                    ...block,
                                    content: { ...block.content, title: val },
                                  });
                                }}
                                disabled={isPreviewMode}
                              />
                            </h2>
                          ),
                        })}

                        {renderMovable({
                          block,
                          elementKey: 'featuresSubtitle',
                          label: 'Sous-titre Fonctionnalités',
                          className: 'w-full flex justify-center mt-2',
                          children: (
                            <p
                              className="text-xs sm:text-sm"
                              style={{ color: getElemTextColor(block, 'featuresSubtitle', false, '#94a3b8') }}
                            >
                              <InlineText
                                value={block.content.subtitle || ''}
                                onChange={(val) => {
                                  onUpdateBlock({
                                    ...block,
                                    content: { ...block.content, subtitle: val },
                                  });
                                }}
                                disabled={isPreviewMode}
                                multiline
                              />
                            </p>
                          ),
                        })}
                      </div>

                      <div
                        className={`grid grid-cols-1 ${
                          block.content.gridColumns === 2
                            ? 'md:grid-cols-2'
                            : block.content.gridColumns === 4
                            ? 'md:grid-cols-2 lg:grid-cols-4'
                            : 'md:grid-cols-3'
                        } gap-4`}
                      >
                        {block.content.features?.map((feat, fIdx) => {
                          const isCardBeingDragged = draggedFeatureIdx?.blockId === block.id && draggedFeatureIdx?.index === fIdx;
                          const isCardDropTarget = dragOverFeatureIdx === fIdx && draggedFeatureIdx?.blockId === block.id && !isCardBeingDragged;

                          const isThisCardFreeDragging = freeDraggingCard?.blockId === block.id && freeDraggingCard?.index === fIdx;
                          const cardOffsetX = isThisCardFreeDragging ? freeDraggingCard.currentX : (feat.x || 0);
                          const cardOffsetY = isThisCardFreeDragging ? freeDraggingCard.currentY : (feat.y || 0);
                          const hasCardOffset = cardOffsetX !== 0 || cardOffsetY !== 0;

                          return (
                            <div
                              key={feat.id}
                              draggable={!isPreviewMode}
                              onDragStart={(e) => handleFeatureDragStart(e, block.id, fIdx)}
                              onDragOver={(e) => handleFeatureDragOver(e, fIdx)}
                              onDrop={(e) => handleFeatureDrop(e, block, fIdx)}
                              style={{
                                transform: (hasCardOffset || isThisCardFreeDragging)
                                  ? `translate3d(${cardOffsetX}px, ${cardOffsetY}px, 0px)`
                                  : undefined,
                                zIndex: isThisCardFreeDragging ? 40 : undefined,
                                transition: isThisCardFreeDragging ? 'none' : 'transform 0.15s ease-out',
                              }}
                              className={`p-5 rounded-2xl bg-[#0e1320]/75 border transition-all duration-200 group/card relative ${
                                isThisCardFreeDragging
                                  ? 'cursor-grabbing border-cyan-400 ring-2 ring-cyan-400/50 shadow-2xl shadow-cyan-500/25 scale-[1.02]'
                                  : isCardBeingDragged
                                  ? 'opacity-25 border-dashed border-indigo-400 scale-95'
                                  : isCardDropTarget
                                  ? 'border-indigo-400 ring-2 ring-indigo-500/50 scale-[1.02] shadow-xl shadow-indigo-500/20'
                                  : 'border-white/5 hover:border-indigo-500/30'
                              }`}
                            >
                              {/* Floating live coordinate badge when dragging card */}
                              {isThisCardFreeDragging && (
                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#080d1a]/95 border border-cyan-400 text-white text-[10px] font-mono shadow-xl pointer-events-none whitespace-nowrap">
                                  <Move className="w-2.5 h-2.5 text-cyan-300 animate-pulse" />
                                  <span>X: {cardOffsetX > 0 ? `+${cardOffsetX}` : cardOffsetX}px</span>
                                  <span className="text-white/20">|</span>
                                  <span>Y: {cardOffsetY > 0 ? `+${cardOffsetY}` : cardOffsetY}px</span>
                                </div>
                              )}

                              {/* Drag handle and delete button in edit mode */}
                              {!isPreviewMode && (
                                <div className="absolute top-3 right-3 flex items-center gap-1">
                                  {/* Freeform 2D handle */}
                                  <div
                                    onPointerDown={(e) => handleStartCardFreeDrag(e, block.id, fIdx, feat.x || 0, feat.y || 0)}
                                    className="p-1 rounded text-cyan-400 hover:text-white hover:bg-cyan-500/20 cursor-grab active:cursor-grabbing opacity-70 group-hover/card:opacity-100 transition-all flex items-center gap-1"
                                    title="Maintenez le clic et déplacez librement cette carte en 2D (X, Y) avec la souris"
                                  >
                                    <Move className="w-3.5 h-3.5" />
                                  </div>

                                  {/* Reset position button if offset */}
                                  {hasCardOffset && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const updated = [...(block.content.features || [])];
                                        updated[fIdx] = { ...updated[fIdx], x: 0, y: 0 };
                                        onUpdateBlock({
                                          ...block,
                                          content: { ...block.content, features: updated },
                                        });
                                      }}
                                      title="Recentrer cette carte"
                                      className="p-1 rounded text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-colors"
                                    >
                                      <RotateCcw className="w-3 h-3" />
                                    </button>
                                  )}

                                  {/* Reorder in grid slot handle */}
                                  <div
                                    className="p-1 rounded text-slate-500 hover:text-indigo-300 cursor-grab active:cursor-grabbing opacity-0 group-hover/card:opacity-100 transition-opacity"
                                    title="Glissez dans une autre case pour intervertir"
                                  >
                                    <GripVertical className="w-3.5 h-3.5" />
                                  </div>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const updated = block.content.features?.filter((_, idx) => idx !== fIdx);
                                      onUpdateBlock({
                                        ...block,
                                        content: { ...block.content, features: updated },
                                      });
                                    }}
                                    title="Supprimer cette carte"
                                    className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover/card:opacity-100 transition-opacity"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}

                            <motion.div 
                              {...resolveFramerAnimation(block, 'visuals', hoveredElements[block.id] === block.style?.hoverTriggerSource)} 
                              className="w-full h-full flex flex-col justify-between"
                              {...(block.style?.hoverTriggerSource === 'visuals' ? {
                                onMouseEnter: () => setHoveredElements(prev => ({ ...prev, [block.id]: 'visuals' })),
                                onMouseLeave: () => setHoveredElements(prev => ({ ...prev, [block.id]: 'none' }))
                              } : {})}
                            >
                            <div className="flex items-center justify-between mb-3">
                              {/* Clickable icon to cycle icon type */}
                              <button
                                onClick={() => {
                                  if (isPreviewMode) return;
                                  const updatedFeatures = [...(block.content.features || [])];
                                  updatedFeatures[fIdx].icon = nextIcon(feat.icon);
                                  onUpdateBlock({
                                    ...block,
                                    content: { ...block.content, features: updatedFeatures },
                                  });
                                }}
                                title={!isPreviewMode ? 'Cliquez pour changer d&apos;icône' : undefined}
                                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                                style={{
                                  backgroundColor: `${themeAccent}15`,
                                  color: themeAccent,
                                }}
                              >
                                {getFeatureIcon(feat.icon)}
                              </button>

                              {feat.tag && (
                                renderMovable({
                                  block,
                                  elementKey: `feat-${feat.id}-tag`,
                                  label: 'Badge Carte',
                                  inline: true,
                                  children: (() => {
                                    const tagCustom = getElemStyle(block, `feat-${feat.id}-tag`);
                                    return (
                                      <span
                                        className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/5 text-slate-400"
                                        style={{
                                          color: getElemTextColor(block, `feat-${feat.id}-tag`, false, '#94a3b8'),
                                          background: tagCustom.backgroundColor,
                                          ...tagCustom,
                                        }}
                                      >
                                        <InlineText
                                          value={feat.tag}
                                          onChange={(val) => {
                                            const updatedFeatures = [...(block.content.features || [])];
                                            updatedFeatures[fIdx].tag = val;
                                            onUpdateBlock({
                                              ...block,
                                              content: { ...block.content, features: updatedFeatures },
                                            });
                                          }}
                                          disabled={isPreviewMode}
                                        />
                                      </span>
                                    );
                                  })(),
                                })
                              )}
                            </div>

                            {renderMovable({
                              block,
                              elementKey: `feat-${feat.id}-title`,
                              label: 'Titre Carte',
                              children: (
                                <h3
                                  className="text-sm font-semibold mb-1.5"
                                  style={{ color: getElemTextColor(block, `feat-${feat.id}-title`, true, '#ffffff') }}
                                >
                                  <InlineText
                                    value={feat.title}
                                    onChange={(val) => {
                                      const updatedFeatures = [...(block.content.features || [])];
                                      updatedFeatures[fIdx].title = val;
                                      onUpdateBlock({
                                        ...block,
                                        content: { ...block.content, features: updatedFeatures },
                                      });
                                    }}
                                    disabled={isPreviewMode}
                                  />
                                </h3>
                              ),
                            })}
                            {renderMovable({
                              block,
                              elementKey: `feat-${feat.id}-desc`,
                              label: 'Description Carte',
                              children: (
                                <p
                                  className="text-xs leading-relaxed"
                                  style={{ color: getElemTextColor(block, `feat-${feat.id}-desc`, false, '#94a3b8') }}
                                >
                                  <InlineText
                                    value={feat.description}
                                    onChange={(val) => {
                                      const updatedFeatures = [...(block.content.features || [])];
                                      updatedFeatures[fIdx].description = val;
                                      onUpdateBlock({
                                        ...block,
                                        content: { ...block.content, features: updatedFeatures },
                                      });
                                    }}
                                    disabled={isPreviewMode}
                                    multiline
                                  />
                                </p>
                              ),
                            })}
                            </motion.div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                  )}

                  {/* 5. PRICING SECTION */}
                  {block.type === 'pricing' && (
                    <section style={getBlockContainerStyle(block)} className="relative">
                      <div className="text-center max-w-2xl mx-auto mb-8 flex flex-col items-center">
                        {renderMovable({
                          block,
                          elementKey: 'pricingBadge',
                          label: 'Badge Tarifs',
                          inline: true,
                          className: 'mb-1.5',
                          children: (() => {
                            const badgeCustom = getElemStyle(block, 'pricingBadge');
                            return (
                              <p
                                className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                                style={{
                                  color: getElemTextColor(block, 'pricingBadge', false, themeAccent),
                                  background: badgeCustom.backgroundColor,
                                  ...badgeCustom,
                                }}
                              >
                                <InlineText
                                  value={block.content.badgeText || 'TARIFS'}
                                  onChange={(val) => {
                                    onUpdateBlock({
                                      ...block,
                                      content: { ...block.content, badgeText: val },
                                    });
                                  }}
                                  disabled={isPreviewMode}
                                />
                              </p>
                            );
                          })(),
                        })}

                        {renderMovable({
                          block,
                          elementKey: 'pricingTitle',
                          label: 'Titre Tarifs',
                          className: 'w-full flex justify-center',
                          children: (
                            <h2
                              className="text-2xl sm:text-3xl font-bold tracking-tight"
                              style={{ color: getElemTextColor(block, 'pricingTitle', true, '#ffffff') }}
                            >
                              <InlineText
                                value={block.content.title || ''}
                                onChange={(val) => {
                                  onUpdateBlock({
                                    ...block,
                                    content: { ...block.content, title: val },
                                  });
                                }}
                                disabled={isPreviewMode}
                              />
                            </h2>
                          ),
                        })}

                        {renderMovable({
                          block,
                          elementKey: 'pricingSubtitle',
                          label: 'Sous-titre Tarifs',
                          className: 'w-full flex justify-center mt-2',
                          children: (
                            <p
                              className="text-xs sm:text-sm"
                              style={{ color: getElemTextColor(block, 'pricingSubtitle', false, '#94a3b8') }}
                            >
                              <InlineText
                                value={block.content.subtitle || ''}
                                onChange={(val) => {
                                  onUpdateBlock({
                                    ...block,
                                    content: { ...block.content, subtitle: val },
                                  });
                                }}
                                disabled={isPreviewMode}
                                multiline
                              />
                            </p>
                          ),
                        })}

                        {/* Monthly / Annual Billing Switch (2D Movable) */}
                        {renderMovable({
                          block,
                          elementKey: 'pricingBillingToggle',
                          label: 'Boutons Période (Mensuel / Annuel)',
                          inline: true,
                          className: 'mt-6',
                          children: (
                            <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsAnnualBilling(false);
                                }}
                                className={`px-3 py-1 rounded-lg transition-colors ${
                                  !isAnnualBilling ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400'
                                }`}
                              >
                                Mensuel
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsAnnualBilling(true);
                                }}
                                className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                                  isAnnualBilling ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400'
                                }`}
                              >
                                <span>Annuel</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                                  -20%
                                </span>
                              </button>
                            </div>
                          ),
                        })}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                        {block.content.pricingPlans?.map((plan, pIdx) => {
                          const displayPrice = isAnnualBilling ? plan.priceAnnual : plan.priceMonthly;
                          const isPlanBeingDragged = draggedPlanIdx?.blockId === block.id && draggedPlanIdx?.index === pIdx;
                          const isPlanDropTarget = dragOverPlanIdx === pIdx && draggedPlanIdx?.blockId === block.id && !isPlanBeingDragged;

                          const isThisPlanFreeDragging = freeDraggingPlan?.blockId === block.id && freeDraggingPlan?.index === pIdx;
                          const planOffsetX = isThisPlanFreeDragging ? freeDraggingPlan.currentX : (plan.x || 0);
                          const planOffsetY = isThisPlanFreeDragging ? freeDraggingPlan.currentY : (plan.y || 0);
                          const hasPlanOffset = planOffsetX !== 0 || planOffsetY !== 0;

                          return (
                            <div
                              key={plan.id}
                              draggable={!isPreviewMode}
                              onDragStart={(e) => handlePlanDragStart(e, block.id, pIdx)}
                              onDragOver={(e) => handlePlanDragOver(e, pIdx)}
                              onDrop={(e) => handlePlanDrop(e, block, pIdx)}
                              style={{
                                transform: (hasPlanOffset || isThisPlanFreeDragging)
                                  ? `translate3d(${planOffsetX}px, ${planOffsetY}px, 0px)`
                                  : undefined,
                                zIndex: isThisPlanFreeDragging ? 40 : undefined,
                                transition: isThisPlanFreeDragging ? 'none' : 'transform 0.15s ease-out',
                                borderColor: plan.isPopular ? themeAccent : undefined,
                              }}
                              className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all group/plan ${
                                isThisPlanFreeDragging
                                  ? 'cursor-grabbing border-cyan-400 ring-2 ring-cyan-400/50 shadow-2xl shadow-cyan-500/25 scale-[1.02]'
                                  : isPlanBeingDragged
                                  ? 'opacity-25 border-dashed border-indigo-400 scale-95'
                                  : isPlanDropTarget
                                  ? 'border-indigo-400 ring-2 ring-indigo-500/50 scale-[1.02] shadow-2xl'
                                  : plan.isPopular
                                  ? 'bg-[#121828]/90 border-2 shadow-2xl'
                                  : 'bg-[#0e1320]/75 border border-white/5'
                              }`}
                            >
                              {/* Floating live coordinate badge when dragging plan */}
                              {isThisPlanFreeDragging && (
                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#080d1a]/95 border border-cyan-400 text-white text-[10px] font-mono shadow-xl pointer-events-none whitespace-nowrap">
                                  <Move className="w-2.5 h-2.5 text-cyan-300 animate-pulse" />
                                  <span>X: {planOffsetX > 0 ? `+${planOffsetX}` : planOffsetX}px</span>
                                  <span className="text-white/20">|</span>
                                  <span>Y: {planOffsetY > 0 ? `+${planOffsetY}` : planOffsetY}px</span>
                                </div>
                              )}

                              {/* Drag handle and delete button in edit mode */}
                              {!isPreviewMode && (
                                <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
                                  {/* Freeform 2D handle */}
                                  <div
                                    onPointerDown={(e) => handleStartPlanFreeDrag(e, block.id, pIdx, plan.x || 0, plan.y || 0)}
                                    className="p-1 rounded text-cyan-400 hover:text-white hover:bg-cyan-500/20 cursor-grab active:cursor-grabbing opacity-70 group-hover/plan:opacity-100 transition-all flex items-center gap-1"
                                    title="Maintenez le clic et déplacez librement ce forfait en 2D (X, Y) avec la souris"
                                  >
                                    <Move className="w-3.5 h-3.5" />
                                  </div>

                                  {/* Reset position button if offset */}
                                  {hasPlanOffset && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const updated = [...(block.content.pricingPlans || [])];
                                        updated[pIdx] = { ...updated[pIdx], x: 0, y: 0 };
                                        onUpdateBlock({
                                          ...block,
                                          content: { ...block.content, pricingPlans: updated },
                                        });
                                      }}
                                      title="Recentrer ce forfait"
                                      className="p-1 rounded text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-colors"
                                    >
                                      <RotateCcw className="w-3 h-3" />
                                    </button>
                                  )}

                                  {/* Slot reorder handle */}
                                  <div
                                    className="p-1 rounded text-slate-500 hover:text-indigo-300 cursor-grab active:cursor-grabbing opacity-0 group-hover/plan:opacity-100 transition-opacity"
                                    title="Glissez avec la souris pour intervertir ce forfait"
                                  >
                                    <GripVertical className="w-3.5 h-3.5" />
                                  </div>
                                  {(block.content.pricingPlans?.length || 0) > 1 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const updated = block.content.pricingPlans?.filter((_, idx) => idx !== pIdx);
                                        onUpdateBlock({
                                          ...block,
                                          content: { ...block.content, pricingPlans: updated },
                                        });
                                      }}
                                      title="Supprimer ce forfait"
                                      className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover/plan:opacity-100 transition-opacity"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              )}

                              {plan.isPopular && (
                                renderMovable({
                                  block,
                                  elementKey: `plan-${plan.id}-popularBadge`,
                                  label: 'Badge Populaire',
                                  inline: true,
                                  children: (() => {
                                    const popStyle = getElemStyle(block, `plan-${plan.id}-popularBadge`);
                                    return (
                                      <div
                                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wider shadow"
                                        style={{
                                          background: popStyle.backgroundColor || `linear-gradient(90deg, ${themeAccent}, #a855f7)`,
                                          color: getElemTextColor(block, `plan-${plan.id}-popularBadge`, false, '#ffffff'),
                                          ...popStyle,
                                        }}
                                      >
                                        Plus Populaire
                                      </div>
                                    );
                                  })(),
                                })
                              )}

                              <div>
                                {renderMovable({
                                  block,
                                  elementKey: `plan-${plan.id}-name`,
                                  label: 'Nom du forfait',
                                  children: (
                                    <h3
                                      className="text-base font-bold mb-1"
                                      style={{ color: getElemTextColor(block, `plan-${plan.id}-name`, true, '#ffffff') }}
                                    >
                                      <InlineText
                                        value={plan.name}
                                        onChange={(val) => {
                                          const updated = [...(block.content.pricingPlans || [])];
                                          updated[pIdx].name = val;
                                          onUpdateBlock({
                                            ...block,
                                            content: { ...block.content, pricingPlans: updated },
                                          });
                                        }}
                                        disabled={isPreviewMode}
                                      />
                                    </h3>
                                  ),
                                })}

                                {renderMovable({
                                  block,
                                  elementKey: `plan-${plan.id}-desc`,
                                  label: 'Description du forfait',
                                  children: (
                                    <p
                                      className="text-xs mb-4"
                                      style={{ color: getElemTextColor(block, `plan-${plan.id}-desc`, false, '#94a3b8') }}
                                    >
                                      <InlineText
                                        value={plan.description}
                                        onChange={(val) => {
                                          const updated = [...(block.content.pricingPlans || [])];
                                          updated[pIdx].description = val;
                                          onUpdateBlock({
                                            ...block,
                                            content: { ...block.content, pricingPlans: updated },
                                          });
                                        }}
                                        disabled={isPreviewMode}
                                      />
                                    </p>
                                  ),
                                })}

                                {renderMovable({
                                  block,
                                  elementKey: `plan-${plan.id}-price`,
                                  label: 'Prix du forfait',
                                  inline: true,
                                  className: 'mb-5',
                                  children: (
                                    <div className="flex items-baseline gap-1">
                                      <span
                                        className="text-3xl font-extrabold"
                                        style={{ color: getElemTextColor(block, `plan-${plan.id}-price`, true, '#ffffff') }}
                                      >
                                        $
                                        <InlineText
                                          value={String(displayPrice)}
                                          onChange={(val) => {
                                            const num = parseInt(val.replace(/\D/g, '')) || 0;
                                            const updated = [...(block.content.pricingPlans || [])];
                                            if (isAnnualBilling) updated[pIdx].priceAnnual = num;
                                            else updated[pIdx].priceMonthly = num;
                                            onUpdateBlock({
                                              ...block,
                                              content: { ...block.content, pricingPlans: updated },
                                            });
                                          }}
                                          disabled={isPreviewMode}
                                        />
                                      </span>
                                      <span
                                        className="text-xs"
                                        style={{ color: block.style.textColor || '#94a3b8' }}
                                      >
                                        /mois
                                      </span>
                                    </div>
                                  ),
                                })}

                                <ul className="space-y-2.5 mb-6">
                                  {plan.features.map((f, fIdx) => (
                                    <li
                                      key={fIdx}
                                      className="flex items-center justify-between text-xs group/bullet"
                                      style={{ color: block.style.textColor || '#cbd5e1' }}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                        <InlineText
                                          value={f}
                                          onChange={(val) => {
                                            const updatedPlans = [...(block.content.pricingPlans || [])];
                                            updatedPlans[pIdx].features[fIdx] = val;
                                            onUpdateBlock({
                                              ...block,
                                              content: { ...block.content, pricingPlans: updatedPlans },
                                            });
                                          }}
                                          disabled={isPreviewMode}
                                        />
                                      </div>
                                      {!isPreviewMode && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const updatedPlans = [...(block.content.pricingPlans || [])];
                                            updatedPlans[pIdx].features = updatedPlans[pIdx].features.filter((_, idx) => idx !== fIdx);
                                            onUpdateBlock({
                                              ...block,
                                              content: { ...block.content, pricingPlans: updatedPlans },
                                            });
                                          }}
                                          className="text-slate-600 hover:text-rose-400 opacity-0 group-hover/bullet:opacity-100 transition-opacity"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      )}
                                    </li>
                                  ))}
                                </ul>

                                {!isPreviewMode && (
                                  <button
                                    onClick={() => {
                                      const updatedPlans = [...(block.content.pricingPlans || [])];
                                      updatedPlans[pIdx].features.push('Nouvel avantage inclus');
                                      onUpdateBlock({
                                        ...block,
                                        content: { ...block.content, pricingPlans: updatedPlans },
                                      });
                                    }}
                                    className="text-[10px] text-indigo-400 hover:text-indigo-300 mb-6 flex items-center gap-1"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Ajouter un avantage</span>
                                  </button>
                                )}
                              </div>

                              {renderMovable({
                                block,
                                elementKey: `plan-${plan.id}-cta`,
                                label: 'Bouton Choix Forfait',
                                children: (() => {
                                  const ctaCustom = getElemStyle(block, `plan-${plan.id}-cta`);
                                  return (
                                    <button
                                      className={`w-full py-2.5 rounded-xl font-medium text-xs transition-all ${
                                        plan.isPopular
                                          ? 'text-white shadow-lg'
                                          : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                                      }`}
                                      style={{
                                        ...(plan.isPopular
                                          ? {
                                              background: ctaCustom.backgroundColor || `linear-gradient(90deg, ${themeAccent}, #9333ea)`,
                                              boxShadow: ctaCustom.boxShadow || `0 4px 14px ${themeAccent}30`,
                                            }
                                          : {}),
                                        color: getElemTextColor(block, `plan-${plan.id}-cta`, false, '#ffffff'),
                                        ...ctaCustom,
                                      }}
                                    >
                                      <InlineText
                                        value={plan.ctaText}
                                        onChange={(val) => {
                                          const updated = [...(block.content.pricingPlans || [])];
                                          updated[pIdx].ctaText = val;
                                          onUpdateBlock({
                                            ...block,
                                            content: { ...block.content, pricingPlans: updated },
                                          });
                                        }}
                                        disabled={isPreviewMode}
                                      />
                                    </button>
                                  );
                                })(),
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* 6. CTA BANNER SECTION */}
                  {block.type === 'ctaBanner' && (
                    <section
                      style={getBlockContainerStyle(block)}
                      className="relative text-center flex flex-col items-center justify-center my-6"
                    >
                      <div className="max-w-2xl mx-auto flex flex-col items-center">
                        {renderMovable({
                          block,
                          elementKey: 'ctaBannerTitle',
                          label: 'Titre Bannière',
                          className: 'w-full flex justify-center',
                          children: (
                            <h2
                              className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3"
                              style={{ color: getElemTextColor(block, 'ctaBannerTitle', true, '#ffffff') }}
                            >
                              <InlineText
                                value={block.content.bannerTitle || block.content.title || 'Prêt à accélérer vos déploiements ?'}
                                onChange={(val) => {
                                  onUpdateBlock({
                                    ...block,
                                    content: { ...block.content, bannerTitle: val, title: val },
                                  });
                                }}
                                disabled={isPreviewMode}
                              />
                            </h2>
                          ),
                        })}

                        {renderMovable({
                          block,
                          elementKey: 'ctaBannerSubtitle',
                          label: 'Sous-titre Bannière',
                          className: 'w-full flex justify-center mb-6',
                          children: (
                            <p
                              className="text-xs sm:text-sm leading-relaxed"
                              style={{ color: getElemTextColor(block, 'ctaBannerSubtitle', false, '#94a3b8') }}
                            >
                              <InlineText
                                value={block.content.bannerSubtitle || block.content.subtitle || 'Démarrez gratuitement dès aujourd’hui.'}
                                onChange={(val) => {
                                  onUpdateBlock({
                                    ...block,
                                    content: { ...block.content, bannerSubtitle: val, subtitle: val },
                                  });
                                }}
                                disabled={isPreviewMode}
                                multiline
                              />
                            </p>
                          ),
                        })}

                        {renderMovable({
                          block,
                          elementKey: 'ctaBannerBtn',
                          label: 'Bouton Bannière',
                          inline: true,
                          children: (() => {
                            const bannerBtnStyle = getElemStyle(block, 'ctaBannerBtn');
                            return (
                              <button
                                className="inline-flex items-center gap-2 text-white font-medium px-6 py-3 rounded-xl shadow-xl transition-all hover:scale-[1.02] text-xs sm:text-sm"
                                style={{
                                  background: bannerBtnStyle.backgroundColor || `linear-gradient(135deg, ${themeAccent}, #9333ea)`,
                                  boxShadow: bannerBtnStyle.boxShadow || `0 8px 24px ${themeAccent}40`,
                                  color: getElemTextColor(block, 'ctaBannerBtn', false, '#ffffff'),
                                  ...bannerBtnStyle,
                                }}
                              >
                                <InlineText
                                  value={block.content.primaryCtaText || 'Commencer Gratuitement'}
                                  onChange={(val) => {
                                    onUpdateBlock({
                                      ...block,
                                      content: { ...block.content, primaryCtaText: val },
                                    });
                                  }}
                                  disabled={isPreviewMode}
                                />
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            );
                          })(),
                        })}
                      </div>
                    </section>
                  )}

                  {/* 7. FOOTER SECTION */}
                  {block.type === 'footer' && (
                    <footer
                      style={getBlockContainerStyle(block)}
                      className="border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
                    >
                      {renderMovable({
                        block,
                        elementKey: 'footerBrand',
                        label: 'Marque & Sous-titre',
                        inline: true,
                        children: (
                          <div>
                            <span
                              className="font-semibold mr-2"
                              style={{ color: getElemTextColor(block, 'footerBrand', true, '#cbd5e1') }}
                            >
                              <InlineText
                                value={block.content.title || 'opendesign'}
                                onChange={(val) => {
                                  onUpdateBlock({
                                    ...block,
                                    content: { ...block.content, title: val },
                                  });
                                }}
                                disabled={isPreviewMode}
                              />
                            </span>
                            <span style={{ color: getElemTextColor(block, 'footerSubtitle', false, '#64748b') }}>
                              <InlineText
                                value={block.content.subtitle || ''}
                                onChange={(val) => {
                                  onUpdateBlock({
                                    ...block,
                                    content: { ...block.content, subtitle: val },
                                  });
                                }}
                                disabled={isPreviewMode}
                              />
                            </span>
                          </div>
                        ),
                      })}
                      {renderMovable({
                        block,
                        elementKey: 'footerCopyright',
                        label: 'Texte Copyright',
                        inline: true,
                        children: (
                          <p style={{ color: getElemTextColor(block, 'footerCopyright', false, '#64748b') }}>
                            <InlineText
                              value={block.content.copyrightText || ''}
                              onChange={(val) => {
                                onUpdateBlock({
                                  ...block,
                                  content: { ...block.content, copyrightText: val },
                                });
                              }}
                              disabled={isPreviewMode}
                            />
                          </p>
                        ),
                      })}
                    </footer>
                  )}
                  </motion.div>

                  {/* Quick Insert Section Button between blocks */}
                  {!isPreviewMode && (
                    <div className="relative flex justify-center py-2 opacity-0 hover:opacity-100 transition-opacity">
                      <div className="absolute inset-x-0 top-1/2 h-[1px] bg-indigo-500/20 -z-10" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInsertMenuIndex(insertMenuIndex === blockIndex ? null : blockIndex);
                        }}
                        className="px-2.5 py-1 rounded-full bg-[#0d121f] border border-indigo-500/40 text-indigo-300 text-[10px] font-medium flex items-center gap-1 shadow-lg hover:scale-105 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Insérer une section ici</span>
                      </button>

                      {insertMenuIndex === blockIndex && (
                        <div
                          className="absolute top-8 z-40 bg-[#0d1222] border border-white/15 rounded-xl shadow-2xl p-1.5 flex gap-1 backdrop-blur-xl animate-in fade-in"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {[
                            { type: 'hero' as BlockType, label: 'Héros' },
                            { type: 'canvas3d' as BlockType, label: '3D Spatial' },
                            { type: 'canvas2d' as BlockType, label: 'Studio 2D' },
                            { type: 'featureGrid' as BlockType, label: 'Grille Bento' },
                            { type: 'pricing' as BlockType, label: 'Tarifs' },
                          ].map((item) => (
                            <button
                              key={item.type}
                              onClick={() => {
                                onAddBlock(item.type, blockIndex);
                                setInsertMenuIndex(null);
                              }}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-indigo-600/40 transition-colors"
                            >
                              + {item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Drop indicator below block */}
                {isDropTargetAfter && (
                  <div className="w-full py-2 flex items-center justify-center animate-in fade-in duration-150">
                    <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500 shadow-xl shadow-indigo-500/50 flex items-center justify-center relative">
                      <span className="absolute text-[10px] font-mono font-bold text-white bg-indigo-950 px-3 py-0.5 rounded-full border border-indigo-400 shadow-md">
                        Déposer ici (en-dessous)
                      </span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </main>
    </div>
  );
};
