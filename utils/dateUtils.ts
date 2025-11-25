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
  'মুহাররম', 'সফর', 'রবিউল আউয়াল', 'রবিউল আখির',
  'জমাদিউল আউয়াল', 'জমাদিউল আখির', 'রজব', 'শাবান',
  'রমজান', 'শাওয়াল', 'জুল কাইদাহ', 'জুল হিজ্জাহ'
];

const DAY_NAMES = [
  'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার',
  'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
];

// Simple Gregorian to Hijri conversion
export const gregorianToHijri = (date: Date): HijriDate => {
  const jd = Math.floor((11 * date.getFullYear() + 3) / 30) + 365 * date.getFullYear() + 
    Math.floor((date.getMonth() + 1) * 306001 / 10000) + date.getDate() - 1948440;
  
  const l = jd + 1;
  const n = Math.floor((l - 1) / 10631);
  const j = l - 10631 * n + 1;
  
  const r = Math.floor((j - 1) / 10631);
  const jj = j - 10631 * r;
  const k = Math.floor((jj - 1) / 354);
  const jjj = jj - 354 * k;
  const m = Math.floor((jjj + 30) * 10 / 325);
  const dd = jjj - Math.floor(m * 325 / 10) + 1;
  
  const hijriYear = 30 * n + 354 * r + k + 1;
  const hijriMonth = m;
  const hijriDay = dd;

  return {
    day: hijriDay,
    month: hijriMonth,
    year: hijriYear,
    monthName: HIJRI_MONTHS[hijriMonth - 1] || 'অজানা',
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
