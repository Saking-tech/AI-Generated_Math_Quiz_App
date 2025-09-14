"use client";

import BubbleMenu from './BubbleMenu';
import { getNavigationItems, getBubbleMenuConfig } from '../lib/navigation';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

// Example showing all possible navigation items for different user states
export default function BubbleMenuExample() {
  const { user: currentUser } = useAuth();

  // Example 1: For non-authenticated users
  const guestItems = getNavigationItems(false);
  
  // Example 2: For authenticated general users
  const generalUserItems = getNavigationItems(true, 'general');
  
  // Example 3: For authenticated quiz masters
  const quizMasterItems = getNavigationItems(true, 'quiz-master');

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">BubbleMenu Navigation Examples</h1>
      
      {/* Guest User Navigation */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Guest User Navigation</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto">
{`const guestItems = [
  {
    label: 'Home',
    href: '/',
    ariaLabel: 'Go to Home page',
    rotation: -8,
    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
  },
  {
    label: 'Quizzes',
    href: '/quizzes',
    ariaLabel: 'Browse available quizzes',
    rotation: 8,
    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
  },
  {
    label: 'Leaderboard',
    href: '/leaderboard',
    ariaLabel: 'View quiz leaderboard',
    rotation: 8,
    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
  },
  {
    label: 'Results',
    href: '/results',
    ariaLabel: 'View your quiz results',
    rotation: -8,
    hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' }
  },
  {
    label: 'Sign In',
    href: '/sign-in',
    ariaLabel: 'Sign in to your account',
    rotation: -8,
    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
  },
  {
    label: 'Sign Up',
    href: '/sign-up',
    ariaLabel: 'Create a new account',
    rotation: 8,
    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
  }
];`}
          </pre>
        </div>
        <BubbleMenu
          logo={getBubbleMenuConfig().logo}
          items={guestItems}
          menuAriaLabel="Toggle navigation"
          menuBg="#ffffff"
          menuContentColor="#111111"
          useFixedPosition={false}
          animationEase="back.out(1.5)"
          animationDuration={0.5}
          staggerDelay={0.12}
        />
      </div>

      {/* General User Navigation */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">General User Navigation</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto">
{`const generalUserItems = [
  {
    label: 'Home',
    href: '/',
    ariaLabel: 'Go to Home page',
    rotation: -8,
    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
  },
  {
    label: 'Quizzes',
    href: '/quizzes',
    ariaLabel: 'Browse available quizzes',
    rotation: 8,
    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
  },
  {
    label: 'Leaderboard',
    href: '/leaderboard',
    ariaLabel: 'View quiz leaderboard',
    rotation: 8,
    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
  },
  {
    label: 'Results',
    href: '/results',
    ariaLabel: 'View your quiz results',
    rotation: -8,
    hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' }
  },
  {
    label: 'Profile',
    href: '/profile',
    ariaLabel: 'View your profile',
    rotation: 8,
    hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }
  },
  {
    label: 'Upgrade',
    href: '/upgrade',
    ariaLabel: 'Upgrade to Quiz Master',
    rotation: 8,
    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
  }
];`}
          </pre>
        </div>
        <BubbleMenu
          logo={getBubbleMenuConfig().logo}
          items={generalUserItems}
          menuAriaLabel="Toggle navigation"
          menuBg="#ffffff"
          menuContentColor="#111111"
          useFixedPosition={false}
          animationEase="back.out(1.5)"
          animationDuration={0.5}
          staggerDelay={0.12}
        />
      </div>

      {/* Quiz Master Navigation */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quiz Master Navigation</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto">
{`const quizMasterItems = [
  {
    label: 'Home',
    href: '/',
    ariaLabel: 'Go to Home page',
    rotation: -8,
    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
  },
  {
    label: 'Quizzes',
    href: '/quizzes',
    ariaLabel: 'Browse available quizzes',
    rotation: 8,
    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
  },
  {
    label: 'Leaderboard',
    href: '/leaderboard',
    ariaLabel: 'View quiz leaderboard',
    rotation: 8,
    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
  },
  {
    label: 'Results',
    href: '/results',
    ariaLabel: 'View your quiz results',
    rotation: -8,
    hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' }
  },
  {
    label: 'Profile',
    href: '/profile',
    ariaLabel: 'View your profile',
    rotation: 8,
    hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }
  },
  {
    label: 'Dashboard',
    href: '/dashboard/quizzes',
    ariaLabel: 'Quiz Master Dashboard',
    rotation: -8,
    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
  },
  {
    label: 'Create Quiz',
    href: '/dashboard/create-quiz',
    ariaLabel: 'Create a new quiz',
    rotation: 8,
    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
  },
  {
    label: 'Import/Export',
    href: '/dashboard/import-export',
    ariaLabel: 'Import or export quizzes',
    rotation: 8,
    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
  }
];`}
          </pre>
        </div>
        <BubbleMenu
          logo={getBubbleMenuConfig().logo}
          items={quizMasterItems}
          menuAriaLabel="Toggle navigation"
          menuBg="#ffffff"
          menuContentColor="#111111"
          useFixedPosition={false}
          animationEase="back.out(1.5)"
          animationDuration={0.5}
          staggerDelay={0.12}
        />
      </div>

      {/* Current User Navigation */}
      {currentUser !== undefined && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Current User Navigation</h2>
          <p className="text-sm text-gray-600">
            User: {currentUser ? currentUser.email : 'Guest'} | 
            Role: {currentUser?.role || 'None'}
          </p>
          <BubbleMenu
            logo={getBubbleMenuConfig().logo}
            items={getNavigationItems(!!currentUser, currentUser?.role)}
            menuAriaLabel="Toggle navigation"
            menuBg="#ffffff"
            menuContentColor="#111111"
            useFixedPosition={false}
            animationEase="back.out(1.5)"
            animationDuration={0.5}
            staggerDelay={0.12}
          />
        </div>
      )}
    </div>
  );
}
