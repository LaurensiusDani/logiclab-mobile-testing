# 📝 Development Changelog

## 🚀 New Features & Data Integration

### 1. Dynamic Instructor Data (`Home`)
*   **Data Structure:** Created a new data file `data/faculties.ts` to store hierarchical data (Faculties → Classes → Lecturers).
*   **Data Flattening:** Implemented logic in `app/(tabs)/home.tsx` to "flatten" this data, extracting all lecturers into a single list for the horizontal scroll view.
*   **Dynamic Icons:** Added a helper function to automatically assign specific Ionicons based on the Faculty name (e.g., 'STEI' → chip, 'SITH' → leaf).

### 2. Challenge Statistics (`Challenges`)
*   **Stats Header:** Added a new `ListHeaderComponent` to the Challenges screen.
*   **Logic:** Implemented real-time calculation of:
    *   Total Exercises
    *   Count of Easy, Medium, and Hard challenges.
*   **Visuals:** Created a 4-grid layout to display these stats with color-coded backgrounds and icons.

### 3. Offline/Network Error Handling
*   **Dashboard & Challenges:** Implemented robust `try/catch` blocks around Supabase data fetching.
*   **User Feedback:** Added logic to detect `Network request failed` errors. Instead of crashing or showing a red screen, the app now shows a friendly `Alert` to the user.
*   **State Preservation:** Ensured that if a refresh fails due to no internet, the app retains the previously loaded data instead of wiping the screen blank.

### 4. Global Footer
*   **Implementation:** Added a persistent, dark-themed footer at the bottom of the Home screen containing the "Virtual Lab" branding and copyright information.

---

## 🎨 UI/UX Improvements

### 1. Contact Us Redesign (`Home`)
*   **Card Layout:** Replaced the old list-style contact section with three distinct, styled cards (Email, Location, Office Hours).
*   **Color Coding:** Applied specific color themes (Blue, Green, Purple) to distinguish the contact channels.

### 2. Home Screen Polish
*   **Spacing:** Adjusted margins between the "About the App" title, the campus image, and the description text for better visual rhythm.
*   **Shadow Fix:** Added `paddingBottom` to the Instructors `FlatList` container to prevent the bottom shadow of the cards from being clipped by the scroll view.
*   **Footer Alignment:** Moved the Footer component *outside* the main section container to ensure it spans the full width of the screen (edge-to-edge) without being affected by side padding.

### 3. Quiz Screen Styling
*   **Style Merging:** Fixed how styles were applied to quiz options and navigation dots. Switched from conditional object replacement to **array-based style merging** (e.g., `[styles.base, styles.active]`) to ensure base dimensions (width/height) are never lost.

---

## 🐛 Bug Fixes & Technical Debt

### 1. Supabase Session Storage Warning
*   **Issue:** Android `SecureStore` has a 2KB limit, causing warnings and potential logout issues because the Supabase session object was too large.
*   **Fix:** Installed `@react-native-async-storage/async-storage` and updated `lib/supabase.ts` to use `AsyncStorage` for auth persistence instead.

### 2. TypeScript Errors (`Quiz`)
*   **Issue:** TypeScript complained that partial style objects (only containing colors) were missing mandatory properties (width, height) defined in the base type.
*   **Fix:** Resolved by using style arrays, allowing the base style to provide dimensions while the modifier style provides colors.
*   **Color Fix:** Replaced the non-existent `Colors.error` with `Colors.danger`.

### 3. Icon Name Error
*   **Issue:** `Ionicons` does not have an icon named `"brain"`.
*   **Fix:** Replaced it with `"bulb"` for the Medium difficulty stat card.

---

## 📂 Files Modified/Created

| File Path | Type | Description |
| :--- | :--- | :--- |
| `data/faculties.ts` | **New** | Contains the raw data for faculties and lecturers. |
| `app/(tabs)/home.tsx` | **Modified** | Added instructor fetching, redesigned Contact Us, added Footer, fixed layout/spacing. |
| `app/(tabs)/challenges.tsx` | **Modified** | Added Stats Header, fixed icon error, added offline error handling. |
| `app/(tabs)/dashboard.tsx` | **Modified** | Added offline error handling for user progress fetching. |
| `app/quiz/[id].tsx` | **Modified** | Fixed TypeScript styling errors and color references. |
| `lib/supabase.ts` | **Modified** | Switched auth storage to `AsyncStorage`. |
| `package.json` | **Modified** | Added `@react-native-async-storage/async-storage`. |
