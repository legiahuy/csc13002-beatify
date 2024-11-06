"use client"

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { BiHomeAlt2 } from 'react-icons/bi';
import { IoAlbumsOutline } from 'react-icons/io5';
import { HiOutlineMusicalNote } from 'react-icons/hi2';
import { RiUserVoiceLine } from 'react-icons/ri';
import SidebarItem from "./SidebarItem";
import { PiMusicNotesPlusFill } from "react-icons/pi";
import { BsMusicNoteList } from "react-icons/bs";
import { RiPlayListAddFill } from "react-icons/ri";
import { MdLibraryMusic } from "react-icons/md";


interface SidebarProps {
  children: React.ReactNode;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ children }) => {
  const pathname = usePathname();

  const sections = useMemo(() => [
    {
      label: 'CURATOR PANEL',
      items: [
        {
          icon: PiMusicNotesPlusFill,
          label: 'Add Song',
          active: pathname === '/admin/add-song',
          href: '/admin/add-song'
        },
        {
          icon: MdLibraryMusic,
          label: 'List Song',
          active: pathname === '/admin/list-song',
          href: '/admin/list-song'
        },
        {
          icon: RiPlayListAddFill,
          label: 'Add Playlist',
          active: pathname === '/admin/add-playlist',
          href: '/admin/add-playlist'
        },
        {
          icon: BsMusicNoteList,
          label: 'List Playlist',
          active: pathname === '/admin/list-playlist',
          href: '/admin/list-playlist'
        },
        {
          icon: RiPlayListAddFill,
          label: 'Add Artist',
          active: pathname === '/admin/add-artist',
          href: '/admin/add-artist'
        },
        {
          icon: BsMusicNoteList,
          label: 'List Artist',
          active: pathname === '/admin/list-artist',
          href: '/admin/list-artist'
        }
      ]
    },
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

export default DashboardSidebar;