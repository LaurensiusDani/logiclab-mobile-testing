import { View, Text, StyleSheet, ScrollView, Image, FlatList } from "react-native";

const INSTRUCTORS = [
  { id: '1', name: 'Dr. Rinaldi Munir', role: 'Algorithm Expert' },
  { id: '2', name: 'Dr. Inggriani Liem', role: 'Computational Thinking' },
  { id: '3', name: 'Pak Dosen X', role: 'Data Structures' },
];

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>LogicLab Mobile</Text>
        <Text style={styles.heroSubtitle}>
          Master computational thinking anywhere, anytime.
        </Text>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About the App</Text>
        <Text style={styles.text}>
          LogicLab is designed specifically for ITB students to sharpen their algorithmic skills through interactive challenges.
        </Text>
      </View>

      {/* Instructors Horizontal Scroll */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Instructors</Text>
        <FlatList
          horizontal
          data={INSTRUCTORS}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.instructorCard}>
              <View style={styles.avatarPlaceholder} />
              <Text style={styles.instructorName}>{item.name}</Text>
              <Text style={styles.instructorRole}>{item.role}</Text>
            </View>
          )}
        />
      </View>

      {/* Contact Us */}
      <View style={[styles.section, { marginBottom: 40 }]}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.text}>Lab Dasar Pemrograman, Labtek V, ITB.</Text>
        <Text style={styles.text}>Email: admin@logiclab.itb.ac.id</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  hero: { padding: 30, paddingTop: 80, backgroundColor: '#E6F4FE', alignItems: 'center' },
  heroTitle: { fontSize: 32, fontWeight: 'bold', color: '#007AFF', marginBottom: 10 },
  heroSubtitle: { fontSize: 16, color: '#555', textAlign: 'center' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, color: '#444', lineHeight: 24 },
  instructorCard: { width: 140, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10, marginRight: 15, alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ddd', marginBottom: 10 },
  instructorName: { fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  instructorRole: { fontSize: 12, color: '#666', textAlign: 'center' }
});