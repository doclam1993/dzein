export type BlockType = 
  | 'header'
  | 'hero'
  | 'canvas3d'
  | 'canvas2d'
  | 'featureGrid'
  | 'pricing'
  | 'ctaBanner'
  | 'footer';

export interface TwoDShape {
  id: string;
  type: 'rect' | 'circle' | 'triangle' | 'star' | 'heart' | 'polygon';
  x: number;
  y: number;
  size: number;
  width?: number;
  height?: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  rotation: number;
  opacity: number;
  glow: boolean;
  glowColor?: string;
  animSpeed?: number;
  animType?: 'spin' | 'bounce' | 'float' | 'pulse' | 'none';
}

export interface TwoDConfig {
  shapes: TwoDShape[];
  backgroundColor: string;
  showGrid: boolean;
  themePreset?: 'custom' | 'retroGrid' | 'bauhaus' | 'kawaii' | 'synthwave';
}

export interface ThreeDConfig {
  meshType: 'icosahedron' | 'torusKnot' | 'cyberCube' | 'sphere' | 'rings' | 'customModel' | 'gltfPreset';
  gltfModelPreset?: 'helmet' | 'astronaut' | 'cybercar' | 'drone' | 'terminal';
  customModelFile?: string; // Data URL or object URL
  customModelName?: string;
  wireframe: boolean;
  glassFactor: number; // 0 to 1
  roughness?: number; // 0 to 1
  metalness?: number; // 0 to 1
  materialPreset?: 
    | 'matte' 
    | 'cyberPlastic' 
    | 'cyberGlass' 
    | 'chrome' 
    | 'hologram' 
    | 'glowWireframe'
    | 'gold'
    | 'copper'
    | 'rustedIron'
    | 'brushedAluminum'
    | 'clearGlass'
    | 'glossyPlastic'
    | 'mattePlastic'
    | 'polishedWood'
    | 'rawWood'
    | 'marble'
    | 'concrete'
    | 'rubber'
    | 'fabric'
    | 'water'
    | 'ceramic'
    | 'asphalt';
  texturePreset?: 'none' | 'grid' | 'neonWaves' | 'carbon' | 'hologramLines';
  ambientLightColor?: string;
  ambientLightIntensity?: number;
  directionalLightColor?: string;
  directionalLightIntensity?: number;
  pointLightColor?: string;
  pointLightIntensity?: number;
  rotationSpeed: number;
  floatSpeed: number;
  lightIntensity: number;
  color: string;
  glowColor: string;
  rx: number; // in degrees or rad
  ry: number;
  rz: number;
  scale: number;
  particleCount: number;
  particleColor?: string;
  particleSpeed?: number;
  showGizmo: boolean;
  showGridHelper?: boolean;
  showPolarGrid?: boolean;
  cameraDistance?: number;
  cameraFov?: number;
  animationTrigger?: 'onload' | 'click' | 'hover';
  animationTarget?: 'mesh' | 'particles' | 'camera' | 'light';
  animationType?: 'spin' | 'float' | 'pulse' | 'scalePulse' | 'cameraZoom' | 'vortex' | 'none';
  animationSpeed?: number;
  animationEasing?: 'linear' | 'sine' | 'elastic' | 'bounce';
  animationLoop?: 'loop' | 'pingpong' | 'once';
  animationAxis?: 'all' | 'x' | 'y' | 'z';
  animationPreset?: 'none' | 'heartbeat' | 'disco' | 'blackhole' | 'hyperspace';
}

export interface BlockStyle {
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  marginTop: number;
  marginBottom: number;
  backgroundColor: string;
  background?: string;
  backgroundType?: 'solid' | 'linear' | 'radial' | 'diamond';
  gradientStartColor?: string;
  gradientEndColor?: string;
  gradientAngle?: number;
  isGradientText?: boolean;
  borderRadius: number;
  borderColor: string;
  borderWidth: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  boxShadow?: string;
  opacity: number;
  backdropBlur: number;
  filterBlur?: number;
  filterBrightness?: number;
  filterContrast?: number;
  filterSaturate?: number;
  filterHueRotate?: number;
  filterGrayscale?: number;
  filterInvert?: number;
  patternOverlay?: 'none' | 'dots' | 'grid' | 'stripes' | 'circuit' | 'mesh';
  patternOpacity?: number;
  overflow?: 'visible' | 'hidden' | 'auto';
  display: 'flex' | 'grid';
  flexDirection: 'row' | 'column';
  justifyContent: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap: number;
  maxWidth: string;
  textColor?: string;
  headingColor?: string;
  accentColor?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration?: 'none' | 'underline' | 'line-through';
  animationEntrance?: 'none' | 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoom' | 'bounce' | 'rotate';
  animationHover?: 'none' | 'scale' | 'float' | 'glow' | 'tilt' | 'pulse';
  animationLoop?: 'none' | 'float' | 'pulse' | 'wobble' | 'spin';
  animationDuration?: number;
  animationDelay?: number;
  animationTrigger?: 'load' | 'click' | 'hover' | 'scroll';
  animationTarget?: string;
  animationAction?: 'fade' | 'slide' | 'zoom' | 'rotate' | 'shake' | 'float' | 'flip' | 'blurIn' | 'pop' | 'swing' | 'revealMask';
  animationEasing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring' | 'bounce' | 'cubicBezier' | 'anticipate';
  animationLoopType?: 'none' | 'yoyo' | 'loop' | 'pulse' | 'spin' | 'breathe' | 'neonGlow' | 'floatDrift';
  hoverTriggerSource?: string;
  hoverTriggerTarget?: string;
  hoverTriggerAction?: 'fade' | 'slide' | 'zoom' | 'rotate' | 'shake' | 'float' | 'glow' | 'liftShadow' | 'tilt3D' | 'colorShift';
  hoverTriggerEasing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring' | 'bounce';
  hoverTriggerDuration?: number;

  // Orchestre d'Animation Avancé (Total Freedom & Pro Level)
  advancedAnimEnabled?: boolean;
  advancedAnimTarget?: string;
  advancedAnimType?: 'spring' | 'tween' | 'keyframes';
  advancedAnimStiffness?: number; // Ex: 100
  advancedAnimDamping?: number;   // Ex: 10
  advancedAnimMass?: number;      // Ex: 1
  advancedAnimVelocity?: number;  // Initial velocity
  advancedAnimTranslateX?: number; // px
  advancedAnimTranslateY?: number; // px
  advancedAnimTranslateZ?: number; // px (3D depth)
  advancedAnimRotate?: number;     // deg (2D)
  advancedAnimRotateX?: number;    // deg (3D tilt X)
  advancedAnimRotateY?: number;    // deg (3D tilt Y)
  advancedAnimScale?: number;      // 0 to 2
  advancedAnimOpacity?: number;    // 0 to 1
  advancedAnimBlur?: number;       // px (filter blur)
  advancedAnimSkewX?: number;      // deg
  advancedAnimStagger?: number;    // seconds
  advancedAnimCubicBezier?: string; // e.g. "0.25, 0.1, 0.25, 1"
  animationKeyframesMode?: 'none' | 'cinematicZoom' | 'heartbeat' | 'rubberBand' | 'jello' | 'glitch' | 'magneticFloat';
  animationPerspective?: number;   // px e.g. 1000

  // Studio d'Animation - Nouvelle Logique Réorganisée selon 5 Catégories
  studioAnimCategory?: 'userAction' | 'scrollDriven' | 'sequence' | 'systemState' | 'dragPhysics';
  studioAnimTriggerMode?: 
    | 'clickSelf' | 'clickTarget' | 'hover' | 'hoverIntent' | 'pressHold' | 'inputFocus'
    | 'scrollTrigger' | 'scrollScrub' | 'scrollDirection' | 'scrollParallax'
    | 'chainReaction' | 'staggerGroup' | 'branchingState'
    | 'mounting' | 'unmountingExit' | 'stateMutation' | 'idleTrigger'
    | 'dragTracking' | 'dragThreshold';

  // 1. Actions Utilisateur (Événements Directs)
  studioClickSelfToggle?: boolean;
  studioClickTargetSource?: string;
  studioClickTargetTarget?: string;
  studioClickTargetAction?: 'fade' | 'slide' | 'zoom' | 'rotate' | 'shake' | 'float' | 'flip' | 'blurIn' | 'pop' | 'glow' | 'liftShadow';
  studioClickTargetReset?: boolean;
  studioHoverIntentDelayMs?: number; // e.g. 300 ms
  studioPressHoldMinTimeMs?: number; // e.g. 500 ms
  studioPressHoldReverseOnRelease?: boolean;
  studioInputFocusSource?: string;
  studioInputFocusTarget?: string;
  studioInputFocusAction?: 'fade' | 'slide' | 'zoom' | 'glow' | 'borderPulse' | 'labelRise';

  // 2. Déclenchement par Défilement (Scroll-Driven)
  studioScrollThresholdPercent?: number; // 0 à 100%
  studioScrollTriggerOnce?: boolean;
  studioScrollScrubStartOffset?: number; // 0 à 100%
  studioScrollScrubEndOffset?: number; // 0 à 100%
  studioScrollDirectionDownAction?: 'fade' | 'slide' | 'zoom' | 'revealMask' | 'hide';
  studioScrollDirectionUpAction?: 'fade' | 'slide' | 'zoom' | 'revealMask' | 'hide';
  studioScrollParallaxSpeed?: number; // -2 à +2

  // 3. Séquence et Propagation (Chaining & Stagger)
  studioChainTargets?: string[]; // Ex: ['title', 'subtitle', 'primaryCta']
  studioChainActions?: string[]; // Ex: ['fade', 'slide', 'pop']
  studioStaggerDelayMs?: number; // Ex: 120 ms
  studioBranchingStateKey?: string; // Ex: "isLoggedIn" ou "isActive"
  studioBranchingTrueAction?: string;
  studioBranchingFalseAction?: string;

  // 4. Système et États de Données
  studioMountingAction?: 'fade' | 'slide' | 'zoom' | 'pop' | 'blurIn';
  studioExitAction?: 'fade' | 'slide' | 'zoom' | 'shrink' | 'blurOut';
  studioExitDurationMs?: number;
  studioStateMutationVarName?: string;
  studioStateMutationAction?: 'pulse' | 'flashColor' | 'scaleBounce' | 'shake';
  studioIdleTimeoutSeconds?: number; // Ex: 5 sec
  studioIdleAction?: 'heartbeat' | 'wobble' | 'glowPulse' | 'shake' | 'bounce';

  // 5. Glisser-Déposer et Geste (Drag & Physics)
  studioDragAxis?: 'all' | 'x' | 'y';
  studioDragSpringStiffness?: number; // Ex: 150
  studioDragSpringDamping?: number;   // Ex: 15
  studioDragThresholdPx?: number;     // Ex: 100 px
  studioDragThresholdSuccessAction?: 'pop' | 'glow' | 'slideOut' | 'unlock';

  // Studio d'Animation des Propriétés Style (CSS & Visual Engine)
  animStylePropsEnabled?: boolean;
  animStyleTarget?: string;
  // 1. Couleurs (Colors)
  animBgColorStart?: string;
  animBgColorEnd?: string;
  animTextColorStart?: string;
  animTextColorEnd?: string;
  animBorderColorStart?: string;
  animBorderColorEnd?: string;
  // 2. Bordures & Rayons (Borders & Radius)
  animBorderRadiusStart?: number; // px
  animBorderRadiusEnd?: number; // px
  animBorderWidthStart?: number; // px
  animBorderWidthEnd?: number; // px
  animOutlineColorStart?: string;
  animOutlineColorEnd?: string;
  animOutlineWidthStart?: number; // px
  animOutlineWidthEnd?: number; // px
  animOutlineOffsetStart?: number; // px
  animOutlineOffsetEnd?: number; // px
  // 3. Ombres & Élévation (Shadows & Glow)
  animBoxShadowStart?: string;
  animBoxShadowEnd?: string;
  animTextShadowStart?: string;
  animTextShadowEnd?: string;
  // 4. Filtres Graphiques & FX (Visual Filters)
  animFilterBlurStart?: number; // px
  animFilterBlurEnd?: number; // px
  animFilterBrightness?: number; // 0 to 2
  animFilterContrast?: number; // 0 to 2
  animFilterSaturate?: number; // 0 to 3
  animFilterHueRotate?: number; // 0 to 360 deg
  animFilterGrayscale?: number; // 0 to 100%
  animFilterInvertStart?: number; // 0 to 100%
  animFilterInvertEnd?: number; // 0 to 100%
  animFilterSepiaStart?: number; // 0 to 100%
  animFilterSepiaEnd?: number; // 0 to 100%
  // 5. Verre & Translucidité (Backdrop Filter / Glass)
  animBackdropBlurStart?: number; // px
  animBackdropBlurEnd?: number; // px
  // 6. Typographie & Espacement (Letter spacing, padding, gap, font-size, font-weight)
  animFontSizeStart?: number; // px
  animFontSizeEnd?: number; // px
  animFontWeightStart?: number; // 100 to 900
  animFontWeightEnd?: number; // 100 to 900
  animLineHeightStart?: number; // ratio e.g. 1.2 to 2
  animLineHeightEnd?: number;
  animLetterSpacingStart?: number; // px
  animLetterSpacingEnd?: number; // px
  animPaddingStart?: number; // px
  animPaddingEnd?: number; // px
  animMarginStart?: number; // px
  animMarginEnd?: number; // px
  animGapStart?: number; // px
  animGapEnd?: number; // px
  animWidthStart?: number; // px or %
  animWidthEnd?: number; // px or %
  animHeightStart?: number; // px
  animHeightEnd?: number; // px
  animPatternOpacityStart?: number; // 0 to 1
  animPatternOpacityEnd?: number; // 0 to 1
  animOpacityStart?: number; // 0 to 1
  animOpacityEnd?: number; // 0 to 1
}

export interface BlockLayout {
  x: number;
  y: number;
  width: number | string; // e.g. 100% or 1180
  height: number | string;
  isLocked: boolean;
  isHidden: boolean;
  isFreePosition?: boolean;
}

export interface ElementCustomStyle {
  htmlTag?: string;
  linkUrl?: string;
  linkTarget?: '_blank' | '_self';
  placeholder?: string;
  imageSrc?: string;
  imageAlt?: string;
  inputType?: 'text' | 'email' | 'password' | 'number' | 'search';
  fontFamily?: string;
  textColor?: string;
  color?: string;
  backgroundColor?: string;
  background?: string;
  backgroundType?: 'solid' | 'linear' | 'radial' | 'diamond';
  gradientStartColor?: string;
  gradientEndColor?: string;
  gradientAngle?: number;
  isGradientText?: boolean;
  fontSize?: number;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  letterSpacing?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration?: 'none' | 'underline' | 'line-through';
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  opacity?: number;
  hidden?: boolean;
  backdropBlur?: number;
  boxShadow?: string;
  filterBlur?: number;
  filterBrightness?: number;
  filterContrast?: number;
  filterSaturate?: number;
  filterHueRotate?: number;
  filterGrayscale?: number;
  filterInvert?: number;
  overflow?: 'visible' | 'hidden' | 'auto';
  display?: 'block' | 'inline-block' | 'flex' | 'inline-flex';
  x?: number;
  y?: number;
}

export type ElementCategory = 
  | 'section' 
  | 'text' 
  | 'heading' 
  | 'button' 
  | 'badge' 
  | 'link' 
  | 'card' 
  | 'pricing-card' 
  | 'canvas3d' 
  | 'canvas2d'
  | 'icon' 
  | 'container';

export interface SelectedElementInfo {
  blockId: string;
  elementKey: string;
  category: ElementCategory;
  label: string;
  htmlTag?: string;
  subId?: string | number;
}

export interface CanvasBlock {
  id: string;
  name: string;
  type: BlockType;
  layout: BlockLayout;
  style: BlockStyle;
  // Dynamic contents per block type
  content: {
    badgeText?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    primaryCtaText?: string;
    secondaryCtaText?: string;
    links?: { label: string; href: string }[];
    gridColumns?: number; // 2, 3, 4
    features?: {
      id: string;
      icon: string;
      title: string;
      description: string;
      tag?: string;
      x?: number;
      y?: number;
    }[];
    pricingPlans?: {
      id: string;
      name: string;
      priceMonthly: number;
      priceAnnual: number;
      description: string;
      features: string[];
      isPopular?: boolean;
      ctaText: string;
      x?: number;
      y?: number;
    }[];
    bannerTitle?: string;
    bannerSubtitle?: string;
    copyrightText?: string;
    elementOffsets?: Record<string, { x: number; y: number }>;
    elementStyles?: Record<string, ElementCustomStyle>;
    elementLinks?: Record<string, string>;
  };
  threeConfig?: ThreeDConfig;
  twoConfig?: TwoDConfig;
}

export interface GitCommit {
  id: string;
  hash: string;
  message: string;
  branch: string;
  author: string;
  avatar: string;
  timestamp: string;
  diffCount: number;
  snapshot: CanvasBlock[];
}

export interface AIDiffChange {
  blockId?: string;
  blockName?: string;
  label: string;
  type: 'added' | 'modified' | 'removed';
  before: string;
  after: string;
}

export interface AIDiffProposal {
  id: string;
  prompt: string;
  summary: string;
  changes: AIDiffChange[];
  proposedBlocks: CanvasBlock[];
  timestamp: string;
  applied?: boolean;
}

export interface PresenceUser {
  id: string;
  name: string;
  avatar: string;
  color: string;
  activeBlockId: string | null;
  status: string;
}

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export type RightSidebarTab = 'style' | 'content' | 'three' | 'two' | 'code' | 'diff';
export type LeftSidebarTab = 'tree' | 'git' | 'tokens';
