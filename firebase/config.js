// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
//import { getAuth } from "firebase/auth";
import { collection, initializeFirestore } from "firebase/firestore";

import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID} from '@env'
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

 

// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: API_KEY,

  authDomain: AUTH_DOMAIN,

  projectId: PROJECT_ID,

  storageBucket: STORAGE_BUCKET,

  messagingSenderId: MESSAGING_SENDER_ID,

  appId: APP_ID

};

 

// Initialize Firebase


// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

//const app = initializeApp(firebaseConfig);
//export const auth = getAuth();
export const db = initializeFirestore(app, {experimentalForceLongPolling: true});

export const userRef = collection(db, "Users");
export const chatRef = collection(db, "Chats");
