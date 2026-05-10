import { DEFAULT_PLACEHOLDER } from "@/utils/image";

export type BlogPost = {
  id: string;
  title: string;
  imageUrl: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
};

export const posts: BlogPost[] = [
  {
    id: "coastal-living-guide",
    title: "A Guide to Coastal Living",
    imageUrl: DEFAULT_PLACEHOLDER,
    author: "Sarah Jenkins",
    date: "September 20, 2025",
    category: "Coastal Living",
    excerpt: "Discover the serene beauty and lifestyle of coastal living — and why it changes the way you see rest.",
    content: `There is a rhythm to the ocean that seeps into the walls of a home built near its edge. It's not just the sound of the waves crashing against the shore, but the salt in the air, the way the light changes throughout the day, and the profound sense of stillness that settles in when the sun dips below the horizon. Coastal living isn't merely about location; it is a philosophy of simplicity, a return to the elemental, and a celebration of nature's raw beauty.

In our hectic modern lives, we often find ourselves craving a disconnect. We scroll through feeds of pristine beaches and quiet cabins, yearning for a moment of silence. But true tranquility doesn't require a plane ticket to a remote island. It can be cultivated right where we are, by embracing the principles of coastal design: light, texture, and an unhurried pace.

## Embracing the Light

The cornerstone of any coastal aesthetic is light. It washes over surfaces, softening edges and creating an atmosphere of airy openness. When designing our Pink Papaya stays, we prioritize large windows that frame the landscape like living art. We use sheer curtains that dance in the breeze, allowing sunlight to filter through without harsh glare. The palette is intentionally restrained — shades of sand, stone, and sea foam — to reflect light rather than absorb it.

> "To live by the sea is to accept that nature is the ultimate architect, and we are merely its guests."
> — Elena Rossi, Interior Architect

But light must be balanced with shadow. As evening approaches, the coastal home transforms. Warm, dimmable lighting mimics the glow of a setting sun or a flickering campfire. We choose fixtures made of natural materials — woven rattan, frosted glass, or burnished brass — that add warmth and character even when unlit.

## Texture Over Color

When color is minimized, texture takes center stage. A monochromatic room can feel flat and lifeless without the interplay of different surfaces. In a coastal home, we layer textures to create depth and interest. Think of the roughness of a jute rug against smooth polished concrete floors, or the softness of a linen throw draped over a weathered leather chair.

Driftwood, dried grasses, and stone are essential elements. They bring the outdoors in, grounding the space and reminding us of the rugged coastline just outside. These natural imperfections — the knot in the wood, the variation in the stone — tell a story of resilience and time, adding a layer of soul to the interior that mass-produced items simply cannot replicate.

![Natural textures bring warmth to minimalist spaces.|${DEFAULT_PLACEHOLDER}]

Ultimately, coastal living is about creating a sanctuary. It is a space where you can exhale, where the noise of the world fades into the background, replaced by the gentle murmur of the tide. It is a reminder that beauty often lies in simplicity, and that the most luxurious thing we can possess is peace of mind.`,
  },
];
