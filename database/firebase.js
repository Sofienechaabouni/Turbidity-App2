// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebase from 'firebase/compat/app';

const firebaseConfig = {
  apiKey: "AIzaSyDvUl_Zp-1n9qJqxYqVaExWkuihYj8h_Rw",
  authDomain: "turbidity-app2.firebaseapp.com",
  projectId: "turbidity-app2",
  storageBucket: "turbidity-app2.appspot.com",
  messagingSenderId: "609032722078",
  appId: "1:609032722078:web:cd29fc6a3515ad46420d8f",
  measurementId: "G-PS2LP20XDX",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const authentication = getAuth(app);
export const db = getFirestore(app);
