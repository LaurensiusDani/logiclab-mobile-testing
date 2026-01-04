import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { challenges } from "../../data/challenges";
import { supabase } from "../../lib/supabase";
import { useSession } from "../../ctx/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useSession();

  const challenge = challenges.find(c => c.id === id);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // Store answers as a map: { questionId: optionId }
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  if (!challenge) {
    return <View style={styles.center}><Text>Challenge not found</Text></View>;
  }

  const currentQuestion = challenge.questions[currentQuestionIndex];
  const totalQuestions = challenge.questions.length;

  const handleOptionSelect = (optionId: string) => {
    if (quizCompleted) return;
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
  };

  const calculateScore = () => {
    let score = 0;
    challenge.questions.forEach(q => {
      const selectedOptionId = answers[q.id];
      const correctOption = q.options.find(o => o.isCorrect);
      if (selectedOptionId === correctOption?.id) {
        score += q.points;
      }
    });
    return score;
  };

  const submitQuiz = async () => {
    // Check if all questions are answered
    if (Object.keys(answers).length < totalQuestions) {
      Alert.alert("Incomplete", "Please answer all questions before submitting.");
      return;
    }

    setIsSubmitting(true);
    const score = calculateScore();
    setFinalScore(score);

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user?.id,
          challenge_id: challenge.id,
          score: score,
          total_points: challenge.totalPoints,
          completed_at: new Date().toISOString(),
        }, { onConflict: 'user_id, challenge_id' });

      if (error) throw error;
      setQuizCompleted(true);
      
    } catch (error) {
      console.error("Error saving progress:", error);
      Alert.alert("Error", "Failed to save your progress.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Result View
  if (quizCompleted) {
    return (
      <View style={styles.container}>
        <View style={styles.resultCard}>
          <Ionicons name="trophy" size={80} color="#FFD700" />
          <Text style={styles.resultTitle}>Quiz Completed!</Text>
          <Text style={styles.resultScore}>Your Score: {finalScore} / {challenge.totalPoints}</Text>
          
          <TouchableOpacity style={styles.button} onPress={() => router.replace('/(tabs)/dashboard')}>
            <Text style={styles.buttonText}>Go to Dashboard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: 'white', borderWidth: 1, borderColor: '#007AFF', marginTop: 10 }]} 
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, { color: '#007AFF' }]}>Back to Challenges</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Question Navigator (The dots) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navContainer}>
        {challenge.questions.map((q, index) => {
          const isAnswered = !!answers[q.id];
          const isCurrent = index === currentQuestionIndex;
          return (
            <TouchableOpacity 
              key={q.id}
              style={[
                styles.navDot, 
                isCurrent && styles.navDotCurrent,
                isAnswered && !isCurrent && styles.navDotAnswered
              ]}
              onPress={() => setCurrentQuestionIndex(index)}
            >
              <Text style={[
                styles.navText, 
                (isCurrent || isAnswered) && styles.navTextActive
              ]}>{index + 1}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.progressText}>Question {currentQuestionIndex + 1} of {totalQuestions}</Text>

      {/* Question */}
      <Text style={styles.questionText}>{currentQuestion.question}</Text>

      {/* Options */}
      {currentQuestion.options.map((option) => {
        const isSelected = answers[currentQuestion.id] === option.id;
        return (
          <TouchableOpacity
            key={option.id}
            style={[styles.optionCard, isSelected && styles.optionSelected]}
            onPress={() => handleOptionSelect(option.id)}
          >
            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{option.text}</Text>
            {isSelected && <Ionicons name="checkmark-circle" size={24} color="#007AFF" />}
          </TouchableOpacity>
        );
      })}

      {/* Navigation Buttons */}
      <View style={styles.footerButtons}>
        <TouchableOpacity 
          style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]} 
          onPress={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>

        {currentQuestionIndex < totalQuestions - 1 ? (
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.navButton, styles.submitButton]} 
            onPress={submitQuiz}
            disabled={isSubmitting}
          >
            {isSubmitting ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>Submit</Text>}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, paddingTop: 60, backgroundColor: '#f9f9f9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Navigator Styles
  navContainer: { flexDirection: 'row', marginBottom: 20, maxHeight: 50 },
  navDot: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  navDotCurrent: { backgroundColor: '#007AFF', borderWidth: 2, borderColor: '#0056b3' },
  navDotAnswered: { backgroundColor: '#4CD964' },
  navText: { fontSize: 14, color: '#666', fontWeight: 'bold' },
  navTextActive: { color: 'white' },

  progressText: { fontSize: 14, color: '#666', marginBottom: 10 },
  questionText: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 24 },
  
  optionCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 2, borderColor: '#E0E0E0', marginBottom: 12, backgroundColor: 'white' },
  optionSelected: { borderColor: '#007AFF', backgroundColor: '#E6F4FE' },
  optionText: { fontSize: 16, color: '#333', flex: 1 },
  optionTextSelected: { color: '#007AFF', fontWeight: 'bold' },

  footerButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginBottom: 40 },
  navButton: { flex: 1, backgroundColor: '#E0E0E0', padding: 15, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 },
  disabledButton: { opacity: 0.5 },
  navButtonText: { color: '#333', fontWeight: 'bold' },
  submitButton: { backgroundColor: '#007AFF' },
  submitButtonText: { color: 'white', fontWeight: 'bold' },

  resultCard: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  resultTitle: { fontSize: 28, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  resultScore: { fontSize: 20, color: '#666', marginBottom: 30 },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center', width: '100%' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});