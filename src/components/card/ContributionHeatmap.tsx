"use client";

import type { ContributionCalendar, Theme } from "@/types";

interface Props {
  calendar: ContributionCalendar;
  theme: Theme;
  compact?: boolean;
}

export function ContributionHeatmap({ calendar, theme, compact = false }: Props) {
  const { colors } = theme;
  const cellSize = compact ? 8 : 10;
  const cellGap = compact ? 2 : 3;
  const weeks = calendar.weeks.slice(-53);

  function getColor(count: number): string {
    if (count === 0) return colors.heatmap.level0;
    if (count < 4) return colors.heatmap.level1;
    if (count < 8) return colors.heatmap.level2;
    if (count < 12) return colors.heatmap.level3;
    return colors.heatmap.level4;
  }

  const svgWidth = weeks.length * (cellSize + cellGap);
  const svgHeight = 7 * (cellSize + cellGap);

  return (
    <div className="flex flex-col gap-1">
      <svg
        width={svgWidth}
        height={svgHeight}
        style={{ maxWidth: "100%" }}
        aria-label={`${calendar.totalContributions} contributions in the last year`}
      >
        {weeks.map((week, weekIndex) =>
          week.contributionDays.map((day, dayIndex) => (
            <rect
              key={`${weekIndex}-${dayIndex}`}
              x={weekIndex * (cellSize + cellGap)}
              y={dayIndex * (cellSize + cellGap)}
              width={cellSize}
              height={cellSize}
              rx={2}
              fill={getColor(day.contributionCount)}
              opacity={0.9}
            >
              <title>
                {day.contributionCount} contributions on {day.date}
              </title>
            </rect>
          ))
        )}
      </svg>
    </div>
  );
}
