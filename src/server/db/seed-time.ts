import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding Timeline...");

    await prisma.timeline.deleteMany({});

    await prisma.timeline.create({
        data: {
            // Waktu open (16 Januari 2025 pukul 00.00 GMT+7)
            // open: new Date(Date.UTC(2025, 0, 15, 17, 0, 0)), // Konversi ke UTC
            // Waktu mulai voting (10 menit dari sekarang)
            start: new Date(Date.UTC(2025, 3, 25, 1, 0, 0)),

            // Waktu akhir voting (10 hari dari sekarang)
            end: new Date(Date.UTC(2025, 3, 26, 13, 0, 0)),

        },
    });

    console.log("✅ Timeline seeded with fixed UTC timestamps!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding error:", e);
        process.exit(1);
    })
    /* eslint-disable @typescript-eslint/no-misused-promises */
    .finally(async () => {
        await prisma.$disconnect();
    });
