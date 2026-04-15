export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  twitter_username: string | null;
  company: string | null;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
}

export interface ContributionDay {
  contributionCount: number;
  date: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface LanguageStat {
  name: string;
  percentage: number;
  color: string;
}

export interface GitHubStats {
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalStars: number;
  currentStreak: number;
  longestStreak: number;
  totalRepos: number;
  followers: number;
}

export interface GitHubData {
  user: GitHubUser;
  stats: GitHubStats;
  languages: LanguageStat[];
  topRepos: Repository[];
  contributionCalendar: ContributionCalendar;
  lastSynced: string;
}

// Theme types
export type ThemeName =
  | "minimalist"
  | "cyberpunk"
  | "vintage"
  | "gradient"
  | "paper";

export interface HeatmapColors {
  level0: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
}

export interface ThemeColors {
  background: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  heatmap: HeatmapColors;
}

export interface ThemeFonts {
  heading: string;
  body: string;
  mono: string;
}

export interface Theme {
  name: ThemeName;
  displayName: string;
  description: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  className: string;
}

// Card component configuration
export interface EnabledComponents {
  header: boolean;
  heatmap: boolean;
  stats: boolean;
  techStack: boolean;
  topProjects: boolean;
  badges: boolean;
  quote: boolean;
  qrCode: boolean;
}

export type ExportSize =
  | "instagram-square"
  | "instagram-story"
  | "twitter-card"
  | "linkedin-banner"
  | "github-readme"
  | "custom";

export interface ExportDimensions {
  width: number;
  height: number;
  label: string;
}

export interface LayoutConfig {
  size: ExportSize;
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
  scale: number;
}

export interface CardConfig {
  theme: ThemeName;
  customColors: Partial<ThemeColors>;
  enabledComponents: EnabledComponents;
  layout: LayoutConfig;
  quote: string;
  showWatermark: boolean;
}

// Database types
export interface CardRecord {
  id: string;
  userId: string;
  title: string;
  themeName: ThemeName;
  customColors: Partial<ThemeColors>;
  enabledComponents: EnabledComponents;
  layoutConfig: LayoutConfig;
  imageUrl: string | null;
  isPublic: boolean;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    username: string;
    avatarUrl: string;
  };
}

export interface UserRecord {
  id: string;
  githubId: number;
  username: string;
  name: string | null;
  email: string | null;
  avatarUrl: string;
  bio: string | null;
  createdAt: string;
  lastSynced: string | null;
}

// Gallery types
export interface GalleryCard extends CardRecord {
  isLiked?: boolean;
  githubData?: Partial<GitHubData>;
}

// Achievement badge types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
  threshold?: number;
}
