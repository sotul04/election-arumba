import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const db = new PrismaClient();

const positions = [
    "KETUA",
    "BENDAHARA",
    "SEKRETARIS",
    "KADIV_INTERNAL",
    "KADIV_HUMAS",
    "KADIV_INFORMASI_DAN_KREASI",
    "KADIV_EVENTS",
] as const;

type Position = (typeof positions)[number];

async function seedCandidates() {
    console.log("🌱 Seeding candidates...");

    await db.candidate.deleteMany();

    for (const position of positions) {
        const numCandidates = Math.floor(Math.random() * 3) + 1;

        const candidates = Array.from({ length: numCandidates }, () => ({
            fullname: faker.person.fullName(),
            university: faker.company.name(),
            generation: faker.number.int({ min: 2018, max: 2024 }).toString(),
            image: faker.image.avatar(), // Generates a random avatar image
            position: position as Position,
        }));

        await db.candidate.createMany({ data: candidates });
        console.log(`✅ Added ${numCandidates} candidate(s) for ${position}`);
    }

    console.log("✅ Seeding completed.");
}

seedCandidates()
    .catch((error) => {
        console.error("❌ Error seeding candidates:", error);
    })
    .finally(async () => {
        await db.$disconnect();
    });
