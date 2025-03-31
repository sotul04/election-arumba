import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

type Candidate = {
    id: number
    fullname: string
    university: string
    generation: string
    major: string
    count: number
}

type PositionResult = {
    candidates: Candidate[]
    total: number
    abstain: number
}

interface VoteResultCardProps {
    positionName: string
    positionData: PositionResult
}

/* eslint-disable @typescript-eslint/restrict-template-expressions */
export function VoteResultCard({ positionName, positionData }: VoteResultCardProps) {
    const { candidates, total, abstain } = positionData
    const hasMultipleCandidates = candidates.length > 1

    // Format position name for display (replace underscores with spaces and capitalize)
    const formattedPositionName = positionName
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")

    // Prepare data for the chart
    const chartData = candidates.map((candidate) => ({
        name: candidate.fullname,
        votes: candidate.count,
        id: candidate.id,
    }))

    // Add abstain to chart data if applicable
    if (!hasMultipleCandidates) {
        chartData.push({
            name: "Abstain",
            votes: abstain,
            id: -1, // Use a special ID for abstain
        })
    }

    // Calculate the percentage for each candidate
    const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.count, 0) + abstain

    // Generate random colors for the bars
    const COLORS = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c", "#d0ed57", "#ffc658"]

    return (
        <Card className="w-full mb-4 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle>{formattedPositionName}</CardTitle>
                <div className="text-sm text-muted-foreground">
                    Total voters: {total} | Votes cast: {totalVotes}
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" width={150} />
                            <Tooltip
                                formatter={(value) => {
                                    const percentage = totalVotes > 0 ? ((Number(value) / totalVotes) * 100).toFixed(1) : "0"
                                    return [`${value} votes (${percentage}%)`, "Votes"]
                                }}
                            />
                            <Bar dataKey="votes" name="name">
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-6 space-y-4">
                    {candidates.map((candidate) => (
                        <div key={candidate.id} className="flex justify-between items-start border-b pb-2">
                            <div>
                                <h3 className="font-medium">{candidate.fullname}</h3>
                                <p className="text-sm text-muted-foreground">{candidate.university}</p>
                                <p className="text-xs text-muted-foreground">
                                    {candidate.generation} • {candidate.major}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="font-bold">{candidate.count} votes</div>
                                <div className="text-sm">
                                    {totalVotes > 0 ? ((candidate.count / totalVotes) * 100).toFixed(1) : "0"}%
                                </div>
                            </div>
                        </div>
                    ))}

                    {!hasMultipleCandidates && (
                        <div className="flex justify-between items-center border-b pb-2">
                            <div>
                                <h3 className="font-medium">Abstain</h3>
                            </div>
                            <div className="text-right">
                                <div className="font-bold">{abstain} votes</div>
                                <div className="text-sm">{totalVotes > 0 ? ((abstain / totalVotes) * 100).toFixed(1) : "0"}%</div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

