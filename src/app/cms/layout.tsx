import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import CmsShell from "@/components/cms/CmsShell";
import { getRolePermissions } from "@/lib/cms/rbac";

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const perms = await getRolePermissions(session.role);
  if (perms.size === 0) redirect("/cms/unauthorized");

  const navHrefs: string[] = [];
  navHrefs.push("/cms");
  if (perms.has("cms.pages.read")) navHrefs.push("/cms/pages");
  if (perms.has("cms.media.read")) navHrefs.push("/cms/media");
  if (perms.has("cms.users.read")) navHrefs.push("/cms/users");
  if (perms.has("cms.roles.read")) navHrefs.push("/cms/roles");

  return (
    <CmsShell userEmail={session.username} role={session.role ?? null} navHrefs={navHrefs}>
      {children}
    </CmsShell>
  );
}
