import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { prompt, category = 'avatar', style = 'photorealistic', count = 4 } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Un prompt est requis pour la génération d’assets' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let smartKeywords = prompt;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const res = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `À partir de la demande utilisateur "${prompt}" pour un asset de type "${category}" en style "${style}", génère 3 mots-clés de recherche visuelle en anglais séparés par des virgules (ex: "minimalist tech dashboard, sleek glassmorphism, glowing dark purple"). Réponds UNIQUEMENT par les mots-clés.`,
                },
              ],
            },
          ],
        });
        const words = res.text?.trim();
        if (words) smartKeywords = words;
      } catch (e) {
        console.warn('AI keywords refinement fallback:', e);
      }
    }

    // Asset presets library based on category and style
    const cleanKw = encodeURIComponent(smartKeywords.replace(/[^\w\s]/gi, ''));
    const timestamp = Date.now();

    const assets: {
      id: string;
      title: string;
      url: string;
      type: 'avatar' | 'photo' | 'vector' | '3d';
      alt: string;
      tag: string;
    }[] = [];

    if (category === 'avatar') {
      const avatarSeeds = ['Felix', 'Aneka', 'Zack', 'Sophia', 'Leo', 'Mia', 'Alexander', 'Elena'];
      for (let i = 0; i < Math.min(count, 8); i++) {
        const seed = avatarSeeds[i % avatarSeeds.length] + (i > 3 ? `${i}` : '');
        let avatarUrl = '';
        if (style === '3d_memoji') {
          avatarUrl = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${seed}&backgroundColor=0d1220,1e1b4b,312e81`;
        } else if (style === 'minimal_vector') {
          avatarUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}&backgroundColor=0d1220,1e1b4b`;
        } else if (style === 'cyber_neon') {
          avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}&rowColor=6366f1,06b6d4,a855f7`;
        } else {
          // Photorealistic / High-Res curated portraits
          const portraitIds = [
            '1534528741775-53994a69daeb',
            '1507003211169-0a1dd7228f2d',
            '1494790108377-be9c29b29330',
            '1500648767791-00dcc994a43e',
            '1517841905240-472988babdf9',
            '1539571696357-5a69c17a67c6',
            '1524504388940-b1c1722653e1',
            '1506794778202-cad84cf45f1d',
          ];
          const pid = portraitIds[i % portraitIds.length];
          avatarUrl = `https://images.unsplash.com/photo-${pid}?w=250&auto=format&fit=crop&q=80`;
        }

        assets.push({
          id: `asset-avatar-${timestamp}-${i}`,
          title: `Avatar ${style} #${i + 1}`,
          url: avatarUrl,
          type: 'avatar',
          alt: `Avatar pour ${prompt}`,
          tag: style,
        });
      }
    } else {
      // Photo / Hero visuals / 3D Backgrounds / Feature Graphics
      const photoIds = [
        '1618005182384-a83a8bd57fbe', // Abstract 3D fluid dark
        '1634017839464-5c339ebe3cb4', // Cyber neon geometric
        '1618005182384-a83a8bd57fbe', // 3D Render dark waves
        '1550745165-9bc0b252726f', // Cyberpunk tech setup
        '1526374965328-7f61d4dc18c5', // Matrix code stream
        '1558494949-ef010cbdcc31', // Cloud datacenter servers
        '1607604276583-eef5d076aa5f', // VR / AR future glasses
        '1639762681485-074b7f938ba0', // Blockchain / AI network
      ];

      for (let i = 0; i < Math.min(count, 8); i++) {
        const pid = photoIds[i % photoIds.length];
        const photoUrl = `https://images.unsplash.com/photo-${pid}?w=1200&auto=format&fit=crop&q=85&sig=${i + 1}`;

        assets.push({
          id: `asset-photo-${timestamp}-${i}`,
          title: `Visuel ${category} #${i + 1}`,
          url: photoUrl,
          type: category === '3d' ? '3d' : 'photo',
          alt: `${prompt} visuel ${category}`,
          tag: category,
        });
      }
    }

    return NextResponse.json({
      success: true,
      keywords: smartKeywords,
      category,
      style,
      assets,
    });
  } catch (error: any) {
    console.error('Erreur generate-asset API:', error);
    return NextResponse.json(
      { error: error?.message || 'Erreur lors de la génération des visuels' },
      { status: 500 }
    );
  }
}
