import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createQuestion = mutation({
  args: {
    quizId: v.id("quizzes"),
    questionText: v.string(),
    questionType: v.union(
      v.literal("mcq_single"),
      v.literal("mcq_multiple"), 
      v.literal("short_answer")
    ),
    options: v.optional(v.array(v.string())),
    correctAnswers: v.array(v.string()),
    points: v.number(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("questions", args);
  },
});

export const updateQuestion = mutation({
  args: {
    questionId: v.id("questions"),
    questionText: v.optional(v.string()),
    questionType: v.optional(v.union(
      v.literal("mcq_single"),
      v.literal("mcq_multiple"), 
      v.literal("short_answer")
    )),
    options: v.optional(v.array(v.string())),
    correctAnswers: v.optional(v.array(v.string())),
    points: v.optional(v.number()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { questionId, ...updates } = args;
    
    // Remove undefined values
    const fieldsToUpdate: any = {};
    Object.keys(updates).forEach(key => {
      if (updates[key as keyof typeof updates] !== undefined) {
        fieldsToUpdate[key] = updates[key as keyof typeof updates];
      }
    });

    return await ctx.db.patch(questionId, fieldsToUpdate);
  },
});

export const deleteQuestion = mutation({
  args: { questionId: v.id("questions") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.questionId);
  },
});

export const getQuestionsByQuiz = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("questions")
      .withIndex("by_quiz", (q) => q.eq("quizId", args.quizId))
      .order("asc")
      .collect();
  },
});

export const reorderQuestions = mutation({
  args: {
    questionUpdates: v.array(v.object({
      questionId: v.id("questions"),
      order: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    for (const update of args.questionUpdates) {
      await ctx.db.patch(update.questionId, { order: update.order });
    }
  },
});
