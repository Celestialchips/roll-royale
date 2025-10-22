import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new draw session (no auth required)
export const createSession = mutation({
  args: {
    names: v.array(v.string()),
    items: v.array(v.object({
      name: v.string(),
      cooldown: v.number(),
    })),
    audioFiles: v.optional(v.record(v.string(), v.id("_storage"))),
  },
  handler: async (ctx, args) => {
    const sessionId = await ctx.db.insert("drawSessions", {
      names: args.names,
      items: args.items,
      cooldowns: {},
      history: [],
      audioFiles: args.audioFiles,
    });

    return sessionId;
  },
});

// Get a specific session (public access)
export const getSession = query({
  args: { sessionId: v.id("drawSessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sessionId);
  },
});

// Get global history of all rolls
export const getGlobalHistory = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("globalHistory")
      .withIndex("by_timestamp")
      .order("desc")
      .take(100);
  },
});

// Get active global cooldowns
export const getGlobalCooldowns = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const allCooldowns = await ctx.db.query("globalCooldowns").collect();
    
    // Filter to only active cooldowns
    return allCooldowns.filter(cd => cd.cooldownEnd > now);
  },
});

// Perform a draw with global cooldown tracking
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

    const item = session.items[args.itemIndex];
    if (!item) {
      throw new Error("Item not found");
    }

    const now = Date.now();

    // Check both session cooldowns AND global cooldowns
    const globalCooldowns = await ctx.db
      .query("globalCooldowns")
      .withIndex("by_itemName", (q) => q.eq("itemName", item.name))
      .collect();

    const availableNames = session.names.filter((name) => {
      // Check session cooldown
      const sessionCooldownEnd = session.cooldowns[name] || 0;
      if (sessionCooldownEnd > now) {
        return false;
      }

      // Check global cooldown for this item name
      const globalCooldown = globalCooldowns.find(
        gc => gc.participantName === name && gc.cooldownEnd > now
      );
      return !globalCooldown;
    });

    if (availableNames.length === 0) {
      throw new Error("No names available (all on cooldown)");
    }

    // Pick random name
    const winner = availableNames[Math.floor(Math.random() * availableNames.length)];

    // Update session cooldown (convert hours to milliseconds)
    const newCooldowns = { ...session.cooldowns };
    newCooldowns[winner] = now + item.cooldown * 60 * 60 * 1000;

    // Add to session history
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

    // Update or create global cooldown (convert hours to milliseconds)
    const existingGlobalCooldown = await ctx.db
      .query("globalCooldowns")
      .withIndex("by_itemName_and_participantName", (q) => 
        q.eq("itemName", item.name).eq("participantName", winner)
      )
      .first();

    if (existingGlobalCooldown) {
      await ctx.db.patch(existingGlobalCooldown._id, {
        cooldownEnd: now + item.cooldown * 60 * 60 * 1000,
      });
    } else {
      await ctx.db.insert("globalCooldowns", {
        itemName: item.name,
        participantName: winner,
        cooldownEnd: now + item.cooldown * 60 * 60 * 1000,
      });
    }

    // Add to global history
    await ctx.db.insert("globalHistory", {
      itemName: item.name,
      winner,
      timestamp: now,
      cooldownDuration: item.cooldown,
      sessionId: args.sessionId,
    });

    // Get audio URL if exists
    let audioUrl = null;
    if (session.audioFiles && session.audioFiles[winner]) {
      audioUrl = await ctx.storage.getUrl(session.audioFiles[winner]);
    }

    return { winner, item: item.name, audioUrl };
  },
});

// Reset session cooldowns only (not global)
export const resetCooldowns = mutation({
  args: { sessionId: v.id("drawSessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    await ctx.db.patch(args.sessionId, {
      cooldowns: {},
    });
  },
});