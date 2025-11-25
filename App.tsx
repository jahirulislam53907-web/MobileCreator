import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import DrawerNavigator from "@/navigation/DrawerNavigator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppThemeProvider } from "@/hooks/useAppTheme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LanguageProvider } from "./src/contexts/LanguageContext";

function AppContent() {
  const colorScheme = useColorScheme();

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.root}>
          <KeyboardProvider>
            <NavigationContainer>
              <DrawerNavigator />
            </NavigationContainer>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppThemeProvider>
        <AppContent />
      </AppThemeProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
