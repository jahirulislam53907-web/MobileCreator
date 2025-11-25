import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet, Image } from "react-native";
import HomeStackNavigator from "@/navigation/HomeStackNavigator";
import PrayerScreen from "@/screens/PrayerScreen";
import QuranScreen from "@/screens/QuranScreen";
import DuaScreen from "@/screens/DuaScreen";
import MoreStackNavigator from "@/navigation/MoreStackNavigator";
import { useAppTheme } from "@/hooks/useAppTheme";

export type MainTabParamList = {
  HomeTab: undefined;
  PrayerTab: undefined;
  QuranTab: undefined;
  DuaTab: undefined;
  MoreTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { theme, isDark } = useAppTheme();

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        tabBarActiveTintColor: theme.buttonText,
        tabBarInactiveTintColor: theme.buttonText,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: theme.primary,
          borderTopWidth: 0,
          elevation: 0,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: "হোম",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PrayerTab"
        component={PrayerScreen}
        options={{
          title: "নামাজ",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="access-time" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="QuranTab"
        component={QuranScreen}
        options={{
          title: "কুরআন",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="menu-book" size={size + 2} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="DuaTab"
        component={DuaScreen}
        options={{
          title: "দুয়া",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MoreTab"
        component={MoreStackNavigator}
        options={{
          title: "আরও",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="menu" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
