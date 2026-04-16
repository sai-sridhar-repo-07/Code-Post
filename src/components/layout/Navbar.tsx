"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import { LogOut, LayoutDashboard, Images, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 20));
    return unsub;
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#05060f]/80 backdrop-blur-2xl border-b border-white/8 shadow-xl shadow-black/40"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Animated gradient top line */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(14,165,233,0.5) 30%, rgba(139,92,246,0.8) 50%, rgba(236,72,153,0.5) 70%, transparent 100%)",
          opacity: scrolled ? 1 : 0,
          transition: "opacity 0.5s",
        }}
      />

      <div className="flex items-center justify-between px-6 py-3.5 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative w-8 h-8">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
              <Zap size={15} className="text-white" />
            </div>
          </div>
          <span className="font-bold text-white text-sm tracking-tight group-hover:text-gray-200 transition-colors">
            Code<span className="gradient-text-blue-violet">Post</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <NavLink href="/gallery" icon={<Images size={13} />} label="Gallery" />

          {session?.user ? (
            <>
              <NavLink href="/dashboard" icon={<LayoutDashboard size={13} />} label="Dashboard" />

              <div className="flex items-center gap-2 ml-3 pl-3 border-l border-white/10">
                <Link href={`/${session.user.username}`} className="group relative">
                  <div className="absolute inset-0 rounded-full ring-2 ring-violet-500/0 group-hover:ring-violet-500/60 transition-all duration-300 blur-sm" />
                  <Image
                    src={session.user.image ?? ""}
                    alt={session.user.name ?? ""}
                    width={30}
                    height={30}
                    className="rounded-full ring-2 ring-white/15 group-hover:ring-violet-400/60 transition-all duration-300 relative z-10"
                    unoptimized
                  />
                </Link>
                <motion.button
                  onClick={() => signOut()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                  <LogOut size={13} />
                </motion.button>
              </div>
            </>
          ) : (
            <motion.button
              onClick={() => signIn("github")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative ml-3 flex items-center gap-2 px-5 py-2 rounded-xl text-white text-xs font-semibold overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" className="relative z-10">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className="relative z-10">Sign in with GitHub</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="group relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs text-gray-400 hover:text-white transition-colors duration-200"
    >
      {/* Hover background */}
      <span className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/6 transition-colors duration-200" />
      <span className="relative z-10 opacity-60 group-hover:opacity-100 transition-opacity">{icon}</span>
      <span className="relative z-10">{label}</span>
    </Link>
  );
}
