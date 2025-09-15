"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Crown, CheckCircle, BookOpen, FileText, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function UpgradePage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const updateUserRole = useMutation(api.users.updateUserRole);

  const [formData, setFormData] = useState({
    organization: "",
    purpose: "",
    experience: "",
  });
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgraded, setUpgraded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsUpgrading(true);
    try {
      // For demo purposes, we'll immediately upgrade the user
      // In a real application, this would typically require admin approval
      await updateUserRole({
        userId: currentUser._id,
        role: "quiz-master",
      });
      setUpgraded(true);
    } catch (error) {
      console.error("Error upgrading user:", error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (upgraded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-4">Congratulations!</h1>
                <p className="text-lg text-gray-600 mb-6">
                  You&apos;ve been successfully upgraded to Quiz Master status!
                </p>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    You can now create and manage your own quizzes. Start building engaging content for your students!
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button asChild>
                      <Link href="/dashboard/create-quiz">Create Your First Quiz</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/dashboard/quizzes">Go to Dashboard</Link>
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

  if (currentUser?.role === "quiz-master") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="text-center py-8">
                <Crown className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-4">You&apos;re Already a Quiz Master!</h1>
                <p className="text-lg text-gray-600 mb-6">
                  You already have quiz master privileges and can create quizzes.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button asChild>
                    <Link href="/dashboard/quizzes">My Quizzes</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">Home</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Navigation */}
      <Navigation />
      
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Upgrade to Quiz Master
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button asChild variant="outline" className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400">
                <Link href="/quizzes">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Quizzes
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400">
                <Link href="/results">
                  <FileText className="h-4 w-4 mr-2" />
                  My Results
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-purple-400/50 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400">
                <Link href="/leaderboard">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Leaderboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Benefits Card */}
          <Card className="bg-purple-200 backdrop-blur-xl border border-purple-300/50">
            <CardHeader>
              <CardTitle className="flex items-center bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
                <Crown className="h-5 w-5 mr-2 text-yellow-600" />
                Quiz Master Benefits
              </CardTitle>
              <CardDescription className="text-gray-700">
                Unlock the full potential of our quiz platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">Create Unlimited Quizzes</h4>
                  <p className="text-sm text-gray-600">Design and publish as many quizzes as you need</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">Multiple Question Types</h4>
                  <p className="text-sm text-gray-600">MCQs, multiple choice, and short answer questions</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">Student Analytics</h4>
                  <p className="text-sm text-gray-600">Track student performance and quiz statistics</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">Quiz Management</h4>
                  <p className="text-sm text-gray-600">Edit, publish, and manage your quiz content</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade Request Form */}
          <Card className="bg-purple-200 backdrop-blur-xl border border-purple-300/50">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">Request Quiz Master Access</CardTitle>
              <CardDescription className="text-gray-700">
                Tell us about yourself and how you plan to use the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization/Institution *</Label>
                  <Input
                    id="organization"
                    type="text"
                    placeholder="Enter your school, company, or organization"
                    value={formData.organization}
                    onChange={(e) => handleChange("organization", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">How will you use Quiz Master features? *</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Describe how you plan to use the quiz platform (e.g., classroom teaching, training, assessments)"
                    value={formData.purpose}
                    onChange={(e) => handleChange("purpose", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Teaching/Training Experience</Label>
                  <Textarea
                    id="experience"
                    placeholder="Tell us about your background in education or training (optional)"
                    value={formData.experience}
                    onChange={(e) => handleChange("experience", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Note</h4>
                  <p className="text-sm text-blue-800">
                    For demonstration purposes, your upgrade will be processed immediately. 
                    In a production environment, this would typically require administrator approval.
                  </p>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    type="submit" 
                    disabled={isUpgrading || !formData.organization.trim() || !formData.purpose.trim()}
                    className="flex-1"
                  >
                    {isUpgrading ? "Processing..." : "Request Upgrade"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
