"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect } from "react";
import { useMutation } from "convex/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, BookOpen, Users, Trophy } from "lucide-react";

export default function Home() {
  const { user, isLoaded } = useUser();
  const createUser = useMutation(api.users.createUser);
  const userData = useQuery(api.users.getUserByClerkId, 
    user ? { clerkId: user.id } : "skip"
  );

  useEffect(() => {
    if (isLoaded && user && !userData) {
      // Create user in Convex if it doesn't exist
      createUser({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.fullName || "",
        role: "general", // Default role, can be changed later
      });
    }
  }, [user, userData, isLoaded, createUser]);

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to Quiz Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create engaging quizzes or test your knowledge with our comprehensive quiz platform.
              Join thousands of learners and educators worldwide.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/sign-in">Get Started</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <Card>
              <CardHeader>
                <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Create Quizzes</CardTitle>
                <CardDescription>
                  Design interactive quizzes with multiple question types including MCQs and short answers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Engage Students</CardTitle>
                <CardDescription>
                  Share your quizzes with students and track their progress in real-time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Trophy className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Track Performance</CardTitle>
                <CardDescription>
                  Monitor quiz results and analyze performance with detailed analytics.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Quiz Platform</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.firstName}</span>
              <Button variant="outline" size="sm">
                <Link href="/profile">Profile</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quiz Master Section */}
          {userData?.role === "quiz-master" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Quiz Master Dashboard
                </CardTitle>
                <CardDescription>
                  Create and manage your quizzes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/dashboard/quizzes">My Quizzes</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/create-quiz">Create New Quiz</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Available Quizzes Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Available Quizzes
              </CardTitle>
              <CardDescription>
                Take quizzes and test your knowledge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/quizzes">Browse Quizzes</Link>
              </Button>
            </CardContent>
          </Card>

          {/* My Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                My Results
              </CardTitle>
              <CardDescription>
                View your quiz attempts and scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/results">View Results</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Role Management */}
          {userData?.role === "general" && (
            <Card>
              <CardHeader>
                <CardTitle>Become a Quiz Master</CardTitle>
                <CardDescription>
                  Upgrade to create your own quizzes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/upgrade">Request Upgrade</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
