"use client";

import { useCardStore } from "@/lib/store";
import { EXPORT_SIZES } from "@/lib/themes";
import type { ExportSize } from "@/types";

const SIZE_OPTIONS: { value: ExportSize; label: string; dims: string }[] = [
  { value: "instagram-square", label: "Instagram Square", dims: "1080×1080" },
  { value: "instagram-story", label: "Instagram Story", dims: "1080×1920" },
  { value: "twitter-card", label: "Twitter Card", dims: "1200×630" },
  { value: "linkedin-banner", label: "LinkedIn Banner", dims: "1584×396" },
  { value: "github-readme", label: "GitHub README", dims: "1200×400" },
];

export function LayoutControls() {
  const { config, setLayout } = useCardStore();

  const handleSizeChange = (size: ExportSize) => {
    const dims = EXPORT_SIZES[size];
    setLayout({ size, width: dims.width, height: dims.height });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Export Size
      </h3>
      <div className="flex flex-col gap-1.5">
        {SIZE_OPTIONS.map(({ value, label, dims }) => (
          <button
            key={value}
            onClick={() => handleSizeChange(value)}
            className={`flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all text-xs ${
              config.layout.size === value
                ? "border-blue-500 bg-blue-500/10 text-white"
                : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-gray-200"
            }`}
          >
            <span className="font-medium">{label}</span>
            <span className="text-[10px] opacity-70 font-mono">{dims}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
