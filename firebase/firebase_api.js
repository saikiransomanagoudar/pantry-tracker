// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGJ5k7woq9LQdN79GBfLQTGb3yN1qRxKs",
  authDomain: "pantry-tracker-130df.firebaseapp.com",
  projectId: "pantry-tracker-130df",
  storageBucket: "pantry-tracker-130df.appspot.com",
  messagingSenderId: "559321347702",
  appId: "1:559321347702:web:8f0b9c89d917d07d60d157",
  measurementId: "G-CZJ50BS56Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);