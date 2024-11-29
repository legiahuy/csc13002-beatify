"use client";

import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/utils/date";
import ProtectedRoute from "@/components/protectedRoute";
import Image from "next/image";
import Link from "next/link";
import { BiChevronRight } from "react-icons/bi";
import { usePlayer } from '@/contexts/PlayerContext';

const ProfilePage = () => {
  const { user, logout } = useAuthStore(); // Assuming playlistsData is available in the auth store
  const { songsData, artistsData, playlistsData } = usePlayer();
  const handleLogout = () => {
    logout();
  };

  // Ensure the bgColour is a valid CSS color or fallback to a default one
  const bgColor = user?.bgColour || "Grey"; // Fallback to gray if no color is provided

  return (
    <ProtectedRoute>
      <div
        className="h-half w-[99.5%] rounded-lg overflow-hidden overflow-y-auto relative"
        style={{
          background: `linear-gradient(180deg, ${bgColor} 0%, rgba(0, 0, 0, 0.7) 100%)`,
        }}
      >
        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute top-4 right-4 z-10"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-32 py-2 px-4 bg-white text-black font-bold rounded-lg shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Logout
          </motion.button>
        </motion.div>

        {/* User Profile */}
        <div className="flex flex-col md:flex-row items-center gap-x-7 mb-8 p-6">
        <div className="relative h-64 w-64 border-4 border-white rounded-full overflow-hidden">
            <Image
              className="object-cover rounded-full"
              fill
              src={user?.pfp || "/default-profile.png"} // Fallback image if pfp is not available
              alt={user?.name || "User Profile"}
            />
          </div>

          <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
            <h1 className="text-white text-6xl font-bold">{user?.name}</h1>
            <p className="text-gray-300 text-sm font-semibold">{user?.email}</p>
            <p className="text-gray-300 text-sm font-semibold">{user?.role}</p>
            <p className="text-gray-300 text-sm">
              <span className="font-bold">Joined: </span>
              {user && new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-gray-300 text-sm">
              <span className="font-bold">Last Login: </span>
              {user && formatDate(user.lastLogin)}
            </p>
          </div>
        </div>

        {/* Playlists Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-white text-2xl font-semibold">Playlists</h1>
            <Link
              href="/playlists"
              className="text-neutral-400 hover:text-white flex items-center gap-x-1 cursor-pointer transition text-sm font-medium"
            >
              Show all
              <BiChevronRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-1">
            {playlistsData?.slice(0, 5).map((playlist) => (
              <div key={playlist._id} className="flex flex-col items-center">
                <Link href={`/playlist/${playlist._id}`}>
                  <div className="relative aspect-square w-[150px] sm:w-[180px] overflow-hidden cursor-pointer hover:opacity-80 transition">
                    <Image
                      src={playlist.image}
                      fill
                      alt={playlist.name}
                      className="object-cover"
                    />
                  </div>
                </Link>
                <p className="text-white mt-4 text-lg font-medium">{playlist.name}</p>
                <p className="text-neutral-400 text-sm">{playlist.artist}</p>

                {/* Optional Fields */}
                {playlist.type && (
                  <p className="text-neutral-500 text-xs mt-1">{playlist.type}</p>
                )}
                {playlist.year && (
                  <p className="text-neutral-500 text-xs">{playlist.year}</p>
                )}
                {playlist.duration && (
                  <p className="text-neutral-500 text-xs">{playlist.duration}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
