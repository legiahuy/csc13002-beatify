"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
    const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();
    const { error, isLoading, verifyEmail } = useAuthStore();

    const handleChange = (index: number, value: string) => {
        const newCode = [...code];

        // Handle pasted content
        if (value.length > 1) {
            const pastedCode = value.slice(0, 6).split("");
            for (let i = 0; i < 6; i++) {
                newCode[i] = pastedCode[i] || "";
            }
            setCode(newCode);

            // Focus on the last non-empty input or the first empty one
            const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
            if (inputRefs.current[focusIndex]) {
                inputRefs.current[focusIndex]!.focus();
            }
        } else {
            newCode[index] = value;
            setCode(newCode);

            // Move focus to the next input field if value is entered
            if (value && index < 5 && inputRefs.current[index + 1]) {
                inputRefs.current[index + 1]!.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            if (inputRefs.current[index - 1]) {
                inputRefs.current[index - 1]!.focus();
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
		console.log("handleSubmit called");
        e.preventDefault();
        const verificationCode = code.join("");
        try {
            await verifyEmail(verificationCode);
            router.push("/"); // Navigate to the home page on success
            toast.success("Email verified successfully");
        } catch (error) {
            console.log(error);
        }
    };

    // Auto submit when all fields are filled
	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			const syntheticEvent = {
				preventDefault: () => {},
			} as React.FormEvent<HTMLFormElement>;
	
			handleSubmit(syntheticEvent); // Call handleSubmit with the synthetic event
		}
	}, [code]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
                >
                    <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-purple-500 text-transparent bg-clip-text'>
                        Verify Your Email
                    </h2>
                    <p className='text-center text-gray-300 mb-6'>Enter the 6-digit code sent to your email address.</p>

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className='flex justify-between'>
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => {
                                        inputRefs.current[index] = el;
                                    }}
                                    type='text'
                                    maxLength={6} // Changed maxLength to 1 for each digit
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none'
                                />
                            ))}
                        </div>
                        {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type='submit'
                            disabled={isLoading || code.some((digit) => !digit)}
                            className='w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50'
                        >
                            {isLoading ? "Verifying..." : "Verify Email"}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default EmailVerificationPage;