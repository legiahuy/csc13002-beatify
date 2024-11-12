"use client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { Loader } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  roleRequired?: string | string[] | null; // Allow single role or array of roles
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
      } else if (roleRequired) {
        const requiredRoles = Array.isArray(roleRequired) ? roleRequired : [roleRequired];
        const userHasAnyRole = requiredRoles.some(role => user?.role?.includes(role));
        
        if (!userHasAnyRole) {
          router.push("/"); // Redirect if user doesn’t have any required role
        }
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

  return <>{children}</>;
};

export default ProtectedRoute;