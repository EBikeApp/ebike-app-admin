import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import "firebase/storage";

const app = initializeApp({
  apiKey: "AIzaSyBVMldjskaps7wAg3JAuhlVHjqCvpRjKaE",
  authDomain: "flower-shop-caa2e.firebaseapp.com",
  projectId: "flower-shop-caa2e",
  storageBucket: "flower-shop-caa2e.appspot.com",
  messagingSenderId: "945577682273",
});

export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
export default app;
