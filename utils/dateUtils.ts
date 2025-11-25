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

// Gregorian to Hijri conversion using reference date method
// Reference: 26 November 2025 = 5 Jumada al-Akhira 1447
const gregorianToHijri = (gregorianDate: Date) => {
  // Reference point (known accurate mapping)
  const refGregorianDate = new Date(2025, 10, 26); // 26 November 2025 (month is 0-indexed)
  const refHijriDate = { year: 1447, month: 6, date: 5 }; // 5 Jumada al-Akhira 1447

  // Calculate days difference from reference date
  const timeDiff = gregorianDate.getTime() - refGregorianDate.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  // Start from reference Hijri date and add days
  let hijriYear = refHijriDate.year;
  let hijriMonth = refHijriDate.month;
  let hijriDate = refHijriDate.date;
  let daysToAdd = daysDiff;

  // Days in each Hijri month (Islamic calendar)
  const hijriMonthDays = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29]; // Standard pattern

  // Add days to reference date
  while (daysToAdd > 0) {
    const daysInCurrentMonth = hijriMonthDays[hijriMonth - 1];
    const daysLeftInMonth = daysInCurrentMonth - hijriDate + 1;

    if (daysToAdd >= daysLeftInMonth) {
      daysToAdd -= daysLeftInMonth;
      hijriDate = 1;
      hijriMonth++;

      if (hijriMonth > 12) {
        hijriMonth = 1;
        hijriYear++;
      }
    } else {
      hijriDate += daysToAdd;
      daysToAdd = 0;
    }
  }

  // Handle negative days (past dates)
  while (daysToAdd < 0) {
    hijriDate--;

    if (hijriDate < 1) {
      hijriMonth--;

      if (hijriMonth < 1) {
        hijriMonth = 12;
        hijriYear--;
      }

      hijriDate = hijriMonthDays[hijriMonth - 1];
    }

    daysToAdd++;
  }

  return {
    year: hijriYear,
    month: Math.max(1, Math.min(12, hijriMonth)),
    date: Math.max(1, Math.min(30, hijriDate)),
  };
};

export const formatDate = (date: Date = new Date()): FormattedDate => {
  const dayName = DAY_NAMES[date.getDay()];
  
  // Line 1: আজকের তারিখ ২৫ নভেম্বর ২০२५
  const gregorianDate = `${dayName} ${date.getDate()} ${GREGORIAN_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  
  // Calculate Hijri from Gregorian using algorithm
  const hijri = gregorianToHijri(date);
  
  const monthName = HIJRI_MONTHS[Math.max(0, Math.min(11, hijri.month - 1))] || 'অজানা';
  // Line 2: বুধবার 5 জমাদিউল আখির 1447
  const hijriDateString = `${dayName} ${hijri.date} ${monthName} ${hijri.year}`;

  return {
    hijri: hijriDateString,
    gregorian: gregorianDate,
    dayName: dayName,
  };
};
