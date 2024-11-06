"use client"
import { useAuthStore } from "@/store/authStore"; 
import { useRouter } from "next/navigation"; 
import { ReactNode, useEffect } from "react"; 
import { Loader } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  roleRequired?: string | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roleRequired }) => {
  const { isAuthenticated, user, isCheckingAuth, checkAuth } = useAuthStore(); 
  const router = useRouter();

  useEffect(() => {
    const checkUserAuth = async () => {
      await checkAuth();
    };
    checkUserAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isCheckingAuth) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user && !user.isVerified) {
        router.push("/verify-email");
      } else if (roleRequired && user?.role !== roleRequired) {
        router.push("/"); // Redirect if role doesn’t match
      }
    }
  }, [isAuthenticated, user, roleRequired, router, isCheckingAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader className='animate-spin' size={24} />
      </div>
    );
  }

  if (isAuthenticated && roleRequired && user.role !== roleRequired) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
