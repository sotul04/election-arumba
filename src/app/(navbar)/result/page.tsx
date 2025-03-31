"use client"

import { useState, useEffect } from "react"
import { VoteResultCard } from "~/components/vote/vote-result"
import { Card, CardContent } from "~/components/ui/card"
import { api } from "~/trpc/react"

// Mock data - in a real app, you would fetch this from your API
const mockVoteResults = {
    KETUA: {
        candidates: [
            {
                id: 26,
                fullname: "Hattie Cummings",
                university: "Bailey - Kreiger",
                generation: "2019",
                major: "Chair",
                count: 15,
            },
            {
                id: 27,
                fullname: "Eileen Hintz",
                university: "Dietrich - Kessler",
                generation: "2024",
                major: "Pants",
                count: 7,
            },
            {
                id: 28,
                fullname: "Kim Bode",
                university: "Gibson - Kuhn",
                generation: "2021",
                major: "Towels",
                count: 12,
            },
        ],
        total: 35,
        abstain: 0,
    },
    BENDAHARA: {
        candidates: [
            {
                id: 29,
                fullname: "Dr. Cora Kohler",
                university: "Bergnaum, Wisoky and Schiller",
                generation: "2021",
                major: "Salad",
                count: 25,
            },
        ],
        total: 35,
        abstain: 10,
    },
    SEKRETARIS: {
        candidates: [
            {
                id: 30,
                fullname: "Harold Franecki",
                university: "Jaskolski - Goodwin",
                generation: "2021",
                major: "Tuna",
                count: 12,
            },
            {
                id: 31,
                fullname: "Tara Vandervort",
                university: "Bashirian - Feeney",
                generation: "2018",
                major: "Mouse",
                count: 10,
            },
            {
                id: 32,
                fullname: "Desiree Wilkinson-Hartmann",
                university: "Boyer, Hodkiewicz and Stracke",
                generation: "2024",
                major: "Gloves",
                count: 13,
            },
        ],
        total: 35,
        abstain: 0,
    },
    KADIV_INTERNAL: {
        candidates: [
            {
                id: 33,
                fullname: "Ollie Gutmann I",
                university: "Gusikowski, Hahn and Wehner",
                generation: "2020",
                major: "Pizza",
                count: 18,
            },
            {
                id: 34,
                fullname: "Miranda Schaden",
                university: "Hodkiewicz, Hickle and Grimes",
                generation: "2023",
                major: "Salad",
                count: 7,
            },
            {
                id: 35,
                fullname: "Drew Breitenberg",
                university: "Walter Inc",
                generation: "2021",
                major: "Pants",
                count: 10,
            },
        ],
        total: 35,
        abstain: 0,
    },
    KADIV_HUMAS: {
        candidates: [
            {
                id: 37,
                fullname: "Dr. Wendell Swaniawski",
                university: "Runolfsdottir - Feil",
                generation: "2020",
                major: "Cheese",
                count: 20,
            },
            {
                id: 36,
                fullname: "Amelia Carter II",
                university: "Denesik, Greenholt and Kulas",
                generation: "2021",
                major: "Chicken",
                count: 15,
            },
        ],
        total: 35,
        abstain: 0,
    },
    KADIV_INFORMASI_DAN_KREASI: {
        candidates: [
            {
                id: 38,
                fullname: "Phyllis Wisozk",
                university: "Mayert - Purdy",
                generation: "2022",
                major: "Pizza",
                count: 28,
            },
        ],
        total: 35,
        abstain: 7,
    },
    KADIV_EVENTS: {
        candidates: [
            {
                id: 39,
                fullname: "Christy Little I",
                university: "Bergstrom, Homenick and Auer",
                generation: "2022",
                major: "Chair",
                count: 16,
            },
            {
                id: 40,
                fullname: "Eddie Glover DDS",
                university: "Lind - Walter",
                generation: "2018",
                major: "Bike",
                count: 19,
            },
        ],
        total: 35,
        abstain: 0,
    },
}

export default function VotingResultsPage() {
    // const [loading, setLoading] = useState(true)
    // const [voteResults, setVoteResults] = useState<Record<string, any> | null>(null)

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
                    <VoteResultCard key={positionName} positionName={positionName} positionData={positionData as any} />
                ))}
            </div>
        </div>
    )
}

