import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@/screens/HomeScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";
import { HeaderNav } from "@/components/HeaderNav";
import { useNavigation } from "@react-navigation/native";

export type HomeStackParamList = {
  Home: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
        headerTransparent: false,
        header: () => (
          <HeaderNav
            onProfilePress={() => {
              // Profile action
            }}
            onSettingsPress={() => {
              // Navigate to settings tab
              if (navigation.getParent()) {
                navigation.getParent()?.navigate("Settings" as any);
              }
            }}
          />
        ),
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
    </Stack.Navigator>
  );
}
