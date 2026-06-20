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
    imageUrl: "/images/coastal-calm.png",
    description: "Soft tones, natural textures, and sunlight-forward layouts for slow mornings.",
    badge: "JUMEIRAH PARKS",
    headline: "THE SOFT EDIT",
    tagline: "Neutral, airy, and organic design",
    longDescription: [
      "Nestled in the vibrant community of Dubai Parks, this project perfectly balances functionality and aesthetic appeal. The neutral palette, punctuated by soft greens, sets the tone for a serene and inviting atmosphere, while the custom TV unit anchors the living area as a focal point.",
      "By seamlessly blending cozy family living with entertaining elegance, we turned this space into a refined sanctuary. Every detail reflects their desire for a layout that's not only visually interesting but also effortlessly functional.",
    ],
    photos: [
      "/images/coastal-calm.png",
      "/images/garden-nook.png",
      "/images/sunset-suite.png",
      "/images/palm-terrace.png",
    ],
    beforeAfter: [
      "/images/garden-nook.png",
      "/images/coastal-calm.png",
    ],
  },
  {
    id: "garden-nook",
    title: "Garden Nook",
    imageUrl: "/images/garden-nook.png",
    description: "Green-framed corners with crafted wood and linen—made for quiet pauses.",
    badge: "GREEN HAVEN",
    headline: "THE NATURE EDIT",
    tagline: "Botanical, warm, and crafted",
    longDescription: [
      "A soothing mix of greens, linens, and natural wood brings the outdoors in, shaping a restful nook for slow afternoons and easy conversations.",
      "Tailored joinery and soft textures make the space functional yet refined, balancing everyday comfort with a touch of crafted elegance.",
    ],
    photos: [
      "/images/garden-nook.png",
      "/images/coastal-calm.png",
      "/images/sunset-suite.png",
      "/images/palm-terrace.png",
    ],
    beforeAfter: [
      "/images/coastal-calm.png",
      "/images/garden-nook.png",
    ],
  },
  {
    id: "sunset-suite",
    title: "Sunset Suite",
    imageUrl: "/images/sunset-suite.png",
    description: "Warm light, earthy palettes, and a hint of sea breeze at golden hour.",
    badge: "SEAVIEW RESIDENCE",
    headline: "THE GOLDEN HOUR",
    tagline: "Warm, earthy, and luminous",
    longDescription: [
      "Bathed in late-afternoon light, the space leans into warm tones and tactile materials that glow as the day fades.",
      "Curated accents and thoughtful lighting celebrate the room's natural rhythm, inviting unhurried, golden moments.",
    ],
    photos: [
      "/images/sunset-suite.png",
      "/images/palm-terrace.png",
      "/images/coastal-calm.png",
      "/images/garden-nook.png",
    ],
    beforeAfter: [
      "/images/palm-terrace.png",
      "/images/sunset-suite.png",
    ],
  },
  {
    id: "palm-terrace",
    title: "Palm Terrace",
    imageUrl: "/images/palm-terrace.png",
    description: "Open terraces and airy flow—spaces that breathe, shaped by the coast.",
    badge: "PALM RESIDENCE",
    headline: "BREEZE & LIGHT",
    tagline: "Open, airy, and coastal",
    longDescription: [
      "Generous openings, pale surfaces, and clean lines invite natural light and cross-breezes to define the mood.",
      "Calm, uncluttered furnishing keeps the focus on flow and comfort—easy living that feels fresh all day.",
    ],
    photos: [
      "/images/palm-terrace.png",
      "/images/sunset-suite.png",
      "/images/coastal-calm.png",
      "/images/garden-nook.png",
    ],
    beforeAfter: [
      "/images/sunset-suite.png",
      "/images/palm-terrace.png",
    ],
  },
];
