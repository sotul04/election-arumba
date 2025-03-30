import Link from "next/link"
import { Button } from "~/components/ui/button"

export default function NotFound() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center px-4 text-center">
            <div className="space-y-6 max-w-md">
                <h1 className="text-6xl font-bold text-primary">404</h1>
                <h2 className="text-3xl font-semibold">Page Not Found</h2>
                <p className="text-muted-foreground">
                    Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or perhaps the
                    URL was mistyped.
                </p>
                <div className="pt-4">
                    <Button className="bg-green-900 hover:bg-green-950" asChild>
                        <Link href="/">Return Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

