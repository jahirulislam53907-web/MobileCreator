import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import MainTabNavigator from '@/navigation/MainTabNavigator';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { useMenuOrder } from '@/hooks/useMenuOrder';

export type DrawerParamList = {
  Main: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

interface MenuItem {
  id: string;
  icon: string;
  label: string;
  action: string;
}

interface DraggableMenuItemProps {
  item: MenuItem;
  index: number;
  menuItems: MenuItem[];
  onReorder: (from: number, to: number) => void;
  onPress: () => void;
  theme: any;
}

const DraggableMenuItem = ({ 
  item, 
  index, 
  menuItems,
  onReorder,
  onPress,
  theme 
}: DraggableMenuItemProps) => {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
    zIndex: isDragging ? 1000 : 0,
    elevation: isDragging ? 10 : 0,
  }));

  const handleBulletPress = () => {
    // Haptic feedback on bullet tap
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Zoom in on tap
    setIsZoomed(true);
    scale.value = withSpring(1.05, {
      damping: 10,
      mass: 1,
      stiffness: 100,
    });
  };

  const handleDragGesture = Gesture.Pan()
    .onStart(() => {
      setIsDragging(true);
    })
    .onChange((e) => {
      translateY.value = e.translationY;
    })
    .onEnd((e) => {
      const itemHeight = 60;
      const displacement = Math.round(e.translationY / itemHeight);
      
      if (displacement !== 0) {
        let newIndex = index + displacement;
        newIndex = Math.max(0, Math.min(newIndex, menuItems.length - 1));
        
        if (newIndex !== index) {
          onReorder(index, newIndex);
        }
      }
      
      translateY.value = withSpring(0, {
        damping: 10,
        mass: 1,
        stiffness: 100,
      });
      
      if (isZoomed) {
        scale.value = withSpring(1.05, {
          damping: 10,
          mass: 1,
          stiffness: 100,
        });
      } else {
        scale.value = withSpring(1, {
          damping: 10,
          mass: 1,
          stiffness: 100,
        });
      }
      
      setIsDragging(false);
    });

  const handleItemPress = () => {
    if (!isZoomed) {
      onPress();
    } else {
      setIsZoomed(false);
      scale.value = withSpring(1, {
        damping: 10,
        mass: 1,
        stiffness: 100,
      });
    }
  };

  return (
    <GestureDetector gesture={handleDragGesture}>
      <Animated.View style={[animatedStyle]}>
        <Pressable
          style={[
            styles.menuItem,
            { borderBottomColor: theme.border },
            isDragging && { 
              backgroundColor: theme.primary, 
              opacity: 0.15,
              borderRadius: BorderRadius.md,
              marginHorizontal: Spacing.md,
            }
          ]}
          onPress={handleItemPress}
        >
          <Feather name={item.icon as any} size={18} color={theme.primary} />
          <ThemedText style={[styles.menuItemLabel, { color: theme.text }]}>
            {item.label}
          </ThemedText>
          <Pressable 
            style={styles.dragHandle}
            onPress={handleBulletPress}
          >
            <View style={[styles.bulletIcon, { backgroundColor: theme.primary }]} />
          </Pressable>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
};

const DrawerContent = ({ navigation }: { navigation: any }) => {
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
    minHeight: 60,
  },
  dragHandle: {
    marginLeft: 'auto',
    paddingLeft: Spacing.md,
    padding: Spacing.sm,
  },
  bulletIcon: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
});
