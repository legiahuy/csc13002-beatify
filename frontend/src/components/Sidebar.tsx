"use client"

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { BiHomeAlt2 } from 'react-icons/bi';
import { IoAlbumsOutline } from 'react-icons/io5';
import { HiOutlineMusicalNote } from 'react-icons/hi2';
import { RiUserVoiceLine } from 'react-icons/ri';
import { MdOutlineHistory } from 'react-icons/md';
import { IoHeartOutline } from 'react-icons/io5';
import { IoAddOutline } from 'react-icons/io5';
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const pathname = usePathname();

  const sections = useMemo(() => [
    {
      label: 'MENU',
      items: [
        {
          icon: BiHomeAlt2,
          label: 'Home',
          active: pathname === '/',
          href: '/'
        },
        {
          icon: HiOutlineMusicalNote,
          label: 'Genres',
          active: pathname === '/genres',
          href: '/genres'
        },
        {
          icon: IoAlbumsOutline,
          label: 'Albums',
          active: pathname === '/albums',
          href: '/albums'
        },
        {
          icon: RiUserVoiceLine,
          label: 'Artists',
          active: pathname === '/artists',
          href: '/artists'
        }
      ]
    },
    {
      label: 'LIBRARY',
      items: [
        {
          icon: MdOutlineHistory,
          label: 'Recent',
          active: pathname === '/recent',
          href: '/recent'
        },
        {
          icon: IoAlbumsOutline,
          label: 'Albums',
          active: pathname === '/my-albums',
          href: '/my-albums'
        },
        {
          icon: IoHeartOutline,
          label: 'Favourites',
          active: pathname === '/favourites',
          href: '/favourites'
        }
      ]
    },
    {
      label: 'PLAYLIST',
      items: [
        {
          icon: IoAddOutline,
          label: 'Create new',
          active: pathname === '/create-playlist',
          href: '/create-playlist'
        }
      ]
    }
  ], [pathname]);

  return (
    <div className="flex h-full">
      <div className="hidden md:flex flex-col w-[260px] bg-[#0A0A0A] h-full">
        {/* Logo Section */}
        <div className="flex items-center gap-x-2 px-6 h-[80px]">
          <span className="text-white text-2xl">♪</span>
          <span className="text-white font-bold">BEATIFY</span>
        </div>
        
        {/* Navigation Sections */}
        <div className="flex flex-col flex-1">
          {sections.map((section, index) => (
            <div 
              key={section.label} 
              className={`
                px-6 
                py-6
                ${index !== sections.length - 1 ? 'border-b border-neutral-800' : ''}
              `}
            >
              <h2 className="text-xs text-neutral-400 font-bold mb-4">
                {section.label}
              </h2>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <SidebarItem
                    key={item.label}
                    {...item}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <main className="h-full flex-1 overflow-y-auto py-2">
        {children}
      </main>
    </div>
  );
}

export default Sidebar;