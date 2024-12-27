"use client"

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { BiHomeAlt2 } from 'react-icons/bi';
import { IoAlbumsOutline } from 'react-icons/io5';
import { HiOutlineMusicalNote } from 'react-icons/hi2';
import { RiUserVoiceLine } from 'react-icons/ri';
import { MdOutlineHistory } from 'react-icons/md';
import { IoHeartOutline, IoAddOutline, IoTrashOutline } from 'react-icons/io5';
import { MdAdminPanelSettings } from "react-icons/md";
import { MdOutlinePlaylistAdd } from "react-icons/md";


import SidebarItem from "./SidebarItem";
import Link from "next/link"; 
import { usePlayer } from '@/contexts/PlayerContext';
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { useRouter } from "next/navigation";


interface SidebarProps {
  children: React.ReactNode;
  user: {_id:string; name: string; image: string; role: string } | null;  // Nhận thêm prop `user`
}

const Sidebar: React.FC<SidebarProps> = ({ children, user }) => {
  const pathname = usePathname();
  const { userPlaylistsData, getUserPlaylistsData } = usePlayer();
  const { user: authUser } = useAuthStore();
  const router = useRouter();

  console.log('Current auth user:', authUser);

  const handleCreatePlaylist = async () => {
    try {
      // Calculate playlist number
      const existingPlaylists = userPlaylistsData || [];
      const playlistNumbers = existingPlaylists
        .map(p => {
          const match = p.name.match(/My Playlist #(\d+)/);
          return match ? parseInt(match[1]) : 0;
        })
        .filter(n => !isNaN(n));
      
      const nextNumber = playlistNumbers.length > 0 
        ? Math.max(...playlistNumbers) + 1 
        : 1;

      const response = await axios.post('http://localhost:4000/api/userPlaylist/create', {
        name: `My Playlist #${nextNumber}`,
        owner: user?._id || ''
      });

      if (response.data.success) {
        await getUserPlaylistsData();
        router.push(`/userPlaylist/${response.data.playlist._id}`);
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      const response = await axios.post('http://localhost:4000/api/userPlaylist/delete', {
        playlistId,
        owner: user?._id
      });

      if (response.data.success) {
        await getUserPlaylistsData();
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  // Định nghĩa các mục trong Sidebar
  const sections = useMemo(() => [
    user && user.role==="admin" && {
      label: 'DASHBOARD',
      items: [
        {
          icon: MdAdminPanelSettings,
          label: 'Admin',
          active: pathname === '/admin',
          href: '/admin'
        },
        {
          icon: MdOutlinePlaylistAdd,
          label: 'Curator',
          active: pathname === '/curator',
          href: '/curator'
        }
      ]
    },
    user && user.role==="curator" && {
      label: 'Dashboard',
      items: [
        {
          icon: MdOutlinePlaylistAdd,
          label: 'Curator',
          active: pathname === '/curator',
          href: '/curator'
        }
      ]
    },
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
          icon: IoAlbumsOutline,
          label: 'Playlists',
          active: pathname === '/playlist',
          href: '/playlist'
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
          icon: IoHeartOutline,
          label: 'Liked Songs',
          active: pathname === '/liked-songs',
          href: '/liked-songs'
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
          active: false,
          href: '#',
          onClick: handleCreatePlaylist
        },
        ...(userPlaylistsData 
          ? userPlaylistsData
              .filter(playlist => playlist.name !== "Liked Songs")
              .map(playlist => ({
                icon: HiOutlineMusicalNote,
                label: playlist.name,
                active: pathname === `/userPlaylist/${playlist._id}`,
                href: `/userPlaylist/${playlist._id}`,
                extra: (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeletePlaylist(playlist._id);
                    }}
                    className="bg-neutral-800 p-2 rounded-full shadow-lg hover:bg-neutral-700 transition"
                  >
                    <IoTrashOutline size={16} className="text-neutral-400 hover:text-white" />
                  </button>
                )
              }))
          : []
        )
      ]
    }
  ].filter(Boolean), [pathname, user, userPlaylistsData]); // Lọc bỏ các mục `null` nếu user là `null`

  return (
    <div className="flex h-full">
      <div className="hidden md:flex flex-col w-[260px] bg-[#0A0A0A] h-full overflow-y-auto ">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-x-2 px-6 h-[80px]">
          <span className="text-white text-2xl">♪</span>
          <span className="text-white font-bold">BEATIFY</span>
        </Link>
      
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
          
        <div className="h-10"></div>
      </div>
      </div>
      <main className="h-full flex-1 overflow-y-auto py-2">
        {children}
      </main>
    </div>
  );
}

export default Sidebar;