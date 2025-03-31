"use client"

import { Card, CardContent } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Mail, Phone, MessageSquare, CheckCircle, XCircle, Trash2 } from "lucide-react"
import { Button } from "~/components/ui/button"
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
import { useState } from "react"

type User = {
    id: string
    name: string
    email: string
    emailVerified: Date | null
    image: string | null
    hasProfile: boolean
    hasVoted: boolean
    role: string
    major: string | null
    university: string | null
    generation: number | null
    waNumber: string | null
    lineId: string | null
}

interface UserCardProps {
    user: User
    onDelete: (userId: string) => void
    isDeleting?: boolean
}

export function UserCard({ user, onDelete, isDeleting = false }: UserCardProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    // Get initials for avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
    }

    const handleDelete = () => {
        onDelete(user.id)
        setShowDeleteDialog(false)
    }

    return (
        <Card className={`overflow-hidden transition-opacity ${isDeleting ? "opacity-60" : "opacity-100"}`}>
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0">
                        <Avatar className="h-16 w-16 border">
                            <AvatarImage src={user.image ? `/api/avatar?url=${encodeURIComponent(user.image)}` : undefined} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="flex-1 space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div>
                                <h3 className="text-lg font-semibold">{user.name}</h3>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Mail className="h-3.5 w-3.5 mr-1" />
                                    {user.email}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 items-center">
                                <Badge variant={user.hasProfile ? "default" : "outline"}>
                                    {user.hasProfile ? "Profile Complete" : "Profile Incomplete"}
                                </Badge>
                                <Badge variant={user.hasVoted ? "success" : "secondary"}>
                                    {user.hasVoted ? "Has Voted" : "Not Voted"}
                                </Badge>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                    disabled={isDeleting}
                                    onClick={() => setShowDeleteDialog(true)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                            {user.university && (
                                <div>
                                    <span className="text-muted-foreground">University:</span> {user.university}
                                </div>
                            )}
                            {user.major && (
                                <div>
                                    <span className="text-muted-foreground">Major:</span> {user.major}
                                </div>
                            )}
                            {user.generation && (
                                <div>
                                    <span className="text-muted-foreground">Generation:</span> {user.generation}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                            {user.waNumber && (
                                <div className="flex items-center">
                                    <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                    {user.waNumber}
                                </div>
                            )}
                            {user.lineId && (
                                <div className="flex items-center">
                                    <MessageSquare className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                    {user.lineId}
                                </div>
                            )}
                            <div className="flex items-center">
                                {user.emailVerified ? (
                                    <>
                                        <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-500" />
                                        <span className="text-muted-foreground">Email verified</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-3.5 w-3.5 mr-1 text-red-500" />
                                        <span className="text-muted-foreground">Email not verified</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {user.name}? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}

