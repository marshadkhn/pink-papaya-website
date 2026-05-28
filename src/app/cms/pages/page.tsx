import { redirect } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getSession } from "@/lib/auth";
import { getRolePermissions } from "@/lib/cms/rbac";
import CmsPagesClient from "@/components/cms/CmsPagesClient";

export default async function CmsPagesPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const perms = await getRolePermissions(session.role);
  if (!perms.has("cms.pages.read")) redirect("/cms/unauthorized");

  return (
    <>
      <AdminPageHeader title="Pages" description="Select a page and edit its configured sections." />
      <CmsPagesClient />
    </>
  );
}
