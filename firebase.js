import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "workstation-reservation.firebaseapp.com",
  projectId: "workstation-reservation",
  storageBucket: "workstation-reservation.appspot.com",
  messagingSenderId: "194590611780",
  appId: "1:194590611780:web:95ae8e420a32a418ac5f11",
  measurementId: "G-DR6X562PEP",
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
