"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function CreateQuizPage() {
  const { user } = useUser();
  const router = useRouter();
  const userData = useQuery(api.users.getUserByClerkId, 
    user ? { clerkId: user.id } : "skip"
  );
  const createQuiz = useMutation(api.quizzes.createQuiz);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    setIsCreating(true);
    try {
      const quizId = await createQuiz({
        title: formData.title,
        description: formData.description || undefined,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        createdBy: userData._id,
      });
      
      router.push(`/dashboard/quizzes/${quizId}`);
    } catch (error) {
      console.error("Error creating quiz:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Quiz</h1>
      
      <Card className="bg-purple-200">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">Quiz Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title *</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter quiz title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter quiz description (optional)"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="Enter duration in minutes (optional)"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                min="1"
              />
            </div>

            <div className="flex space-x-4">
              <Button 
                type="submit" 
                disabled={isCreating || !formData.title.trim()}
              >
                {isCreating ? "Creating..." : "Create Quiz"}
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
  );
}
