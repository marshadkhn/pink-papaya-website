import { redirect } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getSession } from "@/lib/auth";
import { getRolePermissions } from "@/lib/cms/rbac";
import CmsMediaClient from "@/components/cms/CmsMediaClient";

export default async function CmsMediaPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const perms = await getRolePermissions(session.role);
  if (!perms.has("cms.media.read")) redirect("/cms/unauthorized");

  return (
    <>
      <AdminPageHeader title="Media" description="Upload and manage images used in CMS fields." />
      <CmsMediaClient permissions={Array.from(perms)} />
    </>
  );
}
