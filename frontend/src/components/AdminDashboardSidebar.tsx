"use client"

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import SidebarItem from "./SidebarItem";
import { IoPersonAdd } from "react-icons/io5";
import { IoMdPerson } from "react-icons/io";
import Link from "next/link";

interface SidebarProps {
  children: React.ReactNode;
}

const AdminDashboardSidebar: React.FC<SidebarProps> = ({ children }) => {
  const pathname = usePathname();

  const sections = useMemo(() => [
    {
      label: 'ARTIST',
      items: [
        {
          icon: IoPersonAdd,
          label: 'Add Artist',
          active: pathname === '/admin/add-artist',
          href: '/admin/add-artist'
        },
        {
          icon: IoMdPerson,
          label: 'List Artist',
          active: pathname === '/admin/list-artist',
          href: '/admin/list-artist'
        }
      ]
    },
    {
      label: 'USER',
      items: [
        {
          icon: IoPersonAdd,
          label: 'Add User',
          active: pathname === '/admin/add-user',
          href: '/admin/add-user'
        },
        {
          icon: IoMdPerson,
          label: 'List User',
          active: pathname === '/admin/list-user',
          href: '/admin/list-user'
        }
      ]
    },
  ], [pathname]);

  return (
    <div className="flex h-full">
      <div className="hidden md:flex flex-col w-[260px] bg-[#0A0A0A] h-full">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-x-2 px-6 h-[80px]">
          <span className="text-white text-2xl">♪</span>
          <span className="text-white font-bold">BEATIFY</span>
        </Link>
        
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

export default AdminDashboardSidebar;