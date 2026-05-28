import { redirect } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getSession } from "@/lib/auth";
import { getRolePermissions } from "@/lib/cms/rbac";
import CmsUsersClient from "@/components/cms/CmsUsersClient";

export default async function CmsUsersPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const perms = await getRolePermissions(session.role);
  if (!perms.has("cms.users.read")) redirect("/cms/unauthorized");

  return (
    <>
      <AdminPageHeader title="Users" description="Create accounts and assign CMS roles." />
      <CmsUsersClient permissions={Array.from(perms)} />
    </>
  );
}
