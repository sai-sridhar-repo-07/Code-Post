"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import { LogOut, LayoutDashboard, Images, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
    >
      {/* Glass bar */}
      <div
        className={`mx-auto transition-all duration-500 ${
          scrolled
            ? "mt-3 max-w-5xl rounded-2xl border border-white/8 bg-[#030508]/70 backdrop-blur-2xl shadow-xl shadow-black/40"
            : "max-w-full rounded-none border-b border-white/5 bg-[#030508]/40 backdrop-blur-xl"
        }`}
      >
        {/* Animated gradient top-line (visible when scrolled) */}
        {scrolled && (
          <div
            className="absolute top-0 inset-x-4 h-px rounded-full"
            style={{ background: "linear-gradient(90deg,transparent,rgba(139,92,246,.6),rgba(56,189,248,.6),transparent)" }}
          />
        )}

        <div className="flex items-center justify-between px-5 py-3">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Zap size={15} className="text-white" />
              </div>
            </div>
            <span className="font-black text-sm text-white tracking-tight">
              Code<span className="grad">Post</span>
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-1">
            <NavPill href="/gallery" icon={<Images size={13} />} label="Gallery" />

            {session?.user ? (
              <>
                <NavPill href="/dashboard" icon={<LayoutDashboard size={13} />} label="Dashboard" />
                <div className="flex items-center gap-2 ml-3 pl-3 border-l border-white/10">
                  <Link href={`/${session.user.username}`}>
                    <Image
                      src={session.user.image ?? ""}
                      alt={session.user.name ?? ""}
                      width={30} height={30}
                      className="rounded-full ring-2 ring-white/10 hover:ring-violet-400/60 transition-all"
                      unoptimized
                    />
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => signOut()}
                    className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
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
                className="relative ml-3 flex items-center gap-2 px-5 py-2 rounded-xl text-white text-xs font-bold overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600" />
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute inset-x-0 top-0 h-1/2 bg-white/10" />
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" className="relative z-10">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="relative z-10">Sign in</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function NavPill({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs text-white/40 hover:text-white hover:bg-white/6 transition-all duration-200"
    >
      <span className="opacity-70">{icon}</span>
      {label}
    </Link>
  );
}
