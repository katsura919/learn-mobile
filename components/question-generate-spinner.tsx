import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { useTheme, Surface, Text } from 'react-native-paper';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const messages = ['Reading lesson...', 'Learning...', 'Generating questions...'];

const GenerateSpinner = () => {
  const { colors, dark } = useTheme();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev < messages.length - 1 ? prev + 1 : 0));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Surface style={[styles.container, { backgroundColor: dark ? colors.background : '#fefeff' }]}>
      <LottieView
        source={require('../assets/lotties/generate.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text variant="titleMedium" style={[styles.text, { color: colors.onBackground }]}>
        {messages[index]}
      </Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, 
  },
  lottie: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default GenerateSpinner;
