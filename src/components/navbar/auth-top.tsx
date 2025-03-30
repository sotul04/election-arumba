"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { Skeleton } from "../ui/skeleton";

export default function UserAuth() {
  const session = useSession();
  const router = useRouter();

  if (session.status === "loading") {
    return <div className="hidden md:flex">
      <Skeleton className="h-10 w-10 rounded-full mr-4"/>
    </div>;
  }

  if (session.status === "unauthenticated" || !session.data?.user) {
    return (
      <div className="mr-4 hidden items-center md:flex">
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
    <div className="mr-4 hidden md:flex">
      <Popover>
        <PopoverTrigger className="flex items-center gap-3">
          <p className="hidden lg:block">
            {session.data.user.name!.split(" ")[0]}
          </p>
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
        </PopoverTrigger>
        <PopoverContent className="w-[200px] border-none bg-green-700/80 text-white drop-shadow-lg p-2">
          <div className="flex flex-col items-start gap-2">
            <h3 className="">
              Hello, <strong>{session.data.user.name}</strong>
            </h3>
            <form
              action={() => {
                void signOut();
                router.push("/");
              }}
            >
              <Button
                type="submit"
                variant="link"
                className="my-0 p-0 text-gray-100"
              >
                <p>Sign out</p>
              </Button>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
