import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import MainTabNavigator from '@/navigation/MainTabNavigator';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing, BorderRadius } from '@/constants/theme';

export type DrawerParamList = {
  Main: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerContent = (props: any) => {
  const { theme } = useAppTheme();

  const menuItems = [
    { icon: 'home', label: 'হোম', action: () => props.navigation.navigate('Main') },
    { icon: 'book-open', label: 'কুরআন', action: () => { props.navigation.navigate('Main', { screen: 'QuranTab' }); props.navigation.closeDrawer(); } },
    { icon: 'clock', label: 'নামাজ', action: () => { props.navigation.navigate('Main', { screen: 'PrayerTab' }); props.navigation.closeDrawer(); } },
    { icon: 'book', label: 'দুয়া', action: () => { props.navigation.navigate('Main', { screen: 'DuaTab' }); props.navigation.closeDrawer(); } },
    { icon: 'info', label: 'আমাদের সম্পর্কে', action: () => props.navigation.closeDrawer() },
    { icon: 'help-circle', label: 'সহায়তা', action: () => props.navigation.closeDrawer() },
    { icon: 'share-2', label: 'শেয়ার করুন', action: () => props.navigation.closeDrawer() },
  ];

  return (
    <View style={[styles.drawerContainer, { backgroundColor: theme.backgroundRoot }]}>
      {/* Header */}
      <View style={[styles.drawerHeader, { backgroundColor: theme.primary }]}>
        <ThemedText style={styles.drawerTitle}>Smart Muslim</ThemedText>
        <ThemedText style={styles.drawerSubtitle}>আপনার ইসলামিক সঙ্গী</ThemedText>
      </View>

      {/* Menu Items */}
      <View style={styles.menuItemsContainer}>
        {menuItems.map((item, index) => (
          <Pressable
            key={index}
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={item.action}
          >
            <Feather name={item.icon as any} size={20} color={theme.primary} />
            <ThemedText style={[styles.menuItemLabel, { color: theme.text }]}>{item.label}</ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default function DrawerNavigator() {
  const { theme } = useAppTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: theme.backgroundRoot,
        },
        drawerActiveTintColor: theme.primary,
        drawerInactiveTintColor: theme.textSecondary,
      }}
    >
      <Drawer.Screen
        name="Main"
        component={MainTabNavigator}
        options={{
          title: 'Smart Muslim',
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: Spacing.sm,
  },
  drawerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  menuItemsContainer: {
    marginTop: Spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
});
