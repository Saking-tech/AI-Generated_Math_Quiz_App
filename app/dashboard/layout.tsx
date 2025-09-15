"use client";

import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import GlassSurface from "@/components/GlassSurface";
import { BookOpen, Home, Settings, PlusCircle, BarChart3, FileText, Users, ArrowLeft } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (currentUser !== undefined && (!currentUser || currentUser.role !== "quiz-master")) {
      router.push("/");
    }
  }, [currentUser, router]);

  if (currentUser === undefined) {
    return (
      <div className="min-h-screen relative">
       {/* Loading Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <GlassSurface
            width="300px"
            height="200px"
            borderRadius={20}
            backgroundOpacity={0.1}
            opacity={0.9}
            blur={10}
            className="flex items-center justify-center"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <p className="text-white font-medium">Loading dashboard...</p>
            </div>
          </GlassSurface>
        </div>
      </div>
    );
  }

  if (!currentUser || (currentUser && currentUser.role !== "quiz-master")) {
    return (
      <div className="min-h-screen relative">
        {/* Access Denied Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <GlassSurface
            width="500px"
            height="300px"
            borderRadius={20}
            backgroundOpacity={0.1}
            opacity={0.9}
            blur={10}
            className="flex items-center justify-center p-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-full flex items-center justify-center border border-red-400/30">
                <Settings className="h-8 w-8 text-red-300" />
              </div>
              <h2 className="text-mobile-title font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
                Access Denied
              </h2>
              <p className="text-mobile-body text-gray-300 mb-6">
                You need to be a quiz master to access this area.
              </p>
              <Button 
                asChild
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
              >
                <Link href="/">
                  <Home className="h-5 w-5 mr-2" />
                  Go Home
                </Link>
              </Button>
            </div>
          </GlassSurface>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Dashboard Header - Matching Home Page Style */}
      <div className="relative z-10 bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl">
        <div className="container mx-auto mobile-padding tablet-padding desktop-padding py-4 mobile:py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 mobile:space-x-4">
              <div className="p-1.5 mobile:p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                <BookOpen className="h-6 w-6 mobile:h-8 mobile:w-8 text-white" />
              </div>
              <h1 className="text-mobile-title font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Quiz Master Dashboard
              </h1>
            </div>
            <Button asChild variant="outline" className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Sidebar */}
      <div className="relative z-10 bg-gradient-to-b from-purple-900/20 to-blue-900/20 backdrop-blur-xl border-b border-purple-500/20">
        <div className="container mx-auto mobile-padding tablet-padding desktop-padding py-4">
          <div className="flex flex-wrap gap-2 mobile:gap-4 justify-center">
            <Button asChild variant="ghost" className="text-purple-200 hover:text-white hover:bg-purple-600/20">
              <Link href="/dashboard/quizzes">
                <FileText className="h-4 w-4 mr-2" />
                My Quizzes
              </Link>
            </Button>
            <Button asChild variant="ghost" className="text-purple-200 hover:text-white hover:bg-purple-600/20">
              <Link href="/dashboard/create-quiz">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Quiz
              </Link>
            </Button>
            <Button asChild variant="ghost" className="text-purple-200 hover:text-white hover:bg-purple-600/20">
              <Link href="/dashboard/import-export">
                <Settings className="h-4 w-4 mr-2" />
                Import/Export
              </Link>
            </Button>
            <Button asChild variant="ghost" className="text-purple-200 hover:text-white hover:bg-purple-600/20">
              <Link href="/dashboard/leaderboard">
                <BarChart3 className="h-4 w-4 mr-2" />
                Quiz Leaderboard
              </Link>
            </Button>
            <Button asChild variant="ghost" className="text-purple-200 hover:text-white hover:bg-purple-600/20">
              <Link href="/quizzes">
                <BookOpen className="h-4 w-4 mr-2" />
                Browse Quizzes
              </Link>
            </Button>
            <Button asChild variant="ghost" className="text-purple-200 hover:text-white hover:bg-purple-600/20">
              <Link href="/leaderboard">
                <Users className="h-4 w-4 mr-2" />
                Global Leaderboard
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
