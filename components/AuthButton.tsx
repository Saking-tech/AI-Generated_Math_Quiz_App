"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import Link from "next/link";

export default function AuthButton() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-600 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-3">
        <Button variant="outline" asChild className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400 transition-all duration-300">
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-full px-4 py-2 border border-purple-400/30">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-purple-200 font-medium">
          {user.firstName || user.emailAddresses[0]?.emailAddress}
        </span>
      </div>
      <Button variant="outline" asChild className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400 transition-all duration-300">
        <Link href="/profile">
          <User className="h-4 w-4 mr-2" />
          Profile
        </Link>
      </Button>
      <Button 
        variant="outline" 
        onClick={() => signOut()}
        className="border-red-400/50 text-red-200 hover:bg-red-600/20 hover:border-red-400 transition-all duration-300"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
