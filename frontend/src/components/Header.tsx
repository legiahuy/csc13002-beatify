"use client"

import { useRouter } from "next/navigation";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { BiSearch } from "react-icons/bi";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";


import Button from "./Button"


import { twMerge } from "tailwind-merge" 

interface User {
  name: string;
  image: string;
}

interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
  user: User | null;
}

const Header:React.FC<HeaderProps> = ({
  children,
  user,
  className
}) => {
  const router = useRouter();
  
  //console.log(user);
  const [searchValue, setSearchValue] = useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${searchValue}`);
  }

  const HandleLogout = () => {
    // Handle logout in the future
  }
  return (
    <div className={twMerge(`sticky top-0 z-50 h-fit bg-gradient-to-b from-cyan-800`)}>
      <div className="w-full mb-4 flex items-center justify-between gap-x-4">
        <div className="hidden md:flex gap-x-2 items-center flex-shrink-0">
        <button
            onClick={() => router.back()}
            className="
              rounded-full
              bg-neutral-900
              flex
              items-center
              justify-center
              hover:opacity-80
              transition
            " 
          >
            <RxCaretLeft className="text-white" size={35}/>
          </button>
          <button
            onClick={() => router.forward()}
            className="
              rounded-full
              bg-neutral-900
              flex
              items-center
              justify-center
              hover:opacity-80
              transition
            " 
          >
            <RxCaretRight className="text-white" size={35}/>
          </button>
        </div>

        {/* Search bar */}
        <form 
          onSubmit={onSearch}
          className="hidden md:flex flex-1 justify-center max-w-[400px] w-full mx-auto"
        >
                    <div className="
            flex 
            items-center 
            w-full 
            bg-neutral-900 
            rounded-full 
            overflow-hidden
            transition
            border
            border-transparent
            focus-within:bg-neutral-800
          ">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search songs and artists"
              className="
                w-full 
                px-4 
                py-2 
                outline-none 
                bg-transparent
                text-white 
                placeholder:text-neutral-400
                text-sm
              "
            />
            <button 
              type="submit"
              className="
                p-2
                text-neutral-400
                hover:text-white
                transition
                flex
                items-center
                justify-center
              "
            >
              <BiSearch size={20} />
            </button>
          </div>
        </form>

        <div className="flex justify-end items-center gap-x-4 flex-shrink-0">
          {user ? (
            <div onClick={() => router.push('/profile')} className="cursor-pointer">
              <FaUserCircle
                size={40}  // Icon size
                className="rounded-full bg-neutral-500 text-white"  // Styling the icon to appear as a circle with background color
              />
            </div>
          ) : (
            <>
              <Button
                onClick={() => router.push('/signup')}
                className="bg-transparent text-neutral-300 font-medium"
              >
                Sign up
              </Button>
              <Button
                onClick={() => router.push('/login')}
                className="bg-white px-6 py-2"
              >
                Log in
              </Button>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export default Header;
