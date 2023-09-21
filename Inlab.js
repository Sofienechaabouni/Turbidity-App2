import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import "firebase/compat/storage";
import firebase from "firebase/compat/app";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
export default function Inlab({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [value, setValue] = useState(0);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  const takePicture = async () => {
    //{resize:{width:Dimensions.get("screen").width,height:Dimensions.get("screen").height}}]
    if (camera) {
      const options = { quality: 1, base64: true };
      const photo = await camera.takePictureAsync(options);
      const resizedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [],
        { compress: 0, format: ImageManipulator.SaveFormat.JPEG }
      );
      console.log(
        "picture taken **************************************************************"
      );
      console.log("heree");
      const boxTop = Dimensions.get("screen").height * 0.1;
      const boxLeft = Dimensions.get("screen").width * 0.15;
      const imageWidth = resizedPhoto.width;
      const imageHeight = resizedPhoto.height;
      const scaleFactor = imageWidth / Dimensions.get("screen").width;
      //position of the crop
      const cropRegion = {
        originX: boxLeft * scaleFactor,
        originY: boxTop * scaleFactor,
        width: 245 * scaleFactor,
        height: 245 * scaleFactor,
      };
      const processedImage = await ImageManipulator.manipulateAsync(
        resizedPhoto.uri,
        [{ crop: cropRegion }],
        { compress: 0, format: ImageManipulator.SaveFormat.JPEG }
      );

      console.log("Data received in fetch method :", value);
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const hours = today.getHours();
      const minutes = today.getMinutes();
      const seconds = today.getSeconds();
      const currentDate = `${year}-${month}-${day}_${hours}:${
        minutes < 10 ? `0${minutes}` : minutes
      }:${seconds < 10 ? `0${seconds}` : seconds}`;
      console.log("data received in the next then ", `${value}_${currentDate}`);
      const uploadUri = await fetch(processedImage.uri);
      const blob = await uploadUri.blob();
      const storageRef = await firebase
        .storage()
        .ref(`Dataset2/${`${value}_${currentDate}`}`); //Number(avg(dataArray)).toFixed(2).toString()
      const task = await storageRef.put(blob);
      console.log(
        "****************************** uploaded Uri **********************************************"
      );

      setPhoto(resizedPhoto);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={(ref) => setCamera(ref)}
      >
        <View style={{ flexDirection: "column" }}>
          <View style={styles.buttonContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setValue}
              value={value}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.buttonText}>Capture</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.box} />
      </Camera>
      {/* {photo && (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo.uri }} style={styles.photo} />
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  photoContainer: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  box: {
    position: "absolute",
    top: "10%",
    left: "15%",
    width: 250,
    height: 250,
    borderWidth: 6,
    borderColor: "white",
  },
  input: {
    width: 100,
    //borderWidth: '1px',
    color: "#323232",
    padding: 10,
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 10,
    backgroundColor: "#f8f9fa",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#f8f9fa",
    elevation: 10,
    //box-shadow: inset 0 1px 2px rgb(0 0 0 / 8%);
    // border: 1px solid #f8f9fa;
  },
});
