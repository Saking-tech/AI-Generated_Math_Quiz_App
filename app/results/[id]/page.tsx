"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { calculatePercentage, formatDateTime } from "@/lib/utils";
import { CheckCircle, XCircle, Award, Home } from "lucide-react";

export default function QuizResultPage() {
  const params = useParams();
  const attemptId = params.id as string;
  
  const attempt = useQuery(api.quizAttempts.getAttemptDetails, 
    attemptId ? { attemptId: attemptId as any } : "skip"
  );

  if (!attempt) {
    return <div>Loading...</div>;
  }

  const percentage = calculatePercentage(attempt.score, attempt.totalPoints);
  
  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'B', color: 'text-blue-600' };
    if (percentage >= 70) return { grade: 'C', color: 'text-yellow-600' };
    if (percentage >= 60) return { grade: 'D', color: 'text-orange-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  const { grade, color } = getGrade(percentage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Quiz Results</h1>
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Score Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                {attempt.quiz?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {attempt.score}/{attempt.totalPoints}
                  </div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
                
                <div className="text-center">
                  <div className={`text-3xl font-bold ${color}`}>
                    {percentage}%
                  </div>
                  <div className="text-sm text-gray-600">Percentage</div>
                </div>
                
                <div className="text-center">
                  <div className={`text-3xl font-bold ${color}`}>
                    {grade}
                  </div>
                  <div className="text-sm text-gray-600">Grade</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {attempt.questions?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Completed: {formatDateTime(attempt.completedAt || Date.now())}</span>
                  <span>Duration: {
                    attempt.completedAt && attempt.startedAt 
                      ? Math.round((attempt.completedAt - attempt.startedAt) / 60000) + ' minutes'
                      : 'N/A'
                  }</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Review */}
          <Card>
            <CardHeader>
              <CardTitle>Question Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {attempt.questions?.map((question, index) => {
                  const userAnswers = question.userAnswer || [];
                  const correctAnswers = question.correctAnswers;
                  const isCorrect = correctAnswers.length === userAnswers.length &&
                    correctAnswers.every(answer => userAnswers.includes(answer));

                  return (
                    <div key={question._id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium">Question {index + 1}</h3>
                        <div className="flex items-center">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <span className="ml-2 text-sm">
                            {isCorrect ? question.points : 0}/{question.points} points
                          </span>
                        </div>
                      </div>
                      
                      <p className="mb-4">{question.questionText}</p>
                      
                      {question.questionType !== "short_answer" ? (
                        <div className="space-y-2">
                          {question.options?.map((option, optionIndex) => {
                            const isUserAnswer = userAnswers.includes(option);
                            const isCorrectAnswer = correctAnswers.includes(option);
                            
                            let bgColor = 'bg-gray-50';
                            if (isCorrectAnswer && isUserAnswer) {
                              bgColor = 'bg-green-100 border-green-300';
                            } else if (isCorrectAnswer) {
                              bgColor = 'bg-green-50 border-green-200';
                            } else if (isUserAnswer) {
                              bgColor = 'bg-red-100 border-red-300';
                            }
                            
                            return (
                              <div
                                key={optionIndex}
                                className={`p-3 rounded border ${bgColor}`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>
                                    {String.fromCharCode(65 + optionIndex)}. {option}
                                  </span>
                                  <div className="flex space-x-2">
                                    {isUserAnswer && (
                                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        Your Answer
                                      </span>
                                    )}
                                    {isCorrectAnswer && (
                                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                        Correct
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="p-3 rounded bg-gray-50 border">
                            <div className="text-sm text-gray-600 mb-1">Your Answer:</div>
                            <div>{userAnswers[0] || 'No answer provided'}</div>
                          </div>
                          <div className="p-3 rounded bg-green-50 border border-green-200">
                            <div className="text-sm text-gray-600 mb-1">Correct Answer(s):</div>
                            <div>{correctAnswers.join(', ')}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Button asChild>
              <Link href="/quizzes">Take Another Quiz</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/results">View All Results</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
