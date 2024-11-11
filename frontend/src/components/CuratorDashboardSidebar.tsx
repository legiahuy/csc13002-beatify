"use client"

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import SidebarItem from "./SidebarItem";
import { PiMusicNotesPlusFill } from "react-icons/pi";
import { BsMusicNoteList } from "react-icons/bs";
import { RiPlayListAddFill } from "react-icons/ri";
import { MdLibraryMusic } from "react-icons/md";
import { IoPersonAdd } from "react-icons/io5";
import { IoMdPerson } from "react-icons/io";

interface SidebarProps {
  children: React.ReactNode;
}

const CuratorDashboardSidebar: React.FC<SidebarProps> = ({ children }) => {
  const pathname = usePathname();

  const sections = useMemo(() => [
    {
      label: 'SONG',
      items: [
        {
          icon: PiMusicNotesPlusFill,
          label: 'Add Song',
          active: pathname === '/curator/add-song',
          href: '/curator/add-song'
        },
        {
          icon: MdLibraryMusic,
          label: 'List Song',
          active: pathname === '/curator/list-song',
          href: '/curator/list-song'
        },
      ]
    },
    { 
      label: 'PLAYLIST',
      items: [
        {
          icon: RiPlayListAddFill,
          label: 'Add Playlist',
          active: pathname === '/curator/add-playlist',
          href: '/curator/add-playlist'
        },
        {
          icon: BsMusicNoteList,
          label: 'List Playlist',
          active: pathname === '/curator/list-playlist',
          href: '/curator/list-playlist'
        },
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

export default CuratorDashboardSidebar;