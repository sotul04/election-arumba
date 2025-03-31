import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { SignInForm } from "~/components/signin/signin"
import { getServerAuthSession } from "~/server/auth/config"

export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in to your account",
}

export default async function SignInPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {

    const session = await getServerAuthSession();

    if (session) {
        redirect("/")
    }

    const resolvedSearchParams = await searchParams

    const callbackUrl = resolvedSearchParams.callback as string | undefined;
    const callbackPath = callbackUrl ? decodeURIComponent(callbackUrl) : undefined;
    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] md:w-[450px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                    <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
                </div>
                <SignInForm callbackUrl={callbackPath} />
            </div>
        </div>
    )
}

