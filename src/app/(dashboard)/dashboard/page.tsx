"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Palette, Layers, Move, Download, Info, ChevronLeft, ChevronRight } from "lucide-react";
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
  { id: "theme", label: "Theme", icon: <Palette size={14} /> },
  { id: "components", label: "Modules", icon: <Layers size={14} /> },
  { id: "layout", label: "Layout", icon: <Move size={14} /> },
  { id: "export", label: "Export", icon: <Download size={14} /> },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { githubData, config, isLoading, isSyncing, setGitHubData, setIsLoading, setIsSyncing } = useCardStore();
  const [activeTab, setActiveTab] = useState<PanelTab>("theme");
  const [panelOpen, setPanelOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.35);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Calculate preview scale based on container
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 64;
        const containerHeight = containerRef.current.clientHeight - 64;
        const scaleX = containerWidth / config.layout.width;
        const scaleY = containerHeight / config.layout.height;
        setPreviewScale(Math.min(scaleX, scaleY, 0.6));
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
      // Load mock data immediately for preview, then try real data
      setGitHubData(getMockGitHubData());
      setIsLoading(false);
      fetchStats();
    }
  }, [status, githubData, fetchStats, setGitHubData, setIsLoading]);

  if (status === "loading" || (status === "authenticated" && !githubData)) {
    return (
      <div className="min-h-screen bg-[#080a14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading your GitHub data...</p>
        </div>
      </div>
    );
  }

  if (!githubData) return null;

  const displaySize = EXPORT_SIZES[config.layout.size];
  const cardWidth = config.layout.width * previewScale;
  const cardHeight = config.layout.height * previewScale;

  return (
    <div className="min-h-screen bg-[#080a14] flex">
      {/* Main canvas area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top stats bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5">
          <div className="flex items-center gap-6">
            {[
              { label: "Commits", value: formatNumber(githubData.stats.totalCommits) },
              { label: "Stars", value: formatNumber(githubData.stats.totalStars) },
              { label: "PRs", value: formatNumber(githubData.stats.totalPRs) },
              { label: "Streak", value: `${githubData.stats.currentStreak}d 🔥` },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</span>
                <span className="text-sm font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Info size={12} />
              {displaySize.label} · {config.layout.width}×{config.layout.height}
            </div>
            <button
              onClick={fetchStats}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-50"
            >
              <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} />
              {isSyncing ? "Syncing..." : "Sync GitHub"}
            </button>
          </div>
        </div>

        {/* Card preview */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center bg-[#0a0c18] relative overflow-hidden"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.05) 0%, transparent 70%)",
          }}
        >
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
            style={{ width: cardWidth, height: cardHeight }}
          >
            <div
              className="absolute inset-0 rounded-2xl opacity-20 blur-3xl"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
            />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
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

      {/* Side panel */}
      <AnimatePresence initial={false}>
        <motion.div
          animate={{ width: panelOpen ? 280 : 48 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="relative flex border-l border-white/10 bg-[#0d1020] overflow-hidden"
        >
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="absolute top-3 -left-3 z-10 w-6 h-6 rounded-full bg-[#0d1020] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            {panelOpen ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>

          {panelOpen && (
            <div className="flex flex-col w-full">
              {/* Tab bar */}
              <div className="flex border-b border-white/10">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-all ${
                      activeTab === tab.id
                        ? "text-blue-400 border-b-2 border-blue-500"
                        : "text-gray-500 hover:text-gray-300 border-b-2 border-transparent"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    {activeTab === "theme" && <ThemeSelector />}
                    {activeTab === "components" && <ComponentToggle />}
                    {activeTab === "layout" && <LayoutControls />}
                    {activeTab === "export" && <ExportPanel />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10">
                <p className="text-[10px] text-gray-600 text-center">
                  Last synced: {new Date(githubData.lastSynced).toLocaleTimeString()}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
