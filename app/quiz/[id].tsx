import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, KeyboardAvoidingView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getQuestionsByLesson } from '../../utils/quizService';
import { Text, Button, ActivityIndicator, TextInput, Provider as PaperProvider } from 'react-native-paper';
import { useAppTheme } from '@/hooks/themeContext';

export default function QuizScreen() {
  const { id: lessonId } = useLocalSearchParams();
  const { theme } = useAppTheme(); 

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timerDuration, setTimerDuration] = useState('10');
  const [started, setStarted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const feedbackAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (lessonId) loadQuestions();
  }, [lessonId]);

  const loadQuestions = async () => {
    try {
      const data = await getQuestionsByLesson(lessonId as string);
      setQuestions(data);
    } catch {
      alert('Error loading questions');
    }
  };

  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length && started) {
      resetTimer();
      animateProgress();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, questions.length, started]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const duration = parseInt(timerDuration);
    setTimeLeft(duration);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext();
          return duration;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const animateProgress = () => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: parseInt(timerDuration) * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const handleAnswer = (choice: string) => {
    setSelected(choice);
    const isCorrect = choice === questions[currentIndex].correctAnswer;
    if (isCorrect) setScore((prev) => prev + 1);
    showFeedback(isCorrect);
    setTimeout(() => handleNext(), 1000);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelected(null);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setQuizCompleted(true);
    }
  };

  const showFeedback = (isCorrect: boolean) => {
    feedbackAnim.setValue(0);
    Animated.spring(feedbackAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.spring(feedbackAnim, {
          toValue: 0,
          friction: 5,
          useNativeDriver: true,
        }).start();
      }, 500);
    });
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
    setQuizCompleted(false);
    setStarted(false);
    setTimeLeft(parseInt(timerDuration));
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const feedbackScale = feedbackAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const feedbackOpacity = feedbackAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  if (!started) {
    return (
      <KeyboardAvoidingView behavior="padding" style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text variant="headlineMedium" style={{ marginBottom: 20, color: theme.colors.primary }}>
          Set Time Limit
        </Text>
        <TextInput
          label="Time per question (in seconds)"
          value={timerDuration}
          onChangeText={setTimerDuration}
          keyboardType="numeric"
          mode="outlined"
          style={{ marginBottom: 20 }}
        />
        <Button mode="contained" onPress={() => setStarted(true)}>
          Start Quiz
        </Button>
      </KeyboardAvoidingView>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const resultEmoji = percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪';
    const resultMessage = percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good job!' : 'Keep practicing!';

    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text variant="headlineLarge" style={{ color: theme.colors.primary }}>
          Quiz Complete! {resultEmoji}
        </Text>
        <Text variant="titleMedium" style={{ marginVertical: 10 }}>
          {resultMessage}
        </Text>
        <Text variant="titleLarge">{score} / {questions.length} ({percentage}%)</Text>
        <Button mode="contained" onPress={restartQuiz} style={{ marginTop: 20 }} icon="refresh">
          Try Again
        </Button>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text>Question {currentIndex + 1} of {questions.length}</Text>
        <Text>Score: {score}</Text>
      </View>

      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, { width: progressWidth, backgroundColor: theme.colors.primary }]} />
      </View>

      <Text style={{ textAlign: 'center', marginVertical: 10 }}>Time Left: {timeLeft}s</Text>
      <Text variant="titleLarge" style={{ marginBottom: 20 }}>{currentQuestion.questionText}</Text>

      {currentQuestion.choices.map((choice: string, index: number) => {
        const isCorrect = selected && choice === currentQuestion.correctAnswer;
        const isIncorrect = selected && choice === selected && choice !== currentQuestion.correctAnswer;

        return (
          <Button
            key={index}
            mode="outlined"
            onPress={() => !selected && handleAnswer(choice)}
            disabled={!!selected}
            icon={isCorrect ? 'check' : isIncorrect ? 'close' : undefined}
            style={{
              marginBottom: 10,
              borderColor: isCorrect
                ? theme.colors.primary
                : isIncorrect
                ? theme.colors.error
                : theme.colors.outline,
            }}
          >
            {choice}
          </Button>
        );
      })}

      <Animated.View
        style={{
          opacity: feedbackOpacity,
          transform: [{ scale: feedbackScale }],
          marginTop: 20,
          alignItems: 'center',
        }}
      >
        {selected && (
          <Text
            variant="titleMedium"
            style={{ color: selected === currentQuestion.correctAnswer ? theme.colors.primary : theme.colors.error }}
          >
            {selected === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect!'}
          </Text>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#ccc',
    borderRadius: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});