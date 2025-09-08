"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDuration } from "@/lib/utils";
import { Clock, CheckCircle } from "lucide-react";
import ClickSpark from "@/components/ui/ClickSpark";

export default function TakeQuizPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const quizId = params.id as string;
  
  const userData = useQuery(api.users.getUserByClerkId, 
    user ? { clerkId: user.id } : "skip"
  );
  const quiz = useQuery(api.quizzes.getQuizWithQuestions, 
    quizId ? { quizId: quizId as any } : "skip"
  );
  const startQuizAttempt = useMutation(api.quizAttempts.startQuizAttempt);
  const submitQuizAttempt = useMutation(api.quizAttempts.submitQuizAttempt);

  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleStartQuiz = async () => {
    if (!userData || !quiz) return;

    try {
      const id = await startQuizAttempt({
        quizId: quizId as any,
        userId: userData._id,
      });
      setAttemptId(id);
      setQuizStarted(true);
      
      if (quiz.duration) {
        setTimeLeft(quiz.duration * 60); // Convert to seconds
      }
    } catch (error) {
      console.error("Error starting quiz:", error);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: Array.isArray(answer) ? answer : [answer]
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!attemptId || !quiz) return;

    setIsSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedAnswers]) => ({
        questionId: questionId as any,
        selectedAnswers: selectedAnswers.filter(answer => answer.trim() !== ""),
      }));

      await submitQuizAttempt({
        attemptId: attemptId as any,
        answers: formattedAnswers,
      });

      router.push(`/results/${attemptId}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quiz || !userData) {
    return <div>Loading...</div>;
  }

  if (!quiz.isPublished) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">Quiz Not Available</h3>
            <p className="text-gray-600 mb-4">This quiz is not published yet.</p>
            <Button asChild>
              <a href="/quizzes">Back to Quizzes</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl border border-purple-400/30 animate-fade-in-up">
              <CardHeader className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-t-lg">
                <CardTitle className="text-3xl text-white flex items-center">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl mr-4 animate-glow">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  {quiz.title}
                </CardTitle>
                {quiz.description && (
                  <p className="text-purple-200 text-lg mt-4">{quiz.description}</p>
                )}
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-800/20 to-gray-700/20 border border-gray-600/30">
                    <span className="font-semibold text-white">Questions:</span>
                    <span className="text-2xl font-bold text-purple-300">{quiz.questions.length}</span>
                  </div>
                  {quiz.duration && (
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-800/20 to-gray-700/20 border border-gray-600/30">
                      <span className="font-semibold text-white">Duration:</span>
                      <span className="flex items-center text-cyan-300">
                        <Clock className="h-5 w-5 mr-2 animate-pulse" />
                        <span className="text-xl font-bold">{formatDuration(quiz.duration)}</span>
                      </span>
                    </div>
                  )}
                  <div className="pt-6">
                    <ClickSpark
                      sparkColor='#8b5cf6'
                      sparkSize={15}
                      sparkRadius={25}
                      sparkCount={12}
                      duration={600}
                    >
                      <Button 
                        onClick={handleStartQuiz} 
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        🚀 Start Quiz
                      </Button>
                    </ClickSpark>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {quiz.title}
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              {timeLeft !== null && (
                <div className={`flex items-center px-4 py-2 rounded-full backdrop-blur-lg border ${
                  timeLeft < 300 
                    ? 'bg-gradient-to-r from-red-600/20 to-rose-600/20 border-red-400/30 text-red-200' 
                    : 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-400/30 text-blue-200'
                }`}>
                  <Clock className="h-4 w-4 mr-2 animate-pulse" />
                  <span className="font-bold">{formatTime(timeLeft)}</span>
                </div>
              )}
              <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-full px-4 py-2 border border-purple-400/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-purple-200 font-semibold">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl border border-purple-400/30 animate-fade-in-up">
            <CardHeader className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-t-lg">
              <CardTitle className="text-xl text-white flex items-center">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg mr-3 animate-glow">
                  <span className="text-white font-bold">{currentQuestion + 1}</span>
                </div>
                Question {currentQuestion + 1}
              </CardTitle>
              <div className="flex items-center space-x-4">
                <p className="text-sm text-purple-200">
                  {question.points} point{question.points !== 1 ? 's' : ''}
                </p>
                <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8">
                <p className="text-xl text-white leading-relaxed">{question.questionText}</p>

                {question.questionType === "mcq_single" && (
                  <ClickSpark
                    sparkColor='#8b5cf6'
                    sparkSize={12}
                    sparkRadius={20}
                    sparkCount={10}
                    duration={500}
                  >
                    <RadioGroup
                      value={answers[question._id]?.[0] || ""}
                      onValueChange={(value) => handleAnswerChange(question._id, value)}
                      className="space-y-4"
                    >
                      {question.options?.map((option, index) => (
                        <div 
                          key={index} 
                          className="group flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-800/20 to-gray-700/20 border border-gray-600/30 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-102 hover:shadow-lg hover:shadow-purple-500/25"
                        >
                          <RadioGroupItem 
                            value={option} 
                            id={`option-${index}`}
                            className="border-purple-400 text-purple-600 focus:ring-purple-500"
                          />
                          <Label 
                            htmlFor={`option-${index}`} 
                            className="flex-1 text-white group-hover:text-purple-200 transition-colors duration-300 cursor-pointer"
                          >
                            <span className="font-semibold text-purple-300 mr-2">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </ClickSpark>
                )}

                {question.questionType === "mcq_multiple" && (
                  <ClickSpark
                    sparkColor='#06b6d4'
                    sparkSize={12}
                    sparkRadius={20}
                    sparkCount={10}
                    duration={500}
                  >
                    <div className="space-y-4">
                      {question.options?.map((option, index) => (
                        <div 
                          key={index} 
                          className="group flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-800/20 to-gray-700/20 border border-gray-600/30 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-102 hover:shadow-lg hover:shadow-cyan-500/25"
                        >
                          <Checkbox
                            id={`option-${index}`}
                            checked={answers[question._id]?.includes(option) || false}
                            onCheckedChange={(checked) => {
                              const currentAnswers = answers[question._id] || [];
                              if (checked) {
                                handleAnswerChange(question._id, [...currentAnswers, option]);
                              } else {
                                handleAnswerChange(question._id, currentAnswers.filter(a => a !== option));
                              }
                            }}
                            className="border-cyan-400 text-cyan-600 focus:ring-cyan-500"
                          />
                          <Label 
                            htmlFor={`option-${index}`} 
                            className="flex-1 text-white group-hover:text-cyan-200 transition-colors duration-300 cursor-pointer"
                          >
                            <span className="font-semibold text-cyan-300 mr-2">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ClickSpark>
                )}

                {question.questionType === "short_answer" && (
                  <ClickSpark
                    sparkColor='#10b981'
                    sparkSize={12}
                    sparkRadius={20}
                    sparkCount={10}
                    duration={500}
                  >
                    <div className="p-4 rounded-xl bg-gradient-to-r from-gray-800/20 to-gray-700/20 border border-gray-600/30 hover:border-green-400/50 transition-all duration-300">
                      <Input
                        value={answers[question._id]?.[0] || ""}
                        onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                        placeholder="Enter your answer"
                        className="bg-transparent border-green-400/50 text-white placeholder-gray-400 focus:border-green-400 focus:ring-green-500"
                      />
                    </div>
                  </ClickSpark>
                )}

                <div className="flex justify-between pt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                    className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </Button>
                  
                  {isLastQuestion ? (
                    <ClickSpark
                      sparkColor='#10b981'
                      sparkSize={15}
                      sparkRadius={25}
                      sparkCount={12}
                      duration={600}
                    >
                      <Button
                        onClick={handleSubmitQuiz}
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Quiz ✨
                            <CheckCircle className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </ClickSpark>
                  ) : (
                    <Button
                      onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Next →
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Progress indicator */}
          <div className="mt-8 animate-fade-in-up">
            <div className="flex justify-center space-x-3">
              {quiz.questions.map((_, index) => (
                <div
                  key={index}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 hover:scale-110 ${
                    index === currentQuestion
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50 animate-pulse'
                      : answers[quiz.questions[index]._id]
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                      : 'bg-gradient-to-r from-gray-700 to-gray-600 text-gray-300 border border-gray-500/30'
                  }`}
                >
                  {index + 1}
                  {answers[quiz.questions[index]._id] && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-2 w-2 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-purple-200 text-sm">
                Progress: {Object.keys(answers).length} of {quiz.questions.length} questions answered
              </p>
              <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(Object.keys(answers).length / quiz.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
