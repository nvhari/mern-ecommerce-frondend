// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAq9lbwB1xGQhTyZNEk5i9yWc72w9sVSLs",
  authDomain: "fullstack-ecommerce-10a7b.firebaseapp.com",
  projectId: "fullstack-ecommerce-10a7b",
  storageBucket: "fullstack-ecommerce-10a7b.firebasestorage.app",
  messagingSenderId: "149997796649",
  appId: "1:149997796649:web:075763847a755cf8890b38"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);