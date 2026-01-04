import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  runOnJS,
  withSequence,
  withDelay
} from 'react-native-reanimated';

const ITB_LOGO_URI = "https://cdn.brandfetch.io/idatWEaF2M/w/820/h/820/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1760963863465";

type Props = {
  onFinish: () => void;
};

export default function AnimatedSplash({ onFinish }: Props) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    // 1. Sequence untuk Opacity: Masuk -> Tunggu -> Keluar -> Panggil onFinish
    opacity.value = withSequence(
      withTiming(1, { duration: 1000 }), // Fade In
      withDelay(
        1500, // Tunggu 1.5 detik (total tampil sekitar 2.5s)
        withTiming(0, { duration: 500 }, (finished) => { // Fade Out
          'worklet'; // Menandakan ini berjalan di UI thread
          if (finished) {
            runOnJS(onFinish)(); // Panggil fungsi JS
          }
        })
      )
    );

    // 2. Sequence untuk Scale: Masuk (Spring) -> Tunggu -> Zoom Out
    scale.value = withSequence(
      withSpring(1),
      withDelay(1500, withTiming(1.5, { duration: 500 }))
    );
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={{ uri: ITB_LOGO_URI }}
        style={[styles.logo, animatedStyle]}
        resizeMode="contain"
      />
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Background putih bersih
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.6, // Lebar logo 60% dari lebar layar
    height: width * 0.6,
  },
});