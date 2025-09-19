export type InteriorProject = {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  href?: string; // optional route if we create project detail pages later
  // Detail page fields
  badge?: string;
  headline?: string; // detail page title
  tagline?: string;
  longDescription?: string[]; // multiple paragraphs
  photos?: string[]; // gallery images
  beforeAfter?: string[]; // [before, after]
};

export const interiorProjects: InteriorProject[] = [
  {
    id: "coastal-calm",
    title: "Coastal Calm",
    imageUrl: "/images/hotel.svg",
    description:
      "Soft tones, natural textures, and sunlight-forward layouts for slow mornings.",
    badge: "JUMEIRAH PARKS",
    headline: "THE SOFT EDIT",
    tagline: "Neutral, airy, and organic design",
    longDescription: [
      "Nestled in the vibrant community of Dubai Parks, this project perfectly balances functionality and aesthetic appeal. The neutral palette, punctuated by soft greens, sets the tone for a serene and inviting atmosphere, while the custom TV unit anchors the living area as a focal point. Our favorite feature, the layered light fixture in the dining area, adds depth and character, creating a subtle yet striking design statement.",
      "By seamlessly blending cozy family living with entertaining elegance, we turned this space into a refined sanctuary, free from the traditional majlis feel the clients wished to avoid. Every detail reflects their desire for a layout that’s not only visually interesting but also effortlessly functional.",
    ],
    photos: [
      "/images/hotel.svg",
      "/images/hotel.svg",
      "/images/hotel.svg",
      "/images/hotel.svg",
      "/images/hotel.svg",
      "/images/hotel.svg",
    ],
    beforeAfter: [
      "/images/hotel.svg",
      "/images/hotel.svg",
    ],
  },
  {
    id: "garden-nook",
    title: "Garden Nook",
    imageUrl: "/logo-files/logo-black.svg",
    description:
      "Green-framed corners with crafted wood and linen—made for quiet pauses.",
    badge: "GREEN HAVEN",
    headline: "THE NATURE EDIT",
    tagline: "Botanical, warm, and crafted",
    longDescription: [
      "A soothing mix of greens, linens, and natural wood brings the outdoors in, shaping a restful nook for slow afternoons and easy conversations.",
      "Tailored joinery and soft textures make the space functional yet refined, balancing everyday comfort with a touch of crafted elegance.",
    ],
    photos: [
      "/logo-files/logo-black.svg",
      "/logo-files/logo-white.svg",
      "/images/hotel.svg",
      "/logo-files/logo-black.svg",
      "/logo-files/logo-white.svg",
      "/images/hotel.svg",
    ],
    beforeAfter: [
      "/logo-files/logo-black.svg",
      "/logo-files/logo-white.svg",
    ],
  },
  {
    id: "sunset-suite",
    title: "Sunset Suite",
    imageUrl: "/logo-files/logo-white.svg",
    description:
      "Warm light, earthy palettes, and a hint of sea breeze at golden hour.",
    badge: "SEAVIEW RESIDENCE",
    headline: "THE GOLDEN HOUR",
    tagline: "Warm, earthy, and luminous",
    longDescription: [
      "Bathed in late-afternoon light, the space leans into warm tones and tactile materials that glow as the day fades.",
      "Curated accents and thoughtful lighting celebrate the room’s natural rhythm, inviting unhurried, golden moments.",
    ],
    photos: [
      "/logo-files/logo-white.svg",
      "/images/hotel.svg",
      "/logo-files/logo-black.svg",
      "/logo-files/logo-white.svg",
      "/images/hotel.svg",
      "/logo-files/logo-black.svg",
    ],
    beforeAfter: [
      "/logo-files/logo-white.svg",
      "/images/hotel.svg",
    ],
  },
  {
    id: "palm-terrace",
    title: "Palm Terrace",
    imageUrl: "/logo-files/logo-black.svg",
    description:
      "Open terraces and airy flow—spaces that breathe, shaped by the coast.",
    badge: "PALM RESIDENCE",
    headline: "BREEZE & LIGHT",
    tagline: "Open, airy, and coastal",
    longDescription: [
      "Generous openings, pale surfaces, and clean lines invite natural light and cross-breezes to define the mood.",
      "Calm, uncluttered furnishing keeps the focus on flow and comfort—easy living that feels fresh all day.",
    ],
    photos: [
      "/logo-files/logo-black.svg",
      "/images/hotel.svg",
      "/logo-files/logo-white.svg",
      "/logo-files/logo-black.svg",
      "/images/hotel.svg",
      "/logo-files/logo-white.svg",
    ],
    beforeAfter: [
      "/logo-files/logo-black.svg",
      "/images/hotel.svg",
    ],
  },
];
