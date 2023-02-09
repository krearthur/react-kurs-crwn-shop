import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCaqRsi0IAB_7Ozg-twZH5EZ6vVk_9zv9U",
  authDomain: "course-crwn-db.firebaseapp.com",
  projectId: "course-crwn-db",
  storageBucket: "course-crwn-db.appspot.com",
  messagingSenderId: "182197503098",
  appId: "1:182197503098:web:d51a402b3ec19081b927c3",
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const authInstance = getAuth();

export const signInWithGooglePopup = () =>
  signInWithPopup(authInstance, googleProvider);

export const db = getFirestore();

export const createOrGetUserDocumentFromAuth = async (
  userAuth,
  additionalInfo = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInfo,
      });
    } catch (error) {
      console.error("error creating the user", error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(authInstance, email, password);
};

export const signInWithCredentials = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(authInstance, email, password);
};

export const signOutUser = () => signOut(authInstance);

export const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(authInstance, callback);
};
