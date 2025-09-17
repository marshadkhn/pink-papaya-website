import {
  Geist,
  Geist_Mono,
  Playfair_Display,
  Bricolage_Grotesque,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

// Add the Bricolage Grotesque font
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Pink Papaya Stays",
  description: "A cozy place to relax and unwind",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${bricolage.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
