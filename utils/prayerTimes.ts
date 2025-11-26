export interface PrayerTimesData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: Date;
}

export interface NextPrayerInfo {
  name: string;
  nameAr: string;
  nameBn: string;
  time: Date;
  timeRemaining: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export interface SunriseSunsetInfo {
  sunrise: Date;
  sunset: Date;
  timeUntilSunrise: {
    hours: number;
    minutes: number;
  };
  timeUntilSunset: {
    hours: number;
    minutes: number;
  };
}

export const formatTime = (timeStr: string): string => {
  return timeStr;
};

// Fetch prayer times from backend
export const calculatePrayerTimes = async (
  latitude: number,
  longitude: number,
  date: Date = new Date()
): Promise<PrayerTimesData> => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/prayer-times?latitude=${latitude}&longitude=${longitude}`
    );
    const data = await response.json();
    
    return {
      fajr: data.fajr,
      sunrise: data.sunrise,
      dhuhr: data.dhuhr,
      asr: data.asr,
      maghrib: data.maghrib,
      isha: data.isha,
      date: new Date(date),
    };
  } catch (error) {
    console.log('Error fetching prayer times:', error);
    return {
      fajr: '05:00',
      sunrise: '06:30',
      dhuhr: '12:30',
      asr: '15:45',
      maghrib: '18:15',
      isha: '19:45',
      date: new Date(date),
    };
  }
};

// Parse time string and return Date
const parseTimeToDate = (timeStr: string): Date => {
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  
  let hour = hours;
  if (period === 'PM' && hours !== 12) hour += 12;
  if (period === 'AM' && hours === 12) hour = 0;
  
  date.setHours(hour, minutes, 0, 0);
  return date;
};

export const getNextPrayer = (
  latitude: number,
  longitude: number
): NextPrayerInfo => {
  const now = new Date();
  
  // Default fallback
  return {
    name: 'Fajr',
    nameAr: 'الفجر',
    nameBn: 'ফজর',
    time: now,
    timeRemaining: { hours: 0, minutes: 0, seconds: 0 },
  };
};

export const getCurrentPrayer = (prayerTimes: PrayerTimesData): string => {
  const now = new Date();
  const times = [
    { name: 'Fajr', time: parseTimeToDate(prayerTimes.fajr) },
    { name: 'Dhuhr', time: parseTimeToDate(prayerTimes.dhuhr) },
    { name: 'Asr', time: parseTimeToDate(prayerTimes.asr) },
    { name: 'Maghrib', time: parseTimeToDate(prayerTimes.maghrib) },
    { name: 'Isha', time: parseTimeToDate(prayerTimes.isha) },
  ];

  for (let i = 0; i < times.length; i++) {
    const current = times[i].time;
    const next = times[(i + 1) % times.length].time;
    
    if (current <= now && now < next) {
      return times[i].name;
    }
  }

  return 'Isha';
};

export const getTimeUntilNextPrayer = (prayerTimes: PrayerTimesData): { name: string; nameBn: string; hours: number; minutes: number } => {
  const now = new Date();
  const times: Array<{ name: string; nameBn: string; time: Date }> = [
    { name: 'Fajr', nameBn: 'ফজর', time: parseTimeToDate(prayerTimes.fajr) },
    { name: 'Dhuhr', nameBn: 'যোহর', time: parseTimeToDate(prayerTimes.dhuhr) },
    { name: 'Asr', nameBn: 'আসর', time: parseTimeToDate(prayerTimes.asr) },
    { name: 'Maghrib', nameBn: 'মাগরিব', time: parseTimeToDate(prayerTimes.maghrib) },
    { name: 'Isha', nameBn: 'এশা', time: parseTimeToDate(prayerTimes.isha) },
  ];

  for (const prayer of times) {
    if (prayer.time > now) {
      const diff = prayer.time.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return { name: prayer.name, nameBn: prayer.nameBn, hours, minutes };
    }
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(5, 0, 0, 0);
  
  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { name: 'Fajr', nameBn: 'ফজর', hours, minutes };
};

export const getNextSunriseOrSunset = (latitude: number, longitude: number): SunriseSunsetInfo => {
  const now = new Date();
  const sunrise = new Date();
  sunrise.setHours(6, 30, 0, 0);
  const sunset = new Date();
  sunset.setHours(18, 15, 0, 0);

  const sunriseDiff = sunrise.getTime() - now.getTime();
  const sunsetDiff = sunset.getTime() - now.getTime();

  return {
    sunrise,
    sunset,
    timeUntilSunrise: {
      hours: Math.floor(sunriseDiff / (1000 * 60 * 60)),
      minutes: Math.floor((sunriseDiff % (1000 * 60 * 60)) / (1000 * 60)),
    },
    timeUntilSunset: {
      hours: Math.floor(sunsetDiff / (1000 * 60 * 60)),
      minutes: Math.floor((sunsetDiff % (1000 * 60 * 60)) / (1000 * 60)),
    },
  };
};

export const DHAKA_COORDINATES = {
  latitude: 23.8103,
  longitude: 90.4125,
};
