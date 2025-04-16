// seedUsers.ts
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function seedUsers() {
    console.log("Deleting users");

    await db.vote.deleteMany()
    await db.user.updateMany({
        where: { role: "VOTER" },
        data: {
            hasVoted: false
        }
    })

    console.log("Voters deleted");
}

seedUsers()
    .catch((error) => {
        console.error("Seeding error:", error);
    })
    /* eslint-disable @typescript-eslint/no-misused-promises */
    .finally(async () => {
        await db.$disconnect();
    });
