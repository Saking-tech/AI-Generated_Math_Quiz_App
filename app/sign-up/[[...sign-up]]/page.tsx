import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Sign up to start creating amazing quizzes</p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-gray-800 border border-purple-400/30 shadow-2xl",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-300",
              socialButtonsBlockButton: "bg-white/10 border border-purple-400/30 text-white hover:bg-purple-600/20",
              formButtonPrimary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
              footerActionLink: "text-purple-400 hover:text-purple-300",
              formFieldInput: "bg-white/10 border border-purple-400/30 text-white placeholder-gray-400 focus:border-purple-400",
              formFieldLabel: "text-gray-300",
              identityPreviewText: "text-gray-300",
              formResendCodeLink: "text-purple-400 hover:text-purple-300"
            }
          }}
        />
      </div>
    </div>
  );
}