import { PrismaClient } from "@prisma/client";
import { cmsPageConfigs, getCmsPageConfig, cmsSectionSchema, cmsSeoSchema } from "@/lib/cms/config/pages";
import { sanitizePlainText, sanitizeOptionalUrl } from "@/lib/cms/sanitize";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type CmsPublicPageContent = {
  slug: string;
  sections: Record<string, Record<string, string>>;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImageUrl?: string;
  };
};

let pagesSeeded = false;

export async function ensureCmsPagesSeeded() {
  if (pagesSeeded) return;

  for (const p of cmsPageConfigs) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        label: p.label,
        publicPath: p.publicPath,
      },
    });
  }

  pagesSeeded = true;
}

export async function listCmsPages() {
  await ensureCmsPagesSeeded();
  const pages = await prisma.page.findMany({
    orderBy: { slug: "asc" },
  });
  return pages.map((p) => ({
    slug: p.slug,
    label: p.label,
    publicPath: p.publicPath,
    updatedAt: p.updatedAt,
  }));
}

export async function readCmsPage(slug: string) {
  await ensureCmsPagesSeeded();
  const config = getCmsPageConfig(slug);
  if (!config) throw new Error("Unknown CMS page");

  const page = await prisma.page.findUnique({
    where: { slug },
    include: { seo: true },
  });
  if (!page) throw new Error("CMS page missing");

  const contentDocs = await prisma.pageContent.findMany({
    where: { pageId: page.id },
  });

  const sections: Record<string, Record<string, string>> = {};

  for (const section of config.sections) {
    sections[section.key] = {};
    for (const field of section.fields) {
      const doc = contentDocs.find((d) => d.sectionKey === section.key && d.fieldKey === field.key);
      let value = field.defaultValue ?? "";
      if (doc && doc.value !== null && doc.value !== undefined) {
        // Prisma returns JSON values directly. If we stored it as string, it's a string.
        value = String(doc.value);
      }
      sections[section.key][field.key] = value;
    }
  }

  return {
    page: { slug: page.slug, label: page.label, publicPath: page.publicPath },
    config,
    content: { slug, sections },
    seo: {
      title: page.seo?.title ?? "",
      description: page.seo?.description ?? "",
      keywords: page.seo?.keywords ?? [],
      ogImageUrl: page.seo?.ogImageUrl ?? "",
    },
  };
}

export async function updateCmsSectionContent(input: {
  slug: string;
  sectionKey: string;
  values: Record<string, unknown>;
  updatedBy: string;
}) {
  await ensureCmsPagesSeeded();
  const config = getCmsPageConfig(input.slug);
  if (!config) throw new Error("Unknown CMS page");
  const section = config.sections.find((s) => s.key === input.sectionKey);
  if (!section) throw new Error("Unknown section");

  const schema = cmsSectionSchema(section);
  const parsed = schema.safeParse(input.values);
  if (!parsed.success) {
    const err = new Error("Validation error");
    (err as any).status = 400;
    (err as any).details = parsed.error.flatten();
    throw err;
  }

  const page = await prisma.page.findUnique({ where: { slug: input.slug } });
  if (!page) throw new Error("CMS page missing");

  for (const field of section.fields) {
    const raw = parsed.data[field.key] ?? "";
    const asString = String(raw ?? "");
    const value = field.type === "image" || field.type === "url" ? sanitizeOptionalUrl(asString) : sanitizePlainText(asString);

    await prisma.pageContent.upsert({
      where: {
        pageId_sectionKey_fieldKey: {
          pageId: page.id,
          sectionKey: section.key,
          fieldKey: field.key,
        },
      },
      update: {
        value,
        updatedBy: input.updatedBy,
      },
      create: {
        pageId: page.id,
        sectionKey: section.key,
        fieldKey: field.key,
        value,
        updatedBy: input.updatedBy,
      },
    });
  }

  await prisma.page.update({
    where: { id: page.id },
    data: { updatedAt: new Date() },
  });
}

export async function updateCmsSeo(input: {
  slug: string;
  seo: { title?: unknown; description?: unknown; keywords?: unknown; ogImageUrl?: unknown };
  updatedBy: string;
}) {
  await ensureCmsPagesSeeded();
  const config = getCmsPageConfig(input.slug);
  if (!config) throw new Error("Unknown CMS page");
  if (!config.seo.enabled) throw new Error("SEO not enabled for this page");

  const parsed = cmsSeoSchema.safeParse({
    title: typeof input.seo.title === "string" ? sanitizePlainText(input.seo.title) : "",
    description: typeof input.seo.description === "string" ? sanitizePlainText(input.seo.description) : "",
    keywords: Array.isArray(input.seo.keywords)
      ? input.seo.keywords.map((k) => sanitizePlainText(String(k))).filter(Boolean)
      : [],
    ogImageUrl: typeof input.seo.ogImageUrl === "string" ? sanitizeOptionalUrl(input.seo.ogImageUrl) : "",
  });

  if (!parsed.success) {
    const err = new Error("Validation error");
    (err as any).status = 400;
    (err as any).details = parsed.error.flatten();
    throw err;
  }

  const page = await prisma.page.findUnique({ where: { slug: input.slug } });
  if (!page) throw new Error("CMS page missing");

  await prisma.pageSeo.upsert({
    where: { pageId: page.id },
    update: {
      ...parsed.data,
      updatedBy: input.updatedBy,
    },
    create: {
      pageId: page.id,
      ...parsed.data,
      updatedBy: input.updatedBy,
    },
  });

  await prisma.page.update({
    where: { id: page.id },
    data: { updatedAt: new Date() },
  });
}

export async function getCmsPublicContent(slug: string): Promise<CmsPublicPageContent> {
  const data = await readCmsPage(slug);
  return {
    slug,
    sections: data.content.sections,
    seo: {
      title: data.seo.title,
      description: data.seo.description,
      keywords: data.seo.keywords,
      ogImageUrl: data.seo.ogImageUrl,
    },
  };
}
