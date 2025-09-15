"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { formatDate, formatDuration } from "@/lib/utils";
import { Clock, FileText, User, Trophy } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function QuizzesPage() {
  const quizzes = useQuery(api.quizzes.getPublishedQuizzes);

  if (!quizzes) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Navigation */}
      <Navigation />
      
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl">
        <div className="container mx-auto mobile-padding tablet-padding desktop-padding py-4 mobile:py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-mobile-title font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Available Quizzes</h1>
            <div className="flex items-center space-x-2">
              <Button asChild variant="outline" className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400">
                <Link href="/leaderboard">
                  <Trophy className="h-4 w-4 mr-2" />
                  Leaderboard
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400">
                <Link href="/results">
                  <FileText className="h-4 w-4 mr-2" />
                  My Results
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mobile-padding tablet-padding desktop-padding py-6 mobile:py-8 relative z-10">
        {quizzes.length === 0 ? (
          <Card className="bg-purple-200 backdrop-blur-xl border border-purple-300/50">
            <CardContent className="text-center py-6 mobile:py-8">
              <h3 className="text-mobile-body mobile:text-lg font-medium mb-2 bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">No quizzes available</h3>
              <p className="text-gray-700 text-sm mobile:text-base">Check back later for new quizzes!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mobile:gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz._id} className="bg-purple-200 backdrop-blur-xl border border-purple-300/50 hover:border-purple-400/60 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:transform hover:scale-105">
                <CardHeader className="pb-3">
                  <CardTitle className="text-mobile-body mobile:text-lg bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent line-clamp-2">{quiz.title}</CardTitle>
                  {quiz.description && (
                    <CardDescription className="text-gray-700 text-sm mobile:text-base line-clamp-3">{quiz.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1 mobile:space-y-2 text-xs mobile:text-sm text-gray-600 mb-3 mobile:mb-4">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mobile:h-4 mobile:w-4 mr-1 mobile:mr-2 flex-shrink-0" />
                      <span className="truncate">Created: {formatDate(quiz.createdAt)}</span>
                    </div>
                    {quiz.duration && (
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mobile:h-4 mobile:w-4 mr-1 mobile:mr-2 flex-shrink-0" />
                        <span>Duration: {formatDuration(quiz.duration)}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button asChild size="sm" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 btn-responsive">
                    <Link href={`/quizzes/${quiz._id}`}>
                      <FileText className="h-3 w-3 mobile:h-4 mobile:w-4 mr-1 mobile:mr-2" />
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
