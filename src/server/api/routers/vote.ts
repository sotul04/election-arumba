import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Position, Role, type Candidate } from "@prisma/client";

export const voteRouter = createTRPCRouter({
    getCandidates: protectedProcedure
        .query(async ({ ctx }) => {
            const candidates = await ctx.db.candidate.findMany();

            const groupedCandidates = Object.values(Position).reduce((acc, position) => {
                acc[position] = candidates.filter(c => c.position === position);
                return acc;
            }, {} as Record<Position, typeof candidates>);

            return groupedCandidates;
        }),
    vote: protectedProcedure
        .input(
            z.object({
                KETUA: z.number().nullable(),
                BENDAHARA: z.number().nullable(),
                SEKRETARIS: z.number().nullable(),
                KADIV_INTERNAL: z.number().nullable(),
                KADIV_HUMAS: z.number().nullable(),
                KADIV_INFORMASI_DAN_KREASI: z.number().nullable(),
                KADIV_EVENTS: z.number().nullable(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { user } = ctx.session;

            const hasVoted = await ctx.db.user.findUnique({
                where: { id: user.id },
                select: { hasVoted: true, hasProfile: true },
            });

            if (!hasVoted?.hasProfile) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "User has to fill the profile first" });
            }

            if (hasVoted?.hasVoted) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "User has already voted" });
            }

            const timeline = await ctx.db.timeline.findFirst();
            const now = new Date();
            if (!timeline || now < timeline.start || now > timeline.end) {
                throw new TRPCError({ code: "FORBIDDEN", message: "Voting is not open" });
            }

            await ctx.db.$transaction(async (tx) => {
                await Promise.all(
                    Object.entries(input).map(async ([position, candidateId]) => {
                        await tx.vote.create({
                            data: {
                                voterId: user.id,
                                candidateId: candidateId,
                                position: position as Position,
                            },
                        });
                    })
                );

                await tx.user.update({
                    where: { id: user.id },
                    data: { hasVoted: true },
                });
            });
        }),
    getVotingResult: protectedProcedure.use(async ({ ctx, next }) => {
        if (ctx.session.user.role !== Role.ADMIN) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return next();
    }).query(async ({ ctx }) => {
        const votes = await ctx.db.vote.groupBy({
            by: ["position", "candidateId"],
            _count: { _all: true },
        });

        console.log("Result:", votes)

        const totalVoters = await ctx.db.user.count({ where: { role: Role.VOTER } });

        const result: Record<string, { candidates: any[]; total: number; abstain: number }> = {};

        for (const position of Object.values(Position)) {
            const positionVotes = votes.filter((v) => v.position === position);
            const abstainCount = positionVotes.find((v) => v.candidateId === null)?._count._all || 0;

            const candidates = await ctx.db.candidate.findMany({
                where: { position },
                select: { id: true, fullname: true, university: true, generation: true, major: true },
            });

            const candidatesWithCount = candidates.map((candidate) => ({
                ...candidate,
                count: positionVotes.find((v) => v.candidateId === candidate.id)?._count._all || 0,
            }));

            result[position] = {
                candidates: candidatesWithCount,
                total: totalVoters,
                abstain: abstainCount,
            };
        }

        return result;
    }),
})