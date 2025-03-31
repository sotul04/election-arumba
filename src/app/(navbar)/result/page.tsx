"use client"

import { VoteResultCard } from "~/components/vote/vote-result"
import { Card, CardContent } from "~/components/ui/card"
import { api } from "~/trpc/react"

export default function VotingResultsPage() {
    const {data: voteResults, isLoading} = api.vote.getVotingResult.useQuery();

    if (isLoading) {
        return (
            <div className="mx-auto py-8 px-4 max-w-5xl">
                <div className="flex justify-center items-center h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Loading voting results...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!voteResults) {
        return (
            <div className="mx-auto flex justify-center items-center max-w-5xl h-[70vh]">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center">
                            <p>No voting results available.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="mx-auto py-8 px-4 container">
            <h1 className="text-3xl font-bold mb-6">Voting Results</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(voteResults).map(([positionName, positionData]) => (
                    <VoteResultCard key={positionName} positionName={positionName} positionData={positionData} />
                ))}
            </div>
        </div>
    )
}

