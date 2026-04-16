"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Zap, GitBranch, Share2, Palette, Download, Users,
  ArrowRight, Star, Flame, GitPullRequest, GitCommit,
  ChevronRight, Sparkles, Code2, Globe, Award,
} from "lucide-react";
import { getMockGitHubData } from "@/lib/github";
import { CardCanvas } from "@/components/card/CardCanvas";
import type { CardConfig } from "@/types";

/* ─── Config ─────────────────────────────────────────────── */
const BASE_LAYOUT = {
  size: "instagram-square" as const,
  width: 1080,
  height: 1080,
  orientation: "portrait" as const,
  scale: 1,
};

const BASE_COMPONENTS = {
  header: true, heatmap: true, stats: true,
  techStack: true, topProjects: false, badges: false, quote: false, qrCode: false,
};

const DEMO_CONFIGS: CardConfig[] = [
  { theme: "minimalist", customColors: {}, enabledComponents: BASE_COMPONENTS, layout: BASE_LAYOUT, quote: "Code is poetry.", showWatermark: true },
  { theme: "cyberpunk",  customColors: {}, enabledComponents: BASE_COMPONENTS, layout: BASE_LAYOUT, quote: "Code is poetry.", showWatermark: true },
  { theme: "gradient",   customColors: {}, enabledComponents: BASE_COMPONENTS, layout: BASE_LAYOUT, quote: "Code is poetry.", showWatermark: true },
];

const FEATURES = [
  { icon: GitBranch,  title: "GitHub Integration",   desc: "Auto-syncs commits, PRs, stars, streaks, and language usage in real time.",  accent: "blue" },
  { icon: Palette,    title: "5 Stunning Themes",     desc: "Minimalist, Cyberpunk, Vintage Terminal, Gradient Modern, Paper Texture.",    accent: "violet" },
  { icon: Download,   title: "Export Anywhere",        desc: "PNG, JPEG, PDF — sized perfectly for Instagram, Twitter, LinkedIn.",          accent: "pink" },
  { icon: Share2,     title: "One-Click Share",        desc: "Share directly to Twitter & LinkedIn with pre-filled caption text.",          accent: "blue" },
  { icon: Users,      title: "Community Gallery",      desc: "Browse trending developer cards. Get inspired. Share yours.",                 accent: "violet" },
  { icon: Zap,        title: "Real-time Preview",      desc: "Every change reflected instantly. No wait, no reload, no friction.",         accent: "pink" },
];

const STATS = [
  { value: "5",    label: "Themes",            icon: Palette },
  { value: "3",    label: "Export formats",    icon: Download },
  { value: "∞",    label: "Customization",     icon: Code2 },
  { value: "Free", label: "Always",            icon: Star },
];

const ACCENT_CLASSES: Record<string, { icon: string; glow: string; border: string; bg: string }> = {
  blue:   { icon: "text-sky-400",    glow: "shadow-sky-500/20",   border: "border-sky-500/20",   bg: "bg-sky-500/10" },
  violet: { icon: "text-violet-400", glow: "shadow-violet-500/20",border: "border-violet-500/20",bg: "bg-violet-500/10" },
  pink:   { icon: "text-pink-400",   glow: "shadow-pink-500/20",  border: "border-pink-500/20",  bg: "bg-pink-500/10" },
};

const mockData = getMockGitHubData();

/* ─── Floating Particle ──────────────────────────────────── */
function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={style}
    />
  );
}

/* ─── Particle Field ─────────────────────────────────────── */
function ParticleField() {
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 8,
    duration: Math.random() * 12 + 8,
    opacity: Math.random() * 0.4 + 0.1,
    color: ["#0ea5e9", "#8b5cf6", "#ec4899", "#10b981"][Math.floor(Math.random() * 4)],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <Particle
          key={p.id}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animation: `particle-drift ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Aurora Orbs ────────────────────────────────────────── */
function AuroraOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-80 -left-80 w-[900px] h-[900px] rounded-full opacity-[0.07] blur-[120px] animate-pulse-glow"
        style={{ background: "radial-gradient(circle, #0ea5e9 0%, #8b5cf6 50%, transparent 70%)" }} />
      <div className="absolute -bottom-80 -right-80 w-[800px] h-[800px] rounded-full opacity-[0.06] blur-[120px] animate-pulse-glow"
        style={{ background: "radial-gradient(circle, #ec4899 0%, #8b5cf6 50%, transparent 70%)", animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] blur-[100px]"
        style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }} />
    </div>
  );
}

/* ─── Grid Background ────────────────────────────────────── */
function GridBackground() {
  return (
    <div
      className="absolute inset-0 opacity-[0.025] pointer-events-none"
      style={{
        backgroundImage: "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />
  );
}

/* ─── 3D Demo Card ───────────────────────────────────────── */
function DemoCard3D({ config, delay, floatClass, rotateY = 0 }: {
  config: CardConfig; delay: number; floatClass: string; rotateY?: number;
}) {
  const scale = 0.24;
  const w = config.layout.width * scale;
  const h = config.layout.height * scale;

  const glowColor =
    config.theme === "cyberpunk" ? "rgba(14,165,233,0.5)" :
    config.theme === "gradient"  ? "rgba(139,92,246,0.5)" :
                                   "rgba(255,255,255,0.2)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateY: 15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ delay, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={`relative shrink-0 ${floatClass}`}
      style={{ width: w, height: h, perspective: 800 }}
    >
      {/* Glow halo */}
      <div
        className="absolute -inset-4 rounded-3xl blur-2xl opacity-60"
        style={{ background: `radial-gradient(ellipse, ${glowColor} 0%, transparent 70%)` }}
      />
      {/* Glass ring */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 z-10 pointer-events-none" />
      {/* Card */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/60 z-20">
        <CardCanvas data={mockData} config={config} previewScale={scale} />
      </div>
    </motion.div>
  );
}

/* ─── Magnetic Button ────────────────────────────────────── */
function MagneticButton({ children, onClick, variant = "primary", disabled }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  disabled?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.25);
    y.set((e.clientY - cy) * 0.25);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  if (variant === "ghost") {
    return (
      <motion.button
        ref={ref}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: springX, y: springY }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="group flex items-center gap-2.5 px-5 py-3 rounded-xl text-gray-300 hover:text-white text-sm font-medium transition-colors border border-white/10 hover:border-white/25 hover:bg-white/5"
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      disabled={disabled}
      className="relative group flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm text-white disabled:opacity-50 overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 transition-all duration-500" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* Shimmer */}
      <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100" />
      <span className="relative z-10 flex items-center gap-2.5">{children}</span>
    </motion.button>
  );
}

/* ─── Feature Card ────────────────────────────────────────── */
function FeatureCard({ feat, index }: { feat: (typeof FEATURES)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const accent = ACCENT_CLASSES[feat.accent];
  const Icon = feat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative p-6 rounded-2xl glass-card cursor-default transition-all duration-300 hover:border-white/15"
    >
      {/* Hover gradient */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${feat.accent === "blue" ? "rgba(14,165,233,0.06)" : feat.accent === "violet" ? "rgba(139,92,246,0.06)" : "rgba(236,72,153,0.06)"} 0%, transparent 70%)` }}
      />

      {/* Icon */}
      <div
        className={`relative z-10 w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${accent.bg} ${accent.border} border shadow-lg ${accent.glow}`}
        style={{ transform: "translateZ(20px)" }}
      >
        <Icon size={20} className={accent.icon} />
      </div>

      <h3 className="relative z-10 font-semibold text-white mb-2 text-[15px]" style={{ transform: "translateZ(15px)" }}>
        {feat.title}
      </h3>
      <p className="relative z-10 text-gray-400 text-sm leading-relaxed" style={{ transform: "translateZ(10px)" }}>
        {feat.desc}
      </p>
    </motion.div>
  );
}

/* ─── Landing Page ───────────────────────────────────────── */
export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  return (
    <div className="min-h-screen bg-[#05060f] text-white overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 overflow-hidden">
        <AuroraOrbs />
        <GridBackground />
        {mounted && <ParticleField />}

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center gap-2.5 px-5 py-2 rounded-full mb-10 overflow-hidden"
        >
          <div className="absolute inset-0 rounded-full border border-violet-500/30 bg-violet-500/8" />
          <div className="absolute inset-0 rounded-full animate-shimmer" />
          <Sparkles size={13} className="text-violet-400 relative z-10" />
          <span className="text-violet-300 text-xs font-medium relative z-10">
            Turn your GitHub into a visual story
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-center leading-[1.05] max-w-5xl tracking-tight"
        >
          Your{" "}
          <span className="gradient-text-blue-violet">GitHub story</span>
          ,{" "}
          <br className="hidden md:block" />
          beautifully told
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-7 text-gray-400 text-lg md:text-xl text-center max-w-2xl leading-relaxed"
        >
          CodePost transforms your open-source contributions into{" "}
          <span className="text-gray-200">stunning, shareable developer cards</span>{" "}
          — built for social media, portfolios, and personal branding.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-12"
        >
          <MagneticButton onClick={() => signIn("github")} disabled={status === "loading"}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Create your card — free
          </MagneticButton>

          <MagneticButton variant="ghost">
            <Link href="/gallery" className="flex items-center gap-2">
              Browse gallery
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </MagneticButton>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-600"
        >
          {[
            { icon: GitCommit, label: "Connects to GitHub" },
            { icon: Star,       label: "Free to use" },
            { icon: Flame,      label: "5 themes" },
            { icon: GitPullRequest, label: "No credit card" },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-2">
              <Icon size={13} className="text-gray-500" />
              {label}
            </span>
          ))}
        </motion.div>

        {/* 3D Demo Cards */}
        <div className="mt-24 flex items-center gap-6 md:gap-10">
          {DEMO_CONFIGS.map((cfg, i) => (
            <DemoCard3D
              key={cfg.theme}
              config={cfg}
              delay={0.4 + i * 0.12}
              floatClass={i === 0 ? "animate-float" : i === 1 ? "animate-float-slow" : "animate-float-reverse"}
              rotateY={i === 0 ? -5 : i === 2 ? 5 : 0}
            />
          ))}
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none"
          style={{ background: "linear-gradient(to top, #05060f, transparent)" }}
        />
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/10 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex flex-col items-center text-center p-6 rounded-2xl glass-card hover:border-white/15 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                    <Icon size={18} className="text-violet-400" />
                  </div>
                  <span className="text-3xl font-bold gradient-text-blue-violet mb-1">{stat.value}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section className="py-28 px-6 border-t border-white/5 relative overflow-hidden">
        <AuroraOrbs />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-500/20 bg-sky-500/8 text-sky-400 text-xs font-medium mb-6">
              <Globe size={12} />
              How it works
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-5">
              From{" "}
              <span className="gradient-text-blue">GitHub to gallery</span>
              {" "}in seconds
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Three steps. Zero friction. Infinite style.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-[calc(33%-20px)] right-[calc(33%-20px)] h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

            {[
              { step: "01", icon: GitBranch, title: "Connect GitHub", desc: "Sign in with GitHub OAuth. We read your public contributions — no write access, ever.", color: "blue" },
              { step: "02", icon: Palette,   title: "Design your card", desc: "Pick a theme, toggle components, choose your export size. Real-time preview, zero lag.", color: "violet" },
              { step: "03", icon: Share2,    title: "Share & inspire",  desc: "Export as PNG, JPEG, or PDF. Share to Twitter, LinkedIn, or your portfolio.", color: "pink" },
            ].map((item, i) => {
              const Icon = item.icon;
              const a = ACCENT_CLASSES[item.color];
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="relative p-8 rounded-2xl glass-card text-center group hover:border-white/20 transition-all duration-300"
                >
                  {/* Step number */}
                  <div className="absolute top-5 right-5 text-[10px] font-mono text-gray-700 font-bold tracking-widest">
                    {item.step}
                  </div>
                  <div className={`w-14 h-14 rounded-2xl ${a.bg} ${a.border} border flex items-center justify-center mx-auto mb-6 shadow-xl ${a.glow} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} className={a.icon} />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="py-28 px-6 border-t border-white/5 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/8 text-violet-400 text-xs font-medium mb-6">
              <Award size={12} />
              Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-5">
              Everything you{" "}
              <span className="gradient-text-blue-violet">need</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Built for developers who care about their online presence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feat, i) => (
              <FeatureCard key={feat.title} feat={feat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────── */}
      <section className="py-32 px-6 border-t border-white/5 relative overflow-hidden">
        <AuroraOrbs />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 100%)" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          {/* Decorative ring */}
          <div className="relative inline-flex items-center justify-center mb-10">
            <div className="w-24 h-24 rounded-full border border-violet-500/20 animate-spin-slow absolute" />
            <div className="w-16 h-16 rounded-full border border-blue-500/20 animate-spin-slow absolute" style={{ animationDirection: "reverse", animationDuration: "15s" }} />
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-xl glow-violet relative z-10">
              <Code2 size={22} className="text-white" />
            </div>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Ready to showcase{" "}
            <br />
            <span className="gradient-text-blue-violet">your work?</span>
          </h2>
          <p className="text-gray-400 mb-12 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
            Join developers building their visual presence on CodePost. It takes 30 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton onClick={() => signIn("github")}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Get started with GitHub
            </MagneticButton>
            <Link
              href="/gallery"
              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors group"
            >
              View the gallery
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
            {["Free forever", "No credit card", "5 themes", "Instant export", "Social sharing"].map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs text-gray-500 border border-white/8 bg-white/3">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center glow-violet">
              <Zap size={13} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">CodePost</span>
          </div>
          <p className="text-gray-600 text-xs">
            Built with Next.js · © 2026 CodePost · All rights reserved
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <Link href="/gallery" className="hover:text-gray-400 transition-colors">Gallery</Link>
            <Link href="/dashboard" className="hover:text-gray-400 transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
