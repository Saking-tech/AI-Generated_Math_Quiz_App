"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { User, Crown, Trophy, BookOpen, ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-lg">{userData.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-lg">{userData.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Role</label>
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
                  <label className="text-sm font-medium text-gray-600">Member Since</label>
                  <p className="text-lg">{formatDate(userData.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedAttempts.length}</div>
              </CardContent>
            </Card>

            {userData.role === "quiz-master" && (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Quizzes Created</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalQuizzes}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Published Quizzes</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{publishedQuizzes}</div>
                  </CardContent>
                </Card>
              </>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
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
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
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
        </div>
      </div>
    </div>
  );
}
