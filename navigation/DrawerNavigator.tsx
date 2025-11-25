import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import MainTabNavigator from '@/navigation/MainTabNavigator';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { useMenuOrder } from '@/hooks/useMenuOrder';

export type DrawerParamList = {
  Main: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

interface DrawerContentProps {
  navigation: any;
}

interface MenuItem {
  id: string;
  icon: string;
  label: string;
  action: string;
}

const DraggableMenuItem = ({ 
  item, 
  index, 
  menuItems,
  onReorder,
  onPress,
  theme 
}: {
  item: MenuItem;
  index: number;
  menuItems: MenuItem[];
  onReorder: (from: number, to: number) => void;
  onPress: () => void;
  theme: any;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    translateY.value = 0;
  };

  return (
    <Animated.View style={[animatedStyle]}>
      <Pressable
        style={[
          styles.menuItem,
          { borderBottomColor: theme.border },
          isDragging && { backgroundColor: theme.primary, opacity: 0.2 }
        ]}
        onPress={onPress}
        onLongPress={handleDragStart}
      >
        <View style={styles.dragHandle}>
          <Feather name="menu" size={16} color={theme.primary} />
        </View>
        <Feather name={item.icon as any} size={18} color={theme.primary} />
        <ThemedText style={[styles.menuItemLabel, { color: theme.text }]}>
          {item.label}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
};

const DrawerContent = ({ navigation }: DrawerContentProps) => {
  const { theme } = useAppTheme();
  const { menuItems, reorderMenu } = useMenuOrder();

  const handleMenuItemPress = (item: MenuItem) => {
    if (item.action === 'home') {
      navigation.navigate('Main', { screen: 'HomeTab' });
    } else if (item.action === 'dua') {
      navigation.navigate('Main', { screen: 'DuaTab' });
    } else if (item.action === 'prayer-time') {
      navigation.navigate('Main', { screen: 'PrayerTab' });
    } else if (item.action === 'quran-recitation') {
      navigation.navigate('Main', { screen: 'QuranTab' });
    }
    
    navigation.closeDrawer();
  };

  return (
    <View style={[styles.drawerContainer, { backgroundColor: theme.backgroundRoot }]}>
      {/* Header */}
      <View style={[styles.drawerHeader, { backgroundColor: theme.primary }]}>
        <ThemedText style={styles.drawerTitle}>Smart Muslim</ThemedText>
        <ThemedText style={styles.drawerSubtitle}>আপনার ইসলামিক সঙ্গী</ThemedText>
      </View>

      {/* Menu Items - Scrollable with Drag Support */}
      <ScrollView 
        style={styles.menuItemsContainer}
        showsVerticalScrollIndicator={true}
        scrollIndicatorInsets={{ right: 1 }}
        scrollEnabled={true}
      >
        {menuItems.map((item: MenuItem, index: number) => (
          <DraggableMenuItem
            key={item.id}
            item={item}
            index={index}
            menuItems={menuItems}
            onReorder={(from, to) => reorderMenu(from, to)}
            onPress={() => handleMenuItemPress(item)}
            theme={theme}
          />
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
  dragHandle: {
    marginRight: Spacing.xs,
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
});
