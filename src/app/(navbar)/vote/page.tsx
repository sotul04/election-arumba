import VoteForm from "~/components/vote/vote";
import { api } from "~/trpc/server";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import Link from "next/link"
import { CheckCircle, ClockAlert } from "lucide-react"
import { redirect } from "next/navigation";

export default async function VotePage() {
    const timeline = await api.timeline.getTimeline();
    const status = await api.profile.getUserStatus();


    if (status.hasVoted) {
        return (
            <div className="container mx-auto py-16 px-4 flex flex-col items-center justify-center min-h-[70vh]">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl">You have voted</CardTitle>
                        <CardDescription>Thank you for participating in the Arumba Jabar election</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">
                            The results will be announced after the voting period ends.
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center space-x-4">
                        <Button asChild variant="outline">
                            <Link href="/">Return Home</Link>
                        </Button>
                        <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
                            <Link href="/profile">View Profile</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    if (!status.hasProfile) {
        redirect(`/profile?callback=${encodeURIComponent("/vote")}`);
    }

    const now = new Date();

    if (!timeline || now < timeline.start || now > timeline.end) {
        return <div className="container mx-auto py-16 px-4 flex flex-col items-center justify-center min-h-[70vh]">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                        <ClockAlert className="h-10 w-10 text-yellow-400" />
                    </div>
                    <CardTitle className="text-2xl">Voting is not available</CardTitle>
                    <CardDescription>Maybe you missed the election time or the election has not been scheduled yet.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">
                        Please come back later
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center space-x-4">
                    <Button asChild variant="outline">
                        <Link href="/">Return Home</Link>
                    </Button>
                    <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
                        <Link href="/profile">View Profile</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    }

    return <section className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Arumba Jabar Election</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
                Vote for your preferred candidates for each position. Your vote is confidential and secure.
            </p>
        </div>
        <VoteForm />
    </section>
}