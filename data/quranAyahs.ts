export interface AyahExtended {
  surahNumber: number;
  ayahNumber: number;
  arabic: string;
  bengali: string;
  translations: Record<string, string>;
  audioUrl?: string;
  audioQaris?: { name: string; url: string }[];
}

// Extended Quran Ayahs with all language translations
export const QURAN_AYAHS_EXTENDED: AyahExtended[] = [
  // Surah Al-Fatihah
  {
    surahNumber: 1,
    ayahNumber: 1,
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    bengali: "শুরু করছি আল্লাহর নামে যিনি অত্যন্ত করুণাময়, দয়াশীল",
    translations: {
      english: "In the name of Allah, the Entirely Merciful, the Especially Merciful",
      urdu: "شروع کرتا ہوں اللہ کے نام سے جو بہت رحم والا، بہت مہربان ہے",
      hindi: "मैं अल्लाह के नाम से शुरुआत करता हूँ जो बहुत दयालु और बहुत कृपाशील है",
      turkish: "Rahman ve Rahim olan Allah'ın adıyla başlarım",
      indonesian: "Dengan menyebut nama Allah yang Maha Pengasih lagi Maha Penyayang",
      malay: "Dengan nama Allah yang Maha Pengasih lagi Maha Penyayang",
      pashto: "د الله په نوم سره چې خورا رحمن او رحيم دی",
      somali: "Magaalada Allah ee Ar-Rahman ee Ar-Rahim"
    },
    audioQaris: [
      { name: "Abdul Basit", url: "https://cdn.example.com/abdul-basit/1_1.mp3" },
      { name: "Al-Minshawi", url: "https://cdn.example.com/al-minshawi/1_1.mp3" }
    ]
  },
  {
    surahNumber: 1,
    ayahNumber: 2,
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    bengali: "সমস্ত প্রশংসা আল্লাহর জন্য যিনি বিশ্বজাহানের প্রতিপালক",
    translations: {
      english: "All praise is due to Allah, the Sustainer of all the worlds",
      urdu: "تمام تعریفیں اللہ کے لیے ہیں جو تمام جہانوں کا پالنے والا ہے",
      hindi: "सभी प्रशंसा अल्लाह के लिए है जो सभी दुनियाओं का पालनकर्ता है",
      turkish: "Tüm hamdolsun alemlerin Rabbı olan Allah'a",
      indonesian: "Segala puji bagi Allah, Penguasa seluruh alam",
      malay: "Segala pujian adalah untuk Allah, Tuhan semesta alam",
      pashto: "ټول تعریفونه د الله لپاره دي چې د ټولو عالمونو رب دی",
      somali: "Mahadsanideen waa Allaah Eryahay ubadyada caalmiga oo dhan"
    },
    audioQaris: [
      { name: "Abdul Basit", url: "https://cdn.example.com/abdul-basit/1_2.mp3" }
    ]
  },
  {
    surahNumber: 1,
    ayahNumber: 3,
    arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
    bengali: "অত্যন্ত করুণাময়, দয়াশীল",
    translations: {
      english: "The Entirely Merciful, the Especially Merciful",
      urdu: "بہت رحم والا، بہت مہربان",
      hindi: "बहुत दयालु और बहुत कृपाशील",
      turkish: "Rahman ve Rahim olan",
      indonesian: "Yang Maha Pengasih lagi Maha Penyayang",
      malay: "Yang Maha Pengasih dan Maha Penyayang",
      pashto: "خورا رحمن او رحيم",
      somali: "Ninka Ar-Rahman ah iyo Ar-Rahim ah"
    }
  },
  // Surah Al-Baqarah
  {
    surahNumber: 2,
    ayahNumber: 1,
    arabic: "الم",
    bengali: "আলিফ লাম মিম",
    translations: {
      english: "Alif, Lam, Meem",
      urdu: "الف، لام، میم",
      hindi: "अलिफ़, लाम, मीम",
      turkish: "Elif Lam Mim",
      indonesian: "Alif Lam Mim",
      malay: "Alif Lam Mim",
      pashto: "الف، لام، میم",
      somali: "Alif, Lam, Mim"
    }
  },
  // ... Additional ayahs would follow same structure
];

export function getAyahsBySurah(surahNumber: number): AyahExtended[] {
  return QURAN_AYAHS_EXTENDED.filter(ayah => ayah.surahNumber === surahNumber);
}

export function getAyah(surahNumber: number, ayahNumber: number): AyahExtended | undefined {
  return QURAN_AYAHS_EXTENDED.find(
    ayah => ayah.surahNumber === surahNumber && ayah.ayahNumber === ayahNumber
  );
}

export function getTranslation(surahNumber: number, ayahNumber: number, language: string): string {
  const ayah = getAyah(surahNumber, ayahNumber);
  if (!ayah) return '';
  
  if (language === 'arabic') return ayah.arabic;
  if (language === 'bengali') return ayah.bengali;
  
  return ayah.translations[language] || ayah.bengali;
}
