import { View, Text, StyleSheet, ScrollView, FlatList, Pressable, Image } from "react-native";
import { Colors, Typography, Spacing, BorderRadius, Shadows } from "../../lib/theme";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from "@expo/vector-icons";

const INSTRUCTORS = [
  { id: '1', name: 'Dr. Rinaldi Munir', role: 'Algorithm Expert', icon: 'code-slash' },
  { id: '2', name: 'Dr. Inggriani Liem', role: 'Computational Thinking', icon: 'bulb' },
  { id: '3', name: 'Pak Dosen X', role: 'Data Structures', icon: 'git-network' },
];

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section with Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.heroTitle}>LogicLab Mobile</Text>
          <Text style={styles.heroSubtitle}>
            Master computational thinking anywhere, anytime.
          </Text>
        </Animated.View>
      </LinearGradient>

      {/* Description */}
      <Animated.View
        style={styles.section}
        entering={FadeInDown.duration(600).delay(200)}
      >
        <Text style={styles.sectionTitle}>About the App</Text>
        <Text style={styles.text}>
          LogicLab is designed specifically for ITB students to sharpen their algorithmic skills through interactive challenges.
        </Text>
      </Animated.View>

      {/* Instructors Horizontal Scroll */}
      <Animated.View
        style={styles.section}
        entering={FadeInDown.duration(600).delay(400)}
      >
        <Text style={styles.sectionTitle}>Our Instructors</Text>
        <FlatList
          horizontal
          data={INSTRUCTORS}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.instructorCard,
                pressed && { transform: [{ scale: 0.95 }] }
              ]}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.avatarGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name={item.icon as any} size={28} color={Colors.white} />
              </LinearGradient>
              <Text style={styles.instructorName}>{item.name}</Text>
              <Text style={styles.instructorRole}>{item.role}</Text>
            </Pressable>
          )}
        />
      </Animated.View>

      {/* Contact Us */}
      <Animated.View
        style={[styles.section, { marginBottom: 40 }]}
        entering={FadeInDown.duration(600).delay(600)}
      >
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.contactCard}>
          <View style={styles.contactRow}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <Text style={styles.contactText}>Lab Dasar Pemrograman, Labtek V, ITB</Text>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="mail" size={20} color={Colors.primary} />
            <Text style={styles.contactText}>itbvirtuallabofficial@gmail.com</Text>
          </View>
        </View>
        <Image
          source={require('../../assets/images/Plaza_Widya_Nusantara.jpg')}
          style={styles.campusImage}
          resizeMode="cover"
        />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  hero: {
    padding: Spacing['2xl'],
    paddingTop: Spacing['5xl'] + 20,
    paddingBottom: Spacing['4xl'],
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: Typography.fontSize['5xl'],
    fontWeight: Typography.fontWeight.extrabold,
    color: Colors.white,
    marginBottom: Spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroSubtitle: {
    fontSize: Typography.fontSize.lg,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.lg,
  },
  section: {
    padding: Spacing.xl
  },
  sectionTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.base,
    color: Colors.text,
  },
  text: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  instructorCard: {
    width: 160,
    padding: Spacing.lg,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.base,
    alignItems: 'center',
    ...Shadows.md,
  },
  avatarGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  instructorName: {
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: 4,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
  },
  instructorRole: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.tight * Typography.fontSize.xs,
  },
  contactCard: {
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  contactText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginLeft: Spacing.md,
    flex: 1,
  },
  campusImage: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
    ...Shadows.sm,
  },
});
