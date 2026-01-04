import { Slot, useRouter, useSegments } from "expo-router";
import { AuthProvider, useSession } from "../ctx/AuthContext";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AnimatedSplash from "../components/AnimatedSplash"; // Import komponen baru

function RootLayoutNav() {
  const { session, isLoading } = useSession();
  // Trik: Kita paksa tipe datanya jadi 'any' dulu biar TypeScript diam
  const segments = useSegments() as any; 
  const router = useRouter();

  // State untuk melacak apakah animasi splash sudah selesai
  const [isSplashAnimationFinished, setSplashAnimationFinished] = useState(false);

  useEffect(() => {
    // JANGAN lakukan navigasi kalau loading auth belum beres ATAU animasi belum beres
    if (isLoading || !isSplashAnimationFinished) return;

    // Sekarang aman cek length karena tipenya 'any'
    const inProtectedGroup = segments[0] === '(tabs)' || segments[0] === 'quiz';
    const inPublicGroup = segments.length === 0 || segments[0] === 'login'; 

    if (session && inPublicGroup) {
      router.replace('/(tabs)/dashboard');
    } else if (!session && inProtectedGroup) {
      router.replace('/');
    }
  }, [session, isLoading, segments]);

  // Tampilkan Splash Screen jika Auth masih loading ATAU Animasi belum selesai
  if (isLoading || !isSplashAnimationFinished) {
    return (
      <AnimatedSplash 
        onFinish={() => setSplashAnimationFinished(true)} 
      />
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}