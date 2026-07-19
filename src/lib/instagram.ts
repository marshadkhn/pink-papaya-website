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

/**
 * Fetch recent posts for the connected Instagram account via the Graph API.
 * Cached for an hour so we don't hammer the API on every request. Fails soft:
 * on any error (missing/expired token, network) it returns an empty array so
 * the section simply hides rather than breaking the page.
 */
export async function getInstagramFeed(limit = 8): Promise<InstagramItem[]> {
  const token = env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];

  const fields = "id,caption,media_type,media_url,permalink,thumbnail_url";
  const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${token}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      logger.error("Instagram feed request failed", { status: res.status });
      return [];
    }
    const json = (await res.json()) as { data?: RawMedia[] };
    const data = Array.isArray(json?.data) ? json.data : [];

    return data
      .map((m): InstagramItem => ({
        id: m.id,
        permalink: m.permalink ?? INSTAGRAM_PROFILE_URL,
        // Videos/reels have no still image in media_url; use the thumbnail.
        image: m.media_type === "VIDEO" ? m.thumbnail_url || m.media_url || "" : m.media_url || "",
        caption: m.caption ?? "",
        mediaType: m.media_type ?? "IMAGE",
      }))
      .filter((item) => Boolean(item.image));
  } catch (e: any) {
    logger.error("Instagram feed error", { error: e?.message });
    return [];
  }
}

/**
 * Fetch account profile (username + follower/media counts). Cached hourly and
 * fails soft to null so the headline can gracefully fall back.
 */
export async function getInstagramProfile(): Promise<InstagramProfile | null> {
  const token = env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return null;

  const url = `https://graph.instagram.com/me?fields=username,followers_count,media_count&access_token=${token}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      logger.error("Instagram profile request failed", { status: res.status });
      return null;
    }
    const j = (await res.json()) as {
      username?: string;
      followers_count?: number;
      media_count?: number;
    };
    return {
      username: j.username ?? INSTAGRAM_USERNAME,
      followersCount: Number(j.followers_count) || 0,
      mediaCount: Number(j.media_count) || 0,
    };
  } catch (e: any) {
    logger.error("Instagram profile error", { error: e?.message });
    return null;
  }
}
