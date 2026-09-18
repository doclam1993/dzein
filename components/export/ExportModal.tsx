'use client';

import React, { useState } from 'react';
import { 
  X, Copy, Check, Download, FileCode, Sparkles, Terminal, ExternalLink, FolderArchive 
} from 'lucide-react';
import JSZip from 'jszip';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reactCode: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  reactCode,
}) => {
  const [activeTab, setActiveTab] = useState<'react' | 'nextjs' | 'tree' | 'tailwind' | 'package'>('react');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const nextJsCode = `'use client';\n\n// Next.js App Router Page - Exported from opendesign\n${reactCode}`;

  const projectTreeContent = `📂 opendesign-pro-project/
├── 📂 app/
│   ├── 📄 layout.tsx            # Root layout with fonts, metadata & providers
│   ├── 📄 page.tsx              # Main Studio & Landing Canvas view
│   ├── 📄 globals.css           # Tailwind v4 configuration & base styles
│   └── 📂 api/                  # Server-side API endpoints
│       └── 📂 agent/
│           └── 📄 route.ts      # Gemini AI Generation & Diff engine
├── 📂 components/
│   ├── 📂 canvas/
│   │   ├── 📄 BuilderCanvas.tsx # 2D/3D interactive modular block renderer
│   │   └── 📄 ThreeDCanvasWidget.tsx # Three.js WebGL 3D widget
│   ├── 📂 sidebar/
│   │   └── 📄 LeftSidebar.tsx   # Professional DOM layer tree & arborescence
│   ├── 📂 ai/
│   │   ├── 📄 LeftPromptPanel.tsx # AI Prompt & agent inspector
│   │   └── 📄 AIProvidersModal.tsx # Multi-provider AI key manager
│   └── 📂 export/
│       └── 📄 ExportModal.tsx   # Pro production code export & tree viewer
├── 📂 lib/
│   ├── 📄 codeGenerator.ts      # Clean production React code emitter
│   └── 📄 initialData.ts        # Default modular sections & components
├── 📂 types/
│   ├── 📄 builder.ts            # Strict TypeScript domain interfaces
│   └── 📄 ai.ts                 # AI types & providers schema
├── 📄 package.json              # Dependencies: Next.js 15, React 19, Three.js
├── 📄 tailwind.config.ts        # Design tokens & color system
├── 📄 .env.example              # Environment variables template
└── 📄 README.md                 # Professional architecture documentation`;

  const tailwindTokens = `// tailwind.config.ts / CSS Tokens
export default {
  theme: {
    extend: {
      colors: {
        canvas: '#07090e',
        brand: {
          indigo: '#6366f1',
          purple: '#a855f7',
          cyan: '#06b6d4',
        }
      },
      backdropBlur: {
        '2xl': '24px',
      }
    }
  }
};`;

  const packageJsonContent = `{
  "name": "opendesign-generated-saas",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.553.0",
    "motion": "^12.0.0",
    "three": "^0.170.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/three": "^0.170.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.0.0",
    "tailwindcss": "^4.0.0"
  }
}`;

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'nextjs':
        return nextJsCode;
      case 'tree':
        return projectTreeContent;
      case 'tailwind':
        return tailwindTokens;
      case 'package':
        return packageJsonContent;
      default:
        return reactCode;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCompleteProjectZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Root files
      zip.file('package.json', packageJsonContent);
      zip.file('postcss.config.mjs', `export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};`);
      zip.file('tailwind.config.ts', tailwindTokens);
      zip.file('tsconfig.json', `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`);
      zip.file('next.config.ts', `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;`);
      zip.file('.env.example', `# Environment Variables Template
NEXT_PUBLIC_APP_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key_here
`);
      zip.file('README.md', `# OpenDesign SaaS Pro Project

Ce projet Next.js ultra-professionnel a été conçu et exporté directement depuis l'application OpenDesign Studio.

## Architecture du Projet
- **app/** : Configuration du App Router (Next.js 15), Layout global et CSS.
- **components/** : Widgets interactifs 2D & 3D (WebGL).
- **lib/** : Fonctions utilitaires d'assemblage et styles fusionnés.

## Guide de Démarrage Rapide

### 1. Installation des Dépendances
Lancez la commande suivante dans votre terminal :
\`\`\`bash
npm install
\`\`\`

### 2. Lancement en Mode Développement
Démarrez le serveur local :
\`\`\`bash
npm run dev
\`\`\`
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour visualiser votre application.

### 3. Build de Production
Générez les fichiers optimisés pour la mise en production :
\`\`\`bash
npm run build
\`\`\`
Puis démarrez le serveur optimisé :
\`\`\`bash
npm run start
\`\`\`

## Technologies Utilisées
- **Next.js 15+** (App Router)
- **React 19**
- **Tailwind CSS v4**
- **Three.js** (Rendus 3D interactifs)
- **Lucide React** (Système d'icônes pro)`);

      // app folder
      const appFolder = zip.folder('app');
      if (appFolder) {
        appFolder.file('layout.tsx', `import React from 'react';
import './globals.css';

export const metadata = {
  title: 'OpenDesign SaaS Pro',
  description: 'Projet complet généré avec une architecture professionnelle.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#07090e] text-slate-100 antialiased overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}`);
        appFolder.file('globals.css', `@import "tailwindcss";

@layer base {
  body {
    background-color: #07090e;
    color: #f8fafc;
    font-family: sans-serif;
  }
}`);
        appFolder.file('page.tsx', nextJsCode);
      }

      // lib folder
      const libFolder = zip.folder('lib');
      if (libFolder) {
        libFolder.file('utils.ts', `import { clsx, type ClassValue } from "clsx";
import { tailwindMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return tailwindMerge(clsx(inputs));
}`);
      }

      // components folder
      const compFolder = zip.folder('components');
      if (compFolder) {
        compFolder.file('ThreeDCanvasWidget.tsx', `'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeDCanvasWidget = ({ config }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(containerRef.current.clientWidth, 400);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(1.3, 0.4, 120, 16);
    const material = new THREE.MeshStandardMaterial({
      color: config?.color || '#6366f1',
      roughness: 0.2,
      metalness: 0.8,
      wireframe: config?.wireframe || false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const light = new THREE.DirectionalLight('#ffffff', 1.5);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight('#222222', 1));

    camera.position.z = 4;

    const animate = () => {
      requestAnimationFrame(animate);
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [config]);

  return <div ref={containerRef} className="w-full h-[400px] flex items-center justify-center bg-transparent" />;
};`);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'opendesign-production-project.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownload = () => {
    const filename =
      activeTab === 'react'
        ? 'OpenDesignLandingPage.tsx'
        : activeTab === 'nextjs'
        ? 'page.tsx'
        : activeTab === 'tree'
        ? 'architecture-tree.txt'
        : activeTab === 'tailwind'
        ? 'tailwind.config.ts'
        : 'package.json';

    const blob = new Blob([getCurrentCode()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-4xl max-h-[85vh] rounded-2xl bg-[#0b0e18] border border-white/10 shadow-2xl flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#090c14]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Export Code Production</h2>
              <p className="text-[11px] text-slate-400">
                Code prêt pour déploiement Next.js, Vercel ou Cloud Run.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-[#0c101a]">
          <div className="flex items-center gap-1">
            {[
              { id: 'react', label: 'React.tsx' },
              { id: 'nextjs', label: 'Next.js App Router' },
              { id: 'tree', label: 'Arborescence Pro' },
              { id: 'tailwind', label: 'Tailwind Tokens' },
              { id: 'package', label: 'package.json' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-medium transition-colors"
              title="Télécharger le fichier actuellement affiché"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger ce fichier</span>
            </button>

            <button
              onClick={handleDownloadCompleteProjectZip}
              disabled={isZipping}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-semibold transition-all shadow-md shadow-emerald-500/20"
              title="Télécharger l'intégralité de l'arborescence et des fichiers du projet prêt pour la production sous format ZIP"
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Compression...' : 'Télécharger Projet ZIP complet'}</span>
            </button>
          </div>
        </div>

        {/* Code Content View */}
        <div className="flex-1 overflow-auto p-4 bg-[#06080e] font-mono text-[11px] text-slate-300 leading-relaxed">
          <pre className="select-text whitespace-pre-wrap">
            {getCurrentCode()}
          </pre>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-white/[0.06] bg-[#090c14] flex items-center justify-between text-slate-400 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Typescript 5.9 • Tailwind CSS v4 • Zero external CSS</span>
          </div>
          <span>opendesign visual engine</span>
        </div>
      </div>
    </div>
  );
};
