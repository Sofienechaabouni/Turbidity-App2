import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import "firebase/compat/storage";
import firebase from "firebase/compat/app";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";

export default function UserCamera({ route, navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  const changeName = async () => {
    var storageRef = firebase
      .storage()
      .ref("Dataset/1118.87_2023-04-27_15:27:32");

    // Créez une référence à l'emplacement où vous voulez déplacer le fichier
    var newRef = firebase.storage().ref("Dataset/1118.87_2023-04-27_15:27:32");

    // Obtenir l'URL de téléchargement du fichier à renommer
    // storageRef
    //   .getDownloadURL()
    //   .then(function (url) {
    //     return newRef.putString(url, "data_url");
    //   })
    //   .then(function (snapshot) {
    //     console.log("Le fichier a été renommé avec succès");
    //   })
    //   .catch(function (error) {
    //     console.log(
    //       "Une erreur s'est produite lors du renommage du fichier:",
    //       error
    //     );
    //   });
    storageRef
      .getDownloadURL()
      .then(function (url) {
        return fetch(url);
      })
      .then(function (response) {
        return response.blob();
      })
      .then(function (blob) {
        // Upload the file data to the new location with the new file name
        return (
          newRef.put(blob, { contentType: "image/jpeg" }) && storageRef.delete()
        );
      })
      .then(function (snapshot) {
        console.log("File renamed successfully");
      })
      .catch(function (error) {
        console.log("An error occurred while renaming the file:", error);
      });
  };
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
      fetch(processedImage.uri)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Image = reader.result.split(",")[1]; // Extract the base64 data part
            sendImageToServer(base64Image);
          };
          reader.readAsDataURL(blob);
        })
        .catch((error) => console.error(error));
    }

    const sendImageToServer = (base64Image) => {
      // Send the base64-encoded image as a string to the server
      fetch(`http://${route.params.adress}:5000/process_image`, {
        method: "POST",
        body: JSON.stringify({ image: base64Image }), // Send as JSON
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Data received from Flask server:", data);
          // Handle the response from the server as needed
          setModalVisible(true);
        })
        .catch((error) => console.error(error));
    };
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: "center",
          }}
          onPress={() => {
            setModalVisible(false);
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 55,
              color: "blue",
            }}
          >
            High Turbidity
          </Text>
        </Pressable>
      </Modal>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={(ref) => setCamera(ref)}
      >
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity style={styles.button} onPress={changeName}>
            <Text style={styles.buttonText}>change name</Text>
          </TouchableOpacity> */}
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
    width: 250,
    height: 250,
    borderWidth: 6,
    borderColor: "white",
    //transform: [{ translateX: -150 }, { translateY: -100 }],
  },
});
