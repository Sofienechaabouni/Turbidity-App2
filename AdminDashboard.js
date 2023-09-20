import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

export default function AdminDashboard({ navigation }) {
  const [buyer, setBuyer] = useState(true);
  const [text, onChangeText] = React.useState("");

  return (
    <KeyboardAvoidingView
      style={styles.container}
      enabled
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.buyerSellerDiv}
        keyboardShouldPersistTaps="handled"
        scrollEnabled
      >
        <View style={styles.content}>
          <View
            style={{
              height: "10%",
              textAlign: "center",
              textAlignVertical: "center",
              fontSize: 25,
            }}
          ></View>
          <Text style={styles.heading}>Choose the mode you want to use</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Inlab")}
            style={[
              styles.buyerSeller,
              { backgroundColor: "rgb(108, 93, 211)" },
            ]}
          >
            <Text style={styles.buyerTxt}>In Lab</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Insitu", {
                adress: text,
              })
            }
            style={[
              styles.buyerSeller,
              { backgroundColor: "rgb(108, 93, 211)" },
            ]}
          >
            <Text style={styles.buyerTxt}>In Situation</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Camera", {
                adress: text,
              })
            }
            style={[
              styles.buyerSeller,
              { backgroundColor: "rgb(108, 93, 211)" },
            ]}
          >
            <Text style={styles.buyerTxt}>Simple User</Text>
          </TouchableOpacity>
          <View style={styles.serverLinkContainer}>
            <Text style={styles.serverLinkLabel}>Server Link:</Text>
            <TextInput
              style={styles.serverLinkInput}
              placeholder="Enter server link"
              placeholderTextColor="#323232"
              onChangeText={onChangeText}
              value={text}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buyerSellerDiv: {
    flexGrow: 1,
    height: Dimensions.get("screen").height,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
  },
  heading: {
    fontSize: 20,
    color: "rgb(108, 93, 211)",
    marginBottom: 20,
  },
  buyerSeller: {
    borderRadius: 15,
    height: 125,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 25,
    backgroundColor: "rgb(108, 93, 211)",
    width: 250,
  },
  buyerTxt: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
  },
  serverLinkContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: Platform.OS === "ios" ? "center" : "stretch",
  },
  serverLinkLabel: {
    textAlignVertical: "center",
  },
  serverLinkInput: {
    backgroundColor: "#f8f9fa",
    color: "#323232",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f8f9fa",
    elevation: 10,
    height: 50,
  },
});
