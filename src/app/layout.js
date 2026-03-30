import { Geist, Geist_Mono, Playfair_Display, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import LazyMediaObserver from "@/components/LazyMediaObserver";
// ClientLoaderGate removed; render children directly

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], display: "swap" });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], display: "swap" });

export const metadata = {
  title: {
    template: "%s | Pink Papaya Stays",
    default: "Pink Papaya Stays | A cozy place to relax and unwind",
  },
  description: "Experience the ultimate relaxation and comfort with Pink Papaya Stays. Book your dream staycation or explore our premium interior designs.",
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Pink Papaya Stays",
    description: "Experience the ultimate relaxation and comfort with Pink Papaya Stays.",
    url: "https://pinkpapayastays.com",
    siteName: "Pink Papaya Stays",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: "Pink Papaya Stays",
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${bricolage.variable} antialiased`}>
        <LazyMediaObserver />
        {children}
      </body>
    </html>
  );
}
