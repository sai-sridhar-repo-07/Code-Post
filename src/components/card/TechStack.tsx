"use client";

import type { LanguageStat, Theme } from "@/types";

interface Props {
  languages: LanguageStat[];
  theme: Theme;
}

export function TechStack({ languages, theme }: Props) {
  const { colors, fonts } = theme;
  const displayed = languages.slice(0, 5);

  return (
    <div className="flex flex-col gap-2">
      {displayed.map((lang) => (
        <div key={lang.name} className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: lang.color }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: colors.text, fontFamily: fonts.body }}
              >
                {lang.name}
              </span>
            </div>
            <span
              className="text-xs tabular-nums"
              style={{ color: colors.textSecondary, fontFamily: fonts.mono }}
            >
              {lang.percentage}%
            </span>
          </div>
          <div
            className="h-1.5 w-full rounded-full overflow-hidden"
            style={{ backgroundColor: colors.border }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${lang.percentage}%`,
                backgroundColor: lang.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
