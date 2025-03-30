"use client";
import { useState } from "react";
import { Topbar } from "./topbar";
import Sidebar from "./sidebar";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (<>
    <header className="md:flex sticky z-10 top-0 w-full justify-center py-3 drop-shadow-md backdrop-blur supports-[backdrop-filter]:bg-white/30 first-letter:flex md:py-[14px]">
      <Topbar toggleSidebar={toggleSidebar} />
    </header>
    <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
  </>
  );
}
