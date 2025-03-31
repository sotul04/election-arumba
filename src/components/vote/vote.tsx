"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Form, FormItem, FormMessage, FormField } from "~/components/ui/form"
import { Separator } from "~/components/ui/separator"
import { AlertCircle } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import { api } from "~/trpc/react"
import VoteLoading from "./vote-loading"

// Define position type
type Position =
    | "KETUA"
    | "BENDAHARA"
    | "SEKRETARIS"
    | "KADIV_INTERNAL"
    | "KADIV_HUMAS"
    | "KADIV_INFORMASI_DAN_KREASI"
    | "KADIV_EVENTS"

// Define candidate type
interface Candidate {
    id: number
    fullname: string
    university: string
    generation: string
    image: string
    position: Position
}

// Define the form schema with Zod
// Using number for all values, with 0 representing abstain
// Each field is required to ensure user makes a selection
const formSchema = z.object({
    KETUA: z.number({
        required_error: "Please select a candidate for Ketua position",
        invalid_type_error: "Please select a candidate for Ketua position",
    }),
    BENDAHARA: z.number({
        required_error: "Please select a candidate for Bendahara position",
        invalid_type_error: "Please select a candidate for Bendahara position",
    }),
    SEKRETARIS: z.number({
        required_error: "Please select a candidate for Sekretaris position",
        invalid_type_error: "Please select a candidate for Sekretaris position",
    }),
    KADIV_INTERNAL: z.number({
        required_error: "Please select a candidate for Kepala Divisi Internal position",
        invalid_type_error: "Please select a candidate for Kepala Divisi Internal position",
    }),
    KADIV_HUMAS: z.number({
        required_error: "Please select a candidate for Kepala Divisi Hubungan Masyarakat position",
        invalid_type_error: "Please select a candidate for Kepala Divisi Hubungan Masyarakat position",
    }),
    KADIV_INFORMASI_DAN_KREASI: z.number({
        required_error: "Please select a candidate for Kepala Divisi Informasi dan Kreasi position",
        invalid_type_error: "Please select a candidate for Kepala Divisi Informasi dan Kreasi position",
    }),
    KADIV_EVENTS: z.number({
        required_error: "Please select a candidate for Kepala Divisi Events position",
        invalid_type_error: "Please select a candidate for Kepala Divisi Events position",
    }),
})

// Position display names
const positionNames: Record<Position, string> = {
    KETUA: "Ketua",
    BENDAHARA: "Bendahara",
    SEKRETARIS: "Sekretaris",
    KADIV_INTERNAL: "Kepala Divisi Internal",
    KADIV_HUMAS: "Kepala Divisi HUMAS",
    KADIV_INFORMASI_DAN_KREASI: "Kepala Divisi Informasi dan Kreasi",
    KADIV_EVENTS: "Kepala Divisi Events",
}

export default function VoteForm() {
    const router = useRouter()
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [formValues, setFormValues] = useState<z.infer<typeof formSchema> | null>(null)
    const [isSubmitting, setSubmitting]  = useState(false);
    const [unselectedPositions, setUnselectedPositions] = useState<Position[]>([
        "KETUA",
        "BENDAHARA",
        "SEKRETARIS",
        "KADIV_INTERNAL",
        "KADIV_HUMAS",
        "KADIV_INFORMASI_DAN_KREASI",
        "KADIV_EVENTS",
    ])
    const mutation = api.vote.vote.useMutation();
    const { data: candidatesByPosition, isLoading } = api.vote.getCandidates.useQuery();

    // Initialize form with undefined values to force user selection
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    if (isLoading || !candidatesByPosition) {
        return <VoteLoading />
    }

    // Track which positions have been selected
    const updateSelectedPositions = (position: Position, value: number) => {
        setUnselectedPositions((prev) => prev.filter((pos) => pos !== position))
    }

    // Handle form submission
    function handleFormSubmit(values: z.infer<typeof formSchema>) {
        // Store form values and show confirmation dialog
        setFormValues(values)
        setShowConfirmDialog(true)
    }

    // Submit handler - called after confirmation
    async function submitVotes() {
        if (!formValues) return

        setSubmitting(true);

        const submitted = {
            KETUA: formValues.KETUA === 0 ? null : formValues.KETUA,
            BENDAHARA: formValues.BENDAHARA === 0 ? null : formValues.BENDAHARA,
            SEKRETARIS: formValues.SEKRETARIS === 0 ? null : formValues.SEKRETARIS,
            KADIV_INTERNAL: formValues.KADIV_INTERNAL === 0 ? null : formValues.KADIV_INTERNAL,
            KADIV_HUMAS: formValues.KADIV_HUMAS === 0 ? null : formValues.KADIV_HUMAS,
            KADIV_INFORMASI_DAN_KREASI: formValues.KADIV_INFORMASI_DAN_KREASI === 0 ? null : formValues.KADIV_INFORMASI_DAN_KREASI,
            KADIV_EVENTS: formValues.KADIV_EVENTS === 0 ? null : formValues.KADIV_EVENTS,
        }

        mutation.mutate(submitted, {
            onSuccess: () => {
                toast.success("Votes submitted successfully", {
                    description: "Thank you for participating in the election.",
                })
                router.push("/vote/confirmation")
                setShowConfirmDialog(false)
            },
            onError: () => {
                toast.error("Failed to submit votes", {
                    description: "Please try again later.",
                })
                setShowConfirmDialog(false)
                setSubmitting(false)
            }
        });
    }

    // Get candidate name by ID for confirmation dialog
    const getCandidateName = (position: Position, candidateId: number): string => {
        if (candidateId === 0) return "Abstain"

        const candidate = candidatesByPosition[position].find((c) => c.id === candidateId)
        return candidate ? candidate.fullname : "Unknown"
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-12">
                    {Object.entries(candidatesByPosition).map(([position, candidates]) => {
                        const positionKey = position as Position
                        const needsAbstain = candidates.length < 2
                        const isUnselected = unselectedPositions.includes(positionKey)

                        return (
                            <div key={position} className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <h2 className={`text-xl font-semibold ${isUnselected ? "text-amber-700" : ""}`}>
                                        {positionNames[positionKey]}
                                        {isUnselected && (
                                            <span className="ml-2 text-sm font-normal text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                                Selection required
                                            </span>
                                        )}
                                    </h2>
                                    <Separator className="flex-1" />
                                </div>

                                <FormField
                                    control={form.control}
                                    name={positionKey}
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {candidates.map((candidate) => {
                                                    const isSelected = field.value === candidate.id
                                                    return (
                                                        <div key={candidate.id} className="relative">
                                                            <Card
                                                                className={`overflow-hidden h-full transition-all cursor-pointer ${isSelected
                                                                    ? "border-emerald-500 border-2 shadow-md transform scale-[1.02]"
                                                                    : isUnselected
                                                                        ? "border-amber-200 hover:border-amber-300 hover:shadow-sm"
                                                                        : "hover:border-gray-300 hover:shadow-sm"
                                                                    }`}
                                                                onClick={() => {
                                                                    form.setValue(positionKey, candidate.id)
                                                                    updateSelectedPositions(positionKey, candidate.id)
                                                                }}
                                                            >
                                                                <div className="relative h-64 w-full">
                                                                    <Image
                                                                        src={candidate.image ? `/api/avatar?url=${encodeURIComponent(candidate.image)}` : "/icons/placeholder.webp"}
                                                                        alt={candidate.fullname}
                                                                        fill
                                                                        className="object-cover "
                                                                    />
                                                                    {isSelected && (
                                                                        <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1">
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="20"
                                                                                height="20"
                                                                                viewBox="0 0 24 24"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                strokeWidth="2"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                            >
                                                                                <polyline points="20 6 9 17 4 12"></polyline>
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <CardHeader className="pb-1">
                                                                    <CardTitle className="text-lg">{candidate.fullname}</CardTitle>
                                                                    <CardDescription>{candidate.university}</CardDescription>
                                                                    <CardDescription>{candidate.major}</CardDescription>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <p className="text-sm">Generation: {candidate.generation}</p>
                                                                </CardContent>
                                                                <CardFooter className="pt-0 flex items-center">
                                                                    <span className={`text-sm font-medium ${isSelected ? "text-emerald-700" : ""}`}>
                                                                        {isSelected ? "Selected" : "Select this candidate"}
                                                                    </span>
                                                                </CardFooter>
                                                            </Card>
                                                            <input
                                                                type="radio"
                                                                id={`${position}-${candidate.id}`}
                                                                className="sr-only"
                                                                checked={isSelected}
                                                                onChange={() => {
                                                                    form.setValue(positionKey, candidate.id)
                                                                    updateSelectedPositions(positionKey, candidate.id)
                                                                }}
                                                            />
                                                        </div>
                                                    )
                                                })}

                                                {/* Add abstain option if less than 2 candidates */}
                                                {needsAbstain && (
                                                    <div className="relative">
                                                        <Card
                                                            className={`overflow-hidden h-full transition-all cursor-pointer bg-gray-50 ${field.value === 0
                                                                ? "border-emerald-500 border-2 shadow-md transform scale-[1.02]"
                                                                : isUnselected
                                                                    ? "border-amber-200 hover:border-amber-300 hover:shadow-sm"
                                                                    : "hover:border-gray-300 hover:shadow-sm"
                                                                }`}
                                                            onClick={() => {
                                                                form.setValue(positionKey, 0)
                                                                updateSelectedPositions(positionKey, 0)
                                                            }}
                                                        >
                                                            <div className="flex items-center justify-center h-64 w-full bg-gray-100">
                                                                <div className="text-gray-400 text-6xl">⊘</div>
                                                                {field.value === 0 && (
                                                                    <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="20"
                                                                            height="20"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        >
                                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <CardHeader className="pb-6">
                                                                <CardTitle className="text-lg">Abstain</CardTitle>
                                                                <CardDescription>Choose not to vote for this position</CardDescription>
                                                            </CardHeader>
                                                            <CardContent className="pb-1">
                                                                <p className="text-sm text-gray-500">Your vote will be recorded as an abstention</p>
                                                            </CardContent>
                                                            <CardFooter className="pt-0 flex items-center">
                                                                <span className={`text-sm font-medium ${field.value === 0 ? "text-emerald-700" : ""}`}>
                                                                    {field.value === 0 ? "Selected" : "Abstain from voting"}
                                                                </span>
                                                            </CardFooter>
                                                        </Card>
                                                        <input
                                                            type="radio"
                                                            id={`${position}-abstain`}
                                                            className="sr-only"
                                                            checked={field.value === 0}
                                                            onChange={() => {
                                                                form.setValue(positionKey, 0)
                                                                updateSelectedPositions(positionKey, 0)
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )
                    })}

                    <div className="sticky bottom-0 bg-white py-4 border-t z-10 rounded-t-md px-2">
                        <div className="container mx-auto flex justify-between items-center">
                            {unselectedPositions.length > 0 ? (
                                <p className="text-amber-600 text-sm">
                                    <AlertCircle className="inline-block mr-1 h-4 w-4" />
                                    Please select candidates for all positions before submitting
                                </p>
                            ) : (
                                <p className="text-emerald-600 text-sm">✓ All positions selected</p>
                            )}
                            <Button
                                type="submit"
                                className="bg-emerald-700 hover:bg-emerald-800 px-8"
                                disabled={isSubmitting || unselectedPositions.length > 0}
                            >
                                {mutation.isPending ? "Submitting..." : "Submit All Votes"}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>

            {/* Confirmation Dialog */}
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Your Votes</AlertDialogTitle>
                        <AlertDialogDescription>
                            Please review your selections before submitting. Once submitted, your votes cannot be changed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="py-4 space-y-4">
                        {formValues &&
                            Object.entries(formValues).map(([position, candidateId]) => (
                                <div key={position} className="flex justify-between items-center border-b pb-2">
                                    <span className="font-medium">{positionNames[position as Position]}:</span>
                                    <span className={candidateId === 0 ? "italic text-gray-500" : ""}>
                                        {getCandidateName(position as Position, candidateId)}
                                    </span>
                                </div>
                            ))}
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={mutation.isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={submitVotes}
                            disabled={mutation.isPending}
                            className="bg-emerald-700 hover:bg-emerald-800"
                        >
                            {mutation.isPending ? "Submitting..." : "Confirm and Submit"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

