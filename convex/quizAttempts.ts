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

export const getGlobalLeaderboard = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    // Get all completed quiz attempts
    const attempts = await ctx.db
      .query("quizAttempts")
      .filter((q) => q.eq(q.field("isCompleted"), true))
      .collect();

    // Group by user and calculate total score and quiz count
    const userStats = new Map();
    
    for (const attempt of attempts) {
      const userId = attempt.userId;
      const user = await ctx.db.get(userId);
      
      if (!user) continue;
      
      if (!userStats.has(userId)) {
        userStats.set(userId, {
          userId,
          userName: user.name,
          userEmail: user.email,
          totalScore: 0,
          totalQuizzes: 0,
          averageScore: 0,
          bestScore: 0,
          lastAttempt: 0,
        });
      }
      
      const stats = userStats.get(userId);
      stats.totalScore += attempt.score;
      stats.totalQuizzes += 1;
      stats.bestScore = Math.max(stats.bestScore, attempt.score);
      stats.lastAttempt = Math.max(stats.lastAttempt, attempt.completedAt || 0);
    }
    
    // Calculate average scores and sort by total score
    const leaderboard = Array.from(userStats.values())
      .map(stats => ({
        ...stats,
        averageScore: stats.totalQuizzes > 0 ? stats.totalScore / stats.totalQuizzes : 0,
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit);
    
    return leaderboard;
  },
});

export const getQuizLeaderboard = query({
  args: { quizId: v.id("quizzes"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    // Get all completed attempts for this quiz
    const attempts = await ctx.db
      .query("quizAttempts")
      .withIndex("by_quiz", (q) => q.eq("quizId", args.quizId))
      .filter((q) => q.eq(q.field("isCompleted"), true))
      .order("desc")
      .collect();

    // Get user details and sort by score
    const leaderboard = await Promise.all(
      attempts.slice(0, limit).map(async (attempt) => {
        const user = await ctx.db.get(attempt.userId);
        return {
          attemptId: attempt._id,
          userId: attempt.userId,
          userName: user?.name || "Unknown User",
          userEmail: user?.email || "",
          score: attempt.score,
          totalPoints: attempt.totalPoints,
          percentage: attempt.totalPoints > 0 ? (attempt.score / attempt.totalPoints) * 100 : 0,
          completedAt: attempt.completedAt || 0,
          timeTaken: attempt.completedAt ? attempt.completedAt - attempt.startedAt : 0,
        };
      })
    );
    
    return leaderboard;
  },
});

export const getUserStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const attempts = await ctx.db
      .query("quizAttempts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isCompleted"), true))
      .collect();

    if (attempts.length === 0) {
      return {
        totalQuizzes: 0,
        totalScore: 0,
        averageScore: 0,
        bestScore: 0,
        rank: null,
        recentAttempts: [],
      };
    }

    const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
    const bestScore = Math.max(...attempts.map(attempt => attempt.score));
    const averageScore = totalScore / attempts.length;

    // Get recent attempts with quiz info
    const recentAttempts = await Promise.all(
      attempts
        .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
        .slice(0, 5)
        .map(async (attempt) => {
          const quiz = await ctx.db.get(attempt.quizId);
          return {
            ...attempt,
            quiz,
          };
        })
    );

    // Calculate global rank
    const allAttempts = await ctx.db
      .query("quizAttempts")
      .filter((q) => q.eq(q.field("isCompleted"), true))
      .collect();

    const userStats = new Map();
    for (const attempt of allAttempts) {
      const userId = attempt.userId;
      if (!userStats.has(userId)) {
        userStats.set(userId, 0);
      }
      userStats.set(userId, userStats.get(userId) + attempt.score);
    }

    const sortedUsers = Array.from(userStats.entries())
      .sort((a, b) => b[1] - a[1]);
    
    const rank = sortedUsers.findIndex(([userId]) => userId === args.userId) + 1;

    return {
      totalQuizzes: attempts.length,
      totalScore,
      averageScore,
      bestScore,
      rank,
      recentAttempts,
    };
  },
});