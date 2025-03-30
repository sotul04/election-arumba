import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { api } from "~/trpc/server"
import { redirect } from "next/navigation"

export default async function VoteConfirmationPage() {

    const status = await api.profile.getUserStatus();
    if (!status.hasVoted) redirect("/vote")

    return (
        <div className="container mx-auto py-16 px-4 flex flex-col items-center justify-center min-h-[70vh]">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">Vote Submitted Successfully</CardTitle>
                    <CardDescription>Thank you for participating in the Arumba Jabar election</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">
                        Your vote has been recorded securely. The results will be announced after the voting period ends.
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

