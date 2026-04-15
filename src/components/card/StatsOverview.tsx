"use client";

import { GitCommit, GitPullRequest, Star, Flame, Zap } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { GitHubStats, Theme } from "@/types";

interface Props {
  stats: GitHubStats;
  theme: Theme;
}

interface StatItem {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

export function StatsOverview({ stats, theme }: Props) {
  const { colors, fonts } = theme;

  const items: StatItem[] = [
    {
      label: "Commits",
      value: formatNumber(stats.totalCommits),
      icon: <GitCommit size={14} />,
    },
    {
      label: "PRs Merged",
      value: formatNumber(stats.totalPRs),
      icon: <GitPullRequest size={14} />,
    },
    {
      label: "Stars Earned",
      value: formatNumber(stats.totalStars),
      icon: <Star size={14} />,
    },
    {
      label: "Cur. Streak",
      value: `${stats.currentStreak}d`,
      icon: <Flame size={14} />,
      highlight: stats.currentStreak > 7,
    },
    {
      label: "Best Streak",
      value: `${stats.longestStreak}d`,
      icon: <Zap size={14} />,
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center justify-center p-2 rounded-lg text-center"
          style={{
            backgroundColor: colors.cardBackground,
            border: `1px solid ${colors.border}`,
          }}
        >
          <span
            className="mb-1"
            style={{
              color: item.highlight ? colors.secondary : colors.textSecondary,
            }}
          >
            {item.icon}
          </span>
          <span
            className="text-base font-bold leading-none"
            style={{
              color: item.highlight ? colors.secondary : colors.primary,
              fontFamily: fonts.mono,
            }}
          >
            {item.value}
          </span>
          <span
            className="text-[9px] mt-0.5 leading-none"
            style={{ color: colors.textSecondary }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
