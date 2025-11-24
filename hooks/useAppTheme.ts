import { useContext, createContext, ReactNode, useState, useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors, ThemeName } from "@/constants/theme";

interface AppThemeContextType {
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  isDark: boolean;
  theme: any;
}

export const AppThemeContext = createContext<AppThemeContextType | undefined>(undefined);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeNameState] = useState<ThemeName>("teal");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = Colors[themeName][isDark ? "dark" : "light"];

  const setThemeName = (name: ThemeName) => {
    setThemeNameState(name);
  };

  return (
    <AppThemeContext.Provider value={{ themeName, setThemeName, isDark, theme }}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  const colorScheme = useColorScheme();

  if (!context) {
    const isDark = colorScheme === "dark";
    return {
      themeName: "teal" as ThemeName,
      setThemeName: () => {},
      isDark,
      theme: Colors.teal[isDark ? "dark" : "light"],
    };
  }

  return context;
}
