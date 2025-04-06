import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
} from "react-native";
import gasImage from "../assets/gas-cylinder.png"; // your local image

const HomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={gasImage}
        style={[styles.image, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
        resizeMode="contain"
      />

      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>GasGuard</Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        Monitor your gas levels in real-time
      </Animated.Text>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // deep, calm black
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 30,
    shadowColor: "#4dd0e1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#4dd0e1", // soft teal
    textShadowColor: "#1a1a1a",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#b0bec5", // soft gray-blue
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#4dd0e1", // primary button color
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#4dd0e1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: "#26a69a", // secondary button
    shadowColor: "#26a69a",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff", // white for contrast
  },
});

export default HomeScreen;
