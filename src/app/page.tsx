"use client";

import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  GitBranch,
  Share2,
  Palette,
  Download,
  Users,
  ArrowRight,
  Star,
  Flame,
  GitPullRequest,
  GitCommit,
} from "lucide-react";
import { getMockGitHubData } from "@/lib/github";
import { CardCanvas } from "@/components/card/CardCanvas";
import type { CardConfig } from "@/types";

const BASE_LAYOUT = {
  size: "instagram-square" as const,
  width: 1080,
  height: 1080,
  orientation: "portrait" as const,
  scale: 1,
};

const BASE_COMPONENTS = {
  header: true,
  heatmap: true,
  stats: true,
  techStack: true,
  topProjects: false,
  badges: false,
  quote: false,
  qrCode: false,
};

const DEMO_CONFIGS: CardConfig[] = [
  {
    theme: "minimalist",
    customColors: {},
    enabledComponents: BASE_COMPONENTS,
    layout: BASE_LAYOUT,
    quote: "Code is poetry.",
    showWatermark: true,
  },
  {
    theme: "cyberpunk",
    customColors: {},
    enabledComponents: BASE_COMPONENTS,
    layout: BASE_LAYOUT,
    quote: "Code is poetry.",
    showWatermark: true,
  },
  {
    theme: "gradient",
    customColors: {},
    enabledComponents: BASE_COMPONENTS,
    layout: BASE_LAYOUT,
    quote: "Code is poetry.",
    showWatermark: true,
  },
];

const FEATURES = [
  {
    icon: <GitBranch size={20} />,
    title: "GitHub Integration",
    desc: "Auto-syncs your commits, PRs, stars, contribution streaks, and language usage.",
  },
  {
    icon: <Palette size={20} />,
    title: "5 Stunning Themes",
    desc: "Minimalist, Cyberpunk, Vintage Terminal, Gradient Modern, and Paper Texture.",
  },
  {
    icon: <Download size={20} />,
    title: "Export Anywhere",
    desc: "PNG, JPEG, PDF — sized for Instagram, Twitter, LinkedIn, or GitHub README.",
  },
  {
    icon: <Share2 size={20} />,
    title: "One-Click Share",
    desc: "Share directly to Twitter and LinkedIn with pre-filled text.",
  },
  {
    icon: <Users size={20} />,
    title: "Community Gallery",
    desc: "Browse trending developer cards. Get inspired. Share yours.",
  },
  {
    icon: <Zap size={20} />,
    title: "Real-time Preview",
    desc: "Every change reflected instantly. No wait, no reload.",
  },
];

const mockData = getMockGitHubData();

function DemoCard({ config, rotate = 0 }: { config: CardConfig; rotate?: number }) {
  const scale = 0.22;
  const w = config.layout.width * scale;
  const h = config.layout.height * scale;

  const glowColor =
    config.theme === "cyberpunk"
      ? "from-cyan-500 to-pink-500"
      : config.theme === "gradient"
      ? "from-violet-500 to-blue-500"
      : "from-gray-300 to-gray-400";

  return (
    <div
      className="relative shrink-0"
      style={{ width: w, height: h, transform: `rotate(${rotate}deg)` }}
    >
      <div
        className={`absolute inset-0 rounded-2xl blur-xl opacity-30 bg-gradient-to-br ${glowColor}`}
      />
      <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
        <CardCanvas data={mockData} config={config} previewScale={scale} />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  return (
    <div className="min-h-screen bg-[#080a14] text-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16 overflow-hidden">
        {/* BG blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl bg-blue-600" />
          <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl bg-purple-600" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-8"
        >
          <Zap size={12} />
          Turn your GitHub into a visual story
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-center leading-tight max-w-4xl"
        >
          Your{" "}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            GitHub contributions
          </span>
          , beautifully displayed
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-gray-400 text-lg text-center max-w-2xl leading-relaxed"
        >
          CodePost transforms your open-source activity into stunning, shareable
          developer cards — perfect for social media, portfolios, and personal
          branding.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4 mt-10"
        >
          <motion.button
            onClick={() => signIn("github")}
            disabled={status === "loading"}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-all shadow-lg shadow-white/10 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Create your card — free
          </motion.button>

          <Link
            href="/gallery"
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors"
          >
            Browse gallery
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-5 mt-10 text-sm text-gray-500"
        >
          {[
            { icon: <GitCommit size={13} />, label: "Connects to GitHub" },
            { icon: <Star size={13} />, label: "Free to use" },
            { icon: <Flame size={13} />, label: "5 themes" },
            { icon: <GitPullRequest size={13} />, label: "No credit card" },
          ].map(({ icon, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              {icon}
              {label}
            </span>
          ))}
        </motion.div>

        {/* Demo cards */}
        <div className="mt-20 flex items-center gap-8">
          {DEMO_CONFIGS.map((cfg, i) => (
            <motion.div
              key={cfg.theme}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.7 }}
              style={{ marginBottom: i === 1 ? -32 : 0 }}
            >
              <DemoCard
                config={cfg}
                rotate={i === 0 ? -4 : i === 2 ? 4 : 0}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Everything you need</h2>
            <p className="text-gray-400 text-lg">
              Built for developers who care about their online presence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07] transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-blue-400 mb-4">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{feat.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to showcase your work?</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join developers building their visual presence on CodePost.
          </p>
          <motion.button
            onClick={() => signIn("github")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-base hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Get started with GitHub
          </motion.button>
        </motion.div>
      </section>

      <footer className="py-8 px-6 border-t border-white/5 text-center text-gray-600 text-xs">
        <p>Built with Next.js · © 2026 CodePost</p>
      </footer>
    </div>
  );
}
