import ProfileForm from "~/components/profile/profile-edit";

export default async function ProfilePage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
    const resolvedSearchParams = await searchParams;

    const callback = resolvedSearchParams.callback as string | undefined;
    const callbackPath = callback ? decodeURIComponent(callback) : undefined;

    return (
        <div className="flex min-h-[calc(100vh-76px)] items-center justify-center p-4">
            <ProfileForm callback={callbackPath} />
        </div>
    );
}