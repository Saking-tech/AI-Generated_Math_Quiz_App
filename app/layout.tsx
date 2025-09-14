import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ConvexClientProvider } from './convex-provider'
import { AuthProvider } from '../contexts/AuthContext'
import dynamic from 'next/dynamic'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import ClerkDebug from '@/components/ClerkDebug'

// Lazy load heavy components
const SimpleBackground = dynamic(() => import('@/components/SimpleBackground'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-10 bg-gray-900" />
})

const ResponsiveBubbleMenu = dynamic(() => import('@/components/ResponsiveBubbleMenu'), {
  ssr: false,
  loading: () => null
})

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Quiz Platform',
  description: 'A comprehensive quiz platform for creating and taking quizzes',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Ensure we have the publishable key
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    console.error('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set');
  }

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard/quizzes"
      afterSignUpUrl="/dashboard/quizzes"
      domain="clerk.com"
      appearance={{
        baseTheme: undefined,
        elements: {
          rootBox: "clerk-root-box",
          card: "clerk-card",
        },
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <ConvexClientProvider>
            <AuthProvider>
              {/* Performance Monitoring */}
              <PerformanceMonitor />
              {/* Background */}
              <SimpleBackground />
              {/* BubbleMenu Navigation */}
              <ResponsiveBubbleMenu />
              {/* Content */}
              <div className="relative z-10">
                {children}
              </div>
              {/* Debug Component - Only in development */}
              <ClerkDebug />
            </AuthProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
