"use client"

import { useRouter } from "next/navigation";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { useState } from "react";

import Button from "./Button"


import { twMerge } from "tailwind-merge" 

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header:React.FC<HeaderProps> = ({
  children,
  className
}) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý tìm kiếm ở đây
    router.push(`/search?q=${searchValue}`);
  }

  const HandleLogout = () => {
    // Handle logout in the future
  }

  return (
    <div
      className={twMerge(`
        sticky
        top-0
        z-50
        h-fit
        bg-gradient-to-b
        from-cyan-800
        p-6
      `,
        className
      )}
    >
      <div className="
        w-full
        mb-4
        flex
        items-center
        justify-between
        gap-x-4
      ">
        <div className="
          hidden
          md:flex
          gap-x-2
          items-center
          flex-shrink-0
        ">
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

        {/* Thanh tìm kiếm được cập nhật */}
        <form 
          onSubmit={onSearch}
          className="
            hidden 
            md:flex 
            flex-1 
            justify-center 
            max-w-[400px]
            w-full
            mx-auto
          "
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
              placeholder="Tìm kiếm..."
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

        <div className="
          flex
          justify-end
          items-center
          gap-x-4
          flex-shrink-0
        ">
          <>
            <div>
              <Button
                onClick={() => router.push('/register')}
                className="
                  bg-transparent
                  text-neutral-300
                  font-medium
                "
              >
                Sign up
              </Button>
            </div>
            <div>
              <Button
                onClick={() => router.push('/login')}
                className="
                  bg-white
                  px-6
                  py-2
                "
              >
                Log in
              </Button>
            </div>
          </>
        </div>
      </div>
      {children}
    </div>
  );
}

export default Header;
