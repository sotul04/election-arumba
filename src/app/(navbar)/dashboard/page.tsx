"use client"
import { api } from "~/trpc/react";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { UserCard } from "~/components/user/user-card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Card, CardContent } from "~/components/ui/card";
import { Search, SortAsc, SortDesc, Loader2 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { toast } from "sonner";

type SortByOption = "name" | "email" | "generation" | "major" | "university";
type SortOrderOption = "asc" | "desc";

export default function UsersPage() {
    const [sortBy, setSortBy] = useState<SortByOption>("name");
    const [sortOrder, setSortOrder] = useState<SortOrderOption>("asc");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [deletingUsers, setDeletingUsers] = useState<Set<string>>(new Set());
    const { ref, inView } = useInView();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = api.user.getUsers.useInfiniteQuery(
        {
            limit: 10,
            sortBy,
            sortOrder,
            searchQuery: debouncedSearchQuery,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    const deleteUserMutation = api.user.deleteUser.useMutation();
    const utils = api.useContext();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const allUsers = data?.pages.flatMap((page) => page.users) || [];

    const handleDeleteUser = async (userId: string) => {
        setDeletingUsers((prev) => new Set(prev).add(userId));

        try {
            await deleteUserMutation.mutateAsync({ id: userId });
            toast("User deleted", {
                description: "The user has been successfully deleted."
            });
            
            // Invalidate and refetch user list
            await utils.user.getUsers.invalidate();
        } catch (error) {
            toast.error("Error", {
                description: "Failed to delete user. Please try again."
            });
        } finally {
            setDeletingUsers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    return (
        <div className="mx-auto py-8 px-4 container">
            <div className="flex flex-col space-y-4">
                <h1 className="text-3xl font-bold">User Management</h1>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, major, or university..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortByOption)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="generation">Generation</SelectItem>
                                <SelectItem value="major">Major</SelectItem>
                                <SelectItem value="university">University</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" onClick={toggleSortOrder} className="px-3">
                            {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                {debouncedSearchQuery && (
                    <div className="mb-4">
                        <Badge variant="secondary" className="text-sm">
                            Search: {debouncedSearchQuery}
                            <button className="ml-2 hover:text-destructive" onClick={() => setSearchQuery("")}>×</button>
                        </Badge>
                    </div>
                )}

                {isLoading && !allUsers.length ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2">Loading users...</span>
                    </div>
                ) : allUsers.length === 0 ? (
                    <Card>
                        <CardContent className="p-6 text-center">
                            <p>No users found. Try adjusting your search criteria.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {allUsers.map((user) => (
                            <UserCard key={user.id} user={user} onDelete={handleDeleteUser} isDeleting={deletingUsers.has(user.id)} />
                        ))}

                        {(isFetchingNextPage || hasNextPage) && (
                            <div ref={ref} className="flex justify-center items-center py-4">
                                {isFetchingNextPage && (
                                    <div className="flex items-center">
                                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                        <span>Loading more...</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {!hasNextPage && allUsers.length > 0 && (
                    <p className="text-center text-muted-foreground py-4">No more users to load</p>
                )}
            </div>
        </div>
    );
}
