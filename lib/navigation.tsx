import { BookOpen, Home, Trophy, BarChart3, User, PlusCircle, Settings, LogOut, LogIn, UserPlus } from 'lucide-react';
import React from 'react';

export interface NavigationItem {
  label: string;
  href: string;
  ariaLabel: string;
  rotation: number;
  hoverStyles: {
    bgColor: string;
    textColor: string;
  };
  icon?: React.ReactNode;
  requiresAuth?: boolean;
  requiresQuizMaster?: boolean;
}

// Main navigation items for all users
export const mainNavigationItems: NavigationItem[] = [
  {
    label: 'Home',
    href: '/',
    ariaLabel: 'Go to Home page',
    rotation: -8,
    hoverStyles: { bgColor: 'rgba(139, 92, 246, 0.8)', textColor: '#ffffff' },
    icon: <Home className="w-6 h-6" />
  },
  {
    label: 'Quizzes',
    href: '/quizzes',
    ariaLabel: 'Browse available quizzes',
    rotation: -8,
    hoverStyles: { bgColor: 'rgba(16, 185, 129, 0.8)', textColor: '#ffffff' },
    icon: <BookOpen className="w-6 h-6" />
  },
  {
    label: 'Leaderboard',
    href: '/leaderboard',
    ariaLabel: 'View quiz leaderboard',
    rotation: 8,
    hoverStyles: { bgColor: 'rgba(245, 158, 11, 0.8)', textColor: '#ffffff' },
    icon: <Trophy className="w-6 h-6" />
  },
  {
    label: 'Results',
    href: '/results',
    ariaLabel: 'View your quiz results',
    rotation: -8,
    hoverStyles: { bgColor: 'rgba(239, 68, 68, 0.8)', textColor: '#ffffff' },
    icon: <BarChart3 className="w-6 h-6" />
  },
  {
    label: 'Profile',
    href: '/profile',
    ariaLabel: 'View your profile',
    rotation: -8,
    hoverStyles: { bgColor: 'rgba(139, 92, 246, 0.8)', textColor: '#ffffff' },
    icon: <User className="w-6 h-6" />,
    requiresAuth: true
  }
];

// Quiz Master specific navigation items
export const quizMasterNavigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard/quizzes',
    ariaLabel: 'Quiz Master Dashboard',
    rotation: -8,
    hoverStyles: { bgColor: 'rgba(139, 92, 246, 0.8)', textColor: '#ffffff' },
    icon: <Settings className="w-6 h-6" />,
    requiresAuth: true,
    requiresQuizMaster: true
  },
  {
    label: 'Create Quiz',
    href: '/dashboard/create-quiz',
    ariaLabel: 'Create a new quiz',
    rotation: 8,
    hoverStyles: { bgColor: 'rgba(16, 185, 129, 0.8)', textColor: '#ffffff' },
    icon: <PlusCircle className="w-6 h-6" />,
    requiresAuth: true,
    requiresQuizMaster: true
  },
  {
    label: 'Import/Export',
    href: '/dashboard/import-export',
    ariaLabel: 'Import or export quizzes',
    rotation: 8,
    hoverStyles: { bgColor: 'rgba(245, 158, 11, 0.8)', textColor: '#ffffff' },
    icon: <Settings className="w-6 h-6" />,
    requiresAuth: true,
    requiresQuizMaster: true
  }
];

// Authentication navigation items
export const authNavigationItems: NavigationItem[] = [
  {
    label: 'Sign In',
    href: '/sign-in',
    ariaLabel: 'Sign in to your account',
    rotation: -8,
    hoverStyles: { bgColor: 'rgba(139, 92, 246, 0.8)', textColor: '#ffffff' },
    icon: <LogIn className="w-6 h-6" />
  },
  {
    label: 'Sign Up',
    href: '/sign-up',
    ariaLabel: 'Create a new account',
    rotation: 8,
    hoverStyles: { bgColor: 'rgba(16, 185, 129, 0.8)', textColor: '#ffffff' },
    icon: <UserPlus className="w-6 h-6" />
  }
];

// Upgrade navigation item
export const upgradeNavigationItem: NavigationItem = {
  label: 'Upgrade',
  href: '/upgrade',
  ariaLabel: 'Upgrade to Quiz Master',
  rotation: 8,
  hoverStyles: { bgColor: 'rgba(245, 158, 11, 0.8)', textColor: '#ffffff' },
  icon: <Trophy className="w-6 h-6" />,
  requiresAuth: true
};

// Logout navigation item
export const logoutNavigationItem: NavigationItem = {
  label: 'Logout',
  href: '/api/auth/logout',
  ariaLabel: 'Sign out of your account',
  rotation: -8,
  hoverStyles: { bgColor: 'rgba(239, 68, 68, 0.8)', textColor: '#ffffff' },
  icon: <LogOut className="w-6 h-6" />,
  requiresAuth: true
};

// Helper function to get navigation items based on user state
export function getNavigationItems(
  isAuthenticated: boolean,
  userRole?: string
): NavigationItem[] {
  let items = [...mainNavigationItems];

  if (!isAuthenticated) {
    // Show auth items for non-authenticated users
    items = [...items, ...authNavigationItems];
  } else {
    // Add quiz master items if user is a quiz master
    if (userRole === 'quiz-master') {
      items = [...items, ...quizMasterNavigationItems];
    } else if (userRole === 'general') {
      // Add upgrade option for general users
      items = [...items, upgradeNavigationItem];
    }
    
    // Add logout option for all authenticated users
    items = [...items, logoutNavigationItem];
  }

  return items;
}

// BubbleMenu configuration
export const getBubbleMenuConfig = (username?: string) => ({
  logo: username ? (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      <span className="text-white font-medium text-sm truncate max-w-20">
        {username}
      </span>
    </div>
  ) : (
    <div className="flex items-center space-x-2">
      <span className="text-white font-bold text-sm">QP</span>
    </div>
  ),
  menuAriaLabel: 'Toggle navigation',
  menuBg: 'rgba(255, 255, 255, 0.1)',
  menuContentColor: '#ffffff',
  useFixedPosition: false,
  animationEase: 'back.out(1.5)',
  animationDuration: 0.5,
  staggerDelay: 0.12
});
