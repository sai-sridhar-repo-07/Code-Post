import type { Theme, ThemeName } from "@/types";

export const themes: Record<ThemeName, Theme> = {
  minimalist: {
    name: "minimalist",
    displayName: "Minimalist Linear",
    description: "Clean lines, monochromatic palette with sharp typography",
    className: "theme-minimalist",
    colors: {
      background: "#ffffff",
      cardBackground: "#f8f9fa",
      text: "#0a0a0a",
      textSecondary: "#6b7280",
      primary: "#0a0a0a",
      secondary: "#374151",
      accent: "#0070f3",
      border: "#e5e7eb",
      heatmap: {
        level0: "#ebedf0",
        level1: "#c6e48b",
        level2: "#7bc96f",
        level3: "#239a3b",
        level4: "#196127",
      },
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
      mono: "JetBrains Mono",
    },
  },

  cyberpunk: {
    name: "cyberpunk",
    displayName: "Neon Cyberpunk",
    description: "Dark background with glowing neon accents",
    className: "theme-cyberpunk",
    colors: {
      background: "#0a0e27",
      cardBackground: "#111828",
      text: "#e2e8f0",
      textSecondary: "#94a3b8",
      primary: "#00ffff",
      secondary: "#ff006e",
      accent: "#ffbe0b",
      border: "#1e293b",
      heatmap: {
        level0: "#1a1f3a",
        level1: "#ff006e33",
        level2: "#ff006e66",
        level3: "#ff006e99",
        level4: "#ff006e",
      },
    },
    fonts: {
      heading: "Orbitron",
      body: "Rajdhani",
      mono: "Share Tech Mono",
    },
  },

  vintage: {
    name: "vintage",
    displayName: "Vintage Terminal",
    description: "Retro green-on-black terminal aesthetic",
    className: "theme-vintage",
    colors: {
      background: "#0d1117",
      cardBackground: "#0d1117",
      text: "#39ff14",
      textSecondary: "#2ea043",
      primary: "#39ff14",
      secondary: "#2ea043",
      accent: "#58a6ff",
      border: "#30363d",
      heatmap: {
        level0: "#161b22",
        level1: "#0e4429",
        level2: "#006d32",
        level3: "#26a641",
        level4: "#39d353",
      },
    },
    fonts: {
      heading: "Share Tech Mono",
      body: "Share Tech Mono",
      mono: "Share Tech Mono",
    },
  },

  gradient: {
    name: "gradient",
    displayName: "Gradient Modern",
    description: "Smooth gradients with glassmorphism effects",
    className: "theme-gradient",
    colors: {
      background: "#0f0c29",
      cardBackground: "rgba(255,255,255,0.08)",
      text: "#ffffff",
      textSecondary: "#cbd5e1",
      primary: "#a78bfa",
      secondary: "#60a5fa",
      accent: "#f472b6",
      border: "rgba(255,255,255,0.12)",
      heatmap: {
        level0: "rgba(255,255,255,0.05)",
        level1: "#7c3aed44",
        level2: "#7c3aed88",
        level3: "#7c3aedcc",
        level4: "#7c3aed",
      },
    },
    fonts: {
      heading: "Plus Jakarta Sans",
      body: "Plus Jakarta Sans",
      mono: "JetBrains Mono",
    },
  },

  paper: {
    name: "paper",
    displayName: "Paper Texture",
    description: "Warm earthy tones with handcrafted feel",
    className: "theme-paper",
    colors: {
      background: "#fdf6e3",
      cardBackground: "#fef9f0",
      text: "#3d2b1f",
      textSecondary: "#7c5b47",
      primary: "#c0392b",
      secondary: "#8B4513",
      accent: "#2980b9",
      border: "#d4b896",
      heatmap: {
        level0: "#e8dcc8",
        level1: "#f0a070",
        level2: "#e07050",
        level3: "#c05030",
        level4: "#8b2010",
      },
    },
    fonts: {
      heading: "Playfair Display",
      body: "Lora",
      mono: "Courier Prime",
    },
  },
};

export const themeList = Object.values(themes);

export function getTheme(name: ThemeName): Theme {
  return themes[name] ?? themes.minimalist;
}

export const EXPORT_SIZES = {
  "instagram-square": { width: 1080, height: 1080, label: "Instagram Square" },
  "instagram-story": { width: 1080, height: 1920, label: "Instagram Story" },
  "twitter-card": { width: 1200, height: 630, label: "Twitter Card" },
  "linkedin-banner": { width: 1584, height: 396, label: "LinkedIn Banner" },
  "github-readme": { width: 1200, height: 400, label: "GitHub README" },
  custom: { width: 1200, height: 630, label: "Custom" },
} as const;
