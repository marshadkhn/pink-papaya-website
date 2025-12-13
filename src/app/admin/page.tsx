"use client";

import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import HeaderContent from "@/components/headerContent";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();

  async function logout() {
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      router.push("/login");
    }
  }

  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="flex items-start justify-between gap-4">
          <HeaderContent
            align="left"
            showCta={false}
            title="Dashboard"
            description="Welcome to the admin panel. Manage your website content from here."
          />
          <Button variant="outlineBlack" onClick={logout}>
            Logout
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/stays"
            className="block p-6 border rounded-lg hover:bg-neutral-50"
          >
            <h3 className="text-lg font-semibold">Manage Stays</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Add, edit, or delete stay listings.
            </p>
          </Link>
          <Link
            href="/admin/interior"
            className="block p-6 border rounded-lg hover:bg-neutral-50"
          >
            <h3 className="text-lg font-semibold">Manage Interior Projects</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Add, edit, or delete interior design projects.
            </p>
          </Link>
          <Link
            href="/admin/interior-testimonials"
            className="block p-6 border rounded-lg hover:bg-neutral-50"
          >
            <h3 className="text-lg font-semibold">Manage Interior Testimonials</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Manage client testimonials for interior projects.
            </p>
          </Link>
          <Link
            href="/admin/locations"
            className="block p-6 border rounded-lg hover:bg-neutral-50"
          >
            <h3 className="text-lg font-semibold">Manage Locations</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Organize stays by location for filtering.
            </p>
          </Link>
          <Link
            href="/admin/blog"
            className="block p-6 border rounded-lg hover:bg-neutral-50"
          >
            <h3 className="text-lg font-semibold">Manage Blog</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Create, update, or remove blog posts.
            </p>
          </Link>
        </div>
      </Container>
    </section>
  );
}
