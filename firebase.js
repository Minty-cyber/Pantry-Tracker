// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzVVRuPoZLduBbmjaxY60bfChTNvHFRgc",
  authDomain: "pantry-cc329.firebaseapp.com",
  projectId: "pantry-cc329",
  storageBucket: "pantry-cc329.appspot.com",
  messagingSenderId: "738355253995",
  appId: "1:738355253995:web:50817de7cb8849984da4ae",
  measurementId: "G-C3GRDC6KEN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {firestore}