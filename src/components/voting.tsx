import Link from "next/link";
import { getServerAuthSession } from "~/server/auth/config";
import { api } from "~/trpc/server";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";

export async function VotingCheck() {

    const session = await getServerAuthSession()

    if (!session) return <></>

    const status = await api.profile.getUserStatus()
    const timeline = await api.timeline.getTimeline()
    
    const now = new Date();

    if (session.user.role === "ADMIN" || status.hasVoted || now < timeline.start || now > timeline.end) return  <></>

    return <Button asChild>
        <Link className="inline-flex py-5 px-10" href="/vote">Vote now <ChevronRight/></Link>
    </Button>
}