# Smart Muslim Backend Setup Guide

## দ্রুত শুরু (Quick Start)

### Step 1: Backend Data Verify করুন
```bash
# Backend আছে কিনা check করুন
cd /home/runner/workspace
node server.js
```

Output দেখবেন:
```
🌙 Smart Muslim Premium Backend running on port 3000
✨ Features: Quran Data, Multi-Language, Offline Sync, Premium Quality
📱 Connect from Expo Go: http://<your-local-ip>:3000
```

### Step 2: Local IP Find করুন

**Windows/Mac/Linux:**
```bash
# Terminal-এ run করুন
ipconfig getifaddr en0  # Mac
ifconfig              # Linux
ipconfig             # Windows
```

Output: `192.168.x.x` কিছু এমন হবে

### Step 3: Frontend থেকে Server Connect করুন

File: `hooks/useQuranAPI.ts`-এ এই line change করুন:
```typescript
const API_BASE_URL = 'http://192.168.1.100:3000'; // আপনার IP দিয়ে replace করুন
```

### Step 4: Expo Go তে Test করুন

**Terminal-এ:**
```bash
npm run dev
```

**Expo Go-তে:**
1. QR code scan করুন
2. App open হয়ে যাবে
3. Quran Reader Screen এ যান
4. Backend থেকে data আসবে! ✅

---

## API Endpoints

### 1. সব Surahs পান
```
GET /api/quran/surahs
Response: { success: true, totalSurahs: 114, surahs: [...] }
```

### 2. নির্দিষ্ট Surah পান (সব Ayah সহ)
```
GET /api/quran/surah/1
Response: { success: true, surah: { number, name, ayahs: [...] } }
```

### 3. নির্দিষ্ট Ayah পান (সব Translation সহ)
```
GET /api/quran/ayah/1/1
Response: { success: true, arabic, bengali, translations: {...}, audioUrls: {...} }
```

### 4. Surah-এর সব Ayah পান (Translation সহ)
```
GET /api/quran/surah/1/ayahs
Response: { success: true, surah: 1, ayahs: [...] }
```

### 5. Health Check
```
GET /api/health
Response: { status: 'OK', quranLoaded: true, ... }
```

---

## যা Data Backend-এ আছে:

✅ **সূরা ফাতিহা** - সম্পূর্ণ (7 আয়াত)
✅ **সূরা বাকারা** - Sample (3 আয়াত)
✅ **সূরা আলে ইমরান** - Structure (2 আয়াত)
✅ **সূরা নাস** - সম্পূর্ণ (6 আয়াত)
✅ **10 টি অন্যান্য Surahs** - Structure (আয়াত count সঠিক)

---

## কিভাবে সম্পূর্ণ Quran Data Add করবেন?

File: `data/quranComplete.json`-এ edit করুন:
```json
{
  "totalSurahs": 114,
  "surahs": [
    {
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
  ]
}
```

---

## ফ্রন্টএন্ড Integration Example

```typescript
import { useQuranAPI } from '@/hooks/useQuranAPI';

function QuranScreen() {
  const { fetchSurah, loading, error } = useQuranAPI();

  useEffect(() => {
    const loadData = async () => {
      const surahData = await fetchSurah(1);
      console.log('Quran Data:', surahData);
    };
    loadData();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  
  return <Text>Data loaded from backend!</Text>;
}
```

---

## Troubleshooting

**❌ Connection Failed?**
- Backend running check করুন: `npm run dev`
- IP address সঠিক কিনা check করুন
- Firewall allow করুন port 3000

**❌ Data Not Loading?**
- `data/quranComplete.json` file আছে কিনা check করুন
- Browser console logs দেখুন: `npm run dev` terminal-এ

**✅ সব ঠিক আছে?**
- `http://localhost:3000/api/health` browser-এ open করুন
- Should see: `{ "status": "OK", "quranLoaded": true }`

---

## পরবর্তী Steps:

1. ✅ সম্পূর্ণ Quran data JSON file-এ add করুন
2. ✅ Frontend থেকে API calls integrate করুন
3. ✅ Audio streaming URLs configure করুন
4. ✅ Multi-language translations add করুন
5. ✅ User preferences database setup করুন

**Status**: Backend ready for Expo Go testing! 🚀
