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
  opacity: number;
  backdropBlur: number;
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
  animationEntrance?: 'none' | 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoom' | 'bounce' | 'rotate';
  animationHover?: 'none' | 'scale' | 'float' | 'glow' | 'tilt' | 'pulse';
  animationLoop?: 'none' | 'float' | 'pulse' | 'wobble' | 'spin';
  animationDuration?: number;
  animationDelay?: number;
  animationTrigger?: 'load' | 'click' | 'hover' | 'scroll';
  animationTarget?: string;
  animationAction?: 'fade' | 'slide' | 'zoom' | 'rotate' | 'shake' | 'float';
  animationEasing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring' | 'bounce';
  animationLoopType?: 'none' | 'yoyo' | 'loop' | 'pulse' | 'spin';
  hoverTriggerSource?: string;
  hoverTriggerTarget?: string;
  hoverTriggerAction?: 'fade' | 'slide' | 'zoom' | 'rotate' | 'shake' | 'float' | 'glow';
  hoverTriggerEasing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring' | 'bounce';
  hoverTriggerDuration?: number;

  // Orchestre d'Animation Avancé (Total Freedom)
  advancedAnimEnabled?: boolean;
  advancedAnimTarget?: string;
  advancedAnimType?: 'spring' | 'tween';
  advancedAnimStiffness?: number; // Ex: 100
  advancedAnimDamping?: number;   // Ex: 10
  advancedAnimMass?: number;      // Ex: 1
  advancedAnimTranslateX?: number; // px
  advancedAnimTranslateY?: number; // px
  advancedAnimRotate?: number;     // deg
  advancedAnimScale?: number;      // 0 to 2
  advancedAnimOpacity?: number;    // 0 to 1
  advancedAnimStagger?: number;    // seconds
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
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  opacity?: number;
  hidden?: boolean;
  backdropBlur?: number;
  boxShadow?: string;
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
