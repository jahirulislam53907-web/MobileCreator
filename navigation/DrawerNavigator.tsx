import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import MainTabNavigator from '@/navigation/MainTabNavigator';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing, BorderRadius } from '@/constants/theme';

export type DrawerParamList = {
  Main: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

interface DrawerContentProps {
  navigation: any;
}

const DrawerContent = ({ navigation }: DrawerContentProps) => {
  const { theme } = useAppTheme();

  const menuItems = [
    // প্রধান সেবা
    { icon: 'home', label: 'হোম', action: () => { navigation.navigate('Main', { screen: 'HomeTab' }); navigation.closeDrawer(); } },
    { icon: 'bell', label: 'আজান', action: () => navigation.closeDrawer() },
    { icon: 'book-open', label: 'নামাজ শিক্ষা', action: () => navigation.closeDrawer() },
    { icon: 'book', label: 'দুয়া', action: () => { navigation.navigate('Main', { screen: 'DuaTab' }); navigation.closeDrawer(); } },
    { icon: 'award', label: 'হজ্জ', action: () => navigation.closeDrawer() },
    { icon: 'coins', label: 'যাকাত', action: () => navigation.closeDrawer() },
    { icon: 'check-circle', label: 'কালেমা', action: () => navigation.closeDrawer() },
    { icon: 'clock', label: 'নামাজের সময়সূচী', action: () => { navigation.navigate('Main', { screen: 'PrayerTab' }); navigation.closeDrawer(); } },
    { icon: 'compass', label: 'কিবলা কম্পাস', action: () => navigation.closeDrawer() },
    { icon: 'calendar', label: 'ইসলামিক ক্যালেন্ডার', action: () => navigation.closeDrawer() },
    { icon: 'book', label: 'ইসলামিক বই', action: () => navigation.closeDrawer() },
    { icon: 'users', label: 'আমাদের কমিউনিটি', action: () => navigation.closeDrawer() },
    { icon: 'volume-2', label: 'কুরআন তেলাওয়াত', action: () => { navigation.navigate('Main', { screen: 'QuranTab' }); navigation.closeDrawer(); } },
    
    // সাধারণ সেবা
    { icon: 'settings', label: 'সেটিংস', action: () => navigation.closeDrawer() },
    { icon: 'bell', label: 'বিজ্ঞপ্তি', action: () => navigation.closeDrawer() },
    { icon: 'message-circle', label: 'প্রতিক্রিয়া', action: () => navigation.closeDrawer() },
    { icon: 'info', label: 'আমাদের সম্পর্কে', action: () => navigation.closeDrawer() },
    { icon: 'help-circle', label: 'সাহায্য ও সহায়তা', action: () => navigation.closeDrawer() },
    { icon: 'share-2', label: 'অ্যাপ শেয়ার করুন', action: () => navigation.closeDrawer() },
  ];

  return (
    <View style={[styles.drawerContainer, { backgroundColor: theme.backgroundRoot }]}>
      {/* Header */}
      <View style={[styles.drawerHeader, { backgroundColor: theme.primary }]}>
        <ThemedText style={styles.drawerTitle}>Smart Muslim</ThemedText>
        <ThemedText style={styles.drawerSubtitle}>আপনার ইসলামিক সঙ্গী</ThemedText>
      </View>

      {/* Menu Items - Scrollable */}
      <ScrollView 
        style={styles.menuItemsContainer}
        showsVerticalScrollIndicator={true}
        scrollIndicatorInsets={{ right: 1 }}
      >
        {menuItems.map((item: any, index: number) => (
          <Pressable
            key={index}
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={item.action}
          >
            <Feather name={item.icon as any} size={18} color={theme.primary} />
            <ThemedText style={[styles.menuItemLabel, { color: theme.text }]}>{item.label}</ThemedText>
          </Pressable>
        ))}
      </ScrollView>
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
          width: '50%',
        },
        drawerActiveTintColor: theme.primary,
        drawerInactiveTintColor: theme.textSecondary,
        sceneContainerStyle: {
          backgroundColor: 'transparent',
        },
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
    flexDirection: 'column',
  },
  drawerHeader: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: Spacing.sm,
  },
  drawerSubtitle: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.85,
  },
  menuItemsContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
});
