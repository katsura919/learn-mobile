import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Appbar, Text, Button, ActivityIndicator, Card, TextInput } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { getQuestionsByLesson } from '@/utils/quizService';
import { generateQuestions, batchUpdateQuestions } from '@/utils/questionService';
import GenerateSpinner from '@/components/question-generate-spinner';
import { useAppTheme } from '@/hooks/themeContext';

const ViewQuestionsScreen = () => {
  const { id: lessonId } = useLocalSearchParams();
  const { theme } = useAppTheme();
  const router = useRouter();

  const [questions, setQuestions] = useState<any[]>([]);
  const [editableQuestions, setEditableQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

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
      setGenerating(true);
      await generateQuestions(lessonId as string);
      await fetchQuestions();
    } catch (error) {
      console.error('Error generating questions:', error);
      Alert.alert('Error', 'Failed to generate questions. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveQuestions = async () => {
    try {
      await batchUpdateQuestions(editableQuestions);
      await fetchQuestions();
      setIsEditMode(false);
    } catch (error) {
      console.error('Failed to save questions:', error);
      Alert.alert('Error', 'Failed to save updated questions.');
    }
  };

  if (generating) {
    return <GenerateSpinner />;
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator animating size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header elevated style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => router.back()} color={theme.colors.onSurface} />
        <Appbar.Content title="Questions" titleStyle={{ color: theme.colors.onSurface }} />
        <Appbar.Action
          icon={isEditMode ? 'content-save' : 'pencil'}
          color={theme.colors.onSurface}
          onPress={() => {
            if (isEditMode) {
              handleSaveQuestions();
            } else {
              setEditableQuestions(questions.map((q) => ({ ...q })));
              setIsEditMode(true);
            }
          }}
        />
      </Appbar.Header>

      {questions.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <Feather name="zap" size={40} color={theme.colors.primary} />
          <Text variant="titleMedium" style={{ color: theme.colors.onBackground, textAlign: 'center', marginTop: 12 }}>
            No questions yet for this lesson.
          </Text>
          <Button
            mode="contained"
            onPress={handleGenerateQuestions}
            style={{ marginTop: 20, borderRadius: 30 }}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
            icon="plus"
          >
            Generate Questions
          </Button>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {(isEditMode ? editableQuestions : questions).map((q, index) => (
            <Card key={index} style={{ marginBottom: 20, backgroundColor: theme.colors.surface, borderRadius: 16 }}>
              <Card.Content>
                {isEditMode ? (
                  <>
                    <TextInput
                      label={`Question ${index + 1}`}
                      value={q.questionText}
                      onChangeText={(text) => {
                        const updated = [...editableQuestions];
                        updated[index].questionText = text;
                        setEditableQuestions(updated);
                      }}
                      style={{ marginBottom: 12 }}
                    />

                    {q.choices.map((choice: string, i: number) => (
                      <TextInput
                        key={i}
                        label={`Choice ${i + 1}`}
                        value={choice}
                        onChangeText={(text) => {
                          const updated = [...editableQuestions];
                          updated[index].choices[i] = text;
                          setEditableQuestions(updated);
                        }}
                        style={{ marginBottom: 8 }}
                      />
                    ))}

                    <TextInput
                      label="Correct Answer"
                      value={q.correctAnswer}
                      onChangeText={(text) => {
                        const updated = [...editableQuestions];
                        updated[index].correctAnswer = text;
                        setEditableQuestions(updated);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
                      Q{index + 1}: {q.questionText}
                    </Text>

                    {q.choices.map((choice: string, i: number) => (
                      <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <Feather
                          name="circle"
                          size={16}
                          color={choice === q.correctAnswer ? theme.colors.primary : theme.colors.outline}
                          style={{ marginRight: 8 }}
                        />
                        <Text
                          variant="bodyMedium"
                          style={{
                            color: choice === q.correctAnswer ? theme.colors.primary : theme.colors.onSurface,
                            fontWeight: choice === q.correctAnswer ? '600' : '400',
                          }}
                        >
                          {choice}
                        </Text>
                      </View>
                    ))}
                  </>
                )}
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ViewQuestionsScreen;
