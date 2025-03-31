// seedUsers.ts
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

const db = new PrismaClient();

async function seedUsers() {
    console.log("Seeding users...");

    await db.user.deleteMany({
        where: { role: "VOTER" }
    })
    const passwordHashed = await bcrypt.hash("password", 10);

    const users: Prisma.UserCreateManyInput[] = Array.from({ length: 20 }).map((_, i) => ({
        email: `user${i + 1}@voter.com`,
        password: passwordHashed,
        name: `User ${i + 1}`,
        role: "VOTER",
        hasProfile: true,
        major: `Major ${i % 5 + 1}`,
        university: `University ${i % 3 + 1}`,
        generation: 2020 + (i % 4),
        waNumber: `+62812345678${i + 10}`,
        lineId: `user${i + 1}_line`,
        image: `https://lh3.googleusercontent.com/d/1jwclqWC4I9iefWfr6dUwy7Zwjrsb9eO2`
    }));

    await db.user.createMany({
        data: users
    });

    console.log("Seeding users completed.");
}

seedUsers()
    .catch((error) => {
        console.error("Seeding error:", error);
    })
    .finally(async () => {
        await db.$disconnect();
    });
