import { Platform } from "react-native";

const primaryLight = "#2D6A4F";
const primaryDark = "#52B788";

export const Colors = {
  light: {
    text: "#212529",
    textSecondary: "#6C757D",
    buttonText: "#FFFFFF",
    tabIconDefault: "#6C757D",
    tabIconSelected: primaryLight,
    link: "#2D6A4F",
    primary: "#2D6A4F",
    primaryLight: "#52B788",
    primaryDark: "#1B4332",
    secondary: "#D4A574",
    secondaryLight: "#E9C992",
    secondaryDark: "#B8860B",
    success: "#40916C",
    warning: "#F4A261",
    error: "#E76F51",
    backgroundRoot: "#F8F9FA",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#F8F9FA",
    backgroundTertiary: "#E9ECEF",
    border: "#DEE2E6",
  },
  dark: {
    text: "#F8F9FA",
    textSecondary: "#ADB5BD",
    buttonText: "#FFFFFF",
    tabIconDefault: "#ADB5BD",
    tabIconSelected: primaryDark,
    link: "#52B788",
    primary: "#52B788",
    primaryLight: "#74C69D",
    primaryDark: "#2D6A4F",
    secondary: "#E9C992",
    secondaryLight: "#F0D9AA",
    secondaryDark: "#D4A574",
    success: "#52B788",
    warning: "#F4A261",
    error: "#E76F51",
    backgroundRoot: "#1A1A1A",
    backgroundDefault: "#2A2A2A",
    backgroundSecondary: "#1A1A1A",
    backgroundTertiary: "#3A3A3A",
    border: "#4A4A4A",
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
  md: 18,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 32,
    fontWeight: "700" as const,
  },
  h1: {
    fontSize: 24,
    fontWeight: "600" as const,
  },
  h2: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  h3: {
    fontSize: 18,
    fontWeight: "500" as const,
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
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
