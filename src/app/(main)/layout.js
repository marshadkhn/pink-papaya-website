import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
  {/* Content renders without global top padding so the hero can sit under the fixed navbar */}
  <main>{children}</main>
  {/* footer */}
  <Footer />
    </div>
  );
}
