"use client";

import { useAuthStore } from "@/store/authStore"; 
import { useRouter } from "next/navigation"; 
import { ReactNode, useEffect } from "react"; 
import { Loader } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore(); 
  const router = useRouter();

  useEffect(() => {
    // Check authentication only if we are not currently checking auth
    if (!isCheckingAuth) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user && !user.isVerified) {
        router.push("/verify-email");
      }
    }
  }, [isAuthenticated, user, router, isCheckingAuth]);

  // If we are still checking auth, return a loading state or null
  if (isCheckingAuth) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Loader className='animate-spin' size={24} />
    </div>; // Or any loading spinner you prefer
  }

  return <>{children}</>;
};

export default ProtectedRoute;
