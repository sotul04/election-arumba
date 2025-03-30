import type { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth/config";

export async function checkAuth(role: Role) {
    const auth = await getServerAuthSession();
    if (!auth) redirect("/signin");
    if (auth.user.role !== role)
        redirect("/");
}