import React from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get("window").width;

const SkeletonCard = ({ isGrid }: { isGrid: boolean }) => {
  const fadeAnim = new Animated.Value(0); 

  // Fade in animation
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeletonCard,
        { opacity: fadeAnim, width: isGrid ? (screenWidth - 60) / 2 : "100%" }
      ]}
    >
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonText} />
        <View style={styles.skeletonDate} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  skeletonCard: {
    backgroundColor: '#e0e0e0',
    marginBottom: 16,
    borderRadius: 20,
    elevation: 2,
    marginRight: 8,
  },
  skeletonContent: {
    padding: 16,
  },
  skeletonTitle: {
    backgroundColor: '#bdbdbd',
    height: 20,
    marginBottom: 8,
    borderRadius: 4,
  },
  skeletonText: {
    backgroundColor: '#bdbdbd',
    height: 12,
    marginBottom: 6,
    borderRadius: 4,
  },
  skeletonDate: {
    backgroundColor: '#bdbdbd',
    height: 10,
    width: '50%',
    borderRadius: 4,
  },
});

export default SkeletonCard;
