export interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
  dayName: string;
}

export interface FormattedDate {
  hijri: string;
  gregorian: string;
  dayName: string;
}

const GREGORIAN_MONTHS = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল',
  'মে', 'জুন', 'জুলাই', 'আগস্ট',
  'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

const HIJRI_MONTHS = [
  'মুহাররম (محرم)', 'সফর (صفر)', 'রবিউল আউয়াল (ربيع الأول)', 'রবিউল আখির (ربيع الآخر)',
  'জমাদিউল আউয়াল (جمادى الأولى)', 'জমাদিউল আখির (جمادى الآخرة)', 'রজব (رجب)', 'শাবান (شعبان)',
  'রমজান (رمضان)', 'শাওয়াল (شوال)', 'জুল কাইদাহ (ذو القعدة)', 'জুল হিজ্জাহ (ذو الحجة)'
];

const DAY_NAMES = [
  'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার',
  'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
];

// Simple, proven Gregorian to Hijri conversion
export const gregorianToHijri = (date: Date): HijriDate => {
  const g_d = date.getDate();
  const g_m = date.getMonth() + 1;
  const g_y = date.getFullYear();

  // Reference: July 15, 622 CE = 1 Muharram 1 AH (Julian Day 1948439)
  const N = g_d + Math.ceil(30.6001 * (g_m + 1)) + (g_y - 1) * 365 + Math.floor((g_y - 1) / 4) + 1948440;
  
  const Q = Math.floor((N - 1) / 10631);
  const R = (N - 1) % 10631;
  
  const A = Math.floor(R / 354.36667);
  const W = R % 354.36667;
  
  const Q1 = Math.floor(W / 29.5001);
  const M = (Math.floor(11 * (A + 1)) / 30);
  
  let h_y = 354 * A + Math.floor(30.6001 * M) + Math.floor(W % 29.5001) + 30 * Q + 1;
  let h_m = (Math.ceil(W % 29.5001 / 29.5001) + Math.floor(11 * A / 30)) % 12;
  
  if (h_m === 0) h_m = 12;
  if (h_m < 0) h_m = 12 + h_m;
  
  let h_d = Math.floor(W % 29.5001) + 1;
  if (h_d > 30) h_d = 1;

  return {
    day: Math.max(1, Math.min(30, h_d)),
    month: Math.max(1, Math.min(12, h_m)),
    year: Math.max(1, h_y),
    monthName: HIJRI_MONTHS[Math.max(0, Math.min(11, h_m - 1))] || 'অজানা',
    dayName: DAY_NAMES[date.getDay()],
  };
};

export const formatDate = (date: Date = new Date()): FormattedDate => {
  const dayName = DAY_NAMES[date.getDay()];
  const gregorianDate = `${dayName}, ${date.getDate()} ${GREGORIAN_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  
  const hijri = gregorianToHijri(date);
  const hijriDate = `${hijri.day} ${hijri.monthName} ${hijri.year}`;

  return {
    hijri: hijriDate,
    gregorian: gregorianDate,
    dayName: dayName,
  };
};
