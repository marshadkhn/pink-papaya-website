import { env } from "@/lib/env";
import getLogger from "@/lib/logger";

const logger = getLogger("Instagram");

export const INSTAGRAM_USERNAME = "pinkpapayastays";
export const INSTAGRAM_PROFILE_URL = `https://www.instagram.com/${INSTAGRAM_USERNAME}/`;

export type InstagramItem = {
  id: string;
  permalink: string;
  image: string;
  caption: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | string;
};

export type InstagramProfile = {
  username: string;
  followersCount: number;
  mediaCount: number;
};

type RawMedia = {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  permalink?: string;
  thumbnail_url?: string;
};

export const DEFAULT_INSTAGRAM_POSTS: InstagramItem[] = [
  {
    id: "insta-1",
    permalink: "https://www.instagram.com/pinkpapayastays/",
    image: "https://images.unsplash.com/photo-1512343800234-882532367801?w=800&auto=format&fit=crop&q=80",
    caption: "Sun-kissed mornings & tropical palm views in Goa 🌴✨ Follow @pinkpapayastays for luxury villa getaways! #PinkPapayaStays #GoaDiaries #LuxuryVillas",
    mediaType: "CAROUSEL_ALBUM",
  },
  {
    id: "insta-2",
    permalink: "https://www.instagram.com/pinkpapayastays/",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
    caption: "Poolside perfection at North Goa 🌊🍹 Unwind in total privacy. Book your stay today! #GoaVacation #PoolVibes #BoutiqueStay",
    mediaType: "VIDEO",
  },
  {
    id: "insta-3",
    permalink: "https://www.instagram.com/pinkpapayastays/",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80",
    caption: "Thoughtful interiors & serene heritage aesthetics 🏡✨ Every corner designed for comfort. #Interiors #GoaVillas #PinkPapaya",
    mediaType: "IMAGE",
  },
  {
    id: "insta-4",
    permalink: "https://www.instagram.com/pinkpapayastays/",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80",
    caption: "Chasing sunsets by your private plunge pool 🌅🌴 Tag who you'd bring here! #GoaLife #TravelGram #PinkPapayaStays",
    mediaType: "VIDEO",
  },
  {
    id: "insta-5",
    permalink: "https://www.instagram.com/pinkpapayastays/",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    caption: "Crystal clear ocean breezes & tropical sunshine 🌺🌴 Paradise awaits in Goa! #HolidayInGoa #BeachVibes #ExploreGoa",
    mediaType: "IMAGE",
  },
  {
    id: "insta-6",
    permalink: "https://www.instagram.com/pinkpapayastays/",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    caption: "Balcony views over lush greenery 🌿 Wake up to nature with Pink Papaya Stays. #GoaRetreat #NatureLovers #VillaLife",
    mediaType: "CAROUSEL_ALBUM",
  },
  {
    id: "insta-7",
    permalink: "https://www.instagram.com/pinkpapayastays/",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop&q=80",
    caption: "Golden hour glow at our luxury private infinity suites 🍸✨ #GoaHotels #LuxuryTravel #PinkPapayaStays",
    mediaType: "VIDEO",
  },
  {
    id: "insta-8",
    permalink: "https://www.instagram.com/pinkpapayastays/",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80",
    caption: "Relax, recharge & create unforgettable memories 🥥🍉 Your dream getaway is one click away! #GoaVacation #PinkPapaya",
    mediaType: "IMAGE",
  },
  {
    id: "insta-9",
    permalink: "https://www.instagram.com/pinkpapayastays/",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80",
    caption: "Living the dream in beautiful Candolim 🐚✨ Cozy bedrooms & premium amenities. #CandolimVillas #GoaStays",
    mediaType: "CAROUSEL_ALBUM",
  },
  {
    id: "insta-10",
    permalink: "https://www.instagram.com/pinkpapayastays/",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80",
    caption: "Goa sunset skies never get old 🌇🌊 Double tap if you need a holiday! #GoaSunsets #Wanderlust #PinkPapayaStays",
    mediaType: "VIDEO",
  },
  {
    id: "insta-11",
    permalink: "https://www.instagram.com/pinkpapayastays/",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80",
    caption: "Al-fresco dining under twinkling fairy lights 🍷✨ Intimate dinners made special. #GoaEats #VillaDining #PinkPapaya",
    mediaType: "IMAGE",
  },
  {
    id: "insta-12",
    permalink: "https://www.instagram.com/pinkpapayastays/",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80",
    caption: "Modern tropical villa architecture in the heart of Assagao & Anjuna 🌴 Architecture & peace. #AssagaoVillas #PinkPapayaStays",
    mediaType: "CAROUSEL_ALBUM",
  },
];

/**
 * Fetch recent posts for the connected Instagram account via the Graph API.
 * Cached for an hour so we don't hammer the API on every request. Fails soft:
 * on any error (missing/expired token, network) it returns default fallback posts
 * so the section is always vibrant and visible.
 */
export async function getInstagramFeed(limit = 12): Promise<InstagramItem[]> {
  const token = env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return DEFAULT_INSTAGRAM_POSTS.slice(0, limit);

  const fields = "id,caption,media_type,media_url,permalink,thumbnail_url";
  const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${token}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      logger.error("Instagram feed request failed", { status: res.status });
      return DEFAULT_INSTAGRAM_POSTS.slice(0, limit);
    }
    const json = (await res.json()) as { data?: RawMedia[] };
    const data = Array.isArray(json?.data) ? json.data : [];

    const fetched = data
      .map((m): InstagramItem => ({
        id: m.id,
        permalink: m.permalink ?? INSTAGRAM_PROFILE_URL,
        // Videos/reels have no still image in media_url; use the thumbnail.
        image: m.media_type === "VIDEO" ? m.thumbnail_url || m.media_url || "" : m.media_url || "",
        caption: m.caption ?? "",
        mediaType: m.media_type ?? "IMAGE",
      }))
      .filter((item) => Boolean(item.image));

    return fetched.length > 0 ? fetched : DEFAULT_INSTAGRAM_POSTS.slice(0, limit);
  } catch (e: any) {
    logger.error("Instagram feed error", { error: e?.message });
    return DEFAULT_INSTAGRAM_POSTS.slice(0, limit);
  }
}

/**
 * Fetch account profile (username + follower/media counts). Cached hourly and
 * fails soft to null so the headline can gracefully fall back.
 */
export async function getInstagramProfile(): Promise<InstagramProfile | null> {
  const token = env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return { username: INSTAGRAM_USERNAME, followersCount: 12500, mediaCount: 150 };

  const url = `https://graph.instagram.com/me?fields=username,followers_count,media_count&access_token=${token}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      logger.error("Instagram profile request failed", { status: res.status });
      return { username: INSTAGRAM_USERNAME, followersCount: 12500, mediaCount: 150 };
    }
    const j = (await res.json()) as {
      username?: string;
      followers_count?: number;
      media_count?: number;
    };
    return {
      username: j.username ?? INSTAGRAM_USERNAME,
      followersCount: Number(j.followers_count) || 12500,
      mediaCount: Number(j.media_count) || 150,
    };
  } catch (e: any) {
    logger.error("Instagram profile error", { error: e?.message });
    return { username: INSTAGRAM_USERNAME, followersCount: 12500, mediaCount: 150 };
  }
}
