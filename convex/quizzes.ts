import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createQuiz = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    createdBy: v.id("users"),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("quizzes", {
      ...args,
      isPublished: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateQuiz = mutation({
  args: {
    quizId: v.id("quizzes"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    duration: v.optional(v.number()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { quizId, ...updates } = args;
    const fieldsToUpdate: any = { ...updates, updatedAt: Date.now() };
    
    // Remove undefined values
    Object.keys(fieldsToUpdate).forEach(key => {
      if (fieldsToUpdate[key] === undefined) {
        delete fieldsToUpdate[key];
      }
    });

    return await ctx.db.patch(quizId, fieldsToUpdate);
  },
});

export const deleteQuiz = mutation({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, args) => {
    // Delete all questions first
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_quiz", (q) => q.eq("quizId", args.quizId))
      .collect();
    
    for (const question of questions) {
      await ctx.db.delete(question._id);
    }

    // Delete all quiz attempts
    const attempts = await ctx.db
      .query("quizAttempts")
      .withIndex("by_quiz", (q) => q.eq("quizId", args.quizId))
      .collect();
    
    for (const attempt of attempts) {
      await ctx.db.delete(attempt._id);
    }

    // Delete the quiz
    return await ctx.db.delete(args.quizId);
  },
});

export const getQuizzesByCreator = query({
  args: { creatorId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quizzes")
      .withIndex("by_creator", (q) => q.eq("createdBy", args.creatorId))
      .order("desc")
      .collect();
  },
});

export const getPublishedQuizzes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("quizzes")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .order("desc")
      .collect();
  },
});

export const getQuizById = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.quizId);
  },
});

export const getQuizWithQuestions = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, args) => {
    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) return null;

    const questions = await ctx.db
      .query("questions")
      .withIndex("by_quiz", (q) => q.eq("quizId", args.quizId))
      .order("asc")
      .collect();

    return {
      ...quiz,
      questions,
    };
  },
});
