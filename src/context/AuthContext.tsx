import { auth } from "@/firebase/clientApp";
import { User, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<User | null>(null);

const AuthContextProvider = ({ children }: { children: JSX.Element }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const cleanup = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => {
      cleanup();
    };
  }, []); // Adding an empty dependency array to ensure that the effect only runs once on mount

  // If the data is still loading, return an empty fragment
  if (loading) {
    return <></>;
  }

  // Provide the current user to the context
  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
