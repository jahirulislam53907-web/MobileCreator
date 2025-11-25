export interface QuranVerse {
  id: number;
  surah: string;
  surahNumber: number;
  ayah: number;
  arabic: string;
  bengali: string;
}

// Sample Quran data - this will be expanded to include all 6666 verses
// For now, showing structure with first few verses from each surah
export const QURAN_DATA: QuranVerse[] = [
  {
    id: 1,
    surah: "সূরা আল-ফাতিহা",
    surahNumber: 1,
    ayah: 1,
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    bengali: "আল্লাহর নামে শুরু করছি যিনি অত্যন্ত দয়াবান, করুণাময়।"
  },
  {
    id: 2,
    surah: "সূরা আল-ফাতিহা",
    surahNumber: 1,
    ayah: 2,
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    bengali: "সকল প্রশংসা আল্লাহর জন্য যিনি সৃষ্টিকুলের প্রতিপালক।"
  },
  {
    id: 3,
    surah: "সূরা আল-বাকারা",
    surahNumber: 2,
    ayah: 1,
    arabic: "الم ۝ ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ",
    bengali: "আলিফ লাম মীম। এটি সেই কিতাব যাতে কোনো সন্দেহ নেই।"
  },
  {
    id: 4,
    surah: "সূরা আল-বাকারা",
    surahNumber: 2,
    ayah: 2,
    arabic: "هُدًى لِّلْمُتَّقِينَ",
    bengali: "এটি পরহেজগারদের জন্য হিদায়েত।"
  },
  {
    id: 5,
    surah: "সূরা আল-বাকারা",
    surahNumber: 2,
    ayah: 3,
    arabic: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ",
    bengali: "যারা অদৃশ্যের প্রতি বিশ্বাস করে।"
  },
  {
    id: 6,
    surah: "সূরা আল-বাকারা",
    surahNumber: 2,
    ayah: 4,
    arabic: "وَيُقِيمُونَ الصَّلَاةَ",
    bengali: "এবং নামায় দাঁড়ায়।"
  },
  {
    id: 7,
    surah: "সূরা আল-বাকারা",
    surahNumber: 2,
    ayah: 5,
    arabic: "وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ",
    bengali: "আর আমি তাদের যে রিজক দিয়েছি তা থেকে ব্যয় করে।"
  },
  {
    id: 8,
    surah: "সূরা আলে-ইমরান",
    surahNumber: 3,
    ayah: 1,
    arabic: "الم ۝",
    bengali: "আলিফ লাম মীম।"
  },
  {
    id: 9,
    surah: "সূরা আলে-ইমরান",
    surahNumber: 3,
    ayah: 2,
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
    bengali: "আল্লাহ, তিনি ছাড়া কোনো ইলাহ নেই, চিরঞ্জীব, সর্বস্থায়ী।"
  },
  {
    id: 10,
    surah: "সূরা আয়াত-আল-কুরসি (সূরা আল-বাকারা)",
    surahNumber: 2,
    ayah: 255,
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۖ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    bengali: "আল্লাহ, তিনি ছাড়া কোনো ইলাহ নেই, তিনি চিরঞ্জীব, সবসময় প্রতিষ্ঠিত। তাঁকে তন্দ্রা এবং নিদ্রা স্পর্শ করে না। আকাশ ও পৃথিবীতে যা কিছু আছে, সবই তাঁর। কে আছে যে তাঁর কাছে সুপারিশ করতে পারে তাঁর অনুমতি ছাড়া? তিনি জানেন তাদের সামনে কী আছে এবং তাদের পিছনে কী আছে। এবং তারা তাঁর জ্ঞান থেকে কোনো কিছুই আয়ত্ত করতে পারে না, কেবল যা তিনি চান তা ছাড়া। তাঁর আরশ আকাশ ও পৃথিবীকে ব্যাপ্ত করে রয়েছে। আর এ দুটি বহন করতে তাঁকে ক্লান্ত করে না। তিনি সর্বোচ্চ, সর্বশ্রেষ্ঠ।"
  }
];

export const getQuranVerses = (): QuranVerse[] => {
  return QURAN_DATA;
};

export const getVerseById = (id: number): QuranVerse | undefined => {
  return QURAN_DATA.find(verse => verse.id === id);
};

export const getVersesBySurah = (surahNumber: number): QuranVerse[] => {
  return QURAN_DATA.filter(verse => verse.surahNumber === surahNumber);
};
