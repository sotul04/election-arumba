"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "~/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Card, CardContent, CardFooter } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { Icons } from "~/components/icon/icons"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

// Define form schema with validation
const formSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" }),
})

type FormValues = z.infer<typeof formSchema>

export function SignInForm({ callbackUrl }: { callbackUrl: string | undefined }) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>();
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values: FormValues) => {
        setIsLoading(true)
        const res = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false
        });
        if (!res || res.error) {
            console.error("Failed to sign-in");
            setError("Email or password is incorrect.");
            setIsLoading(false);
        } else {
            router.push(callbackUrl ?? "/");
        }
    }

    const handleGoogleSignIn = () => {
        setIsLoading(true);

        void signIn("google", {
            callbackUrl: "/"
        });

        setIsLoading(false);
    }

    return (
        <Card>
            <CardContent className="pt-6">
                {error &&
                    <p className="text-red-400 text-center text-sm mt-2">{error}</p>
                }
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="name@example.com" type="email" disabled={isLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel>Password</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Input type="password" disabled={isLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full bg-green-900 hover:bg-green-950" disabled={isLoading}>
                            {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Sign In
                        </Button>
                    </form>
                </Form>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-background px-2 text-muted-foreground">If you are not an admin</span>
                    </div>
                </div>

                <Button variant="outline" type="button" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
                    {isLoading ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.google />
                    )}
                    Google
                </Button>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
                <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Arumba Jabar. All rights reserved.</p>
            </CardFooter>
        </Card>
    )
}

