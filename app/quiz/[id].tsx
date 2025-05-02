import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Animated, Easing } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getQuestionsByLesson, saveQuizAttempt} from '../../utils/quizService';
import { Feather } from '@expo/vector-icons';

const QuizScreen = () => {
  const { id: lessonId } = useLocalSearchParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const feedbackAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (lessonId) {
      loadQuestions();
    }
  }, [lessonId]);
  
  const loadQuestions = async () => {
    try {
      const data = await getQuestionsByLesson(lessonId as string);
      setQuestions(data);
    } catch (err) {
      Alert.alert('Error', 'Could not load quiz questions.');
    }
  };

  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      resetTimer();
      animateProgress();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, questions.length]);

  const animateProgress = () => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 10000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
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

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(10);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswer = (choice: string) => {
    setSelected(choice);
    const isCorrect = choice === questions[currentIndex].correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    showFeedback(isCorrect);
    
    setTimeout(() => {
      handleNext();
    }, 1000);
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

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
    setQuizCompleted(false);
    setTimeLeft(10);
    resetTimer();
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

  if (questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    let resultEmoji = '';
    let resultMessage = '';

    if (percentage >= 80) {
      resultEmoji = '🎉';
      resultMessage = 'Excellent!';
    } else if (percentage >= 60) {
      resultEmoji = '👍';
      resultMessage = 'Good job!';
    } else {
      resultEmoji = '💪';
      resultMessage = 'Keep practicing!';
    }

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Quiz Complete! {resultEmoji}</Text>
        <Text style={styles.resultsMessage}>{resultMessage}</Text>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            {score} / {questions.length}
          </Text>
          <Text style={styles.percentageText}>{percentage}%</Text>
        </View>
        
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
        </View>
        
        <TouchableOpacity style={styles.restartButton} onPress={restartQuiz}>
          <Feather name="refresh-cw" size={20} color="#fff" />
          <Text style={styles.restartButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.questionCount}>
          Question {currentIndex + 1} of {questions.length}
        </Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>
      
      <View style={styles.progressBarBackground}>
        <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
      </View>
      
      <Text style={styles.timeLeft}>Time Left: {timeLeft}s</Text>
      <Text style={styles.questionText}>{currentQuestion.questionText}</Text>

      {currentQuestion.choices.map((choice: string, index: number) => (
        <TouchableOpacity
          key={index}
          onPress={() => !selected && handleAnswer(choice)}
          disabled={!!selected}
          style={[
            styles.choiceButton,
            selected
              ? choice === currentQuestion.correctAnswer
                ? styles.correctChoice
                : choice === selected
                ? styles.incorrectChoice
                : styles.defaultChoice
              : styles.defaultChoice,
          ]}
        >
          <Text style={styles.choiceText}>{choice}</Text>
          {selected && choice === currentQuestion.correctAnswer && (
            <Feather name="check" size={20} color="#fff" style={styles.choiceIcon} />
          )}
          {selected && choice === selected && choice !== currentQuestion.correctAnswer && (
            <Feather name="x" size={20} color="#fff" style={styles.choiceIcon} />
          )}
        </TouchableOpacity>
      ))}
      
      <Animated.View 
        style={[
          styles.feedbackContainer,
          {
            opacity: feedbackOpacity,
            transform: [{ scale: feedbackScale }],
          }
        ]}
      >
        {selected && (
          <Text style={[
            styles.feedbackText,
            selected === currentQuestion.correctAnswer ? styles.correctFeedback : styles.incorrectFeedback
          ]}>
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
    backgroundColor: '#222831',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222831',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  questionCount: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  scoreText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 5,
    backgroundColor: '#393e46',
    borderRadius: 5,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00bcd4',
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222831',
    paddingHorizontal: 20,
  },
  resultsTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00bcd4',
    marginBottom: 10,
  },
  resultsMessage: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 30,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  percentageText: {
    fontSize: 24,
    color: '#fff',
    marginLeft: 10,
  },
  progressBarFill: {
    height: 10,
    backgroundColor: '#00bcd4',
    borderRadius: 5,
    marginVertical: 20,
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00bcd4',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 30,
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  timeLeft: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 30,
    lineHeight: 32,
  },
  choiceButton: {
    marginBottom: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  choiceText: {
    fontSize: 18,
    color: '#fff',
    flex: 1,
  },
  choiceIcon: {
    marginLeft: 10,
  },
  defaultChoice: {
    backgroundColor: '#393e46',
  },
  correctChoice: {
    backgroundColor: '#00c853',
  },
  incorrectChoice: {
    backgroundColor: '#f44336',
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 10,
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  correctFeedback: {
    color: '#00c853',
  },
  incorrectFeedback: {
    color: '#f44336',
  },
});

export default QuizScreen;