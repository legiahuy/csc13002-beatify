"use client";

import { motion } from "framer-motion";
import Input from "@/components/Input"; 
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import Link from 'next/link'; 
import { useAuthStore } from "@/store/authStore";


import RedirectAuthenticatedUser from "@/components/redirectAuthenticatedUser"; // Adjust the path as necessary


const ForgotPasswordPage: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
	const [setIsLoading] = useState<boolean>(false); // Trạng thái tải, nếu cần
	const { isLoading, checkAuth, isCheckingAuth, forgotPassword} = useAuthStore();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await forgotPassword(email);
		setIsSubmitted(true);
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
				
				className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
			>
				<div className='p-8'>
					<h2 className='text-3xl font-bold text-white-100 mb-4 text-center'>
						Forgot Password
					</h2>

					{!isSubmitted ? (
						<form onSubmit={handleSubmit}>
							<p className='text-gray-300 mb-6 text-center'>
								Enter your email address and we'll send you a link to reset your password.
							</p>
							<Input
								icon={Mail}
								type='email'
								placeholder='Email Address'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="w-full py-3 px-4 bg-gray-500 text-white font-bold rounded-lg shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
								type='submit'
								//disabled={isLoading} // Vô hiệu hóa nút khi đang tải
							>
								{isLoading ? <Loader className='size-6 animate-spin mx-auto' /> : "Send Reset Link"}
							</motion.button>
						</form>
					) : (
						<div className='text-center'>
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ type: "spring", stiffness: 500, damping: 30 }}
								className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4'
							>
								<Mail className='h-8 w-8 text-white' />
							</motion.div>
							<p className='text-gray-300 mb-6'>
								If an account exists for {email}, you will receive a password reset link shortly.
							</p>
						</div>
					)}
				</div>

				<div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
					<Link href={"/login"} className='text-sm text-purple-400 hover:underline flex items-center'>
						<ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
					</Link>
				</div>
			</motion.div>
			</div>
		</RedirectAuthenticatedUser>
	);
};

export default ForgotPasswordPage;
