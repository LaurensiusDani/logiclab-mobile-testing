import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Initialize Supabase
const supabaseUrl = "https://hwffsiodhfwsmuvorvaz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZmZzaW9kaGZ3c211dm9ydmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MjQ2NzYsImV4cCI6MjA4MzAwMDY3Nn0.nT0heKOs2eYQicFgYRGz3cA7QiV9asolD4Qz1bkrVps";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // Switched to AsyncStorage to avoid 2048 byte limit
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// 2. App State Listener (Refreshes token when app comes to foreground)
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});