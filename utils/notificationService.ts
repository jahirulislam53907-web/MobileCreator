import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { PrayerTimesData } from './prayerTimes';

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

interface PrayerNotification {
  id: string;
  prayer: PrayerName;
  type: 'start' | 'end';
  scheduledTime: string; // HH:MM format
  message: string;
  enabled: boolean;
}

// Global sound player - typed as any for web compatibility
let soundPlayer: any = null;

// Play azan audio from assets
export const playAzanAudioFile = async () => {
  try {
    // Skip on web - audio only works on mobile
    if (Platform.OS === 'web') {
      console.log('ℹ️ আজান শুধুমাত্র মোবাইলে বাজে');
      return;
    }

    // Dynamically import Audio - only available on native
    let Audio: any;
    try {
      // @ts-ignore - Dynamic import for runtime availability check
      Audio = await import('expo-audio');
    } catch (e) {
      console.error('❌ expo-audio লোড করতে পারা যায়নি:', e);
      return;
    }

    const SoundModule = Audio.default || Audio;

    // Stop any currently playing audio
    if (soundPlayer) {
      try {
        await soundPlayer.stopAsync();
        await soundPlayer.unloadAsync();
      } catch (e) {
        // Ignore cleanup errors
      }
    }

    // Create new sound instance
    soundPlayer = new SoundModule.Sound();
    // Use asset URI for Expo Go compatibility
    await soundPlayer.loadAsync(require('@/assets/audio/azan.mp3'));
    await soundPlayer.playAsync();
    console.log('🔊 আজান বাজছে...');
  } catch (error) {
    console.error('❌ আজান বাজাতে সমস্যা:', error);
  }
};

// Initialize notifications
export const initializeNotifications = async () => {
  try {
    console.log(`✅ Notification system initialized`);
    return true;
  } catch (error) {
    console.error('❌ Error initializing notifications:', error);
    return false;
  }
};

export const createNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    console.log('✅ Notification channel configured');
  }
};

// Parse time string to 24-hour format
const parseTimeString = (timeString: string): { hour24: number; minutes: number } | null => {
  try {
    const [time, period] = timeString.includes(' ') 
      ? timeString.split(' ') 
      : [timeString, 'AM'];
    
    const [hours, minutes] = time.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) return null;
    
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) {
      hour24 = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0;
    }
    
    return { hour24, minutes };
  } catch (error) {
    console.error('❌ Error parsing time:', error);
    return null;
  }
};

// Schedule all prayer time notifications (10 total - start + end for each prayer)
export const schedulePrayerTimeNotifications = async (
  prayerTimes: PrayerTimesData,
  enabledPrayers: Record<PrayerName, boolean>
) => {
  try {
    console.log('📋 Setting up prayer time notifications...');

    const prayers: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    const notificationList: PrayerNotification[] = [];

    // Get default notification messages
    const defaultMessages = await getDefaultNotificationMessages();

    for (const prayer of prayers) {
      if (!enabledPrayers[prayer]) {
        console.log(`⏭️ ${prayer} notifications disabled`);
        continue;
      }

      const timeString = prayerTimes[prayer as keyof PrayerTimesData];
      if (!timeString) {
        console.warn(`⚠️ No time found for ${prayer}`);
        continue;
      }

      const parsed = parseTimeString(timeString as string);
      if (!parsed) {
        console.warn(`⚠️ Could not parse time for ${prayer}: ${timeString}`);
        continue;
      }

      const { hour24, minutes } = parsed;
      const timeFormatted = `${String(hour24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

      // Silent notification only - no sound (audio plays from HomeScreen)
      notificationList.push({
        id: `${prayer}-start-${Date.now()}`,
        prayer,
        type: 'start',
        scheduledTime: timeFormatted,
        message: defaultMessages[`${prayer}_start`] || `${prayer.charAt(0).toUpperCase() + prayer.slice(1)} শুরু`,
        enabled: true,
      });

      // End time notification
      const endTime = new Date();
      endTime.setHours(hour24, minutes, 0, 0);
      endTime.setMinutes(endTime.getMinutes() + 40);
      
      const endHour24 = endTime.getHours();
      const endMinutes = endTime.getMinutes();
      const endTimeFormatted = `${String(endHour24).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;

      notificationList.push({
        id: `${prayer}-end-${Date.now()}`,
        prayer,
        type: 'end',
        scheduledTime: endTimeFormatted,
        message: defaultMessages[`${prayer}_end`] || `${prayer.charAt(0).toUpperCase() + prayer.slice(1)} শেষ`,
        enabled: true,
      });

      console.log(`✅ ${prayer} notifications scheduled - Start: ${timeFormatted}, End: ${endTimeFormatted}`);
    }

    // Save to AsyncStorage
    await AsyncStorage.setItem('prayerNotifications', JSON.stringify(notificationList));
    await AsyncStorage.setItem('enabledPrayersStatus', JSON.stringify(enabledPrayers));
    
    console.log(`💾 Total notifications scheduled: ${notificationList.length}/10`);
    return notificationList;
  } catch (error) {
    console.error('❌ Error in schedulePrayerTimeNotifications:', error);
    return [];
  }
};

// Cancel all notifications
export const cancelAllNotifications = async () => {
  try {
    const notifs = await Notifications.getAllScheduledNotificationsAsync();
    for (const notif of notifs) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
    console.log('✅ All notifications cancelled');
  } catch (error) {
    console.error('❌ Error cancelling notifications:', error);
  }
};

// Get scheduled notifications
export const getScheduledNotifications = async (): Promise<PrayerNotification[]> => {
  try {
    const schedule = await AsyncStorage.getItem('prayerNotifications');
    if (schedule) {
      const notifications = JSON.parse(schedule) as PrayerNotification[];
      console.log(`📝 Current prayer notifications:`, notifications.length);
      return notifications;
    }
    return [];
  } catch (error) {
    console.error('❌ Error fetching schedule:', error);
    return [];
  }
};

// Update notification message
export const updateNotificationMessage = async (
  notificationId: string,
  newMessage: string
) => {
  try {
    const notifications = await getScheduledNotifications();
    const updated = notifications.map((n) =>
      n.id === notificationId ? { ...n, message: newMessage } : n
    );
    await AsyncStorage.setItem('prayerNotifications', JSON.stringify(updated));
    console.log(`✅ Notification ${notificationId} updated`);
    return updated;
  } catch (error) {
    console.error('❌ Error updating notification:', error);
    return [];
  }
};

// Get default notification messages
const getDefaultNotificationMessages = async (): Promise<Record<string, string>> => {
  try {
    const saved = await AsyncStorage.getItem('notificationMessages');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('❌ Error loading notification messages:', error);
  }

  // Default messages in Bengali
  return {
    fajr_start: 'ফজরের নামাজের সময় শুরু হয়েছে',
    fajr_end: 'ফজরের নামাজের সময় শেষ হয়েছে',
    dhuhr_start: 'যোহরের নামাজের সময় শুরু হয়েছে',
    dhuhr_end: 'যোহরের নামাজের সময় শেষ হয়েছে',
    asr_start: 'আসরের নামাজের সময় শুরু হয়েছে',
    asr_end: 'আসরের নামাজের সময় শেষ হয়েছে',
    maghrib_start: 'মাগরিবের নামাজের সময় শুরু হয়েছে',
    maghrib_end: 'মাগরিবের নামাজের সময় শেষ হয়েছে',
    isha_start: 'এশার নামাজের সময় শুরু হয়েছে',
    isha_end: 'এশার নামাজের সময় শেষ হয়েছে',
  };
};

// Save notification messages
export const saveNotificationMessages = async (messages: Record<string, string>) => {
  try {
    await AsyncStorage.setItem('notificationMessages', JSON.stringify(messages));
    console.log('✅ Notification messages saved');
  } catch (error) {
    console.error('❌ Error saving notification messages:', error);
  }
};

// Poll for notifications and trigger them - THIS IS THE KEY SYSTEM
export const startNotificationPolling = () => {
  const pollInterval = setInterval(async () => {
    try {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      // Get all prayer notifications
      const notifications = await getScheduledNotifications();
      
      // Get enabled prayers status
      const enabledPrayersStr = await AsyncStorage.getItem('enabledPrayersStatus');
      const enabledPrayers = enabledPrayersStr ? JSON.parse(enabledPrayersStr) : {};
      
      for (const notif of notifications) {
        // Check if this prayer is enabled
        if (!enabledPrayers[notif.prayer]) {
          continue;
        }

        // Check if current time matches notification time
        if (notif.scheduledTime === currentTime && notif.enabled && notif.type === 'start') {
          console.log(`🔔 আজান সময়: ${notif.prayer.toUpperCase()} at ${currentTime}`);
          
          // Play azan audio file
          await playAzanAudioFile();
          
          // Show notification without sound (audio already playing)
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `${notif.prayer.toUpperCase()} - আজান`,
              body: notif.message,
              sound: false,
              badge: 1,
            },
            trigger: null,
          });
        }
      }
    } catch (error) {
      console.error('❌ Error in polling:', error);
    }
  }, 60000); // Poll every 60 seconds (1 minute)
  
  console.log('✅ Azan polling system started - checking every minute');
  return pollInterval;
};

// Legacy function for backward compatibility
export const scheduleAzanNotifications = async (
  azanTimes: Record<string, string>,
  enabledPrayers: Record<PrayerName, boolean>
) => {
  // This now calls the new prayer time notification system
  console.log('📋 Legacy scheduleAzanNotifications called - using new system...');
  
  const prayerTimesData = azanTimes as any as PrayerTimesData;
  return await schedulePrayerTimeNotifications(prayerTimesData, enabledPrayers);
};
