import Link from "next/link";
import clsx from "clsx";
import { Facebook, Instagram, Music2, Youtube } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PalmLeaf } from "@/components/icons/PalmLeaf";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line bg-cream">
      <PalmLeaf className="pointer-events-none absolute bottom-4 left-4 text-ink opacity-10" aria-hidden="true" />
      <PalmLeaf
        className="pointer-events-none absolute bottom-4 right-4 text-ink opacity-10"
        flipped
        aria-hidden="true"
      />

      <Container>
        <div className="py-16">
          <div className="text-center">
            <div className="font-serif text-h3m md:text-h3 font-medium">Logo</div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-small font-semibold text-ink">Navigation</div>
              <ul className="mt-4 space-y-3 text-small text-inkSoft">
                <li>
                  <Link className="focus-ring hover:text-ink" href="/">
                    home
                  </Link>
                </li>
                <li>
                  <Link className="focus-ring hover:text-ink" href="/stays">
                    explore stays
                  </Link>
                </li>
                <li>
                  <Link className="focus-ring hover:text-ink" href="/contact">
                    contact us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-small font-semibold text-ink">Pages</div>
              <ul className="mt-4 space-y-3 text-small text-inkSoft">
                <li>
                  <Link className="focus-ring hover:text-ink" href="#">
                    about us
                  </Link>
                </li>
                <li>
                  <Link className="focus-ring hover:text-ink" href="#">
                    explore stays
                  </Link>
                </li>
                <li>
                  <Link className="focus-ring hover:text-ink" href="#">
                    contact us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-small font-semibold text-ink">Pages</div>
              <ul className="mt-4 space-y-3 text-small text-inkSoft">
                <li>
                  <Link className="focus-ring hover:text-ink" href="#">
                    home
                  </Link>
                </li>
                <li>
                  <Link className="focus-ring hover:text-ink" href="#">
                    about us
                  </Link>
                </li>
                <li>
                  <Link className="focus-ring hover:text-ink" href="#">
                    explore stays
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-small font-semibold text-ink">Stay up to date</div>

              <div className="mt-4 flex items-center gap-3">
                {[
                  { label: "Facebook", Icon: Facebook },
                  { label: "Instagram", Icon: Instagram },
                  { label: "YouTube", Icon: Youtube },
                  { label: "TikTok", Icon: Music2 },
                ].map(({ label, Icon }) => (
                  <Link
                    key={label}
                    href="#"
                    aria-label={label}
                    className={clsx(
                      "inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-cream",
                      "transition motion-reduce:transition-none hover:bg-inkSoft",
                      "focus-ring"
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </Link>
                ))}
              </div>

              <form className="mt-6">
                <label className="sr-only" htmlFor="newsletter-email">
                  Email
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  className={clsx(
                    "w-full rounded-card border border-line bg-card px-4 py-3 text-body text-ink",
                    "placeholder:text-inkSoft",
                    "focus-ring"
                  )}
                />
                <button
                  type="button"
                  className={clsx(
                    "mt-4 inline-flex w-full items-center justify-center rounded-card bg-btnDark px-8 py-3 text-small font-medium text-white",
                    "transition motion-reduce:transition-none hover:bg-ink",
                    "focus-ring"
                  )}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="mt-16 text-center text-small text-inkSoft">2025 © All right reserved</div>
        </div>
      </Container>
    </footer>
  );
}
