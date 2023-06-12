import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Platform,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect } from "react";
import { authentication, db } from "./database/firebase";
import { arrayUnion, doc, setDoc } from "firebase/firestore";
import "firebase/compat/storage";
import firebase from "firebase/compat/app";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";

export default function UserCamera({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const options = { quality: 1, base64: true };
      const photo = await camera.takePictureAsync(options);
      const resizedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [
          {
            resize: {
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
            },
          },
        ],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
      );
      console.log(
        "picture taken **************************************************************"
      );
      console.log("heree");
      const boxTop = Dimensions.get("screen").height * 0.1;
      const boxLeft = Dimensions.get("screen").width * 0.15;
      //position of the crop
      const cropRegion = {
        originX: boxLeft,
        originY: boxTop,
        width: 255,
        height: 250,
      };
      const processedImage = await ImageManipulator.manipulateAsync(
        resizedPhoto.uri,
        [{ crop: cropRegion }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      fetch("http://192.168.146.19:5000/data")
        .then((response) => response.json())
        .then((data) => {
          console.log("Data received in fetch method :", data);
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, "0");
          const day = String(today.getDate()).padStart(2, "0");
          const hours = today.getHours();
          const minutes = today.getMinutes();
          const seconds = today.getSeconds();
          const currentDate = `${year}-${month}-${day},${hours}:${
            minutes < 10 ? `0${minutes}` : minutes
          }:${seconds < 10 ? `0${seconds}` : seconds}`;
          return `${data.value},${currentDate}`;
        })
        .then(async (data) => {
          console.log("data received in the next then ", data);
          const uploadUri = await fetch(processedImage.uri);
          const blob = await uploadUri.blob();
          const storageRef = await firebase.storage().ref(`testImages/${data}`); //Number(avg(dataArray)).toFixed(2).toString()
          const task = await storageRef.put(blob);
          console.log(
            "****************************** uploaded Uri **********************************************"
          );

          // Create file metadata to update
          // const metadata = {
          //   customMetadata: {
          //     location: "Yosemite, CA, USA",
          //     activity: "Hiking",
          //   },
          // };

          // // Update metadata properties
          // const forestRef = firebase
          //   .storage()
          //   .ref("testImages/hahahap.image/jpeg");
          // firebase
          //   .storage()
          //   .ref()
          //   .updateMetadata(forestRef, metadata)
          //   .then((metadata) => {
          //     // Updated metadata for 'images/forest.jpg' is returned in the Promise
          //   })
          //   .catch((error) => {
          //     // Uh-oh, an error occurred!
          //   });
        })
        .catch((error) => console.error(error));

      setPhoto(resizedPhoto);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // const [image, setImage] = useState(null);

  // const pickImage = async () => {
  //   // No permissions request is necessary for launching the image library
  //   let result = await ImagePicker.launchCameraAsync({});

  //   console.log(result);

  //   if (!result.canceled) {
  //     setImage(result.assets[0].uri);
  //   }
  // };
  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={(ref) => setCamera(ref)}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.buttonText}>Capture</Text>
          </TouchableOpacity>
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
    width: 255,
    height: 250,
    borderWidth: 6,
    borderColor: "white",
    //transform: [{ translateX: -150 }, { translateY: -100 }],
  },
});
