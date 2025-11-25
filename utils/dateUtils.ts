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

// Accurate Gregorian to Hijri conversion using standard algorithm
export const gregorianToHijri = (date: Date): HijriDate => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Julian day number calculation
  let jd = Math.floor((1461 * (year + 4800 + Math.floor((month - 14) / 12))) / 4) + 
           Math.floor((367 * (month - 2 - 12 * Math.floor((month - 14) / 12))) / 12) - 
           Math.floor((3 * Math.floor((year + 4900 + Math.floor((month - 14) / 12)) / 100)) / 4) + 
           day - 32045;

  // Convert JD to Hijri
  const l = jd + 1;
  const n = Math.floor((l - 1) / 10631);
  const j = ((l - 1) % 10631) + 1;
  
  const r = Math.floor((j - 1) / 354.36667);
  const jj = ((j - 1) % 354.36667) + 1;
  
  const m = Math.floor((jj + 30.5001) / 29.5001);
  const dd = Math.floor((jj % 29.5001) + 1);
  
  const hijriYear = 30 * n + 354 * r + Math.floor(m) + 1;
  const hijriMonth = m > 12 ? 1 : Math.floor(m);
  const hijriDay = dd < 1 ? 30 : Math.ceil(dd);

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
