"use client"

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { BiHomeAlt2 } from 'react-icons/bi';
import { IoAlbumsOutline } from 'react-icons/io5';
import { HiOutlineMusicalNote } from 'react-icons/hi2';
import { RiUserVoiceLine } from 'react-icons/ri';
import { MdOutlineHistory } from 'react-icons/md';
import { IoHeartOutline, IoAddOutline } from 'react-icons/io5';
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  children: React.ReactNode;
  user: { name: string; image: string } | null;  // Nhận thêm prop `user`
}

const Sidebar: React.FC<SidebarProps> = ({ children, user }) => {
  const pathname = usePathname();

  // Định nghĩa các mục trong Sidebar
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
          label: 'Playlists',
          active: pathname === '/playlists',
          href: '/playlists'
        },
        {
          icon: RiUserVoiceLine,
          label: 'Artists',
          active: pathname === '/artist',
          href: '/artist'
        }
      ]
    },
    // Chỉ hiển thị LIBRARY nếu người dùng đã đăng nhập
    user && {
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
    // Chỉ hiển thị PLAYLIST nếu người dùng đã đăng nhập
    user && {
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
  ].filter(Boolean), [pathname, user]); // Lọc bỏ các mục `null` nếu user là `null`

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
            section && ( // Chỉ render nếu `section` không phải là `null`
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
            )
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
