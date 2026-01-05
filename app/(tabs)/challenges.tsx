import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from "react-native";
import { useRouter } from "expo-router";
import { challenges } from "../../data/challenges";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { useSession } from "../../ctx/AuthContext";
import { Colors, Typography, Spacing, BorderRadius, Shadows } from "../../lib/theme";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ChallengesScreen() {
  const router = useRouter();
  const { user } = useSession();
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Calculate Stats
  const totalChallenges = challenges.length;
  const easyCount = challenges.filter(c => c.difficulty === 'Easy').length;
  const mediumCount = challenges.filter(c => c.difficulty === 'Medium').length;
  const hardCount = challenges.filter(c => c.difficulty === 'Hard').length;

  const fetchProgress = async (isRefreshing = false) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('challenge_id')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data) {
        setCompletedIds(data.map(item => item.challenge_id));
      }
    } catch (e: any) {
      console.error("Fetch error:", e);
      
      // Check if it's a network error
      if (e.message && (e.message.includes('Network request failed') || e.message.includes('fetch failed'))) {
        // If refreshing, alert the user but keep old data
        if (isRefreshing) {
          Alert.alert("Offline", "Could not refresh progress. Please check your internet connection.");
        }
      } else {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProgress(true);
    setRefreshing(false);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return Colors.easy;
      case 'Medium': return Colors.medium;
      case 'Hard': return Colors.hard;
      default: return Colors.textTertiary;
    }
  };

  // Header Component containing Title + Stats Grid
  const renderHeader = () => (
    <Animated.View entering={FadeInDown.duration(600)}>
      <Text style={styles.header}>Challenges</Text>
      <Text style={styles.subHeader}>
        Test your knowledge with our curated collection of computational thinking problems.
      </Text>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {/* Total Card */}
        <View style={styles.statCard}>
          <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
            <Ionicons name="trophy" size={24} color="#0284C7" />
          </View>
          <View>
            <Text style={styles.statNumber}>{totalChallenges}</Text>
            <Text style={styles.statLabel}>Total Exercises</Text>
          </View>
        </View>

        {/* Easy Card */}
        <View style={styles.statCard}>
          <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
            <Ionicons name="radio-button-on" size={24} color={Colors.easy} />
          </View>
          <View>
            <Text style={styles.statNumber}>{easyCount}</Text>
            <Text style={styles.statLabel}>Easy</Text>
          </View>
        </View>

        {/* Medium Card */}
        <View style={styles.statCard}>
          <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="bulb" size={24} color="#D97706" />
          </View>
          <View>
            <Text style={styles.statNumber}>{mediumCount}</Text>
            <Text style={styles.statLabel}>Medium</Text>
          </View>
        </View>

        {/* Hard Card */}
        <View style={styles.statCard}>
          <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="code-slash" size={24} color={Colors.hard} />
          </View>
          <View>
            <Text style={styles.statNumber}>{hardCount}</Text>
            <Text style={styles.statLabel}>Hard</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>All Challenges</Text>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={challenges}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: Spacing.xl }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item, index }) => {
          const isCompleted = completedIds.includes(item.id);
          return (
            <Animated.View entering={FadeInDown.duration(400).delay(200 + index * 50)}>
              <TouchableOpacity
                style={styles.cardContainer}
                onPress={() => router.push({ pathname: "/quiz/[id]", params: { id: item.id } })}
                activeOpacity={0.7}
              >
                {isCompleted ? (
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={[styles.card, styles.cardCompleted]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.cardHeader}>
                      <Text style={[styles.category, { color: 'rgba(255, 255, 255, 0.9)' }]}>
                        {item.category}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
                        <View style={[styles.badge, { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}>
                          <Ionicons name="checkmark-circle" size={12} color={Colors.white} />
                          <Text style={[styles.badgeText, { marginLeft: 4 }]}>Done</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
                          <Text style={styles.badgeText}>{item.difficulty}</Text>
                        </View>
                      </View>
                    </View>

                    <Text style={[styles.title, { color: Colors.white }]}>{item.title}</Text>
                    <Text style={[styles.description, { color: 'rgba(255, 255, 255, 0.85)' }]} numberOfLines={2}>
                      {item.description}
                    </Text>

                    <View style={[styles.footer, { borderTopColor: 'rgba(255, 255, 255, 0.2)' }]}>
                      <View style={styles.meta}>
                        <Ionicons name="help-circle-outline" size={16} color="rgba(255, 255, 255, 0.9)" />
                        <Text style={[styles.metaText, { color: 'rgba(255, 255, 255, 0.9)' }]}>
                          {item.questions.length} Questions
                        </Text>
                      </View>
                      <View style={styles.meta}>
                        <Ionicons name="trophy-outline" size={16} color="rgba(255, 255, 255, 0.9)" />
                        <Text style={[styles.metaText, { color: 'rgba(255, 255, 255, 0.9)' }]}>
                          {item.totalPoints} Pts
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.category}>{item.category}</Text>
                      <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
                        <View style={[styles.badge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
                          <Text style={styles.badgeText}>{item.difficulty}</Text>
                        </View>
                      </View>
                    </View>

                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

                    <View style={styles.footer}>
                      <View style={styles.meta}>
                        <Ionicons name="help-circle-outline" size={16} color={Colors.textSecondary} />
                        <Text style={styles.metaText}>{item.questions.length} Questions</Text>
                      </View>
                      <View style={styles.meta}>
                        <Ionicons name="trophy-outline" size={16} color={Colors.textSecondary} />
                        <Text style={styles.metaText}>{item.totalPoints} Pts</Text>
                      </View>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['5xl'],
  },
  header: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.extrabold,
    marginBottom: Spacing.xs,
    color: Colors.text,
  },
  subHeader: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  
  // Stats Grid Styles
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    width: '47%', // Roughly half width minus gap
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },

  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },

  // Existing Card Styles
  cardContainer: {
    marginBottom: Spacing.base,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  cardCompleted: {
    borderWidth: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  category: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    lineHeight: Typography.lineHeight.tight * Typography.fontSize.lg,
  },
  description: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.base,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    paddingTop: Spacing.md,
    gap: Spacing.lg,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
});