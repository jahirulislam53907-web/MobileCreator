import React from 'react';
import { View, Pressable, StyleSheet, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from './ThemedText';
import { Spacing, BorderRadius } from '@/constants/theme';

export interface TopNavigationBarProps {
  activeTab?: 'Home' | 'Prayer' | 'Quran' | 'Dua' | 'More';
}

export const TopNavigationBar: React.FC<TopNavigationBarProps> = ({ activeTab = 'Home' }) => {
  const { theme, isDark } = useAppTheme();
  const navigation = useNavigation<any>();

  const tabs = [
    { id: 'Home', label: 'হোম', icon: 'home' },
    { id: 'Prayer', label: 'নামাজ', icon: 'clock' },
    { id: 'Quran', label: 'কুরআন', icon: 'book-open' },
    { id: 'Dua', label: 'দুয়া', icon: 'book' },
    { id: 'More', label: 'আরও', icon: 'menu' },
  ];

  const handleTabPress = (tabId: string) => {
    if (tabId === 'Home') navigation.navigate('HomeTab');
    else if (tabId === 'Prayer') navigation.navigate('PrayerTab');
    else if (tabId === 'Quran') navigation.navigate('QuranTab');
    else if (tabId === 'Dua') navigation.navigate('DuaTab');
    else if (tabId === 'More') navigation.navigate('MoreTab');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot, borderBottomColor: theme.border }]}>
      {/* Left: Mosque Icon */}
      <Image 
        source={require('@/assets/menu-icons/mosque_minaret_icon.png')}
        style={[styles.mosqueIcon, { tintColor: theme.primary }]}
      />

      {/* Hamburger Menu */}
      <Pressable 
        style={styles.hamburger}
        onPress={() => navigation.toggleDrawer()}
      >
        <Feather name="menu" size={24} color={theme.text} />
      </Pressable>

      {/* Logo */}
      <View style={styles.logoSection}>
        <ThemedText style={[styles.logo, { color: theme.primary }]}>Smart Muslim</ThemedText>
      </View>

      {/* Middle: Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => handleTabPress(tab.id)}
            style={[
              styles.tab,
              activeTab === tab.id && { borderBottomColor: theme.primary, borderBottomWidth: 3 }
            ]}
          >
            <Feather name={tab.icon as any} size={18} color={activeTab === tab.id ? theme.primary : theme.textSecondary} />
            <ThemedText style={[
              styles.tabLabel,
              { color: activeTab === tab.id ? theme.primary : theme.textSecondary }
            ]}>
              {tab.label}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      {/* Right: Icons */}
      <View style={styles.iconSection}>
        <Pressable style={styles.iconBtn}>
          <Feather name="bell" size={20} color={theme.text} />
        </Pressable>
        <Pressable 
          style={styles.iconBtn}
          onPress={() => navigation.navigate('MoreTab')}
        >
          <Feather name="user" size={20} color={theme.text} />
        </Pressable>
        <Pressable 
          style={styles.iconBtn}
          onPress={() => {
            if (navigation.navigate) {
              navigation.navigate('MoreTab', { screen: 'Settings' });
            }
          }}
        >
          <Feather name="settings" size={20} color={theme.text} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  mosqueIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: Spacing.sm,
  },
  hamburger: {
    padding: Spacing.sm,
    marginRight: Spacing.md,
  },
  logoSection: {
    minWidth: 120,
  },
  logo: {
    fontSize: 16,
    fontWeight: '700',
  },
  tabsScroll: {
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  tabsContent: {
    alignItems: 'center',
    gap: Spacing.lg,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  iconSection: {
    flexDirection: 'row',
    gap: Spacing.md,
    minWidth: 100,
  },
  iconBtn: {
    padding: Spacing.sm,
  },
});
