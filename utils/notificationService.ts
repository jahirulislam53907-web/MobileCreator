import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

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
  // Request permissions
  if (Platform.OS === 'android') {
    await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
  }
};

export const scheduleAzanNotifications = async (
  azanTimes: Record<string, string>,
  enabledPrayers: Record<PrayerName, boolean>
) => {
  try {
    // Cancel all existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    const today = new Date();
    
    // Prayer names and their notification messages
    const prayerLabels: Record<PrayerName, string> = {
      fajr: 'ফজর আজান',
      dhuhr: 'যোহর আজান',
      asr: 'আসর আজান',
      maghrib: 'মাগরিব আজান',
      isha: 'ইশা আজান',
    };

    // Schedule notification for each enabled prayer
    const prayersToSchedule: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    for (const prayer of prayersToSchedule) {
      if (!enabledPrayers[prayer]) continue;

      const timeString = azanTimes[prayer];
      if (!timeString) continue;

      // Parse time (format: "HH:MM AM/PM" or "HH:MM")
      const [time, period] = timeString.includes(' ') 
        ? timeString.split(' ') 
        : [timeString, 'AM'];
      
      const [hours, minutes] = time.split(':').map(Number);
      
      // Convert to 24-hour format
      let hour24 = hours;
      if (period === 'PM' && hours !== 12) {
        hour24 = hours + 12;
      } else if (period === 'AM' && hours === 12) {
        hour24 = 0;
      }

      const notificationTime = new Date(today);
      notificationTime.setHours(hour24, minutes, 0, 0);

      // If time already passed today, schedule for tomorrow
      if (notificationTime < today) {
        notificationTime.setDate(notificationTime.getDate() + 1);
      }

      // Schedule notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: prayerLabels[prayer],
          body: 'আজান সময় হয়েছে',
          sound: 'default',
          priority: 'max',
          badge: 1,
        },
        trigger: {
          type: 'calendar',
          hour: hour24,
          minute: minutes,
          repeats: true,
        },
      });

      console.log(`✅ Scheduled ${prayer} notification at ${hour24}:${String(minutes).padStart(2, '0')}`);
    }

    // Save scheduling status
    await AsyncStorage.setItem('azanNotificationsScheduled', JSON.stringify({
      scheduledAt: new Date().toISOString(),
      enabledPrayers,
    }));
  } catch (error) {
    console.error('Error scheduling notifications:', error);
  }
};

export const requestNotificationPermission = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
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
    } catch (error) {
      console.error('Error creating notification channel:', error);
    }
  }
};
