import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { challenges } from "../../data/challenges";
import { supabase } from "../../lib/supabase";
import { useSession } from "../../ctx/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Typography, Spacing, BorderRadius, Shadows } from "../../lib/theme";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInRight, SlideOutLeft, FadeInDown } from 'react-native-reanimated';

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useSession();

  const challenge = challenges.find(c => c.id === id);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  
  const [isReviewing, setIsReviewing] = useState(false);

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
    if (Object.keys(answers).length < totalQuestions) {
      if (Platform.OS === 'web') {
        window.alert("Please answer all questions before submitting.");
      } else {
        Alert.alert("Incomplete", "Please answer all questions before submitting.");
      }
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

    } catch (error: any) {
      console.error("Error saving progress:", error);
      if (Platform.OS === 'web') {
        window.alert("Failed to save progress: " + error.message);
      } else {
        Alert.alert("Error", "Failed to save your progress.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const startReview = () => {
    setIsReviewing(true);
    setCurrentQuestionIndex(0); 
  };

  const exitReview = () => {
    setIsReviewing(false);
  };

  if (quizCompleted && !isReviewing) {
    const percentage = (finalScore / challenge.totalPoints) * 100;
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(600)} style={styles.resultCard}>
          <LinearGradient
            colors={percentage >= 70 ? ['#4CD964', '#2ecc71'] : ['#FF9500', '#FF5722']}
            style={styles.trophyCircle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons
              name={percentage >= 70 ? "trophy" : "ribbon"}
              size={64}
              color={Colors.white}
            />
          </LinearGradient>

          <Text style={styles.resultTitle}>
            {percentage >= 70 ? "Great Job!" : "Quiz Completed!"}
          </Text>
          <Text style={styles.resultScore}>
            {finalScore} / {challenge.totalPoints} Points
          </Text>
          <Text style={styles.resultPercentage}>{Math.round(percentage)}%</Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
                // Force navigation on web to ensure dashboard refreshes
                if (Platform.OS === 'web') {
                    router.replace('/(tabs)/dashboard');
                } else {
                    router.replace('/(tabs)/dashboard');
                }
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="stats-chart" size={20} color={Colors.white} />
            <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={startReview}
            activeOpacity={0.8}
          >
            <Ionicons name="eye" size={20} color={Colors.primary} />
            <Text style={styles.secondaryButtonText}>Review Answers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.replace('/(tabs)/challenges')}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.textSecondary} />
            <Text style={[styles.secondaryButtonText, { color: Colors.textSecondary }]}>Back to Challenges</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isReviewing && (
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewHeaderText}>Review Mode</Text>
        </View>
      )}

      <Animated.View entering={FadeIn.duration(400)}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <Animated.View
              style={[styles.progressBarFill, { width: `${progressPercentage}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </Text>
        </View>
      </Animated.View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navContainer}>
        {challenge.questions.map((q, index) => {
          const isAnswered = !!answers[q.id];
          const isCurrent = index === currentQuestionIndex;
          
          // FIX: Use array for styles to merge base + modifier
          const dotStyles: any[] = [styles.navDot]; 

          if (isReviewing) {
             const userAnswer = answers[q.id];
             const isCorrect = q.options.find(o => o.id === userAnswer)?.isCorrect;
             
             if (isCurrent) dotStyles.push(styles.navDotCurrent);
             else if (isCorrect) dotStyles.push(styles.navDotCorrect);
             else dotStyles.push(styles.navDotWrong);
          } else {
             if (isCurrent) dotStyles.push(styles.navDotCurrent);
             else if (isAnswered) dotStyles.push(styles.navDotAnswered);
          }

          return (
            <TouchableOpacity
              key={q.id}
              style={[dotStyles, { marginRight: Spacing.md }]}
              onPress={() => setCurrentQuestionIndex(index)}
            >
              <Text style={[
                styles.navText,
                (isCurrent || (isReviewing && !isCurrent)) && styles.navTextActive
              ]}>{index + 1}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Animated.View
        key={currentQuestionIndex}
        entering={SlideInRight.duration(300)}
        exiting={SlideOutLeft.duration(300)}
      >
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </Animated.View>

      {currentQuestion.options.map((option, index) => {
        const isSelected = answers[currentQuestion.id] === option.id;
        
        // FIX: Use array for styles
        const cardStyles: any[] = [styles.optionCard];
        const textStyles: any[] = [styles.optionText];
        let icon = null;

        if (isReviewing) {
          if (option.isCorrect) {
            cardStyles.push(styles.optionCorrect);
            textStyles.push(styles.optionTextSelected);
            icon = <Ionicons name="checkmark-circle" size={24} color={Colors.success} />;
          } else if (isSelected && !option.isCorrect) {
            cardStyles.push(styles.optionWrong);
            textStyles.push(styles.optionTextSelected);
            // FIX: Colors.error -> Colors.danger
            icon = <Ionicons name="close-circle" size={24} color={Colors.danger} />; 
          }
        } else {
          if (isSelected) {
            cardStyles.push(styles.optionSelected);
            textStyles.push(styles.optionTextSelected);
            icon = <View style={styles.checkCircle}><Ionicons name="checkmark-circle" size={24} color={Colors.primary} /></View>;
          }
        }

        return (
          <Animated.View
            key={option.id}
            entering={FadeIn.duration(300).delay(index * 50)}
          >
            <TouchableOpacity
              style={cardStyles}
              onPress={() => handleOptionSelect(option.id)}
              activeOpacity={0.7}
              disabled={isReviewing}
            >
              <Text style={textStyles}>
                {option.text}
              </Text>
              {icon}
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {isReviewing && currentQuestion.explanation && (
        <Animated.View entering={FadeInDown.duration(500)} style={styles.explanationBox}>
          <View style={styles.explanationHeader}>
            <Ionicons name="bulb" size={20} color="#F59E0B" />
            <Text style={styles.explanationTitle}>Explanation</Text>
          </View>
          <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
        </Animated.View>
      )}

      <View style={styles.footerButtons}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]}
          onPress={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={currentQuestionIndex === 0 ? Colors.gray400 : Colors.text} />
          <Text style={[styles.navButtonText, currentQuestionIndex === 0 && styles.disabledText]}>
            Previous
          </Text>
        </TouchableOpacity>

        {currentQuestionIndex < totalQuestions - 1 ? (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
            activeOpacity={0.7}
          >
            <Text style={styles.navButtonText}>Next</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.text} />
          </TouchableOpacity>
        ) : (
          isReviewing ? (
            <TouchableOpacity
              style={styles.navButton}
              onPress={exitReview}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Back to Results</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, styles.submitButton]}
              onPress={submitQuiz}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Ionicons name="checkmark-done" size={20} color={Colors.white} />
                  <Text style={styles.submitButtonText}>Submit</Text>
                </>
              )}
            </TouchableOpacity>
          )
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Spacing.xl,
    paddingTop: Spacing['5xl'],
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewHeader: {
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  reviewHeaderText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressContainer: {
    marginBottom: Spacing.lg,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  progressText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: Typography.fontWeight.medium,
  },
  navContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
    maxHeight: 50,
  },
  navDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navDotCurrent: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  navDotAnswered: {
    backgroundColor: Colors.primaryLight,
  },
  navDotCorrect: {
    backgroundColor: Colors.success,
  },
  navDotWrong: {
    backgroundColor: Colors.danger, // FIX: Colors.error -> Colors.danger
  },
  navText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.bold,
  },
  navTextActive: {
    color: Colors.white,
  },
  questionText: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xl,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize['2xl'],
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.gray200,
    marginBottom: Spacing.md,
    backgroundColor: Colors.card,
    ...Shadows.sm,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  optionCorrect: {
    borderColor: Colors.success,
    backgroundColor: '#DCFCE7',
  },
  optionWrong: {
    borderColor: Colors.danger, // FIX: Colors.error -> Colors.danger
    backgroundColor: '#FEE2E2',
  },
  optionText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    flex: 1,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  optionTextSelected: {
    color: Colors.text,
    fontWeight: Typography.fontWeight.semibold,
  },
  checkCircle: {
    marginLeft: Spacing.md,
  },
  explanationBox: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  explanationTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: '#B45309',
    textTransform: 'uppercase',
  },
  explanationText: {
    fontSize: Typography.fontSize.sm,
    color: '#92400E',
    lineHeight: 20,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing['2xl'],
    marginBottom: Spacing['2xl'],
    gap: Spacing.md,
  },
  navButton: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: Spacing.base,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  disabledButton: {
    opacity: 0.5,
  },
  navButtonText: {
    color: Colors.text,
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.base,
  },
  disabledText: {
    color: Colors.gray400,
  },
  submitButton: {
    backgroundColor: Colors.primary,
  },
  submitButtonText: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.base,
  },
  resultCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  trophyCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.xl,
  },
  resultTitle: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.extrabold,
    marginBottom: Spacing.md,
    color: Colors.text,
  },
  resultScore: {
    fontSize: Typography.fontSize.xl,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  resultPercentage: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing['2xl'],
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...Shadows.md,
    marginBottom: Spacing.md,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
  secondaryButton: {
    backgroundColor: Colors.card,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
});