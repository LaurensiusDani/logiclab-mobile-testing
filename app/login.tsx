import { Alert, View, Text, StyleSheet } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { supabase } from '../lib/supabase';
import { Colors, Typography, Spacing, BorderRadius } from '../lib/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

GoogleSignin.configure({
  "webClientId": "424039843806-qo0tn5t4hqqktlsr3tucq34jo9a0rghs.apps.googleusercontent.com",
  "iosClientId": "424039843806-71gaim4tsm3g7pf93jmjahsb2rjai2q9.apps.googleusercontent.com"
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
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View
        entering={FadeInUp.duration(800).delay(200)}
        style={styles.logoContainer}
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>LL</Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(800).delay(400)}
        style={styles.contentContainer}
      >
        <Text style={styles.title}>Welcome to LogicLab</Text>
        <Text style={styles.subtitle}>
          Master computational thinking with interactive challenges
        </Text>

        <View style={styles.buttonContainer}>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={handleGoogleSignIn}
            style={styles.googleButton}
          />
          <Text style={styles.helperText}>
            Sign in with your ITB student email
          </Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl
  },
  logoContainer: {
    marginBottom: Spacing['4xl'],
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: Typography.fontSize['6xl'],
    fontWeight: Typography.fontWeight.extrabold,
    color: Colors.white,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: Typography.fontSize['4xl'],
    marginBottom: Spacing.md,
    fontWeight: Typography.fontWeight.extrabold,
    color: Colors.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: Spacing['4xl'],
    paddingHorizontal: Spacing.xl,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  googleButton: {
    width: 250,
    height: 52,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  helperText: {
    marginTop: Spacing.base,
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});
