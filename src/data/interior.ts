export type InteriorProject = {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  href?: string;
  badge?: string;
  headline?: string;
  tagline?: string;
  longDescription?: string[];
  photos?: string[];
  beforeAfter?: string[];
};

export const interiorProjects: InteriorProject[] = [
  {
    id: "coastal-calm",
    title: "Coastal Calm",
    imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
    description: "Soft tones, natural textures, and sunlight-forward layouts for slow mornings.",
    badge: "JUMEIRAH PARKS",
    headline: "THE SOFT EDIT",
    tagline: "Neutral, airy, and organic design",
    longDescription: [
      "Nestled in the vibrant community of Dubai Parks, this project perfectly balances functionality and aesthetic appeal. The neutral palette, punctuated by soft greens, sets the tone for a serene and inviting atmosphere, while the custom TV unit anchors the living area as a focal point.",
      "By seamlessly blending cozy family living with entertaining elegance, we turned this space into a refined sanctuary. Every detail reflects their desire for a layout that's not only visually interesting but also effortlessly functional.",
    ],
    photos: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
    ],
    beforeAfter: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
    ],
  },
  {
    id: "garden-nook",
    title: "Garden Nook",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    description: "Green-framed corners with crafted wood and linen—made for quiet pauses.",
    badge: "GREEN HAVEN",
    headline: "THE NATURE EDIT",
    tagline: "Botanical, warm, and crafted",
    longDescription: [
      "A soothing mix of greens, linens, and natural wood brings the outdoors in, shaping a restful nook for slow afternoons and easy conversations.",
      "Tailored joinery and soft textures make the space functional yet refined, balancing everyday comfort with a touch of crafted elegance.",
    ],
    photos: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&q=80",
      "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=800&q=80",
    ],
    beforeAfter: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    ],
  },
  {
    id: "sunset-suite",
    title: "Sunset Suite",
    imageUrl: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80",
    description: "Warm light, earthy palettes, and a hint of sea breeze at golden hour.",
    badge: "SEAVIEW RESIDENCE",
    headline: "THE GOLDEN HOUR",
    tagline: "Warm, earthy, and luminous",
    longDescription: [
      "Bathed in late-afternoon light, the space leans into warm tones and tactile materials that glow as the day fades.",
      "Curated accents and thoughtful lighting celebrate the room's natural rhythm, inviting unhurried, golden moments.",
    ],
    photos: [
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1200&q=80",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80",
    ],
    beforeAfter: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80",
    ],
  },
  {
    id: "palm-terrace",
    title: "Palm Terrace",
    imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    description: "Open terraces and airy flow—spaces that breathe, shaped by the coast.",
    badge: "PALM RESIDENCE",
    headline: "BREEZE & LIGHT",
    tagline: "Open, airy, and coastal",
    longDescription: [
      "Generous openings, pale surfaces, and clean lines invite natural light and cross-breezes to define the mood.",
      "Calm, uncluttered furnishing keeps the focus on flow and comfort—easy living that feels fresh all day.",
    ],
    photos: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
      "https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800&q=80",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80",
    ],
    beforeAfter: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    ],
  },
];
