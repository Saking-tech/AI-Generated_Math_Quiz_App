"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Crown, CheckCircle, ArrowLeft } from "lucide-react";

export default function UpgradePage() {
  const { user } = useUser();
  const router = useRouter();
  const userData = useQuery(api.users.getUserByClerkId, 
    user ? { clerkId: user.id } : "skip"
  );
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
    if (!userData) return;

    setIsUpgrading(true);
    try {
      // For demo purposes, we'll immediately upgrade the user
      // In a real application, this would typically require admin approval
      await updateUserRole({
        userId: userData._id,
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
                  You've been successfully upgraded to Quiz Master status!
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

  if (userData?.role === "quiz-master") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="text-center py-8">
                <Crown className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-4">You're Already a Quiz Master!</h1>
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Upgrade to Quiz Master</h1>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Benefits Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="h-5 w-5 mr-2 text-yellow-600" />
                Quiz Master Benefits
              </CardTitle>
              <CardDescription>
                Unlock the full potential of our quiz platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Create Unlimited Quizzes</h4>
                  <p className="text-sm text-gray-600">Design and publish as many quizzes as you need</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Multiple Question Types</h4>
                  <p className="text-sm text-gray-600">MCQs, multiple choice, and short answer questions</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Student Analytics</h4>
                  <p className="text-sm text-gray-600">Track student performance and quiz statistics</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Quiz Management</h4>
                  <p className="text-sm text-gray-600">Edit, publish, and manage your quiz content</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade Request Form */}
          <Card>
            <CardHeader>
              <CardTitle>Request Quiz Master Access</CardTitle>
              <CardDescription>
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
