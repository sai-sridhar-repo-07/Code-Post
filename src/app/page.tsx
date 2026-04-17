"use client";

import dynamic from "next/dynamic";
import { motion, useMotionValue, useSpring, useTransform, useScroll, useMotionTemplate } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Zap, GitBranch, Share2, Palette, Download, Users,
  ArrowRight, Star, Flame, GitPullRequest, GitCommit,
  Code2, Globe, Award, ChevronRight, Sparkles,
} from "lucide-react";
import { getMockGitHubData } from "@/lib/github";
import { CardCanvas } from "@/components/card/CardCanvas";
import type { CardConfig } from "@/types";

const Scene3D = dynamic(
  () => import("@/components/three/Scene3D").then((m) => m.Scene3D),
  { ssr: false }
);

const BASE_LAYOUT = {
  size: "instagram-square" as const, width: 1080, height: 1080,
  orientation: "portrait" as const, scale: 1,
};
const BASE_COMPONENTS = {
  header: true, heatmap: true, stats: true, techStack: true,
  topProjects: false, badges: false, quote: false, qrCode: false,
};
const DEMO_CONFIGS: CardConfig[] = [
  { theme: "cyberpunk",  customColors: {}, enabledComponents: BASE_COMPONENTS, layout: BASE_LAYOUT, quote: "Code is poetry.", showWatermark: true },
  { theme: "gradient",   customColors: {}, enabledComponents: BASE_COMPONENTS, layout: BASE_LAYOUT, quote: "Code is poetry.", showWatermark: true },
  { theme: "minimalist", customColors: {}, enabledComponents: BASE_COMPONENTS, layout: BASE_LAYOUT, quote: "Code is poetry.", showWatermark: true },
];

const FEATURES = [
  { icon: GitBranch, title: "GitHub Sync",      desc: "Auto-syncs commits, PRs, stars, streaks and languages.", color: "#38bdf8" },
  { icon: Palette,   title: "5 Themes",          desc: "Cyberpunk, Gradient, Minimalist, Vintage, Paper.",       color: "#818cf8" },
  { icon: Download,  title: "Export Anywhere",   desc: "PNG, JPEG, PDF — sized for every platform.",             color: "#c084fc" },
  { icon: Share2,    title: "One-Click Share",   desc: "Direct share to Twitter & LinkedIn.",                    color: "#38bdf8" },
  { icon: Users,     title: "Community Gallery", desc: "Browse trending cards. Share yours.",                    color: "#818cf8" },
  { icon: Zap,       title: "Real-time Preview", desc: "Every edit reflected instantly. Zero lag.",              color: "#c084fc" },
];

/* ── Magnetic CTA button ─────────────────────────────────────── */
function CTAButton({ onClick, children, variant = "primary", disabled }: {
  onClick?: () => void; children: React.ReactNode;
  variant?: "primary" | "outline"; disabled?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 250, damping: 18 });
  const sy = useSpring(my, { stiffness: 250, damping: 18 });
  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.22);
    my.set((e.clientY - r.top - r.height / 2) * 0.22);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  if (variant === "outline") {
    return (
      <motion.button ref={ref} onClick={onClick} onMouseMove={onMove} onMouseLeave={onLeave}
        style={{ x: sx, y: sy }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
        className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-semibold text-white/70 hover:text-white border border-white/15 hover:border-white/30 transition-colors"
      >{children}</motion.button>
    );
  }
  return (
    <motion.button ref={ref} onClick={onClick} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ x: sx, y: sy }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
      disabled={disabled}
      className="relative flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold text-white overflow-hidden group disabled:opacity-50"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600" />
      <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      <span className="absolute inset-x-0 top-0 h-1/2 bg-white/10 rounded-t-2xl" />
      <span className="relative z-10 flex items-center gap-2.5">{children}</span>
    </motion.button>
  );
}

/* ── 3D demo card with full tilt ─────────────────────────────── */
function DemoCard({ config, data, floatClass, delay }: {
  config: CardConfig; data: ReturnType<typeof getMockGitHubData>;
  floatClass: string; delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0); const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 200, damping: 25 });
  const y = useSpring(rawY, { stiffness: 200, damping: 25 });
  const rotateX = useTransform(y, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-12, 12]);

  const scale = 0.22;
  const w = config.layout.width * scale;
  const h = config.layout.height * scale;
  const glowCol =
    config.theme === "cyberpunk" ? "59,130,246" :
    config.theme === "gradient"  ? "139,92,246" : "148,163,184";

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { rawX.set(0); rawY.set(0); };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, rotateY: 20, rotateX: -5 }}
      animate={{ opacity: 1, y: 0, rotateY: 0, rotateX: 0 }}
      transition={{ delay, duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 900, width: w, height: h }}
      className={`${floatClass} relative cursor-pointer`}
    >
      <div
        className="absolute -inset-6 rounded-3xl blur-3xl opacity-60"
        style={{ background: `radial-gradient(ellipse,rgba(${glowCol},.45) 0%,transparent 70%)` }}
      />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 z-10 pointer-events-none" />
      {/* Specular top sheen */}
      <div
        className="absolute inset-x-0 top-0 h-1/4 rounded-t-2xl z-20 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)" }}
      />
      <div
        className="relative rounded-2xl overflow-hidden z-[15]"
        style={{ width: w, height: h, boxShadow: `0 30px 80px rgba(0,0,0,.75), 0 0 0 1px rgba(255,255,255,.07)` }}
      >
        <CardCanvas data={data} config={config} previewScale={scale} />
      </div>
    </motion.div>
  );
}

/* ── Tilt card (feature + how-it-works) ─────────────────────── */
function TiltCard({ children, className, style }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -12, y: ((e.clientX - r.left) / r.width - 0.5) * 12 });
  };
  const onLeave = () => setTilt({ x: 0, y: 0 });
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{
        ...style,
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 ? "transform .5s ease" : "transform .1s ease",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}

/* ── Floating 3D CSS shape ───────────────────────────────────── */
function FloatShape({ size, color, top, left, right, delay, shape = "cube" }: {
  size: number; color: string; top?: string; left?: string; right?: string;
  delay?: number; shape?: "cube" | "diamond" | "ring";
}) {
  const style: React.CSSProperties = {
    position: "absolute",
    top, left, right,
    width: size, height: size,
    border: `1px solid ${color}`,
    background: `${color}10`,
    animationDelay: `${delay ?? 0}s`,
    pointerEvents: "none",
    borderRadius: shape === "ring" ? "50%" : shape === "diamond" ? "2px" : "4px",
    transform: shape === "diamond" ? "rotate(45deg)" : undefined,
  };
  return (
    <div className="float-1" style={style} />
  );
}

/* ── Spotlight cursor glow ───────────────────────────────────── */
function CursorGlow() {
  const mx = useMotionValue(-200); const my = useMotionValue(-200);
  const bg = useMotionTemplate`radial-gradient(400px circle at ${mx}px ${my}px, rgba(139,92,246,0.06), transparent 70%)`;
  useEffect(() => {
    const move = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);
  return (
    <motion.div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: bg }}
    />
  );
}

/* ── Section parallax wrapper ────────────────────────────────── */
function ParallaxSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  return (
    <section ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </section>
  );
}

/* ── Landing page ────────────────────────────────────────────── */
export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mockData, setMockData] = useState<ReturnType<typeof getMockGitHubData> | null>(null);

  useEffect(() => { setMockData(getMockGitHubData()); }, []);
  useEffect(() => { if (session) router.push("/dashboard"); }, [session, router]);

  return (
    <div className="min-h-screen bg-[#030508] text-white overflow-x-hidden">
      <CursorGlow />

      {/* ═══ HERO ══════════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Three.js canvas */}
        <div className="absolute inset-0 z-0">
          <Scene3D />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 20%, #030508 80%)" }}
          />
        </div>

        {/* CSS floating shapes */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <FloatShape size={18} color="rgba(139,92,246,.5)" top="18%" left="12%" delay={0} shape="cube" />
          <FloatShape size={10} color="rgba(56,189,248,.5)"  top="72%" left="8%"  delay={2} shape="diamond" />
          <FloatShape size={22} color="rgba(192,132,252,.4)" top="30%" right="9%" delay={1} shape="ring" />
          <FloatShape size={14} color="rgba(56,189,248,.4)"  top="60%" right="11%" delay={3} shape="cube" />
          <FloatShape size={8}  color="rgba(236,72,153,.4)"  top="50%" left="15%" delay={5} shape="diamond" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-6 pt-24 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 px-5 py-2 rounded-full glass mb-10 animate-[badge-float_4s_ease-in-out_infinite]"
          >
            <Sparkles size={13} className="text-violet-400" />
            <span className="text-xs font-semibold text-violet-300">Turn your GitHub into a visual story</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.95] max-w-5xl"
          >
            <span className="block text-white">Your GitHub</span>
            <span className="block grad">beautifully</span>
            <span className="block text-white">displayed.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-8 max-w-xl text-lg text-white/45 leading-relaxed"
          >
            CodePost transforms your open-source activity into{" "}
            <span className="text-white/80">stunning, shareable developer cards</span>{" "}
            for social media, portfolios and personal branding.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-12"
          >
            <CTAButton onClick={() => signIn("github")} disabled={status === "loading"}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Create your card — free
            </CTAButton>
            <CTAButton variant="outline">
              <Link href="/gallery" className="flex items-center gap-2">
                Browse gallery <ChevronRight size={14} />
              </Link>
            </CTAButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs text-white/25"
          >
            {[
              { icon: GitCommit,      t: "Connects to GitHub" },
              { icon: Star,           t: "Free to use" },
              { icon: Flame,          t: "5 themes" },
              { icon: GitPullRequest, t: "No credit card" },
            ].map(({ icon: Icon, t }) => (
              <span key={t} className="flex items-center gap-1.5"><Icon size={12} /> {t}</span>
            ))}
          </motion.div>
        </div>

        {/* 3D demo cards */}
        {mockData && (
          <div className="relative z-10 flex items-end gap-8 px-6 pb-16 mt-4">
            {DEMO_CONFIGS.map((cfg, i) => (
              <DemoCard
                key={cfg.theme} config={cfg} data={mockData}
                delay={0.45 + i * 0.12}
                floatClass={i === 0 ? "relative float-1" : i === 1 ? "relative float-2 -mt-8" : "relative float-3"}
              />
            ))}
          </div>
        )}

        <div
          className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-10"
          style={{ background: "linear-gradient(to top, #030508, transparent)" }}
        />
      </section>

      {/* ═══ HOW IT WORKS ═══════════════════════════════════════ */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* 3D perspective grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="grid-3d opacity-30" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] blur-[120px] orb-violet orb" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sky-400 text-xs font-semibold mb-6">
              <Globe size={12} /> How it works
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              From GitHub to gallery{" "}
              <span className="grad">in seconds</span>
            </h2>
            <p className="text-white/40 text-lg max-w-md mx-auto">Three steps. Zero friction. Infinite style.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "01", icon: GitBranch, title: "Connect GitHub", desc: "Sign in with GitHub OAuth. We read your public contributions — no write access, ever.", c: "#38bdf8" },
              { n: "02", icon: Palette,   title: "Design your card", desc: "Pick a theme, toggle components, choose size. Instant preview, zero lag.", c: "#818cf8" },
              { n: "03", icon: Share2,    title: "Share & inspire",  desc: "Export PNG, JPEG or PDF. Share to Twitter, LinkedIn or your portfolio.", c: "#c084fc" },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TiltCard
                    className="glass-3d relative p-8 rounded-2xl text-center group cursor-default h-full"
                    style={{ boxShadow: `0 0 0 1px ${s.c}15, 0 20px 60px rgba(0,0,0,.4)` }}
                  >
                    {/* Animated top-line glow */}
                    <div
                      className="absolute top-0 inset-x-0 h-px rounded-t-2xl opacity-50 group-hover:opacity-100 transition-opacity"
                      style={{ background: `linear-gradient(90deg,transparent,${s.c},transparent)` }}
                    />
                    <span className="absolute top-4 right-4 text-[10px] font-mono text-white/10 tracking-widest">{s.n}</span>
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: `${s.c}18`,
                        border: `1px solid ${s.c}35`,
                        boxShadow: `0 0 30px ${s.c}25, inset 0 1px 0 ${s.c}20`,
                        transform: "translateZ(20px)",
                      }}
                    >
                      <Icon size={26} style={{ color: s.c }} />
                    </div>
                    <h3 className="font-bold text-white text-lg mb-3" style={{ transform: "translateZ(12px)" }}>{s.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed" style={{ transform: "translateZ(8px)" }}>{s.desc}</p>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>

          {/* Connector line */}
          <div className="hidden md:flex items-center justify-between absolute top-[calc(50%+60px)] left-[calc(33%+40px)] right-[calc(33%+40px)] pointer-events-none">
            <div className="flex-1 h-px bg-gradient-to-r from-sky-500/30 via-violet-500/30 to-purple-500/30" />
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[100px] orb-blue orb" />
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-violet-400 text-xs font-semibold mb-6">
              <Award size={12} /> Features
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Everything you <span className="grad">need</span>
            </h2>
            <p className="text-white/40 text-lg max-w-md mx-auto">Built for developers who care about their online presence.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TiltCard
                    className="glass-3d group relative p-6 rounded-2xl cursor-default h-full"
                    style={{ boxShadow: `0 0 0 1px ${feat.color}12, 0 20px 50px rgba(0,0,0,.35)` }}
                  >
                    <div
                      className="absolute top-0 inset-x-0 h-px rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: `linear-gradient(90deg,transparent,${feat.color},transparent)` }}
                    />
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                      style={{
                        background: `${feat.color}18`,
                        border: `1px solid ${feat.color}30`,
                        boxShadow: `0 0 20px ${feat.color}20`,
                        transform: "translateZ(20px)",
                      }}
                    >
                      <Icon size={20} style={{ color: feat.color }} />
                    </div>
                    <h3 className="font-bold text-white mb-2 text-[15px]" style={{ transform: "translateZ(12px)" }}>
                      {feat.title}
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed" style={{ transform: "translateZ(8px)" }}>
                      {feat.desc}
                    </p>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ══════════════════════════════════════════ */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* 3D perspective grid floor */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="grid-3d opacity-20" />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,.08) 0%, transparent 100%)" }}
          />
        </div>

        {/* Floating shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <FloatShape size={20} color="rgba(139,92,246,.4)" top="20%" left="10%" delay={0} shape="ring" />
          <FloatShape size={12} color="rgba(56,189,248,.4)"  top="70%" left="15%" delay={2} shape="cube" />
          <FloatShape size={16} color="rgba(192,132,252,.4)" top="25%" right="10%" delay={1} shape="diamond" />
          <FloatShape size={24} color="rgba(236,72,153,.3)"  top="65%" right="12%" delay={3} shape="ring" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto text-center relative z-10"
        >
          <div className="relative inline-flex items-center justify-center mb-12">
            <div className="absolute w-36 h-36 rounded-full border border-violet-500/15 spin-cw" />
            <div className="absolute w-24 h-24 rounded-full border border-blue-500/15 spin-ccw" />
            <div className="absolute w-48 h-48 rounded-full border border-pink-500/10 spin-cw" style={{ animationDuration: "30s" }} />
            <TiltCard>
              <div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center"
                style={{ boxShadow: "0 0 50px rgba(139,92,246,.6), 0 0 20px rgba(139,92,246,.4)" }}
              >
                <Code2 size={28} className="text-white" />
              </div>
            </TiltCard>
          </div>

          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-[1.05]">
            Ready to showcase<br />
            <span className="grad">your work?</span>
          </h2>
          <p className="text-white/40 text-lg mb-12">Join developers building their visual presence on CodePost. Takes 30 seconds.</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButton onClick={() => signIn("github")}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Get started with GitHub
            </CTAButton>
            <Link href="/gallery" className="flex items-center gap-2 text-white/40 hover:text-white text-sm font-medium transition-colors group">
              View the gallery <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-10">
            {["Free forever", "No credit card", "5 themes", "Instant export", "Social sharing"].map((t) => (
              <span key={t} className="px-3 py-1 rounded-full text-[11px] text-white/25 border border-white/8">{t}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Zap size={13} className="text-white" />
            </div>
            <span className="font-bold text-sm">CodePost</span>
          </div>
          <p className="text-white/20 text-xs">Built with Next.js · © 2026 CodePost</p>
          <div className="flex gap-4 text-xs text-white/25">
            <Link href="/gallery" className="hover:text-white/60 transition-colors">Gallery</Link>
            <Link href="/dashboard" className="hover:text-white/60 transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
