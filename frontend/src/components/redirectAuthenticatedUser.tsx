"use client";

import { useAuthStore } from "@/store/authStore"; // Assume this store provides user info and auth status
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface RedirectAuthenticatedUserProps {
  children: ReactNode;
}

const RedirectAuthenticatedUser: React.FC<RedirectAuthenticatedUserProps> = ({ children }) => {
  const { isAuthenticated, user} = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user.isVerified) {
      router.push("/"); 
    }
  }, [isAuthenticated, router]);

  return !isAuthenticated ? <>{children}</> : null;
};

export default RedirectAuthenticatedUser;