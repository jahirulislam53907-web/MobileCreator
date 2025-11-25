import HijriDate from 'hijri-date';

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

export const formatDate = (date: Date = new Date()): FormattedDate => {
  const dayName = DAY_NAMES[date.getDay()];
  const gregorianDate = `${dayName}, ${date.getDate()} ${GREGORIAN_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  
  // Using hijri-date library for accurate Hijri date
  const hijriDate = new HijriDate(date);
  const hijri = hijriDate.toObject();
  
  const monthName = HIJRI_MONTHS[hijri.month - 1] || 'অজানা';
  const hijriDateString = `${hijri.date} ${monthName} ${hijri.year}`;

  return {
    hijri: hijriDateString,
    gregorian: gregorianDate,
    dayName: dayName,
  };
};
