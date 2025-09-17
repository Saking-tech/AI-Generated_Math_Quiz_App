"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toQuizId } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { calculatePercentage, formatDateTime } from "@/lib/utils";
import { Trophy, Users, TrendingUp, ArrowLeft } from "lucide-react";
import GlassSurface from "@/components/GlassSurface";

export default function QuizResultsPage() {
  const params = useParams();
  const quizId = params.id as string;
  
  const quiz = useQuery(api.quizzes.getQuizById, 
    quizId ? { quizId: toQuizId(quizId) } : "skip"
  );
  const attempts = useQuery(api.quizAttempts.getAttemptsByQuiz, 
    quizId ? { quizId: toQuizId(quizId) } : "skip"
  );

  if (!quiz || !attempts) {
    return <div>Loading...</div>;
  }

  const completedAttempts = attempts.filter(attempt => attempt.isCompleted);
  
  const stats = {
    totalAttempts: completedAttempts.length,
    averageScore: completedAttempts.length > 0 
      ? Math.round(completedAttempts.reduce((sum, attempt) => 
          sum + calculatePercentage(attempt.score, attempt.totalPoints), 0
        ) / completedAttempts.length)
      : 0,
    highestScore: completedAttempts.length > 0 
      ? Math.max(...completedAttempts.map(attempt => 
          calculatePercentage(attempt.score, attempt.totalPoints)
        ))
      : 0,
    passRate: completedAttempts.length > 0 
      ? Math.round((completedAttempts.filter(attempt => 
          calculatePercentage(attempt.score, attempt.totalPoints) >= 60
        ).length / completedAttempts.length) * 100)
      : 0,
  };

  return (
    <div className="min-h-screen relative">
      {/* Content */}
      <div className="relative z-10 mobile-padding tablet-padding desktop-padding py-8 mobile:py-12">
        {/* Header Section */}
        <div className="text-center mb-8 mobile:mb-12">
          <h1 className="text-mobile-hero font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            {quiz.title} - Results
          </h1>
          <p className="text-mobile-body text-gray-300 max-w-2xl mx-auto">
            Detailed analytics and performance metrics for your quiz
          </p>
        </div>

        {completedAttempts.length === 0 ? (
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
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2 text-purple-300">No attempts yet</h3>
                <p className="text-gray-300">Students haven&apos;t taken this quiz yet.</p>
              </CardContent>
            </Card>
          </GlassSurface>
        ) : (
          <div className="space-y-6 mobile:space-y-8">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mobile:gap-8">
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
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-300">Total Attempts</CardTitle>
                    <Users className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.totalAttempts}</div>
                  </CardContent>
                </Card>
              </GlassSurface>

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
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-300">Average Score</CardTitle>
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.averageScore}%</div>
                  </CardContent>
                </Card>
              </GlassSurface>

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
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-300">Highest Score</CardTitle>
                    <Trophy className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.highestScore}%</div>
                  </CardContent>
                </Card>
              </GlassSurface>

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
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-300">Pass Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.passRate}%</div>
                    <p className="text-xs text-gray-300">≥60% to pass</p>
                  </CardContent>
                </Card>
              </GlassSurface>
            </div>

            {/* Attempts List */}
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
                  <CardTitle className="text-purple-300">Individual Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedAttempts
                      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
                      .map((attempt) => {
                        const percentage = calculatePercentage(attempt.score, attempt.totalPoints);
                        const getScoreColor = (percentage: number) => {
                          if (percentage >= 80) return 'text-green-300 bg-green-600/20 border border-green-400/30';
                          if (percentage >= 60) return 'text-yellow-300 bg-yellow-600/20 border border-yellow-400/30';
                          return 'text-red-300 bg-red-600/20 border border-red-400/30';
                        };

                        return (
                          <div
                            key={attempt._id}
                            className="flex items-center justify-between p-4 border border-purple-400/20 rounded-lg hover:bg-white/5 transition-all duration-300 bg-white/5"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-white">{attempt.user?.name || 'Anonymous'}</div>
                              <div className="text-sm text-gray-300">
                                {attempt.user?.email}
                              </div>
                              <div className="text-sm text-gray-400">
                                Completed: {formatDateTime(attempt.completedAt || Date.now())}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-medium text-white">
                                {attempt.score}/{attempt.totalPoints} points
                              </div>
                              <div className={`text-sm font-medium px-2 py-1 rounded ${getScoreColor(percentage)}`}>
                                {percentage}%
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </GlassSurface>

            {/* Score Distribution */}
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
                  <CardTitle className="text-purple-300">Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { range: '90-100%', label: 'Excellent (A)', color: 'bg-green-500' },
                      { range: '80-89%', label: 'Good (B)', color: 'bg-blue-500' },
                      { range: '70-79%', label: 'Average (C)', color: 'bg-yellow-500' },
                      { range: '60-69%', label: 'Below Average (D)', color: 'bg-orange-500' },
                      { range: '0-59%', label: 'Poor (F)', color: 'bg-red-500' },
                    ].map((grade, index) => {
                      const min = index === 4 ? 0 : (4 - index) * 10 + 50;
                      const max = index === 0 ? 100 : (4 - index) * 10 + 59;
                      
                      const count = completedAttempts.filter(attempt => {
                        const percentage = calculatePercentage(attempt.score, attempt.totalPoints);
                        return percentage >= min && percentage <= max;
                      }).length;
                      
                      const percentage = completedAttempts.length > 0 
                        ? (count / completedAttempts.length) * 100 
                        : 0;

                      return (
                        <div key={grade.range} className="flex items-center space-x-4">
                          <div className="w-24 text-sm text-purple-300">{grade.range}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-white/10 rounded-full h-4 border border-purple-400/20">
                                <div
                                  className={`h-4 rounded-full ${grade.color}`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <div className="text-sm w-16 text-white">{count} ({Math.round(percentage)}%)</div>
                            </div>
                            <div className="text-xs text-gray-300 mt-1">{grade.label}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </GlassSurface>
          </div>
        )}
      </div>
    </div>
  );
}
