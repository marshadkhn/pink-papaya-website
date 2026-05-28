export type CmsPermissionKey =
  | "cms.pages.read"
  | "cms.pages.write_content"
  | "cms.pages.write_seo"
  | "cms.media.read"
  | "cms.media.write"
  | "cms.users.read"
  | "cms.users.write"
  | "cms.roles.read"
  | "cms.roles.write"
  | "cms.permissions.read";

export type CmsPermissionDefinition = {
  key: CmsPermissionKey;
  label: string;
  description?: string;
};

export const CMS_PERMISSIONS: CmsPermissionDefinition[] = [
  {
    key: "cms.pages.read",
    label: "Read pages",
    description: "View page list, sections, and current content",
  },
  {
    key: "cms.pages.write_content",
    label: "Edit content",
    description: "Update headings, paragraphs, labels, buttons, and section content",
  },
  {
    key: "cms.pages.write_seo",
    label: "Edit SEO",
    description: "Update meta title/description, keywords, and OG image",
  },
  {
    key: "cms.media.read",
    label: "Read media",
    description: "View the media library",
  },
  {
    key: "cms.media.write",
    label: "Manage media",
    description: "Upload, replace, and delete media",
  },
  {
    key: "cms.users.read",
    label: "Read users",
    description: "View CMS users",
  },
  {
    key: "cms.users.write",
    label: "Manage users",
    description: "Create users and update roles",
  },
  {
    key: "cms.roles.read",
    label: "Read roles",
    description: "View role definitions and permission assignments",
  },
  {
    key: "cms.roles.write",
    label: "Manage roles",
    description: "Edit role permission assignments",
  },
  {
    key: "cms.permissions.read",
    label: "Read permissions",
    description: "View the permission catalog",
  },
];

export const ALL_CMS_PERMISSION_KEYS = CMS_PERMISSIONS.map((p) => p.key);
