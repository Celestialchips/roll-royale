import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema(
  {
    // Keep auth tables for compatibility but won't be used
    ...authTables,

    drawSessions: defineTable({
      names: v.array(v.string()),
      items: v.array(v.object({
        name: v.string(),
        cooldown: v.number(),
      })),
      cooldowns: v.record(v.string(), v.number()),
      history: v.array(v.object({
        itemName: v.string(),
        winner: v.string(),
        timestamp: v.number(),
        cooldownDuration: v.number(),
      })),
      audioSelections: v.optional(v.record(v.string(), v.string())),
    }),

    // Feature requests
    featureRequests: defineTable({
      feature: v.string(),
      description: v.string(),
      priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
      category: v.union(v.literal("feature"), v.literal("bug"), v.literal("improvement")),
      createdAt: v.number(),
    })
    .index("by_createdAt", ["createdAt"]),

    // Global cooldowns tracked by item name
    globalCooldowns: defineTable({
      itemName: v.string(),
      participantName: v.string(),
      cooldownEnd: v.number(),
    })
      .index("by_itemName", ["itemName"])
      .index("by_participantName", ["participantName"])
      .index("by_itemName_and_participantName", ["itemName", "participantName"]),

    // Global history of all rolls
    globalHistory: defineTable({
      itemName: v.string(),
      winner: v.string(),
      timestamp: v.number(),
      cooldownDuration: v.number(),
      sessionId: v.id("drawSessions"),
    })
      .index("by_timestamp", ["timestamp"])
      .index("by_itemName", ["itemName"])
      .index("by_winner", ["winner"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;