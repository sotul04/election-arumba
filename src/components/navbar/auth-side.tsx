"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LoaderCircleIcon } from "lucide-react";

export default function AuthSide() {
  const session = useSession();
  const router = useRouter();

  if (session.status === "loading") {
    return (
      <div className="my-2">
        <LoaderCircleIcon className="animate-spin" />
      </div>
    );
  }

  if (session.status === "unauthenticated" || !session.data?.user) {
    return (
      <div className="items-center">
        <Button
          onClick={() => router.push("/signin")}
          className="flex gap-3 rounded-full bg-green-800 text-white transition-none hover:bg-green-900"
        >
          <h2>Signin</h2>
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2">
        <Avatar className="bg-slate-100">
          <AvatarImage
            src={session.data.user.image ? `/api/avatar?url=${encodeURIComponent(session.data.user.image)}` : undefined}
            alt={`${session.data.user.name} profile photo`}
          />
          <AvatarFallback className="text-black">
            {session.data.user.name
              ? session.data.user.name.charAt(0).toUpperCase()
              : " "}
          </AvatarFallback>
        </Avatar>
        <p className="flex-grow">{session.data.user.name}</p>
      </div>
      <div className="flex flex-col items-start gap-2">
        <form
          action={() => {
            void signOut();
            router.push("/");
          }}
        >
          <Button
            type="submit"
            className="my-3 rounded-full active:bg-green-950"
          >
            <p>Sign out</p>
          </Button>
        </form>
      </div>
    </div>
  );
}
