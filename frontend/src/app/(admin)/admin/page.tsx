"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore'; 
import DashboardSidebar from '@/components/DashboardSidebar';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("isauthenticated", isAuthenticated);
  console.log("user", user);

  return (
    <div></div>
  );
}
