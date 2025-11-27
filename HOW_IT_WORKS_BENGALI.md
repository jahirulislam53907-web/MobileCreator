# Smart Muslim Backend সম্পূর্ণ Explanation (বাংলায়)

## 📁 ফাইল স্ট্রাকচার - সবকিছু কোথায় আছে

```
/home/runner/workspace/
├── server.js                      ← ব্যাকএন্ড সার্ভার (PORT 3000)
├── data/
│   └── quranComplete.json         ← কোরআন ডাটা (সব সূরা + আয়াত)
├── hooks/
│   └── useQuranAPI.ts            ← ফ্রন্টএন্ড থেকে API কল করার code
├── screens/
│   └── QuranReaderScreen.tsx      ← UI যেখানে সূরা দেখা যায়
├── App.tsx                        ← মূল অ্যাপ
└── package.json                   ← সব dependencies লিস্ট
```

---

## 🖥️ BACKEND কিভাবে কাজ করে?

### **Step 1: Server.js চালু হলে কি হয়?**

```javascript
// server.js চালু হয় → 
const app = express();  // Web server তৈরি হয়
const pool = new Pool({ connectionString: process.env.DATABASE_URL }); // DB connect

// Quran data file লোড হয়:
const QURAN_DATA = JSON.parse(fs.readFileSync('data/quranComplete.json'));
// Output: { totalSurahs: 114, surahs: [...] }

// Port 3000 এ listen শুরু করে:
app.listen(3000);
// আউটপুট: "🌙 Smart Muslim Premium Backend running on port 3000"
```

### **Step 2: API Endpoints - কি পাবেন?**

#### **(1) সব Surahs পেতে:**
```
GET http://localhost:3000/api/quran/surahs

Response:
{
  "success": true,
  "totalSurahs": 114,
  "surahs": [
    {
      "number": 1,
      "name": "Al-Fatihah",
      "nameBengali": "সূরা ফাতিহা",
      "numberOfAyahs": 7,
      "revelationType": "Meccan",
      "revelationTypeBengali": "মক্কী"
    }
  ]
}
```

#### **(2) নির্দিষ্ট Surah পেতে (সব Ayah সহ):**
```
GET http://localhost:3000/api/quran/surah/1

Response:
{
  "success": true,
  "surah": {
    "number": 1,
    "name": "Al-Fatihah",
    "nameBengali": "সূরা ফাতিহা",
    "numberOfAyahs": 7,
    "ayahs": [
      {
        "number": 1,
        "arabic": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        "bengali": "শুরু করছি আল্লাহর নামে..."
      }
    ]
  }
}
```

#### **(3) নির্দিষ্ট Ayah পেতে (সব Translation সহ):**
```
GET http://localhost:3000/api/quran/ayah/1/1

Response:
{
  "success": true,
  "surah": 1,
  "ayah": 1,
  "arabic": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  "bengali": "শুরু করছি আল্লাহর নামে যিনি অত্যন্ত করুণাময়...",
  "translations": {
    "english": "English translation...",
    "urdu": "اردو ترجمہ...",
    "hindi": "हिंदी अनुवाद..."
  },
  "audioUrls": {
    "abdul-basit": "https://cdn.example.com/1_1.mp3",
    "al-minshawi": "https://cdn.example.com/1_1_minshawi.mp3"
  }
}
```

---

## 📱 FRONTEND কিভাবে কাজ করে?

### **Step 1: useQuranAPI Hook**

```typescript
// hooks/useQuranAPI.ts এ:

const API_BASE_URL = 'http://localhost:3000'; 
// ← এটা সার্ভারের address

export const useQuranAPI = () => {
  const fetchSurah = async (surahNumber) => {
    // Backend এ call করে:
    const response = await fetch(`${API_BASE_URL}/api/quran/surah/${surahNumber}`);
    // Backend থেকে JSON ডাটা পায়
    const data = await response.json();
    return data.surah; // সব Ayah সহ return করে
  };
};
```

### **Step 2: Screen এ ডাটা দেখানো**

```typescript
// screens/QuranReaderScreen.tsx এ:

export default function QuranReaderScreen({ surahNumber }) {
  const { fetchSurah, loading, error } = useQuranAPI();
  const [surahData, setSurahData] = useState(null);

  useEffect(() => {
    // Surah load করা শুরু হয়:
    const data = await fetchSurah(1);
    // data = { number: 1, name: "Al-Fatihah", ayahs: [...] }
    setSurahData(data); // State update হয়
  }, []);

  // UI তে দেখানো হয়:
  return (
    <Text>{surahData?.nameBengali}</Text>  // "সূরা ফাতিহা"
    // এবং সব Ayahs loop করে দেখানো হয়
  );
}
```

---

## 🗄️ DATABASE কোথায়?

```javascript
// server.js এ:
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Environment variable থেকে:
process.env.DATABASE_URL = "postgresql://user:pass@host:5432/dbname"

// এটা Replit-এর built-in PostgreSQL database!
// তবে এই প্রজেক্টে প্রথমে JSON file থেকে ডাটা নিচ্ছি।

// ভবিষ্যতে: Database এ রাখলে:
app.get('/api/quran/surahs', async (req, res) => {
  const result = await pool.query('SELECT * FROM surahs');
  res.json(result.rows);
});
```

---

## 🔄 ডাটা কিভাবে আসে? (সম্পূর্ণ Flow)

```
1. User Expo Go এ সূরা ফাতিহা select করে

2. QuranReaderScreen রেন্ডার হয় → useQuranAPI hook চলে

3. fetchSurah(1) call হয়
   ↓
   fetch('http://localhost:3000/api/quran/surah/1')

4. Backend server এ request পৌঁছায়
   ↓
   server.js → app.get('/api/quran/surah/:number')
   ↓
   QURAN_DATA থেকে Surah #1 খুঁজে বের করে
   ↓
   JSON response পাঠায়

5. Frontend এ response পায়
   ↓
   setSurahData(response) → State update
   ↓
   Screen re-render হয় → সূরা ফাতিহা + সব Ayahs দেখা যায়
```

---

## ❌ NETWORK ISSUE - কেন হয়েছিল?

**সমস্যা:**
```
useQuranAPI.ts এ:
const API_BASE_URL = 'http://192.168.1.100:3000';
// ← আপনার local IP দেওয়া ছিল
// কিন্তু localhost এ server বন্ধ ছিল
```

**সমাধান:**
```
1. server.js চালু করতে হবে:
   npm run dev

2. useQuranAPI.ts এ এই line change করতে হবে:
   const API_BASE_URL = 'http://localhost:3000';
   
   বা আপনার actual local IP:
   const API_BASE_URL = 'http://192.168.X.X:3000';
   
3. Replit এ server.js run করার setup নেই যদি...
   তাহলে separate terminal এ:
   node server.js
```

---

## 📋 সম্পূর্ণ Setup Process

### **Step 1: Backend Server চালু করুন**
```bash
cd /home/runner/workspace
node server.js

Output:
🌙 Smart Muslim Premium Backend running on port 3000
✨ Features: Quran Data, Multi-Language, Offline Sync, Premium Quality
```

### **Step 2: Frontend Hook Update করুন**
```typescript
// hooks/useQuranAPI.ts এ:
const API_BASE_URL = 'http://localhost:3000'; // এটা ঠিক করুন
```

### **Step 3: Frontend চালু করুন**
```bash
npm run dev

Output:
Metro waiting on exp://...
Scan the QR code with Expo Go
```

### **Step 4: Expo Go এ Test করুন**
```
1. QR code scan করুন
2. Quran Reader Screen এ যান
3. সূরা ফাতিহা load হবে backend থেকে ✅
```

---

## 📊 ডাটা কোথায় সংরক্ষিত?

### **Local (JSON File):**
```
/home/runner/workspace/data/quranComplete.json
├── Contains: সব 114 Surahs structure
├── Size: ~5MB (সম্পূর্ণ data সহ)
└── Format: JSON
```

### **Backend Memory (Runtime):**
```
server.js চালু হলে:
let QURAN_DATA = {}; // এখানে data load হয়
// QURAN_DATA = {
//   totalSurahs: 114,
//   surahs: [ { number: 1, ayahs: [...] }, ... ]
// }
```

### **Frontend (Device Storage - ভবিষ্যতে):**
```
AsyncStorage এ bookmarks + preferences save করা যাবে:
- Last read position
- Bookmarks
- Language preference
- Text size
```

---

## 🎯 সারাংশ

**যা এখন আছে:**
- ✅ Backend server (server.js) - port 3000
- ✅ Quran data (quranComplete.json) - সব Surah structure
- ✅ API endpoints - সব ডাটা fetch করার জন্য
- ✅ Frontend hook (useQuranAPI) - server এ call করার জন্য
- ✅ UI Screen - সূরা দেখানোর জন্য

**যা যোগ করতে হবে:**
- ❌ সম্পূর্ণ 6236 Ayahs ডাটা quranComplete.json এ
- ❌ Database integration (PostgreSQL)
- ❌ Multi-language translations
- ❌ Audio streaming setup

---

**এখনই Test করুন!** 🚀
