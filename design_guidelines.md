# Smart Muslim - Premium Islamic Super App Design Guidelines

## Platform & Core Architecture

**Platform**: iOS primary (with Android Material Design variant)
**Languages**: Bengali primary, Arabic (Quranic text), 10 translation languages (English, Urdu, Hindi, Turkish, French, Malay, Indonesian, Spanish, German, Chinese)

### Authentication
**Required** - Multi-device sync, progress tracking, cloud bookmarks, audio downloads

**Implementation**:
- Apple Sign-In (iOS)
- Google Sign-In (cross-platform)
- Email/password fallback
- Privacy policy and terms in Bengali/English
- Account management: Profile > Settings > Account > Delete Account (double confirmation)
- Profile includes: customizable geometric pattern avatar (6 presets), display name, sync status

### Navigation Structure
**Tab Bar Navigation** (5 tabs, center focus on Quran)

1. **হোম (Home)** - Dashboard, prayer times, daily insights
2. **নামাজ (Prayer)** - Tracking, Qibla, learning resources
3. **কুরআন (Quran)** - Center tab, larger icon, primary feature
4. **দুয়া (Dua)** - Collections, favorites
5. **আরও (More)** - Tools, calendar, settings

**Stack-based modals**: Audio player, translation comparison, download manager, Qibla compass

## Premium Liquid Glass UI Philosophy

**Visual Language**: Translucent surfaces, depth through layering, subtle motion, purposeful spacing
- Frosted glass effects on floating elements
- Hierarchical blur intensity (light blur for backgrounds, no blur for primary content)
- Depth through shadow elevation, not heavy borders
- Color fills with 5-10% opacity for subtle backgrounds
- Premium spacing: minimum 24px between major sections, 16px within cards

**Animation Principles**:
- Spring physics for all transitions (damping: 0.8, stiffness: 100)
- Stagger animations for list items (50ms delay between items)
- Meaningful motion: elements slide from their logical origin
- Smooth opacity fades (300ms) paired with transforms
- Interactive feedback: scale (0.96) + opacity (0.7) on press

**Touch Feedback**: All interactive elements use subtle scale + opacity. Never use flat color overlays.

## Screen Specifications

### Home Dashboard
- **Header**: Transparent frosted glass with location (left), notifications (right)
- **Layout**: Scrollable vertical with card-based sections
- **Safe Area**: Top: headerHeight + 32px, Bottom: tabBarHeight + 32px
- **Components**:
  - Hero card: Next prayer countdown with circular progress ring, gradient background
  - Dual calendar card: Hijri/Gregorian dates with subtle separator
  - Daily verse card: Arabic + Bengali, frosted background, bookmark icon
  - Prayer grid: 5 prayers, checkmark animations when marked complete
  - Quick actions: 6 glass-morphism buttons in 3x2 grid
  - Progress insights: Weekly ibadah chart with smooth curve interpolation

### Prayer (নামাজ) Screen
- **Header**: Default with Qibla button (compass icon, right)
- **Layout**: Scrollable with floating Qibla button (bottom-right if needed)
- **Safe Area**: Top: 24px, Bottom: tabBarHeight + 24px
- **Components**:
  - Timeline view: Vertical prayer list with connection lines, current prayer highlighted
  - Toggle switches: Custom design with smooth animation, primary color fill
  - Reminder settings: Expandable card with notification preferences
  - Learning section: Expandable step-by-step prayer guide with illustrations

### Quran (কুরআন) Screen - Premium Feature
- **Header**: Custom translucent bar with search (frosted pill), bookmark/settings icons
- **Layout**: List view with segmented control (Surah/Juz/Bookmarks)
- **Safe Area**: Top: headerHeight + 24px, Bottom: tabBarHeight + 24px
- **Components**:
  - Resume reading card: Last position with progress percentage, smooth gradient
  - Surah/Juz list: Arabic name (right-aligned), Bengali (left), verse count, revelation badge
  - **Reader View** (dedicated screen):
    - Full-screen immersive mode, collapsible header
    - Arabic text: 28px, high contrast, ample line-height (1.8)
    - Per-Ayah touch targets for audio playback
    - Translation pills: Swipeable horizontal scroll, currently selected language highlighted
    - Floating audio player: Bottom sheet, translucent background
    - Audio controls: Play/pause (center), skip Ayah (sides), speed selector (0.5x-2x), progress scrubber
    - Bookmark integration: Long-press Ayah shows contextual menu
  - **Translation Comparison**: Modal sheet, split-view with 2-3 languages side-by-side, synchronized scrolling
  - **Download Manager**: Modal with language selection, storage indicators, pause/resume per language

### Dua (দুয়া) Screen
- **Header**: Default with search icon (right)
- **Layout**: Categorized vertical list
- **Safe Area**: Top: 24px, Bottom: tabBarHeight + 24px
- **Components**:
  - Category cards: Frosted background, rounded corners (16px), subtle shadow
  - Favorites section: Horizontal scroll at top
  - Detail view: Arabic (28px), transliteration (16px italic), Bengali meaning, audio playback, share

### More (আরও) Screen
- **Header**: Default with profile avatar (right, tappable)
- **Layout**: Grouped list with section headers
- **Safe Area**: Top: 24px, Bottom: tabBarHeight + 24px
- **Components**:
  - Tools section: Calendar, Zakat Calculator, Ramadan Tracker
  - Account section: Profile, Settings, Data Sync Status
  - Support section: Help, About, Rate App

### Modal Screens
- **Qibla Compass**: Full-screen, animated compass with smooth rotation, distance to Kaaba, accuracy indicator
- **Zakat Calculator**: Form-based with currency selector, real-time calculation, share results
- **Settings**: Language selector (10 languages), theme toggle (light/dark/auto), prayer calculation method (Karachi), notification preferences, storage management, app lock

## Design System

### Color Palette
**Light Mode**:
- Primary: #1B7F5C (Islamic green, vibrant)
- Secondary: #C9A961 (refined gold)
- Background: #F5F5F7 (iOS system gray 6)
- Surface: #FFFFFF with 60% opacity for frosted glass
- Text Primary: #1D1D1F
- Text Secondary: #6E6E73

**Dark Mode**:
- Primary: #34C779 (brighter green for OLED)
- Secondary: #D4A574
- Background: #000000
- Surface: #1C1C1E with 60% opacity for frosted glass
- Text Primary: #F5F5F7
- Text Secondary: #98989D

**Gradients**:
- Prayer gradient: Primary to Primary Light (120deg)
- Card overlays: Black with 5% opacity to transparent

### Typography
**System**: SF Pro (iOS), Roboto (Android)
**Arabic**: Traditional Arabic (system), fallback to Scheherazade New
**Bengali**: Noto Sans Bengali

**Scale** (iOS Dynamic Type support):
- Display: 36px, Bold (Countdown, hero text)
- H1: 28px, Semibold (Screen titles)
- H2: 22px, Semibold (Section headers)
- H3: 18px, Medium (Card titles)
- Body: 17px, Regular (Main content)
- Subheadline: 15px, Regular (Secondary info)
- Caption: 13px, Regular (Metadata)
- Arabic Display: 32px, Regular (Quran, Duas)

### Component Specifications

**Frosted Glass Cards**:
- Background: Surface color with 60% opacity + blur(20px)
- Border: 1px solid with 10% white (light mode) or 20% white (dark mode)
- Corner radius: 16px (standard), 24px (hero cards)
- Padding: 20px
- Shadow: elevation 2 (light: 0 2px 8px rgba(0,0,0,0.08), dark: 0 2px 12px rgba(0,0,0,0.4))

**Primary Button**:
- Background: Primary color
- Text: White, 17px Semibold
- Corner radius: 12px
- Padding: 16px vertical, 32px horizontal
- Minimum height: 50px
- Press state: scale(0.96) + opacity(0.9)

**Icon Buttons**:
- Size: 44x44 minimum
- Background: Glass effect or transparent
- Icon: 24x24 (Feather icons)
- Press: scale(0.9) + opacity(0.6)

**Floating Audio Player**:
- Position: Bottom sheet, above tab bar
- Background: Frosted glass with strong blur
- Height: 80px collapsed, 300px expanded
- Corner radius: 24px (top corners only)
- Shadow: width: 0, height: -2, opacity: 0.15, radius: 8
- Swipe down to dismiss

**Tab Bar Icons** (Feather):
- Home: home
- Prayer: clock
- Quran: book-open (larger, 28x28)
- Dua: heart
- More: grid

### Critical Assets
1. **Qibla Compass**: Circular rose with directional markers, Kaaba indicator, smooth rotation animation
2. **Islamic Patterns**: 3 geometric patterns for avatar backgrounds (no animate forms), subtle tile patterns for card decorations
3. **Prayer Icons**: 5 minimalist line icons for each prayer
4. **Download Indicators**: Progress rings with percentage, pause/download icons

### Accessibility
- Dynamic Type support (up to XXL)
- VoiceOver: Bengali and Arabic support
- High contrast mode (increase border opacity to 40%)
- Reduce motion: disable spring animations, use simple fades
- Minimum touch targets: 44x44
- Color is never the only differentiator

### Interaction Standards
- All gestures must have haptic feedback (light impact for selections, medium for completions)
- Pull-to-refresh on scrollable lists
- Long-press for contextual menus (bookmark Ayah, share Dua)
- Swipe navigation in Quran reader (previous/next Surah)
- Loading states: Shimmer effect on skeleton cards, never use spinners alone
- Empty states: Friendly illustration + helpful text + action button

### Offline Behavior
- Offline indicator: Small cloud icon with slash in header (when detected)
- Graceful degradation: Show cached content, disable streaming features
- Download manager: Clear storage usage, allow selective deletion
- Sync indicator: Animated icon when uploading/downloading data