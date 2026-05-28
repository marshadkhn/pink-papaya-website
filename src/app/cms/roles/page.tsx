import { redirect } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getSession } from "@/lib/auth";
import { getRolePermissions } from "@/lib/cms/rbac";
import CmsRolesClient from "@/components/cms/CmsRolesClient";

export default async function CmsRolesPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const perms = await getRolePermissions(session.role);
  if (!perms.has("cms.roles.read")) redirect("/cms/unauthorized");

  return (
    <>
      <AdminPageHeader title="Roles" description="Edit role permission assignments (Super Admin only)." />
      <CmsRolesClient permissions={Array.from(perms)} role={session.role ?? null} />
    </>
  );
}
