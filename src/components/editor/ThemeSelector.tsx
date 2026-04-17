"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Pipette, RotateCcw } from "lucide-react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { themeList } from "@/lib/themes";
import { useCardStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { ThemeName } from "@/types";

type ColorKey = "primary" | "accent" | "background";
const COLOR_KEYS: { key: ColorKey; label: string }[] = [
  { key: "primary",    label: "Primary" },
  { key: "accent",     label: "Accent" },
  { key: "background", label: "Background" },
];

const THEME_PREVIEWS: Record<ThemeName, { bg: string; accent: string; text: string }> = {
  minimalist: { bg: "#ffffff", accent: "#0a0a0a", text: "#6b7280" },
  cyberpunk: { bg: "#0a0e27", accent: "#00ffff", text: "#ff006e" },
  vintage: { bg: "#0d1117", accent: "#39ff14", text: "#2ea043" },
  gradient: { bg: "#0f0c29", accent: "#a78bfa", text: "#60a5fa" },
  paper: { bg: "#fdf6e3", accent: "#c0392b", text: "#7c5b47" },
};

export function ThemeSelector() {
  const { config, setTheme, setConfig } = useCardStore();
  const [openPicker, setOpenPicker] = useState<ColorKey | null>(null);

  const currentColors = {
    primary:    (config.customColors.primary    ?? THEME_PREVIEWS[config.theme].accent),
    accent:     (config.customColors.accent     ?? THEME_PREVIEWS[config.theme].text),
    background: (config.customColors.background ?? THEME_PREVIEWS[config.theme].bg),
  };

  const handleColorChange = (key: ColorKey, value: string) => {
    setConfig({ customColors: { ...config.customColors, [key]: value } });
  };

  const resetColors = () => {
    setConfig({ customColors: {} });
  };

  const hasCustomColors = Object.keys(config.customColors).length > 0;

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
              <div
                className="w-12 h-8 rounded-lg shrink-0 relative overflow-hidden border border-white/10"
                style={{ backgroundColor: preview.bg }}
              >
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: preview.accent }} />
                <div className="absolute top-1.5 left-1.5 right-1.5 flex flex-col gap-0.5">
                  <div className="h-1 w-4/5 rounded-sm" style={{ backgroundColor: preview.accent, opacity: 0.8 }} />
                  <div className="h-0.5 w-3/5 rounded-sm" style={{ backgroundColor: preview.text, opacity: 0.5 }} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{theme.displayName}</p>
                <p className="text-[10px] text-gray-400 truncate mt-0.5">{theme.description}</p>
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

      {/* Color customization */}
      <div className="pt-1">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase tracking-wider">
            <Pipette size={10} className="text-violet-400" />
            Customize Colors
          </span>
          {hasCustomColors && (
            <motion.button
              onClick={resetColors}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 text-[9px] text-gray-600 hover:text-gray-300 transition-colors"
            >
              <RotateCcw size={9} />
              Reset
            </motion.button>
          )}
        </div>

        <div className="flex gap-2">
          {COLOR_KEYS.map(({ key, label }) => (
            <div key={key} className="flex-1">
              <button
                onClick={() => setOpenPicker(openPicker === key ? null : key)}
                className={cn(
                  "w-full flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all",
                  openPicker === key
                    ? "border-violet-500/50 bg-violet-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                )}
              >
                <div
                  className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: currentColors[key] }}
                />
                <span className="text-[9px] text-gray-500">{label}</span>
              </button>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {openPicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-2 p-3 rounded-xl border border-white/10 bg-white/3 space-y-2">
                <HexColorPicker
                  color={currentColors[openPicker]}
                  onChange={(v) => handleColorChange(openPicker, v)}
                  style={{ width: "100%", height: "120px" }}
                />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-600 font-mono">#</span>
                  <HexColorInput
                    color={currentColors[openPicker]}
                    onChange={(v) => handleColorChange(openPicker, v)}
                    prefixed
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
