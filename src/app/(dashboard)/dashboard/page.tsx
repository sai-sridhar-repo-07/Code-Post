"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 blur-lg opacity-50 animate-pulse-glow" />
          <div className="absolute -inset-3 rounded-3xl border border-violet-500/20 animate-spin-slow" />
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
function StatChip({ label, value, icon: Icon, accent }: { label: string; value: string; icon: React.ElementType; accent: string }) {
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
      if (res.ok) {
        const data = await res.json();
        setGitHubData(data);
      }
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
  const cardWidth = config.layout.width * previewScale;
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
            <StatChip label="Stars"   value={formatNumber(githubData.stats.totalStars)}   icon={Star}      accent="text-yellow-400" />
            <div className="w-px h-6 bg-white/8" />
            <StatChip label="PRs"     value={formatNumber(githubData.stats.totalPRs)}     icon={GitPullRequest} accent="text-violet-400" />
            <div className="w-px h-6 bg-white/8" />
            <StatChip label="Streak"  value={`${githubData.stats.currentStreak}d`}        icon={Flame}     accent="text-orange-400" />
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
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.04) 0%, #05060f 70%)" }}
        >
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(139,92,246,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.6) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Corner crosshairs */}
          {[
            "top-8 left-8 border-t border-l",
            "top-8 right-8 border-t border-r",
            "bottom-8 left-8 border-b border-l",
            "bottom-8 right-8 border-b border-r",
          ].map((cls) => (
            <div key={cls} className={`absolute w-5 h-5 ${cls} border-white/10`} />
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
            style={{ width: cardWidth, height: cardHeight }}
          >
            {/* Glow beneath card */}
            <div
              className="absolute inset-0 rounded-3xl opacity-25 blur-3xl"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)", transform: "scale(0.9) translateY(8%)" }}
            />
            {/* Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/70 ring-1 ring-white/10">
              <CardCanvas
                data={githubData}
                config={config}
                previewScale={previewScale}
                id="card-canvas"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Side panel ────────────────────────────────── */}
      <AnimatePresence initial={false}>
        <motion.div
          animate={{ width: panelOpen ? 292 : 48 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col border-l border-white/8 bg-[#07081a] overflow-hidden"
        >
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
                      activeTab === tab.id
                        ? "text-violet-300"
                        : "text-gray-600 hover:text-gray-400"
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
