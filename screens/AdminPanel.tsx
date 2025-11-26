import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdminPanel() {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [tab, setTab] = useState<'azan' | 'custom' | 'permissions'>('custom');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [permissionMessages, setPermissionMessages] = useState<any>({});
  
  const [prayerName, setPrayerName] = useState('fajr');
  const [message, setMessage] = useState('');
  const [deliveryMode, setDeliveryMode] = useState<'prayer-time' | 'immediate'>('immediate');
  const [targetPlatform, setTargetPlatform] = useState<'all' | 'ios' | 'android'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPermKey, setEditingPermKey] = useState<string | null>(null);
  const [editingPermMessage, setEditingPermMessage] = useState('');

  const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const defaultPermissions = {
    location: 'অবস্থান ব্যবহারের জন্য অনুমতি দিন',
    notification: 'নোটিফিকেশন পাঠাতে অনুমতি দিন',
    calendar: 'ক্যালেন্ডার অ্যাক্সেস করতে অনুমতি দিন'
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
      fetchPermissionMessages();
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
        Alert.alert('সফল', 'অ্যাকাউন্ট তৈরি হয়েছে');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await AsyncStorage.getItem('notifications');
      setNotifications(data ? JSON.parse(data) : []);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchPermissionMessages = async () => {
    try {
      const data = await AsyncStorage.getItem('permissionMessages');
      setPermissionMessages(data ? JSON.parse(data) : defaultPermissions);
    } catch (error) {
      setPermissionMessages(defaultPermissions);
    }
  };

  const handleCreateNotification = async () => {
    if (!message.trim()) {
      Alert.alert('ত্রুটি', 'বার্তা লিখুন');
      return;
    }

    setLoading(true);
    try {
      const notif = {
        id: Date.now().toString(),
        admin_id: adminId,
        type: tab === 'azan' ? 'azan' : 'custom',
        prayer_name: tab === 'azan' ? prayerName : null,
        message,
        delivery_mode: deliveryMode,
        target_platform: targetPlatform,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const data = await AsyncStorage.getItem('notifications');
      const notifs = data ? JSON.parse(data) : [];
      notifs.unshift(notif);
      await AsyncStorage.setItem('notifications', JSON.stringify(notifs));

      Alert.alert('সফল', 'বিজ্ঞপ্তি তৈরি হয়েছে');
      setMessage('');
      fetchNotifications();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNotification = async (id: string) => {
    if (!message.trim()) {
      Alert.alert('ত্রুটি', 'বার্তা লিখুন');
      return;
    }

    setLoading(true);
    try {
      const data = await AsyncStorage.getItem('notifications');
      const notifs = data ? JSON.parse(data) : [];
      const idx = notifs.findIndex((n: any) => n.id === id);
      
      if (idx !== -1) {
        notifs[idx] = {
          ...notifs[idx],
          message,
          delivery_mode: deliveryMode,
          target_platform: targetPlatform,
          prayer_name: prayerName
        };
        await AsyncStorage.setItem('notifications', JSON.stringify(notifs));
        Alert.alert('সফল', 'বিজ্ঞপ্তি আপডেট হয়েছে');
        setMessage('');
        setEditingId(null);
        fetchNotifications();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    Alert.alert('নিশ্চিত করুন', 'এটি মুছে দিতে চান?', [
      { text: 'বাতিল' },
      {
        text: 'মুছুন',
        onPress: async () => {
          const data = await AsyncStorage.getItem('notifications');
          let notifs = data ? JSON.parse(data) : [];
          notifs = notifs.filter((n: any) => n.id !== id);
          await AsyncStorage.setItem('notifications', JSON.stringify(notifs));
          fetchNotifications();
        }
      }
    ]);
  };

  const handleUpdatePermission = async (key: string) => {
    if (!editingPermMessage.trim()) {
      Alert.alert('ত্রুটি', 'বার্তা লিখুন');
      return;
    }

    try {
      const updated = { ...permissionMessages, [key]: editingPermMessage };
      await AsyncStorage.setItem('permissionMessages', JSON.stringify(updated));
      Alert.alert('সফল', 'আপডেট হয়েছে');
      setEditingPermKey(null);
      setEditingPermMessage('');
      fetchPermissionMessages();
    } catch (error) {
      Alert.alert('ত্রুটি', 'আপডেটে ব্যর্থ');
    }
  };

  if (!isLoggedIn) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top + Spacing.lg, paddingBottom: insets.bottom + Spacing.lg }]}>
        <ThemedText style={styles.title}>প্রশাসক প্যানেল</ThemedText>
        
        <View style={styles.form}>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
            placeholder="ইউজারনেম"
            placeholderTextColor={theme.placeholder}
            value={username}
            onChangeText={setUsername}
          />
          
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
            placeholder="পাসওয়ার্ড"
            placeholderTextColor={theme.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <Pressable style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color={theme.surface} /> : <ThemedText style={styles.buttonText}>লগইন / রেজিস্টার</ThemedText>}
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  const filteredNotifs = notifications.filter(n => {
    if (tab === 'azan') return n.type === 'azan';
    if (tab === 'custom') return n.type === 'custom';
    return true;
  });

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top + Spacing.lg }]}>
      <View style={{ paddingHorizontal: Spacing.lg, paddingBottom: insets.bottom + Spacing.lg }}>
        <ThemedText style={styles.title}>প্রশাসক প্যানেল</ThemedText>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(['custom', 'azan', 'permissions'] as const).map(t => (
            <Pressable
              key={t}
              style={[styles.tab, tab === t && { backgroundColor: theme.primary }]}
              onPress={() => setTab(t)}
            >
              <ThemedText style={[styles.tabText, tab === t && { color: theme.surface }]}>
                {t === 'custom' ? 'কাস্টম' : t === 'azan' ? 'আজান' : 'পারমিশন'}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        {/* Create/Edit Form */}
        {(tab === 'custom' || tab === 'azan') && (
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <ThemedText style={styles.sectionTitle}>
              {editingId ? 'বিজ্ঞপ্তি সম্পাদন করুন' : 'নতুন বিজ্ঞপ্তি তৈরি করুন'}
            </ThemedText>

            {tab === 'azan' && (
              <>
                <ThemedText style={styles.label}>নামাজ নির্বাচন করুন</ThemedText>
                <View style={styles.grid}>
                  {prayers.map(p => (
                    <Pressable
                      key={p}
                      style={[styles.gridButton, prayerName === p && { backgroundColor: theme.primary }]}
                      onPress={() => setPrayerName(p)}
                    >
                      <ThemedText style={[styles.gridButtonText, prayerName === p && { color: theme.surface }]}>
                        {p.toUpperCase()}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            <ThemedText style={styles.label}>বার্তা</ThemedText>
            <TextInput
              style={[styles.messageInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
              placeholder="বার্তা লিখুন..."
              placeholderTextColor={theme.placeholder}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={3}
            />

            <ThemedText style={styles.label}>ডেলিভারি মোড</ThemedText>
            <View style={styles.grid}>
              {(['immediate', 'prayer-time'] as const).map(m => (
                <Pressable
                  key={m}
                  style={[styles.gridButton, deliveryMode === m && { backgroundColor: theme.primary }]}
                  onPress={() => setDeliveryMode(m)}
                >
                  <ThemedText style={[styles.gridButtonText, deliveryMode === m && { color: theme.surface }]}>
                    {m === 'immediate' ? 'এখনই' : 'নামাজে'}
                  </ThemedText>
                </Pressable>
              ))}
            </View>

            <ThemedText style={styles.label}>প্ল্যাটফর্ম</ThemedText>
            <View style={styles.grid}>
              {(['all', 'ios', 'android'] as const).map(p => (
                <Pressable
                  key={p}
                  style={[styles.gridButton, targetPlatform === p && { backgroundColor: theme.primary }]}
                  onPress={() => setTargetPlatform(p)}
                >
                  <ThemedText style={[styles.gridButtonText, targetPlatform === p && { color: theme.surface }]}>
                    {p === 'all' ? 'সবই' : p.toUpperCase()}
                  </ThemedText>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={() => editingId ? handleUpdateNotification(editingId) : handleCreateNotification()}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color={theme.surface} /> : <ThemedText style={styles.buttonText}>{editingId ? 'আপডেট করুন' : 'তৈরি করুন'}</ThemedText>}
            </Pressable>

            {editingId && (
              <Pressable style={[styles.button, { backgroundColor: theme.error }]} onPress={() => { setEditingId(null); setMessage(''); }}>
                <ThemedText style={styles.buttonText}>বাতিল করুন</ThemedText>
              </Pressable>
            )}
          </View>
        )}

        {/* Permissions Management */}
        {tab === 'permissions' && (
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <ThemedText style={styles.sectionTitle}>পারমিশন বার্তা সম্পাদন করুন</ThemedText>

            {Object.entries(permissionMessages).map(([key, msg]) => (
              <View key={key} style={{ marginBottom: Spacing.lg }}>
                <ThemedText style={styles.label}>{key}</ThemedText>
                {editingPermKey === key ? (
                  <>
                    <TextInput
                      style={[styles.messageInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
                      value={editingPermMessage}
                      onChangeText={setEditingPermMessage}
                      multiline
                    />
                    <Pressable style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => handleUpdatePermission(key)}>
                      <ThemedText style={styles.buttonText}>সংরক্ষণ করুন</ThemedText>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <ThemedText style={{ fontSize: 13, marginVertical: Spacing.sm }}>{msg as string}</ThemedText>
                    <Pressable style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => { setEditingPermKey(key); setEditingPermMessage(msg as string); }}>
                      <ThemedText style={styles.buttonText}>সম্পাদন করুন</ThemedText>
                    </Pressable>
                  </>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Notifications List */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText style={styles.sectionTitle}>বিজ্ঞপ্তির তালিকা ({filteredNotifs.length})</ThemedText>

          {filteredNotifs.length === 0 ? (
            <ThemedText style={styles.emptyText}>কোনো বিজ্ঞপ্তি নেই</ThemedText>
          ) : (
            filteredNotifs.map(notif => (
              <View key={notif.id} style={[styles.notifItem, { borderBottomColor: theme.border }]}>
                <ThemedText style={{ fontSize: 13, fontWeight: '600' }}>{notif.prayer_name?.toUpperCase() || 'কাস্টম'}</ThemedText>
                <ThemedText style={{ fontSize: 12, marginVertical: Spacing.xs }}>{notif.message}</ThemedText>
                <ThemedText style={{ fontSize: 11, opacity: 0.7 }}>
                  {notif.delivery_mode === 'immediate' ? 'এখনই' : 'নামাজে'} • {notif.target_platform}
                </ThemedText>

                <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md }}>
                  <Pressable style={[styles.smallButton, { backgroundColor: theme.primary }]} onPress={() => { setEditingId(notif.id); setMessage(notif.message); setPrayerName(notif.prayer_name); setDeliveryMode(notif.delivery_mode); setTargetPlatform(notif.target_platform); }}>
                    <ThemedText style={[styles.smallButtonText, { color: theme.surface }]}>সম্পাদন</ThemedText>
                  </Pressable>
                  <Pressable style={[styles.smallButton, { backgroundColor: theme.error }]} onPress={() => handleDeleteNotification(notif.id)}>
                    <ThemedText style={[styles.smallButtonText, { color: theme.surface }]}>মুছুন</ThemedText>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Logout */}
        <Pressable style={[styles.button, { backgroundColor: theme.error, marginBottom: Spacing.xl }]} onPress={() => { setIsLoggedIn(false); setAdminId(null); setUsername(''); setPassword(''); }}>
          <ThemedText style={styles.buttonText}>লগআউট করুন</ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: Spacing.lg },
  form: { marginHorizontal: Spacing.lg },
  input: { borderWidth: 1, borderRadius: BorderRadius.md, padding: Spacing.md, marginVertical: Spacing.sm },
  messageInput: { borderWidth: 1, borderRadius: BorderRadius.md, padding: Spacing.md, height: 80, textAlignVertical: 'top', marginVertical: Spacing.sm },
  button: { paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginTop: Spacing.md },
  buttonText: { fontSize: 16, fontWeight: '600' },
  smallButton: { flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md, alignItems: 'center' },
  smallButtonText: { fontSize: 12, fontWeight: '600' },
  section: { borderWidth: 1, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: Spacing.md },
  label: { fontSize: 14, fontWeight: '600', marginTop: Spacing.md, marginBottom: Spacing.sm },
  tabsContainer: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  tab: { flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md, alignItems: 'center', borderWidth: 1, borderColor: '#ccc' },
  tabText: { fontSize: 12, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  gridButton: { flex: 1, minWidth: '48%', paddingVertical: Spacing.sm, borderRadius: BorderRadius.md, alignItems: 'center', borderWidth: 1, borderColor: '#ccc' },
  gridButtonText: { fontSize: 12, fontWeight: '600' },
  emptyText: { fontSize: 14, textAlign: 'center', marginVertical: Spacing.lg },
  notifItem: { paddingVertical: Spacing.md, borderBottomWidth: 1 }
});
