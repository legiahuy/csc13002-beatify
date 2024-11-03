"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore'; // adjust this path as necessary
import DisplayHome from '@/components/DisplayHome';

export default function Home() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("isauthenticated", isAuthenticated);
  console.log("user", user);

  return (
    <DisplayHome />
  );
}
