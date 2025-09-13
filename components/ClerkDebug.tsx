'use client';

import { useAuth, useClerk } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function ClerkDebug() {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const clerk = useClerk();
  const [clerkLoaded, setClerkLoaded] = useState(false);

  useEffect(() => {
    if (clerk) {
      setClerkLoaded(true);
    }
  }, [clerk]);

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <div className="font-bold mb-2">Clerk Debug Info</div>
      <div>Clerk Loaded: {clerkLoaded ? '✅' : '❌'}</div>
      <div>Auth Loaded: {isLoaded ? '✅' : '❌'}</div>
      <div>User ID: {userId || 'None'}</div>
      <div>Signed In: {isSignedIn ? '✅' : '❌'}</div>
      <div>Publishable Key: {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? '✅' : '❌'}</div>
      <div>Domain: {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes('pk_live_') ? 'Production' : 'Development'}</div>
    </div>
  );
}
