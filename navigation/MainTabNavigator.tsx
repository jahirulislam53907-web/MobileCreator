import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet } from "react-native";
import HomeStackNavigator from "@/navigation/HomeStackNavigator";
import PrayerScreen from "@/screens/PrayerScreen";
import QuranScreen from "@/screens/QuranScreen";
import DuaScreen from "@/screens/DuaScreen";
import MoreScreen from "@/screens/MoreScreen";
import { useTheme } from "@/hooks/useTheme";

export type MainTabParamList = {
  HomeTab: undefined;
  PrayerTab: undefined;
  QuranTab: undefined;
  DuaTab: undefined;
  MoreTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.select({
            ios: "transparent",
            android: theme.backgroundRoot,
          }),
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: "হোম",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PrayerTab"
        component={PrayerScreen}
        options={{
          title: "নামাজ",
          headerShown: true,
          headerTitle: "নামাজ",
          tabBarIcon: ({ color, size }) => (
            <Feather name="clock" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="QuranTab"
        component={QuranScreen}
        options={{
          title: "কুরআন",
          headerShown: true,
          headerTitle: "কুরআন",
          tabBarIcon: ({ color, size }) => (
            <Feather name="book-open" size={size + 2} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="DuaTab"
        component={DuaScreen}
        options={{
          title: "দুয়া",
          headerShown: true,
          headerTitle: "দুয়া",
          tabBarIcon: ({ color, size }) => (
            <Feather name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MoreTab"
        component={MoreScreen}
        options={{
          title: "আরও",
          headerShown: true,
          headerTitle: "আরও",
          tabBarIcon: ({ color, size }) => (
            <Feather name="menu" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
