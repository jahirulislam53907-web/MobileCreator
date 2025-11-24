# Islamic Super App - Design Guidelines

## Platform & Language
- **Primary Platform**: iOS (with Android considerations)
- **Primary Language**: Bengali (বাংলা)
- **Secondary Language**: English support in settings

## Authentication Architecture
**Authentication Required** - The app includes:
- User profiles for tracking ibadah (worship) progress
- Data sync across devices
- Future community features

**Implementation**:
- Apple Sign-In (iOS requirement)
- Google Sign-In (cross-platform)
- Email/password as fallback
- Privacy policy and terms in Bengali
- Account management: Profile > Settings > Account > Delete Account (double confirmation)

## Navigation Structure
**Root Navigation**: Tab Bar (5 tabs)

1. **হোম (Home)** - Dashboard with prayer times, countdown, daily verse
2. **নামাজ (Prayer)** - Prayer tracking, Qibla compass, prayer learning
3. **কুরআন (Quran)** - Center tab with prominent icon
4. **দুয়া (Dua)** - Daily duas and dhikr collection
5. **আরও (More)** - Calendar, Zakat calculator, Ramadan tracker, settings

## Screen Specifications

### 1. Home Dashboard
- **Header**: Transparent with location selector (left) and notification bell (right)
- **Layout**: Scrollable vertical stack
- **Safe Area**: Top: headerHeight + Spacing.xl, Bottom: tabBarHeight + Spacing.xl
- **Components**:
  - Current location display with edit button
  - Dual date card (Hijri + Gregorian)
  - Large countdown timer to next prayer (prominent card)
  - Daily Quranic verse card with Bengali translation
  - Prayer times grid (5 prayers with checkmarks for completed)
  - Quick action shortcuts (6 icon buttons in 3x2 grid)
  - Ibadah progress chart (weekly view)

### 2. Prayer (নামাজ) Screen
- **Header**: Default with title, Qibla button (right)
- **Layout**: Scrollable with floating Qibla compass button
- **Safe Area**: Top: Spacing.xl, Bottom: tabBarHeight + Spacing.xl
- **Components**:
  - Today's prayer timetable (list with prayer status)
  - Qibla compass (modal screen when tapped)
  - Prayer tracking switches for each prayer
  - Reminder settings card
  - "Learn Prayer" section with step-by-step guides
  - Prayer niyyah (intentions) reference

### 3. Quran (কুরআন) Screen
- **Header**: Custom with search bar, bookmark icon (right)
- **Layout**: List view (Surah list or Para list toggle)
- **Safe Area**: Top: headerHeight + Spacing.xl, Bottom: tabBarHeight + Spacing.xl
- **Components**:
  - Segmented control (Surah / Para / Bookmarks)
  - Last read position card (resume reading)
  - List items with Surah name (Arabic + Bengali), revelation location, verse count
  - Reader screen: Full-screen scrollable with Arabic text, Bengali translation, audio player controls

### 4. Dua (দুয়া) Screen
- **Header**: Default with search icon (right)
- **Layout**: Categorized list
- **Safe Area**: Top: Spacing.xl, Bottom: tabBarHeight + Spacing.xl
- **Components**:
  - Category cards (Morning/Evening, After Prayer, Before Eating, etc.)
  - Dua detail screen: Arabic text (larger font), Bengali transliteration, Bengali meaning, share button
  - Favorites section at top

### 5. More (আরও) Screen
- **Header**: Default with profile avatar (right)
- **Layout**: Scrollable grouped list
- **Safe Area**: Top: Spacing.xl, Bottom: tabBarHeight + Spacing.xl
- **Components**:
  - Islamic Calendar tile
  - Zakat Calculator tile
  - Ramadan Tracker tile
  - Settings tile
  - Profile tile
  - About & Help tiles

### Modal Screens
- **Qibla Compass**: Full-screen modal with compass visualization, location display, distance to Kaaba
- **Zakat Calculator**: Form with numeric inputs, calculate button in header
- **Settings**: Grouped list with theme, language, notification preferences, data backup

## Design System

### Color Palette
**Primary**: Islamic Green
- Primary: #2D6A4F (deep Islamic green)
- Primary Light: #52B788
- Primary Dark: #1B4332

**Secondary**: Golden/Amber
- Secondary: #D4A574 (golden)
- Secondary Light: #E9C992
- Secondary Dark: #B8860B

**Neutrals**:
- Background: #F8F9FA (light mode), #1A1A1A (dark mode)
- Surface: #FFFFFF (light), #2A2A2A (dark)
- Text Primary: #212529 (light), #F8F9FA (dark)
- Text Secondary: #6C757D (light), #ADB5BD (dark)

**Semantic**:
- Success: #40916C (prayer completed)
- Warning: #F4A261 (prayer time approaching)
- Error: #E76F51

### Typography
**Bengali Font**: Noto Sans Bengali (system font support)
**Arabic Font**: Traditional Arabic or Scheherazade New (for Quranic text)

**Scale**:
- Display: 32px, Bold (Countdown timer)
- H1: 24px, SemiBold (Screen titles)
- H2: 20px, SemiBold (Card headers)
- H3: 18px, Medium (Section titles)
- Body: 16px, Regular (Main content)
- Body Small: 14px, Regular (Secondary info)
- Caption: 12px, Regular (Timestamps, metadata)
- Arabic Large: 28px (Quranic verses, Duas)

### Component Specifications

**Prayer Time Card**:
- Rounded corners: 12px
- Padding: 16px
- Background: Surface color with subtle gradient
- Border: 1px solid with 10% primary color opacity
- Active prayer: Primary color border, bold text

**Action Buttons**:
- Primary: Filled with primary color, white text, 12px radius
- Secondary: Outlined with primary color, primary text, 12px radius
- Icon buttons: 44x44 minimum touch target
- Visual feedback: 20% opacity overlay when pressed

**Floating Qibla Button** (if used):
- Position: Bottom right, 16px from edges
- Size: 56x56
- Background: Primary gradient
- Icon: White compass icon
- Shadow: width: 0, height: 2, opacity: 0.10, radius: 2

**Navigation Icons**:
- Use Feather icons from @expo/vector-icons
- Home: home
- Prayer: clock
- Quran: book-open
- Dua: book
- More: menu

### Visual Assets
**Critical Assets**:
1. **Qibla Compass**: Custom compass rose with Kaaba icon at north
2. **Islamic Patterns**: Subtle geometric patterns for card backgrounds (2-3 variations)
3. **Prayer Icons**: 5 unique icons representing each prayer time
4. **Profile Avatars**: 6 Islamic geometric pattern-based avatars (no human/animal forms)

**DO NOT use**:
- Emojis
- Human or animal imagery (Islamic guidelines)
- Overly decorative elements that distract from content

### Accessibility
- Minimum text size: 14px (adjustable in settings to 18px)
- High contrast mode for elderly users
- Bengali voice-over support for screen readers
- Large touch targets (minimum 44x44)
- Clear visual hierarchy with proper spacing
- Prayer time notifications with vibration patterns

### Interaction Design
- All touchable elements: 20% opacity feedback on press
- Smooth transitions between screens (300ms ease)
- Pull-to-refresh on main content screens
- Haptic feedback on prayer check completion
- Swipe gestures for Quran navigation (next/previous Surah)

### Offline Functionality
- Indicator in header when offline (small cloud icon)
- Prayer times calculated locally
- Quran fully cached after first download
- Duas available offline
- Calendar pre-loaded for current year