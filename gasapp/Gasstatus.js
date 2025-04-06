import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated, PermissionsAndroid, Platform } from "react-native";
import SmsAndroid from "react-native-sms-android";
import axios from "axios";

const GasStatus = () => {
  const [gasLevel, setGasLevel] = useState(null);
  const [status, setStatus] = useState({ color: "gray", message: "Loading..." });
  const [heightAnim] = useState(new Animated.Value(0));
  const smsSentRef = useRef(false); // prevent multiple SMS sends

  const requestSmsPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        {
          title: "Gas Alert Permission",
          message: "App needs permission to send SMS when gas is low.",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  useEffect(() => {
    const fetchGasLevel = async () => {
      try {
        const response = await axios.get("http://192.168.1.4:5000/gas-level");
        const newLevel = parseFloat(response.data.gaslevel);
        setGasLevel(newLevel);

        Animated.timing(heightAnim, {
          toValue: newLevel,
          duration: 500,
          useNativeDriver: false,
        }).start();

        // Status update
        if (newLevel >= 50) {
          setStatus({ color: "green", message: "Full" });
        } else if (newLevel >= 40) {
          setStatus({ color: "yellow", message: "Getting Low" });
        } else if (newLevel >= 20) {
          setStatus({ color: "orange", message: "Low" });
        } else {
          setStatus({ color: "red", message: "Refill Needed" });

          // SMS logic
          if (!smsSentRef.current) {
            const hasPermission = await requestSmsPermission();
            if (hasPermission) {
              SmsAndroid.autoSend(
                "7200097246", // replace with your phone number
                "⚠️ Gas Alert: Cylinder level is below 20%. Refill needed!",
                (fail) => console.log("SMS failed:", fail),
                (success) => {
                  console.log("SMS sent successfully");
                  smsSentRef.current = true;
                }
              );
            }
          }
        }
      } catch (err) {
        console.error("Error fetching gas level:", err);
        setStatus({ color: "gray", message: "Unable to fetch" });
      }
    };

    fetchGasLevel();
    const interval = setInterval(fetchGasLevel, 5000);
    return () => clearInterval(interval);
  }, []);

  const bodyHeight = 180;
  const animatedHeight = heightAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [0, bodyHeight],
  });

  return (
    <View style={styles.container}>
      <View style={styles.topHandle}>
        <View style={styles.handleArm} />
        <View style={styles.handleGap} />
        <View style={styles.handleArm} />
      </View>
      <View style={styles.neck} />
      <View style={styles.body}>
        <Animated.View style={[styles.gasFill, { height: animatedHeight, backgroundColor: status.color }]} />
      </View>
      <Text style={styles.text}>
        Gas Level: {gasLevel !== null ? `${gasLevel.toFixed(1)}%` : "Loading..."}
      </Text>
      <Text style={[styles.text, { color: status.color }]}>{status.message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e1e1e",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topHandle: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 2,
  },
  handleArm: {
    width: 15,
    height: 20,
    backgroundColor: "#ccc",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  handleGap: {
    width: 20,
  },
  neck: {
    width: 40,
    height: 20,
    backgroundColor: "#ccc",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: 2,
  },
  body: {
    width: 100,
    height: 180,
    backgroundColor: "#2e2e2e",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#aaa",
    overflow: "hidden",
    justifyContent: "flex-end",
    position: "relative",
  },
  gasFill: {
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
  },
});

export default GasStatus;
