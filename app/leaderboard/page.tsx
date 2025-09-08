"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Leaderboard } from "@/components/quiz/Leaderboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Trophy, TrendingUp, Users, Target, Award, Home } from "lucide-react";

export default function PublicLeaderboardPage() {
  const { user } = useUser();
  const userData = useQuery(api.users.getUserByClerkId, 
    user ? { clerkId: user.id } : "skip"
  );
  
  const userStats = useQuery(
    api.quizAttempts.getUserStats,
    userData ? { userId: userData._id } : "skip"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl animate-glow">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Leaderboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-full px-4 py-2 border border-purple-400/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-purple-200">Welcome, {user.firstName}</span>
                  </div>
                  <Button variant="outline" size="sm" className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400 transition-all duration-300" asChild>
                    <Link href="/">🏠 Dashboard</Link>
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400 transition-all duration-300" asChild>
                  <Link href="/sign-in">🔐 Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="outline" size="sm" asChild className="mb-4">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Global Leaderboard</h1>
            <p className="text-gray-600 mt-2">
              See how you rank against other quiz takers worldwide.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Stats - Only show if user is logged in */}
          {user && userData && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Your Performance
                  </CardTitle>
                  <CardDescription>
                    Your quiz statistics and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userStats ? (
                    <div className="space-y-4">
                      {userStats.rank && (
                        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                          <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                          <p className="text-sm text-gray-600">Global Rank</p>
                          <p className="text-2xl font-bold text-blue-600">#{userStats.rank}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Quizzes Taken</p>
                          <p className="text-xl font-bold">{userStats.totalQuizzes}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Total Score</p>
                          <p className="text-xl font-bold">{userStats.totalScore}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Average Score</p>
                          <p className="text-xl font-bold">{userStats.averageScore.toFixed(1)}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Best Score</p>
                          <p className="text-xl font-bold text-green-600">{userStats.bestScore}</p>
                        </div>
                      </div>

                      {userStats.recentAttempts.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3">Recent Attempts</h4>
                          <div className="space-y-2">
                            {userStats.recentAttempts.slice(0, 3).map((attempt, index) => (
                              <div key={attempt._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div>
                                  <p className="font-medium text-sm">{attempt.quiz?.title}</p>
                                  <p className="text-xs text-gray-600">
                                    {new Date(attempt.completedAt || 0).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge variant={attempt.score >= attempt.totalPoints * 0.8 ? 'default' : attempt.score >= attempt.totalPoints * 0.6 ? 'secondary' : 'destructive'}>
                                  {attempt.totalPoints > 0 ? Math.round((attempt.score / attempt.totalPoints) * 100) : 0}%
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {userStats.totalQuizzes === 0 && (
                        <div className="text-center py-6 text-gray-500">
                          <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No quiz attempts yet.</p>
                          <p className="text-sm">Start taking quizzes to see your stats!</p>
                          <Button asChild className="mt-4" size="sm">
                            <Link href="/quizzes">Browse Quizzes</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p>Loading your stats...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Global Leaderboard */}
          <div className={user && userData ? "lg:col-span-2" : "lg:col-span-3"}>
            <Leaderboard showGlobal={true} limit={20} />
          </div>
        </div>

        {/* Call to Action for non-logged in users */}
        {!user && (
          <div className="mt-8">
            <Card>
              <CardContent className="text-center py-8">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
                <h3 className="text-xl font-bold mb-2">Join the Competition!</h3>
                <p className="text-gray-600 mb-6">
                  Sign up to take quizzes and see how you rank on the leaderboard.
                </p>
                <div className="space-x-4">
                  <Button asChild>
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/quizzes">Browse Quizzes</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
