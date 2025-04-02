import { Image, StyleSheet, ScrollView, Pressable, Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.loop(
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const opacity = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 1],
  });

  return (
    <Pressable style={styles.press} onPress={() => router.push('/form')}>
      <ScrollView contentContainerStyle={styles.view}>
        <Image style={styles.images} source={require('../../assets/images/evoLogo.png')} />
        <Animated.Text style={[styles.text, { opacity }]}>Appuyer Pour Commencer</Animated.Text>
      </ScrollView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    flex: 1,
  },
  images: {
    width: 300,
    height: 300,
  },
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#000F22',
  },
  text: {
    position: 'absolute',
    color: '#F7F7F7',
    fontSize: 20,
    bottom: '20%',
  },
});
