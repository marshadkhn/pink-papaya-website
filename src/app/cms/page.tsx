import Link from "next/link";
import { redirect } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getSession } from "@/lib/auth";
import { getRolePermissions } from "@/lib/cms/rbac";

export default async function CmsDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const perms = await getRolePermissions(session.role);

  const cards = [
    {
      href: "/cms/pages",
      title: "Pages",
      description: "Edit page sections and content blocks.",
      show: perms.has("cms.pages.read"),
    },
    {
      href: "/cms/media",
      title: "Media",
      description: "Upload, replace, and manage images.",
      show: perms.has("cms.media.read"),
    },
    {
      href: "/cms/users",
      title: "Users",
      description: "Create CMS users and assign roles.",
      show: perms.has("cms.users.read"),
    },
    {
      href: "/cms/roles",
      title: "Roles",
      description: "Configure role permissions.",
      show: perms.has("cms.roles.read"),
    },
  ].filter((c) => c.show);

  return (
    <>
      <AdminPageHeader
        title="CMS Dashboard"
        description="Manage editable website content (no design/layout changes)."
      />

      {cards.length === 0 ? (
        <p className="text-neutral-500 font-bricolage">No CMS modules available for your role.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex items-start gap-4 p-5 bg-white rounded-2xl border border-neutral-200/80 hover:border-[#C07A5A]/40 hover:shadow-md transition-all duration-200"
            >
              <div className="mt-0.5 p-2.5 rounded-xl bg-[#F5F3F0] text-[#C07A5A] group-hover:bg-[#C07A5A]/10 transition-colors">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-neutral-900 font-bricolage">{c.title}</div>
                <div className="mt-0.5 text-sm text-neutral-500 font-bricolage">{c.description}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
