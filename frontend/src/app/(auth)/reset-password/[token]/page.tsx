"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import Input from "@/components/Input";
import { Lock, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; // Use Next.js router
import { usePathname } from "next/navigation"; // To access the current pathname

import RedirectAuthenticatedUser from "@/components/redirectAuthenticatedUser"; // Adjust the path as necessary


const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { resetPassword, error, isLoading, message, checkAuth, isCheckingAuth } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const token = pathname.split("/").pop(); //

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className='max-w-md w-full bg-gray-800 bg-opacity-50 rounded-2xl shadow-xl p-8 text-center'>
                    <h2 className='text-3xl font-bold mb-6 text-center text-red-500'>
                        Invalid Request
                    </h2>
                    <p>Please provide a valid reset token to reset your password.</p>
                </div>
            </div>
        );
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        try {
            await resetPassword(token, password);

            toast.success("Password reset successfully, redirecting to login page...");
            setTimeout(() => {
                router.push("/login"); // Navigate to the login page
            }, 2000);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Error resetting password");
        }
    };

    useEffect(() => {
        const checkUserAuth = async () => {
            await checkAuth(); // Ensure this returns a promise if needed
        };
        checkUserAuth();
      }, [checkAuth]);
    
      if (isCheckingAuth) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-gray-900">
              <Loader className='animate-spin' size={24} />
          </div>
        );
      }

    return (
        <RedirectAuthenticatedUser>
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
                >
                    <div className='p-8'>
                        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-purple-500 text-transparent bg-clip-text'>
                            Reset Password
                        </h2>
                        {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
                        {message && <p className='text-purple-500 text-sm mb-4'>{message}</p>}

                        <form onSubmit={handleSubmit}>
                            <Input
                                icon={Lock}
                                type='password'
                                placeholder='New Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <Input
                                icon={Lock}
                                type='password'
                                placeholder='Confirm New Password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className='w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
                                type='submit'
                                disabled={isLoading}
                            >
                                {isLoading ? "Resetting..." : "Set New Password"}
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </RedirectAuthenticatedUser>
    );
};

export default ResetPasswordPage;
