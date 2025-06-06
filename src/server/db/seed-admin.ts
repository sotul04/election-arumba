import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
import bcrypt from "bcrypt";

async function seed() {
    console.log("Seeding users...");

    await db.user.deleteMany({
        where: {
            role: "ADMIN"
        }
    });

    const passwordHashed = await bcrypt.hash("Admin?\\2025", 10);

    await db.user.create({
        data: {
            email: "admin@admin.election",
            password: passwordHashed,
            name: "Admin Election Arumba",
            role: "ADMIN",
            image: `https://lh3.googleusercontent.com/d/106Z3wt3vVFXarzpJPE2ZBk6cfasKGKel`
        }
    })

    console.log("Seeding completed.");
}

seed()
    .catch((error) => {
        console.error("Seeding error:", error);
    })
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    .finally(async () => {
        await db.$disconnect();
    });
