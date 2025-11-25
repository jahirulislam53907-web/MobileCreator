import React, { useContext, createContext, ReactNode, useState, useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors, ThemeName } from "@/constants/theme";
import { useTranslation } from "@/src/contexts/LanguageContext";

interface AppThemeContextType {
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  isDark: boolean;
  theme: any;
}

export const AppThemeContext = createContext<AppThemeContextType | undefined>(undefined);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeNameState] = useState<ThemeName>("bn");
  const { language, getThemeForLanguage } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = Colors[themeName][isDark ? "dark" : "light"];

  // ভাষা পরিবর্তন হলে থিম auto-update হবে
  useEffect(() => {
    const newTheme = getThemeForLanguage(language);
    setThemeNameState(newTheme);
  }, [language, getThemeForLanguage]);

  const setThemeName = (name: ThemeName) => {
    console.log('Theme changed to:', name);
    setThemeNameState(name);
  };

  const contextValue = React.useMemo(() => ({
    themeName,
    setThemeName,
    isDark,
    theme,
  }), [themeName, isDark, theme]);

  return (
    <AppThemeContext.Provider value={contextValue}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  const colorScheme = useColorScheme();

  if (!context) {
    const isDark = colorScheme === "dark";
    const theme = Colors.teal?.[isDark ? "dark" : "light"] || {
      backgroundDefault: "#ffffff",
      backgroundSecondary: "#f9f9f9",
      backgroundTertiary: "#eeeeee",
      backgroundRoot: "#f5f5f5",
    };
    return {
      themeName: "teal" as ThemeName,
      setThemeName: () => {},
      isDark,
      theme,
    };
  }

  return context;
}
