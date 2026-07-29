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
    id: "17880471510606385",
    permalink: "https://www.instagram.com/p/DbAc-VpgiYc/",
    image: "/uploads/uploads/1785074093667-c4d0265b-094e-4948-8758-1371bf36b81f-dsc09891-hdr.webp",
    caption: "Not every Goa trip needs an itinerary. Some just need a beautiful home, a private pool, glass windows, good light, and quiet to forget what time it is 🍂 Bungalow No. 9 – 2bhk private pool villa in Parra.",
    mediaType: "CAROUSEL_ALBUM",
  },
  {
    id: "18089789264622284",
    permalink: "https://www.instagram.com/p/DakOt9KgnXv/",
    image: "/uploads/uploads/1785073737578-95c511e2-cbc0-4305-abca-34e3e7e06629-photo_01.webp",
    caption: "Some corners of a home don't ask you to do much. Just sit a little longer. Sempre — our heritage home in Aldona, wrapped in old-world painted murals, lazy lunches, and nothing in particular 🌿",
    mediaType: "CAROUSEL_ALBUM",
  },
  {
    id: "18010402115899569",
    permalink: "https://www.instagram.com/reel/DaSfAGQiyM0/",
    image: "/uploads/uploads/1785073698356-248ca833-9095-41f8-82e6-d6d38feeb4d2-photo_01.webp",
    caption: "Call it a day out. Call it a detour. Call it our version of Lovely Day by Bill Weathers. A day out with Pink Papaya 🌸",
    mediaType: "VIDEO",
  },
  {
    id: "17962979487117007",
    permalink: "https://www.instagram.com/p/DaNFZ13DexQ/",
    image: "/uploads/uploads/1785073975787-22bd8c79-9e59-444c-9066-713c8b3fa519-photo_01.webp",
    caption: "A two-hour drive from Goa, and somehow it felt like we had slipped into a postcard. Still blue water, quiet crabs, yummy food stops. A day with friends, full hearts 🌊 #beach #goadiaries",
    mediaType: "CAROUSEL_ALBUM",
  },
  {
    id: "18082130372381348",
    permalink: "https://www.instagram.com/p/DaCxmj1grH9/",
    image: "/uploads/uploads/1785073985648-dd265128-ed92-4861-af60-088d215412b3-photo_01.webp",
    caption: "A Curious Little Affair was our first Pink Papaya party at Sempre and honestly... what a night! Still recovering, still can't believe how beautifully it all came together 🎉✨",
    mediaType: "CAROUSEL_ALBUM",
  },
  {
    id: "18335684284172887",
    permalink: "https://www.instagram.com/p/DZ4iZj4DbB8/",
    image: "/uploads/uploads/1785074055568-ee506fe2-834b-48aa-931c-3c9373ce7184-photo_01.webp",
    caption: "Some homes feel like a quiet little pause between beach days and golden evenings. Jigsaw — our 2BHK in Lagos, tucked away in one of Candolim's softer corners 🌿 Close to Reis Magos Fort, local food, and easy Goa vibes.",
    mediaType: "CAROUSEL_ALBUM",
  },
  {
    id: "17956474910939663",
    permalink: "https://www.instagram.com/reel/DZsKia0tqYE/",
    image: "/uploads/uploads/1785073714899-0805fdb7-63c8-4d56-afcb-4b0dee90d421-photo_01.webp",
    caption: "After one too many questionable Goa stays, we decided to build the kind we'd actually want to book. Clean homes. Private spaces. Pretty corners. No drama. Basically, stays that don't suck 🍭 @pinkpapayastays",
    mediaType: "VIDEO",
  },
  {
    id: "18082130372381349",
    permalink: "https://www.instagram.com/p/DZmcBtCjauG/",
    image: "/uploads/uploads/1785073716047-a566b488-3479-48a7-9014-940ce060429e-photo_02.webp",
    caption: "Casa Remi, but refreshed. Our Candolim 1bhk has had a little glow-up — soft corners, warmer details, and the same wash comfort we've always loved. She's back on the grid 🌴",
    mediaType: "CAROUSEL_ALBUM",
  },
  {
    id: "18082130372381350",
    permalink: "https://www.instagram.com/reel/DYmQmHeinKv/",
    image: "/uploads/uploads/1785073699231-a530086a-392f-492e-961e-a9bab7261bd4-photo_03.webp",
    caption: "A curious little affair by Pink Papaya Stays. There were fairy lights in the trees, music drifting through the garden and people we love scattered all across 🤍",
    mediaType: "VIDEO",
  },
  {
    id: "18082130372381351",
    permalink: "https://www.instagram.com/reel/DX6uWGhC1UQ/",
    image: "/uploads/uploads/1785074094529-9b1f9854-cd90-4d65-be30-f97e60479580-photo_01.webp",
    caption: "A one-bedroom made for slow mornings, long showers, and staying in longer than planned. 📍Saipem, Candolim, North Goa 🧘🏽‍♀️",
    mediaType: "VIDEO",
  },
  {
    id: "18082130372381352",
    permalink: "https://www.instagram.com/p/DXtwQouAjUf/",
    image: "/uploads/uploads/1785073738513-94fe52a3-3190-4022-b46b-406e118de116-photo_03.webp",
    caption: "Some Goa is beaches and big plans. Some Goa is a neighbourhood bar at golden hour, a cold drink in hand, and good plates on the table 🍸 Save for your next slow evening in Goa! 🌴",
    mediaType: "CAROUSEL_ALBUM",
  },
  {
    id: "18082130372381353",
    permalink: "https://www.instagram.com/reel/DWygcRlguyO/",
    image: "/uploads/uploads/1785073738037-d35f92dc-aea8-4d9b-aca1-c0de30a63ae3-photo_02.webp",
    caption: "A little koi story in red and quiet corners, drifting through Siolim Diaries 🐠 📍Siolim, North Goa",
    mediaType: "VIDEO",
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
