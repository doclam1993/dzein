'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ThreeDConfig } from '@/types/builder';
import { 
  Rotate3d, Box, CircleDot, Orbit, Compass, Sliders, Layers, Sun, Eye
} from 'lucide-react';

interface ThreeDCanvasWidgetProps {
  config?: ThreeDConfig;
  isSelected?: boolean;
  onUpdateConfig?: (newConfig: Partial<ThreeDConfig>) => void;
}

// Procedural texture generator for retro cyberpunk looks
const generateProceduralTexture = (type: string, color: string = '#6366f1') => {
  if (typeof window === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background
  ctx.fillStyle = '#07090e';
  ctx.fillRect(0, 0, 256, 256);

  if (type === 'grid') {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    for (let i = 0; i <= 256; i += 32) {
      // vertical
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 256);
      ctx.stroke();

      // horizontal
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(256, i);
      ctx.stroke();
    }
  } else if (type === 'neonWaves') {
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, color);
    grad.addColorStop(0.5, '#a855f7');
    grad.addColorStop(1, '#06b6d4');
    ctx.fillStyle = grad;
    for (let i = 0; i < 256; i += 16) {
      ctx.fillRect(0, i, 256, 6);
    }
  } else if (type === 'carbon') {
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 4;
    for (let i = -256; i < 256; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 256, 256);
      ctx.stroke();
    }
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    for (let i = -256; i < 256; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i + 256, 0);
      ctx.lineTo(i, 256);
      ctx.stroke();
    }
  } else if (type === 'hologramLines') {
    ctx.fillStyle = color;
    for (let i = 0; i < 256; i += 8) {
      ctx.fillRect(0, i, 256, 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
};

// Procedural offline 3D Low-Poly Presets
const buildPresetModel = (presetType: string, scale: number, mainColor: string, glowColor: string) => {
  const group = new THREE.Group();

  if (presetType === 'astronaut') {
    // Suit body
    const bodyGeom = new THREE.CylinderGeometry(0.6 * scale, 0.4 * scale, 1.4 * scale, 8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.5 });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.y = -0.2 * scale;
    group.add(body);

    // Helmet
    const helmetGeom = new THREE.SphereGeometry(0.55 * scale, 16, 16);
    const helmetMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.2 });
    const helmet = new THREE.Mesh(helmetGeom, helmetMat);
    helmet.position.y = 0.6 * scale;
    group.add(helmet);

    // Visor (glowing glass)
    const visorGeom = new THREE.SphereGeometry(0.42 * scale, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const visorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(glowColor),
      emissive: new THREE.Color(glowColor),
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.9
    });
    const visor = new THREE.Mesh(visorGeom, visorMat);
    visor.rotation.x = Math.PI / 2;
    visor.position.set(0, 0.65 * scale, 0.2 * scale);
    group.add(visor);

    // Backpack
    const packGeom = new THREE.BoxGeometry(0.8 * scale, 1.0 * scale, 0.4 * scale);
    const packMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const backpack = new THREE.Mesh(packGeom, packMat);
    backpack.position.set(0, -0.1 * scale, -0.45 * scale);
    group.add(backpack);

  } else if (presetType === 'cybercar') {
    // Chassis
    const chassisGeom = new THREE.BoxGeometry(2.0 * scale, 0.4 * scale, 1.0 * scale);
    const chassisMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(mainColor), metalness: 0.9, roughness: 0.1 });
    const chassis = new THREE.Mesh(chassisGeom, chassisMat);
    group.add(chassis);

    // Cabin
    const cabinGeom = new THREE.BoxGeometry(1.0 * scale, 0.4 * scale, 0.8 * scale);
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0x111111, transparent: true, opacity: 0.8, roughness: 0.1 });
    const cabin = new THREE.Mesh(cabinGeom, cabinMat);
    cabin.position.set(-0.1 * scale, 0.3 * scale, 0);
    group.add(cabin);

    // Wheels (4 cylinders)
    const wheelGeom = new THREE.CylinderGeometry(0.3 * scale, 0.3 * scale, 0.25 * scale, 12);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
    const glowWheelMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(glowColor), emissive: new THREE.Color(glowColor), emissiveIntensity: 1.0 });

    const wheelPositions = [
      { x: -0.6, z: 0.55 },
      { x: 0.6, z: 0.55 },
      { x: -0.6, z: -0.55 },
      { x: 0.6, z: -0.55 }
    ];

    wheelPositions.forEach((pos) => {
      const wGroup = new THREE.Group();
      const wheel = new THREE.Mesh(wheelGeom, wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wGroup.add(wheel);

      // Neo wheel rim
      const rimGeom = new THREE.CylinderGeometry(0.18 * scale, 0.18 * scale, 0.28 * scale, 8);
      const rim = new THREE.Mesh(rimGeom, glowWheelMat);
      rim.rotation.x = Math.PI / 2;
      wGroup.add(rim);

      wGroup.position.set(pos.x * scale, -0.2 * scale, pos.z * scale);
      group.add(wGroup);
    });

  } else if (presetType === 'drone') {
    // Core
    const coreGeom = new THREE.SphereGeometry(0.4 * scale, 12, 12);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
    const core = new THREE.Mesh(coreGeom, coreMat);
    group.add(core);

    // Glow eyes
    const eyeGeom = new THREE.SphereGeometry(0.12 * scale, 8, 8);
    const eyeMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(glowColor), emissive: new THREE.Color(glowColor), emissiveIntensity: 1.2 });
    const eye = new THREE.Mesh(eyeGeom, eyeMat);
    eye.position.set(0.32 * scale, 0.05 * scale, 0);
    group.add(eye);

    // Quad Arms
    const armGeom = new THREE.BoxGeometry(1.6 * scale, 0.08 * scale, 0.08 * scale);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    
    const arm1 = new THREE.Mesh(armGeom, armMat);
    arm1.rotation.y = Math.PI / 4;
    group.add(arm1);

    const arm2 = new THREE.Mesh(armGeom, armMat);
    arm2.rotation.y = -Math.PI / 4;
    group.add(arm2);

    // 4 Rotors
    const rotorPositions = [
      { x: 0.56, z: 0.56 },
      { x: -0.56, z: 0.56 },
      { x: 0.56, z: -0.56 },
      { x: -0.56, z: -0.56 }
    ];

    rotorPositions.forEach((pos) => {
      const rGeom = new THREE.CylinderGeometry(0.06 * scale, 0.06 * scale, 0.15 * scale, 8);
      const rMesh = new THREE.Mesh(rGeom, armMat);
      rMesh.position.set(pos.x * scale, 0.1 * scale, pos.z * scale);
      group.add(rMesh);

      const bladeGeom = new THREE.BoxGeometry(0.4 * scale, 0.01 * scale, 0.04 * scale);
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
      const blade = new THREE.Mesh(bladeGeom, bladeMat);
      blade.position.set(pos.x * scale, 0.18 * scale, pos.z * scale);
      group.add(blade);
    });

  } else if (presetType === 'terminal') {
    // Cabinet
    const cabGeom = new THREE.BoxGeometry(1.0 * scale, 1.8 * scale, 0.8 * scale);
    const cabMat = new THREE.MeshStandardMaterial({ color: 0x222530, roughness: 0.4 });
    const cab = new THREE.Mesh(cabGeom, cabMat);
    group.add(cab);

    // Slanted screen bevel
    const screenGeom = new THREE.PlaneGeometry(0.75 * scale, 0.55 * scale);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x0a1128,
      emissive: new THREE.Color(glowColor),
      emissiveIntensity: 0.4,
      roughness: 0.1
    });
    const screen = new THREE.Mesh(screenGeom, screenMat);
    screen.position.set(0, 0.4 * scale, 0.41 * scale);
    group.add(screen);

    // Controller deck
    const deckGeom = new THREE.BoxGeometry(0.9 * scale, 0.15 * scale, 0.4 * scale);
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x1a1c23 });
    const deck = new THREE.Mesh(deckGeom, deckMat);
    deck.position.set(0, 0.02 * scale, 0.55 * scale);
    group.add(deck);

    // Joysticks/Buttons
    const btnGeom = new THREE.SphereGeometry(0.04 * scale, 8, 8);
    const btnMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(mainColor) });
    const btn = new THREE.Mesh(btnGeom, btnMat);
    btn.position.set(-0.2 * scale, 0.12 * scale, 0.55 * scale);
    group.add(btn);
  }

  return group;
};

export const ThreeDCanvasWidget: React.FC<ThreeDCanvasWidgetProps> = ({
  config = {
    meshType: 'torusKnot',
    wireframe: false,
    glassFactor: 0.85,
    rotationSpeed: 0.8,
    floatSpeed: 1.2,
    lightIntensity: 1.5,
    color: '#6366f1',
    glowColor: '#a855f7',
    rx: 20,
    ry: 35,
    rz: 15,
    scale: 1,
    particleCount: 80,
    showGizmo: true,
  },
  isSelected = false,
  onUpdateConfig,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const meshRef = useRef<THREE.Object3D | null>(null);
  const innerMeshRef = useRef<THREE.Object3D | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animFrameId = useRef<number | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const polarHelperRef = useRef<THREE.PolarGridHelper | null>(null);

  // Mouse interaction for orbital drag
  const isDragging = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const manualRotation = useRef({ x: 0.3, y: 0.5, z: 0.0 });

  const [activeGizmoTab, setActiveGizmoTab] = useState<'mesh' | 'physics' | 'materials'>('mesh');

  // Interactive animation triggers & easing weights
  const isHoveredRef = useRef(false);
  const isClickedRef = useRef(false);
  const weightRef = useRef(0.0);

  // Build or update 3D mesh geometry & material
  const buildMesh = useCallback((scene: THREE.Scene, cfg: ThreeDConfig) => {
    // Remove old mesh
    if (meshRef.current) {
      scene.remove(meshRef.current);
      meshRef.current = null;
    }
    if (innerMeshRef.current) {
      scene.remove(innerMeshRef.current);
      innerMeshRef.current = null;
    }

    // Grid helpers
    if (gridHelperRef.current) {
      scene.remove(gridHelperRef.current);
      gridHelperRef.current = null;
    }
    if (polarHelperRef.current) {
      scene.remove(polarHelperRef.current);
      polarHelperRef.current = null;
    }

    // Add helpers if enabled
    if (cfg.showGridHelper) {
      const grid = new THREE.GridHelper(12, 12, 0x4f46e5, 0x1e293b);
      grid.position.y = -2;
      scene.add(grid);
      gridHelperRef.current = grid;
    }
    if (cfg.showPolarGrid) {
      const polar = new THREE.PolarGridHelper(6, 16, 8, 64, 0xa855f7, 0x3b0764);
      polar.position.y = -2;
      scene.add(polar);
      polarHelperRef.current = polar;
    }

    // Render gltfPreset or custom uploaded GLTF models
    if (cfg.meshType === 'gltfPreset' && cfg.gltfModelPreset) {
      const presetGroup = buildPresetModel(cfg.gltfModelPreset, cfg.scale || 1, cfg.color, cfg.glowColor);
      scene.add(presetGroup);
      meshRef.current = presetGroup;
      return;
    }

    if (cfg.meshType === 'customModel' && cfg.customModelFile) {
      const loader = new GLTFLoader();
      loader.load(cfg.customModelFile, (gltf) => {
        const model = gltf.scene;
        // Center and scale model
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = (2.2 / maxDim) * (cfg.scale || 1);
        model.scale.set(targetScale, targetScale, targetScale);
        
        // Traverse and update materials
        model.traverse((child) => {
          if ((child as any).isMesh) {
            const mChild = child as THREE.Mesh;
            const originalMat = mChild.material as THREE.MeshStandardMaterial;
            mChild.material = new THREE.MeshStandardMaterial({
              color: originalMat?.color || new THREE.Color(cfg.color || '#6366f1'),
              roughness: cfg.roughness ?? 0.15,
              metalness: cfg.metalness ?? 0.85,
              wireframe: cfg.wireframe || false,
            });
          }
        });

        scene.add(model);
        meshRef.current = model;
      }, undefined, (err) => {
        console.error("Erreur de chargement du modèle GLTF:", err);
        // Fallback to torusKnot on error
        const fallbackGeo = new THREE.TorusKnotGeometry(1.3 * (cfg.scale || 1), 0.4, 64, 16);
        const fallbackMat = new THREE.MeshStandardMaterial({ color: 0xef4444, wireframe: true });
        const fallbackMesh = new THREE.Mesh(fallbackGeo, fallbackMat);
        scene.add(fallbackMesh);
        meshRef.current = fallbackMesh;
      });
      return;
    }

    let geometry: THREE.BufferGeometry;
    let innerGeometry: THREE.BufferGeometry | null = null;

    switch (cfg.meshType) {
      case 'torusKnot':
        geometry = new THREE.TorusKnotGeometry(1.3 * (cfg.scale || 1), 0.4, 128, 32);
        break;
      case 'icosahedron':
        geometry = new THREE.IcosahedronGeometry(1.8 * (cfg.scale || 1), 1);
        innerGeometry = new THREE.IcosahedronGeometry(1.2 * (cfg.scale || 1), 0);
        break;
      case 'cyberCube':
        geometry = new THREE.BoxGeometry(
          2.0 * (cfg.scale || 1),
          2.0 * (cfg.scale || 1),
          2.0 * (cfg.scale || 1)
        );
        innerGeometry = new THREE.BoxGeometry(
          1.2 * (cfg.scale || 1),
          1.2 * (cfg.scale || 1),
          1.2 * (cfg.scale || 1)
        );
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(1.8 * (cfg.scale || 1), 36, 36);
        break;
      case 'rings':
        geometry = new THREE.TorusGeometry(1.7 * (cfg.scale || 1), 0.2, 32, 100);
        innerGeometry = new THREE.TorusGeometry(1.1 * (cfg.scale || 1), 0.15, 32, 100);
        break;
      default:
        geometry = new THREE.TorusKnotGeometry(1.3, 0.4, 128, 32);
    }

    // Advanced Material & Presets logic
    let roughnessVal = cfg.roughness ?? 0.15;
    let metalnessVal = cfg.metalness ?? 0.85;
    let opacityVal = 1.0;
    let transparentVal = false;
    let useWireframe = cfg.wireframe || false;
    let baseColorHex = cfg.color || '#6366f1';
    let emissiveHex = cfg.glowColor || '#a855f7';
    let emissiveIntensityVal = 0.35;

    if (cfg.materialPreset) {
      switch (cfg.materialPreset) {
        case 'matte':
          roughnessVal = 0.8;
          metalnessVal = 0.1;
          break;
        case 'cyberPlastic':
          roughnessVal = 0.25;
          metalnessVal = 0.35;
          break;
        case 'cyberGlass':
          roughnessVal = 0.05;
          metalnessVal = 0.1;
          transparentVal = true;
          opacityVal = 0.4 + cfg.glassFactor * 0.45;
          break;
        case 'chrome':
          roughnessVal = 0.02;
          metalnessVal = 1.0;
          baseColorHex = '#ffffff';
          emissiveHex = '#000000';
          emissiveIntensityVal = 0;
          break;
        case 'hologram':
          roughnessVal = 0.5;
          metalnessVal = 0.1;
          transparentVal = true;
          opacityVal = 0.65;
          useWireframe = true;
          emissiveIntensityVal = 0.95;
          break;
        case 'glowWireframe':
          roughnessVal = 0.15;
          metalnessVal = 0.85;
          useWireframe = true;
          break;
        case 'gold':
          roughnessVal = 0.12;
          metalnessVal = 1.0;
          baseColorHex = '#ffd700'; // Pure gold hex
          emissiveHex = '#000000';
          emissiveIntensityVal = 0;
          break;
        case 'copper':
          roughnessVal = 0.18;
          metalnessVal = 1.0;
          baseColorHex = '#d17a3a'; // Polished copper
          emissiveHex = '#000000';
          emissiveIntensityVal = 0;
          break;
        case 'rustedIron':
          roughnessVal = 0.88;
          metalnessVal = 0.25;
          baseColorHex = '#6e3a15'; // Dark rust red-brown
          emissiveHex = '#000000';
          emissiveIntensityVal = 0;
          break;
        case 'brushedAluminum':
          roughnessVal = 0.35;
          metalnessVal = 0.92;
          baseColorHex = '#b5b8ba'; // Cool aluminum gray
          emissiveHex = '#000000';
          emissiveIntensityVal = 0;
          break;
        case 'clearGlass':
          roughnessVal = 0.01;
          metalnessVal = 0.1;
          transparentVal = true;
          opacityVal = 0.15 + cfg.glassFactor * 0.15;
          baseColorHex = '#ffffff';
          emissiveHex = '#000000';
          emissiveIntensityVal = 0;
          break;
        case 'glossyPlastic':
          roughnessVal = 0.08;
          metalnessVal = 0.0;
          emissiveHex = '#000000';
          emissiveIntensityVal = 0;
          break;
        case 'mattePlastic':
          roughnessVal = 0.72;
          metalnessVal = 0.0;
          emissiveHex = '#000000';
          emissiveIntensityVal = 0;
          break;
        case 'polishedWood':
          roughnessVal = 0.22;
          metalnessVal = 0.0;
          baseColorHex = '#84421b'; // Mahogany warm wood
          emissiveHex = '#000000';
          emissiveIntensityVal = 0;
          break;
        case 'rawWood':
          roughnessVal = 0.85;
          metalnessVal = 0.0;
          baseColorHex = '#cdaa7d'; // Sandy dry wood
          emissiveHex = '#000000';
          emissiveIntensityVal = 0;
          break;
        case 'marble':
          roughnessVal = 0.15;
          metalnessVal = 0.05;
          baseColorHex = '#fafafa'; // White Carrara marble
          emissiveHex = '#000000';
          emissiveIntensityVal = 0;
          break;
        case 'concrete':
          roughnessVal = 0.95;
          metalnessVal = 0.0;
          baseColorHex = '#7d8487'; // Slate grey concrete
          emissiveHex = '#000000';
          emissiveIntensityVal = 0;
          break;
        case 'rubber':
          roughnessVal = 0.82;
          metalnessVal = 0.0;
          baseColorHex = '#1c1c1c'; // Dark charcoal vulcanized rubber
          emissiveHex = '#000000';
          emissiveIntensityVal = 0;
          break;
        case 'fabric':
          roughnessVal = 0.96;
          metalnessVal = 0.0;
          emissiveHex = '#000000';
          emissiveIntensityVal = 0;
          break;
        case 'water':
          roughnessVal = 0.03;
          metalnessVal = 0.02;
          transparentVal = true;
          opacityVal = 0.5;
          baseColorHex = '#2bbcf2'; // Lagoon teal water
          emissiveHex = '#1a5f80';
          emissiveIntensityVal = 0.25;
          break;
        case 'ceramic':
          roughnessVal = 0.05;
          metalnessVal = 0.0;
          baseColorHex = '#fefefe'; // High gloss white porcelain
          emissiveHex = '#000000';
          emissiveIntensityVal = 0;
          break;
        case 'asphalt':
          roughnessVal = 0.98;
          metalnessVal = 0.0;
          baseColorHex = '#18191a'; // Fine tar asphalt black
          emissiveHex = '#000000';
          emissiveIntensityVal = 0;
          break;
      }
    }

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColorHex),
      emissive: new THREE.Color(emissiveHex),
      emissiveIntensity: emissiveIntensityVal,
      roughness: roughnessVal,
      metalness: metalnessVal,
      wireframe: useWireframe,
      transparent: transparentVal,
      opacity: opacityVal,
    });

    // Handle Procedural Textures
    if (cfg.texturePreset && cfg.texturePreset !== 'none') {
      const tex = generateProceduralTexture(cfg.texturePreset, cfg.color);
      if (tex) {
        material.map = tex;
        material.needsUpdate = true;
      }
    }

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    if (innerGeometry) {
      const innerMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(cfg.glowColor || '#a855f7'),
        wireframe: true,
        transparent: true,
        opacity: 0.7,
      });
      const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
      scene.add(innerMesh);
      innerMeshRef.current = innerMesh;
    }
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 420;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(config.cameraFov || 45, width / height, 0.1, 1000);
    camera.position.z = config.cameraDistance || 7;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Ambient and Directional Lights
    const ambientLight = new THREE.AmbientLight(
      new THREE.Color(config.ambientLightColor || '#ffffff'),
      (config.ambientLightIntensity ?? 0.6) * (config.lightIntensity ?? 1.0)
    );
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(
      new THREE.Color(config.directionalLightColor || '#818cf8'),
      (config.directionalLightIntensity ?? 2.0) * (config.lightIntensity ?? 1.0)
    );
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xc084fc, 1.8 * (config.lightIntensity ?? 1.0));
    dirLight2.position.set(-5, -3, -2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(
      new THREE.Color(config.pointLightColor || '#06b6d4'),
      (config.pointLightIntensity ?? 2.0) * (config.lightIntensity ?? 1.0),
      10
    );
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // Particles starfield
    const pCount = 120;
    const pGeometry = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPositions[i] = (Math.random() - 0.5) * 16;
      pPositions[i + 1] = (Math.random() - 0.5) * 10;
      pPositions[i + 2] = (Math.random() - 0.5) * 10;
    }
    pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMaterial = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(pGeometry, pMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Initial Mesh Creation
    buildMesh(scene, config);

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Trigger logic
      const trigger = config.animationTrigger || 'onload';
      let isActive = true;
      if (trigger === 'hover') {
        isActive = isHoveredRef.current;
      } else if (trigger === 'click') {
        isActive = isClickedRef.current;
      }

      // Smooth weight transition (0.08 interpolation rate)
      const targetWeight = isActive ? 1.0 : 0.0;
      weightRef.current += (targetWeight - weightRef.current) * 0.08;
      const w = weightRef.current;

      // Read values with fallbacks
      let target = config.animationTarget || 'mesh';
      let animType = config.animationType || 'none';
      let speed = config.animationSpeed ?? 1.0;
      let easing = config.animationEasing || 'linear';
      let loopMode = config.animationLoop || 'loop';
      let axis = config.animationAxis || 'all';

      // 1-Click Cinematic Presets logic
      if (config.animationPreset && config.animationPreset !== 'none') {
        switch (config.animationPreset) {
          case 'heartbeat':
            target = 'mesh';
            animType = 'scalePulse';
            easing = 'bounce';
            loopMode = 'pingpong';
            speed = 1.4 * speed;
            break;
          case 'disco':
            target = 'light';
            animType = 'pulse';
            easing = 'sine';
            loopMode = 'loop';
            speed = 2.0 * speed;
            break;
          case 'blackhole':
            target = 'particles';
            animType = 'vortex';
            easing = 'elastic';
            loopMode = 'loop';
            speed = 1.8 * speed;
            break;
          case 'hyperspace':
            target = 'camera';
            animType = 'cameraZoom';
            easing = 'linear';
            loopMode = 'pingpong';
            speed = 2.4 * speed;
            break;
        }
      }

      // Loop Mode math mapping
      let timeVal = elapsedTime * speed;
      if (loopMode === 'pingpong') {
        // Ping-pong oscillates between 0 and 1
        timeVal = Math.abs(((elapsedTime * speed) % 2) - 1);
      } else if (loopMode === 'once') {
        timeVal = Math.min(elapsedTime * speed, 1.0);
      }

      // Easing mathematics multiplier calculation
      const getEasingMultiplier = (t: number) => {
        switch (easing) {
          case 'sine':
            return Math.sin(t * Math.PI);
          case 'elastic':
            return Math.sin(t * Math.PI) * Math.cos(t * Math.PI * 3);
          case 'bounce':
            return Math.abs(Math.sin(t * Math.PI * 1.5));
          case 'linear':
          default:
            return t;
        }
      };

      const easedTimeFactor = getEasingMultiplier(timeVal);

      if (meshRef.current) {
        // Floating kinetic sine wave (default continuous movement if not overridden)
        let floatVal = Math.sin(elapsedTime * (config.floatSpeed || 1.2)) * 0.25;
        
        // Spin default speed
        let spinSpeedX = 0.003 * (config.rotationSpeed || 0.8);
        let spinSpeedY = 0.006 * (config.rotationSpeed || 0.8);
        let spinSpeedZ = 0.0;

        // Standard scaling
        let customScale = config.scale || 1.0;

        // Apply Custom Animations based on trigger settings
        if (target === 'mesh') {
          if (animType === 'spin') {
            const spinDelta = 0.035 * w * speed;
            if (axis === 'all') {
              spinSpeedX += spinDelta * 0.4;
              spinSpeedY += spinDelta;
            } else if (axis === 'x') {
              spinSpeedX += spinDelta;
            } else if (axis === 'y') {
              spinSpeedY += spinDelta;
            } else if (axis === 'z') {
              spinSpeedZ += spinDelta;
            }
          } else if (animType === 'float') {
            floatVal += Math.sin(easedTimeFactor * Math.PI * 2) * 0.45 * w;
          } else if (animType === 'scalePulse') {
            customScale *= (1.0 + Math.sin(easedTimeFactor * Math.PI * 2) * 0.18 * w);
          } else if (animType === 'pulse') {
            // Pulse the emission intensity of materials
            meshRef.current.traverse((child) => {
              if ((child as any).isMesh) {
                const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                if (mat && mat.emissive) {
                  mat.emissiveIntensity = (0.35 + Math.sin(easedTimeFactor * Math.PI * 2) * 0.85 * w);
                }
              }
            });
          }
        }

        meshRef.current.position.y = floatVal;

        // Apply scale
        meshRef.current.scale.set(customScale, customScale, customScale);

        // Auto spin + manual drag velocity decay
        if (!isDragging.current) {
          manualRotation.current.y += spinSpeedY;
          manualRotation.current.x += spinSpeedX;
          manualRotation.current.z = (manualRotation.current.z || 0) + spinSpeedZ;
        }

        meshRef.current.rotation.x = manualRotation.current.x;
        meshRef.current.rotation.y = manualRotation.current.y;
        meshRef.current.rotation.z = manualRotation.current.z || 0;

        if (innerMeshRef.current) {
          innerMeshRef.current.position.y = meshRef.current.position.y;
          innerMeshRef.current.rotation.x = -manualRotation.current.x * 0.8;
          innerMeshRef.current.rotation.y = -manualRotation.current.y * 1.2;
          innerMeshRef.current.rotation.z = -(manualRotation.current.z || 0) * 0.9;
          innerMeshRef.current.scale.set(customScale * 0.9, customScale * 0.9, customScale * 0.9);
        }
      }

      // Target: Particles
      if (particlesRef.current) {
        let pRotSpeed = 0.03;
        if (target === 'particles') {
          if (animType === 'spin' || animType === 'vortex') {
            pRotSpeed = 0.03 + 0.25 * w * speed;
          } else if (animType === 'pulse') {
            const pMat = particlesRef.current.material as THREE.PointsMaterial;
            if (pMat) {
              pMat.size = 0.04 * (1.0 + Math.sin(easedTimeFactor * Math.PI * 2) * 0.6 * w);
              pMat.opacity = 0.6 * (1.0 + Math.sin(easedTimeFactor * Math.PI * 2) * 0.4 * w);
            }
          } else if (animType === 'float') {
            particlesRef.current.position.y = Math.sin(easedTimeFactor * Math.PI * 2) * 0.6 * w;
          }
        }
        particlesRef.current.rotation.y = elapsedTime * pRotSpeed;
      }

      // Target: Camera
      if (camera) {
        let camDistance = config.cameraDistance || 5;
        if (target === 'camera') {
          if (animType === 'cameraZoom') {
            camDistance = (config.cameraDistance || 5) + Math.sin(easedTimeFactor * Math.PI * 2) * 1.6 * w;
            camera.position.z = camDistance;
          } else if (animType === 'spin') {
            const angle = easedTimeFactor * Math.PI * 0.4 * w;
            camera.position.x = Math.sin(angle) * (config.cameraDistance || 5);
            camera.position.z = Math.cos(angle) * (config.cameraDistance || 5);
            camera.lookAt(0, 0, 0);
          } else if (animType === 'float') {
            camera.position.y = Math.sin(easedTimeFactor * Math.PI * 1.5) * 1.2 * w;
            camera.lookAt(0, 0, 0);
          }
        } else {
          // Reset default camera position
          camera.position.x = 0;
          camera.position.y = 0;
          camera.position.z = config.cameraDistance || 5;
          camera.lookAt(0, 0, 0);
        }
      }

      // Target: Light
      if (target === 'light') {
        if (animType === 'pulse') {
          pointLight.intensity = (config.pointLightIntensity ?? 2.0) * (config.lightIntensity ?? 1.0) * (1.0 + Math.sin(easedTimeFactor * Math.PI * 2) * 0.85 * w);
        } else if (animType === 'spin') {
          pointLight.position.x = Math.sin(easedTimeFactor * Math.PI * 2) * 4 * w;
          pointLight.position.z = Math.cos(easedTimeFactor * Math.PI * 2) * 4 * w;
        } else if (animType === 'float') {
          pointLight.position.y = Math.sin(easedTimeFactor * Math.PI * 2) * 3 * w;
        }
      } else {
        // Reset light defaults
        pointLight.position.set(0, 0, 3);
        pointLight.intensity = (config.pointLightIntensity ?? 2.0) * (config.lightIntensity ?? 1.0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0 && rendererRef.current) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [buildMesh, config]);

  // Update mesh geometry and material whenever config changes
  useEffect(() => {
    if (sceneRef.current) {
      buildMesh(sceneRef.current, config);
    }
  }, [buildMesh, config]);

  // Mouse & Pointer drag handling for 3D orbital interaction
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - prevMousePos.current.x;
    const deltaY = e.clientY - prevMousePos.current.y;

    manualRotation.current.y += deltaX * 0.008;
    manualRotation.current.x += deltaY * 0.008;

    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] md:h-[420px] select-none rounded-3xl overflow-hidden group cursor-grab active:cursor-grabbing"
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; }}
      onPointerDown={(e) => {
        handlePointerDown(e);
        if (config.animationTrigger === 'click') {
          isClickedRef.current = !isClickedRef.current;
        }
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Background ambient gradient */}
      <div className="absolute inset-0 bg-radial from-indigo-950/40 via-[#0a0d16]/80 to-[#07090f] -z-10 pointer-events-none" />

      {/* WebGL Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block touch-none" />

      {/* Overlay Status Badge */}
      <div className="absolute top-4 left-5 flex items-center gap-2 pointer-events-none">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
        </span>
        <span className="text-[11px] font-mono font-medium tracking-wide text-cyan-300/90 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded-md backdrop-blur-md">
          GL-SHADERS • 60 FPS • {config.meshType.toUpperCase()}
        </span>
      </div>

      {/* Mouse Interaction Hint */}
      <div className="absolute top-4 right-5 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] text-slate-300 pointer-events-none backdrop-blur-md">
        <Rotate3d className="w-3.5 h-3.5 text-indigo-400" />
        <span>Glisser la souris pour pivoter à 360°</span>
      </div>

      {/* Interactive 3D Transformation Gizmo Bar */}
      {(isSelected || config.showGizmo) && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 p-2 rounded-2xl bg-[#0e1322]/90 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/80 max-w-[95%] sm:max-w-md transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gizmo header with tabs */}
          <div className="flex items-center justify-between w-full px-2 pt-1 border-b border-white/5 pb-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-indigo-400 font-semibold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>3D Spatial Gizmo</span>
            </div>
            <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5">
              <button
                onClick={() => setActiveGizmoTab('mesh')}
                className={`px-2 py-0.5 rounded-md text-[10px] transition-colors ${
                  activeGizmoTab === 'mesh' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Geometry
              </button>
              <button
                onClick={() => setActiveGizmoTab('physics')}
                className={`px-2 py-0.5 rounded-md text-[10px] transition-colors ${
                  activeGizmoTab === 'physics' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Kinetics
              </button>
              <button
                onClick={() => setActiveGizmoTab('materials')}
                className={`px-2 py-0.5 rounded-md text-[10px] transition-colors ${
                  activeGizmoTab === 'materials' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Shaders
              </button>
            </div>
          </div>

          {/* Gizmo Tab 1: Geometry selectors */}
          {activeGizmoTab === 'mesh' && (
            <div className="flex items-center gap-1.5 w-full justify-center flex-wrap pt-1">
              {[
                { id: 'torusKnot', label: 'Torus Knot', icon: Orbit },
                { id: 'icosahedron', label: 'Polyhedron', icon: Box },
                { id: 'cyberCube', label: 'Matrix Cube', icon: Box },
                { id: 'sphere', label: 'Orb Sphere', icon: CircleDot },
                { id: 'rings', label: 'Dual Rings', icon: Orbit },
                { id: 'gltfPreset', label: 'Astronaut (3D)', icon: Compass },
                { id: 'customModel', label: 'Modèle GLTF', icon: Rotate3d },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    if (m.id === 'gltfPreset' && !config.gltfModelPreset) {
                      onUpdateConfig?.({ meshType: 'gltfPreset', gltfModelPreset: 'astronaut' });
                    } else {
                      onUpdateConfig?.({ meshType: m.id as any });
                    }
                  }}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] transition-all ${
                    config.meshType === m.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-md shadow-indigo-500/30'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                  }`}
                >
                  <m.icon className="w-3 h-3" />
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Gizmo Tab 2: Kinetics & Rotation Speeds */}
          {activeGizmoTab === 'physics' && (
            <div className="grid grid-cols-2 gap-3 w-full px-2 py-1 text-xs">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Spin Speed</span>
                  <span>{config.rotationSpeed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={config.rotationSpeed}
                  onChange={(e) => onUpdateConfig?.({ rotationSpeed: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Float Amplitude</span>
                  <span>{config.floatSpeed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={config.floatSpeed}
                  onChange={(e) => onUpdateConfig?.({ floatSpeed: parseFloat(e.target.value) })}
                  className="w-full accent-purple-500 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Gizmo Tab 3: Materials & Shaders */}
          {activeGizmoTab === 'materials' && (
            <div className="flex items-center justify-between w-full px-2 py-1 text-xs gap-3">
              <button
                onClick={() => onUpdateConfig?.({ wireframe: !config.wireframe })}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  config.wireframe
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                }`}
              >
                {config.wireframe ? 'Wireframe: ON' : 'Solid Shading'}
              </button>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400">Palette:</span>
                {[
                  { color: '#6366f1', glow: '#a855f7' },
                  { color: '#06b6d4', glow: '#3b82f6' },
                  { color: '#10b981', glow: '#059669' },
                  { color: '#f43f5e', glow: '#fb7185' },
                ].map((palette, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      onUpdateConfig?.({
                        color: palette.color,
                        glowColor: palette.glow,
                      })
                    }
                    className="w-5 h-5 rounded-full border border-white/20 transition-transform hover:scale-125"
                    style={{
                      background: `linear-gradient(135deg, ${palette.color}, ${palette.glow})`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Orbital Hint */}
      <div className="absolute top-4 right-5 text-[10px] text-slate-400/80 font-mono flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full border border-white/5 pointer-events-none backdrop-blur-sm">
        <Rotate3d className="w-3 h-3 text-indigo-400" />
        <span>Click & Drag to Orbit</span>
      </div>
    </div>
  );
};
