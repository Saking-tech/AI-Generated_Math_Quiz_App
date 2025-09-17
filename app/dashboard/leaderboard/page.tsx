"use client";

import { useAuth } from "../../../contexts/AuthContext";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Leaderboard } from "@/components/quiz/Leaderboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Trophy, TrendingUp, Users, Target } from "lucide-react";
import GlassSurface from "@/components/GlassSurface";
import TextType from "@/components/TextType";
import BlurText from "@/components/BlurText";

export default function DashboardLeaderboardPage() {
  const { user: currentUser } = useAuth();
  
  const userStats = useQuery(
    api.quizAttempts.getUserStats,
    currentUser ? { userId: currentUser._id } : "skip"
  );

  const quizzes = useQuery(api.quizzes.getQuizzesByCreator, 
    currentUser ? { creatorId: currentUser._id } : "skip"
  );

  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  return (
    <div className="min-h-screen relative">
      {/* Content */}
      <div className="relative z-10 mobile-padding tablet-padding desktop-padding py-8 mobile:py-12">
        {/* Header Section */}
        <div className="text-center mb-8 mobile:mb-12">
          <h1 className="text-mobile-hero font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            <TextType
              text={["Quiz Leaderboard", "Quiz Leaderboard", "Quiz Leaderboard", "Quiz Leaderboard"]}
              typingSpeed={80}
              className="text-center"
            />
          </h1>
          <BlurText
            text="Track performance and see how your quizzes are performing with detailed analytics and leaderboards"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-mobile-body text-gray-300 max-w-2xl mx-auto text-center"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mobile:gap-8">
          {/* User Stats */}
          <div className="lg:col-span-1">
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={20}
              backgroundOpacity={0.7}
              opacity={0.9}
              blur={20}
              blueOffset={50}
              className="p-6 mobile:p-8 bg-purple-300/20"
            >
              <Card className="bg-transparent border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-300">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Your Performance
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Your quiz statistics and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userStats ? (
                    <div className="space-y-4">
                      {userStats.rank && (
                        <div className="text-center p-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-lg border border-blue-400/30">
                          <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                          <p className="text-sm text-gray-300">Global Rank</p>
                          <p className="text-2xl font-bold text-blue-300">#{userStats.rank}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-white/5 rounded-lg border border-purple-400/20">
                          <p className="text-sm text-gray-300">Quizzes Taken</p>
                          <p className="text-xl font-bold text-white">{userStats.totalQuizzes}</p>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg border border-purple-400/20">
                          <p className="text-sm text-gray-300">Total Score</p>
                          <p className="text-xl font-bold text-white">{userStats.totalScore}</p>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg border border-purple-400/20">
                          <p className="text-sm text-gray-300">Average Score</p>
                          <p className="text-xl font-bold text-white">{userStats.averageScore.toFixed(1)}</p>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg border border-purple-400/20">
                          <p className="text-sm text-gray-300">Best Score</p>
                          <p className="text-xl font-bold text-green-400">{userStats.bestScore}</p>
                        </div>
                      </div>

                      {userStats.recentAttempts.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3 text-purple-300">Recent Attempts</h4>
                          <div className="space-y-2">
                            {userStats.recentAttempts.slice(0, 3).map((attempt) => (
                              <div key={attempt._id} className="flex items-center justify-between p-2 bg-white/5 rounded border border-purple-400/20">
                                <div>
                                  <p className="font-medium text-sm text-white">{attempt.quiz?.title}</p>
                                  <p className="text-xs text-gray-400">
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
                        <div className="text-center py-6 text-gray-400">
                          <Users className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                          <p>No quiz attempts yet.</p>
                          <p className="text-sm">Start taking quizzes to see your stats!</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
                      <p className="text-gray-300">Loading your stats...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </GlassSurface>
          </div>

          {/* Global Leaderboard */}
          <div className="lg:col-span-2">
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={20}
              backgroundOpacity={0.7}
              opacity={0.9}
              blur={20}
              blueOffset={50}
              className="p-6 mobile:p-8 bg-purple-300/20"
            >
              <Leaderboard showGlobal={true} limit={15} />
            </GlassSurface>
          </div>
        </div>

        {/* Quiz-specific Leaderboards */}
        {quizzes && quizzes.length > 0 && (
          <div className="mt-8 mobile:mt-12">
            <div className="text-center mb-8">
              <h2 className="text-mobile-title font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Your Quiz Leaderboards
              </h2>
              <p className="text-mobile-body text-gray-300">
                Track performance for each of your individual quizzes
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mobile:gap-8">
              {quizzes.slice(0, 4).map((quiz) => (
                <GlassSurface
                  key={quiz._id}
                  width="100%"
                  height="auto"
                  borderRadius={20}
                  backgroundOpacity={0.7}
                  opacity={0.9}
                  blur={20}
                  blueOffset={50}
                  className="p-6 mobile:p-8 bg-purple-300/20"
                >
                  <Card className="bg-transparent border-0 shadow-none">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Target className="h-5 w-5 mr-2 text-blue-400" />
                          <span className="text-purple-300">{quiz.title}</span>
                        </div>
                        <Badge variant={quiz.isPublished ? 'default' : 'secondary'}>
                          {quiz.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        {quiz.description || 'No description available'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Leaderboard quizId={quiz._id} showGlobal={false} limit={5} />
                      <div className="mt-4 pt-4 border-t border-purple-400/20">
                        <Button size="sm" variant="outline" asChild className="w-full bg-transparent border-purple-400/30 text-purple-300 hover:bg-purple-600/20 hover:text-white">
                          <Link href={`/dashboard/quizzes/${quiz._id}`}>
                            View Full Results
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </GlassSurface>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
