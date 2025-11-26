export interface Ayah {
  surahNumber: number;
  ayahNumber: number;
  arabic: string;
  bengali: string;
}

// Sample Quran Ayahs - Extended set for comprehensive reading
export const QURAN_AYAHS: Ayah[] = [
  // Surah Al-Fatihah
  { surahNumber: 1, ayahNumber: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", bengali: "শুরু করছি আল্লাহর নামে যিনি অত্যন্ত করুণাময়, দয়াশীল" },
  { surahNumber: 1, ayahNumber: 2, arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", bengali: "সমস্ত প্রশংসা আল্লাহর জন্য যিনি বিশ্বজাহানের প্রতিপালক" },
  { surahNumber: 1, ayahNumber: 3, arabic: "الرَّحْمَٰنِ الرَّحِيمِ", bengali: "অত্যন্ত করুণাময়, দয়াশীল" },
  { surahNumber: 1, ayahNumber: 4, arabic: "مَالِكِ يَوْمِ الدِّينِ", bengali: "বিচার দিবসের মালিক" },
  { surahNumber: 1, ayahNumber: 5, arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", bengali: "আমরা শুধুমাত্র তোমারই ইবাদত করি এবং শুধুমাত্র তোমার কাছেই সাহায্য চাই" },
  { surahNumber: 1, ayahNumber: 6, arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", bengali: "আমাদের সঠিক পথ দেখাও" },
  { surahNumber: 1, ayahNumber: 7, arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", bengali: "তাদের পথ যাদের উপর তুমি অনুগ্রহ করেছ, তাদের পথ নয় যারা গোমরাহ এবং যারা পথভ্রষ্ট" },
  
  // Surah Al-Baqarah (Sample)
  { surahNumber: 2, ayahNumber: 1, arabic: "الم", bengali: "আলিফ লাম মিম" },
  { surahNumber: 2, ayahNumber: 2, arabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِلْمُتَّقِينَ", bengali: "এটি সেই কিতাব, এতে কোনো সন্দেহ নেই, পরহেজগারদের জন্য পথপ্রদর্শক" },
  { surahNumber: 2, ayahNumber: 3, arabic: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ", bengali: "যারা অদৃশ্যে বিশ্বাস করে এবং নামায় দৃঢ় থাকে এবং আমরা যা দিয়েছি তা থেকে দান করে" },
  { surahNumber: 2, ayahNumber: 4, arabic: "وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ", bengali: "এবং যারা বিশ্বাস করে তোমার উপর যা নাযিল হয়েছে এবং তোমার আগে যা নাযিল হয়েছে, এবং পরকালে তারা নিশ্চিত বিশ্বাসী" },
  { surahNumber: 2, ayahNumber: 5, arabic: "أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ", bengali: "তারাই তাদের রবের পক্ষ থেকে পথ পেয়েছে এবং তারাই সফলকাম" },

  // Surah Aal-E-Imran (Sample)
  { surahNumber: 3, ayahNumber: 1, arabic: "الم", bengali: "আলিফ লাম মিম" },
  { surahNumber: 3, ayahNumber: 2, arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", bengali: "আল্লাহ, তিনি ছাড়া কোনো মাবুদ নেই, তিনি চিরঞ্জীব, সকলের রক্ষাকর্তা" },
  { surahNumber: 3, ayahNumber: 3, arabic: "نَزَّلَ عَلَيْكَ الْكِتَابَ بِالْحَقِّ مُصَدِّقًا لِّمَا بَيْنَ يَدَيْهِ وَأَنزَلَ التَّوْرَاةَ وَالْإِنجِيلَ", bengali: "তিনি তোমার উপর কিতাব নাযিল করেছেন যথার্থভাবে, যা আগেরটি সত্যায়ন করে এবং নাযিল করেছেন তাওরাত এবং ইঞ্জিল" },
];

export function getAyahsBySurah(surahNumber: number): Ayah[] {
  return QURAN_AYAHS.filter(ayah => ayah.surahNumber === surahNumber);
}

export function getAyah(surahNumber: number, ayahNumber: number): Ayah | undefined {
  return QURAN_AYAHS.find(ayah => ayah.surahNumber === surahNumber && ayah.ayahNumber === ayahNumber);
}
