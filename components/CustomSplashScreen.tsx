import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import * as SplashScreen from 'expo-splash-screen';

interface CustomSplashScreenProps {
  onFinish: () => void;
}

export default function CustomSplashScreen({ onFinish }: CustomSplashScreenProps) {
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    // Play the animation
    if (animation.current) {
      animation.current.play();
    }

    // Hide the native splash screen
    SplashScreen.hideAsync();

    // We'll let the onAnimationFinish handle the completion
    // No need for a timeout that might cut the animation short
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animation}
        style={styles.animation}
        source={require('../assets/animations/yumdump.json')}
        autoPlay={true}
        loop={false}
        speed={1.0}
        resizeMode="cover"
        onAnimationFinish={onFinish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9A11B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});