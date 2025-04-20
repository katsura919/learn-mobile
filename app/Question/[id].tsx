import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getQuestionsByLesson } from '../../utils/quizService';
import { Feather } from '@expo/vector-icons'; // Icon library for a modern touch

const ViewQuestionsScreen = () => {
  const { id: lessonId } = useLocalSearchParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lessonId) {
      fetchQuestions();
    }
  }, [lessonId]);

  const fetchQuestions = async () => {
    try {
      const data = await getQuestionsByLesson(lessonId as string);
      setQuestions(data);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.noQuestionsContainer}>
        <Text style={styles.noQuestionsText}>No questions found for this lesson.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      {questions.map((q, index) => (
        <View key={index} style={styles.questionCard}>
          <Text style={styles.questionText}>
            Q{index + 1}: {q.questionText}
          </Text>
          {q.choices.map((choice: string, i: number) => (
            <Text
              key={i}
              style={[
                styles.choiceText,
                choice === q.correctAnswer ? styles.correctAnswer : styles.incorrectAnswer,
              ]}
            >
              <Feather name="circle" size={16} color={choice === q.correctAnswer ? 'green' : '#CBD5E1'} />
              {choice}
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
  },
  noQuestionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
  },
  noQuestionsText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#4A90E2',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  questionCard: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  questionText: {
    color: '#4A4A4A',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  choiceText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#4A4A4A',
  },
  correctAnswer: {
    color: 'green',
    fontWeight: '500',
  },
  incorrectAnswer: {
    color: '#CBD5E1',
  },
});

export default ViewQuestionsScreen;
