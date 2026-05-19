import { getPostById, readPosts } from "@/lib/blogStore";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_PLACEHOLDER } from "@/utils/image";

function estimateReadTime(content) {
  const words = content.split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function renderContent(content) {
  const lines = content.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    // H2
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="font-playfair text-2xl md:text-3xl text-neutral-900 mt-12 mb-4">
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // Blockquote — collect consecutive > lines
    if (line.startsWith("> ")) {
      const quoteLines = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      const [quote, attribution] = quoteLines.join("\n").split("\n— ");
      elements.push(
        <blockquote key={i} className="my-10 pl-6 border-l-2 border-neutral-200">
          <p className="font-playfair text-xl md:text-2xl italic text-neutral-700 leading-relaxed">
            {quote.replace(/^"/, "“").replace(/"$/, "”")}
          </p>
          {attribution && (
            <footer className="mt-4 text-[11px] uppercase tracking-[0.16em] text-neutral-400 font-bricolage">
              — {attribution}
            </footer>
          )}
        </blockquote>
      );
      continue;
    }

    // Inline image: ![caption|url]
    const imgMatch = line.match(/^!\[([^|]*)\|([^\]]+)\]$/);
    if (imgMatch) {
      const [, caption, url] = imgMatch;
      elements.push(
        <figure key={i} className="my-10">
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100">
            <Image src={url || DEFAULT_PLACEHOLDER} alt={caption} fill className="object-cover" />
          </div>
          {caption && (
            <figcaption className="mt-3 text-center text-[12px] text-neutral-400 font-bricolage">
              {caption}
            </figcaption>
          )}
        </figure>
      );
      i++;
      continue;
    }

    // Paragraph
    elements.push(
      <p key={i} className="text-[15px] md:text-base text-neutral-600 leading-[1.85] font-bricolage">
        {line}
      </p>
    );
    i++;
  }

  return elements;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const post = await getPostById(resolvedParams.id);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: post.imageUrl ? [{ url: post.imageUrl }] : [] },
  };
}

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const [post, allPosts] = await Promise.all([
    getPostById(resolvedParams.id),
    readPosts(),
  ]);

  if (!post) return notFound();

  const currentIndex = allPosts.findIndex((p) => p.id === post.id);
  const nextPost = allPosts[(currentIndex + 1) % allPosts.length] !== post
    ? allPosts[(currentIndex + 1) % allPosts.length]
    : null;

  return (
    <article className="bg-white">
      {/* Hero image — full width, tall */}
      <div className="relative w-full" style={{ height: "calc(100vh - var(--navbar-h))" }}>
        <Image
          src={post.imageUrl?.startsWith("http") ? post.imageUrl : DEFAULT_PLACEHOLDER}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-[5%]">
        {/* Eyebrow */}
        {post.category && (
          <p className="font-bricolage text-[11px] uppercase tracking-[0.2em] text-[#C07A5A] text-center mb-5">
            {post.category}
          </p>
        )}

        {/* Title */}
        <h1 className="font-playfair text-4xl md:text-5xl text-neutral-900 leading-[1.1] text-center mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <p className="text-center text-[13px] text-neutral-400 font-bricolage mb-12">
          By {post.author} &nbsp;·&nbsp; {post.date} &nbsp;·&nbsp; {estimateReadTime(post.content)}
        </p>

        <hr className="border-neutral-100 mb-12" />

        {/* Body */}
        <div className="space-y-6">
          {renderContent(post.content)}
        </div>

        {/* Next story */}
        {nextPost && (
          <div className="mt-20 pt-8 border-t border-neutral-100 flex justify-end">
            <Link
              href={`/blog/${nextPost.id}`}
              className="font-bricolage text-[13px] text-neutral-400 hover:text-neutral-800 transition-colors"
            >
              Next Story: <span className="text-neutral-800 font-medium">{nextPost.title}</span>
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
