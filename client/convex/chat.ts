import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
    args: {
        user: v.string(),
        body: v.string(),
        discussionId: v.string(),
    },
    handler: async (ctx, args) => {
        console.log("This TypeScript function running on the server.");
        await ctx.db.insert("messages", {
            user: args.user,
            body: args.body,
            discussionId: args.discussionId,
        });
    },
});

export const getMessages = query({
    args: {discussionId: v.string()},
    handler: async (ctx, args) => {
        // Get most recent messages first
        const messages = await ctx.db.query("messages")
        .filter((q) => q.eq(q.field("discussionId"), args.discussionId))
        .order("desc").take(50);
        // Reverse the list so that it's in a chronological order.
        return messages.reverse();
    },
});