"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDuration } from "@/lib/utils";
import { toQuizId, toQuestionId, toAttemptId } from "@/lib/types";
import { Clock, CheckCircle, Flag, RotateCcw } from "lucide-react";
import ClickSpark from "@/components/ui/ClickSpark";

export default function TakeQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;
  
  const { user: currentUser } = useAuth();
  const quiz = useQuery(api.quizzes.getQuizWithQuestions, 
    quizId ? { quizId: toQuizId(quizId) } : "skip"
  );
  const startQuizAttempt = useMutation(api.quizAttempts.startQuizAttempt);
  const submitQuizAttempt = useMutation(api.quizAttempts.submitQuizAttempt);

  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [markedQuestions, setMarkedQuestions] = useState<Set<string>>(new Set());
  const [visitedQuestions, setVisitedQuestions] = useState<Set<string>>(new Set());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const handleSubmitQuiz = useCallback(async () => {
    if (!attemptId || !quiz) return;

    setIsSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedAnswers]) => ({
        questionId: toQuestionId(questionId),
        selectedAnswers: selectedAnswers.filter(answer => answer.trim() !== ""),
      }));

      await submitQuizAttempt({
        attemptId: toAttemptId(attemptId),
        answers: formattedAnswers,
      });

      router.push(`/results/${attemptId}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [attemptId, quiz, answers, submitQuizAttempt, router]);

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
  }, [timeLeft, handleSubmitQuiz]);

  // Track visited questions
  useEffect(() => {
    if (quiz && quiz.questions[currentQuestion]) {
      const questionId = quiz.questions[currentQuestion]._id;
      setVisitedQuestions(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.add(questionId);
        return newSet;
      });
    }
  }, [currentQuestion, quiz]);

  const handleStartQuiz = async () => {
    if (!currentUser || !quiz) return;

    try {
      const id = await startQuizAttempt({
        quizId: toQuizId(quizId),
        userId: currentUser._id,
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

  const handleMarkForReview = (questionId: string) => {
    setMarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleClearResponse = (questionId: string) => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
  };

  const navigateToQuestion = (questionIndex: number) => {
    if (quiz && questionIndex >= 0 && questionIndex < quiz.questions.length) {
      setCurrentQuestion(questionIndex);
      const questionId = quiz.questions[questionIndex]._id;
      setVisitedQuestions(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.add(questionId);
        return newSet;
      });
    }
  };

  const getQuestionStatus = (questionId: string) => {
    const isAnswered = answers[questionId] && answers[questionId].length > 0;
    const isMarked = markedQuestions.has(questionId);
    const isVisited = visitedQuestions.has(questionId);
    
    if (isAnswered && isMarked) return 'answered-marked';
    if (isAnswered) return 'answered';
    if (isMarked) return 'marked';
    if (isVisited) return 'not-answered';
    return 'not-visited';
  };

  const getQuestionStatusCounts = () => {
    if (!quiz) return {
      notVisited: 0,
      notAnswered: 0,
      answered: 0,
      marked: 0,
      answeredMarked: 0
    };

    let notVisited = 0;
    let notAnswered = 0;
    let answered = 0;
    let marked = 0;
    let answeredMarked = 0;

    quiz.questions.forEach(question => {
      const questionId = question._id;
      const isAnswered = answers[questionId] && answers[questionId].length > 0;
      const isMarked = markedQuestions.has(questionId);
      const isVisited = visitedQuestions.has(questionId);

      if (isAnswered && isMarked) {
        answeredMarked++;
      } else if (isAnswered) {
        answered++;
      } else if (isMarked) {
        marked++;
      } else if (isVisited) {
        notAnswered++;
      } else {
        notVisited++;
      }
    });

    return {
      notVisited,
      notAnswered,
      answered,
      marked,
      answeredMarked
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quiz || !currentUser) {
    return <div>Loading...</div>;
  }

  if (!quiz.isPublished) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="bg-purple-200">
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-medium mb-2 bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">Quiz Not Available</h3>
            <p className="text-gray-700 mb-4">This quiz is not published yet.</p>
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
      <div className="min-h-screen relative overflow-hidden">

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-purple-200 backdrop-blur-xl border border-purple-300/50 animate-fade-in-up">
              <CardHeader className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-t-lg">
                <CardTitle className="text-3xl flex items-center bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl mr-4 animate-glow">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  {quiz.title}
                </CardTitle>
                {quiz.description && (
                  <p className="text-gray-700 text-lg mt-4">{quiz.description}</p>
                )}
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-800/20 to-gray-700/20 border border-gray-600/30">
                    <span className="font-semibold text-white">Questions:</span>
                    <span className="text-2xl font-bold text-cyan-700">{quiz.questions.length}</span>
                  </div>
                  {quiz.duration && (
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-800/20 to-gray-700/20 border border-gray-600/30">
                      <span className="font-semibold text-white">Duration:</span>
                      <span className="flex items-center text-cyan-700">
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
    <div className="min-h-screen relative overflow-hidden">

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl">
        <div className="container mx-auto mobile-padding tablet-padding desktop-padding py-4 mobile:py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 mobile:space-x-4">
              <div className="p-1.5 mobile:p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                <CheckCircle className="h-6 w-6 mobile:h-8 mobile:w-8 text-white" />
              </div>
              <h1 className="text-mobile-body mobile:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent truncate">
                {quiz.title}
              </h1>
            </div>
            <div className="flex items-center space-x-2 mobile:space-x-6">
              {timeLeft !== null && (
                <div className={`flex items-center px-2 mobile:px-4 py-1 mobile:py-2 rounded-full backdrop-blur-lg border ${
                  timeLeft < 300 
                    ? 'bg-gradient-to-r from-red-600/20 to-rose-600/20 border-red-400/30 text-red-200' 
                    : 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-400/30 text-blue-200'
                }`}>
                  <Clock className="h-3 w-3 mobile:h-4 mobile:w-4 mr-1 mobile:mr-2 animate-pulse" />
                  <span className="font-bold text-xs mobile:text-sm">{formatTime(timeLeft)}</span>
                </div>
              )}
              <div className="flex items-center space-x-1 mobile:space-x-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-full px-2 mobile:px-4 py-1 mobile:py-2 border border-purple-400/30">
                <div className="w-1.5 h-1.5 mobile:w-2 mobile:h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-purple-200 font-semibold text-xs mobile:text-sm">
                  <span className="hidden mobile:inline">Question </span>{currentQuestion + 1}/{quiz.questions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mobile-padding tablet-padding desktop-padding py-4 mobile:py-6 lg:py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mobile:gap-6 lg:gap-8">
          {/* Question Section - Left Side */}
          <div className="lg:col-span-2">
            <Card className="bg-purple-200 backdrop-blur-xl border border-purple-300/50 animate-fade-in-up h-fit">
              <CardHeader className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-t-lg p-4 mobile:p-6">
                <CardTitle className="text-mobile-body mobile:text-lg lg:text-xl flex items-center bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent flex-wrap gap-2">
                  <div className="p-1.5 mobile:p-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg animate-glow">
                    <span className="text-white font-bold text-sm mobile:text-base">{currentQuestion + 1}</span>
                  </div>
                  <span className="hidden mobile:inline">Question {currentQuestion + 1}</span>
                  <span className="mobile:hidden">Q{currentQuestion + 1}</span>
                  {markedQuestions.has(question._id) && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 border border-yellow-300 rounded-full">
                      <Flag className="h-3 w-3 text-yellow-600" />
                      <span className="text-xs text-yellow-700 font-medium hidden mobile:inline">Marked for Review</span>
                      <span className="text-xs text-yellow-700 font-medium mobile:hidden">Marked</span>
                    </div>
                  )}
                </CardTitle>
                <div className="flex items-center space-x-2 mobile:space-x-4 mt-2">
                  <p className="text-xs mobile:text-sm text-gray-700">
                    {question.points} point{question.points !== 1 ? 's' : ''}
                  </p>
                  <div className="h-1 w-12 mobile:w-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                </div>
              </CardHeader>
              <CardContent className="p-4 mobile:p-6">
                <div className="space-y-4 mobile:space-y-6 lg:space-y-8">
                  <p className="text-mobile-body mobile:text-lg lg:text-xl text-gray-700 leading-relaxed">{question.questionText}</p>

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
                              className="border-purple-400 text-purple-900 focus:ring-purple-500"
                            />
                            <Label 
                              htmlFor={`option-${index}`} 
                              className="flex-1 text-purple-800 group-hover:text-purple-200 transition-colors duration-300 cursor-pointer"
                            >
                              <span className="font-semibold text-gray-900/70 mr-2">
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

                  {/* Mark for Review and Clear Response Buttons */}
                  <div className="flex justify-center space-x-4 pt-6">
                    <Button
                      variant="outline"
                      onClick={() => handleMarkForReview(question._id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                        markedQuestions.has(question._id)
                          ? 'bg-yellow-100 border-yellow-400 text-yellow-800 hover:bg-yellow-200'
                          : 'border-orange-400/50 text-orange-700 hover:bg-orange-50 hover:border-orange-400'
                      }`}
                    >
                      <Flag className="h-4 w-4" />
                      <span>{markedQuestions.has(question._id) ? 'Marked for Review' : 'Mark for Review'}</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleClearResponse(question._id)}
                      disabled={!answers[question._id] || answers[question._id].length === 0}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl border-red-400/50 text-red-700 hover:bg-red-50 hover:border-red-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Clear Response</span>
                    </Button>
                  </div>

                  <div className="flex justify-between pt-8">
                    <Button
                      variant="outline"
                      onClick={() => navigateToQuestion(currentQuestion - 1)}
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
                        onClick={() => navigateToQuestion(currentQuestion + 1)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        Next →
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Section - Right Side */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="bg-purple-200 backdrop-blur-xl border border-purple-300/50 animate-fade-in-up">
                <CardHeader>
                  <CardTitle className="text-lg bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent text-center">
                    Question Navigation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Status Legend */}
                  <div className="mb-6">
                    <div className="grid grid-cols-1 gap-3 text-xs">
                      {(() => {
                        const counts = getQuestionStatusCounts();
                        return (
                          <>
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 bg-gray-400 text-white rounded flex items-center justify-center font-bold">
                                {counts.notVisited}
                              </div>
                              <span className="text-gray-700">Not Visited</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 bg-red-500 text-white rounded flex items-center justify-center font-bold">
                                {counts.notAnswered}
                              </div>
                              <span className="text-gray-700">Not Answered</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 bg-green-500 text-white rounded flex items-center justify-center font-bold">
                                {counts.answered}
                              </div>
                              <span className="text-gray-700">Answered</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 bg-purple-600 text-white rounded flex items-center justify-center font-bold relative">
                                {counts.marked}
                                <Flag className="absolute -top-1 -right-1 h-2 w-2 text-yellow-400" />
                              </div>
                              <span className="text-gray-700">Marked for Review</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 bg-purple-800 text-white rounded flex items-center justify-center font-bold relative">
                                {counts.answeredMarked}
                                <CheckCircle className="absolute -top-1 -right-1 h-2 w-2 text-green-400" />
                                <Flag className="absolute -top-1 -left-1 h-2 w-2 text-yellow-400" />
                              </div>
                              <span className="text-gray-700 text-xs">Answered & Marked</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Question Grid */}
                  <div className="grid grid-cols-8 gap-1 mb-6">
                    {quiz.questions.map((question, index) => {
                      const questionId = question._id;
                      const status = getQuestionStatus(questionId);
                      const isCurrent = index === currentQuestion;
                      
                      let bgColor = 'bg-gray-400'; // not-visited
                      const textColor = 'text-white';
                      let borderColor = 'border-gray-300';
                      
                      if (status === 'not-answered') {
                        bgColor = 'bg-red-500';
                      } else if (status === 'answered') {
                        bgColor = 'bg-green-500';
                      } else if (status === 'marked') {
                        bgColor = 'bg-purple-600';
                      } else if (status === 'answered-marked') {
                        bgColor = 'bg-purple-800';
                      }
                      
                      if (isCurrent) {
                        borderColor = 'border-blue-500 ring-2 ring-blue-300';
                      }
                      
                      return (
                        <button
                          key={index}
                          onClick={() => navigateToQuestion(index)}
                          className={`relative w-8 h-8 ${bgColor} ${textColor} rounded border-2 ${borderColor} flex items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                        >
                          {index + 1}
                          {status === 'answered' && (
                            <CheckCircle className="absolute -top-1 -right-1 h-2 w-2 text-green-400 bg-white rounded-full" />
                          )}
                          {(status === 'marked' || status === 'answered-marked') && (
                            <Flag className="absolute -top-1 -left-1 h-2 w-2 text-yellow-400 bg-white rounded-full p-0.5" />
                          )}
                          {status === 'answered-marked' && (
                            <CheckCircle className="absolute -top-1 -right-1 h-2 w-2 text-green-400 bg-white rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-2 gap-3 text-center mb-4">
                    {(() => {
                      const counts = getQuestionStatusCounts();
                      return (
                        <>
                          <div className="bg-white/50 rounded-lg p-3">
                            <div className="text-lg font-bold text-blue-800">{counts.answered + counts.answeredMarked}</div>
                            <div className="text-xs text-gray-600">Answered</div>
                          </div>
                          <div className="bg-white/50 rounded-lg p-3">
                            <div className="text-lg font-bold text-red-600">{counts.notAnswered}</div>
                            <div className="text-xs text-gray-600">Not Answered</div>
                          </div>
                          <div className="bg-white/50 rounded-lg p-3">
                            <div className="text-lg font-bold text-purple-600">{counts.marked + counts.answeredMarked}</div>
                            <div className="text-xs text-gray-600">Marked</div>
                          </div>
                          <div className="bg-white/50 rounded-lg p-3">
                            <div className="text-lg font-bold text-gray-600">{counts.notVisited}</div>
                            <div className="text-xs text-gray-600">Not Visited</div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    {(() => {
                      const counts = getQuestionStatusCounts();
                      const totalAnswered = counts.answered + counts.answeredMarked;
                      const progressPercentage = Math.round((totalAnswered / quiz.questions.length) * 100);
                      return (
                        <>
                          <div className="flex justify-between text-sm text-gray-700 mb-2">
                            <span>Progress</span>
                            <span>{progressPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-300 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Quick Actions */}
                  {markedQuestions.size > 0 && (
                    <div className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const firstMarkedIndex = quiz.questions.findIndex(q => markedQuestions.has(q._id));
                          if (firstMarkedIndex !== -1) {
                            navigateToQuestion(firstMarkedIndex);
                          }
                        }}
                        className="border-yellow-400/50 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-400 transition-all duration-300 w-full"
                      >
                        <Flag className="h-3 w-3 mr-1" />
                        Go to First Marked
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
