import Navbar from "@/components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
  {/* Content renders without global top padding so the hero can sit under the fixed navbar */}
  <main>{children}</main>
    </div>
  );
}
