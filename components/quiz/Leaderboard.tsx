"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Users, Target, Clock, TrendingUp } from "lucide-react";

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
    quizId ? { quizId: quizId as any, limit } : "skip"
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
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={activeTab === 'global' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('global')}
            className="flex-1"
          >
            <Users className="h-4 w-4 mr-2" />
            Global
          </Button>
          <Button
            variant={activeTab === 'quiz' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('quiz')}
            className="flex-1"
          >
            <Target className="h-4 w-4 mr-2" />
            This Quiz
          </Button>
        </div>
      )}

      {/* Global Leaderboard */}
      {activeTab === 'global' && showGlobal && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Global Leaderboard
            </CardTitle>
            <CardDescription>
              Top performers across all quizzes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {globalLeaderboard ? (
              <div className="space-y-3">
                {globalLeaderboard.map((user, index) => (
                  <div
                    key={user.userId}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8">
                        {getRankIcon(index + 1)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{user.userName}</h4>
                        <p className="text-sm text-gray-600">{user.userEmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Total Score</p>
                          <p className="font-bold text-lg">{user.totalScore}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Quizzes</p>
                          <p className="font-semibold">{user.totalQuizzes}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Average</p>
                          <p className="font-semibold">{user.averageScore.toFixed(1)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Best</p>
                          <p className="font-semibold text-green-600">{user.bestScore}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {globalLeaderboard.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No quiz attempts found yet.</p>
                    <p className="text-sm">Be the first to take a quiz!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Loading leaderboard...</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quiz-specific Leaderboard */}
      {activeTab === 'quiz' && quizId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-500" />
              Quiz Leaderboard
            </CardTitle>
            <CardDescription>
              Top performers for this specific quiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            {quizLeaderboard ? (
              <div className="space-y-3">
                {quizLeaderboard.map((attempt, index) => (
                  <div
                    key={attempt.attemptId}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      index < 3 ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8">
                        {getRankIcon(index + 1)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{attempt.userName}</h4>
                        <p className="text-sm text-gray-600">{attempt.userEmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Score</p>
                          <p className="font-bold text-lg">{attempt.score}/{attempt.totalPoints}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Percentage</p>
                          <Badge variant={attempt.percentage >= 80 ? 'default' : attempt.percentage >= 60 ? 'secondary' : 'destructive'}>
                            {attempt.percentage.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Time</p>
                          <p className="font-semibold flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(attempt.timeTaken)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Completed</p>
                          <p className="font-semibold text-xs">{formatDate(attempt.completedAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {quizLeaderboard.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No attempts found for this quiz yet.</p>
                    <p className="text-sm">Be the first to take this quiz!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Loading quiz leaderboard...</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
