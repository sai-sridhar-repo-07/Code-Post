import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
  Orbitron,
  Rajdhani,
  Share_Tech_Mono,
  Playfair_Display,
  Lora,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/layout/SessionProvider";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech",
  subsets: ["latin"],
  weight: "400",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodePost — Beautiful GitHub Developer Cards",
  description:
    "Transform your GitHub contributions into stunning, shareable developer cards. 5 themes, instant export, and social sharing.",
  openGraph: {
    title: "CodePost — Beautiful GitHub Developer Cards",
    description:
      "Transform your GitHub contributions into stunning, shareable developer cards.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodePost",
    description: "Beautiful GitHub developer cards",
  },
};

const fontVars = [
  inter.variable,
  jetbrainsMono.variable,
  orbitron.variable,
  rajdhani.variable,
  shareTechMono.variable,
  playfairDisplay.variable,
  lora.variable,
  plusJakartaSans.variable,
].join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fontVars} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#080a14] text-white">
        <SessionProvider>
          <Navbar />
          <main className="flex-1 pt-14">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
