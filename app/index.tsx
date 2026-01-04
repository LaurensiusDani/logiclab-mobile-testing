import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function LandingPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.hero}>Welcome to LogicLab</Text>
      <Text style={styles.subtitle}>Master Computational Thinking with ease.</Text>
      
      <View style={{ marginTop: 20 }}>
        <Button 
          title="Get Started" 
          onPress={() => router.push('/login')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  hero: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'gray', textAlign: 'center' }
});