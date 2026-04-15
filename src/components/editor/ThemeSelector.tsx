"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { themeList } from "@/lib/themes";
import { useCardStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { ThemeName } from "@/types";

const THEME_PREVIEWS: Record<ThemeName, { bg: string; accent: string; text: string }> = {
  minimalist: { bg: "#ffffff", accent: "#0a0a0a", text: "#6b7280" },
  cyberpunk: { bg: "#0a0e27", accent: "#00ffff", text: "#ff006e" },
  vintage: { bg: "#0d1117", accent: "#39ff14", text: "#2ea043" },
  gradient: { bg: "#0f0c29", accent: "#a78bfa", text: "#60a5fa" },
  paper: { bg: "#fdf6e3", accent: "#c0392b", text: "#7c5b47" },
};

export function ThemeSelector() {
  const { config, setTheme } = useCardStore();

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Theme
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {themeList.map((theme) => {
          const preview = THEME_PREVIEWS[theme.name];
          const isSelected = config.theme === theme.name;

          return (
            <motion.button
              key={theme.name}
              onClick={() => setTheme(theme.name)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                "relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                isSelected
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              )}
            >
              {/* Mini preview */}
              <div
                className="w-12 h-8 rounded-lg shrink-0 relative overflow-hidden border border-white/10"
                style={{ backgroundColor: preview.bg }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{ backgroundColor: preview.accent }}
                />
                <div className="absolute top-1.5 left-1.5 right-1.5 flex flex-col gap-0.5">
                  <div className="h-1 w-4/5 rounded-sm" style={{ backgroundColor: preview.accent, opacity: 0.8 }} />
                  <div className="h-0.5 w-3/5 rounded-sm" style={{ backgroundColor: preview.text, opacity: 0.5 }} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {theme.displayName}
                </p>
                <p className="text-[10px] text-gray-400 truncate mt-0.5">
                  {theme.description}
                </p>
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-white" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
