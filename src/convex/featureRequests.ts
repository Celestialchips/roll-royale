import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submitFeatureRequest = mutation({
  args: {
    feature: v.string(),
    description: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    category: v.union(v.literal("feature"), v.literal("bug"), v.literal("improvement")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("featureRequests", {
      ...args,
      createdAt: Date.now(),
    });
  },
});