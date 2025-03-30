"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useRef, useState } from "react" // Added useEffect import

import { Button } from "~/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { api } from "~/trpc/react"
import { Skeleton } from "../ui/skeleton"
import { notFound, useRouter } from "next/navigation"

// Define the form schema with Zod
const formSchema = z
    .object({
        name: z.string().min(2, {
            message: "Name must be at least 2 characters.",
        }),
        major: z.string().min(3, {
            message: "Major must be at least 3 characters.",
        }),
        university: z.string().min(2, {
            message: "University must be at least 2 characters.",
        }),
        generation: z.coerce.number({ message: "Masukkan angkatan yang valid" }).min(1, { message: "Minimal 1 Legalisir" }),
        waNumber: z.string().optional(),
        lineId: z.string().optional(),
    })
    .refine((data) => data.waNumber || data.lineId, {
        message: "At least one contact method (WhatsApp or Line ID) must be provided.",
        path: ["waNumber"],
    })

export default function ProfileForm({ callback }: { callback: string }) {
    const { data, isLoading, error, refetch } = api.profile.getProfile.useQuery()
    const mutation = api.profile.setProfile.useMutation()
    const formRef = useRef(null)
    const [isEdit, setEdit] = useState(callback ? true : false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            major: "",
            university: "",
            generation: 2020,
            waNumber: "",
            lineId: "",
        },
    })

    function resetForm() {
        if (data)
            form.reset({
                name: data.name ?? "",
                major: data.major ?? "",
                university: data.university ?? "",
                generation: data.generation ?? 2020,
                waNumber: data.waNumber || "",
                lineId: data.lineId || "",
            })
    }

    useEffect(() => {
        resetForm();
    }, [data, form])

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values, {
            onSuccess: () => {
                toast.success("Profile saved", {
                    description: "Profile has been saved successfully",
                })
                if (callback) router.push(callback);
                else {
                    setEdit(false);
                    refetch()
                }
            },
            onError: (error) => {
                toast.error("Error saving profile", {
                    description: error.message,
                })
            },
        })
    }

    if (isLoading) {
        return (
            <Card className="w-full max-w-lg">
                <CardHeader className="space-y-2">
                    <Skeleton className="h-8 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Name field skeleton */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-10 w-full" />
                        </div>

                        {/* Major field skeleton */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-10 w-full" />
                        </div>

                        {/* University field skeleton */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-10 w-full" />
                        </div>

                        {/* Generation field skeleton */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-2/5" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-3 w-3/4" />
                        </div>

                        {/* Contact fields skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>

                        {/* Submit button skeleton */}
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error || !data) {
        notFound()
    }

    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle className="text-center my-2 text-2xl">Profile</CardTitle>
                <CardDescription>
                    Fill in your details to vote. Either WhatsApp number or Line ID is required.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" ref={formRef}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} disabled={!isEdit} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="major"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Major/Study Program</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Computer Science" {...field} disabled={!isEdit} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="university"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>University</FormLabel>
                                    <FormControl>
                                        <Input placeholder="University of Example" {...field} disabled={!isEdit} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="generation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Generation/Year</FormLabel>
                                    <FormControl>
                                        <Input placeholder="2023" {...field} disabled={!isEdit} />
                                    </FormControl>
                                    <FormDescription>Your batch or graduation year</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="waNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>WhatsApp Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+62833xxxxxxxx" {...field} disabled={!isEdit} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="lineId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Line ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="user_line_id" {...field} disabled={!isEdit} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {isEdit && <div className="flex gap-2 justify-end">
                            <Button type="button" variant={"outline"} onClick={() => {
                                resetForm();
                                setEdit(false);
                            }}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-green-900 hover:bg-green-950" disabled={mutation.isPending}>
                                {mutation.isPending ? "Saving..." : "Save Profile"}
                            </Button>
                        </div>}
                        {!isEdit && <Button type="button" className="w-full bg-green-900 hover:bg-green-950" onClick={() => setEdit(true)}>
                            Edit
                        </Button>}
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

