import Hero from "@/components/Hero";
import Container from "@/components/Container";
import { readPosts } from "@/lib/blogStore";
import Link from "next/link";
import LazyMediaObserver from "@/components/LazyMediaObserver";
import { DEFAULT_PLACEHOLDER } from "@/utils/image";
import { Suspense } from "react";
import CategoryFilter from "@/components/blog/CategoryFilter";

function BlogPostCard({ post }) {
  const image = post.imageUrl || DEFAULT_PLACEHOLDER;
  return (
    <Link href={`/blog/${post.id}`} className="group block">
      <div className="rounded-10 overflow-hidden">
        <div className="relative w-full pt-[140%] bg-neutral-200">
          <div
            className="absolute inset-0 bg-cover bg-center"
            data-bg={`url(${image})`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <div className="absolute left-4 top-4 flex items-center gap-3">
            {post.category && (
              <span className="text-[11px] text-white/90 bg-black/20 px-3 py-1 rounded-full uppercase tracking-wide">
                {post.category}
              </span>
            )}
            <span className="text-[11px] text-white/80">{post.date}</span>
          </div>

          <div className="absolute left-5 right-5 bottom-5">
            <h3 className="font-playfair text-xl md:text-2xl text-white leading-tight drop-shadow-md">
              {post.title}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function BlogPage({ searchParams }) {
  const { category } = await searchParams;
  const allPosts = await readPosts();
  const posts = category
    ? allPosts.filter((p) => p.category?.toLowerCase() === category.toLowerCase())
    : allPosts;

  return (
    <>
      <Hero
        title="Our Blog"
        description="Stories, insights, and updates from the world of Pink Papaya."
        align="center"
        showCta={false}
        compact
      />

      <section className="py-12 md:py-16">
        <Container>
          <div className="flex justify-center mb-10">
            <Suspense>
              <CategoryFilter />
            </Suspense>
          </div>

          {posts.length === 0 ? (
            <p className="text-center text-neutral-400 font-bricolage py-16">
              No posts in this collection yet.
            </p>
          ) : (
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          <LazyMediaObserver />
        </Container>
      </section>
    </>
  );
}
