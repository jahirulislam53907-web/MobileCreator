import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useNavigation } from "@react-navigation/native";

interface HeaderNavProps {
  onProfilePress?: () => void;
  onSettingsPress?: () => void;
}

export function HeaderNav({ onProfilePress, onSettingsPress }: HeaderNavProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Pressable 
          style={styles.profileButton}
          onPress={onProfilePress}
        >
          <View style={styles.profileIcon}>
            <Feather name="user" size={20} color="#fff" />
          </View>
        </Pressable>

        <View style={styles.centerContent}>
          <Feather name="navigation" size={24} color="#fff" />
          <ThemedText style={styles.appName}>smart Muslim</ThemedText>
        </View>

        <Pressable 
          style={styles.settingsButton}
          onPress={onSettingsPress}
        >
          <Feather name="settings" size={20} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1a5e63",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 12,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileButton: {
    padding: 8,
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  centerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "center",
  },
  appName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  settingsButton: {
    padding: 8,
  },
});
