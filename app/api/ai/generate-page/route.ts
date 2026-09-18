import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { CanvasBlock } from '@/types/builder';

export async function POST(req: NextRequest) {
  try {
    const { prompt, industryPreset, themeAccent = '#6366f1', tone = 'modern' } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Un prompt descriptif est requis' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `Tu es un Lead Designer et Product Architect UI/UX d'élite.
À partir du prompt utilisateur, conçois une Landing Page complète, cohérente et ultra-professionnelle.
Tu dois renvoyer UNIQUEMENT un objet JSON valide avec la structure suivante :
{
  "projectName": string,
  "themeAccent": string,
  "summary": string,
  "blocks": [
    {
      "id": string,
      "name": string,
      "type": "header" | "hero" | "canvas3d" | "featureGrid" | "pricing" | "ctaBanner" | "footer",
      "layout": { "x": 0, "y": 0, "width": "100%", "height": "auto", "isLocked": false, "isHidden": false },
      "style": { "paddingTop": number, "paddingBottom": number, "paddingLeft": number, "paddingRight": number, "backgroundColor": string, "borderRadius": number, "borderColor": string, "borderWidth": number, "maxWidth": "1200px" },
      "content": { ... }
    }
  ]
}
Assure-toi que les blocs créés contiennent :
1. "header" avec logo, titre, 4 liens de navigation, et boutons de connexion/CTA.
2. "hero" avec badge text, grand titre percutant, titleHighlight, sous-titre explicatif, et 2 boutons d'action.
3. "canvas3d" avec configuration 3D adaptée (meshType parmi "torusKnot", "icosahedron", "cyberCube", "sphere", "rings", particleCount, rotationSpeed, etc.).
4. "featureGrid" avec titre, sous-titre, gridColumns (3 ou 4) et 3 à 4 cartes de fonctionnalités détaillées (icon, title, description, tag).
5. "pricing" avec titre, sous-titre, et 3 forfaits tarifaires réalistes (name, priceMonthly, priceAnnual, description, features[], isPopular, ctaText).
6. "ctaBanner" avec titre captivant, sous-titre, et boutons de conversion.
7. "footer" avec titre de marque, sous-titre, liens et copyright.`;

        const userPrompt = `PROJET: "${prompt}"
SECTEUR / PRESET: "${industryPreset || 'Général'}"
COULEUR ACCENT SOUHAITÉE: "${themeAccent}"
TON: "${tone}"

Génère la Landing Page complète avec tous les 7 blocs en JSON strict.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text || '';
        if (rawText.trim()) {
          const parsed = JSON.parse(rawText);
          if (parsed.blocks && Array.isArray(parsed.blocks) && parsed.blocks.length > 0) {
            return NextResponse.json({
              projectName: parsed.projectName || 'landing-page.tsx',
              themeAccent: parsed.themeAccent || themeAccent,
              summary: parsed.summary || 'Landing page générée avec succès par Gemini.',
              blocks: parsed.blocks,
            });
          }
        }
      } catch (geminiError: any) {
        console.warn('Gemini generation fallback:', geminiError?.message || geminiError);
      }
    }

    // High Quality Intelligent Fallback Generator if AI is offline or without API key
    const cleanPrompt = prompt.trim();
    const accent = themeAccent || '#6366f1';
    const fallbackBlocks: CanvasBlock[] = [
      {
        id: `block-header-${Date.now()}`,
        name: 'Header Navbar',
        type: 'header',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 24,
          paddingRight: 24,
          marginTop: 0,
          marginBottom: 0,
          backgroundColor: 'rgba(10, 13, 20, 0.75)',
          borderRadius: 16,
          borderColor: 'rgba(255, 255, 255, 0.08)',
          borderWidth: 1,
          opacity: 1,
          backdropBlur: 16,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 24,
          maxWidth: '1200px',
        },
        content: {
          title: cleanPrompt.split(' ').slice(0, 2).join(' ').toUpperCase() || 'NEXUS AI',
          links: [
            { label: 'Solutions', href: '#solutions' },
            { label: 'Fonctionnalités', href: '#features' },
            { label: 'Démonstration', href: '#demo' },
            { label: 'Tarifs', href: '#pricing' },
          ],
          primaryCtaText: 'Démarrer gratuitement',
          secondaryCtaText: 'Connexion',
        },
      },
      {
        id: `block-hero-${Date.now()}`,
        name: 'Hero Section',
        type: 'hero',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 56,
          paddingBottom: 56,
          paddingLeft: 24,
          paddingRight: 24,
          marginTop: 8,
          marginBottom: 8,
          backgroundColor: 'transparent',
          borderRadius: 24,
          borderColor: 'rgba(255, 255, 255, 0.05)',
          borderWidth: 1,
          opacity: 1,
          backdropBlur: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
          maxWidth: '1200px',
        },
        content: {
          badgeText: `✨ Nouvelle Génération — ${cleanPrompt.slice(0, 45)}`,
          title: 'Révolutionnez votre flux avec',
          titleHighlight: cleanPrompt.length > 30 ? cleanPrompt.slice(0, 30) + '...' : cleanPrompt,
          subtitle: `Propulsez vos projets grâce à une infrastructure intelligente. Automatisez, optimisez et développez à l'échelle supérieure avec une précision inégalée.`,
          primaryCtaText: 'Commencer l&apos;essai gratuit',
          secondaryCtaText: 'Voir la démo interactive',
        },
      },
      {
        id: `block-3d-${Date.now()}`,
        name: '3D Spatial Interactive Demo',
        type: 'canvas3d',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 32,
          paddingBottom: 32,
          paddingLeft: 24,
          paddingRight: 24,
          marginTop: 8,
          marginBottom: 8,
          backgroundColor: 'rgba(12, 16, 28, 0.6)',
          borderRadius: 24,
          borderColor: 'rgba(99, 102, 241, 0.2)',
          borderWidth: 1,
          opacity: 1,
          backdropBlur: 16,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
          maxWidth: '1200px',
        },
        content: {
          title: 'Immersion Visuelle & Calcul Spatial',
          subtitle: 'Expérience interactive 3D temps réel alimentée par le moteur WebGL.',
          threeDConfig: {
            meshType: 'torusKnot',
            wireframe: false,
            glassFactor: 0.35,
            roughness: 0.15,
            metalness: 0.85,
            materialPreset: 'cyberGlass',
            ambientLightColor: '#ffffff',
            ambientLightIntensity: 0.8,
            directionalLightColor: accent,
            directionalLightIntensity: 1.5,
            pointLightColor: '#a855f7',
            pointLightIntensity: 2.0,
            rotationSpeed: 0.6,
            floatSpeed: 0.4,
            lightIntensity: 1.2,
            color: accent,
            glowColor: '#a855f7',
            rx: 0,
            ry: 0,
            rz: 0,
            scale: 1,
            particleCount: 160,
            particleColor: accent,
            particleSpeed: 0.5,
            showGizmo: false,
            cameraDistance: 6,
            cameraFov: 45,
            animationType: 'float',
            animationSpeed: 1,
          },
        },
      },
      {
        id: `block-features-${Date.now()}`,
        name: 'Bento Grid Features',
        type: 'featureGrid',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 64,
          paddingBottom: 64,
          paddingLeft: 24,
          paddingRight: 24,
          marginTop: 8,
          marginBottom: 8,
          backgroundColor: 'transparent',
          borderRadius: 24,
          borderColor: 'rgba(255, 255, 255, 0.05)',
          borderWidth: 1,
          opacity: 1,
          backdropBlur: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 32,
          maxWidth: '1200px',
        },
        content: {
          title: 'Conçu pour une Performance Sans Compromis',
          subtitle: 'Une suite complète d’outils pensés pour maximiser votre efficacité au quotidien.',
          gridColumns: 3,
          features: [
            {
              id: `feat-1-${Date.now()}`,
              icon: 'Zap',
              title: 'Exécution Instantanée',
              description: 'Traitement sub-milliseconde et latence minimale pour tous vos processus critiques.',
              tag: 'Temps Réel',
            },
            {
              id: `feat-2-${Date.now()}`,
              icon: 'Shield',
              title: 'Sécurité & Chiffrement de Pointe',
              description: 'Protocoles bancaires et conformité SOC2 / RGPD intégrés nativement.',
              tag: 'Certifié',
            },
            {
              id: `feat-3-${Date.now()}`,
              icon: 'Cpu',
              title: 'Intelligence Algorithmique',
              description: 'Modèles prédictifs et suggestions autonomes adaptées à votre contexte métier.',
              tag: 'IA Native',
            },
            {
              id: `feat-4-${Date.now()}`,
              icon: 'Sparkles',
              title: 'Personnalisation Absolue',
              description: 'Adaptez chaque vue, tableau de bord et intégration à l’image exacte de votre marque.',
              tag: 'Modulable',
            },
            {
              id: `feat-5-${Date.now()}`,
              icon: 'Boxes',
              title: 'Intégrations Clé en Main',
              description: 'Connectez vos services tiers en quelques clics via nos connecteurs API standardisés.',
              tag: 'API 2.0',
            },
            {
              id: `feat-6-${Date.now()}`,
              icon: 'Layers',
              title: 'Collaboration Multi-Équipe',
              description: 'Édition partagée, historiques de versions et synchronisation d’état instantanée.',
              tag: 'Équipe',
            },
          ],
        },
      },
      {
        id: `block-pricing-${Date.now()}`,
        name: 'Grille Tarifaire',
        type: 'pricing',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 64,
          paddingBottom: 64,
          paddingLeft: 24,
          paddingRight: 24,
          marginTop: 8,
          marginBottom: 8,
          backgroundColor: 'rgba(10, 13, 22, 0.5)',
          borderRadius: 24,
          borderColor: 'rgba(255, 255, 255, 0.06)',
          borderWidth: 1,
          opacity: 1,
          backdropBlur: 12,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 32,
          maxWidth: '1200px',
        },
        content: {
          title: 'Des Tarifs Clairs et Transparents',
          subtitle: 'Choisissez la formule parfaitement calibrée pour votre stade de croissance.',
          pricingPlans: [
            {
              id: `plan-starter-${Date.now()}`,
              name: 'Starter',
              priceMonthly: 0,
              priceAnnual: 0,
              description: 'Idéal pour explorer et valider votre premier projet.',
              features: ['Jusqu’à 3 projets actifs', 'Modèles IA standards', 'Support communautaire', 'Export code propre'],
              ctaText: 'Commencer Gratuitement',
              isPopular: false,
            },
            {
              id: `plan-pro-${Date.now()}`,
              name: 'Pro Vision',
              priceMonthly: 29,
              priceAnnual: 22,
              description: 'Pour les créateurs et équipes en pleine accélération.',
              features: [
                'Projets illimités',
                'Inférence IA Haute Vitesse',
                'Rendu 3D & WebGL avancé',
                'Support prioritaire 24/7',
                'Domaines personnalisés',
              ],
              ctaText: 'Passer à la vitesse Pro',
              isPopular: true,
            },
            {
              id: `plan-enterprise-${Date.now()}`,
              name: 'Enterprise Scale',
              priceMonthly: 99,
              priceAnnual: 79,
              description: 'Pour les entreprises exigeant SLA, sécurité dédiée et volume.',
              features: [
                'Clusters GPU & compute dédiés',
                'Garantie SLA 99.99%',
                'Gestionnaire de compte dédié',
                'Intégration SSO SAML / Okta',
                'Audit de sécurité sur-mesure',
              ],
              ctaText: 'Contacter l&apos;équipe',
              isPopular: false,
            },
          ],
        },
      },
      {
        id: `block-cta-${Date.now()}`,
        name: 'Bannière Call-to-Action',
        type: 'ctaBanner',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 56,
          paddingBottom: 56,
          paddingLeft: 24,
          paddingRight: 24,
          marginTop: 12,
          marginBottom: 12,
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderRadius: 28,
          borderColor: 'rgba(99, 102, 241, 0.35)',
          borderWidth: 1,
          opacity: 1,
          backdropBlur: 16,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
          maxWidth: '1200px',
        },
        content: {
          badgeText: '🚀 Déploiement en 60 secondes',
          title: 'Prêt à transformer votre vision en réalité ?',
          subtitle: 'Rejoignez plus de 10 000 développeurs et créateurs qui conçoivent le futur dès aujourd’hui.',
          primaryCtaText: 'Créer mon compte maintenant',
          secondaryCtaText: 'Planifier un échange',
        },
      },
      {
        id: `block-footer-${Date.now()}`,
        name: 'Footer Pro',
        type: 'footer',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 40,
          paddingBottom: 40,
          paddingLeft: 24,
          paddingRight: 24,
          marginTop: 16,
          marginBottom: 0,
          backgroundColor: 'rgba(6, 9, 15, 0.95)',
          borderRadius: 20,
          borderColor: 'rgba(255, 255, 255, 0.08)',
          borderWidth: 1,
          opacity: 1,
          backdropBlur: 12,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
          maxWidth: '1200px',
        },
        content: {
          title: cleanPrompt.split(' ').slice(0, 2).join(' ').toUpperCase() || 'NEXUS AI',
          subtitle: 'La plateforme de nouvelle génération pour concevoir des expériences web immersives et performantes.',
          copyrightText: `© ${new Date().getFullYear()} ${cleanPrompt.split(' ').slice(0, 2).join(' ') || 'Nexus Inc'}. Tous droits réservés.`,
          links: [
            { label: 'Documentation', href: '#' },
            { label: 'Sécurité', href: '#' },
            { label: 'Politique de confidentialité', href: '#' },
            { label: 'Conditions de service', href: '#' },
          ],
        },
      },
    ];

    return NextResponse.json({
      projectName: `${cleanPrompt.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20) || 'saas-landing'}.tsx`,
      themeAccent: accent,
      summary: `Landing page complète et harmonisée générée pour "${cleanPrompt}".`,
      blocks: fallbackBlocks,
    });
  } catch (error: any) {
    console.error('Erreur API generate-page:', error);
    return NextResponse.json(
      { error: error?.message || 'Erreur lors de la génération de la landing page.' },
      { status: 500 }
    );
  }
}
