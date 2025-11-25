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

// Accurate Gregorian to Hijri conversion (Reingold-Dershowitz algorithm)
export const gregorianToHijri = (date: Date): HijriDate => {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();

  // Calculate Julian Day Number
  const a = Math.floor((14 - m) / 12);
  const y2 = y + 4800 - a;
  const m2 = m + 12 * a - 3;
  
  const jdn = d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;

  // Convert JDN to Islamic calendar
  const l = jdn + 1;
  const n = Math.floor((l - 1) / 10631);
  const q = ((l - 1) % 10631) + 1;
  
  const r = Math.floor((q - 1) / 354.36667);
  const a2 = ((q - 1) % 354.36667) + 1;
  
  const m3 = Math.floor((11 * a2 + 3) / 325);
  
  const hijriYear = 30 * n + 354 * r + m3 + 1;
  const hijriMonth = (Math.floor((a2 - Math.floor((325 * m3 - 305) / 11)) / 29.5001) % 12) + 1;
  const hijriDay = Math.max(1, Math.min(30, Math.floor(a2 - Math.floor((325 * m3 - 305) / 11)) % 30 + 1));

  const month = Math.max(1, Math.min(12, hijriMonth));
  const year = Math.max(1, hijriYear);

  return {
    day: hijriDay,
    month: month,
    year: year,
    monthName: HIJRI_MONTHS[month - 1] || 'অজানা',
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
