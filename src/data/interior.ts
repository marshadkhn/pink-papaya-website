export type InteriorProject = {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  href?: string; // optional route if we create project detail pages later
};

export const interiorProjects: InteriorProject[] = [
  {
    id: "coastal-calm",
    title: "Coastal Calm",
    imageUrl: "/images/hotel.svg",
    description:
      "Soft tones, natural textures, and sunlight-forward layouts for slow mornings.",
  },
  {
    id: "garden-nook",
    title: "Garden Nook",
    imageUrl: "/logo-files/logo-black.svg",
    description:
      "Green-framed corners with crafted wood and linen—made for quiet pauses.",
  },
  {
    id: "sunset-suite",
    title: "Sunset Suite",
    imageUrl: "/logo-files/logo-white.svg",
    description:
      "Warm light, earthy palettes, and a hint of sea breeze at golden hour.",
  },
  {
    id: "palm-terrace",
    title: "Palm Terrace",
    imageUrl: "/logo-files/logo-black.svg",
    description:
      "Open terraces and airy flow—spaces that breathe, shaped by the coast.",
  },
];
