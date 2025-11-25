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
): NextPrayerInfo | null => {
  const coordinates = new Coordinates(latitude, longitude);
  const params = CalculationMethod.Karachi();
  const prayerTimes = new PrayerTimes(coordinates, new Date(), params);

  const nextPrayer = prayerTimes.nextPrayer();
  
  if (!nextPrayer) return null;

  const nextPrayerTime = prayerTimes.timeForPrayer(nextPrayer);
  if (!nextPrayerTime) return null;

  const now = new Date();
  const diff = nextPrayerTime.getTime() - now.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  let prayerKey = 'Fajr';
  const prayerStr = String(nextPrayer).toLowerCase();
  
  if (prayerStr.includes('fajr')) prayerKey = 'Fajr';
  else if (prayerStr.includes('dhuhr')) prayerKey = 'Dhuhr';
  else if (prayerStr.includes('asr')) prayerKey = 'Asr';
  else if (prayerStr.includes('maghrib')) prayerKey = 'Maghrib';
  else if (prayerStr.includes('isha')) prayerKey = 'Isha';
  
  const prayerData = PRAYER_NAMES[prayerKey] || PRAYER_NAMES['Fajr'];
  
  return {
    name: prayerData.en,
    nameAr: prayerData.ar,
    nameBn: prayerData.bn,
    time: nextPrayerTime,
    timeRemaining: {
      hours: Math.max(0, hours),
      minutes: Math.max(0, minutes),
      seconds: Math.max(0, seconds),
    },
  };
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
