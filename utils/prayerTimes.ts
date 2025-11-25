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
  const coordinates = new Coordinates(latitude, longitude);
  const params = CalculationMethod.Karachi();
  const prayerTimes = new PrayerTimes(coordinates, date, params);

  return {
    fajr: formatTime(prayerTimes.fajr),
    sunrise: formatTime(prayerTimes.sunrise),
    dhuhr: formatTime(prayerTimes.dhuhr),
    asr: formatTime(prayerTimes.asr),
    maghrib: formatTime(prayerTimes.maghrib),
    isha: formatTime(prayerTimes.isha),
    date: date,
  };
};

export const getNextPrayer = (
  latitude: number,
  longitude: number
): NextPrayerInfo => {
  try {
    const coordinates = new Coordinates(latitude, longitude);
    const params = CalculationMethod.Karachi();
    const now = new Date();
    const todayTimes = new PrayerTimes(coordinates, now, params);

    // Define prayer order and times
    const prayers: Array<{ key: Prayer; name: string; nameAr: string; nameBn: string; time: Date }> = [
      { key: Prayer.Fajr, name: 'Fajr', nameAr: 'الفجر', nameBn: 'ফজর', time: todayTimes.fajr },
      { key: Prayer.Sunrise, name: 'Sunrise', nameAr: 'الشروق', nameBn: 'সূর্যোদয়', time: todayTimes.sunrise },
      { key: Prayer.Dhuhr, name: 'Dhuhr', nameAr: 'الظهر', nameBn: 'যোহর', time: todayTimes.dhuhr },
      { key: Prayer.Asr, name: 'Asr', nameAr: 'العصر', nameBn: 'আসর', time: todayTimes.asr },
      { key: Prayer.Maghrib, name: 'Maghrib', nameAr: 'المغرب', nameBn: 'মাগরিব', time: todayTimes.maghrib },
      { key: Prayer.Isha, name: 'Isha', nameAr: 'العشاء', nameBn: 'এশা', time: todayTimes.isha },
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
  const params = CalculationMethod.Karachi();
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

export const DHAKA_COORDINATES = {
  latitude: 23.8103,
  longitude: 90.4125,
};
