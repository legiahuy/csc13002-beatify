"use client"

import React from 'react';
import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    register?: UseFormRegister<FieldValues>;
    errors?: FieldErrors<FieldValues>;
}

const Input: React.FC<InputProps> = ({ icon: Icon, label, register, errors, id, ...props }) => {
    return (
        <div className="relative mb-6">
            {Icon && (
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Icon className="size-5 text-gray-500" />
                </div>
            )}
            <input
                id={id}
                {...(register && id ? register(id) : {})}
                {...props}
                className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 transition duration-200"
            />
        </div>
    );
};

export default Input;
