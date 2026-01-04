# 🧠 LogicLab Mobile

**LogicLab Mobile** is an interactive learning application designed specifically for **ITB (Institut Teknologi Bandung)** students. It helps students master Computational Thinking, Algorithms, and Data Structures through a series of gamified challenges and quizzes.

The app features secure authentication restricted to ITB student emails, real-time progress tracking, and a comprehensive dashboard to monitor learning milestones.

## ✨ Features

*   **🔐 Institutional Auth:** Secure login using Google Sign-In, restricted to `@std.stei.itb.ac.id` domains.
*   **📚 Interactive Challenges:** A curated list of quizzes covering Fundamentals, Algorithms, Recursion, Data Structures, and more.
*   **📊 Student Dashboard:** Real-time tracking of total scores, completed challenges, and average performance.
*   **⚡ Instant Feedback:** Immediate explanations for correct and incorrect answers during quizzes.
*   **🎨 Smooth UI/UX:** Animated splash screens, intuitive navigation, and responsive design.

## 🛠 Tech Stack

*   **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
*   **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL)
*   **Authentication:** Supabase Auth + Google Cloud OAuth
*   **Animations:** [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
*   **Icons:** Ionicons (@expo/vector-icons)

## 🚀 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [Git](https://git-scm.com/)
*   **Expo Go** app on your physical device OR Android Studio/Xcode for emulators.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/logiclab-mobile.git
    cd logiclab-mobile
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```
    *Note: This project uses native libraries like `@react-native-google-signin/google-signin`. You may need to use a Development Build instead of standard Expo Go.*

## ⚙️ Configuration

To make the app work, you need to set up your own backend services.

### 1. Supabase Setup

1.  Create a new project at [Supabase.com](https://supabase.com).
2.  Go to **SQL Editor** and run the following query to set up the progress tracking table:
    ```sql
    create table public.user_progress (
      id uuid default gen_random_uuid() primary key,
      user_id uuid references auth.users not null,
      challenge_id text not null,
      score int not null default 0,
      total_points int not null default 0,
      completed_at timestamp with time zone default timezone('utc'::text, now()),
      unique(user_id, challenge_id)
    );

    alter table public.user_progress enable row level security;

    create policy "User can view own progress" on public.user_progress for select using (auth.uid() = user_id);
    create policy "User can insert own progress" on public.user_progress for insert with check (auth.uid() = user_id);
    create policy "User can update own progress" on public.user_progress for update using (auth.uid() = user_id);
    ```
3.  Go to **Authentication > Providers > Google** and enable it. You will need Client IDs from step 2.

### 2. Google Cloud Console Setup

1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project and configure the **OAuth Consent Screen**.
3.  Create Credentials:
    *   **Web Client ID:** Used for Supabase.
    *   **Android Client ID:** Used for the mobile app.
    *   **iOS Client ID:** Used for the mobile app.
4.  Copy these Client IDs.

### 3. Update Code Configuration

**File: `lib/supabase.ts`**
Replace the URL and Key with your Supabase project details:
```typescript
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";
```

## 📱 Running the App
Since this app uses Native Google Sign-In, it is recommended to run it using a Development Build.

1. Build the Development Client (Android)

```bash
eas build --profile development --platform android
```

Install the resulting APK on your device.

2. Start the Development Server

```bash
npx expo start --dev-client
```

3. Scan the QR code with your device to connect.

## 📂 Project Structure

```bash
logiclab-mobile/
├── app/                    # Expo Router pages
│   ├── (tabs)/             # Main tab navigation (Home, Challenges, Dashboard)
│   ├── quiz/               # Quiz interface (Hidden from tabs)
│   ├── _layout.tsx         # Root layout & Auth Guard logic
│   ├── index.tsx           # Landing page
│   └── login.tsx           # Login page
├── components/             # Reusable UI components (AnimatedSplash, etc.)
├── data/                   # Static data (Challenges JSON)
├── ctx/                    # React Context (AuthContext)
├── lib/                    # Configuration (Supabase client)
└── assets/                 # Images and fonts
```

## 📄 License
Distributed under the MIT License.
