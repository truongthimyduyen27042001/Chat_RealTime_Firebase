// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChrSzXE28BTdeJaSUOGYtlxp1G32gC7_A",
  authDomain: "chat-realtime-firebase-e98ba.firebaseapp.com",
  projectId: "chat-realtime-firebase-e98ba",
  storageBucket: "chat-realtime-firebase-e98ba.firebasestorage.app",
  messagingSenderId: "710302343323",
  appId: "1:710302343323:web:276879674217aadcb8663e",
  measurementId: "G-F3ZY5C8LM2"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);