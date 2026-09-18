import { CanvasBlock } from '@/types/builder';

export interface TemplatePreset {
  id: string;
  name: string;
  category: 'saas' | 'fintech' | 'portfolio' | 'ecommerce' | 'mobile';
  description: string;
  badge: string;
  accentColor: string;
  bgTheme: string;
  fontHeading: string;
  fontBody: string;
  previewImage?: string;
  blocks: CanvasBlock[];
}

export const THEMATIC_TEMPLATES: TemplatePreset[] = [
  {
    id: 'saas-minimaliste',
    name: 'SaaS Minimaliste',
    category: 'saas',
    description: 'Structure épurée, typographie ultra-lisible, grille Bento fonctionnelle et conversion optimale.',
    badge: 'Pro SaaS',
    accentColor: '#6366f1',
    bgTheme: '#07090e',
    fontHeading: 'Plus Jakarta Sans',
    fontBody: 'Inter',
    blocks: [
      {
        id: 'saas-nav',
        name: 'Barre de Navigation SaaS',
        type: 'header',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 16, paddingBottom: 16, paddingLeft: 24, paddingRight: 24,
          marginTop: 0, marginBottom: 12,
          backgroundColor: 'rgba(10, 13, 20, 0.8)',
          borderRadius: 16, borderColor: 'rgba(255, 255, 255, 0.08)', borderWidth: 1,
          opacity: 1, backdropBlur: 16, display: 'flex', flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', gap: 24, maxWidth: '1200px'
        },
        content: {
          title: 'AuraCloud',
          links: [
            { label: 'Fonctionnalités', href: '#features' },
            { label: 'Grille Bento', href: '#bento' },
            { label: 'Témoignages', href: '#testimonials' },
            { label: 'Tarifs', href: '#pricing' }
          ],
          primaryCtaText: 'Essai Gratuit 14 Jours',
          secondaryCtaText: 'Connexion'
        }
      },
      {
        id: 'saas-hero',
        name: 'Héros SaaS Minimaliste',
        type: 'hero',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 56, paddingBottom: 56, paddingLeft: 24, paddingRight: 24,
          marginTop: 0, marginBottom: 16,
          backgroundColor: 'transparent', borderRadius: 24, borderColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1,
          opacity: 1, backdropBlur: 0, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', gap: 20, maxWidth: '1200px'
        },
        content: {
          badgeText: '✨ Plateforme v4.0 — Prête pour la production',
          title: 'Simplifiez la gestion de votre',
          titleHighlight: 'SaaS en temps réel',
          subtitle: 'Une suite d’outils épurée, rapide et réactive pour automatiser vos workflows sans complexité technique.',
          primaryCtaText: 'Lancer mon projet',
          secondaryCtaText: 'Voir la démo interactive'
        }
      },
      {
        id: 'saas-bento',
        name: 'Grille Bento Dynamique',
        type: 'featureGrid',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 40, paddingBottom: 40, paddingLeft: 24, paddingRight: 24,
          marginTop: 0, marginBottom: 16,
          backgroundColor: 'rgba(13, 17, 27, 0.5)', borderRadius: 24, borderColor: 'rgba(255, 255, 255, 0.06)', borderWidth: 1,
          opacity: 1, backdropBlur: 16, display: 'grid', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'stretch', gap: 20, maxWidth: '1200px'
        },
        content: {
          badgeText: 'ARCHITECTURE BENTO',
          title: 'Tout ce dont votre équipe a besoin',
          subtitle: 'Des cartes interactives magnétiques adaptées à la performance modern web.',
          gridColumns: 3,
          features: [
            { id: 'sb-1', icon: 'Zap', title: 'Calcul Sub-10ms', description: 'Moteur réactif distribuant les événements en temps réel avec latence imperceptible.', tag: 'Noyau' },
            { id: 'sb-2', icon: 'ShieldCheck', title: 'Sécurité ISO 27001', description: 'Chiffrement AES-256 de bout en bout avec isolation stricte des données.', tag: 'Sécurité' },
            { id: 'sb-3', icon: 'Bot', title: 'Agent IA Intégré', description: 'Copilote intelligent qui suggère et valide vos modifications en continu.', tag: 'IA' },
            { id: 'sb-4', icon: 'Boxes', title: 'Composants Modulaires', description: 'Bibliothèque de blocs réutilisables synchronisés avec votre design system.', tag: 'UI System' },
            { id: 'sb-5', icon: 'GitBranch', title: 'Historique Git Visuel', description: 'Conservez et comparez les versions de vos pages sans perte de données.', tag: 'Git' },
            { id: 'sb-6', icon: 'Code2', title: 'Export TypeScript Clean', description: 'Code React & Tailwind prêt à être déployé sur Vercel ou Cloud Run.', tag: 'Export' }
          ]
        }
      },
      {
        id: 'saas-lead',
        name: 'Capture de Leads SaaS',
        type: 'ctaBanner',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 40, paddingBottom: 40, paddingLeft: 24, paddingRight: 24,
          marginTop: 0, marginBottom: 16,
          backgroundColor: 'rgba(99, 102, 241, 0.08)', borderRadius: 24, borderColor: 'rgba(99, 102, 241, 0.25)', borderWidth: 1,
          opacity: 1, backdropBlur: 16, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', gap: 16, maxWidth: '1200px'
        },
        content: {
          bannerTitle: 'Rejoignez plus de 12 000 développeurs',
          bannerSubtitle: 'Inscrivez votre e-mail pour recevoir notre guide d&apos;architecture SaaS & un accès anticipé.',
          primaryCtaText: 'S&apos;inscrire à la Beta'
        }
      },
      {
        id: 'saas-footer',
        name: 'Pied de Page SaaS',
        type: 'footer',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 24, paddingBottom: 24, paddingLeft: 24, paddingRight: 24,
          marginTop: 0, marginBottom: 0,
          backgroundColor: 'transparent', borderRadius: 0, borderColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1,
          opacity: 1, backdropBlur: 0, display: 'flex', flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', gap: 16, maxWidth: '1200px'
        },
        content: {
          title: 'AuraCloud Inc.',
          subtitle: 'Le standard minimaliste pour SaaS moderne.',
          copyrightText: '© 2026 AuraCloud. Tous droits réservés.'
        }
      }
    ]
  },
  {
    id: 'dark-luxury-fintech',
    name: 'Dark Luxury Fintech',
    category: 'fintech',
    description: 'Fonds obsidienne, accents néons émeraude & or, métriques boursières, sécurité cryptographique & statut VIP.',
    badge: 'Luxury Dark',
    accentColor: '#10b981',
    bgTheme: '#05070d',
    fontHeading: 'Cabinet Grotesk',
    fontBody: 'Plus Jakarta Sans',
    blocks: [
      {
        id: 'fintech-header',
        name: 'Navbar Fintech VIP',
        type: 'header',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 16, paddingBottom: 16, paddingLeft: 24, paddingRight: 24,
          marginTop: 0, marginBottom: 12,
          backgroundColor: 'rgba(5, 7, 13, 0.9)',
          borderRadius: 20, borderColor: 'rgba(16, 185, 129, 0.25)', borderWidth: 1,
          opacity: 1, backdropBlur: 20, display: 'flex', flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', gap: 24, maxWidth: '1200px'
        },
        content: {
          title: 'AUREUS PRIVATE',
          links: [
            { label: 'Gestion Privée', href: '#private' },
            { label: 'Actifs Quantiques', href: '#assets' },
            { label: 'Sécurité & Vault', href: '#vault' },
            { label: 'Accès Membres', href: '#vip' }
          ],
          primaryCtaText: 'Demander une carte VIP',
          secondaryCtaText: 'Portail Client'
        }
      },
      {
        id: 'fintech-hero',
        name: 'Héros Dark Luxury Fintech',
        type: 'hero',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 64, paddingBottom: 64, paddingLeft: 24, paddingRight: 24,
          marginTop: 0, marginBottom: 16,
          backgroundColor: 'rgba(10, 16, 26, 0.6)', borderRadius: 28, borderColor: 'rgba(16, 185, 129, 0.2)', borderWidth: 1,
          opacity: 1, backdropBlur: 20, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', gap: 24, maxWidth: '1200px'
        },
        content: {
          badgeText: '💎 Vault Algorithmique Privé — Certifié Tier 1',
          title: 'L’Infrastucture Financière d’Élite pour',
          titleHighlight: 'Actifs Numériques & Capitaux',
          subtitle: 'Exécution d’ordres à haute fréquence, rendement sécurisé par smart contracts et gouvernance sur-mesure.',
          primaryCtaText: 'Rejoindre le Club Aureus',
          secondaryCtaText: 'Découvrir le Rapport Trimestriel'
        }
      },
      {
        id: 'fintech-3d',
        name: 'Géo 3D Hologramme Financier',
        type: 'canvas3d',
        layout: { x: 0, y: 0, width: '100%', height: 400, isLocked: false, isHidden: false },
        style: {
          paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16,
          marginTop: 0, marginBottom: 16,
          backgroundColor: 'rgba(6, 10, 18, 0.85)', borderRadius: 28, borderColor: 'rgba(245, 158, 11, 0.3)', borderWidth: 1,
          opacity: 1, backdropBlur: 24, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', gap: 12, maxWidth: '1200px'
        },
        content: {
          badgeText: 'Hologramme Quantique d’Actifs',
          title: 'Visualisation Dynamique de Portefeuille',
          subtitle: 'Modélisation tridimensionnelle des flux de liquidités globales'
        },
        threeConfig: {
          meshType: 'icosahedron',
          wireframe: true,
          glassFactor: 0.95,
          rotationSpeed: 1.5,
          floatSpeed: 1.8,
          lightIntensity: 2.0,
          color: '#10b981',
          glowColor: '#f59e0b',
          rx: 30, ry: 45, rz: 10,
          scale: 1.1,
          particleCount: 120,
          showGizmo: true
        }
      },
      {
        id: 'fintech-bento',
        name: 'Cartes Fintech Magnétiques',
        type: 'featureGrid',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 40, paddingBottom: 40, paddingLeft: 24, paddingRight: 24,
          marginTop: 0, marginBottom: 16,
          backgroundColor: 'transparent', borderRadius: 24, borderColor: 'transparent', borderWidth: 0,
          opacity: 1, backdropBlur: 0, display: 'grid', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'stretch', gap: 20, maxWidth: '1200px'
        },
        content: {
          badgeText: 'SERVICES DE BANQUE PRIVÉE',
          title: 'Une Expérience Financière Absolue',
          subtitle: 'Des outils de précision conçus pour les investisseurs institutionnels et family offices.',
          gridColumns: 3,
          features: [
            { id: 'f-1', icon: 'ShieldCheck', title: 'Vault Cold Storage', description: 'Protection multi-signatures et conservation à froid avec assurance Lloyds à hauteur de 500M$.', tag: 'SÉCURITÉ' },
            { id: 'f-2', icon: 'Zap', title: 'Exécution Microseconde', description: 'Connexion directe aux pools de liquidité mondiaux avec slippage garanti sous 0.001%.', tag: 'VITESSE' },
            { id: 'f-3', icon: 'Bot', title: 'Arbitrage IA Autonome', description: 'Stratégies quantitatives ajustées en temps réel selon la volatilité inter-marchés.', tag: 'QUANT' }
          ]
        }
      },
      {
        id: 'fintech-footer',
        name: 'Footer Dark Luxury',
        type: 'footer',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 24, paddingBottom: 24, paddingLeft: 24, paddingRight: 24,
          marginTop: 0, marginBottom: 0,
          backgroundColor: 'rgba(5, 7, 13, 0.95)', borderRadius: 16, borderColor: 'rgba(255, 255, 255, 0.08)', borderWidth: 1,
          opacity: 1, backdropBlur: 16, display: 'flex', flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', gap: 16, maxWidth: '1200px'
        },
        content: {
          title: 'Aureus Private Wealth',
          subtitle: 'Membre certifié de la FMA & FINMA • Genève - Londres - Singapour',
          copyrightText: '© 2026 Aureus Private Holdings. Tous droits réservés.'
        }
      }
    ]
  },
  {
    id: 'portfolio-creatif',
    name: 'Portfolio Créatif',
    category: 'portfolio',
    description: 'Design éditorial, typographies expressives (Playfair & Syne), cartes projets interactives et formulaire de contact.',
    badge: 'Créatif',
    accentColor: '#ec4899',
    bgTheme: '#0a0a0f',
    fontHeading: 'Playfair Display',
    fontBody: 'Outfit',
    blocks: [
      {
        id: 'port-header',
        name: 'En-tête Portfolio',
        type: 'header',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 16, paddingBottom: 16, paddingLeft: 24, paddingRight: 24,
          marginTop: 0, marginBottom: 12,
          backgroundColor: 'rgba(10, 10, 15, 0.8)',
          borderRadius: 20, borderColor: 'rgba(236, 72, 153, 0.2)', borderWidth: 1,
          opacity: 1, backdropBlur: 16, display: 'flex', flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', gap: 24, maxWidth: '1200px'
        },
        content: {
          title: 'STUDIO LUNA °',
          links: [
            { label: 'Projets', href: '#projects' },
            { label: 'Direction Artistique', href: '#about' },
            { label: 'Témoignages', href: '#reviews' },
            { label: 'Contact', href: '#contact' }
          ],
          primaryCtaText: 'Demander un devis',
          secondaryCtaText: 'Portfolio PDF'
        }
      },
      {
        id: 'port-hero',
        name: 'Héros Créatif & Designer',
        type: 'hero',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 60, paddingBottom: 60, paddingLeft: 24, paddingRight: 24,
          marginTop: 0, marginBottom: 16,
          backgroundColor: 'transparent', borderRadius: 24, borderColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1,
          opacity: 1, backdropBlur: 0, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', gap: 20, maxWidth: '1200px'
        },
        content: {
          badgeText: '🎨 Direction Artistique & Digital Product Design',
          title: 'Nous créons des expériences visuelles',
          titleHighlight: 'mémorables & immersives',
          subtitle: 'Accompagnement des marques audacieuses de la conception de marque au prototype interactif 3D.',
          primaryCtaText: 'Découvrir nos projets',
          secondaryCtaText: 'Prendre rendez-vous'
        }
      },
      {
        id: 'port-bento',
        name: 'Galerie de Projets Récents',
        type: 'featureGrid',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 40, paddingBottom: 40, paddingLeft: 24, paddingRight: 24,
          marginTop: 0, marginBottom: 16,
          backgroundColor: 'rgba(15, 15, 24, 0.6)', borderRadius: 24, borderColor: 'rgba(236, 72, 153, 0.15)', borderWidth: 1,
          opacity: 1, backdropBlur: 16, display: 'grid', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'stretch', gap: 20, maxWidth: '1200px'
        },
        content: {
          badgeText: 'SÉLECTION 2026',
          title: 'Projets Signatures',
          subtitle: 'Découvrez notre travail pour des clients internationaux.',
          gridColumns: 3,
          features: [
            { id: 'p-1', icon: 'Sparkles', title: 'Identité KRONOS 3D', description: 'Branding complet, typographie sur-mesure et expérience 3D WebGL pour montre de luxe.', tag: 'BRANDING' },
            { id: 'p-2', icon: 'Boxes', title: 'Application NEBULA', description: 'Interface mobile UI/UX moderne avec micro-interactions fluides et mode sombre natif.', tag: 'PRODUCT' },
            { id: 'p-3', icon: 'Zap', title: 'Campagne SOLIS', description: 'Direction artistique, motion design et site e-commerce haute vitesse.', tag: 'E-COMMERCE' }
          ]
        }
      },
      {
        id: 'port-footer',
        name: 'Pied de Page Créatif',
        type: 'footer',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 24, paddingBottom: 24, paddingLeft: 24, paddingRight: 24,
          marginTop: 0, marginBottom: 0,
          backgroundColor: 'transparent', borderRadius: 0, borderColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1,
          opacity: 1, backdropBlur: 0, display: 'flex', flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', gap: 16, maxWidth: '1200px'
        },
        content: {
          title: 'Studio Luna °',
          subtitle: 'Basé à Paris & Tokyo. Disponible pour projets sélectifs.',
          copyrightText: '© 2026 Studio Luna. Tous droits réservés.'
        }
      }
    ]
  },
  {
    id: 'e-commerce-showcase',
    name: 'E-commerce Modern Store',
    category: 'ecommerce',
    description: 'Cartes produits haute résolution, bannière de réduction, carrousel d’avis clients et capture de leads VIP.',
    badge: 'Storefront',
    accentColor: '#f59e0b',
    bgTheme: '#090a10',
    fontHeading: 'Space Grotesk',
    fontBody: 'Plus Jakarta Sans',
    blocks: [
      {
        id: 'ecom-nav',
        name: 'Barre Boutique E-commerce',
        type: 'header',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 16, paddingBottom: 16, paddingLeft: 24, paddingRight: 24,
          marginTop: 0, marginBottom: 12,
          backgroundColor: 'rgba(12, 14, 22, 0.85)',
          borderRadius: 20, borderColor: 'rgba(245, 158, 11, 0.2)', borderWidth: 1,
          opacity: 1, backdropBlur: 16, display: 'flex', flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', gap: 24, maxWidth: '1200px'
        },
        content: {
          title: 'NEO LABS',
          links: [
            { label: 'Nouveautés', href: '#new' },
            { label: 'Audio & Tech', href: '#tech' },
            { label: 'Collections', href: '#collections' },
            { label: 'Avis Clients', href: '#reviews' }
          ],
          primaryCtaText: 'Mon Panier (0)',
          secondaryCtaText: 'Rechercher'
        }
      },
      {
        id: 'ecom-hero',
        name: 'Héros Boutique Tech',
        type: 'hero',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 56, paddingBottom: 56, paddingLeft: 24, paddingRight: 24,
          marginTop: 0, marginBottom: 16,
          backgroundColor: 'rgba(18, 20, 32, 0.6)', borderRadius: 28, borderColor: 'rgba(245, 158, 11, 0.15)', borderWidth: 1,
          opacity: 1, backdropBlur: 16, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', gap: 20, maxWidth: '1200px'
        },
        content: {
          badgeText: '🔥 Nouvelle Collection 2026 — Livraison Offerte',
          title: 'L’Acoustique Haute Définition',
          titleHighlight: 'Sans Compromis',
          subtitle: 'Casques à réduction de bruit active de nouvelle génération, conçus pour les audiophiles et professionnels.',
          primaryCtaText: 'Acheter Maintenant (-20%)',
          secondaryCtaText: 'Explorer les Fiches Techniques'
        }
      },
      {
        id: 'ecom-grid',
        name: 'Grille Produits Végétalisés',
        type: 'featureGrid',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 40, paddingBottom: 40, paddingLeft: 24, paddingRight: 24,
          marginTop: 0, marginBottom: 16,
          backgroundColor: 'transparent', borderRadius: 24, borderColor: 'transparent', borderWidth: 0,
          opacity: 1, backdropBlur: 0, display: 'grid', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'stretch', gap: 20, maxWidth: '1200px'
        },
        content: {
          badgeText: 'SÉLECTION DU MOIS',
          title: 'Boutique Produits Tendances',
          subtitle: 'Inclus garantie 2 ans constructeur et retours gratuits pendant 30 jours.',
          gridColumns: 3,
          features: [
            { id: 'ec-1', icon: 'Zap', title: 'Casque NeoPods Max', description: 'Audio spatial 3D, autonomie 40h et charge rapide USB-C.', tag: '299€' },
            { id: 'ec-2', icon: 'Boxes', title: 'Enceinte Horizon Pro', description: 'Moteur acoustique en magnésium et résilience IPX7 waterproof.', tag: '189€' },
            { id: 'ec-3', icon: 'Sparkles', title: 'Écouteurs Pro X', description: 'Annulation active du bruit hybride et boîtier à recharge sans fil.', tag: '149€' }
          ]
        }
      },
      {
        id: 'ecom-footer',
        name: 'Pied de Page E-commerce',
        type: 'footer',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 24, paddingBottom: 24, paddingLeft: 24, paddingRight: 24,
          marginTop: 0, marginBottom: 0,
          backgroundColor: 'rgba(12, 14, 22, 0.9)', borderRadius: 16, borderColor: 'rgba(255, 255, 255, 0.08)', borderWidth: 1,
          opacity: 1, backdropBlur: 16, display: 'flex', flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', gap: 16, maxWidth: '1200px'
        },
        content: {
          title: 'Neo Labs Store',
          subtitle: 'Paiement sécurisé Stripe / Apple Pay • Expédition sous 24h',
          copyrightText: '© 2026 Neo Labs Store. Tous droits réservés.'
        }
      }
    ]
  },
  {
    id: 'app-mobile-showcase',
    name: 'App Mobile Showcase',
    category: 'mobile',
    description: 'Aperçu cadre smartphone interactif, fonctionnalités clés, badges App Store / Play Store et carrousel d’avis.',
    badge: 'Mobile App',
    accentColor: '#3b82f6',
    bgTheme: '#070a14',
    fontHeading: 'Outfit',
    fontBody: 'Plus Jakarta Sans',
    blocks: [
      {
        id: 'mob-nav',
        name: 'Header App Mobile',
        type: 'header',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 16, paddingBottom: 16, paddingLeft: 24, paddingRight: 24,
          marginTop: 0, marginBottom: 12,
          backgroundColor: 'rgba(10, 14, 26, 0.85)',
          borderRadius: 20, borderColor: 'rgba(59, 130, 246, 0.2)', borderWidth: 1,
          opacity: 1, backdropBlur: 16, display: 'flex', flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', gap: 24, maxWidth: '1200px'
        },
        content: {
          title: 'FLOW APP',
          links: [
            { label: 'Aperçu', href: '#preview' },
            { label: 'Fonctions', href: '#features' },
            { label: 'Avis', href: '#reviews' },
            { label: 'Télécharger', href: '#download' }
          ],
          primaryCtaText: 'Télécharger l&apos;App',
          secondaryCtaText: 'Captures d&apos;écran'
        }
      },
      {
        id: 'mob-hero',
        name: 'Héros Mobile App Showcase',
        type: 'hero',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 56, paddingBottom: 56, paddingLeft: 24, paddingRight: 24,
          marginTop: 0, marginBottom: 16,
          backgroundColor: 'rgba(15, 20, 36, 0.5)', borderRadius: 28, borderColor: 'rgba(59, 130, 246, 0.15)', borderWidth: 1,
          opacity: 1, backdropBlur: 16, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', gap: 20, maxWidth: '1200px'
        },
        content: {
          badgeText: '📱 Déjà +100k Téléchargements sur iOS & Android',
          title: 'Reprenez le contrôle de votre temps',
          titleHighlight: 'directement depuis votre poche',
          subtitle: 'L’application de productivité personnelle classée N°1 sur l’App Store cette année.',
          primaryCtaText: 'Obtenir sur l&apos;App Store',
          secondaryCtaText: 'Google Play Store'
        }
      },
      {
        id: 'mob-bento',
        name: 'Fonctionnalités Mobile Bento',
        type: 'featureGrid',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 40, paddingBottom: 40, paddingLeft: 24, paddingRight: 24,
          marginTop: 0, marginBottom: 16,
          backgroundColor: 'transparent', borderRadius: 24, borderColor: 'transparent', borderWidth: 0,
          opacity: 1, backdropBlur: 0, display: 'grid', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'stretch', gap: 20, maxWidth: '1200px'
        },
        content: {
          badgeText: 'EXPÉRIENCE MOBILE',
          title: 'Une Fluidité Absolue',
          subtitle: 'Conçue avec React Native & Moteur GPU pour zéro ralentissement.',
          gridColumns: 3,
          features: [
            { id: 'm-1', icon: 'Zap', title: 'Widgets Écran de Verrouillage', description: 'Accès en un geste à vos statistiques et rappels prioritaires.', tag: 'iOS 18' },
            { id: 'm-2', icon: 'ShieldCheck', title: 'Données Locales Chiffrées', description: 'Stockage sécurisé sur le Secure Enclave de votre appareil.', tag: 'PRIVACY' },
            { id: 'm-3', icon: 'Bot', title: 'Rappels Intelligents IA', description: 'Analyse prédictive de votre agenda pour optimiser vos pauses.', tag: 'SMART' }
          ]
        }
      },
      {
        id: 'mob-footer',
        name: 'Pied de Page Mobile App',
        type: 'footer',
        layout: { x: 0, y: 0, width: '100%', height: 'auto', isLocked: false, isHidden: false },
        style: {
          paddingTop: 24, paddingBottom: 24, paddingLeft: 24, paddingRight: 24,
          marginTop: 0, marginBottom: 0,
          backgroundColor: 'rgba(10, 14, 26, 0.9)', borderRadius: 16, borderColor: 'rgba(255, 255, 255, 0.08)', borderWidth: 1,
          opacity: 1, backdropBlur: 16, display: 'flex', flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center', gap: 16, maxWidth: '1200px'
        },
        content: {
          title: 'Flow Mobile App',
          subtitle: 'Compatible iOS 16+ & Android 12+. Mises à jour hebdomadaires.',
          copyrightText: '© 2026 Flow Inc. Tous droits réservés.'
        }
      }
    ]
  }
];
