import { PrismaClient, type Candidate, type Position } from "@prisma/client";

const db = new PrismaClient();


const KETUA = [
    {
        fullname: "Christy Sigiro",
        university: "IPB University",
        generation: "23",
        major: "Manajemen Sumberdaya Lahan",
        image: "https://lh3.googleusercontent.com/d/1yVsdsP9sNh8pm0a6-XxhKHeYj-62mr9c",
        position: "KETUA" as Position,
    },
    {
        fullname: "Eliezer Ekin Haganta Sitepu",
        university: "IPB University",
        generation: "23",
        major: "Teknik Sipil dan Lingkungan",
        image: "https://lh3.googleusercontent.com/d/1cfPivQ6aJWd3_ZEeY8s0hS746C76cgSE",
        position: "KETUA" as Position,
    }
]

const BENDAHARA = [
    {
        fullname: "Olivia Ainge Febina Br Ginting",
        university: "IPB University",
        generation: "24",
        major: "Ekonomi Sumberdaya & Lingkungan",
        image: "https://lh3.googleusercontent.com/d/1fr4F-FScHDmFib8jI0dGlvlD1lX2U5Wk",
        position: "BENDAHARA" as Position,
    },
]

const SEKRETARIS = [
    {
        fullname: "Ruth Aurelia Caroline Purba",
        university: "IPB University",
        generation: "23",
        major: "Komunikasi Digital dan Media",
        image: "https://lh3.googleusercontent.com/d/110XU4YI5Tcxa9JZfdCISD9vpTXaZtvlz",
        position: "SEKRETARIS" as Position,
    },
]

const KADIV_INTERNAL = [
    {
        fullname: "Deo Yesla Imanta Sembiring",
        university: "Institut Teknologi Bandung",
        generation: "24",
        major: "Teknik Pertambangan",
        image: "https://lh3.googleusercontent.com/d/15NC_3aJgmU7pLoRnwTO7NovCGJS68rmH",
        position: "KADIV_INTERNAL" as Position,
    },
]

const KADIV_HUMAS = [
    {
        fullname: "Lasma Marito br Siringo-Ringo",
        university: "Universitas Padjadjaran",
        generation: "24",
        major: "Ilmu Komunikasi",
        image: "https://lh3.googleusercontent.com/d/1hAPJhdddfzD-rxa-daJ2T5WVBuiUjSvW",
        position: "KADIV_HUMAS" as Position,
    },
]

const KADIV_INFORMASI_DAN_KREASI = [
    {
        fullname: "Dea Betrix",
        university: "Universitas Indonesia",
        generation: "24",
        major: "Teknik Kimia",
        image: "https://lh3.googleusercontent.com/d/1R7EJiqUkQktXevOhsrVIf5oHsLbSCKyq",
        position: "KADIV_INFORMASI_DAN_KREASI" as Position,
    },
]

const KADIV_EVENTS = [
    {
        fullname: "Athalya Neva Faradise br Sembiring",
        university: "Universitas Indonesia",
        generation: "24",
        major: "Administrasi Keuangan dan Perbankan",
        image: "https://lh3.googleusercontent.com/d/1A73qq4tz3nZAVwsBE7F6bH2PiZe2yLYw",
        position: "KADIV_EVENTS" as Position,
    },
]


async function seedCandidates() {
    console.log("\ud83c\udf31 Seeding candidates...");

    await db.candidate.deleteMany();

    let candidates: {
        fullname: string;
        major: string;
        university: string;
        generation: string;
        image: string;
        position: Position;
    }[] = KETUA;
    candidates = candidates.concat(BENDAHARA);
    candidates = candidates.concat(SEKRETARIS);
    candidates = candidates.concat(KADIV_EVENTS);
    candidates = candidates.concat(KADIV_HUMAS);
    candidates = candidates.concat(KADIV_INFORMASI_DAN_KREASI);
    candidates = candidates.concat(KADIV_INTERNAL);

    console.log("Total candidates:", candidates.length)

    await db.candidate.createMany({
        data: candidates
    })

    console.log("\u2705 Seeding completed.");
}

seedCandidates()
    .catch((error) => {
        console.error("\u274C Error seeding candidates:", error);
    })
    /* eslint-disable @typescript-eslint/no-misused-promises */
    .finally(async () => {
        await db.$disconnect();
    });
