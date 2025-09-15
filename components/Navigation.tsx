"use client";

import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Home, Trophy, User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const { user: currentUser, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  if (!currentUser) {
    return (
      <nav className="bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Quiz Platform
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Quiz Platform
            </span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Button asChild variant="ghost" size="sm" className="text-purple-200 hover:text-white hover:bg-purple-600/20">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            
            <Button asChild variant="ghost" size="sm" className="text-purple-200 hover:text-white hover:bg-purple-600/20">
              <Link href="/quizzes">
                <BookOpen className="h-4 w-4 mr-2" />
                Quizzes
              </Link>
            </Button>
            
            <Button asChild variant="ghost" size="sm" className="text-purple-200 hover:text-white hover:bg-purple-600/20">
              <Link href="/leaderboard">
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </Link>
            </Button>
            
            <Button asChild variant="ghost" size="sm" className="text-purple-200 hover:text-white hover:bg-purple-600/20">
              <Link href="/results">
                <Trophy className="h-4 w-4 mr-2" />
                My Results
              </Link>
            </Button>
            
            {currentUser.role === "quiz-master" && (
              <Button asChild variant="ghost" size="sm" className="text-purple-200 hover:text-white hover:bg-purple-600/20">
                <Link href="/dashboard/quizzes">
                  <Settings className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            )}
            
            <Button asChild variant="ghost" size="sm" className="text-purple-200 hover:text-white hover:bg-purple-600/20">
              <Link href="/profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="text-purple-200 hover:text-white hover:bg-red-600/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
