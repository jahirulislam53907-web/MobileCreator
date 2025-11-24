import { Platform } from "react-native";

// প্রিমিয়াম টিল (আপনার HTML design)
const tealPrimary = "#1a5e63";
const tealSecondary = "#2d936c";
const tealAccent = "#f9a826";

// মডার্ন ব্লু
const bluePrimary = "#0066cc";
const blueSecondary = "#0099ff";
const blueAccent = "#ff6b35";

// এলিগ্যান্ট পার্পল
const purplePrimary = "#7c3aed";
const purpleSecondary = "#a78bfa";
const purpleAccent = "#f59e0b";

// ফ্রেশ গ্রীন
const greenPrimary = "#059669";
const greenSecondary = "#10b981";
const greenAccent = "#f97316";

// সানসেট অরেঞ্জ
const orangePrimary = "#ea580c";
const orangeSecondary = "#fb923c";
const orangeAccent = "#06b6d4";

export type ThemeName = "teal" | "blue" | "purple" | "green" | "orange";

export const Colors = {
  // প্রিমিয়াম টিল থিম (HTML design)
  teal: {
    light: {
      text: "#1a1a1a",
      textSecondary: "#666666",
      buttonText: "#FFFFFF",
      tabIconDefault: "#999999",
      tabIconSelected: tealPrimary,
      link: tealPrimary,
      primary: tealPrimary,
      primaryLight: tealSecondary,
      primaryDark: "#0f3a3f",
      secondary: tealSecondary,
      secondaryLight: "#4aaf8a",
      secondaryDark: "#1a5d45",
      accent: tealAccent,
      success: "#4CAF50",
      warning: tealAccent,
      error: "#f44336",
      backgroundRoot: "#f5f5f5",
      backgroundDefault: "#ffffff",
      backgroundSecondary: "#f9f9f9",
      backgroundTertiary: "#eeeeee",
      border: "#e0e0e0",
    },
    dark: {
      text: "#ffffff",
      textSecondary: "#b0b0b0",
      buttonText: "#FFFFFF",
      tabIconDefault: "#808080",
      tabIconSelected: tealAccent,
      link: tealSecondary,
      primary: tealSecondary,
      primaryLight: "#4aaf8a",
      primaryDark: tealPrimary,
      secondary: tealAccent,
      secondaryLight: "#ffc049",
      secondaryDark: "#f0991e",
      accent: tealAccent,
      success: "#66BB6A",
      warning: tealAccent,
      error: "#ef5350",
      backgroundRoot: "#1a1a1a",
      backgroundDefault: "#242424",
      backgroundSecondary: "#1e1e1e",
      backgroundTertiary: "#333333",
      border: "#404040",
    },
  },

  // মডার্ন ব্লু থিম
  blue: {
    light: {
      text: "#1a1a1a",
      textSecondary: "#666666",
      buttonText: "#FFFFFF",
      tabIconDefault: "#999999",
      tabIconSelected: bluePrimary,
      link: bluePrimary,
      primary: bluePrimary,
      primaryLight: blueSecondary,
      primaryDark: "#003d99",
      secondary: blueSecondary,
      secondaryLight: "#33adff",
      secondaryDark: "#0073e6",
      accent: blueAccent,
      success: "#4CAF50",
      warning: blueAccent,
      error: "#f44336",
      backgroundRoot: "#f5f5f5",
      backgroundDefault: "#ffffff",
      backgroundSecondary: "#f0f4ff",
      backgroundTertiary: "#e8ecff",
      border: "#d0doff",
    },
    dark: {
      text: "#ffffff",
      textSecondary: "#b0b0b0",
      buttonText: "#FFFFFF",
      tabIconDefault: "#808080",
      tabIconSelected: blueAccent,
      link: blueSecondary,
      primary: blueSecondary,
      primaryLight: "#66b3ff",
      primaryDark: bluePrimary,
      secondary: blueAccent,
      secondaryLight: "#ff8c66",
      secondaryDark: "#ff5722",
      accent: blueAccent,
      success: "#66BB6A",
      warning: blueAccent,
      error: "#ef5350",
      backgroundRoot: "#1a1a1a",
      backgroundDefault: "#0a1f3d",
      backgroundSecondary: "#132847",
      backgroundTertiary: "#1a3a52",
      border: "#2a4a62",
    },
  },

  // এলিগ্যান্ট পার্পল থিম
  purple: {
    light: {
      text: "#1a1a1a",
      textSecondary: "#666666",
      buttonText: "#FFFFFF",
      tabIconDefault: "#999999",
      tabIconSelected: purplePrimary,
      link: purplePrimary,
      primary: purplePrimary,
      primaryLight: purpleSecondary,
      primaryDark: "#5b21b6",
      secondary: purpleSecondary,
      secondaryLight: "#c4b5fd",
      secondaryDark: "#8b5cf6",
      accent: purpleAccent,
      success: "#4CAF50",
      warning: purpleAccent,
      error: "#f44336",
      backgroundRoot: "#f5f5f5",
      backgroundDefault: "#ffffff",
      backgroundSecondary: "#f3f0ff",
      backgroundTertiary: "#ede9fe",
      border: "#ddd6fe",
    },
    dark: {
      text: "#ffffff",
      textSecondary: "#b0b0b0",
      buttonText: "#FFFFFF",
      tabIconDefault: "#808080",
      tabIconSelected: purpleAccent,
      link: purpleSecondary,
      primary: purpleSecondary,
      primaryLight: "#d8b4fe",
      primaryDark: purplePrimary,
      secondary: purpleAccent,
      secondaryLight: "#fbbf24",
      secondaryDark: "#f59e0b",
      accent: purpleAccent,
      success: "#66BB6A",
      warning: purpleAccent,
      error: "#ef5350",
      backgroundRoot: "#1a1a1a",
      backgroundDefault: "#2d1b4e",
      backgroundSecondary: "#3d2463",
      backgroundTertiary: "#4d337a",
      border: "#6d4a8f",
    },
  },

  // ফ্রেশ গ্রীন থিম
  green: {
    light: {
      text: "#1a1a1a",
      textSecondary: "#666666",
      buttonText: "#FFFFFF",
      tabIconDefault: "#999999",
      tabIconSelected: greenPrimary,
      link: greenPrimary,
      primary: greenPrimary,
      primaryLight: greenSecondary,
      primaryDark: "#047857",
      secondary: greenSecondary,
      secondaryLight: "#6ee7b7",
      secondaryDark: "#059669",
      accent: greenAccent,
      success: "#4CAF50",
      warning: greenAccent,
      error: "#f44336",
      backgroundRoot: "#f5f5f5",
      backgroundDefault: "#ffffff",
      backgroundSecondary: "#f0fdf4",
      backgroundTertiary: "#dcfce7",
      border: "#bbf7d0",
    },
    dark: {
      text: "#ffffff",
      textSecondary: "#b0b0b0",
      buttonText: "#FFFFFF",
      tabIconDefault: "#808080",
      tabIconSelected: greenAccent,
      link: greenSecondary,
      primary: greenSecondary,
      primaryLight: "#86efac",
      primaryDark: greenPrimary,
      secondary: greenAccent,
      secondaryLight: "#fed7aa",
      secondaryDark: "#fb923c",
      accent: greenAccent,
      success: "#66BB6A",
      warning: greenAccent,
      error: "#ef5350",
      backgroundRoot: "#1a1a1a",
      backgroundDefault: "#0f3f2f",
      backgroundSecondary: "#1a5a47",
      backgroundTertiary: "#25755f",
      border: "#309076",
    },
  },

  // সানসেট অরেঞ্জ থিম
  orange: {
    light: {
      text: "#1a1a1a",
      textSecondary: "#666666",
      buttonText: "#FFFFFF",
      tabIconDefault: "#999999",
      tabIconSelected: orangePrimary,
      link: orangePrimary,
      primary: orangePrimary,
      primaryLight: orangeSecondary,
      primaryDark: "#c2410c",
      secondary: orangeSecondary,
      secondaryLight: "#fed7aa",
      secondaryDark: "#f97316",
      accent: orangeAccent,
      success: "#4CAF50",
      warning: orangeAccent,
      error: "#f44336",
      backgroundRoot: "#f5f5f5",
      backgroundDefault: "#ffffff",
      backgroundSecondary: "#fef3c7",
      backgroundTertiary: "#fed7aa",
      border: "#fecaca",
    },
    dark: {
      text: "#ffffff",
      textSecondary: "#b0b0b0",
      buttonText: "#FFFFFF",
      tabIconDefault: "#808080",
      tabIconSelected: orangeAccent,
      link: orangeSecondary,
      primary: orangeSecondary,
      primaryLight: "#ffa94d",
      primaryDark: orangePrimary,
      secondary: orangeAccent,
      secondaryLight: "#67e8f9",
      secondaryDark: "#06b6d4",
      accent: orangeAccent,
      success: "#66BB6A",
      warning: orangeAccent,
      error: "#ef5350",
      backgroundRoot: "#1a1a1a",
      backgroundDefault: "#3f2515",
      backgroundSecondary: "#5a3a1f",
      backgroundTertiary: "#754f2a",
      border: "#9a6a35",
    },
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 32,
    fontWeight: "700" as const,
  },
  h1: {
    fontSize: 24,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  h3: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
  arabicLarge: {
    fontSize: 28,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "Georgia",
    mono: "Courier New",
  },
  android: {
    sans: "system-ui",
    serif: "serif",
    mono: "monospace",
  },
  web: {
    sans: "system-ui",
    serif: "Georgia",
    mono: "monospace",
  },
});

export const Shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
};
