import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Create a new draw session
export const createSession = mutation({
  args: {
    names: v.array(v.string()),
    items: v.array(v.object({
      name: v.string(),
      cooldown: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const sessionId = await ctx.db.insert("drawSessions", {
      userId: user._id,
      names: args.names,
      items: args.items,
      cooldowns: {},
      history: [],
    });

    return sessionId;
  },
});

// Get user's sessions
export const getUserSessions = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("drawSessions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

// Get a specific session
export const getSession = query({
  args: { sessionId: v.id("drawSessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      return null;
    }

    const user = await getCurrentUser(ctx);
    if (!user || session.userId !== user._id) {
      return null;
    }

    return session;
  },
});

// Perform a draw
export const performDraw = mutation({
  args: {
    sessionId: v.id("drawSessions"),
    itemIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    const user = await getCurrentUser(ctx);
    if (!user || session.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    const item = session.items[args.itemIndex];
    if (!item) {
      throw new Error("Item not found");
    }

    // Filter out names on cooldown
    const now = Date.now();
    const availableNames = session.names.filter((name) => {
      const cooldownEnd = session.cooldowns[name] || 0;
      return cooldownEnd <= now;
    });

    if (availableNames.length === 0) {
      throw new Error("No names available (all on cooldown)");
    }

    // Pick random name
    const winner = availableNames[Math.floor(Math.random() * availableNames.length)];

    // Update cooldown
    const newCooldowns = { ...session.cooldowns };
    newCooldowns[winner] = now + item.cooldown * 1000;

    // Add to history
    const newHistory = [
      ...session.history,
      {
        itemName: item.name,
        winner,
        timestamp: now,
        cooldownDuration: item.cooldown,
      },
    ];

    await ctx.db.patch(args.sessionId, {
      cooldowns: newCooldowns,
      history: newHistory,
    });

    return { winner, item: item.name };
  },
});

// Delete a session
export const deleteSession = mutation({
  args: { sessionId: v.id("drawSessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    const user = await getCurrentUser(ctx);
    if (!user || session.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.sessionId);
  },
});

// Reset cooldowns
export const resetCooldowns = mutation({
  args: { sessionId: v.id("drawSessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    const user = await getCurrentUser(ctx);
    if (!user || session.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.sessionId, {
      cooldowns: {},
    });
  },
});
