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
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{quiz.title}</CardTitle>
                {quiz.description && (
                  <p className="text-gray-600">{quiz.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Questions:</span>
                    <span>{quiz.questions.length}</span>
                  </div>
                  {quiz.duration && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Duration:</span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDuration(quiz.duration)}
                      </span>
                    </div>
                  )}
                  <div className="pt-4">
                    <Button onClick={handleStartQuiz} className="w-full">
                      Start Quiz
                    </Button>
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">{quiz.title}</h1>
            <div className="flex items-center space-x-4">
              {timeLeft !== null && (
                <div className={`flex items-center ${timeLeft < 300 ? 'text-red-600' : 'text-gray-600'}`}>
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTime(timeLeft)}
                </div>
              )}
              <span className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Question {currentQuestion + 1}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {question.points} point{question.points !== 1 ? 's' : ''}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-lg">{question.questionText}</p>

                {question.questionType === "mcq_single" && (
                  <RadioGroup
                    value={answers[question._id]?.[0] || ""}
                    onValueChange={(value) => handleAnswerChange(question._id, value)}
                  >
                    {question.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1">
                          {String.fromCharCode(65 + index)}. {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {question.questionType === "mcq_multiple" && (
                  <div className="space-y-2">
                    {question.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
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
                        />
                        <Label htmlFor={`option-${index}`} className="flex-1">
                          {String.fromCharCode(65 + index)}. {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}

                {question.questionType === "short_answer" && (
                  <Input
                    value={answers[question._id]?.[0] || ""}
                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                    placeholder="Enter your answer"
                  />
                )}

                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </Button>
                  
                  {isLastQuestion ? (
                    <Button
                      onClick={handleSubmitQuiz}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Quiz"}
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress indicator */}
          <div className="mt-6">
            <div className="flex space-x-2">
              {quiz.questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    index === currentQuestion
                      ? 'bg-blue-600 text-white'
                      : answers[quiz.questions[index]._id]
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
