import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

// Messages to show one by one
const messages = ['Reading lesson...', 'Learning...', 'Generating questions...'];

const LoadingSpinner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev < messages.length - 1) {
          return prev + 1;
        } else {
          return 0; // start over if not unmounted yet
        }
      });
    }, 2000); // 1.5 seconds per message

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/lotties/generate.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={styles.text}>{messages[index]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fefeff',
    zIndex: 999,
  },
  lottie: {
    width: 250,
    height: 250,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: '#1e1e1e',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default LoadingSpinner;
