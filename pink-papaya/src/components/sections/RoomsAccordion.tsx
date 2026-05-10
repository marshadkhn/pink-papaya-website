"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Bed } from "@/components/icons/Bed";
import { Guests } from "@/components/icons/Guests";
import { SqFt } from "@/components/icons/SqFt";
import { buttonClassName } from "@/components/ui/Button";

type Room = {
  name: string;
  sqft: string;
  beds: string;
  guests: string;
  imageSrc: string;
  caption: string;
};

const rooms: Room[] = [
  {
    name: "Coastal Garden Suite",
    sqft: "480 sq.ft",
    beds: "1 Queen",
    guests: "2 Guests",
    imageSrc: "/img/room-1.png",
    caption: "Lorem ipsum dolor sit amet.",
  },
  {
    name: "Ocean View King Suite",
    sqft: "550 sq.ft",
    beds: "1 King",
    guests: "2 Guests",
    imageSrc: "/img/room-2.png",
    caption: "Lorem ipsum dolor sit amet.",
  },
  {
    name: "Sunset Loft",
    sqft: "650 sq.ft",
    beds: "1 Queen",
    guests: "2 Guests",
    imageSrc: "/img/room-3.png",
    caption: "Lorem ipsum dolor sit amet.",
  },
  {
    name: "Beachfront Family Suite",
    sqft: "750 sq.ft",
    beds: "2 King",
    guests: "4-5 Guests",
    imageSrc: "/img/room-4.png",
    caption: "Lorem ipsum dolor sit amet.",
  },
  {
    name: "Penthouse Suite",
    sqft: "1,200 sq.ft",
    beds: "2 King",
    guests: "4-5 Guests",
    imageSrc: "/img/room-5.png",
    caption: "Lorem ipsum dolor sit amet.",
  },
];

export function RoomsAccordion() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = React.useState(0);
  const room = rooms[active];

  return (
    <section className="py-24">
      <Container>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="grid grid-cols-12 gap-12"
        >
          <div className="col-span-12 lg:col-span-5">
            <div className="flex items-start justify-between gap-6">
              <div>
                <Eyebrow>Rooms & Suites</Eyebrow>
                <h2 className="mt-4 font-serif font-medium text-h2m md:text-h2">Stay your Way</h2>
              </div>
              <Link href="/stays" className={clsx(buttonClassName("outline"), "border-ink text-ink") + " focus-ring"}>
                Explore All Rooms
              </Link>
            </div>

            <p className="mt-6 text-bodyLg text-inkSoft">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet.
            </p>

            <div className="mt-10 md:hidden">
              <label className="sr-only" htmlFor="rooms-select">
                Rooms
              </label>
              <select
                id="rooms-select"
                className="w-full rounded-card border border-line bg-card px-4 py-3 text-body text-ink focus-ring"
                value={String(active)}
                onChange={(e) => setActive(Number(e.target.value))}
              >
                {rooms.map((r, idx) => (
                  <option key={r.name} value={idx}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-10 hidden md:block">
              <ul className="space-y-6">
                {rooms.map((r, idx) => {
                  const isActive = idx === active;
                  const regionId = `room-details-${idx}`;

                  return (
                    <li key={r.name}>
                      <button
                        type="button"
                        className={clsx(
                          "w-full text-left font-serif font-medium text-cardTitle transition motion-reduce:transition-none focus-ring",
                          isActive ? "text-ink" : "text-muted"
                        )}
                        aria-expanded={isActive}
                        aria-controls={regionId}
                        onClick={() => setActive(idx)}
                      >
                        {r.name}
                      </button>

                      {isActive ? (
                        <div id={regionId} role="region" className="mt-4 border-b border-line pb-6">
                          <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-6 text-ink">
                              <div className="flex items-center gap-2 text-small">
                                <SqFt aria-hidden="true" />
                                <span>{r.sqft}</span>
                              </div>
                              <div className="flex items-center gap-2 text-small">
                                <Bed aria-hidden="true" />
                                <span>{r.beds}</span>
                              </div>
                              <div className="flex items-center gap-2 text-small">
                                <Guests aria-hidden="true" />
                                <span>{r.guests}</span>
                              </div>
                              <div className="text-small text-inkSoft">Starting at $299 / night</div>
                            </div>

                            <Link
                              href="#"
                              className={clsx(
                                "inline-flex items-center justify-center rounded-full border border-ink px-6 py-2 text-small font-medium text-ink",
                                "transition motion-reduce:transition-none hover:bg-ink hover:text-cream",
                                "focus-ring"
                              )}
                            >
                              Book
                            </Link>
                          </div>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <div className="relative overflow-hidden rounded-image">
              <Image src={room.imageSrc} alt={room.name} width={1600} height={1200} className="h-auto w-full" />
              <div
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent p-6 text-small text-white"
                aria-hidden="true"
              >
                {room.caption}
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
