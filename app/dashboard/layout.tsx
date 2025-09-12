"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import GlassSurface from "@/components/GlassSurface";
import { BookOpen, Plus, Upload, Trophy, Home, Settings } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const userData = useQuery(api.users.getUserByClerkId, 
    user ? { clerkId: user.id } : "skip"
  );

  useEffect(() => {
    if (isLoaded && userData && userData.role !== "quiz-master") {
      router.push("/");
    }
  }, [userData, isLoaded, router]);

  if (!isLoaded) {
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

  if (!user || (userData && userData.role !== "quiz-master")) {
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
          <div className="flex justify-center items-center">
            <div className="flex items-center space-x-2 mobile:space-x-4">
              <div className="p-1.5 mobile:p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                <BookOpen className="h-6 w-6 mobile:h-8 mobile:w-8 text-white" />
              </div>
              <h1 className="text-mobile-title font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Quiz Master Dashboard
              </h1>
            </div>
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
