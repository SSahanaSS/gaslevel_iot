import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import axios from "axios";

const GasStatus = () => {
  const [gasLevel, setGasLevel] = useState(null);
  const [status, setStatus] = useState({ color: "gray", message: "Loading..." });

  useEffect(() => {
    const fetchGasLevel = async () => {
      try {
        const response = await axios.get("http://192.168.1.4:5000/gas-level");
        const newLevel = parseFloat(response.data.gaslevel); // Convert to number

        // Update only if the new value is different (to prevent unnecessary re-renders)
        setGasLevel(prevLevel => (prevLevel !== newLevel ? newLevel : prevLevel));

        // Set status based on gas level
        if (newLevel >= 50) {
          setStatus({ color: "green", message: "Full" });
        } else if (newLevel >= 20) {
          setStatus({ color: "yellow", message: "Getting Low" });
        } else {
          setStatus({ color: "red", message: "Refill Needed" });
        }
      } catch (error) {
        console.error("Error fetching gas level:", error);
      }
    };

    // Fetch initially and then every 2 seconds
    fetchGasLevel();
    const interval = setInterval(fetchGasLevel, 2000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <View style={[styles.box, { backgroundColor: status.color }]}>
      <Text style={styles.text}>Gas Level: {gasLevel !== null ? `${gasLevel}%` : "Loading..."}</Text>
      <Text style={styles.text}>{status.message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    width: 200,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 20,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default GasStatus;
