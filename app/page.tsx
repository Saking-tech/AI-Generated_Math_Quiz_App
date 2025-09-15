"use client";

import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, BookOpen, Users, Trophy, TrendingUp, ArrowRight, User } from "lucide-react";
import dynamic from "next/dynamic";
import GlassSurface from "@/components/GlassSurface";
import Navigation from "@/components/Navigation";

// Lazy load heavy components
const TextType = dynamic(() => import("@/components/TextType"), {
  loading: () => <div className="h-8 w-64 bg-gray-700 rounded animate-pulse" />,
  ssr: false
});

export default function Home() {
  const { user: currentUser } = useAuth();


  if (currentUser === undefined) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen relative overflow-hidden">

        <div className="container mx-auto mobile-padding tablet-padding desktop-padding py-8 mobile:py-12 sm:py-16 relative z-10">
          <div className="text-center">
            <div className="animate-fade-in-up text-mobile-hero font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4 mobile:mb-6 animate-pulse">
              <TextType
                text={["Quiz Platform", "Create Amazing Quizzes", "Test Your Knowledge"]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
              />
              <div className="h-1 w-24 mobile:w-32 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full mb-6 mobile:mb-8"></div>
            </div>
            <p className="text-mobile-body text-gray-200 mb-6 mobile:mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200 px-4">
              Create engaging quizzes or test your knowledge with our comprehensive quiz platform.
              <span className="block mt-2 text-purple-300 font-semibold">Join thousands of learners and educators worldwide.</span>
            </p>
            <div className="flex flex-col mobile:flex-row mobile:justify-center mobile:space-x-4 space-y-3 mobile:space-y-0 px-4 animate-fade-in-up animation-delay-400">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold btn-responsive rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full mobile:w-auto">
                <Link href="/sign-in">🚀 Get Started</Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="border-2 border-purple-400 text-purple-200 hover:bg-purple-400 hover:text-white font-bold btn-responsive rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full mobile:w-auto">
                <Link href="/sign-up">✨ Sign Up</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mobile:gap-8 mt-12 mobile:mt-16 px-4 animate-fade-in-up animation-delay-600">
            <Card className="bg-purple-200 backdrop-blur-lg border border-purple-300/50 hover:border-purple-400/60 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full w-20 h-20 flex items-center justify-center group-hover:animate-bounce">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">Create Quizzes</CardTitle>
                <CardDescription className="text-gray-700">
                  Design interactive quizzes with multiple question types including MCQs and short answers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-purple-200 backdrop-blur-lg border border-purple-300/50 hover:border-purple-400/60 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full w-20 h-20 flex items-center justify-center group-hover:animate-bounce">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">Engage Students</CardTitle>
                <CardDescription className="text-gray-700">
                  Share your quizzes with students and track their progress in real-time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-purple-200 backdrop-blur-lg border border-purple-300/50 hover:border-purple-400/60 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full w-20 h-20 flex items-center justify-center group-hover:animate-bounce">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">Track Performance</CardTitle>
                <CardDescription className="text-gray-700">
                  Monitor quiz results and analyze performance with detailed analytics.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Navigation */}
      <Navigation />

      <div className="container mx-auto mobile-padding tablet-padding desktop-padding py-6 mobile:py-8 relative z-10">
        <div className="mb-6 mobile:mb-8 text-center animate-fade-in-up">
          <GlassSurface
            width="100%"
            height={65}
            borderRadius={50}
            saturation={1}
            displace={0.5}
            blur={11}
            backgroundOpacity={0.33}
            distortionScale={-190}
            redOffset={5}
            greenOffset={15}
            blueOffset={20}
            brightness={50}
            opacity={0.9}
            mixBlendMode="screen"
          >
            <h2 className="text-mobile-title mobile:text-3xl lg:text-4xl font-bold mb-4">
              <TextType
              text={["Your Learning Hub", "Create Amazing Quizzes", "Test Your Knowledge", "Track Your Progress"]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              textColors={["#60a5fa", "#a78bfa", "#f472b6", "#34d399"]}
              loop={true}/>
            </h2>
          </GlassSurface>
          {/* <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mobile:gap-6 lg:gap-8 animate-fade-in-up animation-delay-200">
          {/* Quiz Master Section */}
          {currentUser?.role === "quiz-master" && (
            <Card className="group bg-purple-200 backdrop-blur-xl border border-purple-300/50 hover:border-purple-400/60 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
              <CardHeader className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardTitle className="flex items-center relative z-10 bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg mr-3 group-hover:animate-bounce">
                    <PlusCircle className="h-5 w-5 text-white" />
                  </div>
                  Quiz Master Dashboard
                </CardTitle>
                <CardDescription className="text-gray-700 relative z-10">
                  Create and manage your quizzes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 mobile:space-y-4 relative z-10">
                <Button asChild className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 btn-responsive">
                  <Link href="/dashboard/quizzes">🎯 My Quizzes</Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-indigo-400/50 text-indigo-200 hover:bg-indigo-600/20 hover:border-indigo-400 rounded-xl transition-all duration-300 btn-responsive">
                  <Link href="/dashboard/create-quiz">✨ Create New Quiz</Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-indigo-400/50 text-indigo-200 hover:bg-indigo-600/20 hover:border-indigo-400 rounded-xl transition-all duration-300 btn-responsive">
                  <Link href="/dashboard/import-export">📊 Import/Export</Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-indigo-400/50 text-indigo-200 hover:bg-indigo-600/20 hover:border-indigo-400 rounded-xl transition-all duration-300 btn-responsive">
                  <Link href="/dashboard/leaderboard">📈 Quiz Leaderboard</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Available Quizzes Section */}
          <Card className="group bg-purple-200 backdrop-blur-xl border border-purple-300/50 hover:border-purple-400/60 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
            <CardHeader className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardTitle className="flex items-center relative z-10 bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg mr-3 group-hover:animate-bounce">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                Available Quizzes
              </CardTitle>
              <CardDescription className="text-gray-700 relative z-10">
                Take quizzes and test your knowledge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 mobile:space-y-4 relative z-10">
              <Button asChild className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 btn-responsive">
                <Link href="/quizzes">
                  <BookOpen className="h-4 w-4 mr-2" />
                  🧠 Browse Quizzes
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-emerald-400/50 text-emerald-200 hover:bg-emerald-600/20 hover:border-emerald-400 rounded-xl transition-all duration-300 btn-responsive">
                <Link href="/leaderboard">
                  <Trophy className="h-4 w-4 mr-2" />
                  🏆 View Leaderboard
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Leaderboard Section */}
          <Card className="group bg-purple-200 backdrop-blur-xl border border-purple-300/50 hover:border-purple-400/60 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
            <CardHeader className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardTitle className="flex items-center relative z-10 bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg mr-3 group-hover:animate-bounce">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                Leaderboard
              </CardTitle>
              <CardDescription className="text-gray-700 relative z-10">
                See how you rank against other quiz takers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 mobile:space-y-4 relative z-10">
              <Button asChild className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 btn-responsive">
                <Link href="/leaderboard">
                  <Trophy className="h-4 w-4 mr-2" />
                  🏆 View Leaderboard
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-orange-400/50 text-orange-200 hover:bg-orange-600/20 hover:border-orange-400 rounded-xl transition-all duration-300 btn-responsive">
                <Link href="/results">
                  <Trophy className="h-4 w-4 mr-2" />
                  📊 My Results
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* My Results Section */}
          <Card className="group bg-purple-200 backdrop-blur-xl border border-purple-300/50 hover:border-purple-400/60 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
            <CardHeader className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardTitle className="flex items-center relative z-10 bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg mr-3 group-hover:animate-bounce">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                My Results
              </CardTitle>
              <CardDescription className="text-gray-700 relative z-10">
                View your quiz attempts and scores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 mobile:space-y-4 relative z-10">
              <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 btn-responsive">
                <Link href="/results">
                  <Trophy className="h-4 w-4 mr-2" />
                  📊 View Results
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-blue-400/50 text-blue-200 hover:bg-blue-600/20 hover:border-blue-400 rounded-xl transition-all duration-300 btn-responsive">
                <Link href="/profile">
                  <Users className="h-4 w-4 mr-2" />
                  👤 My Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Role Management */}
          {currentUser?.role === "general" && (
            <Card className="group bg-purple-200 backdrop-blur-xl border border-purple-300/50 hover:border-purple-400/60 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
              <CardHeader className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-rose-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardTitle className="flex items-center relative z-10 bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg mr-3 group-hover:animate-bounce">
                    <PlusCircle className="h-5 w-5 text-white" />
                  </div>
                  Become a Quiz Master
                </CardTitle>
                <CardDescription className="text-gray-700 relative z-10">
                  Upgrade to create your own quizzes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 mobile:space-y-4 relative z-10">
                <Button asChild className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 btn-responsive">
                  <Link href="/upgrade">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    🚀 Request Upgrade
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-pink-400/50 text-pink-200 hover:bg-pink-600/20 hover:border-pink-400 rounded-xl transition-all duration-300 btn-responsive">
                  <Link href="/profile">
                    <User className="h-4 w-4 mr-2" />
                    👤 My Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
