"use client";

import { motion } from "framer-motion";
import Input from "@/components/Input"; 
import { Lock, Mail, Loader } from "lucide-react";
import Link from 'next/link'; 
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

import RedirectAuthenticatedUser from "@/components/redirectAuthenticatedUser"; // Adjust the path as necessary


const Login: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [setError] = useState<string | null>(null); // Assuming you may want to handle an error state
	const [setIsLoading] = useState<boolean>(false); // Loading state for the button
  const { login, isLoading, error, checkAuth, isCheckingAuth} = useAuthStore();
  const [emailError, setEmailError] = useState<string>(""); 
  const [passwordError, setPasswordError] = useState<string>("");


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    let hasError = false;

    if (!email) {
      setEmailError("Email is required.");
      hasError = true;
    } else {
      setEmailError(""); // Clear email error if field is valid
    }

    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    } else {
      setPasswordError(""); // Clear password error if field is valid
    }

    if (hasError) {
      return; // Stop execution if there are errors
    }

    // Proceed with login
    await login(email, password);
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
          className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-white mb-1 text-center">Beatify</h2>
            <h3 className="text-lg font-bold text-white-100 mb-4 text-center">Welcome Back</h3>

            <form onSubmit={handleLogin}>
              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <p className="text-red-500 font-semibold mb-2">{emailError}</p>}

              <Input
                icon={Lock}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <p className="text-red-500 font-semibold mb-2">{passwordError}</p>}
              

              <div className="flex items-center mb-6">
                <Link href="/forgot-password" className="text-sm text-purple-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              {error && <p className="text-red-500 font-semibold">{error}</p>}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-5 w-full py-3 px-4 bg-gray-700 text-white font-bold rounded-lg shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Login"}
              </motion.button>
            </form>
          </div>
          <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-purple-400 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </RedirectAuthenticatedUser>
  );
};

export default Login;
