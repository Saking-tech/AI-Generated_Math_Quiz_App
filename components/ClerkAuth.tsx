'use client';

import { 
  SignInButton, 
  SignUpButton, 
  SignedIn, 
  SignedOut, 
  UserButton,
  useUser 
} from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, User } from 'lucide-react';

export function ClerkAuth() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
        <span className="text-gray-300">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <SignedOut>
        <SignInButton mode="modal">
          <Button 
            variant="outline" 
            className="bg-transparent border-purple-400/30 text-purple-300 hover:bg-purple-600/20 hover:text-white"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Sign Up
          </Button>
        </SignUpButton>
      </SignedOut>
      
      <SignedIn>
        <div className="flex items-center space-x-3">
          <div className="hidden sm:block text-sm text-gray-300">
            Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
          </div>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
                userButtonPopoverCard: "bg-gray-800 border border-purple-400/30",
                userButtonPopoverActionButton: "text-gray-300 hover:bg-purple-600/20",
                userButtonPopoverActionButtonText: "text-gray-300",
                userButtonPopoverFooter: "hidden"
              }
            }}
          />
        </div>
      </SignedIn>
    </div>
  );
}

export function ClerkUserInfo() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading user info...</div>;
  }

  if (!user) {
    return <div>Not signed in</div>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <User className="h-4 w-4 text-purple-400" />
        <span className="text-sm text-gray-300">
          {user.firstName} {user.lastName}
        </span>
      </div>
      <div className="text-xs text-gray-400">
        {user.emailAddresses[0]?.emailAddress}
      </div>
    </div>
  );
}
