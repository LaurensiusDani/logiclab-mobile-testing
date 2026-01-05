import { AppState, Platform } from 'react-native';
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Initialize Supabase
const supabaseUrl = "https://hwffsiodhfwsmuvorvaz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZmZzaW9kaGZ3c211dm9ydmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MjQ2NzYsImV4cCI6MjA4MzAwMDY3Nn0.nT0heKOs2eYQicFgYRGz3cA7QiV9asolD4Qz1bkrVps";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // MAGIC FIX: Kalau Web, biarkan undefined (Supabase otomatis pakai localStorage).
    // Kalau Native (Android/iOS), baru pakai AsyncStorage.
    storage: Platform.OS === 'web' ? undefined : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web', // Di Web kita butuh ini true biar redirect jalan
  },
});

// 2. App State Listener (Hanya jalan di Native)
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}