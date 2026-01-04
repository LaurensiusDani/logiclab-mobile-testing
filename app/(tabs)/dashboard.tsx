import { View, Text, StyleSheet, ScrollView, RefreshControl, Button } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { useSession } from "../../ctx/AuthContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { challenges } from "../../data/challenges"; // Pastikan file ini sudah dibuat ya!

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

  const fetchProgress = async () => {
    setLoading(true);
    try {
      // Ambil data progress user dari Supabase
      const { data, error } = await supabase
        .from('user_progress')
        .select('score, challenge_id')
        .eq('user_id', user?.id);

      if (error) throw error;

      // Hitung Statistik
      let currentScore = 0;
      let completed = 0;
      
      // Hitung total poin yang MUNGKIN didapat dari semua soal yang ada di JSON
      const maxPoints = challenges.reduce((acc, curr) => acc + curr.totalPoints, 0);

      // Map completed IDs to actual challenge objects for display
      const doneList: any[] = [];

      if (data) {
        data.forEach(item => {
          currentScore += item.score;
          completed += 1;
          
          // Find the challenge details
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

      setCompletedList(doneList); // Save list for display

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Panggil saat pertama kali load
  useEffect(() => {
    fetchProgress();
  }, []);

  // Fitur Pull-to-Refresh
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProgress();
    setRefreshing(false);
  }, []);

  // Fungsi Logout
  const handleLogout = async () => {
    try {
      // 1. Sign out from Supabase
      await supabase.auth.signOut();
      // 2. Sign out from Google (agar user bisa pilih akun lain nanti)
      await GoogleSignin.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>Dashboard</Text>
      <Text style={styles.subHeader}>Welcome back, {user?.email?.split('@')[0]}</Text>

      {/* Score Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Score</Text>
        <Text style={styles.bigNumber}>
          {stats.totalScore} <Text style={styles.smallText}>of {stats.maxPossibleScore}</Text>
        </Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${stats.maxPossibleScore > 0 ? (stats.totalScore / stats.maxPossibleScore) * 100 : 0}%` }]} />
        </View>
      </View>

      <View style={styles.row}>
        {/* Completed Card */}
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardTitle}>Completed</Text>
          <Text style={styles.mediumNumber}>{stats.completedCount} / {stats.totalChallenges}</Text>
          <Text style={styles.label}>Challenges</Text>
        </View>

        {/* Average Card */}
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardTitle}>Avg. Score</Text>
          <Text style={styles.mediumNumber}>{stats.averageScore}</Text>
          <Text style={styles.label}>Points</Text>
        </View>
      </View>

      {/* Recent Activity Section */}
      <Text style={[styles.subHeader, { marginTop: 20, marginBottom: 10 }]}>Completed Challenges</Text>
      {completedList.length === 0 ? (
        <Text style={{ color: '#999', fontStyle: 'italic' }}>No challenges completed yet.</Text>
      ) : (
        completedList.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <View>
              <Text style={styles.historyTitle}>{item.title}</Text>
              <Text style={styles.historyDate}>{item.category}</Text>
            </View>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>{item.myScore} pts</Text>
            </View>
          </View>
        ))
      )}

      {/* Logout Button Section */}
      <View style={styles.logoutContainer}>
        <Button title="Sign Out" onPress={handleLogout} color="#FF3B30" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60, backgroundColor: '#f5f5f5', flexGrow: 1 },
  header: { fontSize: 32, fontWeight: 'bold', color: '#333' },
  subHeader: { fontSize: 16, color: '#666', marginBottom: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 16, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  cardTitle: { fontSize: 14, color: '#888', fontWeight: '600', marginBottom: 5 },
  bigNumber: { fontSize: 36, fontWeight: 'bold', color: '#007AFF' },
  mediumNumber: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  smallText: { fontSize: 16, color: '#999', fontWeight: 'normal' },
  label: { fontSize: 12, color: '#999' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfCard: { width: '48%' },
  progressBarBg: { height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, marginTop: 10 },
  progressBarFill: { height: 8, backgroundColor: '#007AFF', borderRadius: 4 },
  logoutContainer: { marginTop: 30, marginBottom: 20 },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10 },
  historyTitle: { fontWeight: 'bold', color: '#333', fontSize: 14 },
  historyDate: { color: '#999', fontSize: 12 },
  scoreBadge: { backgroundColor: '#E6F4FE', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  scoreText: { color: '#007AFF', fontWeight: 'bold', fontSize: 12 },
});