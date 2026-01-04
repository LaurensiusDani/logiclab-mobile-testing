# Contributing to LogicLab Mobile Testing

Thank you for your interest in contributing to LogicLab Mobile Testing! This document provides guidelines and instructions for contributing to the project.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- iOS Simulator (macOS only) or Android Emulator

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

3. **Set up environment variables**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in your Supabase credentials in `.env`:
     ```
     EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - Get these values from your [Supabase Dashboard](https://app.supabase.com) → Project Settings → API

4. **Start the development server**
   ```bash
   npm start
   ```

## Development Workflow

### Running the App

- **iOS Simulator**: Press `i` in the Expo CLI or run `npm run ios`
- **Android Emulator**: Press `a` in the Expo CLI or run `npm run android`
- **Web**: Press `w` in the Expo CLI or run `npm run web`

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

- Place test files in the `__tests__` directory or alongside your components with `.test.tsx` extension
- Follow the existing test patterns (see `__tests__/example.test.tsx`)
- Aim for meaningful test coverage, not just high percentages
- Mock external dependencies appropriately

### Code Style

- We use ESLint with `eslint-config-expo` for code quality
- Run linting with: `npm run lint`
- TypeScript strict mode is enabled - ensure your code is properly typed
- Follow React Native and Expo best practices

### Building

#### Development Builds

```bash
# iOS development build
eas build --profile development --platform ios

# Android development build
eas build --profile development --platform android
```

#### Preview Builds

```bash
# iOS preview build
eas build --profile preview --platform ios

# Android preview build (APK)
eas build --profile preview --platform android
```

#### Production Builds

```bash
# iOS production build
eas build --profile production --platform ios

# Android production build (AAB for Play Store)
eas build --profile production --platform android
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   ```

4. **Commit your changes**
   - Use clear, descriptive commit messages
   - Follow conventional commits format:
     ```
     feat: add new feature
     fix: resolve bug in component
     docs: update README
     test: add tests for feature
     chore: update dependencies
     ```

5. **Push to your fork and submit a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Pull Request Guidelines**
   - Provide a clear description of the changes
   - Reference any related issues
   - Ensure all tests pass
   - Update documentation if needed
   - Request review from maintainers

## Project Structure

```
logiclab-mobile-testing/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Home screen
├── components/            # Reusable React components
├── ctx/                   # React contexts
├── data/                  # Static data and constants
├── lib/                   # Utilities and configurations
│   └── supabase.ts       # Supabase client setup
├── __tests__/            # Test files
├── assets/               # Images, fonts, and other static assets
├── .env                  # Environment variables (not committed)
├── .env.example          # Environment variables template
├── app.json              # Expo configuration
├── eas.json              # EAS Build configuration
└── package.json          # Dependencies and scripts
```

## Environment Variables

Required environment variables:

- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

**Important**: Never commit `.env` files to version control. Always use `.env.example` as a template.

## Need Help?

- Check existing issues and pull requests
- Review the [Expo documentation](https://docs.expo.dev/)
- Review the [Supabase documentation](https://supabase.com/docs)
- Ask questions in discussions or create a new issue

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

Thank you for contributing! 🎉
