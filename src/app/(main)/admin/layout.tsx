import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    // Redirect unauthenticated users to login with next param
    redirect(`/login?next=/admin/stays`);
  }
  return <>{children}</>;
}
