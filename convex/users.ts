import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Simple password hashing (in production, use bcrypt or similar)
function hashPassword(password: string): string {
  // This is a simple hash for demo purposes
  // In production, use a proper hashing library like bcrypt
  return btoa(password + "salt");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export const signUp = mutation({
  args: {
    username: v.string(),
    password: v.string(),
    role: v.union(v.literal("quiz-master"), v.literal("general")),
  },
  handler: async (ctx, args) => {
    // Check if username already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (existingUser) {
      throw new Error("Username already exists");
    }

    // Validate password length
    if (args.password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      username: args.username,
      password: hashPassword(args.password),
      role: args.role,
      createdAt: Date.now(),
    });

    return userId;
  },
});

export const signIn = query({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // First try to find by username
    let user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    // If not found by username, try to find by email (for migration)
    if (!user) {
      const users = await ctx.db.query("users").collect();
      user = users.find(u => u.email === args.username);
    }

    if (!user) {
      throw new Error("Invalid username or password");
    }

    // If user doesn't have password yet (migration case), set default
    if (!user.password) {
      const defaultPassword = "password123";
      if (args.password !== defaultPassword) {
        throw new Error("Invalid username or password");
      }
      
      // Migrate the user
      const username = user.email ? user.email.split('@')[0] : `user_${user._id}`;
      await ctx.db.patch(user._id, {
        username,
        password: hashPassword(defaultPassword),
        fullName: user.name,
      });
      
      // Update user object
      user = { ...user, username, password: hashPassword(defaultPassword), fullName: user.name };
    }

    if (!verifyPassword(args.password, user.password)) {
      throw new Error("Invalid username or password");
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
});

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
});

export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    fullName: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    return await ctx.db.patch(userId, updates);
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("quiz-master"), v.literal("general")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.userId, {
      role: args.role,
    });
  },
});
