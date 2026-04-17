"use client";

import type { GitHubStats, Theme } from "@/types";

interface BadgeDef {
  id: string;
  label: string;
  icon: string;
  color: string;
  check: (s: GitHubStats) => boolean;
}

const BADGE_DEFS: BadgeDef[] = [
  { id: "commit-machine",  label: "1K Commits",   icon: "⚡", color: "#f59e0b", check: (s) => s.totalCommits >= 1000 },
  { id: "star-collector",  label: "Star Collector",icon: "⭐", color: "#eab308", check: (s) => s.totalStars >= 100 },
  { id: "pr-master",       label: "PR Master",     icon: "🔀", color: "#8b5cf6", check: (s) => s.totalPRs >= 50 },
  { id: "streak-lord",     label: "Streak Lord",   icon: "🔥", color: "#ef4444", check: (s) => s.currentStreak >= 30 },
  { id: "prolific",        label: "Prolific",      icon: "📦", color: "#10b981", check: (s) => s.totalRepos >= 20 },
  { id: "popular",         label: "Popular",       icon: "👥", color: "#ec4899", check: (s) => s.followers >= 500 },
  { id: "veteran",         label: "Veteran",       icon: "🏆", color: "#6366f1", check: (s) => s.longestStreak >= 60 },
  { id: "contributor",     label: "500 Commits",   icon: "💻", color: "#06b6d4", check: (s) => s.totalCommits >= 500 },
];

export function computeBadges(stats: GitHubStats): BadgeDef[] {
  return BADGE_DEFS.filter((b) => b.check(stats));
}

interface Props {
  stats: GitHubStats;
  theme: Theme;
  compact?: boolean;
}

export function Badges({ stats, theme, compact = false }: Props) {
  const earned = computeBadges(stats);
  if (earned.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {earned.map((badge) => (
        <div
          key={badge.id}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold"
          style={{
            backgroundColor: `${badge.color}22`,
            border: `1px solid ${badge.color}55`,
            color: compact ? badge.color : theme.colors.text,
          }}
        >
          <span style={{ fontSize: compact ? "9px" : "10px" }}>{badge.icon}</span>
          {!compact && (
            <span style={{ color: badge.color, fontFamily: theme.fonts.mono }}>{badge.label}</span>
          )}
          {compact && (
            <span style={{ color: badge.color, fontFamily: theme.fonts.mono }}>{badge.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}
