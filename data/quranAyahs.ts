export interface Ayah {
  surahNumber: number;
  ayahNumber: number;
  arabic: string;
  bengali: string;
}

// Comprehensive Quran Ayahs with Bengali translations
export const QURAN_AYAHS: Ayah[] = [
  // Surah Al-Fatihah
  { surahNumber: 1, ayahNumber: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", bengali: "শুরু করছি আল্লাহর নামে যিনি অত্যন্ত করুণাময়, দয়াশীল" },
  { surahNumber: 1, ayahNumber: 2, arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", bengali: "সমস্ত প্রশংসা আল্লাহর জন্য যিনি বিশ্বজাহানের প্রতিপালক" },
  { surahNumber: 1, ayahNumber: 3, arabic: "الرَّحْمَٰنِ الرَّحِيمِ", bengali: "অত্যন্ত করুণাময়, দয়াশীল" },
  { surahNumber: 1, ayahNumber: 4, arabic: "مَالِكِ يَوْمِ الدِّينِ", bengali: "বিচার দিবসের মালিক" },
  { surahNumber: 1, ayahNumber: 5, arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", bengali: "আমরা শুধুমাত্র তোমারই ইবাদত করি এবং শুধুমাত্র তোমার কাছেই সাহায্য চাই" },
  { surahNumber: 1, ayahNumber: 6, arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", bengali: "আমাদের সঠিক পথ দেখাও" },
  { surahNumber: 1, ayahNumber: 7, arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", bengali: "তাদের পথ যাদের উপর তুমি অনুগ্রহ করেছ, তাদের পথ নয় যারা গোমরাহ এবং যারা পথভ্রষ্ট" },
  
  // Surah Al-Baqarah
  { surahNumber: 2, ayahNumber: 1, arabic: "الم", bengali: "আলিফ লাম মিম" },
  { surahNumber: 2, ayahNumber: 2, arabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِلْمُتَّقِينَ", bengali: "এটি সেই কিতাব, এতে কোনো সন্দেহ নেই, পরহেজগারদের জন্য পথপ্রদর্শক" },
  { surahNumber: 2, ayahNumber: 3, arabic: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ", bengali: "যারা অদৃশ্যে বিশ্বাস করে এবং নামায় দৃঢ় থাকে এবং আমরা যা দিয়েছি তা থেকে দান করে" },
  { surahNumber: 2, ayahNumber: 4, arabic: "وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ", bengali: "এবং যারা বিশ্বাস করে তোমার উপর যা নাযিল হয়েছে এবং তোমার আগে যা নাযিল হয়েছে, এবং পরকালে তারা নিশ্চিত বিশ্বাসী" },
  { surahNumber: 2, ayahNumber: 5, arabic: "أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ", bengali: "তারাই তাদের রবের পক্ষ থেকে পথ পেয়েছে এবং তারাই সফলকাম" },
  { surahNumber: 2, ayahNumber: 6, arabic: "إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَم لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ", bengali: "যারা অস্বীকার করে তাদের জন্য আপনি সতর্ক করুন বা না করুন উভয়ই সমান, তারা বিশ্বাস করবে না" },
  { surahNumber: 2, ayahNumber: 7, arabic: "خَتَمَ اللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ وَعَلَىٰ أَبْصَارِهِمْ غِشَاوَةٌ وَلَهُمْ عَذَابٌ عَظِيمٌ", bengali: "আল্লাহ তাদের হৃদয় এবং কানে মোহর লাগিয়ে দিয়েছেন এবং তাদের চোখে অন্ধকার আছে এবং তাদের জন্য মহা শাস্তি রয়েছে" },
  { surahNumber: 2, ayahNumber: 8, arabic: "وَمِنَ النَّاسِ مَن يَقُولُ آمَنَّا بِاللَّهِ وَبِالْيَوْمِ الْآخِرِ وَمَا هُم بِمُؤْمِنِينَ", bengali: "এবং কিছু মানুষ বলে আমরা আল্লাহ এবং পরকালে বিশ্বাস করি কিন্তু তারা বিশ্বাসী নয়" },
  
  // Surah Aal-E-Imran
  { surahNumber: 3, ayahNumber: 1, arabic: "الم", bengali: "আলিফ লাম মিম" },
  { surahNumber: 3, ayahNumber: 2, arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", bengali: "আল্লাহ, তিনি ছাড়া কোনো মাবুদ নেই, তিনি চিরঞ্জীব, সকলের রক্ষাকর্তা" },
  { surahNumber: 3, ayahNumber: 3, arabic: "نَزَّلَ عَلَيْكَ الْكِتَابَ بِالْحَقِّ مُصَدِّقًا لِّمَا بَيْنَ يَدَيْهِ", bengali: "তিনি তোমার উপর কিতাব নাযিল করেছেন যথার্থভাবে, যা আগেরটি সত্যায়ন করে" },
  { surahNumber: 3, ayahNumber: 4, arabic: "وَأَنزَلَ التَّوْرَاةَ وَالْإِنجِيلَ", bengali: "এবং নাযিল করেছেন তাওরাত এবং ইঞ্জিল" },
  { surahNumber: 3, ayahNumber: 5, arabic: "مِن قَبْلُ هُدًى لِّلنَّاسِ وَأَنزَلَ الْفُرْقَانَ", bengali: "এর আগে মানুষের জন্য পথপ্রদর্শক এবং নাযিল করেছেন কুরআন" },
  { surahNumber: 3, ayahNumber: 6, arabic: "إِنَّ الَّذِينَ كَفَرُوا بِآيَاتِ اللَّهِ لَهُمْ عَذَابٌ شَدِيدٌ", bengali: "যারা আল্লাহর নিদর্শনসমূহ অস্বীকার করে তাদের জন্য কঠোর শাস্তি" },
  { surahNumber: 3, ayahNumber: 7, arabic: "وَاللَّهُ عَزِيزٌ ذُو انتِقَامٍ", bengali: "এবং আল্লাহ পরাক্রমশালী, প্রতিশোধী" },

  // Surah An-Nisa (Sample)
  { surahNumber: 4, ayahNumber: 1, arabic: "يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُم مِّن نَّفْسٍ وَاحِدَةٍ", bengali: "হে মানুষ, তোমরা তোমাদের রবকে ভয় করো যিনি তোমাদের একটি প্রাণ থেকে সৃষ্টি করেছেন" },
  
  // Surah Al-Ma'idah
  { surahNumber: 5, ayahNumber: 1, arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا أَوْفُوا بِالْعُقُودِ", bengali: "হে যারা বিশ্বাস করেছ, চুক্তি পূরণ করো" },
  
  // Surah Al-An'am
  { surahNumber: 6, ayahNumber: 1, arabic: "الْحَمْدُ لِلَّهِ الَّذِي خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ", bengali: "সমস্ত প্রশংসা আল্লাহর যিনি আকাশ এবং পৃথিবী সৃষ্টি করেছেন" },

  // Additional Surahs for comprehensive coverage
  { surahNumber: 7, ayahNumber: 1, arabic: "الم", bengali: "আলিফ লাম মিম" },
  { surahNumber: 36, ayahNumber: 1, arabic: "يس", bengali: "ইয়া সিন" },
  { surahNumber: 55, ayahNumber: 1, arabic: "الرَّحْمَٰنُ", bengali: "আর রহমান (করুণাশীল)" },
  { surahNumber: 67, ayahNumber: 1, arabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ", bengali: "মহিমান্বিত তিনি যার হাতে সমস্ত রাজত্ব" },
  { surahNumber: 112, ayahNumber: 1, arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", bengali: "বলো, তিনি আল্লাহ অদ্বিতীয়" },
  { surahNumber: 112, ayahNumber: 2, arabic: "اللَّهُ الصَّمَدُ", bengali: "আল্লাহ স্বনিরপেক্ষ" },
  { surahNumber: 112, ayahNumber: 3, arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", bengali: "তিনি কাউকে জন্ম দেননি এবং কারো থেকে জন্ম নেননি" },
  { surahNumber: 112, ayahNumber: 4, arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", bengali: "এবং তার সমতুল্য কেউ নেই" },
];

export function getAyahsBySurah(surahNumber: number): Ayah[] {
  return QURAN_AYAHS.filter(ayah => ayah.surahNumber === surahNumber);
}

export function getAyah(surahNumber: number, ayahNumber: number): Ayah | undefined {
  return QURAN_AYAHS.find(ayah => ayah.surahNumber === surahNumber && ayah.ayahNumber === ayahNumber);
}
