import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";

export default function AdminDashboard({ navigation }) {
  const [buyer, setBuyer] = useState(true);
  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 0.1,
          textAlign: "center",
          textAlignVertical: "center",
          fontSize: 25,
        }}
      ></View>
      <Text
        style={{
          flex: 0.1,
          textAlign: "center",
          textAlignVertical: "center",
          fontSize: 20,
          color: "rgb(108, 93, 211)",
        }}
      >
        choose the mode you want to use
      </Text>
      <View style={styles.buyerSellerDiv}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Camera")}
          style={[
            styles.buyerSeller,
            {
              backgroundColor: "rgb(108, 93, 211)",
              width: 250,
            },
          ]}
        >
          <Text style={styles.buyerTxt}>Simple User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buyerSellerDiv: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  buyerSeller: {
    borderRadius: 15,
    height: 125,
    flexDirection: "row",
    justifyContent: "center",
    margin: 25,
  },
  buyerTxt: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
  },
  nextButton: {
    borderWidth: 1,
    borderColor: "rgb(108, 93, 211)",
    backgroundColor: "white",
    borderRadius: 15,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
