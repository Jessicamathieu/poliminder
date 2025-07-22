
"use client";

import { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { User as FirebaseAuthUser, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { User } from "@/lib/types";
import { auth as firebaseAuth } from "@/lib/firebase";
import { getUserData, loginWithEmailAndPassword, logout as serverLogout } from "@/lib/auth-actions";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseAuthUser | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const handleAuthStateChanged = useCallback(async (fbUser: FirebaseAuthUser | null) => {
    setLoading(true);
    setFirebaseUser(fbUser);
    if (fbUser) {
        try {
            const userData = await getUserData(fbUser.uid);
            setUser(userData); // userData peut être null si la db est indisponible
        } catch (error) {
            console.error("Error fetching user data on auth state change:", error);
            setUser(null); // Force la déconnexion de l'état local en cas d'erreur db
            await firebaseSignOut(firebaseAuth);
        }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, handleAuthStateChanged);
    return () => unsubscribe();
  }, [handleAuthStateChanged]);

  const loginWithEmail = async (email: string, pass: string) => {
    const userCredential = await loginWithEmailAndPassword(email, pass);
    // onAuthStateChanged va gérer la mise à jour de l'état
  };

  const logout = async () => {
    await firebaseSignOut(firebaseAuth); // Déclenche onAuthStateChanged qui mettra user à null
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, loginWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
