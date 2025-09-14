"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useAuth } from "../contexts/AuthContext";
import BubbleMenu from "./BubbleMenu";
import { getNavigationItems, getBubbleMenuConfig } from "../lib/navigation";
import { usePathname, useRouter } from "next/navigation";

export default function ResponsiveBubbleMenu() {
  const { signOut } = useAuthActions();
  const pathname = usePathname();
  const router = useRouter();
  
  const { user: currentUser } = useAuth();

  // Don't show on auth pages
  if (pathname?.includes('/sign-in') || pathname?.includes('/sign-up')) {
    return null;
  }

  // Don't show while loading
  if (currentUser === undefined) {
    return null;
  }

  // Get username for display
  const username = currentUser?.name?.split(' ')[0] || currentUser?.email?.split('@')[0] || 'User';

  // Get navigation items based on user state
  const navigationItems = getNavigationItems(
    !!currentUser,
    currentUser?.role
  );

  // Filter out items that don't match current user state and handle logout
  const filteredItems = navigationItems.filter(item => {
    if (item.requiresAuth && !currentUser) return false;
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
  );
}
