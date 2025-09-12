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
    <div className="mobile-padding tablet-padding desktop-padding">
      <div className="flex flex-col mobile:flex-row justify-between items-start mobile:items-center mb-6 mobile:mb-8 space-y-4 mobile:space-y-0">
        <h1 className="text-mobile-title font-bold">My Quizzes</h1>
        <div className="flex flex-col mobile:flex-row space-y-2 mobile:space-y-0 mobile:space-x-3 w-full mobile:w-auto">
          <Button variant="outline" asChild size="sm" className="w-full mobile:w-auto">
            <Link href="/dashboard/import-export">
              <span className="mobile:hidden">Import/Export</span>
              <span className="hidden mobile:inline">Import/Export</span>
            </Link>
          </Button>
          <Button asChild size="sm" className="w-full mobile:w-auto">
            <Link href="/dashboard/create-quiz">
              <span className="mobile:hidden">Create Quiz</span>
              <span className="hidden mobile:inline">Create New Quiz</span>
            </Link>
          </Button>
        </div>
      </div>

      {quizzes.length === 0 ? (
        <Card className="bg-purple-200">
          <CardContent className="text-center py-6 mobile:py-8">
            <h3 className="text-mobile-body mobile:text-lg font-medium mb-2 bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">No quizzes yet</h3>
            <p className="text-gray-700 mb-4 text-sm mobile:text-base">Create your first quiz to get started!</p>
            <Button asChild size="sm" className="btn-responsive">
              <Link href="/dashboard/create-quiz">Create Quiz</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mobile:gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz._id} className="bg-purple-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-mobile-body mobile:text-lg bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent line-clamp-2 flex-1">{quiz.title}</CardTitle>
                  <span 
                    className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                      quiz.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {quiz.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                {quiz.description && (
                  <CardDescription className="text-gray-700 text-sm mobile:text-base line-clamp-3 mt-2">{quiz.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1 mobile:space-y-2 text-xs mobile:text-sm text-gray-600 mb-3 mobile:mb-4">
                  <div className="truncate">Created: {formatDate(quiz.createdAt)}</div>
                  {quiz.duration && (
                    <div>Duration: {formatDuration(quiz.duration)}</div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1 mobile:gap-2">
                  <Button size="sm" variant="outline" asChild className="flex-1 mobile:flex-none">
                    <Link href={`/dashboard/quizzes/${quiz._id}`}>
                      <Edit className="h-3 w-3 mobile:h-4 mobile:w-4 mr-1" />
                      <span className="mobile:inline hidden">Edit</span>
                      <span className="mobile:hidden">E</span>
                    </Link>
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleTogglePublish(quiz._id, quiz.isPublished)}
                    className="flex-1 mobile:flex-none"
                  >
                    <Eye className="h-3 w-3 mobile:h-4 mobile:w-4 mr-1" />
                    <span className="mobile:inline hidden">{quiz.isPublished ? 'Unpublish' : 'Publish'}</span>
                    <span className="mobile:hidden">{quiz.isPublished ? 'Un' : 'Pub'}</span>
                  </Button>

                  <Button size="sm" variant="outline" asChild className="flex-1 mobile:flex-none">
                    <Link href={`/dashboard/quizzes/${quiz._id}/results`}>
                      <Users className="h-3 w-3 mobile:h-4 mobile:w-4 mr-1" />
                      <span className="mobile:inline hidden">Results</span>
                      <span className="mobile:hidden">R</span>
                    </Link>
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeleteQuiz(quiz._id)}
                    disabled={deletingQuiz === quiz._id}
                    className="flex-1 mobile:flex-none"
                  >
                    <Trash2 className="h-3 w-3 mobile:h-4 mobile:w-4 mr-1" />
                    <span className="mobile:inline hidden">{deletingQuiz === quiz._id ? 'Deleting...' : 'Delete'}</span>
                    <span className="mobile:hidden">D</span>
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
