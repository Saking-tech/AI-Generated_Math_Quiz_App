"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { formatDate, formatDuration } from "@/lib/utils";
import { Edit, Trash2, Eye, Users, Plus, Upload, BookOpen, Calendar, Clock, Globe, Lock } from "lucide-react";
import { useState } from "react";
import GlassSurface from "@/components/GlassSurface";
import TextType from "@/components/TextType";
import BlurText from "@/components/BlurText";


export default function MyQuizzesPage() {
  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };
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
    return (
      <div className="min-h-screen relative">

        {/* Loading Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <GlassSurface
            width="300px"
            height="200px"
            borderRadius={20}
            backgroundOpacity={0.1}
            opacity={0.9}
            blur={10}
            className="flex items-center justify-center"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <p className="text-white font-medium">Loading your quizzes...</p>
            </div>
          </GlassSurface>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Content */}
      <div className="relative z-10 mobile-padding tablet-padding desktop-padding py-8 mobile:py-12">
        {/* Header Section */}
        <div className="text-center mb-8 mobile:mb-12">
          <h1 className="text-mobile-hero font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            <TextType
              text={["My Quiz Collection", "My Quiz Collection", "My Quiz Collection", "My Quiz Collection"]}
              typingSpeed={80}
              className="text-center"
            />
          </h1>
          <BlurText
            text="Manage, edit, publish, and track the performance of all your created quizzes"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-mobile-body text-gray-300 max-w-2xl mx-auto text-center"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col mobile:flex-row justify-center items-center gap-4 mobile:gap-6 mb-8 mobile:mb-12">
          <GlassSurface
            width="auto"
            height="auto"
            borderRadius={15}
            backgroundOpacity={0.1}
            opacity={0.9}
            blur={10}
            className="p-2"
          >
            <div className="grid grid-cols-2 mobile:flex-row gap-3 mobile:gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-6 py-3 mobile:px-8 mobile:py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105"
              >
                <Link href="/dashboard/create-quiz">
                  <Plus className="h-5 w-5 mobile:h-6 mobile:w-6 mr-2" />
                  Create New Quiz
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-transparent border-purple-400/30 text-purple-300 hover:bg-purple-600/20 hover:text-white px-6 py-3 mobile:px-8 mobile:py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105"
              >
                <Link href="/dashboard/import-export">
                  <Upload className="h-5 w-5 mobile:h-6 mobile:w-6 mr-2" />
                  Import/Export
                </Link>
              </Button>
            </div>
          </GlassSurface>
        </div>

        {quizzes.length === 0 ? (
          <div className="flex justify-center">
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={20}
              backgroundOpacity={0.1}
              opacity={0.9}
              blur={10}
              className="p-8 mobile:p-12 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 mobile:w-24 mobile:h-24 mx-auto mb-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center border border-purple-400/30">
                    <BookOpen className="h-10 w-10 mobile:h-12 mobile:w-12 text-purple-300" />
                  </div>
                  <h3 className="text-mobile-title font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                    No Quizzes Yet
                  </h3>
                  <p className="text-mobile-body text-gray-300 mb-6">
                    Start your quiz creation journey! Create engaging quizzes and share them with the world.
                  </p>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                >
                  <Link href="/dashboard/create-quiz">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Quiz
                  </Link>
                </Button>
              </div>
            </GlassSurface>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mobile:gap-8">
            {quizzes.map((quiz) => (
              <Card key={quiz._id} className="bg-purple-200 backdrop-blur-xl border border-purple-300/50 hover:border-purple-400/60 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 group">
                <CardHeader className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    {/* Quiz Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-mobile-body mobile:text-lg font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent line-clamp-2 mb-2">
                          {quiz.title}
                        </CardTitle>
                        {quiz.description && (
                          <CardDescription className="text-gray-700 text-sm mobile:text-base line-clamp-2">
                            {quiz.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${quiz.isPublished
                            ? 'bg-green-500/20 text-green-700 border border-green-400/30'
                            : 'bg-gray-500/20 text-gray-700 border border-gray-400/30'
                          }`}>
                          {quiz.isPublished ? (
                            <>
                              <Globe className="h-3 w-3" />
                              Published
                            </>
                          ) : (
                            <>
                              <Lock className="h-3 w-3" />
                              Draft
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quiz Stats */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>Created {formatDate(quiz.createdAt)}</span>
                      </div>
                      {quiz.duration && (
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{formatDuration(quiz.duration)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10">
                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 mobile:gap-3">
                    <Button
                      asChild
                      size="sm"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Link href={`/dashboard/quizzes/${quiz._id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleTogglePublish(quiz._id, quiz.isPublished)}
                      className={`rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${quiz.isPublished
                          ? 'bg-orange-600 hover:bg-orange-700 text-white border-0'
                          : 'bg-green-600 hover:bg-green-700 text-white border-0'
                        }`}
                    >
                      {quiz.isPublished ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Globe className="h-4 w-4 mr-2" />
                          Publish
                        </>
                      )}
                    </Button>

                    <Button
                      asChild
                      size="sm"
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Link href={`/dashboard/quizzes/${quiz._id}/results`}>
                        <Users className="h-4 w-4 mr-2" />
                        Results
                      </Link>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleDeleteQuiz(quiz._id)}
                      disabled={deletingQuiz === quiz._id}
                      className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {deletingQuiz === quiz._id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
