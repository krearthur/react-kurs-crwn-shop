import { createContext, useState, useEffect } from "react";
import {
  onAuthStateChangedListener,
  createOrGetUserDocumentFromAuth,
} from "../utils/firebase/firebase.utils";

/**
 * Stores the actual logged in user value we want to have access to
 */
export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
});

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const value = { currentUser, setCurrentUser };

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        console.log("user is logged in ", user.email);
        setCurrentUser(user);
        createOrGetUserDocumentFromAuth(user);
      } else {
        console.log("user is logged out");
        setCurrentUser(null);
      }
    });

    // the useEffect hook invokes the method that is returned from it,
    // WHEN THE COMPONENT UNMOUNTS!!
    return unsubscribe;
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
