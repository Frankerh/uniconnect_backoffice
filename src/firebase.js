import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Importa otras funciones según sea necesario

const firebaseConfig = {
  apiKey: "AIzaSyCKHJCte-sBxmNUoocZEdQh7G0zGnNgrlg",
  authDomain: "inacappluss.firebaseapp.com",
  databaseURL: "https://inacappluss-default-rtdb.firebaseio.com",
  projectId: "inacappluss",
  storageBucket: "inacappluss.appspot.com",
  messagingSenderId: "182896263920",
  appId: "1:182896263920:web:d60c6e3b81932d6ee8b835",
  measurementId: "G-8E94W04QKX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
