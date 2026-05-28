"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  exact?: boolean;
};

const ALL_NAV: NavItem[] = [
  { href: "/cms", label: "Dashboard", exact: true },
  { href: "/cms/pages", label: "Pages" },
  { href: "/cms/media", label: "Media" },
  { href: "/cms/users", label: "Users" },
  { href: "/cms/roles", label: "Roles" },
];

type Props = {
  children: React.ReactNode;
  userEmail?: string;
  role?: string | null;
  navHrefs?: string[]; // allowed nav targets
};

export default function CmsShell({ children, userEmail, role, navHrefs }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const NAV = useMemo(() => {
    if (!navHrefs?.length) return ALL_NAV;
    const allowed = new Set(navHrefs);
    return ALL_NAV.filter((n) => allowed.has(n.href));
  }, [navHrefs]);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-[#16323C] text-white">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#C07A5A] flex items-center justify-center text-white text-sm font-bold font-playfair">
            C
          </div>
          <div>
            <div className="font-playfair text-[15px] font-semibold leading-tight text-white">
              Pink Papaya
            </div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-bricolage">
              CMS
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <div className="mb-3 px-3">
          <span className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-bricolage font-semibold">
            Content
          </span>
        </div>

        {NAV.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bricolage transition-all duration-150 ${
                active
                  ? "bg-white/10 text-white font-semibold"
                  : "text-white/55 hover:text-white/90 hover:bg-white/5"
              }`}
            >
              <span className={active ? "text-[#C07A5A]" : ""}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </span>
              {item.label}
              {active && <span className="ml-auto w-1 h-4 rounded-full bg-[#C07A5A]" />}
            </Link>
          );
        })}

        <div className="mt-5 mb-3 px-3">
          <span className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-bricolage font-semibold">
            Site
          </span>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bricolage text-white/55 hover:text-white/90 hover:bg-white/5 transition-all duration-150"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View Website
        </a>
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-2">
        {(userEmail || role) && (
          <div className="px-3 py-2 rounded-lg bg-white/5">
            <div className="text-[10px] uppercase tracking-[0.1em] text-white/30 font-bricolage mb-0.5">
              Signed in as
            </div>
            {userEmail && <div className="text-xs text-white/70 font-bricolage truncate">{userEmail}</div>}
            {role && <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/40 font-bricolage">{role}</div>}
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bricolage text-white/55 hover:text-red-400 hover:bg-red-400/5 transition-all duration-150"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F3F0] flex">
      <aside className="hidden lg:flex flex-col w-60 shrink-0 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-50 w-64 flex flex-col">
            <Sidebar />
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <header className="lg:hidden flex items-center gap-3 px-4 py-4 bg-[#16323C] text-white sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-md hover:bg-white/10 transition"
            aria-label="Open menu"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-playfair text-base font-semibold">Pink Papaya CMS</span>
        </header>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
