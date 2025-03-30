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

    const passwordHashed = await bcrypt.hash("password", 10);

    await db.user.create({
        data: {
            email: "admin@admin.election",
            password: passwordHashed,
            name: "Admin Election Arumba",
            role: "ADMIN",
            image: `https://lh3.googleusercontent.com/d/1sKPMLqANvu9hb2JxR_sSQvkX4oZFyHJf`
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
