import { useSession } from "next-auth/react";
import { defaultUserMenu, adminMenu } from "./menu";
import React from "react";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

export default function TopbarItem() {
  const session = useSession();
  // const pathname = usePathname();

  if (session.status === "loading")
    return <Skeleton className="h-8 w-28 rounded-full" />;

  let menus: React.ReactNode;
  let menuItem = "Menu";
  if (session.status === "unauthenticated") {
    menus = <></>
  }
  else if (
    session.data!.user.role &&
    session.data!.user.role === "VOTER"
  ) {
    menus = (
      <>
        {defaultUserMenu.map((item) => (
          <Link
            className="py-1 px-3 font-semibold"
            key={item.href}
            href={item.href}
          >
            {item.alt}
          </Link>
        ))}
      </>
    );
    menuItem = "Layanan";
  } else {
    menus = (
      <>
        {adminMenu.map((item) => (
          <Link
            className="py-1 px-3 font-semibold"
            key={item.href}
            href={item.href}
          >
            {item.alt}
          </Link>
        ))}
      </>
    );
  }

  return (
    <div className="flex gap-2">
      {menus}
    </div>
  );
}
