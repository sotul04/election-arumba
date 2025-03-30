import { Skeleton } from "~/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"

export default function VoteLoading() {
    // Create an array of positions to show loading state for
    const positions = [
        { name: "Ketua", candidates: 2 },
        { name: "Bendahara", candidates: 1 },
        { name: "Sekretaris", candidates: 1 },
        { name: "Kepala Divisi Internal", candidates: 1 },
        { name: "Kepala Divisi Hubungan Masyarakat", candidates: 1 },
        { name: "Kepala Divisi Informasi dan Kreasi", candidates: 1 },
        { name: "Kepala Divisi Events", candidates: 1 },
    ]

    return (
        <div className="container mx-auto px-4">
            {/* Positions and candidates */}
            <div className="space-y-12">
                {positions.map((position, index) => (
                    <div key={index} className="space-y-4">
                        {/* Position header */}
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-7 w-48" />
                            <Separator className="flex-1" />
                        </div>

                        {/* Candidate cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: position.candidates }).map((_, candidateIndex) => (
                                <Card key={candidateIndex} className="overflow-hidden h-full border border-gray-200">
                                    <Skeleton className="h-48 w-full" />
                                    <CardHeader className="pb-2">
                                        <Skeleton className="h-5 w-3/4 mb-2" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                        <Skeleton className="h-4 w-1/3" />
                                    </CardContent>
                                    <CardFooter className="pt-0">
                                        <Skeleton className="h-4 w-32" />
                                    </CardFooter>
                                </Card>
                            ))}

                            {/* Add abstain card skeleton if needed */}
                            {position.candidates < 2 && (
                                <Card className="overflow-hidden h-full border border-gray-200 bg-gray-50">
                                    <div className="flex items-center justify-center h-48 w-full bg-gray-100">
                                        <Skeleton className="h-16 w-16 rounded-full" />
                                    </div>
                                    <CardHeader className="pb-2">
                                        <Skeleton className="h-5 w-1/2 mb-2" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                        <Skeleton className="h-4 w-2/3" />
                                    </CardContent>
                                    <CardFooter className="pt-0">
                                        <Skeleton className="h-4 w-32" />
                                    </CardFooter>
                                </Card>
                            )}
                        </div>
                    </div>
                ))}

                {/* Submit button area */}
                <div className="sticky bottom-0 bg-white py-4 border-t z-10">
                    <div className="container mx-auto flex justify-between items-center">
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-10 w-40" />
                    </div>
                </div>
            </div>
        </div>
    )
}

