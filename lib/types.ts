import { Id } from "../convex/_generated/dataModel";

// Type aliases for Convex IDs to avoid 'any' type usage
export type QuizId = Id<"quizzes">;
export type QuestionId = Id<"questions">;
export type AttemptId = Id<"quizAttempts">;
export type UserId = Id<"users">;

// Helper function to safely cast string to Convex ID
export const toQuizId = (id: string): QuizId => id as QuizId;
export const toQuestionId = (id: string): QuestionId => id as QuestionId;
export const toAttemptId = (id: string): AttemptId => id as AttemptId;
export const toUserId = (id: string): UserId => id as UserId;
