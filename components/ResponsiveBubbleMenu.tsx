"use client";

import { useAuth } from "../contexts/AuthContext";
import { useUser } from "@clerk/nextjs";
import BubbleMenu from "./BubbleMenu";
import { ClerkAuth } from "./ClerkAuth";
import { getNavigationItems, getBubbleMenuConfig } from "../lib/navigation";
import { usePathname, useRouter } from "next/navigation";

export default function ResponsiveBubbleMenu() {
  const pathname = usePathname();
  const router = useRouter();
  
  const { user: currentUser, signOut } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();

  // Don't show on auth pages
  if (pathname?.includes('/sign-in') || pathname?.includes('/sign-up')) {
    return null;
  }

  // Don't show while loading
  if (currentUser === undefined || !clerkLoaded) {
    return null;
  }

  // Use Clerk user for authentication state
  const isAuthenticated = !!clerkUser;
  const username = clerkUser?.firstName || clerkUser?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User';

  // Get navigation items based on user state
  const navigationItems = getNavigationItems(
    isAuthenticated,
    currentUser?.role
  );

  // Filter out items that don't match current user state and handle logout
  const filteredItems = navigationItems.filter(item => {
    if (item.requiresAuth && !isAuthenticated) return false;
    if (item.requiresQuizMaster && currentUser?.role !== 'quiz-master') return false;
    return true;
  }).map(item => {
    // Handle logout action
    if (item.label === 'Logout') {
      return {
        ...item,
        href: '#',
        onClick: async () => {
          await signOut();
          router.push('/');
        }
      };
    }
    return item;
  });

  const bubbleMenuConfig = getBubbleMenuConfig(username);

  return (
    <div className="fixed top-4 right-4 z-50 font-inter w-auto h-auto">
      <div className="flex items-center space-x-4">
        {/* Clerk Authentication */}
        <ClerkAuth />
        
        {/* Bubble Menu */}
        <BubbleMenu
          logo={bubbleMenuConfig.logo}
          items={filteredItems}
          menuAriaLabel={bubbleMenuConfig.menuAriaLabel}
          menuBg={bubbleMenuConfig.menuBg}
          menuContentColor={bubbleMenuConfig.menuContentColor}
          useFixedPosition={false}
          animationEase={bubbleMenuConfig.animationEase}
          animationDuration={bubbleMenuConfig.animationDuration}
          staggerDelay={bubbleMenuConfig.staggerDelay}
          className=""
        />
      </div>
    </div>
  );
}
