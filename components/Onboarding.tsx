import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Find restaurant near you',
    image: require('@/assets/images/onboarding-1.png'),
  },
  {
    id: '2',
    title: 'Give quality reviews',
    image: require('@/assets/images/onboarding-2.png'),
  },
  {
    id: '3',
    title: 'Be an influencer!',
    image: require('@/assets/images/onboarding-3.png'),
    showButton: true,
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/(tabs)');
    }
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSkip();
    }
  };

  const currentItem = onboardingData[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={currentItem.image} style={styles.image} resizeMode="contain" />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{currentItem.title}</Text>
        
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === currentIndex ? '#F9A11B' : '#E0E0E0' }
              ]}
            />
          ))}
        </View>
        
        {currentItem.showButton ? (
          <TouchableOpacity style={styles.startButton} onPress={handleSkip}>
            <Text style={styles.startButtonText}>Let's Start!</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>SKIP</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 30,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    color: '#F9A11B',
    fontSize: 16,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#F9A11B',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});