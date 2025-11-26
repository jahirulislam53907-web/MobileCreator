import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { useTranslation } from '@/src/contexts/LanguageContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const API_URL = 'http://localhost:3000/api';

export default function AdminPanel() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Login form
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');

  // Notification form
  const [selectedPrayer, setSelectedPrayer] = useState('fajr');
  const [message, setMessage] = useState('');
  const [targetUsers, setTargetUsers] = useState('all');

  // History
  const [history, setHistory] = useState<any[]>([]);

  const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  // Admin login
  const handleLogin = async () => {
    if (!password.trim()) {
      Alert.alert('ত্রুটি', 'পাসওয়ার্ড প্রয়োজন');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        setAdminId(data.adminId);
        setIsLoggedIn(true);
        fetchHistory();
        setPassword('');
      } else {
        Alert.alert('লগইন ব্যর্থ', data.error);
      }
    } catch (error) {
      Alert.alert('ত্রুটি', 'সার্ভার সংযোগ ব্যর্থ');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Send notification
  const handleSendNotification = async () => {
    if (!message.trim()) {
      Alert.alert('ত্রুটি', 'বার্তা প্রয়োজন');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/notifications/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_id: adminId,
          prayer_name: selectedPrayer,
          message,
          target_users: targetUsers
        })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('সফল', 'বিজ্ঞপ্তি পাঠানো হয়েছে');
        setMessage('');
        fetchHistory();
      } else {
        Alert.alert('ত্রুটি', data.error);
      }
    } catch (error) {
      Alert.alert('ত্রুটি', 'বিজ্ঞপ্তি পাঠাতে ব্যর্থ');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch history
  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/notifications/history`);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  // Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminId(null);
    setPassword('');
  };

  if (!isLoggedIn) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top + Spacing.lg, paddingBottom: insets.bottom + Spacing.lg }]}>
        <ThemedText style={styles.title}>প্রশাসক প্যানেল</ThemedText>

        <View style={styles.loginForm}>
          <ThemedText style={styles.label}>ব্যবহারকারী নাম</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            placeholder="প্রবেশ করুন"
            placeholderTextColor={theme.placeholder}
            value={username}
            onChangeText={setUsername}
          />

          <ThemedText style={styles.label}>পাসওয়ার্ড</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            placeholder="পাসওয়ার্ড"
            placeholderTextColor={theme.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.surface} />
            ) : (
              <ThemedText style={styles.buttonText}>লগইন করুন</ThemedText>
            )}
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top + Spacing.lg }]}>
      <View style={{ paddingHorizontal: Spacing.lg, paddingBottom: insets.bottom + Spacing.lg }}>
        <ThemedText style={styles.title}>প্রশাসক প্যানেল</ThemedText>

        {/* Send Notification */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText style={styles.sectionTitle}>বিজ্ঞপ্তি পাঠান</ThemedText>

          <ThemedText style={styles.label}>নামাজ নির্বাচন করুন</ThemedText>
          <View style={styles.prayerGrid}>
            {prayers.map(prayer => (
              <Pressable
                key={prayer}
                style={[
                  styles.prayerButton,
                  selectedPrayer === prayer && { backgroundColor: theme.primary }
                ]}
                onPress={() => setSelectedPrayer(prayer)}
              >
                <ThemedText style={[
                  styles.prayerButtonText,
                  selectedPrayer === prayer && { color: theme.surface }
                ]}>
                  {prayer.toUpperCase()}
                </ThemedText>
              </Pressable>
            ))}
          </View>

          <ThemedText style={styles.label}>বার্তা</ThemedText>
          <TextInput
            style={[styles.messageInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
            placeholder="আপনার বার্তা লিখুন..."
            placeholderTextColor={theme.placeholder}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
          />

          <ThemedText style={styles.label}>লক্ষ্য ব্যবহারকারী</ThemedText>
          <View style={styles.targetGrid}>
            {['all', 'android', 'ios'].map(target => (
              <Pressable
                key={target}
                style={[
                  styles.targetButton,
                  targetUsers === target && { backgroundColor: theme.primary }
                ]}
                onPress={() => setTargetUsers(target)}
              >
                <ThemedText style={[
                  styles.targetButtonText,
                  targetUsers === target && { color: theme.surface }
                ]}>
                  {target === 'all' ? 'সকল' : target.toUpperCase()}
                </ThemedText>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={[styles.sendButton, { backgroundColor: theme.primary }]}
            onPress={handleSendNotification}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.surface} />
            ) : (
              <ThemedText style={styles.buttonText}>পাঠান</ThemedText>
            )}
          </Pressable>
        </View>

        {/* History */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText style={styles.sectionTitle}>পাঠানোর ইতিহাস</ThemedText>

          {history.length === 0 ? (
            <ThemedText style={styles.emptyText}>কোনো ইতিহাস নেই</ThemedText>
          ) : (
            history.slice(0, 10).map(item => (
              <View key={item.id} style={[styles.historyItem, { borderBottomColor: theme.border }]}>
                <ThemedText style={styles.historyPrayer}>{item.prayer_name?.toUpperCase()}</ThemedText>
                <ThemedText style={styles.historyMessage}>{item.message}</ThemedText>
                <ThemedText style={styles.historyTime}>
                  {new Date(item.created_at).toLocaleString('bn-BD')}
                </ThemedText>
              </View>
            ))
          )}
        </View>

        {/* Logout */}
        <Pressable
          style={[styles.logoutButton, { backgroundColor: theme.error }]}
          onPress={handleLogout}
        >
          <ThemedText style={styles.buttonText}>লগআউট করুন</ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: Spacing.lg,
  },
  loginForm: {
    marginHorizontal: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 14,
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 14,
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  sendButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  prayerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  prayerButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  prayerButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  targetGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  targetButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  targetButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: Spacing.lg,
  },
  historyItem: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  historyPrayer: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  historyMessage: {
    fontSize: 13,
    marginBottom: Spacing.xs,
  },
  historyTime: {
    fontSize: 11,
    opacity: 0.7,
  },
});
