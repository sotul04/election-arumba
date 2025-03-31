import { Prisma, Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    deleteUser: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const { user } = ctx.session;
            if (user.role !== "ADMIN") {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You are not authorized"
                })
            }

            const targetUser = await ctx.db.user.findUnique({
                where: {
                    id: input.id
                }
            });

            if (!targetUser || targetUser.id === user.id) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "User not found"
                })
            }

            await ctx.db.user.delete({
                where: {
                    id: input.id
                }
            });
        }),
    getUsers: protectedProcedure
        .input(z.object({
            cursor: z.string().nullable().optional(), // Cursor untuk infinite scroll
            limit: z.number().min(1).max(100).default(10), // Batasan jumlah user yang diambil
            sortBy: z.enum(["name", "email", "generation", "major", "university"]).optional(),
            sortOrder: z.enum(["asc", "desc"]).default("asc"),
            searchQuery: z.string().optional()
        }))
        .query(async ({ ctx, input }) => {
            if (ctx.session.user.role !== "ADMIN") {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You are not authorized"
                });
            }

            const where = {
                role: Role.VOTER,
                ...(input.searchQuery ? {
                    OR: [
                        { name: { contains: input.searchQuery, mode: Prisma.QueryMode.insensitive } },
                        { major: { contains: input.searchQuery, mode: Prisma.QueryMode.insensitive } },
                        { university: { contains: input.searchQuery, mode: Prisma.QueryMode.insensitive } }
                    ]
                } : {})
            };

            const users = await ctx.db.user.findMany({
                where,
                take: input.limit + 1, // Ambil 1 lebih banyak untuk mengetahui apakah ada data berikutnya
                cursor: input.cursor ? { id: input.cursor } : undefined,
                orderBy: input.sortBy ? { [input.sortBy]: input.sortOrder } : undefined,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    emailVerified: true,
                    image: true,
                    hasProfile: true,
                    hasVoted: true,
                    role: true,
                    major: true,
                    university: true,
                    generation: true,
                    waNumber: true,
                    lineId: true
                }
            });

            let nextCursor = null;
            if (users.length > input.limit) {
                nextCursor = users.pop()?.id || null; // Ambil ID terakhir sebagai cursor baru
            }

            return { users, nextCursor };
        })
})