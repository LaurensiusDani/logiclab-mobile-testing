import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn, useAnimatedStyle, withRepeat, withTiming, useSharedValue, withSequence } from 'react-native-reanimated';
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";

const { width } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      false
    );
  }, []);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Animated Logo/Icon */}
      <Animated.View
        style={[styles.iconContainer, animatedIconStyle]}
        entering={FadeIn.duration(800)}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
          style={styles.iconGradient}
        >
          <Ionicons name="bulb" size={80} color="white" />
        </LinearGradient>
      </Animated.View>

      {/* Hero Text */}
      <Animated.View
        style={styles.textContainer}
        entering={FadeInDown.duration(800).delay(200)}
      >
        <Text style={styles.hero}>Welcome to LogicLab</Text>
        <Text style={styles.subtitle}>Master Computational Thinking with ease.</Text>
        <Text style={styles.description}>
          Your journey to algorithmic excellence starts here
        </Text>
      </Animated.View>

      {/* Decorative Elements */}
      <Animated.View
        style={[styles.decorCircle1]}
        entering={FadeIn.duration(1200).delay(600)}
      />
      <Animated.View
        style={[styles.decorCircle2]}
        entering={FadeIn.duration(1200).delay(800)}
      />

      {/* Get Started Button - Fixed at Bottom */}
      <Animated.View
        style={styles.buttonContainerBottom}
        entering={FadeInDown.duration(800).delay(400)}
      >
        <TouchableOpacity
          onPress={() => router.push('/login')}
          activeOpacity={0.8}
          style={styles.button}
        >
          <LinearGradient
            colors={['#ffffff', '#f0f0f0']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={24} color="#667eea" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 40,
  },
  iconGradient: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  hero: {
    fontSize: 48,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  buttonContainerBottom: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    width: undefined,
  },
  button: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#667eea',
    letterSpacing: 0.5,
    marginRight: 12,
  },
  decorCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});