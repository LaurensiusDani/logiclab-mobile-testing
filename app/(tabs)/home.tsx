import { View, Text, StyleSheet, ScrollView, FlatList, Pressable, Image } from "react-native";
import { Colors, Typography, Spacing, BorderRadius, Shadows } from "../../lib/theme";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from "@expo/vector-icons";
import { faculties } from "../../data/faculties"; 

// Helper to map Faculty to Ionicon
const getIconForFaculty = (shortName: string): keyof typeof Ionicons.glyphMap => {
  switch (shortName) {
    case 'STEI': return 'hardware-chip';
    case 'FTI': return 'settings';
    case 'SITH': return 'leaf';
    case 'FTMD': return 'airplane';
    case 'FTSL': return 'construct';
    case 'FTTM': return 'hammer';
    default: return 'school';
  }
};

// Flatten the data: Extract all lecturers from all faculties
const INSTRUCTORS = faculties.flatMap(faculty => 
  faculty.classes.map(cls => ({
    id: cls.id,
    name: cls.lecturer,
    role: cls.name, 
    faculty: faculty.shortName,
    icon: getIconForFaculty(faculty.shortName)
  }))
);

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
        <Image
          source={require('../../assets/images/Plaza_Widya_Nusantara.jpg')}
          style={styles.campusImage}
          resizeMode="cover"
        />
        <Text style={styles.text}>
          LogicLab is designed specifically for ITB students to sharpen their algorithmic skills through interactive challenges.
          {'\n'}{'\n'}
          This virtual lab is part of the TPB (Tahap Persiapan Bersama) ITB course, taken by all first-year students across faculties to build foundational computational thinking skills.
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
          contentContainerStyle={{ paddingRight: Spacing.xl, paddingBottom: Spacing.lg }}
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
                <Ionicons name={item.icon} size={28} color={Colors.white} />
              </LinearGradient>
              <Text style={styles.instructorName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.instructorRole} numberOfLines={2}>{item.role}</Text>
              <Text style={styles.facultyBadge}>{item.faculty}</Text>
            </Pressable>
          )}
        />
      </Animated.View>

      {/* Contact Us - NEW DESIGN */}
      <Animated.View
        style={[styles.section, { marginBottom: 40 }]}
        entering={FadeInDown.duration(600).delay(600)}
      >
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.contactDescription}>
          Have questions or need help? Reach out to us through the following channels.
        </Text>

        {/* Email Card */}
        <View style={styles.contactCardNew}>
          <View style={[styles.iconCircle, { backgroundColor: '#DBEAFE' }]}>
            <Ionicons name="mail-outline" size={24} color="#2563EB" />
          </View>
          <Text style={styles.cardTitle}>Email</Text>
          <Text style={styles.cardSubtitle}>For general inquiries</Text>
          <Text style={styles.cardLink}>itbvirtuallabofficial@gmail.com</Text>
        </View>

        {/* Location Card */}
        <View style={styles.contactCardNew}>
          <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
            <Ionicons name="location-outline" size={24} color="#16A34A" />
          </View>
          <Text style={styles.cardTitle}>Location</Text>
          <Text style={styles.cardSubtitle}>Visit us at</Text>
          <Text style={styles.cardContent}>
            Institut Teknologi Bandung{'\n'}
            Jl. Ganesha No. 10{'\n'}
            Bandung 40132, Indonesia
          </Text>
        </View>

        {/* Office Hours Card */}
        <View style={styles.contactCardNew}>
          <View style={[styles.iconCircle, { backgroundColor: '#F3E8FF' }]}>
            <Ionicons name="time-outline" size={24} color="#9333EA" />
          </View>
          <Text style={styles.cardTitle}>Office Hours</Text>
          <Text style={styles.cardSubtitle}>Available during</Text>
          <Text style={styles.cardContent}>
            Monday - Friday{'\n'}
            08:00 - 17:00 WIB{'\n'}
            (Closed on weekends)
          </Text>
        </View>
      </Animated.View>

      {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerHeader}>
            <Ionicons name="school-outline" size={28} color={Colors.white} />
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.footerTitle}>Logic Lab: Computational Thinking</Text>
              <Text style={styles.footerTitle}>ITB</Text>
            </View>
          </View>
            
          <Text style={styles.footerCopyright}>
            © 2025 Institut Teknologi Bandung. All rights reserved.
          </Text>
        </View>
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
    textAlign: 'center',
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
    padding: Spacing.xl,
    paddingRight: 0, 
  },
  sectionTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.base,
    color: Colors.text,
    paddingRight: Spacing.xl, 
  },
  text: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    paddingRight: Spacing.xl, 
  },
  instructorCard: {
    width: 160,
    padding: Spacing.lg,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.base,
    alignItems: 'center',
    ...Shadows.md,
    height: 200, 
    justifyContent: 'space-between'
  },
  avatarGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: Spacing.sm,
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
    marginBottom: Spacing.xs,
    flex: 1, 
  },
  facultyBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  
  // NEW CONTACT STYLES
  contactDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    paddingRight: Spacing.xl,
    lineHeight: 22,
  },
  contactCardNew: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginRight: Spacing.xl, // Add margin right to match section padding logic
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  cardLink: {
    fontSize: Typography.fontSize.base,
    color: '#2563EB',
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
  },
  cardContent: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  campusImage: {
    width: '92%', 
    height: 200,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  // Footer Styles
  footer: {
    backgroundColor: '#0F172A', // Dark Navy
    paddingVertical: Spacing['2xl'],
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  footerHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  footerTitle: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
  },
  footerCopyright: {
    color: '#94A3B8', // Slate 400 (Grayish)
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
  },
});