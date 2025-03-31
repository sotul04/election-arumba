import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Position } from "@prisma/client";

type CandidateResult = {
    id: number;
    fullname: string;
    university: string;
    generation: string;
    major: string;
    count: number;
};

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
    getVotingResult: protectedProcedure
        .query(async ({ ctx }) => {
            if (ctx.session.user.role !== "ADMIN") {
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            // Execute all queries concurrently
            const [voteResults, candidates, resultRow] = await Promise.all([
                ctx.db.vote.groupBy({
                    by: ["position", "candidateId"],
                    _count: { _all: true },
                }),
                ctx.db.candidate.findMany({
                    select: { id: true, fullname: true, university: true, generation: true, major: true, position: true },
                }),
                ctx.db.$queryRaw<
                    Array<{ totalVoters: number; abstainCounts: Record<string, number> }>
                >`
                    SELECT 
                        (SELECT COUNT(*) FROM "User" WHERE "role" = 'VOTER') AS "totalVoters",
                        jsonb_object_agg(v.position, COALESCE(a.count, 0)) AS "abstainCounts"
                    FROM (SELECT DISTINCT position FROM "Vote") v
                    LEFT JOIN (
                        SELECT position, COUNT(*) AS count 
                        FROM "Vote" 
                        WHERE "candidateId" IS NULL 
                        GROUP BY position
                    ) a ON v.position = a.position
                `,
            ]);

            // Ensure valid data
            const { totalVoters, abstainCounts } = resultRow[0] ?? { totalVoters: 0, abstainCounts: {} };

            // Prepare the final result in one loop
            const result: Record<string, { candidates: CandidateResult[]; total: number; abstain: number }> = {};

            for (const position of Object.values(Position)) {
                const positionVotes = voteResults.filter((v) => v.position === position);

                const candidatesWithCount = candidates
                    .filter((c) => c.position === position)
                    .map((candidate) => ({
                        ...candidate,
                        count: positionVotes.find((v) => v.candidateId === candidate.id)?._count._all || 0,
                    }));

                result[position] = {
                    candidates: candidatesWithCount,
                    total: totalVoters,
                    abstain: abstainCounts[position] || 0,
                };
            }

            return result;
        }),

})