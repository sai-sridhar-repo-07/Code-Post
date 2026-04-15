"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Heart, Eye, ExternalLink, Filter } from "lucide-react";
import { themeList } from "@/lib/themes";
import { formatNumber, timeAgo } from "@/lib/utils";
import type { ThemeName } from "@/types";

interface GalleryCard {
  id: string;
  title: string;
  themeName: ThemeName;
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  user: { username: string; avatarUrl: string; name: string | null };
}

const THEME_BADGE_COLORS: Record<ThemeName, string> = {
  minimalist: "bg-gray-500/20 text-gray-300",
  cyberpunk: "bg-cyan-500/20 text-cyan-300",
  vintage: "bg-green-500/20 text-green-300",
  gradient: "bg-purple-500/20 text-purple-300",
  paper: "bg-amber-500/20 text-amber-300",
};

export default function GalleryPage() {
  const { data: session } = useSession();
  const [cards, setCards] = useState<GalleryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [themeFilter, setThemeFilter] = useState<ThemeName | "all">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page) });
        if (themeFilter !== "all") params.set("theme", themeFilter);
        const res = await fetch(`/api/gallery?${params}`);
        if (res.ok) {
          const data = await res.json();
          setCards(data.cards);
          setTotalPages(data.pages);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, [page, themeFilter]);

  const toggleLike = async (cardId: string) => {
    if (!session) return;
    const res = await fetch(`/api/gallery/${cardId}/like`, { method: "POST" });
    if (res.ok) {
      const { liked } = await res.json();
      setCards((prev) =>
        prev.map((c) =>
          c.id === cardId
            ? { ...c, isLiked: liked, likeCount: c.likeCount + (liked ? 1 : -1) }
            : c
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#080a14] text-white pt-20">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community Gallery</h1>
          <p className="text-gray-400">
            Explore developer cards from the community. Get inspired.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <Filter size={14} className="text-gray-500" />
          <button
            onClick={() => { setThemeFilter("all"); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              themeFilter === "all"
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20"
            }`}
          >
            All themes
          </button>
          {themeList.map((theme) => (
            <button
              key={theme.name}
              onClick={() => { setThemeFilter(theme.name); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                themeFilter === theme.name
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20"
              }`}
            >
              {theme.displayName}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-2xl bg-white/5 animate-pulse border border-white/5"
              />
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <Eye size={24} className="text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No cards yet</h3>
            <p className="text-gray-500 text-sm mb-6">
              Be the first to share your developer card!
            </p>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors"
            >
              Create your card
            </Link>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {cards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 transition-all overflow-hidden"
              >
                {/* Card preview placeholder */}
                <div
                  className="w-full h-40 flex items-center justify-center text-gray-600 relative overflow-hidden"
                  style={{
                    background:
                      card.themeName === "cyberpunk"
                        ? "linear-gradient(135deg, #0a0e27, #1a1f3a)"
                        : card.themeName === "gradient"
                        ? "linear-gradient(135deg, #0f0c29, #24243e)"
                        : card.themeName === "vintage"
                        ? "#0d1117"
                        : card.themeName === "paper"
                        ? "#fdf6e3"
                        : "#f8f9fa",
                  }}
                >
                  <span className="text-4xl opacity-20 select-none">&lt;/&gt;</span>
                  <Link
                    href={`/${card.user.username}`}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink size={20} className="text-white" />
                  </Link>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Image
                        src={card.user.avatarUrl}
                        alt={card.user.username}
                        width={28}
                        height={28}
                        className="rounded-full ring-1 ring-white/10"
                        unoptimized
                      />
                      <div>
                        <p className="text-xs font-medium text-white">
                          {card.user.name ?? card.user.username}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          @{card.user.username}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        THEME_BADGE_COLORS[card.themeName]
                      }`}
                    >
                      {card.themeName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{timeAgo(card.createdAt)}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye size={11} />
                        {formatNumber(card.viewCount)}
                      </span>
                      <button
                        onClick={() => toggleLike(card.id)}
                        className={`flex items-center gap-1 transition-colors ${
                          card.isLiked
                            ? "text-red-400"
                            : "hover:text-red-400"
                        }`}
                      >
                        <Heart size={11} fill={card.isLiked ? "currentColor" : "none"} />
                        {formatNumber(card.likeCount)}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-gray-400 hover:text-white disabled:opacity-40 transition-all"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-gray-400 hover:text-white disabled:opacity-40 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
