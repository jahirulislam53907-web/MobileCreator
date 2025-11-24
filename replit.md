# Islamic Super App (Smart Muslim)

## Project Overview
একটি সম্পূর্ণ Islamic mobile application যা React Native + Expo দিয়ে তৈরি। অ্যাপটিতে কুরআন, নামাজের সময়সূচী, দুয়া, ইসলামিক ক্যালেন্ডার, কিবলা কম্পাস এবং আরও অনেক ফিচার রয়েছে।

**Language**: Bengali (বাংলা)
**Platform**: iOS + Android (Expo)
**Database**: PostgreSQL (Neon)

---

## Theme System
অ্যাপে ৫টি আলাদা থিম রয়েছে, যা সবকিছুতে একই অনুভূতি দেয়। প্রতিটি থিমের Light এবং Dark mode আছে।

### Available Themes:

1. **Teal (প্রিমিয়াম টিল)** - DEFAULT
   - Primary: #1a5e63
   - Secondary: #2d936c
   - Accent: #f9a826
   - HTML design অনুসারে ডিজাইন করা

2. **Blue (মডার্ন ব্লু)**
   - Primary: #0066cc
   - Secondary: #0099ff
   - Accent: #ff6b35

3. **Purple (এলিগ্যান্ট পার্পল)**
   - Primary: #7c3aed
   - Secondary: #a78bfa
   - Accent: #f59e0b

4. **Green (ফ্রেশ গ্রীন)**
   - Primary: #059669
   - Secondary: #10b981
   - Accent: #f97316

5. **Orange (সানসেট অরেঞ্জ)**
   - Primary: #ea580c
   - Secondary: #fb923c
   - Accent: #06b6d4

### থিম ব্যবহার করা:
```tsx
import { useAppTheme } from '@/hooks/useAppTheme';

export default function MyComponent() {
  const { theme, themeName, setThemeName, isDark } = useAppTheme();
  // theme.primary, theme.secondary ইত্যাদি ব্যবহার করুন
}
```

---

## Recent Changes

### Session 1 (Current)
- ✅ Multi-theme system তৈরি করা হয়েছে (৫টি থিম)
- ✅ Constants/theme.ts আপডেট করা হয়েছে সব থিমের সাথে
- ✅ useAppTheme hook তৈরি করা হয়েছে theme switching-এর জন্য
- ✅ AsyncStorage দিয়ে selected theme save করা যায়
- ⏳ Settings screen এ theme selector যুক্ত করতে হবে

---

## Architecture

### Directory Structure
```
src/
├── screens/
│   ├── HomeScreen.tsx        # মূল হোম স্ক্রিন
│   ├── QuranScreen.tsx       # কুরআন
│   ├── PrayerScreen.tsx      # নামাজের সময়
│   ├── DuaScreen.tsx         # দুয়া ও যিকর
│   ├── MoreScreen.tsx        # আরও ফিচার
│   └── SettingsScreen.tsx    # সেটিংস
├── components/
│   ├── ThemedText.tsx        # থিম রঙ সহ টেক্সট
│   ├── Card.tsx              # কার্ড কম্পোনেন্ট
│   ├── ErrorBoundary.tsx     # এরর হ্যান্ডলিং
│   └── ...
├── navigation/
│   └── RootNavigator.tsx     # নেভিগেশন স্ট্রাকচার
├── hooks/
│   ├── useTheme.ts           # পুরনো থিম (light/dark শুধু)
│   ├── useAppTheme.ts        # নতুন থিম সিস্টেম
│   └── useColorScheme.ts     # সিস্টেম ডার্ক মোড
├── constants/
│   └── theme.ts              # থিম কনফিগ
├── utils/
│   └── prayerTimes.ts        # প্রার্থনার সময় হিসাব
└── server/
    └── server.js             # Node.js ব্যাকএন্ড (API)
```

---

## Key Features
- ✅ কুরআন পূর্ণ আয়াত সহ
- ✅ নামাজের সময়সূচী (স্বয়ংক্রিয় গণনা)
- ✅ দুয়া ও যিকর
- ✅ ইসলামিক ক্যালেন্ডার
- ✅ কিবলা কম্পাস
- ⏳ Zakat ক্যালকুলেটর (পরে)
- ⏳ রমজান ট্র্যাকার (পরে)

---

## Database Schema

### Tables:
1. **users** - ব্যবহারকারী তথ্য
2. **prayer_logs** - নামাজ ট্র্যাকিং
3. **bookmarks** - প্রিয় আয়াত এবং দুয়া

---

## User Preferences
- **প্রথম ডিজাইন পছন্দ**: HTML design অনুযায়ী Teal থিম (প্রাথমিক)
- **বাংলা ভাষা**: সম্পূর্ণ সাপোর্ট (সব টেক্সট বাংলা)
- **ডিজাইন পদ্ধতি**: সঠিক রং এবং লেআউট ব্যবহার করা আবশ্যক

---

## Next Steps
1. Settings screen এ থিম সিলেক্টর যুক্ত করা
2. HomeScreen পুনরায় কাজ করা (ThemedText ইস্যু সমাধান)
3. সব স্ক্রিনে সামঞ্জস্যপূর্ণ থিম প্রয়োগ করা
4. ব্যাকএন্ড API ইন্টিগ্রেশন সম্পূর্ণ করা
