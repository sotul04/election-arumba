import ProfileForm from "~/components/profile/profile-edit";

export default async function ProfilePage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    const { callback } = await searchParams;
    const callbackPath = callback ? decodeURIComponent(callback) : "";
    return <div className="flex min-h-[calc(100vh-76px)] items-center justify-center p-4">
        <ProfileForm callback={callbackPath} />
    </div>
}