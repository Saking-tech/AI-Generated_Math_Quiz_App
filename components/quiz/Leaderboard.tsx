"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Users, Target, Clock } from "lucide-react";
import { toQuizId } from "@/lib/types";

interface LeaderboardProps {
  quizId?: string;
  showGlobal?: boolean;
  limit?: number;
}

export function Leaderboard({ quizId, showGlobal = true, limit = 10 }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'global' | 'quiz'>('global');
  
  const globalLeaderboard = useQuery(
    api.quizAttempts.getGlobalLeaderboard,
    showGlobal ? { limit } : "skip"
  );
  
  const quizLeaderboard = useQuery(
    api.quizAttempts.getQuizLeaderboard,
    quizId ? { quizId: toQuizId(quizId), limit } : "skip"
  );

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-medium text-gray-600">#{rank}</span>;
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!showGlobal && !quizId) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      {showGlobal && quizId && (
        <div className="flex space-x-1 bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-lg p-1 rounded-xl border border-purple-400/30">
          <Button
            variant={activeTab === 'global' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('global')}
            className={`flex-1 rounded-lg transition-all duration-300 ${
              activeTab === 'global' 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                : 'text-purple-200 hover:bg-purple-600/20'
            }`}
          >
            <Users className="h-4 w-4 mr-2" />
            Global
          </Button>
          <Button
            variant={activeTab === 'quiz' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 rounded-lg transition-all duration-300 ${
              activeTab === 'quiz' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                : 'text-blue-200 hover:bg-blue-600/20'
            }`}
          >
            <Target className="h-4 w-4 mr-2" />
            This Quiz
          </Button>
        </div>
      )}

      {/* Global Leaderboard */}
      {activeTab === 'global' && showGlobal && (
        <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl border border-purple-400/30 animate-fade-in-up">
          <CardHeader className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-t-lg">
            <CardTitle className="flex items-center text-white">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg mr-3 animate-glow">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              Global Leaderboard
            </CardTitle>
            <CardDescription className="text-purple-200">
              Top performers across all quizzes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {globalLeaderboard ? (
              <div className="space-y-3">
                {globalLeaderboard.map((user, index) => (
                  <div
                    key={user.userId}
                    className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-500 hover:transform hover:scale-102 hover:shadow-2xl animate-fade-in-up ${
                      index < 3 
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 hover:shadow-yellow-500/25' 
                        : 'bg-gradient-to-r from-gray-800/20 to-gray-700/20 border border-gray-600/30 hover:shadow-purple-500/25'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 group-hover:animate-bounce">
                        {getRankIcon(index + 1)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-yellow-300 transition-colors duration-300">{user.userName}</h4>
                        <p className="text-sm text-gray-300">{user.userEmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Total Score</p>
                          <p className="font-bold text-lg text-white">{user.totalScore}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Quizzes</p>
                          <p className="font-semibold text-blue-300">{user.totalQuizzes}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Average</p>
                          <p className="font-semibold text-purple-300">{user.averageScore.toFixed(1)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Best</p>
                          <p className="font-semibold text-green-400">{user.bestScore}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {globalLeaderboard.length === 0 && (
                  <div className="text-center py-12 text-gray-400 animate-fade-in-up">
                    <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full w-20 h-20 mx-auto mb-6 animate-float">
                      <Trophy className="h-12 w-12 text-white" />
                    </div>
                    <p className="text-lg font-semibold text-white mb-2">No quiz attempts found yet.</p>
                    <p className="text-sm">Be the first to take a quiz!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 animate-fade-in-up">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500/30 border-t-purple-500 mx-auto mb-4"></div>
                  <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-purple-500/20 mx-auto"></div>
                </div>
                <p className="text-purple-200">Loading leaderboard...</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quiz-specific Leaderboard */}
      {activeTab === 'quiz' && quizId && (
        <Card className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 backdrop-blur-xl border border-blue-400/30 animate-fade-in-up">
          <CardHeader className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-t-lg">
            <CardTitle className="flex items-center text-white">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mr-3 animate-glow">
                <Target className="h-5 w-5 text-white" />
              </div>
              Quiz Leaderboard
            </CardTitle>
            <CardDescription className="text-blue-200">
              Top performers for this specific quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {quizLeaderboard ? (
              <div className="space-y-3">
                {quizLeaderboard.map((attempt, index) => (
                  <div
                    key={attempt.attemptId}
                    className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-500 hover:transform hover:scale-102 hover:shadow-2xl animate-fade-in-up ${
                      index < 3 
                        ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 hover:shadow-blue-500/25' 
                        : 'bg-gradient-to-r from-gray-800/20 to-gray-700/20 border border-gray-600/30 hover:shadow-blue-500/25'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 group-hover:animate-bounce">
                        {getRankIcon(index + 1)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">{attempt.userName}</h4>
                        <p className="text-sm text-gray-300">{attempt.userEmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Score</p>
                          <p className="font-bold text-lg text-white">{attempt.score}/{attempt.totalPoints}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Percentage</p>
                          <Badge 
                            variant={attempt.percentage >= 80 ? 'default' : attempt.percentage >= 60 ? 'secondary' : 'destructive'}
                            className={`animate-pulse ${
                              attempt.percentage >= 80 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                                : attempt.percentage >= 60 
                                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                                  : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
                            }`}
                          >
                            {attempt.percentage.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Time</p>
                          <p className="font-semibold flex items-center text-cyan-300">
                            <Clock className="h-3 w-3 mr-1 animate-pulse" />
                            {formatTime(attempt.timeTaken)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Completed</p>
                          <p className="font-semibold text-xs text-purple-300">{formatDate(attempt.completedAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {quizLeaderboard.length === 0 && (
                  <div className="text-center py-12 text-gray-400 animate-fade-in-up">
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-20 h-20 mx-auto mb-6 animate-float">
                      <Target className="h-12 w-12 text-white" />
                    </div>
                    <p className="text-lg font-semibold text-white mb-2">No attempts found for this quiz yet.</p>
                    <p className="text-sm">Be the first to take this quiz!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 animate-fade-in-up">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 mx-auto mb-4"></div>
                  <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-blue-500/20 mx-auto"></div>
                </div>
                <p className="text-blue-200">Loading quiz leaderboard...</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
