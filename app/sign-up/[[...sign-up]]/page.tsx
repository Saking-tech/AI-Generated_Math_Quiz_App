import { SignUp } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const [clerkError, setClerkError] = useState(false);

  useEffect(() => {
    // Check if Clerk is properly configured
    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      setClerkError(true);
    }

    // Listen for Clerk loading errors
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes('Clerk') || event.message.includes('clerk')) {
        setClerkError(true);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (clerkError) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="relative z-10 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Sign Up</h1>
              <Button variant="outline" asChild className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400 transition-all duration-300">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] relative z-10">
          <div className="w-full max-w-md">
            <div className="bg-gradient-to-br from-red-900/20 to-red-900/20 backdrop-blur-xl border border-red-400/30 rounded-2xl p-8 shadow-2xl">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-400 mb-4">Authentication Error</h2>
                <p className="text-red-200 mb-4">Clerk authentication is not loading properly.</p>
                <p className="text-sm text-red-300 mb-4">This might be due to:</p>
                <ul className="text-sm text-red-300 text-left space-y-1">
                  <li>• Missing environment variables</li>
                  <li>• SSL configuration issues</li>
                  <li>• Network connectivity problems</li>
                </ul>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-red-600 hover:bg-red-700"
                >
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Sign Up</h1>
            <Button variant="outline" asChild className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400 transition-all duration-300">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Sign Up Form */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-8 shadow-2xl">
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none border-none",
                  headerTitle: "text-white text-2xl font-bold",
                  headerSubtitle: "text-purple-200",
                  socialButtonsBlockButton: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-none",
                  formButtonPrimary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300",
                  formFieldInput: "bg-gray-800/50 border-purple-400/30 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl",
                  formFieldLabel: "text-purple-200 font-medium",
                  footerActionLink: "text-purple-300 hover:text-purple-200 transition-colors duration-300",
                  identityPreviewText: "text-purple-200",
                  formFieldSuccessText: "text-green-400",
                  formFieldErrorText: "text-red-400",
                  dividerLine: "bg-purple-400/30",
                  dividerText: "text-purple-200",
                },
              }}
              redirectUrl="/"
              signInUrl="/sign-in"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
