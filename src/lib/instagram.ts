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
  { id: "insta-1", permalink: INSTAGRAM_PROFILE_URL, image: "/media/uploads/1785073698356-248ca833-9095-41f8-82e6-d6d38feeb4d2-photo_01.webp", caption: "Sun-kissed mornings at Pink Papaya Stays 🌸🌿 #GoaVillas #PinkPapayaStays", mediaType: "IMAGE" },
  { id: "insta-2", permalink: INSTAGRAM_PROFILE_URL, image: "/media/uploads/1785073708225-ee3049a1-7e3f-46b2-85a8-89b1b93209ea-photo_18.webp", caption: "Escape to luxury with private pool views in North Goa ✨ #LuxuryStays", mediaType: "IMAGE" },
  { id: "insta-3", permalink: INSTAGRAM_PROFILE_URL, image: "/media/uploads/1785073721227-6f4bcf36-c18f-487e-86e9-ad8f58a7e929-photo_06.webp", caption: "Serene heritage vibes & cozy interiors 🏡 #GoaVacation #BoutiqueStays", mediaType: "IMAGE" },
  { id: "insta-4", permalink: INSTAGRAM_PROFILE_URL, image: "/media/uploads/1785073736877-1ea9f632-2eb9-41ce-8221-966dcaf88c8b-photo_20.webp", caption: "Unwind by the pool under palm trees 🌴🌊 #PoolsideVibes #GoaDiaries", mediaType: "IMAGE" },
  { id: "insta-5", permalink: INSTAGRAM_PROFILE_URL, image: "/media/uploads/1785073750697-5cfe230d-66f8-4290-b4d9-9c7c6159da00-dsc06776-hdr.webp", caption: "Tropical paradise awaits at Pink Papaya 🌺 #HolidayInGoa", mediaType: "IMAGE" },
  { id: "insta-6", permalink: INSTAGRAM_PROFILE_URL, image: "/media/uploads/1785073763815-cda2d5c0-305f-4b39-a06e-0c9303445c76-dsc06887-hdr.webp", caption: "Golden hour glow at our luxury private suites 🌅 #GoaHotels", mediaType: "IMAGE" },
  { id: "insta-7", permalink: INSTAGRAM_PROFILE_URL, image: "/media/uploads/1785073776418-f35f5afd-55cb-45a0-8b4f-0b43da52a7ba-dsc07013-hdr.webp", caption: "Charming architecture meets modern comfort 🍹 #GoaRetreat", mediaType: "IMAGE" },
  { id: "insta-8", permalink: INSTAGRAM_PROFILE_URL, image: "/media/uploads/1785073792633-de717817-73da-412b-88a6-2348a063b875-dsc02434-hdr.webp", caption: "Relax, recharge & make unforgettable memories 🍉 #PinkPapaya", mediaType: "IMAGE" },
  { id: "insta-9", permalink: INSTAGRAM_PROFILE_URL, image: "/media/uploads/1785073809956-0861a216-2a92-4123-9f6a-6b9e38a067f9-dsc02605-hdr.webp", caption: "Living the dream in beautiful Candolim 🐚✨ #CandolimVillas", mediaType: "IMAGE" },
  { id: "insta-10", permalink: INSTAGRAM_PROFILE_URL, image: "/media/uploads/1785073825901-6b2365c3-d417-4b3a-9893-0c62436ad6c7-dsc03665-hdr.webp", caption: "Your private getaway in paradise 🍸🌴 #GoaLife #TravelGram", mediaType: "IMAGE" },
  { id: "insta-11", permalink: INSTAGRAM_PROFILE_URL, image: "/media/uploads/1785073839597-64735a56-ff7c-41f6-9290-59ac4922a78a-dsc03803-hdr.webp", caption: "Peaceful courtyards & lush green views 🍃 #ExploreGoa", mediaType: "IMAGE" },
  { id: "insta-12", permalink: INSTAGRAM_PROFILE_URL, image: "/media/uploads/1785073856345-d8362b62-8f9d-4799-a090-32a26f726c57-dsc05611-hdr.webp", caption: "Book your luxury stay with Pink Papaya Stays today 💗 #GoaTravel", mediaType: "IMAGE" },
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
