// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3CPlDAw4jtCYyNUaYbmi0jj91QBP-c_Q",
  authDomain: "cine-man0.firebaseapp.com",
  projectId: "cine-man0",
  storageBucket: "cine-man0.appspot.com",
  messagingSenderId: "405376934385",
  appId: "1:405376934385:web:79346bda70a58065ca2450",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
