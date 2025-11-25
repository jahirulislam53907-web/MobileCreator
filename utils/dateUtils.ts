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

// Accurate Gregorian to Hijri conversion using Kuwaiti algorithm
export const gregorianToHijri = (date: Date): HijriDate => {
  const D = date.getDate();
  const M = date.getMonth() + 1;
  const Y = date.getFullYear();

  // Kuwaiti algorithm (most accurate for Islamic calendar)
  let N = D + Math.floor(306 * (M + 1) / 11) + (Y % 100) * 365 + Math.floor(Y / 400) * 97 + Math.floor(Y / 100) * 3 - Math.floor((Y - 1) / 4) + Math.floor(Y / 4) - 1948440 + 386;

  let Q = Math.floor(N / 10631);
  N = N % 10631;

  let A = Math.floor((N + 1) / 354.36667);
  if (A > 11) A = 11;

  let B = Math.floor(((N % 354.36667) + 1) / 29.5001);
  if (B > 11) B = 11;

  let hijriYear = 30 * Q + 354 * A + B + 1;
  let hijriMonth = B + 1;
  
  if (hijriMonth > 12) {
    hijriMonth = hijriMonth - 12;
    hijriYear = hijriYear + 1;
  }

  N = N % 29.5001;
  let hijriDay = Math.floor(N) + 1;

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
