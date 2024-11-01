"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HiHome } from "react-icons/hi";
import { BiSearch, BiSolidMusic } from "react-icons/bi";
import { IoAdd } from "react-icons/io5";
import { IoIosAlbums } from "react-icons/io";
import { PiMicrophoneStageDuotone } from "react-icons/pi";
import { BsMusicNoteList } from "react-icons/bs";
import { IoReturnDownBack } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { CiFileOn } from "react-icons/ci";
import { BiMusic } from "react-icons/bi";

import Box from "./Box"
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({
  children
}) => {
  const pathname = usePathname();

  const menuRoutes = useMemo(() => [
    {
      icon: HiHome,
      label: 'Home',
      active: pathname === '/',
      href: '/'
    },
    {
      icon: BiSolidMusic,
      label: 'Genres',
      active: pathname === '/genres',
      href: '/genres'
    },
    {
      icon: IoIosAlbums,
      label: 'Albums',
      active: pathname === '/albums',
      href: '/albums'
    },
    {
      icon: PiMicrophoneStageDuotone,
      label: 'Artists',
      active: pathname === '/artists',
      href: '/artists'
    }
  ], [pathname]);

  const libraryRoutes = useMemo(() => [
    {
      icon: IoReturnDownBack,
      label: 'Recent Added',
      href: '/recent-added'
    },
    {
      icon: BsMusicNoteList,
      label: 'Albums',
      href: '/my-albums'
    },
    {
      icon: CiHeart,
      label: 'Favourites',
      href: '/favourites'
    },
    {
      icon: CiFileOn,
      label: 'Local',
      href: '/local'
    }
  ], []);

  return (
    <div className="flex h-full">
      <div className="
        hidden
        md:flex
        flex-col
        gap-y-2
        bg-black
        w-[300px]
        p-2
      ">
        <Box>
          <div className="flex flex-col gap-y-4 px-5 py-4">
            <div className="flex items-center">
              <BiMusic className="text-white text-xl mr-2" /> {/* Music icon */}
              <p className="text-white font-bold text-lg">BEATIFY</p>
            </div>
            <div>
              <p className="text-neutral-500 text-sm mb-4">MENU</p>
              {menuRoutes.map((item) => (
                <SidebarItem
                  key={item.label}
                  {...item}
                />
              ))}
            </div>
            
            <div>
              <p className="text-neutral-500 text-sm mb-4">LIBRARY</p>
              {libraryRoutes.map((item) => (
                <SidebarItem
                  key={item.label}
                  {...item}
                />
              ))}
            </div>
  
            <div>
              <p className="text-neutral-500 text-sm mb-4">PLAYLIST</p>
              <SidebarItem
                // icon plus new item
                icon={IoAdd}
                label="Create new playlist"
                href="/create-playlist"
              />
            </div>
          </div>
        </Box>
      </div>
      <main className="h-full flex-1 overflow-y-auto py-2">
        {children}
      </main>
    </div>
  );
  
}

export default Sidebar;
