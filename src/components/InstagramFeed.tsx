"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import { PiInstagramLogo, PiPlayCircle, PiImagesLight } from "react-icons/pi";
import type { InstagramItem, InstagramProfile } from "@/lib/instagram";

const PROFILE_URL = "https://www.instagram.com/pinkpapayastays/";
const HANDLE = "@pinkpapayastays";

function MediaBadge({ type }: { type: string }) {
  if (type === "VIDEO") {
    return <PiPlayCircle className="text-white drop-shadow" size={22} aria-label="Video" />;
  }
  if (type === "CAROUSEL_ALBUM") {
    return <PiImagesLight className="text-white drop-shadow" size={22} aria-label="Album" />;
  }
  return null;
}

export default function InstagramFeed() {
  const [items, setItems] = useState<InstagramItem[] | null>(null);
  const [profile, setProfile] = useState<InstagramProfile | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/instagram", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { items: [], profile: null }))
      .then((data) => {
        if (!active) return;
        setItems(Array.isArray(data?.items) ? data.items : []);
        setProfile(data?.profile ?? null);
      })
      .catch(() => active && setItems([]));
    return () => {
      active = false;
    };
  }, []);

  // Hide the whole section if the feed is empty (e.g. token expired) so the
  // page never shows an awkward blank block.
  if (items !== null && items.length === 0) return null;

  const isLoading = items === null;

  return (
    <section className="relative z-20 w-full bg-white py-10 md:py-14 font-bricolage">
      <Container>
        <div className="mb-8 flex flex-col items-center text-center md:mb-10">
          <p className="mb-4 font-bricolage text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C07A5A]">
            Follow along
          </p>
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <h2 className="font-playfair text-[30px] font-semibold leading-[1.08] text-neutral-900 transition-colors group-hover:text-[#9A2020] sm:text-[38px] md:text-[46px]">
              {HANDLE}
            </h2>
          </a>
          {profile && profile.followersCount > 0 && (
            <p className="mt-3 font-bricolage text-sm text-neutral-500">
              <span className="font-semibold text-neutral-800">
                {profile.followersCount.toLocaleString("en-IN")}
              </span>{" "}
              followers
            </p>
          )}
        </div>

        {/* 6-column grid: two rows of six (12 posts) on large screens, at the
            same tile size; reflows to fewer columns on smaller screens. */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-4 xl:grid-cols-6">
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-2xl bg-neutral-200"
                />
              ))
            : items!.slice(0, 12).map((item) => (
                <a
                  key={item.id}
                  href={item.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View post on Instagram"
                  className="group relative block aspect-square overflow-hidden rounded-2xl bg-neutral-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.caption ? item.caption.slice(0, 80) : "Instagram post"}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <span className="absolute right-2.5 top-2.5 z-10">
                    <MediaBadge type={item.mediaType} />
                  </span>

                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/35">
                    <PiInstagramLogo
                      className="text-white opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
                      size={30}
                    />
                  </div>
                </a>
              ))}
        </div>

        <div className="mt-8 flex justify-center md:mt-10">
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-900 px-6 py-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
          >
            <PiInstagramLogo size={18} />
            Follow us on Instagram
          </a>
        </div>
      </Container>
    </section>
  );
}
