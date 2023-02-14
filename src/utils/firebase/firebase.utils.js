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
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
} from "firebase/firestore";

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

/**
 * Utility function to upload shop data to firebase store from local json file.
 * @param {string} collectionKey name of collection
 * @param {object} objectsToAdd documents in the format { title: string, products: array }
 */
export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());
    batch.set(docRef, object);
  });

  await batch.commit();
  console.log("done");
};

export const getCategoriesAndDocuments = async () => {
  try {
    const collectionRef = collection(db, "categories");
    const q = query(collectionRef);

    const querySnapshot = await getDocs(q);
    const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
      const { title, items } = docSnapshot.data();
      acc[title.toLowerCase()] = items;
      return acc;
    }, {});

    return categoryMap;
  } catch (err) {
    console.error(err);
  }
};

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
