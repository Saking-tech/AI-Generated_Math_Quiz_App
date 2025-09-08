"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { calculatePercentage, formatDateTime } from "@/lib/utils";
import { Trophy, Users, TrendingUp, ArrowLeft } from "lucide-react";

export default function QuizResultsPage() {
  const params = useParams();
  const quizId = params.id as string;
  
  const quiz = useQuery(api.quizzes.getQuizById, 
    quizId ? { quizId: quizId as any } : "skip"
  );
  const attempts = useQuery(api.quizAttempts.getAttemptsByQuiz, 
    quizId ? { quizId: quizId as any } : "skip"
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href={`/dashboard/quizzes/${quizId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quiz
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{quiz.title} - Results</h1>
        </div>
      </div>

      {completedAttempts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No attempts yet</h3>
            <p className="text-gray-600">Students haven't taken this quiz yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAttempts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageScore}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.highestScore}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.passRate}%</div>
                <p className="text-xs text-muted-foreground">≥60% to pass</p>
              </CardContent>
            </Card>
          </div>

          {/* Attempts List */}
          <Card>
            <CardHeader>
              <CardTitle>Individual Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedAttempts
                  .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
                  .map((attempt) => {
                    const percentage = calculatePercentage(attempt.score, attempt.totalPoints);
                    const getScoreColor = (percentage: number) => {
                      if (percentage >= 80) return 'text-green-600 bg-green-50';
                      if (percentage >= 60) return 'text-yellow-600 bg-yellow-50';
                      return 'text-red-600 bg-red-50';
                    };

                    return (
                      <div
                        key={attempt._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{attempt.user?.name || 'Anonymous'}</div>
                          <div className="text-sm text-gray-600">
                            {attempt.user?.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            Completed: {formatDateTime(attempt.completedAt || Date.now())}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-medium">
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

          {/* Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
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
                      <div className="w-24 text-sm">{grade.range}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-4">
                            <div
                              className={`h-4 rounded-full ${grade.color}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-sm w-16">{count} ({Math.round(percentage)}%)</div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{grade.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
