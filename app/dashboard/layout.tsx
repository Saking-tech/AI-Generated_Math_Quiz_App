"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const userData = useQuery(api.users.getUserByClerkId, 
    user ? { clerkId: user.id } : "skip"
  );

  useEffect(() => {
    if (isLoaded && userData && userData.role !== "quiz-master") {
      router.push("/");
    }
  }, [userData, isLoaded, router]);

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user || (userData && userData.role !== "quiz-master")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need to be a quiz master to access this area.</p>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Quiz Platform
              </Link>
              <nav className="flex space-x-4">
                <Link href="/dashboard/quizzes" className="text-gray-600 hover:text-gray-900">
                  My Quizzes
                </Link>
                <Link href="/dashboard/create-quiz" className="text-gray-600 hover:text-gray-900">
                  Create Quiz
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Quiz Master</span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/">Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
