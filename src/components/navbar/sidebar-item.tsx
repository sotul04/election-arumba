import { LoaderIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { defaultUserMenu, adminMenu } from "./menu";

export default function SidebarItem({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const session = useSession();
  const pathname = usePathname();

  if (session.status === "loading")
    return <LoaderIcon className="animate-spin" />;

  if (session.status === "unauthenticated") {
    return <></>
  }
  else if (
    session.data!.user.role &&
    session.data!.user.role === "VOTER"
  )
    return (
      <>
        {defaultUserMenu.map((item) => (
          <Link
            className={`rounded-r-md rounded-tl-md bg-opacity-50 py-2 p-3 underline-offset-4 hover:underline ${pathname.startsWith(item.href) ? "bg-slate-500" : "bg-slate-700"}`}
            onClick={toggleSidebar}
            key={item.href}
            href={item.href}
          >
            {item.alt}
          </Link>
        ))}
      </>
    );

  return (
    <>
      {adminMenu.map((item) => (
        <Link
          className={`rounded-r-md rounded-tl-md bg-opacity-50 py-2 p-3 underline-offset-4 hover:underline ${pathname.startsWith(item.href) ? "bg-slate-500" : "bg-slate-700"}`}
          onClick={toggleSidebar}
          key={item.href}
          href={item.href}
        >
          {item.alt}
        </Link>
      ))}
    </>
  );
}
