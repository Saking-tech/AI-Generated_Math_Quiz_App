"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "../../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import GlassSurface from "@/components/GlassSurface";
import TextType from "@/components/TextType";
import DotGrid from "@/components/DotGrid";
import { Plus, ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

export default function CreateQuizPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const createQuiz = useMutation(api.quizzes.createQuiz);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsCreating(true);
    try {
      const quizId = await createQuiz({
        title: formData.title,
        description: formData.description || undefined,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        createdBy: currentUser._id as any,
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
    <div className="min-h-screen relative">
      {/* Content */}
      <div className="relative z-10 mobile-padding tablet-padding desktop-padding py-8 mobile:py-12">
        {/* Header Section */}
        <div className="text-center mb-8 mobile:mb-12">
          <h1 className="text-mobile-hero font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            <TextType
              text={["Create New Quiz", "Build Your Quiz", "Design Your Quiz", "Craft Your Quiz"]}
              typingSpeed={80}
              className="text-center"
            />
          </h1>

          <p className="text-mobile-body text-gray-300 max-w-2xl mx-auto">
            Start building your next amazing quiz experience with our intuitive creation tools
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-6xl mx-auto">
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={20}
            backgroundOpacity={0.7}
            opacity={0.9}
            blur={20}
            blueOffset={50}
            className="p-6 mobile:p-8 bg-purple-300/20"
          >
            {/* 2x2 Form Grid - Below Header */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mobile:gap-8">
                {/* Quiz Title - Top Left */}
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-lg font-semibold text-purple-300">
                    Quiz Title *
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter an engaging quiz title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                    className="h-12 bg-white/10 border-purple-400/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-base"
                  />
                </div>

                {/* Duration - Top Right */}
                <div className="space-y-3">
                  <Label htmlFor="duration" className="text-lg font-semibold text-purple-300">
                    Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="How long should this quiz take? (optional)"
                    value={formData.duration}
                    onChange={(e) => handleChange("duration", e.target.value)}
                    min="1"
                    className="h-12 bg-white/10 border-purple-400/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-base"
                  />
                </div>

                {/* Description - Bottom Left */}
                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="description" className="text-lg font-semibold text-purple-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this quiz is about (optional)"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={4}
                    className="bg-white/10 border-purple-400/30 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none text-base"
                  />
                </div>
              </div>

              {/* Action Buttons - Below Grid */}
              <div className="flex flex-col mobile:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isCreating || !formData.title.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating Quiz...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-3" />
                      Create Quiz
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1 mobile:flex-none bg-transparent border-purple-400/30 text-purple-300 hover:bg-purple-600/20 hover:text-white px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105"
                >
                  <ArrowLeft className="h-5 w-5 mr-3" />
                  Cancel
                </Button>
              </div>
            </form>
          </GlassSurface>
        </div>
      </div>
    </div>
  );
}
