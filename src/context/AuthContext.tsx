import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { UserProfile } from "../types";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, phone?: string) => Promise<void>;
  statusMessage: { text: string; type: "success" | "error" | "" };
  setStatus: (text: string, type: "success" | "error" | "") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" | "" }>({ text: "", type: "" });

  const setStatus = (text: string, type: "success" | "error" | "") => {
    setStatusMessage({ text, type });
    if (text) {
      setTimeout(() => {
        setStatusMessage({ text: "", type: "" });
      }, 5000);
    }
  };

  const isAdminEmail = (email: string | null) => {
    if (!email) return false;
    const adminEmails = ["shrutiassignmenthelpers@gmail.com", "abhinandanjain.cse27@jecrc.ac.in"];
    return adminEmails.includes(email.toLowerCase());
  };

  const fetchProfile = async (firebaseUser: User) => {
    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserProfile(userSnap.data() as UserProfile);
      } else {
        // Create initial profile if missing
        const isDefaultAdmin = isAdminEmail(firebaseUser.email);
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "Sovereign Academic Student",
          role: isDefaultAdmin ? "admin" : "student",
          phone: firebaseUser.phoneNumber || "",
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (e) {
      console.error("Error retrieving user profile on Firestore: ", e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile(firebaseUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Use popup for compatibility with typical sandbox/iframe integrations
      const response = await signInWithPopup(auth, provider);
      if (response.user) {
        await fetchProfile(response.user);
        setStatus("Signed in successfully with Google!", "success");
      }
    } catch (error: any) {
      console.error("Google sign-in blocked or failed:", error);
      setStatus(error?.message || "Google sign-in failed. Please try again.", "error");
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      setStatus("Successfully signed in!", "success");
    } catch (error: any) {
      console.error("Email login failed:", error);
      setStatus("Invalid credentials. Please verify your email and password.", "error");
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, phone?: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName: name });
      
      const isDefaultAdmin = isAdminEmail(email);
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email: email,
        displayName: name,
        phone: phone || "",
        role: isDefaultAdmin ? "admin" : "student",
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, "users", cred.user.uid), newProfile);
      setUserProfile(newProfile);
      setStatus("Account registered successfully!", "success");
    } catch (error: any) {
      console.error("Account registration failed:", error);
      setStatus(error?.message || "Registration failed. Try using a stronger password.", "error");
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setStatus("Successfully signed out.", "success");
    } catch (error: any) {
      console.error("Sign out fail:", error);
      setStatus("Error signing out. Try again.", "error");
    }
  };

  const isAdmin = userProfile?.role === "admin" || isAdminEmail(user?.email || null);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAdmin,
        signInWithGoogle,
        signOutUser,
        loginWithEmail,
        signUpWithEmail,
        statusMessage,
        setStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be called inside an AuthProvider");
  }
  return context;
};
