"use client";

import { motion } from "framer-motion";
import {
  User,
  ActivitySquare,
  BarChart2,
  Code2,
  FolderGit2,
  Award,
  Quote,
  QrCode,
} from "lucide-react";
import { useCardStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { EnabledComponents } from "@/types";

const COMPONENTS: {
  key: keyof EnabledComponents;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  { key: "header", label: "Profile", icon: <User size={14} />, description: "Avatar, name, bio" },
  { key: "heatmap", label: "Heatmap", icon: <ActivitySquare size={14} />, description: "Contribution graph" },
  { key: "stats", label: "Stats", icon: <BarChart2 size={14} />, description: "Commits, PRs, stars" },
  { key: "techStack", label: "Languages", icon: <Code2 size={14} />, description: "Tech stack breakdown" },
  { key: "topProjects", label: "Projects", icon: <FolderGit2 size={14} />, description: "Top repositories" },
  { key: "badges", label: "Badges", icon: <Award size={14} />, description: "Achievement badges" },
  { key: "quote", label: "Quote", icon: <Quote size={14} />, description: "Developer mantra" },
  { key: "qrCode", label: "QR Code", icon: <QrCode size={14} />, description: "Link to profile" },
];

export function ComponentToggle() {
  const { config, toggleComponent } = useCardStore();

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Modules
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {COMPONENTS.map(({ key, label, icon, description }) => {
          const enabled = config.enabledComponents[key];
          return (
            <motion.button
              key={key}
              onClick={() => toggleComponent(key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "flex flex-col items-start gap-1 p-2.5 rounded-xl border text-left transition-all",
                enabled
                  ? "border-blue-500/50 bg-blue-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20 opacity-60"
              )}
            >
              <div className={cn("transition-colors", enabled ? "text-blue-400" : "text-gray-500")}>
                {icon}
              </div>
              <div>
                <p className={cn("text-xs font-medium", enabled ? "text-white" : "text-gray-400")}>
                  {label}
                </p>
                <p className="text-[9px] text-gray-500 mt-0.5">{description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
