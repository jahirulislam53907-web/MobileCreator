import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
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
import { LocationProvider } from "./src/contexts/LocationContext";
import { DraggableFAB } from "@/components/DraggableFAB";
import { initializeNotifications, createNotificationChannel } from "@/utils/notificationService";

function AppContent() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const setupNotifications = async () => {
      await initializeNotifications();
      await createNotificationChannel();
    };
    setupNotifications();
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.root}>
          <KeyboardProvider>
            <NavigationContainer>
              <DrawerNavigator />
              <DraggableFAB />
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
    <LocationProvider>
      <LanguageProvider>
        <AppThemeProvider>
          <AppContent />
        </AppThemeProvider>
      </LanguageProvider>
    </LocationProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
