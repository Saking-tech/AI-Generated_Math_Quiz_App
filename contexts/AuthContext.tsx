"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

interface User {
  _id: Id<"users">;
  _creationTime: number;
  username?: string;
  fullName?: string;
  email?: string;
  name?: string; // Legacy field
  role: "quiz-master" | "general";
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, role: "quiz-master" | "general") => Promise<void>;
  signOut: () => void;
  updateProfile: (fullName?: string, email?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signInMutation = useMutation(api.users.signIn);
  const signUpMutation = useMutation(api.users.signUp);
  const updateProfileMutation = useMutation(api.users.updateUserProfile);

  // Check for existing user in localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("quiz_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("quiz_user");
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      const userData = await signInMutation({ username, password });
      setUser(userData);
      localStorage.setItem("quiz_user", JSON.stringify(userData));
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (username: string, password: string, role: "quiz-master" | "general") => {
    try {
      const userId = await signUpMutation({ username, password, role });
      // After successful signup, automatically sign in
      await signIn(username, password);
    } catch (error) {
      throw error;
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("quiz_user");
  };

  const updateProfile = async (fullName?: string, email?: string) => {
    if (!user) return;
    
    try {
      await updateProfileMutation({ 
        userId: user._id, 
        fullName, 
        email 
      });
      
      // Update local user state
      setUser(prev => prev ? { ...prev, fullName, email } : null);
      localStorage.setItem("quiz_user", JSON.stringify({ ...user, fullName, email }));
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
