"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Heart, LayoutGrid } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const THEME_BG: Record<string, string> = {
  minimalist: "linear-gradient(135deg, #0f1117, #1a1d2e)",
  cyberpunk:  "linear-gradient(135deg, #050714, #0a0e27)",
  vintage:    "linear-gradient(135deg, #020b04, #071a07)",
  gradient:   "linear-gradient(135deg, #0f0c29, #1a0a3d)",
  paper:      "linear-gradient(135deg, #fdf6e3, #f0e8d0)",
};

const THEME_DOT: Record<string, string> = {
  minimalist: "#9ca3af",
  cyberpunk:  "#22d3ee",
  vintage:    "#4ade80",
  gradient:   "#a78bfa",
  paper:      "#fbbf24",
};

interface CardItem {
  id: string;
  title: string;
  themeName: string;
  viewCount: number;
  _count: { likes: number };
}

interface UserItem {
  username: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  createdAt: Date;
  cards: CardItem[];
}

function TiltCard3D({ card, index }: { card: CardItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50 });

  const dot = THEME_DOT[card.themeName] ?? "#9ca3af";

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    setTilt({ x: (ny - 0.5) * -14, y: (nx - 0.5) * 14 });
    setShine({ x: nx * 100, y: ny * 100 });
  };
  const onLeave = () => { setTilt({ x: 0, y: 0 }); setShine({ x: 50, y: 50 }); };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, rotateX: -10, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      transition={{ delay: index * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 ? "transform 0.5s ease, box-shadow 0.5s ease" : "transform 0.1s ease",
        transformStyle: "preserve-3d",
      }}
      className="group cursor-default"
    >
      <div
        className="rounded-2xl border border-white/8 group-hover:border-white/20 overflow-hidden transition-all duration-300"
        style={{
          background: "rgba(7,8,26,0.9)",
          backdropFilter: "blur(16px)",
          boxShadow: tilt.x !== 0
            ? "0 25px 60px rgba(0,0,0,0.7), 0 0 30px rgba(139,92,246,0.12)"
            : "0 8px 30px rgba(0,0,0,0.5)",
        }}
      >
        {/* Preview */}
        <div
          className="h-36 relative overflow-hidden"
          style={{ background: THEME_BG[card.themeName] ?? THEME_BG.minimalist }}
        >
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `radial-gradient(circle, ${dot} 1px, transparent 1px)`,
              backgroundSize: "18px 18px",
            }}
          />
          {/* Centered icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl opacity-10 select-none font-mono" style={{ color: dot }}>{"</>"}</span>
          </div>
          {/* Dynamic shine overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
            }}
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-xs font-medium px-3 py-1.5 rounded-lg bg-white/10 border border-white/15">
              {card.title}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3.5 flex items-center justify-between" style={{ transform: "translateZ(10px)" }}>
          <div>
            <p className="text-xs font-semibold text-white truncate max-w-[120px]">{card.title}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
              <p className="text-[10px] text-gray-500 capitalize">{card.themeName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-1"><Eye size={10} />{card.viewCount}</span>
            <span className="flex items-center gap-1"><Heart size={10} />{card._count.likes}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProfileCardGrid({ user }: { user: UserItem }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center"
          style={{ boxShadow: "0 0 20px rgba(139,92,246,0.2)" }}
        >
          <LayoutGrid size={15} className="text-violet-400" />
        </motion.div>
        <h2 className="text-lg font-bold text-white">Developer Cards</h2>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/6 text-gray-400 border border-white/8">
          {user.cards.length}
        </span>
      </div>

      {user.cards.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-white/8"
          style={{ background: "rgba(7,8,26,0.6)", backdropFilter: "blur(12px)" }}
        >
          <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4"
            style={{ boxShadow: "0 0 30px rgba(139,92,246,0.15)" }}>
            <LayoutGrid size={22} className="text-violet-400" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">No public cards yet</p>
          <p className="text-gray-600 text-xs">This developer hasn&apos;t shared any cards.</p>
        </motion.div>
      ) : (
        <div className="perspective-mid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.cards.map((card, i) => (
              <TiltCard3D key={card.id} card={card} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ProfileHeader({ user }: { user: UserItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-6 mb-14"
    >
      <div className="relative shrink-0">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 opacity-50 blur-xl scale-110 glow-anim" />
        <motion.div
          whileHover={{ scale: 1.05, rotateY: 8, rotateX: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <Image
            src={user.avatarUrl}
            alt={user.username}
            width={100}
            height={100}
            className="relative rounded-2xl ring-2 ring-violet-500/30 shadow-2xl"
            unoptimized
          />
        </motion.div>
      </div>

      <div className="flex-1 pt-1">
        <h1 className="text-3xl font-bold mb-1 text-white">{user.name ?? user.username}</h1>
        <p className="text-violet-400/80 text-sm font-medium mb-4">@{user.username}</p>
        {user.bio && (
          <p className="text-gray-300 text-sm mb-5 max-w-lg leading-relaxed">{user.bio}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
          <Link
            href={`https://github.com/${user.username}`}
            target="_blank"
            className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors"
          >
            View on GitHub →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
