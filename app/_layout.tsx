import { Slot, useRouter, useSegments } from "expo-router";
import { AuthProvider, useSession } from "../ctx/AuthContext";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, Platform } from "react-native"; // Added Platform
import AnimatedSplash from "../components/AnimatedSplash"; 

function RootLayoutNav() {
  const { session, isLoading } = useSession();
  const segments = useSegments() as any; 
  const router = useRouter();

  // FIX: Initialize state based on the current URL (Web only)
  // If we are on Web and the path is NOT '/', we skip the animation immediately.
  const [isSplashAnimationFinished, setSplashAnimationFinished] = useState(() => {
    if (Platform.OS === 'web') {
      // window.location.pathname gives us "/dashboard", "/home", etc.
      return window.location.pathname !== '/';
    }
    return false; // On mobile, always play splash on app launch
  });

  // Determine if we are in a protected route
  const inProtectedGroup = segments[0] === '(tabs)' || segments[0] === 'quiz';

  useEffect(() => {
    if (isLoading || !isSplashAnimationFinished) return;

    const inPublicGroup = segments.length === 0 || segments[0] === 'login'; 

    if (session && inPublicGroup) {
      router.replace('/(tabs)/dashboard');
    } else if (!session && inProtectedGroup) {
      router.replace('/');
    }
  }, [session, isLoading, segments, isSplashAnimationFinished]);

  // 1. Loading State Handling
  if (isLoading || !isSplashAnimationFinished) {
    
    // Case A: Animation is still running (or we are on the Index page)
    if (!isSplashAnimationFinished) {
      return (
        <AnimatedSplash 
          onFinish={() => setSplashAnimationFinished(true)} 
        />
      );
    }

    // Case B: Animation was skipped (e.g. refreshed /dashboard), but Auth is still loading.
    // Show a simple spinner instead of the full Splash animation.
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  // 2. SECURITY GUARD
  if (inProtectedGroup && !session) {
    return null; 
  }

  // 3. Render the page
  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}