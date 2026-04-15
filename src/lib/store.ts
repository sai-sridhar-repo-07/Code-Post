import { create } from "zustand";
import type { CardConfig, GitHubData, ThemeName, EnabledComponents, LayoutConfig } from "@/types";

interface CardStore {
  githubData: GitHubData | null;
  config: CardConfig;
  isLoading: boolean;
  isSyncing: boolean;

  setGitHubData: (data: GitHubData) => void;
  setTheme: (theme: ThemeName) => void;
  setConfig: (config: Partial<CardConfig>) => void;
  toggleComponent: (key: keyof EnabledComponents) => void;
  setLayout: (layout: Partial<LayoutConfig>) => void;
  setIsLoading: (loading: boolean) => void;
  setIsSyncing: (syncing: boolean) => void;
  setQuote: (quote: string) => void;
}

const defaultComponents: EnabledComponents = {
  header: true,
  heatmap: true,
  stats: true,
  techStack: true,
  topProjects: true,
  badges: false,
  quote: false,
  qrCode: false,
};

const defaultLayout: LayoutConfig = {
  size: "instagram-square",
  width: 1080,
  height: 1080,
  orientation: "portrait",
  scale: 1,
};

const defaultConfig: CardConfig = {
  theme: "minimalist",
  customColors: {},
  enabledComponents: defaultComponents,
  layout: defaultLayout,
  quote: "Code is poetry.",
  showWatermark: true,
};

export const useCardStore = create<CardStore>((set) => ({
  githubData: null,
  config: defaultConfig,
  isLoading: false,
  isSyncing: false,

  setGitHubData: (data) => set({ githubData: data }),

  setTheme: (theme) =>
    set((state) => ({
      config: { ...state.config, theme, customColors: {} },
    })),

  setConfig: (partial) =>
    set((state) => ({ config: { ...state.config, ...partial } })),

  toggleComponent: (key) =>
    set((state) => ({
      config: {
        ...state.config,
        enabledComponents: {
          ...state.config.enabledComponents,
          [key]: !state.config.enabledComponents[key],
        },
      },
    })),

  setLayout: (layout) =>
    set((state) => ({
      config: {
        ...state.config,
        layout: { ...state.config.layout, ...layout },
      },
    })),

  setIsLoading: (isLoading) => set({ isLoading }),
  setIsSyncing: (isSyncing) => set({ isSyncing }),

  setQuote: (quote) =>
    set((state) => ({ config: { ...state.config, quote } })),
}));
