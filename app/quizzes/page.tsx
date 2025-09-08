"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { formatDate, formatDuration } from "@/lib/utils";
import { Clock, FileText, User } from "lucide-react";

export default function QuizzesPage() {
  const quizzes = useQuery(api.quizzes.getPublishedQuizzes);

  if (!quizzes) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Available Quizzes</h1>
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {quizzes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">No quizzes available</h3>
              <p className="text-gray-600">Check back later for new quizzes!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  {quiz.description && (
                    <CardDescription>{quiz.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
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
                  
                  <Button asChild className="w-full">
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
