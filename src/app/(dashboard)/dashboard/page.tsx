"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  RefreshCw, Palette, Layers, Move, Download, Info,
  ChevronLeft, ChevronRight, Zap, GitCommit, Star, GitPullRequest, Flame,
} from "lucide-react";
import { CardCanvas } from "@/components/card/CardCanvas";
import { ThemeSelector } from "@/components/editor/ThemeSelector";
import { ComponentToggle } from "@/components/editor/ComponentToggle";
import { LayoutControls } from "@/components/editor/LayoutControls";
import { ExportPanel } from "@/components/editor/ExportPanel";
import { useCardStore } from "@/lib/store";
import { getMockGitHubData } from "@/lib/github";
import { formatNumber } from "@/lib/utils";
import { EXPORT_SIZES } from "@/lib/themes";

type PanelTab = "theme" | "components" | "layout" | "export";

const TABS: { id: PanelTab; label: string; icon: React.ReactNode }[] = [
  { id: "theme",      label: "Theme",   icon: <Palette size={13} /> },
  { id: "components", label: "Modules", icon: <Layers size={13} /> },
  { id: "layout",     label: "Layout",  icon: <Move size={13} /> },
  { id: "export",     label: "Export",  icon: <Download size={13} /> },
];

/* ─── Loading Screen ─────────────────────────────────────── */
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#05060f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-xl">
            <Zap size={28} className="text-white" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 blur-lg opacity-50 animate-pulse" />
          <div className="absolute -inset-3 rounded-3xl border border-violet-500/20 spin-cw" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-white font-medium text-sm">Loading your GitHub data</p>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-violet-400"
                style={{ animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat Chip ──────────────────────────────────────────── */
function StatChip({ label, value, icon: Icon, accent }: {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent: string;
}) {
  return (
    <div className="flex flex-col group">
      <div className="flex items-center gap-1 mb-0.5">
        <Icon size={10} className={`${accent} opacity-70`} />
        <span className="text-[9px] text-gray-600 uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-xs font-bold text-white">{value}</span>
    </div>
  );
}

/* ─── 3D Tilt Card Wrapper ───────────────────────────────── */
function TiltWrapper({ children, width, height }: {
  children: React.ReactNode;
  width: number;
  height: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 180, damping: 22 });
  const y = useSpring(rawY, { stiffness: 180, damping: 22 });

  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);
  const brightness = useTransform(y, [-0.5, 0.5], [1.08, 0.94]);
  const glowX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { rawX.set(0); rawY.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width,
        height,
        rotateX,
        rotateY,
        filter: useTransform(brightness, (b) => `brightness(${b})`),
        transformStyle: "preserve-3d",
        perspective: 900,
      }}
      className="relative cursor-pointer"
    >
      {/* Dynamic spotlight glow */}
      <motion.div
        className="absolute -inset-8 rounded-3xl pointer-events-none z-0 opacity-40"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) =>
              `radial-gradient(ellipse 60% 60% at ${gx} ${gy}, rgba(139,92,246,0.5), rgba(56,189,248,0.3), transparent)`
          ),
          filter: "blur(20px)",
        }}
      />
      {children}
    </motion.div>
  );
}

/* ─── Floating 3D background shapes ─────────────────────── */
function BackgroundShapes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Perspective grid floor */}
      <div
        className="absolute bottom-0 inset-x-0 h-[60%]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(139,92,246,0.02) 100%)",
          backgroundImage:
            "linear-gradient(rgba(139,92,246,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          transform: "perspective(600px) rotateX(55deg) translateY(20%)",
          transformOrigin: "50% 100%",
          maskImage: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 70%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 70%)",
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full opacity-[0.04] blur-[80px] orb-violet orb" />
      <div className="absolute bottom-1/3 right-1/5 w-80 h-80 rounded-full opacity-[0.03] blur-[100px] orb-blue orb" style={{ animationDelay: "7s" }} />
      <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full opacity-[0.03] blur-[60px] orb-pink orb" style={{ animationDelay: "3s" }} />

      {/* Corner crosshairs */}
      {[
        "top-8 left-8 border-t border-l",
        "top-8 right-8 border-t border-r",
        "bottom-8 left-8 border-b border-l",
        "bottom-8 right-8 border-b border-r",
      ].map((cls) => (
        <div key={cls} className={`absolute w-6 h-6 ${cls} border-violet-500/20`} />
      ))}

      {/* Floating mini shapes */}
      {[
        { top: "15%", left: "8%",  size: 10, delay: 0 },
        { top: "70%", left: "5%",  size: 6,  delay: 2 },
        { top: "25%", right: "7%", size: 8,  delay: 1 },
        { top: "60%", right: "6%", size: 12, delay: 4 },
      ].map((s, i) => (
        <div
          key={i}
          className="absolute rounded-sm border border-violet-500/20 float-1"
          style={{
            top: s.top,
            left: "left" in s ? s.left : undefined,
            right: "right" in s ? s.right : undefined,
            width: s.size,
            height: s.size,
            transform: `rotate(45deg)`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Dashboard ──────────────────────────────────────────── */
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { githubData, config, isSyncing, setGitHubData, setIsLoading, setIsSyncing } = useCardStore();
  const [activeTab, setActiveTab] = useState<PanelTab>("theme");
  const [panelOpen, setPanelOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.35);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 80;
        const containerHeight = containerRef.current.clientHeight - 80;
        const scaleX = containerWidth / config.layout.width;
        const scaleY = containerHeight / config.layout.height;
        setPreviewScale(Math.min(scaleX, scaleY, 0.55));
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [config.layout.width, config.layout.height, panelOpen]);

  const fetchStats = useCallback(async () => {
    if (!session?.user?.accessToken) return;
    setIsSyncing(true);
    try {
      const res = await fetch("/api/github/stats");
      if (res.ok) setGitHubData(await res.json());
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [session, setGitHubData, setIsSyncing]);

  useEffect(() => {
    if (status === "authenticated" && !githubData) {
      setIsLoading(true);
      setGitHubData(getMockGitHubData());
      setIsLoading(false);
      fetchStats();
    }
  }, [status, githubData, fetchStats, setGitHubData, setIsLoading]);

  if (status === "loading" || (status === "authenticated" && !githubData)) {
    return <LoadingScreen />;
  }
  if (!githubData) return null;

  const displaySize = EXPORT_SIZES[config.layout.size];
  const cardWidth  = config.layout.width  * previewScale;
  const cardHeight = config.layout.height * previewScale;

  return (
    <div className="min-h-screen bg-[#05060f] flex overflow-hidden">

      {/* ── Main canvas ───────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/8 bg-[#07081a]/80 backdrop-blur-xl">
          <div className="flex items-center gap-5">
            <StatChip label="Commits" value={formatNumber(githubData.stats.totalCommits)} icon={GitCommit} accent="text-sky-400" />
            <div className="w-px h-6 bg-white/8" />
            <StatChip label="Stars"   value={formatNumber(githubData.stats.totalStars)}   icon={Star}           accent="text-yellow-400" />
            <div className="w-px h-6 bg-white/8" />
            <StatChip label="PRs"     value={formatNumber(githubData.stats.totalPRs)}     icon={GitPullRequest} accent="text-violet-400" />
            <div className="w-px h-6 bg-white/8" />
            <StatChip label="Streak"  value={`${githubData.stats.currentStreak}d`}        icon={Flame}          accent="text-orange-400" />
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-600 bg-white/4 px-3 py-1.5 rounded-lg border border-white/8">
              <Info size={10} />
              <span>{displaySize.label}</span>
              <span className="text-gray-700">·</span>
              <span>{config.layout.width}×{config.layout.height}</span>
            </div>
            <motion.button
              onClick={fetchStats}
              disabled={isSyncing}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-gray-400 hover:text-white hover:border-violet-500/30 hover:bg-violet-500/8 transition-all disabled:opacity-50"
            >
              <RefreshCw size={11} className={isSyncing ? "animate-spin" : ""} />
              {isSyncing ? "Syncing…" : "Sync GitHub"}
            </motion.button>
          </div>
        </div>

        {/* Canvas area */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center relative overflow-hidden"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.05) 0%, #05060f 70%)" }}
        >
          <BackgroundShapes />

          {/* Radial vignette */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, transparent 30%, rgba(5,6,15,0.5) 100%)" }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            <TiltWrapper width={cardWidth} height={cardHeight}>
              {/* Multi-layer glow beneath */}
              <div
                className="absolute inset-0 rounded-3xl blur-3xl"
                style={{
                  background: "linear-gradient(135deg, rgba(59,130,246,0.4), rgba(139,92,246,0.4), rgba(236,72,153,0.3))",
                  transform: "scale(0.88) translateY(10%)",
                }}
              />
              <div
                className="absolute inset-0 rounded-3xl blur-xl opacity-60"
                style={{
                  background: "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))",
                  transform: "scale(0.95) translateY(4%)",
                }}
              />
              {/* Card surface */}
              <div
                className="relative rounded-2xl overflow-hidden shadow-3d-lg ring-1 ring-white/10"
                style={{ transform: "translateZ(0)" }}
              >
                <CardCanvas
                  data={githubData}
                  config={config}
                  previewScale={previewScale}
                  id="card-canvas"
                />
              </div>
              {/* Top specular shine */}
              <div
                className="absolute inset-x-0 top-0 h-1/3 rounded-t-2xl pointer-events-none"
                style={{
                  background: "linear-gradient(to bottom, rgba(255,255,255,0.06), transparent)",
                }}
              />
            </TiltWrapper>
          </motion.div>
        </div>
      </div>

      {/* ── Side panel ────────────────────────────────── */}
      <AnimatePresence initial={false}>
        <motion.div
          animate={{ width: panelOpen ? 292 : 48 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col border-l border-white/8 overflow-hidden"
          style={{ background: "linear-gradient(180deg, #07081a 0%, #050613 100%)" }}
        >
          {/* Subtle gradient top edge */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

          {/* Toggle button */}
          <motion.button
            onClick={() => setPanelOpen(!panelOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 -left-3.5 z-20 w-7 h-7 rounded-full bg-[#0d0f22] border border-white/15 flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/40 transition-all shadow-lg"
          >
            {panelOpen ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </motion.button>

          {panelOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col h-full w-full"
            >
              {/* Tab bar */}
              <div className="flex border-b border-white/8 shrink-0">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex-1 flex flex-col items-center gap-1 py-3 text-[9px] font-semibold uppercase tracking-widest transition-all ${
                      activeTab === tab.id ? "text-violet-300" : "text-gray-600 hover:text-gray-400"
                    }`}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="tab-indicator"
                        className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500"
                      />
                    )}
                    <span className={activeTab === tab.id ? "text-violet-400" : "text-gray-600"}>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Panel content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    {activeTab === "theme"      && <ThemeSelector />}
                    {activeTab === "components" && <ComponentToggle />}
                    {activeTab === "layout"     && <LayoutControls />}
                    {activeTab === "export"     && <ExportPanel />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-white/8 shrink-0">
                <p className="text-[9px] text-gray-700 text-center font-mono">
                  Synced {new Date(githubData.lastSynced).toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
