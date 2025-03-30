import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const imageUrl = url.searchParams.get("url");

    if (!imageUrl) {
        return new NextResponse("Missing image URL", { status: 400 });
    }

    try {
        const res = await fetch(imageUrl, { headers: { "User-Agent": "Mozilla" } });
        if (!res.ok) throw new Error("Failed to fetch image");

        const imageBuffer = await res.arrayBuffer();
        return new NextResponse(imageBuffer, {
            headers: {
                "Content-Type": res.headers.get("Content-Type") || "image/jpeg",
                "Cache-Control": "public, max-age=86400", // Cache for 1 day
            },
        });
    } catch (error) {
        return new NextResponse("Error fetching image", { status: 500 });
    }
}
