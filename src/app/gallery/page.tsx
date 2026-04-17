"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Heart, Eye, ExternalLink, Filter, Sparkles, TrendingUp, Search, X } from "lucide-react";
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

const THEME_BADGE: Record<ThemeName, { label: string; cls: string; dot: string }> = {
  minimalist: { label: "Minimalist", cls: "bg-gray-500/15 text-gray-300 border-gray-500/20",    dot: "#9ca3af" },
  cyberpunk:  { label: "Cyberpunk",  cls: "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",    dot: "#22d3ee" },
  vintage:    { label: "Vintage",    cls: "bg-green-500/15 text-green-300 border-green-500/20", dot: "#4ade80" },
  gradient:   { label: "Gradient",   cls: "bg-violet-500/15 text-violet-300 border-violet-500/20", dot: "#a78bfa" },
  paper:      { label: "Paper",      cls: "bg-amber-500/15 text-amber-300 border-amber-500/20",   dot: "#fbbf24" },
};

const THEME_PREVIEW_BG: Record<ThemeName, string> = {
  minimalist: "linear-gradient(135deg, #0f1117, #1a1d2e)",
  cyberpunk:  "linear-gradient(135deg, #050714, #0a0e27)",
  vintage:    "linear-gradient(135deg, #020b04, #071a07)",
  gradient:   "linear-gradient(135deg, #0f0c29, #1a0a3d)",
  paper:      "linear-gradient(135deg, #fdf6e3, #f0e8d0)",
};

const THEME_GLOW: Record<ThemeName, string> = {
  minimalist: "rgba(156,163,175,0.15)",
  cyberpunk:  "rgba(34,211,238,0.25)",
  vintage:    "rgba(74,222,128,0.2)",
  gradient:   "rgba(167,139,250,0.25)",
  paper:      "rgba(251,191,36,0.15)",
};

/* ─── 3D Gallery Card ─────────────────────────────────────── */
function GalleryCard3D({ card, index, onLike }: { card: GalleryCard; index: number; onLike: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);
  const brightness = useTransform(y, [-0.5, 0.5], [1.05, 0.95]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const badge = THEME_BADGE[card.themeName];
  const glow = THEME_GLOW[card.themeName];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, rotateX: -12, scale: 0.93 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      transition={{ delay: index * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
      className="group relative rounded-2xl overflow-hidden cursor-default"
    >
      {/* Glow behind card */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"
        style={{ background: `radial-gradient(ellipse, ${glow} 0%, transparent 70%)` }}
      />

      {/* Card body */}
      <div className="relative rounded-2xl overflow-hidden border border-white/8 group-hover:border-white/20 transition-all duration-300 shadow-3d-md group-hover:shadow-3d-lg"
        style={{ background: "rgba(7,8,26,0.85)", backdropFilter: "blur(16px)" }}>
        {/* Preview area */}
        <div
          className="w-full h-48 relative overflow-hidden"
          style={{ background: THEME_PREVIEW_BG[card.themeName] }}
        >
          {/* Animated scan line for cyberpunk */}
          {card.themeName === "cyberpunk" && (
            <div
              className="absolute inset-x-0 h-px bg-cyan-400/30"
              style={{ animation: "scan-line 4s linear infinite" }}
            />
          )}

          {/* Centered code icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-5xl opacity-10 select-none font-mono" style={{ color: badge.dot }}>
              {"</>"}
            </div>
          </div>

          {/* Dot grid overlay */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `radial-gradient(circle, ${badge.dot} 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Hover overlay with link */}
          <Link
            href={`/${card.user.username}`}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <ExternalLink size={18} className="text-white" />
            </div>
            <span className="text-white text-xs font-medium">View profile</span>
          </Link>
        </div>

        {/* Card info */}
        <div className="p-4" style={{ transform: "translateZ(10px)" }}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="absolute inset-0 rounded-full ring-1 ring-violet-400/0 group-hover:ring-violet-400/40 transition-all duration-300 blur-sm" />
                <Image
                  src={card.user.avatarUrl}
                  alt={card.user.username}
                  width={30}
                  height={30}
                  className="rounded-full ring-1 ring-white/10 relative z-10"
                  unoptimized
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-white leading-tight">
                  {card.user.name ?? card.user.username}
                </p>
                <p className="text-[10px] text-gray-500">
                  @{card.user.username}
                </p>
              </div>
            </div>

            {/* Theme badge */}
            <span className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-medium border ${badge.cls}`}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: badge.dot }} />
              {badge.label}
            </span>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="text-[10px] text-gray-600">{timeAgo(card.createdAt)}</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Eye size={11} className="text-gray-600" />
                {formatNumber(card.viewCount)}
              </span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={(e) => { e.preventDefault(); onLike(card.id); }}
                className={`flex items-center gap-1.5 transition-colors duration-200 ${
                  card.isLiked ? "text-pink-400" : "hover:text-pink-400"
                }`}
              >
                <Heart
                  size={11}
                  fill={card.isLiked ? "currentColor" : "none"}
                  className="transition-all"
                />
                {formatNumber(card.likeCount)}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Skeleton Card ──────────────────────────────────────── */
function SkeletonCard({ i }: { i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: i * 0.04 }}
      className="rounded-2xl overflow-hidden border border-white/8"
    >
      <div className="h-48 shimmer" style={{ background: "rgba(255,255,255,0.03)" }} />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
          <div className="space-y-1.5">
            <div className="w-24 h-2.5 rounded bg-white/5 animate-pulse" />
            <div className="w-16 h-2 rounded bg-white/3 animate-pulse" />
          </div>
        </div>
        <div className="w-full h-1 rounded bg-white/3 animate-pulse" />
      </div>
    </motion.div>
  );
}

/* ─── Gallery Page ────────────────────────────────────────── */
export default function GalleryPage() {
  const { data: session } = useSession();
  const [cards, setCards] = useState<GalleryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [themeFilter, setThemeFilter] = useState<ThemeName | "all">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page) });
        if (themeFilter !== "all") params.set("theme", themeFilter);
        if (search) params.set("search", search);
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
  }, [page, themeFilter, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

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
    <div className="min-h-screen bg-[#05060f] text-white pt-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Orbs */}
        <div className="absolute -top-80 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px] orb-violet orb" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[100px] orb-blue orb" style={{ animationDelay: "8s" }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.04] blur-[100px] orb-pink orb" style={{ animationDelay: "4s" }} />

        {/* 3D perspective grid floor */}
        <div
          className="absolute bottom-0 inset-x-0 h-[50%]"
          style={{
            backgroundImage: "linear-gradient(rgba(139,92,246,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            transform: "perspective(500px) rotateX(55deg) translateY(30%)",
            transformOrigin: "50% 100%",
            maskImage: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)",
          }}
        />

        {/* Flat subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating CSS shapes */}
        <div className="absolute top-[15%] left-[5%] w-4 h-4 border border-violet-500/30 rotate-45 float-1" />
        <div className="absolute top-[40%] left-[3%] w-2.5 h-2.5 border border-sky-500/30 rounded-full float-2" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[20%] right-[4%] w-3 h-3 border border-pink-500/25 rotate-45 float-3" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[55%] right-[6%] w-4 h-4 border border-violet-500/20 float-1" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/8 text-violet-400 text-xs font-medium">
              <Sparkles size={11} />
              Community
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-pink-500/20 bg-pink-500/8 text-pink-400 text-xs font-medium">
              <TrendingUp size={11} />
              Trending
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
            Community{" "}
            <span className="gradient-text-blue-violet">Gallery</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Explore developer cards from the community. Get inspired. Share yours.
          </p>
        </motion.div>

        {/* Search */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.6 }}
          className="flex items-center gap-2 mb-5"
        >
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by username or name…"
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/40 focus:bg-white/8 transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2.5 rounded-xl bg-violet-600/80 hover:bg-violet-600 text-white text-sm font-medium transition-colors"
          >
            Search
          </motion.button>
        </motion.form>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="flex items-center gap-2 mb-10 flex-wrap"
        >
          <span className="flex items-center gap-1.5 text-xs text-gray-600 mr-1">
            <Filter size={12} />
            Filter
          </span>
          <FilterButton
            active={themeFilter === "all"}
            onClick={() => { setThemeFilter("all"); setPage(1); }}
            label="All themes"
          />
          {themeList.map((theme) => (
            <FilterButton
              key={theme.name}
              active={themeFilter === theme.name}
              onClick={() => { setThemeFilter(theme.name); setPage(1); }}
              label={theme.displayName}
              dot={THEME_BADGE[theme.name]?.dot}
            />
          ))}
        </motion.div>

        {/* Active search tag */}
        {search && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-5 -mt-6"
          >
            <span className="text-xs text-gray-500">Results for</span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300 text-xs">
              &ldquo;{search}&rdquo;
              <button onClick={clearSearch} className="hover:text-white transition-colors"><X size={10} /></button>
            </span>
          </motion.div>
        )}

        {/* Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} i={i} />)}
            </motion.div>
          ) : cards.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-2xl bg-violet-500/20 blur-xl" />
                <div className="relative w-20 h-20 rounded-2xl glass-card flex items-center justify-center border border-violet-500/20">
                  <Eye size={28} className="text-violet-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">No cards yet</h3>
              <p className="text-gray-500 text-sm mb-8 max-w-xs">
                Be the first to share your developer card to the community!
              </p>
              <Link
                href="/dashboard"
                className="relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">Create your card</span>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {cards.map((card, i) => (
                <GalleryCard3D key={card.id} card={card} index={i} onLike={toggleLike} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-3 mt-14"
          >
            <PaginationButton
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              label="← Previous"
            />
            <div className="flex items-center gap-1.5">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                    p === page
                      ? "bg-violet-600 text-white"
                      : "text-gray-500 hover:text-white hover:bg-white/8 border border-white/8"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <PaginationButton
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              label="Next →"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label, dot }: {
  active: boolean; onClick: () => void; label: string; dot?: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
        active
          ? "bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-lg shadow-violet-500/10"
          : "bg-white/4 text-gray-400 border border-white/8 hover:border-white/20 hover:text-gray-200 hover:bg-white/8"
      }`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />}
      {label}
    </motion.button>
  );
}

function PaginationButton({ onClick, disabled, label }: { onClick: () => void; disabled: boolean; label: string }) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 rounded-xl border border-white/10 bg-white/4 text-sm text-gray-400 hover:text-white hover:border-white/25 hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
    >
      {label}
    </motion.button>
  );
}
