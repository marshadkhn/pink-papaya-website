import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  console.log("[ADMIN LAYOUT] Session check:", session ? `User: ${session.username}` : "NO SESSION");
  
  if (!session) {
    // Redirect unauthenticated users to login with next param
    console.log("[ADMIN LAYOUT] Redirecting to login...");
    redirect(`/login?next=/admin/stays`);
  }
  return <>{children}</>;
}
