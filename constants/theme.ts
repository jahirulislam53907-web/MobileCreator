import { Platform } from "react-native";

// আপনার প্রদত্ত রঙ স্কিম
const primaryColor = "#1a5e63";      // Dark Teal
const secondaryColor = "#2d936c";    // Green
const accentColor = "#f9a826";       // Orange

export const Colors = {
  light: {
    text: "#1a1a1a",
    textSecondary: "#666666",
    buttonText: "#FFFFFF",
    tabIconDefault: "#999999",
    tabIconSelected: primaryColor,
    link: primaryColor,
    primary: primaryColor,
    primaryLight: secondaryColor,
    primaryDark: "#0f3a3f",
    secondary: secondaryColor,
    secondaryLight: "#4aaf8a",
    secondaryDark: "#1a5d45",
    accent: accentColor,
    success: "#4CAF50",
    warning: accentColor,
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
    tabIconSelected: accentColor,
    link: secondaryColor,
    primary: secondaryColor,
    primaryLight: "#4aaf8a",
    primaryDark: primaryColor,
    secondary: accentColor,
    secondaryLight: "#ffc049",
    secondaryDark: "#f0991e",
    accent: accentColor,
    success: "#66BB6A",
    warning: accentColor,
    error: "#ef5350",
    backgroundRoot: "#1a1a1a",
    backgroundDefault: "#242424",
    backgroundSecondary: "#1e1e1e",
    backgroundTertiary: "#333333",
    border: "#404040",
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
