import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Export quiz with all questions in JSON format
export const exportQuizJson = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, args) => {
    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    const questions = await ctx.db
      .query("questions")
      .withIndex("by_quiz", (q) => q.eq("quizId", args.quizId))
      .order("asc")
      .collect();

    return {
      quiz: {
        title: quiz.title,
        description: quiz.description,
        duration: quiz.duration,
        isPublished: quiz.isPublished,
      },
      questions: questions.map((q) => ({
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options,
        correctAnswers: q.correctAnswers,
        points: q.points,
        order: q.order,
      })),
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };
  },
});

// Import quiz from JSON format
export const importQuizJson = mutation({
  args: {
    createdBy: v.id("users"),
    quizData: v.object({
      quiz: v.object({
        title: v.string(),
        description: v.optional(v.string()),
        duration: v.optional(v.number()),
        isPublished: v.optional(v.boolean()),
      }),
      questions: v.array(v.object({
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
      })),
      version: v.optional(v.string()),
      exportedAt: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Create the quiz
    const quizId = await ctx.db.insert("quizzes", {
      title: args.quizData.quiz.title,
      description: args.quizData.quiz.description,
      createdBy: args.createdBy,
      isPublished: args.quizData.quiz.isPublished || false,
      duration: args.quizData.quiz.duration,
      createdAt: now,
      updatedAt: now,
    });

    // Create the questions
    for (const questionData of args.quizData.questions) {
      await ctx.db.insert("questions", {
        quizId,
        questionText: questionData.questionText,
        questionType: questionData.questionType,
        options: questionData.options,
        correctAnswers: questionData.correctAnswers,
        points: questionData.points,
        order: questionData.order,
      });
    }

    return quizId;
  },
});

// Duplicate/clone an existing quiz
export const cloneQuiz = mutation({
  args: {
    sourceQuizId: v.id("quizzes"),
    createdBy: v.id("users"),
    newTitle: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const sourceQuiz = await ctx.db.get(args.sourceQuizId);
    if (!sourceQuiz) {
      throw new Error("Source quiz not found");
    }

    const questions = await ctx.db
      .query("questions")
      .withIndex("by_quiz", (q) => q.eq("quizId", args.sourceQuizId))
      .order("asc")
      .collect();

    const now = Date.now();
    
    // Create the new quiz
    const newQuizId = await ctx.db.insert("quizzes", {
      title: args.newTitle || `${sourceQuiz.title} (Copy)`,
      description: sourceQuiz.description,
      createdBy: args.createdBy,
      isPublished: false, // Always start as draft
      duration: sourceQuiz.duration,
      createdAt: now,
      updatedAt: now,
    });

    // Clone all questions
    for (const question of questions) {
      await ctx.db.insert("questions", {
        quizId: newQuizId,
        questionText: question.questionText,
        questionType: question.questionType,
        options: question.options,
        correctAnswers: question.correctAnswers,
        points: question.points,
        order: question.order,
      });
    }

    return newQuizId;
  },
});
