"use client";

import { motion } from "framer-motion";
import Input from "@/components/Input"; 
import { Lock, Mail, Loader } from "lucide-react";
import { useState } from "react";
import Link from 'next/link'; 

const Login: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string | null>(null); // Assuming you may want to handle an error state
	const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for the button

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		// Perform login logic here
	};

	return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <motion.div
            className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
          >
            <div className='p-8'>
                <h2 className="text-2xl font-semibold text-white mb-1 text-center"> BEATIFY</h2>
                <h3 className="text-lg font-bold text-white-100 mb-4 text-center">SIGN IN TO BEATIFY </h3>

              <form onSubmit={handleLogin}>
                <Input
                  icon={Mail}
                  type='email'
                  placeholder='Email Address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  icon={Lock}
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <div className='flex items-center mb-6'>
                  <Link href='/ForgotPassword' className='text-sm text-gray-400 hover:underline'>
                    Forgot password?
                  </Link>
                </div>
                {error && <p className='text-red-500 font-semibold mb-2'>{error}</p>}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className='mt-5 w-full py-3 px-4 bg-gray-700 text-white font-bold rounded-lg shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200'
                  type='submit'
                  disabled={isLoading}
                >
                  {isLoading ? <Loader className='w-6 h-6 animate-spin  mx-auto' /> : "LOGIN"}
                  </motion.button>
              </form>
            </div>
            <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
              <p className='text-sm text-gray-400'>
                Don't have an account?{" "}
                <Link href='/register' className='text-purple-400 hover:underline'>
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      );
};

export default Login;
