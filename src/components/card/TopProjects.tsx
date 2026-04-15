"use client";

import { Star, GitFork, Circle } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { Repository, Theme } from "@/types";

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  Ruby: "#701516",
  Swift: "#ffac45",
  "C#": "#178600",
};

interface Props {
  repos: Repository[];
  theme: Theme;
  limit?: number;
}

export function TopProjects({ repos, theme, limit = 3 }: Props) {
  const { colors, fonts } = theme;
  const displayed = repos.slice(0, limit);

  return (
    <div className="flex flex-col gap-2">
      {displayed.map((repo) => (
        <div
          key={repo.id}
          className="p-2.5 rounded-lg"
          style={{
            backgroundColor: colors.cardBackground,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-semibold truncate"
                style={{ color: colors.primary, fontFamily: fonts.mono }}
              >
                {repo.name}
              </p>
              {repo.description && (
                <p
                  className="text-[10px] mt-0.5 line-clamp-1"
                  style={{ color: colors.textSecondary }}
                >
                  {repo.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className="flex items-center gap-0.5 text-[10px]"
                style={{ color: colors.textSecondary }}
              >
                <Star size={10} />
                {formatNumber(repo.stargazers_count)}
              </span>
              <span
                className="flex items-center gap-0.5 text-[10px]"
                style={{ color: colors.textSecondary }}
              >
                <GitFork size={10} />
                {formatNumber(repo.forks_count)}
              </span>
            </div>
          </div>
          {repo.language && (
            <div className="flex items-center gap-1 mt-1.5">
              <Circle
                size={8}
                fill={LANGUAGE_COLORS[repo.language] ?? "#8b949e"}
                color={LANGUAGE_COLORS[repo.language] ?? "#8b949e"}
              />
              <span
                className="text-[10px]"
                style={{ color: colors.textSecondary }}
              >
                {repo.language}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
