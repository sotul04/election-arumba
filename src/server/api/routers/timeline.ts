import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const timelineRouter = createTRPCRouter({
    getTimeline: protectedProcedure
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