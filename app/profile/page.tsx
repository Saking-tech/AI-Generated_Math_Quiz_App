"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { User, Crown, Trophy, BookOpen, ArrowLeft } from "lucide-react";
import GlareHover from "@/components/GlareHover";
import MagicBento from "@/components/MagicBento";

export default function ProfilePage() {
  const { user } = useUser();
  const userData = useQuery(api.users.getUserByClerkId, 
    user ? { clerkId: user.id } : "skip"
  );
  const attempts = useQuery(api.quizAttempts.getAttemptsByUser, 
    userData ? { userId: userData._id } : "skip"
  );
  const quizzes = useQuery(api.quizzes.getQuizzesByCreator, 
    userData && userData.role === "quiz-master" ? { creatorId: userData._id } : "skip"
  );

  if (!user || !userData) {
    return <div>Loading...</div>;
  }

  const completedAttempts = attempts?.filter(attempt => attempt.isCompleted) || [];
  const totalQuizzes = quizzes?.length || 0;
  const publishedQuizzes = quizzes?.filter(quiz => quiz.isPublished).length || 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                <User className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                My Profile
              </h1>
            </div>
            <Button variant="outline" asChild className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400 transition-all duration-300">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Info */}
          <MagicBento 
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={500}
            particleCount={12}
            glowColor="255, 0, 0"
          >
            <Card className="bg-purple-200 backdrop-blur-xl border border-purple-300/50">
              <CardHeader>
                <CardTitle className="flex items-center bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
            <CardContent>
              <GlareHover
                glareColor="#ffffff"
                glareOpacity={0.3}
                glareAngle={-30}
                glareSize={300}
                transitionDuration={800}
                playOnce={false}
                className="p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="text-lg text-gray-800">{userData.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-lg text-gray-800">{userData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Role</label>
                    <div className="flex items-center">
                      {userData.role === "quiz-master" && (
                        <Crown className="h-4 w-4 text-yellow-600 mr-2" />
                      )}
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        userData.role === "quiz-master" 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {userData.role === "quiz-master" ? "Quiz Master" : "General User"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Member Since</label>
                    <p className="text-lg text-gray-800">{formatDate(userData.createdAt)}</p>
                  </div>
                </div>
              </GlareHover>
            </CardContent>
          </Card>
          </MagicBento>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MagicBento 
              textAutoHide={true}
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              enableMagnetism={true}
              clickEffect={true}
              spotlightRadius={400}
              particleCount={12}
              glowColor="255, 0, 0"
            >
              <Card className="bg-purple-200 backdrop-blur-xl border border-purple-300/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">Quizzes Completed</CardTitle>
                  <Trophy className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">{completedAttempts.length}</div>
                </CardContent>
              </Card>
            </MagicBento>

            {userData.role === "quiz-master" && (
              <>
                <MagicBento 
                  textAutoHide={true}
                  enableStars={true}
                  enableSpotlight={true}
                  enableBorderGlow={true}
                  enableTilt={true}
                  enableMagnetism={true}
                  clickEffect={true}
                  spotlightRadius={300}
                  particleCount={12}
                  glowColor="132, 0, 255"
                >
                  <Card className="bg-purple-200 backdrop-blur-xl border border-purple-300/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">Quizzes Created</CardTitle>
                      <BookOpen className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-800">{totalQuizzes}</div>
                    </CardContent>
                  </Card>
                </MagicBento>

                <MagicBento 
                  textAutoHide={true}
                  enableStars={true}
                  enableSpotlight={true}
                  enableBorderGlow={true}
                  enableTilt={true}
                  enableMagnetism={true}
                  clickEffect={true}
                  spotlightRadius={300}
                  particleCount={12}
                  glowColor="132, 0, 255"
                >
                  <Card className="bg-purple-200 backdrop-blur-xl border border-purple-300/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">Published Quizzes</CardTitle>
                      <BookOpen className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-800">{publishedQuizzes}</div>
                    </CardContent>
                  </Card>
                </MagicBento>
              </>
            )}

            <MagicBento 
              textAutoHide={true}
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              enableMagnetism={true}
              clickEffect={true}
              spotlightRadius={300}
              particleCount={12}
              glowColor="132, 0, 255"
            >
              <Card className="bg-purple-200 backdrop-blur-xl border border-purple-300/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">Average Score</CardTitle>
                  <Trophy className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    {completedAttempts.length > 0 
                      ? Math.round(completedAttempts.reduce((sum, attempt) => {
                          const percentage = attempt.totalPoints > 0 
                            ? (attempt.score / attempt.totalPoints) * 100 
                            : 0;
                          return sum + percentage;
                        }, 0) / completedAttempts.length)
                      : 0}%
                  </div>
                </CardContent>
              </Card>
            </MagicBento>
          </div>

          {/* Quick Actions */}
          <MagicBento 
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={400}
            particleCount={12}
            glowColor="255, 0, 0"
          >
            <Card className="bg-purple-200 backdrop-blur-xl border border-purple-300/50">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button asChild className="w-full">
                    <Link href="/quizzes">Browse Quizzes</Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/results">View My Results</Link>
                  </Button>

                  {userData.role === "quiz-master" ? (
                    <>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/dashboard/quizzes">My Quizzes</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/dashboard/create-quiz">Create Quiz</Link>
                      </Button>
                    </>
                  ) : (
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/upgrade">Become Quiz Master</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </MagicBento>
        </div>
      </div>
    </div>
  );
}
