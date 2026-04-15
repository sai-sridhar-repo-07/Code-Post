"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import { LogOut, LayoutDashboard, Images, Zap } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#080a14]/80 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Zap size={14} className="text-white" />
        </div>
        <span className="font-bold text-white text-sm">CodePost</span>
      </Link>

      <div className="flex items-center gap-1">
        <Link
          href="/gallery"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <Images size={13} />
          Gallery
        </Link>

        {session?.user ? (
          <>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <LayoutDashboard size={13} />
              Dashboard
            </Link>
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/10">
              <Link href={`/${session.user.username}`}>
                <Image
                  src={session.user.image ?? ""}
                  alt={session.user.name ?? ""}
                  width={28}
                  height={28}
                  className="rounded-full ring-2 ring-white/20 hover:ring-blue-500 transition-all"
                  unoptimized
                />
              </Link>
              <button
                onClick={() => signOut()}
                className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut size={13} />
              </button>
            </div>
          </>
        ) : (
          <motion.button
            onClick={() => signIn("github")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="ml-2 flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white text-gray-900 text-xs font-semibold hover:bg-gray-100 transition-all"
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Sign in with GitHub
          </motion.button>
        )}
      </div>
    </nav>
  );
}
