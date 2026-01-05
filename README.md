# 🧠 LogicLab Mobile

**LogicLab Mobile** is an interactive learning application designed specifically for **ITB (Institut Teknologi Bandung)** students. It helps students master Computational Thinking, Algorithms, and Data Structures through a series of gamified challenges and quizzes.

The app features secure authentication (restricted to ITB student emails), real-time progress tracking, and a comprehensive dashboard to monitor learning milestones.

---

## ✨ Features

### 1. 🔐 Secure Authentication
*   **Institutional Login**: Secure login using Google Sign-In, designed for `@std.stei.itb.ac.id` domains.
*   **Session Persistence**: Users remain logged in across app restarts using `AsyncStorage`.
*   **Auto-Refresh**: Supabase tokens are automatically refreshed in the background.

### 2. 📚 Interactive Challenges
*   **Gamified Quizzes**: Multiple-choice questions covering Fundamentals, Recursion, and Data Structures.
*   **Immediate Feedback**: Instant validation of answers with detailed explanations.
*   **Review Mode**: After completing a challenge, users can review their answers to understand mistakes.

### 3. 📊 Student Dashboard
*   **Progress Tracking**: Visual stats showing Total Score, Challenges Completed, and Average Score.
*   **Difficulty Breakdown**: Statistics separated by Easy, Medium, and Hard difficulty levels.

### 4. 🎨 Modern UI/UX
*   **Animated Splash Screen**: Custom entry animation using `react-native-reanimated`.
*   **Responsive Design**: Optimized for various screen sizes.
*   **Haptic Feedback**: Tactile responses for interactions.
*   **Offline Handling**: Graceful error handling when network connection is lost.

---

## 🛠 Tech Stack

*   **Framework**: [React Native](https://reactnative.dev/) (0.81.5) with [Expo](https://expo.dev/) (SDK 52)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
*   **Backend**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
*   **State Management**: React Context (AuthContext)
*   **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
*   **Storage**: `@react-native-async-storage/async-storage`
*   **Build Tool**: EAS (Expo Application Services)

---

## 📂 Project Structure

```
logiclab-mobile-testing/
├── app/                 # Expo Router pages
│   ├── (tabs)/          # Main tab navigation (Home, Challenges, Dashboard)
│   ├── quiz/            # Dynamic quiz routes ([id].tsx)
│   ├── _layout.tsx      # Root layout & Auth Guard
│   └── login.tsx        # Login screen
├── components/          # Reusable UI components (AnimatedSplash, etc.)
├── ctx/                 # React Contexts (AuthContext.tsx)
├── data/                # Static data (challenges.ts, faculties.ts)
├── lib/                 # Configuration (supabase.ts, theme.ts)
└── assets/              # Images and fonts
```

---

## ☁️ Backend & Security (Supabase)

We use **Supabase** as a Backend-as-a-Service (BaaS). It provides the PostgreSQL database and Authentication services.

### Database Schema

The core of our progress tracking is the `user_progress` table.

```sql
-- 1. Table for storing user progress
create table public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  challenge_id text not null, -- ID from JSON challenge (e.g., '1', '2')
  score int not null default 0,
  total_points int not null default 0,
  completed_at timestamp with time zone default timezone('utc'::text, now()),
  
  -- Ensure one record per challenge per user
  unique(user_id, challenge_id)
);

-- 2. Enable RLS (Row Level Security)
alter table public.user_progress enable row level security;

-- 3. Policies
-- User can ONLY view their own data
create policy "User can view own progress" on public.user_progress
  for select using (auth.uid() = user_id);

-- User can ONLY insert their own data
create policy "User can insert own progress" on public.user_progress
  for insert with check (auth.uid() = user_id);

-- User can ONLY update their own data
create policy "User can update own progress" on public.user_progress
  for update using (auth.uid() = user_id);
```

### 🔐 Why is the API Key in the code?

You might notice the `supabaseAnonKey` is hardcoded in `lib/supabase.ts`. **This is intentional and safe.**

*   **Row Level Security (RLS)**: The `anon` key is a public key. It allows connection to the database, but it **does not** grant permission to read or write data.
*   **Policy Enforcement**: Access is controlled entirely by the Postgres RLS policies shown above. Even with the key, a user cannot read another user's data because the database checks `auth.uid() = user_id` for every request.
*   **Environment Variables**: While we could use `.env`, in a mobile app, these keys are eventually bundled into the binary anyway. Relying on RLS is the correct security model for Supabase client-side apps.

---

## 🔑 Authentication & Google Cloud Setup

The app uses **Google OAuth** via `@react-native-google-signin/google-signin`. This requires careful configuration across Google Cloud Console and Supabase.

### The 3 Client IDs
To support all platforms, we need three distinct Client IDs in Google Cloud Console:

1.  **Web Client ID**:
    *   Used by Supabase to verify the ID token sent from the app.
    *   Added to Supabase Dashboard > Authentication > Providers > Google.
2.  **Android Client ID**:
    *   Used by the Android app to request consent from the user.
    *   Requires the **SHA-1 Fingerprint** of the keystore used to sign the app (Development or Production keystore).
3.  **iOS Client ID**:
    *   Used by the iOS app.
    *   Requires the Bundle ID (e.g., `com.logiclab.mobile`).

### Auth Flow
1.  User clicks "Sign in with Google".
2.  Native Google SDK opens the consent screen.
3.  Google returns an `idToken`.
4.  App sends this `idToken` to Supabase (`supabase.auth.signInWithIdToken`).
5.  Supabase verifies the token with Google (using the Web Client ID) and creates a session.

---

## 🏗️ Build & Development (EAS)

We use **EAS Build** because our app includes native code (Google Sign-In) that cannot run in the standard "Expo Go" app from the App Store.

### Development Build
A "Development Build" is a custom version of the Expo Go app that includes our specific native libraries.

1.  **Configure**: `eas.json` defines the build profile.
    ```json
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    }
    ```
2.  **Build**:
    ```bash
    eas build --profile development --platform android
    ```
3.  **Install**: Download the `.apk` to your device or emulator.
4.  **Run**: Start the metro bundler with `npx expo start --dev-client`.

### Production Build
For releasing to the Play Store or App Store.

1.  **Android (Play Store)**:
    ```bash
    eas build --profile production --platform android
    ```
    *Generates an `.aab` file to upload to the Google Play Console.*
2.  **iOS (App Store)**:
    ```bash
    eas build --profile production --platform ios
    ```
    *Generates an .ipa file to upload to App Store Connect (requires an Apple Developer Account).*

### Preview Build
For testing a production-like build (APK) without submitting to the store:
```bash
eas build --profile preview --platform android
```

### Keystore Management
*   **Development**: Uses a debug keystore. The SHA-1 of this keystore MUST be added to Google Cloud Console for Google Sign-In to work during development.
*   **Production**: Uses a secure production keystore managed by EAS. This SHA-1 must also be added to Google Cloud Console.

---

## 🚀 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [Git](https://git-scm.com/)
*   **Expo Go** app on your physical device OR Android Studio/Xcode for emulators.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-repo/logiclab-mobile.git
    cd logiclab-mobile
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the project**
    *   If you have the Development Build installed:
        ```bash
        npx expo start --dev-client
        ```
    *   Press `a` to open on Android.

---

## 🧪 Testing

This project uses Jest and React Native Testing Library for unit and integration testing.

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Writing Tests

- Tests are located in the `__tests__` directory
- See `__tests__/example.test.tsx` for examples
- Mock Supabase and Expo modules as shown in `jest.setup.js`

---

## 📱 Splash Screen Implementation

We use a custom `AnimatedSplash` component instead of the static Expo splash screen for a richer experience.

*   **Logic**: Located in `app/_layout.tsx`.
*   **Behavior**: The app checks if `session` is loading. While loading, it shows `AnimatedSplash`.
*   **Animation**: Uses `react-native-reanimated` to fade in the logo, scale it up, and then fade out before revealing the app content.

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details on:
- Setting up your development environment
- Code style and conventions
- Testing requirements
- Pull request process

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/)
- Backend powered by [Supabase](https://supabase.com/)
- Designed for ITB students
