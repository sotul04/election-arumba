"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import UserAuth from "./auth-top";
import TopbarItem from "./topbar-item";

interface TopbarProps {
  toggleSidebar: () => void;
}
export const Topbar: React.FC<TopbarProps> = ({ toggleSidebar }) => {
  return (
    <nav className="container flex items-center justify-between bg-transparent">
      <div className="flex items-center gap-4">
        <Link href="/" className="ml-3 flex items-center gap-3">
          <Image
            className="drop-shadow-xl"
            src="/favicon.ico"
            alt="Logo STEI ITB"
            width={48}
            height={48}
          />
          <div className="font-main drop-shadow-lg">
            <h1 className="text-xl font-semibold">Election</h1>
            <p className="text-sm">Arumba Jabar</p>
          </div>
        </Link>
        {/* <TopbarItem toggleSidebar={toggleSidebar} /> */}
      </div>
      <button onClick={toggleSidebar} className="mr-2 md:hidden p-1 rounded-sm hover:bg-gray-100 cursor-pointer">
        <svg
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div className="hidden items-center gap-5 md:flex">
        <TopbarItem />
        <UserAuth />
      </div>
    </nav>
  );
};
