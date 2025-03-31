import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
    getProfile: protectedProcedure
        .query(async ({ ctx }) => {
            const { session, db } = ctx;

            const userWithProfile = await db.user.findUnique({
                where: {
                    id: session.user.id
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    major: true,
                    university: true,
                    generation: true,
                    waNumber: true,
                    lineId: true,
                }
            });

            if (!userWithProfile) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found"
                });
            }

            return userWithProfile
        }),
    setProfile: protectedProcedure
        .input(z.object({
            name: z.string().min(2),
            major: z.string().min(3),
            university: z.string().min(2),
            generation: z.number().min(1),
            waNumber: z.string().refine(value => /^[0-9]+$/.test(value) ? true : !value, { message: "Invalid phone number" }).optional(),
            lineId: z.string().optional(),
        }).refine(data => {
            return !!data.waNumber || !!data.lineId;
        }))
        .mutation(async ({ ctx, input }) => {
            const { session, db } = ctx;

            const user = await db.user.findUnique({
                where: {
                    id: session.user.id
                }
            });

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found"
                });
            }

            await db.user.update({
                where: {
                    id: session.user.id
                },
                data: {
                    name: input.name,
                    major: input.major,
                    university: input.university,
                    generation: input.generation,
                    waNumber: input.waNumber,
                    lineId: input.lineId,
                    hasProfile: true
                }
            })
        }),
    getUserStatus: protectedProcedure
        .query(async ({ ctx }) => {
            const user = await ctx.db.user.findUnique({
                where: {
                    id: ctx.session.user.id
                },
                select: {
                    hasProfile: true,
                    hasVoted: true
                }
            });

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found"
                });
            }

            return user

        })
})