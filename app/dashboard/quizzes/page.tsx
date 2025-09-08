"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { formatDate, formatDuration } from "@/lib/utils";
import { Edit, Trash2, Eye, Users } from "lucide-react";
import { useState } from "react";

export default function MyQuizzesPage() {
  const { user } = useUser();
  const userData = useQuery(api.users.getUserByClerkId, 
    user ? { clerkId: user.id } : "skip"
  );
  const quizzes = useQuery(api.quizzes.getQuizzesByCreator, 
    userData ? { creatorId: userData._id } : "skip"
  );
  const deleteQuiz = useMutation(api.quizzes.deleteQuiz);
  const updateQuiz = useMutation(api.quizzes.updateQuiz);

  const [deletingQuiz, setDeletingQuiz] = useState<string | null>(null);

  const handleDeleteQuiz = async (quizId: string) => {
    setDeletingQuiz(quizId);
    try {
      await deleteQuiz({ quizId: quizId as any });
    } catch (error) {
      console.error("Error deleting quiz:", error);
    } finally {
      setDeletingQuiz(null);
    }
  };

  const handleTogglePublish = async (quizId: string, isPublished: boolean) => {
    try {
      await updateQuiz({ 
        quizId: quizId as any, 
        isPublished: !isPublished 
      });
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  };

  if (!quizzes) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Quizzes</h1>
        <Button asChild>
          <Link href="/dashboard/create-quiz">Create New Quiz</Link>
        </Button>
      </div>

      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">No quizzes yet</h3>
            <p className="text-gray-600 mb-4">Create your first quiz to get started!</p>
            <Button asChild>
              <Link href="/dashboard/create-quiz">Create Quiz</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  <div className="flex items-center space-x-1">
                    <span 
                      className={`px-2 py-1 text-xs rounded-full ${
                        quiz.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {quiz.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                {quiz.description && (
                  <CardDescription>{quiz.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>Created: {formatDate(quiz.createdAt)}</div>
                  {quiz.duration && (
                    <div>Duration: {formatDuration(quiz.duration)}</div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/dashboard/quizzes/${quiz._id}`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleTogglePublish(quiz._id, quiz.isPublished)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {quiz.isPublished ? 'Unpublish' : 'Publish'}
                  </Button>

                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/dashboard/quizzes/${quiz._id}/results`}>
                      <Users className="h-4 w-4 mr-1" />
                      Results
                    </Link>
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeleteQuiz(quiz._id)}
                    disabled={deletingQuiz === quiz._id}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {deletingQuiz === quiz._id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
