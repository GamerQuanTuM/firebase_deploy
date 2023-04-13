import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBtm98F02RusC4qDLXRTWP2pVM5IEueDBU",
  authDomain: "fir-tutorial-d90a2.firebaseapp.com",
  projectId: "fir-tutorial-d90a2",
  storageBucket: "fir-tutorial-d90a2.appspot.com",
  messagingSenderId: "625211707853",
  appId: "1:625211707853:web:87967b4efd6555d7027484",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app)
