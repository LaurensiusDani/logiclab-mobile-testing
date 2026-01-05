import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { useSession } from "../../ctx/AuthContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { challenges } from "../../data/challenges";
import { Colors, Typography, Spacing, BorderRadius, Shadows } from "../../lib/theme";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from "@expo/vector-icons";

export default function Dashboard() {
  const { user } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalScore: 0,
    maxPossibleScore: 0,
    completedCount: 0,
    totalChallenges: challenges.length,
    averageScore: 0,
  });
  const [completedList, setCompletedList] = useState<any[]>([]);

  const fetchProgress = async (isRefreshing = false) => {
    if (!isRefreshing) setLoading(true); // Only show full screen loader on first load
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('score, challenge_id')
        .eq('user_id', user?.id);

      if (error) throw error;

      let currentScore = 0;
      let completed = 0;
      const maxPoints = challenges.reduce((acc, curr) => acc + curr.totalPoints, 0);
      const doneList: any[] = [];

      if (data) {
        data.forEach(item => {
          currentScore += item.score;
          completed += 1;

          const challengeDetails = challenges.find(c => c.id === item.challenge_id);
          if (challengeDetails) {
            doneList.push({ ...challengeDetails, myScore: item.score });
          }
        });
      }

      setStats({
        totalScore: currentScore,
        maxPossibleScore: maxPoints,
        completedCount: completed,
        totalChallenges: challenges.length,
        averageScore: completed > 0 ? Math.round(currentScore / completed) : 0
      });

      setCompletedList(doneList);

    } catch (e: any) {
      console.error(e);

      // Check if it's a network error
      if (e.message && (e.message.includes('Network request failed') || e.message.includes('fetch failed'))) {
        // If refreshing, alert the user but keep old data
        if (isRefreshing) {
          Alert.alert("Offline", "Could not refresh data. Please check your internet connection.");
        } 
        // If it's the first load, you might want to show a specific offline UI state here
      } else {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProgress(true);
    setRefreshing(false);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const progressPercentage = stats.maxPossibleScore > 0
    ? (stats.totalScore / stats.maxPossibleScore) * 100
    : 0;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Animated.View entering={FadeInDown.duration(600)}>
        <Text style={styles.header}>Dashboard</Text>
        <Text style={styles.subHeader}>Welcome back, {user?.email?.split('@')[0]}</Text>
      </Animated.View>

      {/* Score Card with Gradient */}
      <Animated.View entering={FadeInDown.duration(600).delay(200)}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.gradientCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.gradientCardTitle}>Total Score</Text>
          <Text style={styles.gradientBigNumber}>
            {stats.totalScore} <Text style={styles.gradientSmallText}>of {stats.maxPossibleScore}</Text>
          </Text>
          <View style={styles.progressBarBg}>
            <Animated.View
              style={[styles.progressBarFill, { width: `${progressPercentage}%` }]}
            />
          </View>
        </LinearGradient>
      </Animated.View>

      <View style={styles.row}>
        {/* Completed Card */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(400)}
          style={styles.halfCard}
        >
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
            </View>
            <Text style={styles.cardTitle}>Completed</Text>
            <Text style={styles.mediumNumber}>{stats.completedCount} / {stats.totalChallenges}</Text>
            <Text style={styles.label}>Challenges</Text>
          </View>
        </Animated.View>

        {/* Average Card */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(500)}
          style={styles.halfCard}
        >
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Ionicons name="trophy" size={24} color={Colors.warning} />
            </View>
            <Text style={styles.cardTitle}>Avg. Score</Text>
            <Text style={styles.mediumNumber}>{stats.averageScore}</Text>
            <Text style={styles.label}>Points</Text>
          </View>
        </Animated.View>
      </View>

      {/* Recent Activity Section */}
      <Animated.View entering={FadeInDown.duration(600).delay(600)}>
        <Text style={[styles.subHeader, { marginTop: Spacing.lg, marginBottom: Spacing.md }]}>
          Completed Challenges
        </Text>
        {completedList.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={48} color={Colors.gray300} />
            <Text style={styles.emptyText}>No challenges completed yet.</Text>
            <Text style={styles.emptySubtext}>Start your journey now!</Text>
          </View>
        ) : (
          completedList.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.duration(400).delay(700 + index * 100)}
            >
              <View style={styles.historyItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyTitle}>{item.title}</Text>
                  <Text style={styles.historyDate}>{item.category}</Text>
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>{item.myScore} pts</Text>
                </View>
              </View>
            </Animated.View>
          ))
        )}
      </Animated.View>

      {/* Logout Button */}
      <Animated.View
        entering={FadeInDown.duration(600).delay(800)}
        style={styles.logoutContainer}
      >
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.white} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    paddingTop: Spacing['5xl'],
    backgroundColor: Colors.background,
    flexGrow: 1
  },
  header: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.extrabold,
    color: Colors.text
  },
  subHeader: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    marginTop: Spacing.xs,
  },
  gradientCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.base,
    ...Shadows.lg,
  },
  gradientCardTitle: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  gradientBigNumber: {
    fontSize: Typography.fontSize['5xl'],
    fontWeight: Typography.fontWeight.extrabold,
    color: Colors.white,
  },
  gradientSmallText: {
    fontSize: Typography.fontSize.lg,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: Typography.fontWeight.normal,
  },
  card: {
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  mediumNumber: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  label: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.base,
  },
  halfCard: {
    flex: 1,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.md,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
  },
  emptyState: {
    backgroundColor: Colors.card,
    padding: Spacing['3xl'],
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.sm,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    fontWeight: Typography.fontWeight.medium,
  },
  emptySubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.base,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  historyTitle: {
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    fontSize: Typography.fontSize.base,
  },
  historyDate: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.xs,
    marginTop: 2,
  },
  scoreBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  scoreText: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.sm,
  },
  logoutContainer: {
    marginTop: Spacing['2xl'],
    marginBottom: Spacing.lg,
  },
  logoutButton: {
    backgroundColor: Colors.danger,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...Shadows.md,
  },
  logoutText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
});
