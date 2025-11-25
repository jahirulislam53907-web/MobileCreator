import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, StyleSheet, Pressable, ScrollView, GestureResponderEvent } from 'react-native';
import { Feather } from '@expo/vector-icons';
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

const DrawerContent = ({ navigation }: DrawerContentProps) => {
  const { theme } = useAppTheme();
  const { menuItems, reorderMenu } = useMenuOrder();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isReorderMode, setIsReorderMode] = useState(false);

  const handleMenuItemPress = (item: any) => {
    if (isReorderMode) return;
    
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

  const handleLongPress = (index: number) => {
    setDraggedIndex(index);
    setIsReorderMode(true);
  };

  const handleSwapUp = (index: number) => {
    if (index > 0) {
      reorderMenu(index, index - 1);
    }
  };

  const handleSwapDown = (index: number) => {
    if (index < menuItems.length - 1) {
      reorderMenu(index, index + 1);
    }
  };

  const handleDoneReordering = () => {
    setDraggedIndex(null);
    setIsReorderMode(false);
  };

  return (
    <View style={[styles.drawerContainer, { backgroundColor: theme.backgroundRoot }]}>
      {/* Header */}
      <View style={[styles.drawerHeader, { backgroundColor: theme.primary }]}>
        <ThemedText style={styles.drawerTitle}>Smart Muslim</ThemedText>
        <ThemedText style={styles.drawerSubtitle}>আপনার ইসলামিক সঙ্গী</ThemedText>
      </View>

      {/* Reorder Mode Toggle */}
      {!isReorderMode && (
        <Pressable 
          style={[styles.reorderToggle, { backgroundColor: theme.primary }]}
          onPress={() => setIsReorderMode(true)}
        >
          <Feather name="move" size={16} color="#fff" />
          <ThemedText style={styles.reorderToggleText}>সাজাতে টাচ করুন</ThemedText>
        </Pressable>
      )}

      {/* Menu Items - Scrollable */}
      <ScrollView 
        style={styles.menuItemsContainer}
        showsVerticalScrollIndicator={true}
        scrollIndicatorInsets={{ right: 1 }}
      >
        {menuItems.map((item: any, index: number) => (
          <View key={item.id}>
            {isReorderMode && draggedIndex === index && (
              <View style={[styles.reorderButtonsRow]}>
                <Pressable 
                  style={[styles.reorderButton, { backgroundColor: theme.primary, opacity: index === 0 ? 0.5 : 1 }]}
                  onPress={() => handleSwapUp(index)}
                  disabled={index === 0}
                >
                  <Feather name="arrow-up" size={16} color="#fff" />
                </Pressable>
                <Pressable 
                  style={[styles.reorderButton, { backgroundColor: theme.primary, opacity: index === menuItems.length - 1 ? 0.5 : 1 }]}
                  onPress={() => handleSwapDown(index)}
                  disabled={index === menuItems.length - 1}
                >
                  <Feather name="arrow-down" size={16} color="#fff" />
                </Pressable>
              </View>
            )}
            
            <Pressable
              style={[
                styles.menuItem, 
                { borderBottomColor: theme.border },
                draggedIndex === index && isReorderMode && { backgroundColor: theme.primary, opacity: 0.3 }
              ]}
              onPress={() => !isReorderMode && handleMenuItemPress(item)}
              onLongPress={() => handleLongPress(index)}
            >
              <Feather name={item.icon as any} size={18} color={theme.primary} />
              <ThemedText style={[styles.menuItemLabel, { color: theme.text }]}>{item.label}</ThemedText>
              {isReorderMode && (
                <Feather name="menu" size={16} color={theme.textSecondary} style={styles.dragHandle} />
              )}
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {/* Done Button in Reorder Mode */}
      {isReorderMode && (
        <Pressable 
          style={[styles.doneButton, { backgroundColor: theme.primary }]}
          onPress={handleDoneReordering}
        >
          <ThemedText style={styles.doneButtonText}>সম্পন্ন</ThemedText>
        </Pressable>
      )}
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
  reorderToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  reorderToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
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
    flex: 1,
  },
  dragHandle: {
    marginLeft: 'auto',
  },
  reorderButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  reorderButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  doneButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
