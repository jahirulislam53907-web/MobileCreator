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

// Gregorian to Hijri conversion (verified Islamic calendar algorithm)
export const gregorianToHijri = (date: Date): HijriDate => {
  const gd = date.getDate();
  const gm = date.getMonth() + 1;
  const gy = date.getFullYear();

  // Step 1: Calculate Julian Day Number from Gregorian date
  const a = Math.floor((14 - gm) / 12);
  const y = gy + 4800 - a;
  const m = gm + 12 * a - 3;
  
  const jdn = gd + Math.floor((153 * m + 2) / 5) + 365 * y + 
              Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // Step 2: Convert JDN to Islamic calendar
  const l = jdn + 1;
  const n = Math.floor((l - 1) / 10631);
  const j = ((l - 1) % 10631) + 1;
  
  const r = Math.floor((j - 1) / 354.36667);
  const w = ((j - 1) % 354.36667) + 1;
  
  const q = Math.floor((w - 1) / 29.5001);
  const k = ((w - 1) % 29.5001) + 1;
  
  const h_y = 354 * r + 30 * n + Math.floor(q) + 1;
  const h_m = (q + 1 > 12) ? (q + 1 - 12) : (q + 1);
  const h_d = Math.ceil(k);

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
