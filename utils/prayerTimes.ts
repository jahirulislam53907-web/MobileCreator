import { Coordinates, CalculationMethod, PrayerTimes, Prayer } from 'adhan';

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

const PRAYER_NAMES: Record<string, { ar: string; bn: string; en: string }> = {
  Fajr: { ar: 'الفجر', bn: 'ফজর', en: 'Fajr' },
  Sunrise: { ar: 'الشروق', bn: 'সূর্যোদয়', en: 'Sunrise' },
  Dhuhr: { ar: 'الظهر', bn: 'যোহর', en: 'Dhuhr' },
  Asr: { ar: 'العصر', bn: 'আসর', en: 'Asr' },
  Maghrib: { ar: 'المغرب', bn: 'মাগরিব', en: 'Maghrib' },
  Isha: { ar: 'العشاء', bn: 'এশা', en: 'Isha' },
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const calculatePrayerTimes = (
  latitude: number,
  longitude: number,
  date: Date = new Date()
): PrayerTimesData => {
  // Create a new date object with timezone-aware calculation
  const calculationDate = new Date(date);
  calculationDate.setHours(0, 0, 0, 0);
  
  const coordinates = new Coordinates(latitude, longitude);
  // Using ISNA method - Most accurate for Bangladesh and South Asia
  const params = CalculationMethod.Isna();
  const prayerTimes = new PrayerTimes(coordinates, calculationDate, params);

  return {
    fajr: formatTime(prayerTimes.fajr),
    sunrise: formatTime(prayerTimes.sunrise),
    dhuhr: formatTime(prayerTimes.dhuhr),
    asr: formatTime(prayerTimes.asr),
    maghrib: formatTime(prayerTimes.maghrib),
    isha: formatTime(prayerTimes.isha),
    date: calculationDate,
  };
};

export const getNextPrayer = (
  latitude: number,
  longitude: number
): NextPrayerInfo => {
  try {
    const coordinates = new Coordinates(latitude, longitude);
    const params = CalculationMethod.Isna();
    const now = new Date();
    const todayTimes = new PrayerTimes(coordinates, now, params);

    // Define prayer order and times
    const prayers: Array<{ name: string; nameAr: string; nameBn: string; time: Date }> = [
      { name: 'Fajr', nameAr: 'الفجر', nameBn: 'ফজর', time: todayTimes.fajr },
      { name: 'Sunrise', nameAr: 'الشروق', nameBn: 'সূর্যোদয়', time: todayTimes.sunrise },
      { name: 'Dhuhr', nameAr: 'الظهر', nameBn: 'যোহর', time: todayTimes.dhuhr },
      { name: 'Asr', nameAr: 'العصر', nameBn: 'আসর', time: todayTimes.asr },
      { name: 'Maghrib', nameAr: 'المغرب', nameBn: 'ماগرिب', time: todayTimes.maghrib },
      { name: 'Isha', nameAr: 'العشاء', nameBn: 'এশা', time: todayTimes.isha },
    ];

    // Find next prayer today
    for (const prayer of prayers) {
      if (prayer.time > now) {
        const diff = prayer.time.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return {
          name: prayer.name,
          nameAr: prayer.nameAr,
          nameBn: prayer.nameBn,
          time: prayer.time,
          timeRemaining: {
            hours: Math.max(0, hours),
            minutes: Math.max(0, minutes),
            seconds: Math.max(0, seconds),
          },
        };
      }
    }

    // If no prayer left today, get tomorrow's Fajr
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimes = new PrayerTimes(coordinates, tomorrow, params);

    const diff = tomorrowTimes.fajr.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      name: 'Fajr',
      nameAr: 'الفجر',
      nameBn: 'ফজর',
      time: tomorrowTimes.fajr,
      timeRemaining: {
        hours: Math.max(0, hours),
        minutes: Math.max(0, minutes),
        seconds: Math.max(0, seconds),
      },
    };
  } catch (error) {
    return {
      name: 'Fajr',
      nameAr: 'الفجر',
      nameBn: 'ফজর',
      time: new Date(),
      timeRemaining: { hours: 0, minutes: 0, seconds: 0 },
    };
  }
};

export const getCurrentPrayer = (
  latitude: number,
  longitude: number
): string | null => {
  const coordinates = new Coordinates(latitude, longitude);
  const params = CalculationMethod.Isna();
  const prayerTimes = new PrayerTimes(coordinates, new Date(), params);

  const currentPrayer = prayerTimes.currentPrayer();
  if (!currentPrayer) return null;

  let prayerKey = 'Fajr';
  const prayerStr = String(currentPrayer).toLowerCase();
  
  if (prayerStr.includes('fajr')) prayerKey = 'Fajr';
  else if (prayerStr.includes('dhuhr')) prayerKey = 'Dhuhr';
  else if (prayerStr.includes('asr')) prayerKey = 'Asr';
  else if (prayerStr.includes('maghrib')) prayerKey = 'Maghrib';
  else if (prayerStr.includes('isha')) prayerKey = 'Isha';
  
  const prayerData = PRAYER_NAMES[prayerKey] || PRAYER_NAMES['Fajr'];
  return prayerData.bn;
};

export const getTimeUntilNextPrayer = (
  latitude: number,
  longitude: number
): string => {
  const nextPrayer = getNextPrayer(latitude, longitude);
  
  if (!nextPrayer) return '০:০০:০০';

  const { hours, minutes, seconds } = nextPrayer.timeRemaining;
  
  const bengaliDigits = (num: number): string => {
    const bengaliNums = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num
      .toString()
      .split('')
      .map((digit) => bengaliNums[parseInt(digit)] || digit)
      .join('');
  };

  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedSeconds = seconds.toString().padStart(2, '0');
  return `${bengaliDigits(hours)}:${bengaliDigits(Number(paddedMinutes))}:${bengaliDigits(Number(paddedSeconds))}`;
};

export interface SunriseSunsetInfo {
  type: 'sunrise' | 'sunset';
  time: Date;
  timeString: string;
  label: string;
}

export const getNextSunriseOrSunset = (
  latitude: number,
  longitude: number
): SunriseSunsetInfo => {
  try {
    const coordinates = new Coordinates(latitude, longitude);
    const params = CalculationMethod.Isna();
    const now = new Date();
    const todayTimes = new PrayerTimes(coordinates, now, params);

    const sunrise = todayTimes.sunrise;
    const sunset = todayTimes.maghrib; // Using maghrib as sunset

    // If current time is before sunrise, show today's sunrise
    if (now < sunrise) {
      return {
        type: 'sunrise',
        time: sunrise,
        timeString: formatTime(sunrise),
        label: 'সূর্যোদয়',
      };
    }

    // If current time is between sunrise and sunset, show today's sunset
    if (now < sunset) {
      return {
        type: 'sunset',
        time: sunset,
        timeString: formatTime(sunset),
        label: 'সূর্যাস্ত',
      };
    }

    // If current time is after sunset + 1 hour, show tomorrow's sunrise
    const oneHourAfterSunset = new Date(sunset.getTime() + 60 * 60 * 1000);
    if (now > oneHourAfterSunset) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowTimes = new PrayerTimes(coordinates, tomorrow, params);
      return {
        type: 'sunrise',
        time: tomorrowTimes.sunrise,
        timeString: formatTime(tomorrowTimes.sunrise),
        label: 'সূর্যোদয়',
      };
    }

    // If between sunset and 1 hour after sunset, show sunset
    return {
      type: 'sunset',
      time: sunset,
      timeString: formatTime(sunset),
      label: 'সূর্যাস্ত',
    };
  } catch (error) {
    return {
      type: 'sunrise',
      time: new Date(),
      timeString: '--:--',
      label: 'সূর্যোদয়',
    };
  }
};

export const DHAKA_COORDINATES = {
  latitude: 23.8103,
  longitude: 90.4125,
};
