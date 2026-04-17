"use client";

import { useMemo } from "react";
import { ProfileHeader } from "./ProfileHeader";
import { ContributionHeatmap } from "./ContributionHeatmap";
import { StatsOverview } from "./StatsOverview";
import { TechStack } from "./TechStack";
import { TopProjects } from "./TopProjects";
import { Badges } from "./Badges";
import { QRCodeCard } from "./QRCodeCard";
import { getTheme } from "@/lib/themes";
import type { GitHubData, CardConfig, Theme } from "@/types";

interface Props {
  data: GitHubData;
  config: CardConfig;
  previewScale?: number;
  id?: string;
}

function CyberpunkCard({ data, theme, config }: { data: GitHubData; theme: Theme; config: CardConfig }) {
  const { colors, fonts } = theme;
  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ padding: "24px" }}>
      {/* Scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.5) 2px, rgba(0,255,255,0.5) 4px)",
        }}
      />
      {/* Glowing border */}
      <div
        className="absolute inset-0 rounded-none pointer-events-none z-10"
        style={{ boxShadow: `inset 0 0 40px ${colors.primary}15, 0 0 60px ${colors.primary}10` }}
      />

      <div
        className="text-[10px] font-mono mb-3 opacity-60"
        style={{ color: colors.primary, fontFamily: fonts.mono }}
      >
        ▶ CODEPOST.DEV // DEVELOPER PROFILE
      </div>

      <div
        className="border-b mb-4 pb-4"
        style={{ borderColor: `${colors.primary}30` }}
      >
        {config.enabledComponents.header && <ProfileHeader user={data.user} theme={theme} />}
      </div>

      {config.enabledComponents.stats && (
        <div className="mb-4">
          <StatsOverview stats={data.stats} theme={theme} />
        </div>
      )}

      {config.enabledComponents.heatmap && (
        <div className="mb-4">
          <p className="text-[9px] mb-2 font-mono opacity-60" style={{ color: colors.primary }}>
            ▶ CONTRIBUTION MATRIX
          </p>
          <ContributionHeatmap calendar={data.contributionCalendar} theme={theme} compact />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 flex-1">
        {config.enabledComponents.techStack && data.languages.length > 0 && (
          <div>
            <p className="text-[9px] mb-2 font-mono opacity-60" style={{ color: colors.primary }}>
              ▶ TECH STACK
            </p>
            <TechStack languages={data.languages} theme={theme} />
          </div>
        )}
        {config.enabledComponents.topProjects && data.topRepos.length > 0 && (
          <div>
            <p className="text-[9px] mb-2 font-mono opacity-60" style={{ color: colors.primary }}>
              ▶ TOP REPOS
            </p>
            <TopProjects repos={data.topRepos} theme={theme} limit={2} />
          </div>
        )}
      </div>

      {config.enabledComponents.badges && (
        <div className="mt-3">
          <p className="text-[9px] mb-1.5 font-mono opacity-60" style={{ color: colors.primary }}>
            ▶ ACHIEVEMENTS
          </p>
          <Badges stats={data.stats} theme={theme} />
        </div>
      )}

      {config.enabledComponents.quote && (
        <div
          className="mt-4 p-3 text-center"
          style={{ border: `1px solid ${colors.primary}30` }}
        >
          <p className="text-xs italic" style={{ color: colors.primary, fontFamily: fonts.mono }}>
            &ldquo;{config.quote}&rdquo;
          </p>
        </div>
      )}

      {config.enabledComponents.qrCode && (
        <div className="mt-3 flex items-center gap-3">
          <QRCodeCard url={data.user.html_url} theme={theme} size={48} />
          <div>
            <p className="text-[9px] font-mono opacity-60" style={{ color: colors.primary }}>▶ GITHUB PROFILE</p>
            <p className="text-[10px] font-mono" style={{ color: colors.primary }}>{data.user.html_url.replace("https://", "")}</p>
          </div>
        </div>
      )}

      {config.showWatermark && (
        <p className="text-[8px] mt-3 text-center opacity-40 font-mono" style={{ color: colors.textSecondary }}>
          MADE WITH CODEPOST.DEV
        </p>
      )}
    </div>
  );
}

function MinimalistCard({ data, theme, config }: { data: GitHubData; theme: Theme; config: CardConfig }) {
  const { colors, fonts } = theme;
  return (
    <div className="flex flex-col h-full" style={{ padding: "32px" }}>
      {config.enabledComponents.header && (
        <div className="mb-6">
          <ProfileHeader user={data.user} theme={theme} />
        </div>
      )}

      <div className="w-full h-px mb-6" style={{ backgroundColor: colors.border }} />

      {config.enabledComponents.stats && (
        <div className="mb-6">
          <StatsOverview stats={data.stats} theme={theme} />
        </div>
      )}

      {config.enabledComponents.heatmap && (
        <div className="mb-6">
          <p className="text-[10px] font-medium mb-2 uppercase tracking-widest" style={{ color: colors.textSecondary }}>
            Contributions
          </p>
          <ContributionHeatmap calendar={data.contributionCalendar} theme={theme} compact />
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 flex-1">
        {config.enabledComponents.techStack && data.languages.length > 0 && (
          <div>
            <p className="text-[10px] font-medium mb-2 uppercase tracking-widest" style={{ color: colors.textSecondary }}>
              Languages
            </p>
            <TechStack languages={data.languages} theme={theme} />
          </div>
        )}
        {config.enabledComponents.topProjects && data.topRepos.length > 0 && (
          <div>
            <p className="text-[10px] font-medium mb-2 uppercase tracking-widest" style={{ color: colors.textSecondary }}>
              Top Projects
            </p>
            <TopProjects repos={data.topRepos} theme={theme} limit={2} />
          </div>
        )}
      </div>

      {config.enabledComponents.badges && (
        <div className="mt-4">
          <p className="text-[10px] font-medium mb-2 uppercase tracking-widest" style={{ color: colors.textSecondary }}>
            Achievements
          </p>
          <Badges stats={data.stats} theme={theme} />
        </div>
      )}

      {config.enabledComponents.quote && (
        <div className="mt-6">
          <div className="w-full h-px mb-4" style={{ backgroundColor: colors.border }} />
          <p className="text-xs italic text-center" style={{ color: colors.textSecondary, fontFamily: fonts.body }}>
            &ldquo;{config.quote}&rdquo;
          </p>
        </div>
      )}

      {config.enabledComponents.qrCode && (
        <div className="mt-4 flex items-center gap-3">
          <QRCodeCard url={data.user.html_url} theme={theme} size={48} />
          <p className="text-[10px]" style={{ color: colors.textSecondary, fontFamily: fonts.mono }}>
            {data.user.html_url.replace("https://", "")}
          </p>
        </div>
      )}

      {config.showWatermark && (
        <p className="text-[9px] mt-4 text-center" style={{ color: colors.border, fontFamily: fonts.mono }}>
          codepost.dev
        </p>
      )}
    </div>
  );
}

function VintageCard({ data, theme, config }: { data: GitHubData; theme: Theme; config: CardConfig }) {
  const { colors, fonts } = theme;
  return (
    <div className="flex flex-col h-full" style={{ padding: "24px", border: `1px solid ${colors.primary}40` }}>
      <div className="text-center mb-4">
        <p className="font-mono text-[10px] mb-1" style={{ color: colors.textSecondary }}>
          ┌{'─'.repeat(40)}┐
        </p>
        <p className="font-mono text-sm" style={{ color: colors.primary, fontFamily: fonts.heading }}>
          CODEPOST TERMINAL v1.0
        </p>
        <p className="font-mono text-[10px]" style={{ color: colors.textSecondary }}>
          └{'─'.repeat(40)}┘
        </p>
      </div>

      {config.enabledComponents.header && (
        <div className="mb-4 font-mono">
          <p style={{ color: colors.textSecondary }}>$ whoami</p>
          <p className="text-lg font-bold" style={{ color: colors.primary, fontFamily: fonts.heading }}>
            {data.user.name ?? data.user.login}<span className="animate-pulse">_</span>
          </p>
          <p className="text-xs" style={{ color: colors.textSecondary }}>
            {data.user.bio}
          </p>
        </div>
      )}

      {config.enabledComponents.stats && (
        <div className="mb-4">
          <p className="font-mono text-[10px] mb-1" style={{ color: colors.textSecondary }}>
            $ git log --stats
          </p>
          <StatsOverview stats={data.stats} theme={theme} />
        </div>
      )}

      {config.enabledComponents.heatmap && (
        <div className="mb-4">
          <p className="font-mono text-[10px] mb-1" style={{ color: colors.textSecondary }}>
            $ git activity --year
          </p>
          <ContributionHeatmap calendar={data.contributionCalendar} theme={theme} compact />
        </div>
      )}

      {config.enabledComponents.techStack && data.languages.length > 0 && (
        <div className="mb-4">
          <p className="font-mono text-[10px] mb-1" style={{ color: colors.textSecondary }}>
            $ ls ~/.languages
          </p>
          <TechStack languages={data.languages} theme={theme} />
        </div>
      )}

      {config.enabledComponents.badges && (
        <div className="mb-4">
          <p className="font-mono text-[10px] mb-1" style={{ color: colors.textSecondary }}>
            $ cat achievements.txt
          </p>
          <Badges stats={data.stats} theme={theme} />
        </div>
      )}

      {config.enabledComponents.quote && (
        <div className="mb-4">
          <p className="font-mono text-[10px] mb-1" style={{ color: colors.textSecondary }}>$ echo $MOTTO</p>
          <p className="text-xs italic font-mono" style={{ color: colors.primary }}>&ldquo;{config.quote}&rdquo;</p>
        </div>
      )}

      {config.enabledComponents.qrCode && (
        <div className="flex items-center gap-3 mb-4">
          <QRCodeCard url={data.user.html_url} theme={theme} size={48} />
          <p className="font-mono text-[10px]" style={{ color: colors.textSecondary }}>
            {data.user.html_url.replace("https://", "")}
          </p>
        </div>
      )}

      {config.showWatermark && (
        <p className="font-mono text-[9px] mt-auto pt-4 text-center" style={{ color: colors.textSecondary }}>
          [codepost.dev]
        </p>
      )}
    </div>
  );
}

function GradientCard({ data, theme, config }: { data: GitHubData; theme: Theme; config: CardConfig }) {
  const { colors, fonts } = theme;
  return (
    <div
      className="flex flex-col h-full relative overflow-hidden"
      style={{ padding: "28px" }}
    >
      {/* Gradient background blobs */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ backgroundColor: colors.primary }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ backgroundColor: colors.secondary }}
      />

      {config.enabledComponents.header && (
        <div
          className="relative mb-5 p-4 rounded-2xl backdrop-blur-sm"
          style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}` }}
        >
          <ProfileHeader user={data.user} theme={theme} />
        </div>
      )}

      {config.enabledComponents.stats && (
        <div className="relative mb-5">
          <StatsOverview stats={data.stats} theme={theme} />
        </div>
      )}

      {config.enabledComponents.heatmap && (
        <div
          className="relative mb-5 p-3 rounded-2xl backdrop-blur-sm"
          style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}` }}
        >
          <p className="text-[9px] mb-2 font-semibold uppercase tracking-wider" style={{ color: colors.primary }}>
            Contribution Activity
          </p>
          <ContributionHeatmap calendar={data.contributionCalendar} theme={theme} compact />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 relative flex-1">
        {config.enabledComponents.techStack && data.languages.length > 0 && (
          <div
            className="p-3 rounded-2xl backdrop-blur-sm"
            style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}` }}
          >
            <p className="text-[9px] mb-2 font-semibold uppercase tracking-wider" style={{ color: colors.accent }}>
              Languages
            </p>
            <TechStack languages={data.languages} theme={theme} />
          </div>
        )}
        {config.enabledComponents.topProjects && data.topRepos.length > 0 && (
          <div
            className="p-3 rounded-2xl backdrop-blur-sm"
            style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}` }}
          >
            <p className="text-[9px] mb-2 font-semibold uppercase tracking-wider" style={{ color: colors.accent }}>
              Top Projects
            </p>
            <TopProjects repos={data.topRepos} theme={theme} limit={2} />
          </div>
        )}
      </div>

      {config.enabledComponents.badges && (
        <div
          className="relative mt-3 p-3 rounded-2xl backdrop-blur-sm"
          style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}` }}
        >
          <p className="text-[9px] mb-2 font-semibold uppercase tracking-wider" style={{ color: colors.accent }}>Achievements</p>
          <Badges stats={data.stats} theme={theme} />
        </div>
      )}

      {config.enabledComponents.quote && (
        <div className="relative mt-3 text-center">
          <p className="text-xs italic" style={{ color: colors.textSecondary, fontFamily: fonts.body }}>
            &ldquo;{config.quote}&rdquo;
          </p>
        </div>
      )}

      {config.enabledComponents.qrCode && (
        <div className="relative mt-3 flex items-center gap-3">
          <QRCodeCard url={data.user.html_url} theme={theme} size={48} />
          <p className="text-[10px]" style={{ color: colors.textSecondary, fontFamily: fonts.mono }}>
            {data.user.html_url.replace("https://", "")}
          </p>
        </div>
      )}

      {config.showWatermark && (
        <p className="text-[9px] mt-4 text-center relative" style={{ color: colors.textSecondary, fontFamily: fonts.mono }}>
          codepost.dev
        </p>
      )}
    </div>
  );
}

function PaperCard({ data, theme, config }: { data: GitHubData; theme: Theme; config: CardConfig }) {
  const { colors, fonts } = theme;
  return (
    <div
      className="flex flex-col h-full relative"
      style={{
        padding: "32px",
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23d4b896' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
      }}
    >
      <div className="text-center mb-5">
        <h1
          className="text-2xl font-bold"
          style={{ color: colors.primary, fontFamily: fonts.heading }}
        >
          Developer Profile
        </h1>
        <div className="flex justify-center gap-1 mt-1">
          {"✦✦✦".split("").map((s, i) => (
            <span key={i} style={{ color: colors.accent }}>{s}</span>
          ))}
        </div>
      </div>

      {config.enabledComponents.header && (
        <div
          className="mb-5 p-4 rounded-lg"
          style={{ backgroundColor: colors.cardBackground, border: `1px dashed ${colors.border}` }}
        >
          <ProfileHeader user={data.user} theme={theme} />
        </div>
      )}

      {config.enabledComponents.stats && (
        <div className="mb-5">
          <StatsOverview stats={data.stats} theme={theme} />
        </div>
      )}

      {config.enabledComponents.heatmap && (
        <div className="mb-5">
          <p className="text-[10px] font-medium mb-2" style={{ color: colors.textSecondary, fontFamily: fonts.body }}>
            — Contribution History —
          </p>
          <ContributionHeatmap calendar={data.contributionCalendar} theme={theme} compact />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 flex-1">
        {config.enabledComponents.techStack && data.languages.length > 0 && (
          <div>
            <p className="text-[10px] font-medium mb-2" style={{ color: colors.textSecondary, fontFamily: fonts.body }}>
              — Languages —
            </p>
            <TechStack languages={data.languages} theme={theme} />
          </div>
        )}
        {config.enabledComponents.topProjects && data.topRepos.length > 0 && (
          <div>
            <p className="text-[10px] font-medium mb-2" style={{ color: colors.textSecondary, fontFamily: fonts.body }}>
              — Projects —
            </p>
            <TopProjects repos={data.topRepos} theme={theme} limit={2} />
          </div>
        )}
      </div>

      {config.enabledComponents.badges && (
        <div className="mt-4">
          <p className="text-[10px] font-medium mb-2" style={{ color: colors.textSecondary, fontFamily: fonts.body }}>
            — Achievements —
          </p>
          <Badges stats={data.stats} theme={theme} />
        </div>
      )}

      {config.enabledComponents.quote && (
        <div className="mt-4">
          <div className="flex justify-center gap-1 mb-2">
            {"✦✦✦".split("").map((s, i) => (
              <span key={i} style={{ color: colors.accent, fontSize: "8px" }}>{s}</span>
            ))}
          </div>
          <p className="text-xs italic text-center" style={{ color: colors.textSecondary, fontFamily: fonts.body }}>
            &ldquo;{config.quote}&rdquo;
          </p>
        </div>
      )}

      {config.enabledComponents.qrCode && (
        <div className="mt-4 flex items-center gap-3">
          <QRCodeCard url={data.user.html_url} theme={theme} size={48} />
          <p className="text-[10px]" style={{ color: colors.textSecondary, fontFamily: fonts.mono }}>
            {data.user.html_url.replace("https://", "")}
          </p>
        </div>
      )}

      {config.showWatermark && (
        <p className="text-[9px] mt-4 text-center" style={{ color: colors.border, fontFamily: fonts.body }}>
          — codepost.dev —
        </p>
      )}
    </div>
  );
}

export function CardCanvas({ data, config, previewScale = 1, id = "card-canvas" }: Props) {
  const theme = useMemo(() => {
    const base = getTheme(config.theme);
    return {
      ...base,
      colors: { ...base.colors, ...config.customColors },
    } as Theme;
  }, [config.theme, config.customColors]);

  const { colors } = theme;

  const visualWidth  = config.layout.width  * previewScale;
  const visualHeight = config.layout.height * previewScale;

  const cardStyle = {
    width: `${config.layout.width}px`,
    height: `${config.layout.height}px`,
    backgroundColor: colors.background,
    color: colors.text,
    transform: `scale(${previewScale})`,
    transformOrigin: "top left",
    fontFamily: theme.fonts.body,
    overflow: "hidden",
    position: "relative" as const,
  };

  const renderContent = () => {
    switch (config.theme) {
      case "cyberpunk":
        return <CyberpunkCard data={data} theme={theme} config={config} />;
      case "vintage":
        return <VintageCard data={data} theme={theme} config={config} />;
      case "gradient":
        return <GradientCard data={data} theme={theme} config={config} />;
      case "paper":
        return <PaperCard data={data} theme={theme} config={config} />;
      default:
        return <MinimalistCard data={data} theme={theme} config={config} />;
    }
  };

  return (
    <div style={{ width: visualWidth, height: visualHeight, overflow: "hidden", position: "relative", flexShrink: 0 }}>
      <div id={id} style={cardStyle} className="card-canvas">
        {renderContent()}
      </div>
    </div>
  );
}
