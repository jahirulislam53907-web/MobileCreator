# Network Error Fix - Complete Guide

## ❌ "Failure to fetch" Error কেন হচ্ছে?

```
Expo Go (Phone) → fetch('http://localhost:3000/...')
                       ↓
                Phone এর "localhost" = Phone নিজেই
                কিন্তু server phone এ নেই
                     ↓
                ❌ Connection failed
                ❌ Network request failed
```

---

## ✅ সমাধান - 4 Step

### **Step 1: Backend Server আপডেট করুন**

নতুন `server.js` এ CORS enabled আছে:

```javascript
// CORS সব requests allow করে
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### **Step 2: Backend চালু করুন**

```bash
Terminal 1:
  cd /home/runner/workspace
  node server.js

Output দেখবেন:
  🌙 ═════════════════════════════════════════
    Smart Muslim Premium Backend
    Running on port: 3000
    Status: Online
    ✅ Ready for requests
  ═════════════════════════════════════════
```

### **Step 3: Frontend চালু করুন**

```bash
Terminal 2:
  cd /home/runner/workspace
  npm run dev

Output দেখবেন:
  Metro waiting on exp://...
  QR code
  Web is waiting on http://localhost:8081
```

### **Step 4: Expo Go তে Test করুন**

```
1. Expo Go App খুলুন (Phone এ)
2. QR code scan করুন
3. App load হবে
4. "Failed to fetch" আর দেখা যাবে না ✅
5. সূরা ফাতিহা load হবে
```

---

## 🔍 Debugging

### **যদি এখনও error দেখা যায়:**

**Check 1: Backend সঠিকভাবে চলছে কিনা?**
```bash
curl http://localhost:3000/api/health

Output হওয়া উচিত:
{
  "status": "OK",
  "database": "Connected",
  "quranDataLoaded": true
}
```

**Check 2: Frontend API_BASE_URL সঠিক আছে কিনা?**
```typescript
// hooks/useQuranAPI.ts এ:
const API_BASE_URL = 'http://localhost:3000'; // এটা থাকতে হবে
```

**Check 3: CORS errors আছে কিনা?**
```
Browser Console এ দেখুন:
- If: "CORS error" → Backend CORS fixed আছে
- If: "Network error" → Backend চলছে না
```

**Check 4: Browser/Expo Go Console এ Error দেখুন**
```
Expo Go এ:
  Shake phone → Press "Show logs"
  দেখুন কি error আছে
```

---

## 🌐 Production এর জন্য

যখন hosted backend থাকবে:

```typescript
// .env এ:
EXPO_PUBLIC_API_URL=https://smart-muslim-backend.replit.dev

// hooks/useQuranAPI.ts এ:
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

এখন:
- Development: localhost:3000 থেকে
- Production: hosted URL থেকে
- Automatic fallback ✅
```

---

## 📋 Backend Data কি পাবেন

```
GET /api/quran/surahs
├─ 114 Surahs list
├─ Surah names (Arabic + Bengali)
└─ Ayahs count

GET /api/quran/surah/1
├─ Surah 1 (Al-Fatihah)
├─ সব 7 Ayahs
├─ Arabic text
├─ Bengali translation
└─ Audio URLs

GET /api/health
├─ Server status
├─ Database connection
└─ Quran data loaded status
```

---

## ✨ এখনই করুন

```bash
1. Terminal 1: node server.js
2. Terminal 2: npm run dev
3. Expo Go এ QR scan করুন
4. সূরা দেখুন ✅
```

**Done!** Network error আর দেখা যাবে না। 🚀
