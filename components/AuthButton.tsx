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
      <div className="flex items-center space-x-2 mobile:space-x-3">
        <Button variant="outline" asChild size="sm" className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400 transition-all duration-300 hidden mobile:inline-flex">
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button asChild size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mobile:text-base text-sm px-3 mobile:px-4">
          <Link href="/sign-up">
            <span className="mobile:hidden">Join</span>
            <span className="hidden mobile:inline">Sign Up</span>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 mobile:space-x-3">
      <div className="flex items-center space-x-2 mobile:space-x-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-full px-2 mobile:px-4 py-1 mobile:py-2 border border-purple-400/30">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-purple-200 font-medium text-sm mobile:text-base truncate max-w-20 mobile:max-w-none">
          {user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0]}
        </span>
      </div>
      <Button variant="outline" asChild size="sm" className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400 transition-all duration-300 hidden sm:inline-flex">
        <Link href="/profile">
          <User className="h-4 w-4 mr-2" />
          Profile
        </Link>
      </Button>
      <Button variant="outline" asChild size="sm" className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400 transition-all duration-300 sm:hidden">
        <Link href="/profile">
          <User className="h-4 w-4" />
        </Link>
      </Button>
      <Button 
        variant="outline"
        size="sm"
        onClick={() => signOut()}
        className="border-red-400/50 text-red-200 hover:bg-red-600/20 hover:border-red-400 transition-all duration-300"
      >
        <LogOut className="h-4 w-4 hidden mobile:inline mobile:mr-2" />
        <span className="hidden mobile:inline">Sign Out</span>
        <LogOut className="h-4 w-4 mobile:hidden" />
      </Button>
    </div>
  );
}
