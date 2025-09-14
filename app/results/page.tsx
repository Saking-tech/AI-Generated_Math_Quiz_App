"use client";

import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { calculatePercentage, formatDateTime } from "@/lib/utils";
import { Trophy, Eye, Home } from "lucide-react";

export default function MyResultsPage() {
  const { user: currentUser } = useAuth();
  const attempts = useQuery(api.quizAttempts.getAttemptsByUser, 
    currentUser ? { userId: currentUser._id } : "skip"
  );

  if (!attempts) {
    return <div>Loading...</div>;
  }

  const completedAttempts = attempts.filter(attempt => attempt.isCompleted);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">My Quiz Results</h1>
            <Button variant="outline" asChild className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400 transition-all duration-300">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {completedAttempts.length === 0 ? (
          <Card className="bg-purple-200 backdrop-blur-xl border border-purple-300/50">
            <CardContent className="text-center py-8">
              <Trophy className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2 bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">No quiz results yet</h3>
              <p className="text-gray-700 mb-4">Take your first quiz to see your results here!</p>
              <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <Link href="/quizzes">Browse Quizzes</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Statistics */}
            <Card className="bg-purple-200">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {completedAttempts.length}
                    </div>
                    <div className="text-sm text-gray-600">Quizzes Completed</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {Math.round(
                        completedAttempts.reduce(
                          (sum, attempt) => sum + calculatePercentage(attempt.score, attempt.totalPoints), 
                          0
                        ) / completedAttempts.length
                      )}%
                    </div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {Math.max(...completedAttempts.map(attempt => 
                        calculatePercentage(attempt.score, attempt.totalPoints)
                      ))}%
                    </div>
                    <div className="text-sm text-gray-600">Best Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedAttempts.map((attempt) => {
                const percentage = calculatePercentage(attempt.score, attempt.totalPoints);
                const getScoreColor = (percentage: number) => {
                  if (percentage >= 80) return 'text-green-600';
                  if (percentage >= 60) return 'text-yellow-600';
                  return 'text-red-600';
                };

                return (
                  <Card key={attempt._id} className="bg-purple-200">
                    <CardHeader>
                      <CardTitle className="text-lg bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">{attempt.quiz?.title}</CardTitle>
                      <CardDescription className="text-gray-700">
                        Completed: {formatDateTime(attempt.completedAt || Date.now())}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Score:</span>
                          <span className="font-medium">
                            {attempt.score}/{attempt.totalPoints}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Percentage:</span>
                          <span className={`font-bold ${getScoreColor(percentage)}`}>
                            {percentage}%
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              percentage >= 80 ? 'bg-green-500' :
                              percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        
                        <Button size="sm" variant="outline" className="w-full" asChild>
                          <Link href={`/results/${attempt._id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
