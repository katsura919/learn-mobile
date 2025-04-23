import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { getQuestionsByLesson } from '@/utils/quizService';
import { Feather } from '@expo/vector-icons';
import { generateQuestions } from '@/utils/questionService';
import GenerateSpinner from '@/components/question-generate-spinner';

const ViewQuestionsScreen = () => {
  const { id: lessonId } = useLocalSearchParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useFocusEffect(() => {
    if (lessonId) fetchQuestions();
  });

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

  const handleGenerateQuestions = async () => {
    try {
      setGenerating(true); // show Lottie spinner
      await generateQuestions(lessonId as string);
      Alert.alert('Success', 'Questions have been generated successfully.');
      await fetchQuestions(); // refresh list
    } catch (error) {
      console.error('Error generating questions:', error);
      Alert.alert('Error', 'Failed to generate questions. Please try again.');
    } finally {
      setGenerating(false); // hide spinner
    }
  };

  if (generating) {
    return <GenerateSpinner />;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
         <GenerateSpinner />
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.noQuestionsContainer}>
        <Feather name="zap" size={40} color="#fff" />
        <Text style={styles.noQuestionsText}>
          No questions yet for this lesson.
        </Text>
        <TouchableOpacity style={styles.generateButton} onPress={handleGenerateQuestions}>
          <Feather name="cpu" size={18} color="#fff" />
          <Text style={styles.generateButtonText}>Generate Questions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AI-Generated Questions</Text>
      {questions.map((q, index) => (
        <View key={index} style={styles.questionCard}>
          <Text style={styles.questionText}>Q{index + 1}: {q.questionText}</Text>
          {q.choices.map((choice: string, i: number) => (
            <View key={i} style={styles.choiceRow}>
              <Feather
                name="circle"
                size={16}
                color={choice === q.correctAnswer ? 'green' : '#CBD5E1'}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.choiceText,
                  choice === q.correctAnswer ? styles.correctAnswer : null,
                ]}
              >
                {choice}
              </Text>
            </View>
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
    marginTop: 12,
    marginBottom: 20,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  generateButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#4A90E2',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  questionCard: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  questionText: {
    color: '#333',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
  },
  choiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  choiceText: {
    fontSize: 15,
    color: '#4A4A4A',
  },
  correctAnswer: {
    color: 'green',
    fontWeight: '600',
  },
});

export default ViewQuestionsScreen;
