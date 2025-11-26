import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const initializeNotifications = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    console.log(`✅ Notification permissions: ${status}`);
    return status === 'granted';
  } catch (error) {
    console.error('❌ Error requesting notification permissions:', error);
    return false;
  }
};

export const createNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('azan-notifications', {
        name: 'আজান বিজ্ঞপ্তি',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
        enableVibrate: true,
      });
      console.log('✅ Notification channel created');
    } catch (error) {
      console.error('❌ Error creating notification channel:', error);
    }
  }
};

const parseTimeString = (timeString: string): { hour24: number; minutes: number } | null => {
  try {
    // Format: "HH:MM AM/PM" or "HH:MM"
    const [time, period] = timeString.includes(' ') 
      ? timeString.split(' ') 
      : [timeString, 'AM'];
    
    const [hours, minutes] = time.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) return null;
    
    // Convert to 24-hour format
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

export const scheduleAzanNotifications = async (
  azanTimes: Record<string, string>,
  enabledPrayers: Record<PrayerName, boolean>
) => {
  try {
    console.log('📋 Starting notification scheduling...');
    
    // Cancel all existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('🗑️ Cleared previous notifications');

    const prayerLabels: Record<PrayerName, string> = {
      fajr: 'ফজর আজান',
      dhuhr: 'যোহর আজান',
      asr: 'আসর আজান',
      maghrib: 'মাগরিব আজান',
      isha: 'ইশা আজান',
    };

    const prayersToSchedule: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    let scheduledCount = 0;

    for (const prayer of prayersToSchedule) {
      if (!enabledPrayers[prayer]) {
        console.log(`⏭️ ${prayer} disabled, skipping`);
        continue;
      }

      const timeString = azanTimes[prayer];
      if (!timeString) {
        console.warn(`⚠️ No time found for ${prayer}`);
        continue;
      }

      const parsed = parseTimeString(timeString);
      if (!parsed) {
        console.warn(`⚠️ Could not parse time for ${prayer}: ${timeString}`);
        continue;
      }

      const { hour24, minutes } = parsed;
      
      try {
        // Schedule with calendar trigger (daily recurring)
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: prayerLabels[prayer],
            body: 'আজান সময় হয়েছে - নামাজের জন্য প্রস্তুত হন',
            sound: 'default',
            badge: 1,
            vibrate: [0, 250, 250, 250],
            channelId: 'azan-notifications',
          },
          trigger: {
            type: 'daily',
            hour: hour24,
            minute: minutes,
          },
        });

        console.log(`✅ Scheduled ${prayer} at ${String(hour24).padStart(2, '0')}:${String(minutes).padStart(2, '0')} (ID: ${notificationId})`);
        scheduledCount++;
      } catch (scheduleError) {
        console.error(`❌ Failed to schedule ${prayer}:`, scheduleError);
      }
    }

    console.log(`📊 Total notifications scheduled: ${scheduledCount}/${Object.keys(enabledPrayers).filter(k => enabledPrayers[k as PrayerName]).length}`);

    // Save scheduling status
    await AsyncStorage.setItem('azanNotificationsScheduled', JSON.stringify({
      scheduledAt: new Date().toISOString(),
      enabledPrayers,
      scheduledCount,
    }));
  } catch (error) {
    console.error('❌ Critical error in scheduleAzanNotifications:', error);
  }
};

// Send immediate test notification
export const sendTestNotification = async (prayerName: string) => {
  try {
    const prayerLabels: Record<string, string> = {
      fajr: 'ফজর আজান',
      dhuhr: 'যোহর আজান',
      asr: 'আসর আজান',
      maghrib: 'মাগরিব আজান',
      isha: 'ইশা আজান',
    };

    await Notifications.presentNotificationAsync({
      title: prayerLabels[prayerName] || prayerName,
      body: 'এটি একটি পরীক্ষা বিজ্ঞপ্তি',
      sound: 'default',
      badge: 1,
    });
    
    console.log(`✅ Test notification sent for ${prayerName}`);
  } catch (error) {
    console.error('❌ Error sending test notification:', error);
  }
};

export const getScheduledNotifications = async () => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log(`📝 Total scheduled notifications: ${scheduled.length}`, scheduled);
    return scheduled;
  } catch (error) {
    console.error('❌ Error fetching scheduled notifications:', error);
    return [];
  }
};
