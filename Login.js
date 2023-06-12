import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import FbLogo from "./Logos/FbLogo";
import GoogleLogo from "./Logos/GoogleLogo";
import LockLogo from "./Logos/LockLogo";
import { authentication, db } from "./database/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { collection, getDoc } from "firebase/firestore";
// import { db } from "./database/firebase";
export default function Login({ navigation }) {
  let isSignUp = true; //on va voir si il est logged in ou non depuis local storage
  const [err, setErr] = React.useState(true);
  const [errMsg, setErrMsg] = React.useState("");
  const [signInPassword, setSignInPassword] = useState(false);
  const [singUpStatus, setSingUpStatus] = useState(!!isSignUp);
  const [mail, onChangeMail] = React.useState("sofiene275@gmail.com");
  const [verifiedMail, setVerifiedMail] = React.useState("");
  const [name, onChangeName] = React.useState("sofiene");
  const [verifiedName, setVerifiedName] = React.useState("");
  const [surname, onChangeSurname] = React.useState("Chaabouni");
  const [verifiedSurname, setVerifiedSurname] = React.useState("");
  const [password, onChangePassword] = React.useState("Sofiene275..");
  const [verifiedPassword, setVerifiedPassword] = React.useState("");
  const [isAlert, setIsAlert] = React.useState(true);
  const [input, setInput] = React.useState("sofiene275@gmail.com");
  const [isPass, setIsPass] = React.useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = React.useState(false); //setIsLoadingLogin used for the continue and login button in Login section
  const [isLoading, setIsLoading] = React.useState(false); //for the submit button of the form
  const [pass, setPass] = React.useState("Sofiene275.."); //Evadam275..
  const [noSuch, setNoSuch] = React.useState(false);
  const ref_name = React.useRef();
  const ref_surname = React.useRef();
  const ref_password = React.useRef();
  const ref_phone = React.useRef();
  const [phone, setPhone] = React.useState("56853075");
  const [verifiedPhone, setVerifiedPhone] = React.useState("");
  const [username, setUsername] = React.useState("");
  const validateMail = () => {
    let regxp = /\S+@\S+\.\S+/;
    return regxp.test(mail);
  };
  const validateName = () => {
    let regxp = /^[A-Za-z][A-Za-z0-9_]{5,29}$/;
    return regxp.test(name.toLowerCase().trim());
  };
  const validateSurnameName = () => {
    let regxp = /^[A-Za-z][A-Za-z0-9_]{7,29}$/;
    return regxp.test(surname.toLowerCase().trim());
  };
  const validatePassword = () => {
    let regx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*.-]).{8,}$/;
    return regx.test(password);
  };
  const validatePhone = () => {
    let regx = /((\+|00)216)?[0-9]{8}/;
    return regx.test(phone);
  };
  const setData = async () => {
    await setDoc(doc(db, "UserInfo", "randomDoc"), {
      email: "gg",
      name: "name",
      role: "user",
    });
    // const userCol = collection(db, "UserInfo");
    // const UserSnapshot = await getDocs(userCol);
    // const UserList = UserSnapshot.docs.map((doc) => doc.data());
    // console.log(UserList);
  };

  const handleSignUp = async () => {
    if (!validateMail()) {
      setVerifiedMail("Invalid email");
    } else setVerifiedMail("");
    if (!validateName()) {
      setVerifiedName("Name must contain at least 6 characters ");
    } else setVerifiedName("");
    if (!validateSurnameName()) {
      setVerifiedSurname("Surname must contain at least 6 characters ");
    } else setVerifiedSurname("");
    if (!validatePassword()) {
      setVerifiedPassword(
        "Minimum eight characters, at least one uppercase letter, one lowercase letter and one special character"
      );
    } else setVerifiedPassword("");
    if (!validatePhone()) {
      setVerifiedPhone("invalid phone number");
    } else setVerifiedPhone("");
    if (
      verifiedMail == "" &&
      verifiedName == "" &&
      verifiedSurname == "" &&
      verifiedPassword == "" &&
      verifiedPhone == ""
    ) {
      createUserWithEmailAndPassword(authentication, mail, password)
        .then((res) => {
          console.log(res);
          setDoc(doc(db, "UserInfo", authentication.currentUser.uid), {
            email: mail,
            name: name,
            role: "user",
          });
          setIsLoading(true);
        })
        .catch((error) => {
          console.log(error);
          // ..
        });
      //   try {
      //     console.log("here");
      //     const userCredential = await createUserWithEmailAndPassword(
      //       auth,
      //       mail,
      //       password
      //     );
      //     const userID = userCredential.user.uid;
      //     console.log(auth().currentUser.uid);
      //     //const userProfile = { email: mail, password, role: "user", name };
      //     const userProfilesCollection= firebase
      //       .firestore()
      //       .collection("userProfiles");
      //       // .doc(userID)
      //       // .set(userProfile);
      //     console.log("User registered successfully!");
      //     setIsLoadingLogin(true);
      //     console.log("go to login");
      //     // Add a new user profile document to the collection
      //    const userProfile = { name: 'John Doe', age: 30 };
      //   userProfilesCollection.add(userProfile);

      //   } catch (error) {
      //     console.log("heyy");
      //     setErrMsg(error);
      //     console.log(error.code);
      //   }
      // }
      // // if(!err)navigation.navigate('Home');
    }
  };
  const handleLogin = () => {
    signInWithEmailAndPassword(authentication, input, pass)
      .then(async (res) => {
        setIsLoading(true);
        const userID = authentication.currentUser.uid;
        const docRef = await doc(db, "UserInfo", userID);
        const docSnap = await getDoc(docRef);
        const role = docSnap.data().role;
        console.log(role);
        if (role == "user") navigation.navigate("UserDashboard");
        if (role == "admin") navigation.navigate("AdminDashboard");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });

    // signInWithEmailAndPassword(auth, input, pass)
    //   .then((res) => {
    //     console.log(res);
    //     console.log("User logged-in successfully!");
    //     setIsLoadingLogin(true);
    //     navigation.navigate("UserDashboard");
    //   })
    //   .catch((error) => console.log(error.message));
    // if(pass==="")navigation.navigate('Home');
    //source={require("./Logos/pandsell.png")}
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "white" }} enabled>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Image
            style={{ width: "100%", height: 200, resizeMode: "cover" }}
            source={require("./Logos/turbidityLogo.gif")}
          />
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => {
                setSingUpStatus(false);
              }}
              style={[
                styles.singleButton,
                { backgroundColor: !singUpStatus ? "black" : "transparent" },
              ]}
            >
              <Text style={{ color: !singUpStatus ? "white" : "black" }}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSingUpStatus(true);
              }}
              style={[
                styles.singleButton,
                { backgroundColor: singUpStatus ? "black" : "transparent" },
              ]}
            >
              <Text style={{ color: singUpStatus ? "white" : "black" }}>
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.alert, { display: isAlert ? "flex" : "none" }]}>
            <LockLogo />
            <Text style={styles.alertTxt}>
              before you login to{" "}
              <Text style={{ fontWeight: "100" }}>turbidity app</Text> look
              arround 👀
            </Text>
            <TouchableOpacity
              style={styles.alertExit}
              onPress={() => setIsAlert(!isAlert)}
            >
              <Text style={styles.alertTxt}>X</Text>
            </TouchableOpacity>
          </View>
          {singUpStatus ? (
            <>
              {verifiedMail != "" && (
                <Text style={styles.noUser}>{verifiedMail}</Text>
              )}
              <TextInput
                style={styles.input}
                onChangeText={onChangeMail}
                value={mail}
                placeholder="Your email"
                //onFocus={()=>{if(mail.length==0)onChangeMail('')}}
                returnKeyType="next"
                // onBlur={()=>{if(mail===''){onChangeMail("")}}}
                onSubmitEditing={() => {
                  ref_name?.current?.focus();
                  if (mail === "") onChangeMail("");
                }}
                blurOnSubmit={false}
              />
              {verifiedName != "" && (
                <Text style={styles.noUser}>{verifiedName}</Text>
              )}
              <TextInput
                style={styles.input}
                onChangeText={onChangeName}
                value={name}
                placeholder="Your name"
                returnKeyType="next"
                //onFocus={()=>{if(name.length==0)onChangeName('')}}
                //onBlur={()=>{if(name==='')onChangeName("")}}
                ref={ref_name}
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  ref_surname.current.focus();
                }}
              />
              {verifiedSurname != "" && (
                <Text style={styles.noUser}>{verifiedSurname}</Text>
              )}
              <TextInput
                style={styles.input}
                onChangeText={onChangeSurname}
                value={surname}
                placeholder="Your Surname"
                returnKeyType="next"
                ref={ref_surname}
                onSubmitEditing={() => ref_phone.current.focus()}
                blurOnSubmit={false}
              />
              {verifiedPhone != "" && (
                <Text style={styles.noUser}>{verifiedPhone}</Text>
              )}
              <TextInput
                style={styles.input}
                onChangeText={setPhone}
                value={phone}
                placeholder="Your phone number"
                returnKeyType="next"
                ref={ref_phone}
                onSubmitEditing={() => ref_password.current.focus()}
                blurOnSubmit={false}
              />
              {verifiedPassword != "" && (
                <Text style={styles.noUser}>{verifiedPassword}</Text>
              )}
              <TextInput
                style={styles.input}
                onChangeText={onChangePassword}
                value={password}
                ref={ref_password}
                placeholder="password"
                secureTextEntry={isPass ? true : false}
                onFocus={() => {
                  if (password.length == 0) {
                    onChangePassword("");
                    setIsPass(!isPass);
                  }
                }}
                onBlur={() => {
                  if (password === "") {
                    onChangePassword("");
                    setIsPass(!isPass);
                  }
                }}
                // secureTextEntry={true}
              />
              <TouchableOpacity
                onPress={() => {
                  //navigation.navigate('Home');
                  handleSignUp();
                }}
                style={styles.signButton}
              >
                <Text style={styles.signTxt}>Sign Up</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {noSuch && (
                <Text style={styles.noUser}>
                  No such user found in the system !
                </Text>
              )}
              {signInPassword && (
                <Text
                  style={{
                    color: "black",
                    textAlign: "center",
                    fontWeight: "700",
                    fontSize: 20,
                  }}
                >
                  Hi , {username}
                </Text>
              )}
              <View style={[styles.input, { height: 60 }]}>
                {/* <Text style={{color:'grey'}}>{!signInPassword?"Your email or phone number":"Your Password"}</Text> */}
                <TextInput
                  style={{ display: "flex" }}
                  onChangeText={setInput}
                  value={input}
                  placeholder={"Your email or phone number"}
                />
              </View>
              <View style={[styles.input, { height: 60 }]}>
                {/* <Text style={{color:'grey'}}>{!signInPassword?"Your email or phone number":"Your Password"}</Text> */}
                <TextInput
                  style={{ display: "flex" }}
                  onChangeText={setPass}
                  value={pass}
                  secureTextEntry={true}
                  placeholder={"Your Password"}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  handleLogin();
                }}
                style={styles.continueButton}
              >
                <Text>Login</Text>
              </TouchableOpacity>
            </>
          )}
          <Text style={{ color: "grey" }}>OR</Text>
          <TouchableOpacity onPress={() => {}} style={styles.fbgoogle}>
            <FbLogo />
            <Text style={styles.txtfbgo}>Sign in with Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.fbgoogle}>
            <GoogleLogo />
            <Text style={styles.txtfbgo}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  buttons: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(222, 226, 230, 0.5)",
    width: 0.9 * Dimensions.get("window").width,
    height: 50,
    borderRadius: 20,
  },
  singleButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderRadius: 10,
    width: "30%",
  },
  input: {
    width: "90%",
    height: 40,
    margin: 12,
    //borderWidth: '1px',
    color: "#323232",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f8f9fa",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#f8f9fa",
    elevation: 10,
    //box-shadow: inset 0 1px 2px rgb(0 0 0 / 8%);
    // border: 1px solid #f8f9fa;
  },
  signButton: {
    backgroundColor: "#4d69fa",
    width: "90%",
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  signTxt: {
    color: "white",
    fontWeight: "bold",
  },

  fbgoogle: {
    backgroundColor: "transparent",
    width: "90%",
    borderWidth: 1,
    margin: 5,
    borderRadius: 10,
    borderColor: "#1f2128",
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  txtfbgo: { marginLeft: 8 },

  alert: {
    backgroundColor: "#e2dff6",
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 13,
    padding: 8,
    marginTop: 15,
  },

  alertTxt: {
    color: "#41387f",
  },
  alertExit: {
    position: "absolute",
    top: 10,
    right: 7,
  },

  continueButton: {
    //ffcf52
    backgroundColor: "#ffcf52",
    width: "90%",
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  noUser: { marginBottom: 0, color: "red", width: "90%", textAlign: "left" },
});
