import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MoreScreen from "@/screens/MoreScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import { useAppTheme } from "@/hooks/useAppTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type MoreStackParamList = {
  More: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<MoreStackParamList>();

export default function MoreStackNavigator() {
  const { theme, isDark } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
        headerTransparent: false,
      }}
    >
      <Stack.Screen
        name="More"
        component={MoreScreen}
        options={{
          headerTitle: "আরও",
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerTitle: "সেটিংস",
        }}
      />
    </Stack.Navigator>
  );
}
