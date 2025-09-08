import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const startQuizAttempt = mutation({
  args: {
    quizId: v.id("quizzes"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Check if user already has an incomplete attempt
    const existingAttempt = await ctx.db
      .query("quizAttempts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.and(
        q.eq(q.field("quizId"), args.quizId),
        q.eq(q.field("isCompleted"), false)
      ))
      .first();

    if (existingAttempt) {
      return existingAttempt._id;
    }

    return await ctx.db.insert("quizAttempts", {
      quizId: args.quizId,
      userId: args.userId,
      answers: [],
      score: 0,
      totalPoints: 0,
      startedAt: Date.now(),
      isCompleted: false,
    });
  },
});

export const submitQuizAttempt = mutation({
  args: {
    attemptId: v.id("quizAttempts"),
    answers: v.array(v.object({
      questionId: v.id("questions"),
      selectedAnswers: v.array(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const attempt = await ctx.db.get(args.attemptId);
    if (!attempt) throw new Error("Attempt not found");

    // Calculate score
    let score = 0;
    let totalPoints = 0;

    for (const answer of args.answers) {
      const question = await ctx.db.get(answer.questionId);
      if (!question) continue;

      totalPoints += question.points;

      // Check if answer is correct
      const correctAnswers = question.correctAnswers.sort();
      const userAnswers = answer.selectedAnswers.sort();
      
      const isCorrect = correctAnswers.length === userAnswers.length &&
        correctAnswers.every((answer, index) => answer === userAnswers[index]);

      if (isCorrect) {
        score += question.points;
      }
    }

    return await ctx.db.patch(args.attemptId, {
      answers: args.answers,
      score,
      totalPoints,
      completedAt: Date.now(),
      isCompleted: true,
    });
  },
});

export const getAttemptsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const attempts = await ctx.db
      .query("quizAttempts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    // Get quiz details for each attempt
    const attemptsWithQuizInfo = await Promise.all(
      attempts.map(async (attempt) => {
        const quiz = await ctx.db.get(attempt.quizId);
        return {
          ...attempt,
          quiz,
        };
      })
    );

    return attemptsWithQuizInfo;
  },
});

export const getAttemptsByQuiz = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, args) => {
    const attempts = await ctx.db
      .query("quizAttempts")
      .withIndex("by_quiz", (q) => q.eq("quizId", args.quizId))
      .filter((q) => q.eq(q.field("isCompleted"), true))
      .order("desc")
      .collect();

    // Get user details for each attempt
    const attemptsWithUserInfo = await Promise.all(
      attempts.map(async (attempt) => {
        const user = await ctx.db.get(attempt.userId);
        return {
          ...attempt,
          user,
        };
      })
    );

    return attemptsWithUserInfo;
  },
});

export const getAttemptDetails = query({
  args: { attemptId: v.id("quizAttempts") },
  handler: async (ctx, args) => {
    const attempt = await ctx.db.get(args.attemptId);
    if (!attempt) return null;

    const quiz = await ctx.db.get(attempt.quizId);
    const user = await ctx.db.get(attempt.userId);

    // Get questions with user answers
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_quiz", (q) => q.eq("quizId", attempt.quizId))
      .order("asc")
      .collect();

    const questionsWithAnswers = questions.map((question) => {
      const userAnswer = attempt.answers.find(
        (answer) => answer.questionId === question._id
      );
      return {
        ...question,
        userAnswer: userAnswer?.selectedAnswers || [],
      };
    });

    return {
      ...attempt,
      quiz,
      user,
      questions: questionsWithAnswers,
    };
  },
});
