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

// Gregorian to Hijri conversion using mathematical algorithm
const gregorianToHijri = (gregorianDate: Date) => {
  const day = gregorianDate.getDate();
  const month = gregorianDate.getMonth() + 1;
  const year = gregorianDate.getFullYear();

  // Algorithm: Convert Gregorian to Hijri using proven mathematical formula
  // Step 1: Calculate the number of days from January 1, year 1 (Julian Day Number)
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  // Julian Day Number
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + 
              Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // Step 2: Convert Julian Day to Hijri
  // Using the astronomical Hijri calendar algorithm
  const n = jdn + 1;
  const q = Math.floor((n - 1) / 10631);
  const r = (n - 1) % 10631;
  
  const a1 = Math.floor(r / 354.36667);
  const w = r % 354.36667;
  
  const q1 = Math.floor((w % 29.5001) / 29.5001);
  const d = Math.floor(w / 29.5001);
  
  const h_y = 354 * a1 + 30 * q + Math.floor(d) + 1;
  const h_m = Math.ceil((w % 29.5001) / 29.5001 * 12);
  const h_d = Math.max(1, Math.ceil(w % 29.5001));

  return {
    year: h_y,
    month: h_m > 0 && h_m <= 12 ? h_m : 12,
    date: h_d > 0 && h_d <= 30 ? h_d : 30,
  };
};

export const formatDate = (date: Date = new Date()): FormattedDate => {
  const dayName = DAY_NAMES[date.getDay()];
  const gregorianDate = `${dayName}, ${date.getDate()} ${GREGORIAN_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  
  // Calculate Hijri from Gregorian using algorithm
  const hijri = gregorianToHijri(date);
  
  const monthName = HIJRI_MONTHS[Math.max(0, Math.min(11, hijri.month - 1))] || 'অজানা';
  const hijriDateString = `${hijri.date} ${monthName} ${hijri.year}`;

  return {
    hijri: hijriDateString,
    gregorian: gregorianDate,
    dayName: dayName,
  };
};
