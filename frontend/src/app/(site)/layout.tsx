"use client"
import Sidebar from "@/components/Sidebar";
import PlayingBar from "@/components/PlayingBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Header from "@/components/Header";


export const url = 'http://localhost:4000';

const useAuth = () => {
  const [user, setUser] = useState<{ name: string; image: string; role: string } | null>(null);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${url}/api/auth/check-auth`);
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.log("Error Occurred");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user };
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();  // Use the hook here

  return (
    <div className="h-full">
      <ToastContainer />
      <div className="flex h-full">
        {/* Truyền `user` vào Sidebar */}
        <Sidebar user={user}>{''}</Sidebar>
        <div className="
          bg-neutral-900
          rounded-lg
          h-full
          w-[99.5%]
          overflow-hidden
          overflow-y-auto
          pb-20  
        ">
        <Header className="flex-shrink-0" user={user}>
          <main className="h-[91%] flex-1 overflow-y-auto">
            {children}  {/* This is where your page content will be rendered */}
          </main>
         </Header>
        </div>
      </div>
      <PlayingBar /> 
    </div>
  );
}

