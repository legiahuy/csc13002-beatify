"use client";

import { motion } from "framer-motion";
import Input from "@/components/Input"; 
import { Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import Link from 'next/link'; 

const Register: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        // Implement your signup logic here
    };

    return (
        // Center the form using flexbox and min-h-screen for full-height container
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <motion.div
                className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="p-8">
                    <h2 className="text-2xl font-semibold text-white mb-1 text-center"> BEATIFY</h2>
                    <h3 className="text-lg font-bold text-gray-100 mb-4 text-center">SIGN UP</h3>
                    <p className="text-sm text-gray-400 text-center mb-6">
                        To upload music and products, you must accept our{" "}
                        <Link href="/terms" className="text-purple-400 hover:underline">terms</Link> and{" "}
                        <Link href="/policy" className="text-purple-400 hover:underline">policy</Link> on the registration website.
                    </p>

                    <form onSubmit={handleSignUp}>
                        <Input
                            icon={User}
                            type="text"
                            placeholder="Username"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            icon={Mail}
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            icon={Lock}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <motion.button
                            className="mt-5 w-full py-3 px-4 bg-gray-700 text-white font-bold rounded-lg shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                        >
                            SIGN UP
                        </motion.button>

                        <div className="flex items-center mt-4">
                            <input
                                type="checkbox"
                                checked={acceptTerms}
                                onChange={() => setAcceptTerms(!acceptTerms)}
                                className="form-checkbox h-4 w-4 text-purple-500 bg-gray-800 border-gray-600 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-400">
                                I read and accepted the{" "}
                                <Link href="/terms" className="text-purple-400 hover:underline">terms</Link> and{" "}
                                <Link href="/policy" className="text-purple-400 hover:underline">policy</Link>
                            </label>
                        </div>
                    </form>
                </div>
                <div className="px-8 py-4 bg-gray-900 flex justify-center">
                    <p className="text-sm text-gray-400">
                        Already a member?{" "}
                        <Link href="/login" className="text-purple-400 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
