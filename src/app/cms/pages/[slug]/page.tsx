import { redirect } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getSession } from "@/lib/auth";
import { getRolePermissions } from "@/lib/cms/rbac";
import CmsPageEditorClient from "@/components/cms/CmsPageEditorClient";

export default async function CmsPageEditor({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { slug } = await params;
  const perms = await getRolePermissions(session.role);
  if (!perms.has("cms.pages.read")) redirect("/cms/unauthorized");

  return (
    <>
      <AdminPageHeader title={`Edit: ${slug}`} description="Edit configured fields only. Layout/design is not editable." />
      <CmsPageEditorClient slug={slug} permissions={Array.from(perms)} />
    </>
  );
}
