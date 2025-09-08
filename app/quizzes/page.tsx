"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { formatDate, formatDuration } from "@/lib/utils";
import { Clock, FileText, User, Home } from "lucide-react";
import AuthButton from "@/components/AuthButton";

export default function QuizzesPage() {
  const quizzes = useQuery(api.quizzes.getPublishedQuizzes);

  if (!quizzes) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Available Quizzes</h1>
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400 transition-all duration-300">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <AuthButton />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {quizzes.length === 0 ? (
          <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl border border-purple-400/30">
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-medium mb-2 text-white">No quizzes available</h3>
              <p className="text-purple-200">Check back later for new quizzes!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz._id} className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl border border-purple-400/30 hover:border-purple-400/60 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:transform hover:scale-105">
                <CardHeader>
                  <CardTitle className="text-lg text-white">{quiz.title}</CardTitle>
                  {quiz.description && (
                    <CardDescription className="text-purple-200">{quiz.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-purple-200 mb-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Created: {formatDate(quiz.createdAt)}
                    </div>
                    {quiz.duration && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Duration: {formatDuration(quiz.duration)}
                      </div>
                    )}
                  </div>
                  
                  <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <Link href={`/quizzes/${quiz._id}`}>
                      <FileText className="h-4 w-4 mr-2" />
                      Take Quiz
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
