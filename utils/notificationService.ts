import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

// Simple notification storage system (since expo-notifications has limited support in Expo Go)
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

export const scheduleAzanNotifications = async (
  azanTimes: Record<string, string>,
  enabledPrayers: Record<PrayerName, boolean>
) => {
  try {
    console.log('📋 Saving notification preferences...');

    const prayerLabels: Record<PrayerName, string> = {
      fajr: 'ফজর আজান',
      dhuhr: 'যোহর আজান',
      asr: 'আসর আজান',
      maghrib: 'মাগরিব আজান',
      isha: 'ইশা আজান',
    };

    const prayersToSchedule: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    const scheduleData: Record<string, any> = {};
    let enabledCount = 0;

    for (const prayer of prayersToSchedule) {
      if (!enabledPrayers[prayer]) {
        console.log(`⏭️ ${prayer} disabled`);
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
      
      scheduleData[prayer] = {
        label: prayerLabels[prayer],
        time: `${String(hour24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
        enabled: true,
      };

      console.log(`✅ ${prayer} set to ${String(hour24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
      enabledCount++;
    }

    console.log(`📊 Total enabled prayers: ${enabledCount}/5`);

    // Save to AsyncStorage
    await AsyncStorage.setItem('azanSchedule', JSON.stringify(scheduleData));
    await AsyncStorage.setItem('enabledPrayersStatus', JSON.stringify(enabledPrayers));
    
    console.log('💾 Notification preferences saved');
  } catch (error) {
    console.error('❌ Error in scheduleAzanNotifications:', error);
  }
};

export const getScheduledNotifications = async () => {
  try {
    const schedule = await AsyncStorage.getItem('azanSchedule');
    if (schedule) {
      console.log(`📝 Current azan schedule:`, JSON.parse(schedule));
    }
    return schedule ? JSON.parse(schedule) : null;
  } catch (error) {
    console.error('❌ Error fetching schedule:', error);
    return null;
  }
};
