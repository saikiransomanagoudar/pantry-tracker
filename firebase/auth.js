import { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { auth } from "./firebase_api";

const AuthUserContext = createContext({
  authUser: null,
  isLoading: true,
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuth = () => {
    setAuthUser(null);
    setIsLoading(false);
  };

  const authStateChange = async (user) => {
    // setIsLoading(true);
    // if (!user) {
    //   clearAuth();
    // }
    // setAuthUser({
    //   uid: user.uid,
    //   email: user.email,
    //   name: user.displayName,
    // });
    // setIsLoading(false);
    setIsLoading(true);
    if (user) {
      setAuthUser({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
      });
    } else {
      clearAuth(); // Ensures that authUser is null and isLoading is false when no user is logged in
    }
    setIsLoading(false);
  };

  //   const signOut = () => {
  //     authSignOut(auth).then(() => clearAuth());
  //   };
  const signOut = () => {
    authSignOut(auth)
      .catch((error) => {
        console.error("Sign out error:", error);
        // Optionally, handle errors in UI, e.g., show a message
      })
      .then(() => clearAuth());
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChange);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    isLoading,
    setAuthUser,
    signOut,
  };
}

export const AuthUserProvider = ({ children }) => {
  //   const auth = useFirebaseAuth();
  //   return (
  //     <AuthUserContext.Provider value={{ auth }}>
  //       {children}
  //     </AuthUserContext.Provider>
  //   );
  const { authUser, isLoading, signOut, setAuthUser } = useFirebaseAuth();
  return (
    <AuthUserContext.Provider
      value={{ authUser, isLoading, signOut, setAuthUser }}
    >
      {children}
    </AuthUserContext.Provider>
  );
};

export const useAuth = () => useContext(AuthUserContext);
