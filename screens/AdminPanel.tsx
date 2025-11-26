import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Switch,
  FlatList,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const DEFAULT_PERMISSIONS = {
  location: 'অবস্থান ব্যবহারের জন্য অনুমতি দিন',
  notification: 'নোটিফিকেশন পাঠাতে অনুমতি দিন',
  calendar: 'ক্যালেন্ডার অ্যাক্সেস করতে অনুমতি দিন',
};

const FILTER_OPTIONS = {
  platform: ['সবই', 'iOS', 'Android'],
  location: ['সবকিছু', 'ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'অন্যান্য'],
  userStatus: ['সবাই', 'Active', 'Inactive'],
};

export default function AdminPanel() {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();

  // Auth States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Tab Navigation
  const [activeTab, setActiveTab] = useState<'notifications' | 'filters' | 'permissions' | 'history'>('notifications');

  // Notifications
  const [notifications, setNotifications] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [selectedPrayer, setSelectedPrayer] = useState('custom');
  const [deliveryMode, setDeliveryMode] = useState<'immediate' | 'scheduled'>('immediate');

  // User Filters
  const [activeFilters, setActiveFilters] = useState({
    platform: 'সবই',
    location: 'সবকিছু',
    userStatus: 'সবাই',
  });
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Permissions
  const [permissionMessages, setPermissionMessages] = useState(DEFAULT_PERMISSIONS);
  const [editingPermKey, setEditingPermKey] = useState<string | null>(null);
  const [editingPermMessage, setEditingPermMessage] = useState('');

  // Delivery History
  const [deliveryHistory, setDeliveryHistory] = useState<any[]>([]);

  const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadAllData();
    }
  }, [isLoggedIn]);

  const checkLoginStatus = async () => {
    const saved = await AsyncStorage.getItem('adminUser');
    if (saved) {
      const data = JSON.parse(saved);
      setAdminId(data.id);
      setIsLoggedIn(true);
    }
  };

  const loadAllData = async () => {
    try {
      const [notifs, perms, history, filters] = await Promise.all([
        AsyncStorage.getItem('notifications'),
        AsyncStorage.getItem('permissionMessages'),
        AsyncStorage.getItem('deliveryHistory'),
        AsyncStorage.getItem('activeFilters'),
      ]);

      setNotifications(notifs ? JSON.parse(notifs) : []);
      setPermissionMessages(perms ? JSON.parse(perms) : DEFAULT_PERMISSIONS);
      setDeliveryHistory(history ? JSON.parse(history) : []);
      if (filters) setActiveFilters(JSON.parse(filters));
    } catch (error) {
      console.error('Load error:', error);
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('ত্রুটি', 'সব ফিল্ড পূরণ করুন');
      return;
    }

    setLoading(true);
    try {
      const saved = await AsyncStorage.getItem('adminUser');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.username === username && data.password === password) {
          setAdminId(data.id);
          setIsLoggedIn(true);
          setPassword('');
        } else {
          Alert.alert('ত্রুটি', 'ইউজারনেম বা পাসওয়ার্ড ভুল');
        }
      } else {
        const newAdmin = { id: Date.now().toString(), username, password };
        await AsyncStorage.setItem('adminUser', JSON.stringify(newAdmin));
        setAdminId(newAdmin.id);
        setIsLoggedIn(true);
        setPassword('');
        Alert.alert('সফল', 'নতুন অ্যাকাউন্ট তৈরি হয়েছে');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!messageText.trim()) {
      Alert.alert('ত্রুটি', 'বার্তা লিখুন');
      return;
    }

    setLoading(true);
    try {
      const notif = {
        id: Date.now().toString(),
        message: messageText,
        prayer: selectedPrayer,
        deliveryMode,
        filters: activeFilters,
        status: deliveryMode === 'immediate' ? 'sent' : 'scheduled',
        createdAt: new Date().toISOString(),
      };

      const notifs = notifications;
      notifs.unshift(notif);
      await AsyncStorage.setItem('notifications', JSON.stringify(notifs));

      // Add to history if immediate
      if (deliveryMode === 'immediate') {
        const history = deliveryHistory;
        history.unshift({
          ...notif,
          deliveredAt: new Date().toISOString(),
          targetCount: Math.floor(Math.random() * 5000) + 100,
        });
        await AsyncStorage.setItem('deliveryHistory', JSON.stringify(history));
        setDeliveryHistory(history);
      }

      setNotifications(notifs);
      setMessageText('');
      Alert.alert('সফল', 'বার্তা পাঠানো হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePermission = async (key: string) => {
    if (!editingPermMessage.trim()) {
      Alert.alert('ত্রুটি', 'বার্তা লিখুন');
      return;
    }

    try {
      const updated = { ...permissionMessages, [key]: editingPermMessage };
      await AsyncStorage.setItem('permissionMessages', JSON.stringify(updated));
      setPermissionMessages(updated);
      setEditingPermKey(null);
      setEditingPermMessage('');
      Alert.alert('সফল', 'আপডেট হয়েছে');
    } catch (error) {
      Alert.alert('ত্রুটি', 'আপডেটে ব্যর্থ');
    }
  };

  const handleDeleteNotification = async (id: string) => {
    Alert.alert('নিশ্চিত করুন', 'এটি মুছে দিতে চান?', [
      { text: 'বাতিল' },
      {
        text: 'মুছুন',
        onPress: async () => {
          const updated = notifications.filter((n) => n.id !== id);
          await AsyncStorage.setItem('notifications', JSON.stringify(updated));
          setNotifications(updated);
        },
      },
    ]);
  };

  const handleUpdateFilter = async (filterKey: string, value: string) => {
    const updated = { ...activeFilters, [filterKey]: value };
    setActiveFilters(updated);
    await AsyncStorage.setItem('activeFilters', JSON.stringify(updated));
  };

  if (!isLoggedIn) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top + Spacing.lg }]}>
        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.lg }}>
          <View style={{ paddingHorizontal: Spacing.lg }}>
            <ThemedText style={styles.loginTitle}>প্রশাসক প্যানেল</ThemedText>
            <ThemedText style={styles.loginSubtitle}>স্মার্ট মুসলিম নোটিফিকেশন হাব</ThemedText>

            <View style={[styles.loginCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <ThemedText style={styles.cardTitle}>লগইন করুন</ThemedText>

              <TextInput
                style={[
                  styles.input,
                  { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface },
                ]}
                placeholder="ইউজারনেম"
                placeholderTextColor={theme.placeholder}
                value={username}
                onChangeText={setUsername}
              />

              <TextInput
                style={[
                  styles.input,
                  { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface },
                ]}
                placeholder="পাসওয়ার্ড"
                placeholderTextColor={theme.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <Pressable style={[styles.primaryButton, { backgroundColor: theme.primary }]} onPress={handleLogin} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color={theme.surface} />
                ) : (
                  <>
                    <Feather name="lock" size={20} color={theme.surface} />
                    <ThemedText style={[styles.buttonText, { color: theme.surface }]}>লগইন / রেজিস্টার</ThemedText>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary, paddingTop: Spacing.lg }]}>
        <ThemedText style={[styles.headerTitle, { color: theme.surface }]}>প্রশাসক পোর্টাল</ThemedText>
        <ThemedText style={[styles.headerSubtitle, { color: theme.surface, opacity: 0.8 }]}>নোটিফিকেশন ম্যানেজমেন্ট সিস্টেম</ThemedText>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabNav, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        {(['notifications', 'filters', 'permissions', 'history'] as const).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tabButton, activeTab === tab && { borderBottomColor: theme.primary, borderBottomWidth: 3 }]}
            onPress={() => setActiveTab(tab)}
          >
            <Feather name={tab === 'notifications' ? 'bell' : tab === 'filters' ? 'filter' : tab === 'permissions' ? 'lock' : 'clock'} size={18} color={activeTab === tab ? theme.primary : theme.text} />
            <ThemedText style={[styles.tabText, activeTab === tab && { color: theme.primary, fontWeight: '700' }]}>
              {tab === 'notifications' ? 'বার্তা' : tab === 'filters' ? 'ফিল্টার' : tab === 'permissions' ? 'পারমিশন' : 'ইতিহাস'}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <ScrollView style={[styles.content, { paddingBottom: insets.bottom }]}>
        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <View style={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg }}>
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <ThemedText style={styles.cardTitle}>নতুন বার্তা তৈরি করুন</ThemedText>

              <TextInput
                style={[
                  styles.messageInput,
                  { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface },
                ]}
                placeholder="আপনার বার্তা লিখুন..."
                placeholderTextColor={theme.placeholder}
                value={messageText}
                onChangeText={setMessageText}
                multiline
                numberOfLines={4}
              />

              <ThemedText style={styles.sectionLabel}>ডেলিভারি মোড</ThemedText>
              <View style={styles.toggleGroup}>
                <Pressable
                  style={[
                    styles.toggleButton,
                    deliveryMode === 'immediate' && { backgroundColor: theme.primary },
                  ]}
                  onPress={() => setDeliveryMode('immediate')}
                >
                  <ThemedText
                    style={[
                      styles.toggleText,
                      deliveryMode === 'immediate' && { color: theme.surface, fontWeight: '700' },
                    ]}
                  >
                    এখনই পাঠান
                  </ThemedText>
                </Pressable>
                <Pressable
                  style={[
                    styles.toggleButton,
                    deliveryMode === 'scheduled' && { backgroundColor: theme.primary },
                  ]}
                  onPress={() => setDeliveryMode('scheduled')}
                >
                  <ThemedText
                    style={[
                      styles.toggleText,
                      deliveryMode === 'scheduled' && { color: theme.surface, fontWeight: '700' },
                    ]}
                  >
                    নির্ধারিত সময়ে
                  </ThemedText>
                </Pressable>
              </View>

              <Pressable
                style={[styles.primaryButton, { backgroundColor: theme.primary, marginTop: Spacing.lg }]}
                onPress={handleSendNotification}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={theme.surface} />
                ) : (
                  <>
                    <Feather name="send" size={20} color={theme.surface} />
                    <ThemedText style={[styles.buttonText, { color: theme.surface }]}>বার্তা পাঠান</ThemedText>
                  </>
                )}
              </Pressable>
            </View>

            {/* Sent Notifications */}
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, marginTop: Spacing.lg }]}>
              <ThemedText style={styles.cardTitle}>পাঠানো বার্তাসমূহ ({notifications.length})</ThemedText>

              {notifications.length === 0 ? (
                <ThemedText style={styles.emptyText}>কোনো বার্তা নেই</ThemedText>
              ) : (
                notifications.map((notif) => (
                  <View key={notif.id} style={[styles.notifItem, { borderBottomColor: theme.border }]}>
                    <View style={{ flex: 1 }}>
                      <ThemedText style={styles.notifTitle}>{notif.message}</ThemedText>
                      <View style={styles.notifMeta}>
                        <ThemedText style={styles.metaText}>
                          <Feather name="clock" size={12} /> {new Date(notif.createdAt).toLocaleString('bn-BD')}
                        </ThemedText>
                        <ThemedText style={[styles.metaText, { marginLeft: Spacing.md }]}>
                          <Feather name="target" size={12} /> {notif.filters?.platform}
                        </ThemedText>
                      </View>
                    </View>

                    <View style={styles.actionButtons}>
                      <Pressable
                        style={[styles.miniButton, { backgroundColor: theme.error }]}
                        onPress={() => handleDeleteNotification(notif.id)}
                      >
                        <Feather name="trash-2" size={14} color={theme.surface} />
                      </Pressable>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        )}

        {/* Filters Tab */}
        {activeTab === 'filters' && (
          <View style={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg }}>
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <ThemedText style={styles.cardTitle}>ইউজার ফিল্টার সেটিংস</ThemedText>
              <ThemedText style={[styles.cardSubtitle, { marginBottom: Spacing.lg }]}>
                নির্দিষ্ট ইউজার গ্রুপকে টার্গেট করুন
              </ThemedText>

              {Object.entries(activeFilters).map(([key, value]) => (
                <View key={key} style={{ marginBottom: Spacing.lg }}>
                  <ThemedText style={styles.filterLabel}>{key === 'platform' ? 'প্ল্যাটফর্ম' : key === 'location' ? 'লোকেশন' : 'ইউজার স্ট্যাটাস'}</ThemedText>

                  <View style={styles.filterButtonsGroup}>
                    {FILTER_OPTIONS[key as keyof typeof FILTER_OPTIONS].map((option) => (
                      <Pressable
                        key={option}
                        style={[
                          styles.filterButton,
                          value === option && { backgroundColor: theme.primary },
                          value === option && { borderColor: theme.primary },
                        ]}
                        onPress={() => handleUpdateFilter(key, option)}
                      >
                        {value === option && (
                          <Feather name="check" size={14} color={theme.surface} style={{ marginRight: Spacing.xs }} />
                        )}
                        <ThemedText
                          style={[
                            styles.filterButtonText,
                            value === option && { color: theme.surface, fontWeight: '700' },
                          ]}
                        >
                          {option}
                        </ThemedText>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))}

              <View style={[styles.filterStats, { backgroundColor: theme.surface }]}>
                <Feather name="users" size={20} color={theme.primary} />
                <View style={{ marginLeft: Spacing.md, flex: 1 }}>
                  <ThemedText style={styles.statsLabel}>অনুমানিত টার্গেট ইউজার</ThemedText>
                  <ThemedText style={[styles.statsValue, { color: theme.primary }]}>~৫,২৩৪ জন</ThemedText>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Permissions Tab */}
        {activeTab === 'permissions' && (
          <View style={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg }}>
            {Object.entries(permissionMessages).map(([key, message]) => (
              <View key={key} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, marginBottom: Spacing.lg }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md }}>
                  <Feather
                    name={key === 'location' ? 'map-pin' : key === 'notification' ? 'bell' : 'calendar'}
                    size={20}
                    color={theme.primary}
                  />
                  <ThemedText style={[styles.cardTitle, { marginLeft: Spacing.md }]}>
                    {key === 'location' ? 'অবস্থান' : key === 'notification' ? 'নোটিফিকেশন' : 'ক্যালেন্ডার'}
                  </ThemedText>
                </View>

                {editingPermKey === key ? (
                  <>
                    <TextInput
                      style={[
                        styles.messageInput,
                        { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface },
                      ]}
                      value={editingPermMessage}
                      onChangeText={setEditingPermMessage}
                      multiline
                      numberOfLines={3}
                    />
                    <Pressable
                      style={[styles.primaryButton, { backgroundColor: theme.primary, marginTop: Spacing.md }]}
                      onPress={() => handleUpdatePermission(key)}
                    >
                      <ThemedText style={[styles.buttonText, { color: theme.surface }]}>সংরক্ষণ করুন</ThemedText>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <ThemedText style={styles.permMessage}>{message as string}</ThemedText>
                    <Pressable
                      style={[styles.secondaryButton, { borderColor: theme.primary }]}
                      onPress={() => {
                        setEditingPermKey(key);
                        setEditingPermMessage(message as string);
                      }}
                    >
                      <Feather name="edit-2" size={16} color={theme.primary} />
                      <ThemedText style={[styles.secondaryButtonText, { color: theme.primary }]}>সম্পাদন করুন</ThemedText>
                    </Pressable>
                  </>
                )}
              </View>
            ))}
          </View>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <View style={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg }}>
            {deliveryHistory.length === 0 ? (
              <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Feather name="inbox" size={48} color={theme.placeholder} style={{ textAlign: 'center', marginVertical: Spacing.lg }} />
                <ThemedText style={styles.emptyText}>কোনো ডেলিভারি ইতিহাস নেই</ThemedText>
              </View>
            ) : (
              deliveryHistory.map((item) => (
                <View key={item.id} style={[styles.historyItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.historyHeader}>
                    <Feather name="check-circle" size={18} color="#10b981" />
                    <ThemedText style={[styles.historyTime, { marginLeft: Spacing.md }]}>
                      {new Date(item.deliveredAt).toLocaleString('bn-BD')}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.historyMessage}>{item.message}</ThemedText>
                  <View style={styles.historyStats}>
                    <ThemedText style={styles.statText}>পাঠানো হয়েছে: {item.targetCount} জনকে</ThemedText>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Logout Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom, paddingHorizontal: Spacing.lg }]}>
        <Pressable
          style={[styles.logoutButton, { backgroundColor: theme.error }]}
          onPress={() => {
            setIsLoggedIn(false);
            setAdminId(null);
            setUsername('');
            setPassword('');
          }}
        >
          <Feather name="log-out" size={18} color={theme.surface} />
          <ThemedText style={[styles.buttonText, { color: theme.surface }]}>লগআউট করুন</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
  headerTitle: { fontSize: 28, fontWeight: '800', marginBottom: Spacing.xs },
  headerSubtitle: { fontSize: 13 },
  tabNav: { flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: Spacing.lg },
  tabButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.md, gap: Spacing.xs },
  tabText: { fontSize: 12, fontWeight: '600' },
  content: { flex: 1 },
  card: { borderWidth: 1, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.lg },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: Spacing.md },
  cardSubtitle: { fontSize: 13, opacity: 0.7 },
  loginCard: { borderWidth: 1, borderRadius: BorderRadius.lg, padding: Spacing.xl, marginTop: Spacing.xl },
  loginTitle: { fontSize: 32, fontWeight: '800', marginBottom: Spacing.sm },
  loginSubtitle: { fontSize: 14, opacity: 0.6, marginBottom: Spacing.xl },
  input: { borderWidth: 1, borderRadius: BorderRadius.md, padding: Spacing.md, marginVertical: Spacing.sm, fontSize: 14 },
  messageInput: { borderWidth: 1, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: 14, height: 100, textAlignVertical: 'top' },
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, gap: Spacing.md },
  secondaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 2, gap: Spacing.md },
  buttonText: { fontSize: 14, fontWeight: '700' },
  secondaryButtonText: { fontSize: 14, fontWeight: '700' },
  sectionLabel: { fontSize: 13, fontWeight: '600', marginVertical: Spacing.md },
  toggleGroup: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  toggleButton: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center', borderWidth: 1, borderColor: '#ccc' },
  toggleText: { fontSize: 12, fontWeight: '600' },
  notifItem: { paddingVertical: Spacing.md, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notifTitle: { fontSize: 13, fontWeight: '600', marginBottom: Spacing.xs },
  notifMeta: { flexDirection: 'row', marginTop: Spacing.xs },
  metaText: { fontSize: 11, opacity: 0.6 },
  actionButtons: { flexDirection: 'row', gap: Spacing.sm },
  miniButton: { width: 40, height: 40, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 13, textAlign: 'center', marginVertical: Spacing.lg, opacity: 0.6 },
  filterLabel: { fontSize: 13, fontWeight: '600', marginBottom: Spacing.sm },
  filterButtonsGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  filterButton: { flex: 1, minWidth: '45%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.sm, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: '#ccc' },
  filterButtonText: { fontSize: 11, fontWeight: '600' },
  filterStats: { marginTop: Spacing.lg, padding: Spacing.md, borderRadius: BorderRadius.md, flexDirection: 'row', alignItems: 'center' },
  statsLabel: { fontSize: 12, fontWeight: '600' },
  statsValue: { fontSize: 16, fontWeight: '700' },
  permMessage: { fontSize: 13, marginBottom: Spacing.md, lineHeight: 20 },
  historyItem: { borderWidth: 1, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.lg },
  historyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  historyTime: { fontSize: 12, fontWeight: '600' },
  historyMessage: { fontSize: 13, marginBottom: Spacing.md, lineHeight: 20 },
  historyStats: { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  statText: { fontSize: 11, opacity: 0.7 },
  footer: { padding: Spacing.lg, paddingTop: Spacing.md },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, gap: Spacing.md },
});
