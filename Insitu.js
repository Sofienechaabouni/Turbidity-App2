import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import "firebase/compat/storage";
import firebase from "firebase/compat/app";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";

export default function Insitu({ route, navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
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

      fetch(`http://${route.params.adress}:5000/data`)
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
          const currentDate = `${year}-${month}-${day}_${hours}:${
            minutes < 10 ? `0${minutes}` : minutes
          }:${seconds < 10 ? `0${seconds}` : seconds}`;
          return `${data.value}_${currentDate}`;
        })
        .then(async (data) => {
          console.log("data received in the next then ", data);
          const uploadUri = await fetch(processedImage.uri);
          const blob = await uploadUri.blob();
          const storageRef = await firebase.storage().ref(`Dataset2/${data}`); //Number(avg(dataArray)).toFixed(2).toString()
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

  return (
    <View style={styles.container}>
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
