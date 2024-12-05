"use client"
import Sidebar from "@/components/Sidebar";
import PlayingBar from "@/components/PlayingBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

import Header from "@/components/Header";
import { PlayerProvider } from '@/contexts/PlayerContext'
import { LayoutProvider, useLayout } from '@/contexts/LayoutContext';


export const url = 'http://localhost:4000';

const useAuth = () => {
  const [user, setUser] = useState<{ name: string; image: string; role: string; _id: string; plan: string } | null>(null);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${url}/api/auth/check-auth`, {
        withCredentials: true
      });
      if (response.data.success) {
        setUser(response.data.user);
        console.log(response.data.user);
      }
    } catch (error) {
      console.log("Error Occurred");
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user };
};

// Main layout component that provides context
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <PlayerProvider user={user}>
      <LayoutProvider>
        <LayoutContent user={user}>
          {children}
        </LayoutContent>
      </LayoutProvider>
    </PlayerProvider>
  );
}

// Inner component to use layout hook after provider is available
function LayoutContent({ children, user }: { children: React.ReactNode, user: any }) {
  const { gradient } = useLayout();
  
  // Construct the gradient style
  const gradientStyle = {
    background: `linear-gradient(to bottom, ${gradient.trim()}, #000000)`,
  };

  return (
    <div className="h-full">
      <ToastContainer />
      <div className="flex h-full">
        <Sidebar user={user}>{''}</Sidebar>
        
        <div style={gradientStyle} className="rounded-lg h-full w-[99.5%] overflow-hidden overflow-y-auto pb-20">
          <Header className="flex-shrink-0 p-6" user={user}>
            <main className="h-[91%] flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </Header>
        </div>
      </div>
      <PlayingBar /> 
    </div>
  );
}

