import { useContext, createContext, ReactNode, useState, useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors, ThemeName } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppThemeContextType {
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  isDark: boolean;
}

export const AppThemeContext = createContext<AppThemeContextType | undefined>(undefined);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeNameState] = useState<ThemeName>("teal");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // লোড করুন সংরক্ষিত থিম
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem("app_theme");
        if (saved) {
          setThemeNameState(saved as ThemeName);
        }
      } catch (err) {
        console.log("Theme load error:", err);
      }
    };
    loadTheme();
  }, []);

  const setThemeName = async (name: ThemeName) => {
    setThemeNameState(name);
    try {
      await AsyncStorage.setItem("app_theme", name);
    } catch (err) {
      console.log("Theme save error:", err);
    }
  };

  return (
    <AppThemeContext.Provider value={{ themeName, setThemeName, isDark }}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  const colorScheme = useColorScheme();

  if (!context) {
    // Fallback যদি provider না থাকে
    const isDark = colorScheme === "dark";
    return {
      themeName: "teal" as ThemeName,
      setThemeName: () => {},
      isDark,
      theme: Colors.teal[isDark ? "dark" : "light"],
    };
  }

  const { themeName, isDark } = context;
  const theme = Colors[themeName][isDark ? "dark" : "light"];

  return {
    themeName,
    setThemeName: context.setThemeName,
    isDark,
    theme,
  };
}
