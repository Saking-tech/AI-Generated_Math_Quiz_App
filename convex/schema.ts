import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("quiz-master"), v.literal("general")),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  quizzes: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    createdBy: v.id("users"),
    isPublished: v.boolean(),
    duration: v.optional(v.number()), // in minutes
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_creator", ["createdBy"]),

  questions: defineTable({
    quizId: v.id("quizzes"),
    questionText: v.string(),
    questionType: v.union(
      v.literal("mcq_single"),
      v.literal("mcq_multiple"), 
      v.literal("short_answer")
    ),
    options: v.optional(v.array(v.string())), // For MCQ questions
    correctAnswers: v.array(v.string()), // Can be multiple for MCQ multiple choice
    points: v.number(),
    order: v.number(),
  }).index("by_quiz", ["quizId"]),

  quizAttempts: defineTable({
    quizId: v.id("quizzes"),
    userId: v.id("users"),
    answers: v.array(v.object({
      questionId: v.id("questions"),
      selectedAnswers: v.array(v.string()),
    })),
    score: v.number(),
    totalPoints: v.number(),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    isCompleted: v.boolean(),
  }).index("by_user", ["userId"])
    .index("by_quiz", ["quizId"]),
});
