import { Page, PageContent, PageSeo } from "@/lib/models/Cms";
import { connectToDatabase } from "@/lib/mongodb";
import { cmsPageConfigs, getCmsPageConfig, cmsSectionSchema, cmsSeoSchema } from "@/lib/cms/config/pages";
import { sanitizePlainText, sanitizeOptionalUrl } from "@/lib/cms/sanitize";

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
  await connectToDatabase();

  for (const p of cmsPageConfigs) {
    await Page.findOneAndUpdate(
      { slug: p.slug },
      {
        $setOnInsert: {
          slug: p.slug,
          label: p.label,
          publicPath: p.publicPath,
        }
      },
      { upsert: true }
    );
  }

  pagesSeeded = true;
}

export async function listCmsPages() {
  await ensureCmsPagesSeeded();
  const pages = await Page.find().sort({ slug: 1 });
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

  const page = await Page.findOne({ slug });
  if (!page) throw new Error("CMS page missing");

  const pageSeo = await PageSeo.findOne({ pageId: page._id });
  const contentDocs = await PageContent.find({ pageId: page._id });

  const sections: Record<string, Record<string, string>> = {};

  for (const section of config.sections) {
    sections[section.key] = {};
    for (const field of section.fields) {
      const doc = contentDocs.find((d) => d.sectionKey === section.key && d.fieldKey === field.key);
      let value = field.defaultValue ?? "";
      if (doc && doc.value !== null && doc.value !== undefined) {
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
      title: pageSeo?.title ?? "",
      description: pageSeo?.description ?? "",
      keywords: pageSeo?.keywords ?? [],
      ogImageUrl: pageSeo?.ogImageUrl ?? "",
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

  const page = await Page.findOne({ slug: input.slug });
  if (!page) throw new Error("CMS page missing");

  for (const field of section.fields) {
    const raw = parsed.data[field.key] ?? "";
    const asString = String(raw ?? "");
    const value = field.type === "image" || field.type === "url" ? sanitizeOptionalUrl(asString) : sanitizePlainText(asString);

    await PageContent.findOneAndUpdate(
      { pageId: page._id, sectionKey: section.key, fieldKey: field.key },
      { value, updatedBy: input.updatedBy },
      { upsert: true, new: true }
    );
  }

  await Page.findByIdAndUpdate(page._id, { updatedAt: new Date() });
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

  const page = await Page.findOne({ slug: input.slug });
  if (!page) throw new Error("CMS page missing");

  await PageSeo.findOneAndUpdate(
    { pageId: page._id },
    { ...parsed.data, updatedBy: input.updatedBy },
    { upsert: true, new: true }
  );

  await Page.findByIdAndUpdate(page._id, { updatedAt: new Date() });
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
