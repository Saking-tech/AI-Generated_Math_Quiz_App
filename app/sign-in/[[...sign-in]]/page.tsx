import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Sign In</h1>
            <Button variant="outline" asChild className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400 transition-all duration-300">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Sign In Form */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-8 shadow-2xl">
            <SignIn 
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
              signUpUrl="/sign-up"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
