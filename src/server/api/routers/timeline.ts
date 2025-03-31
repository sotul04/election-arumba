import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const timelineRouter = createTRPCRouter({
    getTimeline: publicProcedure
        .query(async ({ ctx }) => {
            const timeline = await ctx.db.timeline.findFirst()

            if (!timeline) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Timeline not found"
                })
            }

            return timeline;
        })
})