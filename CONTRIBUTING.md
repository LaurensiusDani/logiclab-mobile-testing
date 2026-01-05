# Contributing to LogicLab Mobile Testing

Thank you for your interest in contributing to LogicLab Mobile Testing! This document provides guidelines and instructions for contributing to the project.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- **Android Emulator** or **iOS Simulator** (Physical devices work too, but require installing the Development Build)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/logiclab-mobile-testing.git
   cd logiclab-mobile-testing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configuration (Optional)**
   The project is pre-configured with a development Supabase instance in `lib/supabase.ts`. You can start coding immediately!
   
   *If you wish to use your own Supabase backend:*
   - Create a project at [Supabase.com](https://supabase.com)
   - Update `lib/supabase.ts` with your `supabaseUrl` and `supabaseAnonKey`.

## Development Workflow

### ⚠️ Important: Development Build Required
This app uses **Native Google Sign-In**, which does not work in the standard "Expo Go" app available on the App Store. You must use a **Development Build**.

1. **Build the Development Client** (One time setup)
   ```bash
   # For Android Emulator/Device
   eas build --profile development --platform android
   
   # For iOS Simulator
   eas build --profile development --platform ios
   ```
   *Download and install the resulting app on your device/emulator.*

2. **Start the Development Server**
   ```bash
   npx expo start --dev-client
   ```
   *Do not use `npm start` or `npx expo start` as they default to Expo Go.*

### Testing

We use Jest and React Native Testing Library for testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

#### Writing Tests

- Place test files in the `__tests__` directory.
- Follow the existing test patterns (see `__tests__/example.test.tsx`).
- Mock external dependencies (like Supabase) appropriately.

### Code Style

- We use ESLint with `eslint-config-expo`.
- Run linting: `npm run lint`.
- **TypeScript**: Ensure strict typing is maintained. Avoid `any` whenever possible.

### Building for Production

When you are ready to release:

```bash
# Android (AAB for Play Store)
eas build --profile production --platform android

# iOS (IPA for App Store)
eas build --profile production --platform ios
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code.
   - Add tests for new functionality.
   - Update documentation if you change how things work.

3. **Verify**
   ```bash
   npm test
   npm run lint
   ```

4. **Commit**
   - Use [Conventional Commits](https://www.conventionalcommits.org/):
     ```
     feat: add review mode to quiz
     fix: resolve crash on offline mode
     docs: update contributing guidelines
     style: adjust padding on home screen
     ```

5. **Push and PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Project Structure

```
logiclab-mobile-testing/
├── app/                 # Expo Router pages
│   ├── (tabs)/          # Main tab navigation
│   ├── quiz/            # Quiz screens
│   ├── _layout.tsx      # Root layout & Auth Guard
│   └── login.tsx        # Login screen
├── components/          # Reusable UI components
├── ctx/                 # React Contexts (Auth)
├── data/                # Static data (Challenges, Faculties)
├── lib/                 # Configuration (Supabase, Theme)
├── __tests__/           # Unit & Integration tests
└── assets/              # Images and fonts
```

## Need Help?

- Review the [Expo documentation](https://docs.expo.dev/)
- Review the [Supabase documentation](https://supabase.com/docs)
- Check `README.md` for architecture details.

Thank you for contributing! 🎉
