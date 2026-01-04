import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { challenges } from "../../data/challenges";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { useSession } from "../../ctx/AuthContext";

export default function ChallengesScreen() {
  const router = useRouter();
  const { user } = useSession();
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProgress = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_progress')
      .select('challenge_id')
      .eq('user_id', user.id);
    
    if (data) {
      setCompletedIds(data.map(item => item.challenge_id));
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProgress();
    setRefreshing(false);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#4CD964';
      case 'Medium': return '#FF9500';
      case 'Hard': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Challenges</Text>
      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => {
          const isCompleted = completedIds.includes(item.id);
          return (
            <TouchableOpacity 
              style={[styles.card, isCompleted && styles.cardCompleted]}
              onPress={() => router.push({ pathname: "/quiz/[id]", params: { id: item.id } })}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.category}>{item.category}</Text>
                <View style={{ flexDirection: 'row', gap: 5 }}>
                  {isCompleted && (
                    <View style={[styles.badge, { backgroundColor: '#007AFF' }]}>
                      <Text style={styles.badgeText}>Done</Text>
                    </View>
                  )}
                  <View style={[styles.badge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
                    <Text style={styles.badgeText}>{item.difficulty}</Text>
                  </View>
                </View>
              </View>
              
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
              
              <View style={styles.footer}>
                <View style={styles.meta}>
                  <Ionicons name="help-circle-outline" size={16} color="#666" />
                  <Text style={styles.metaText}>{item.questions.length} Questions</Text>
                </View>
                <View style={styles.meta}>
                  <Ionicons name="trophy-outline" size={16} color="#666" />
                  <Text style={styles.metaText}>{item.totalPoints} Pts</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20, paddingTop: 60 },
  header: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: 'transparent' },
  cardCompleted: { borderColor: '#007AFF', backgroundColor: '#F0F8FF' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  category: { fontSize: 12, color: '#007AFF', fontWeight: 'bold', textTransform: 'uppercase' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  description: { fontSize: 14, color: '#666', marginBottom: 16, lineHeight: 20 },
  footer: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12 },
  meta: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  metaText: { fontSize: 12, color: '#666', marginLeft: 6 }
});