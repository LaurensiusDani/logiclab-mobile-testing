import { Alert, View, Text, StyleSheet } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { supabase } from '../lib/supabase';

GoogleSignin.configure({
  "webClientId":"424039843806-qo0tn5t4hqqktlsr3tucq34jo9a0rghs.apps.googleusercontent.com",
  "iosClientId":"424039843806-71gaim4tsm3g7pf93jmjahsb2rjai2q9.apps.googleusercontent.com"
});

export default function LoginScreen() {
  
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        // HERE IS THE MAGIC: Exchange Google Token for Supabase Session
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.data.idToken!, // The ID token from Google
        });

        if (error) {
          Alert.alert("Supabase Error", error.message);
        } else {
          // Success! The AuthContext in _layout.tsx will detect the session change
          // and automatically redirect the user to the Dashboard.
          console.log("Supabase Login Success:", data.session?.user.email);
        }
      }
    } catch (error: any) {
      // Cek kode error spesifik dari Google
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User membatalkan login (klik tombol back atau tutup popup)
        // Biasanya tidak perlu alert, atau cukup console.log saja
        console.log("Login dibatalkan user");
      } 
      else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Sabar ya", "Proses login sedang berjalan...");
      } 
      else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Error", "Google Play Services tidak tersedia atau perlu diupdate.");
      } 
      else {
        // Ini biasanya error kalau email tidak diizinkan (Restricted Domain)
        // atau konfigurasi SHA-1 salah.
        console.log("Google Error:", error); // Tetap log untuk debugging kita
        
        Alert.alert(
          "Gagal Masuk", 
          "Pastikan kamu menggunakan email mahasiswa ITB (@std.stei.itb.ac.id) dan koneksi internet lancar."
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in to LogicLab</Text>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogleSignIn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' }
});