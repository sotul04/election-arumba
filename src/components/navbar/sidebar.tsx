// components/Sidebar.tsx
import React from 'react'
import Image from 'next/image';
import AuthSide from './auth-side';
import Link from 'next/link';
import SidebarItem from './sidebar-item';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    return (<>
        <div className={`fixed left-0 top-0 md:hidden transform ${isOpen ? "translate-x-0" : "-translate-x-full"} flex transition duration-200 ease-in-out w-3/5 h-screen z-40 `}>
            <nav className='w-full drop-shadow-md backdrop-blur supports-[backdrop-filter]:bg-green-950/80 border-r-[0.5px] border-green-950 text-white py-4 px-4 flex flex-col justify-between'>
                <div>
                    <div className='border-b-[1px] pb-4 mb-4'>
                        <Link href="/" className="flex gap-3 items-center" onClick={toggleSidebar}>
                            <Image className="drop-shadow-xl" src="/favicon.ico" alt="Logo STEI ITB" width={48} height={48} />
                            <div className="font-main text-white drop-shadow-lg">
                                <h1 className="text-xl font-semibold">
                                    Election
                                </h1>
                                <p className="text-sm">Arumba Jabar</p>
                            </div>
                        </Link>
                    </div>
                    <div className='space-y-2 flex flex-col'>
                        <SidebarItem toggleSidebar={toggleSidebar} />
                    </div>
                </div>
                <AuthSide />
            </nav>
        </div>
        <div className={`fixed bg-gray-700 ${isOpen ? "" : "hidden"} opacity-50 left-0 top-0 z-30 w-full transition duration-200 ease-in-out h-screen`}>
            <button className='w-full h-full bg-inherit' onClick={() => toggleSidebar()}></button>
        </div>
    </>
    )
}

export default Sidebar