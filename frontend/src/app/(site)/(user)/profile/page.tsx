"use client";

import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/utils/date";
import ProtectedRoute from "@/components/protectedRoute";
import Image from "next/image";
import Link from "next/link";
import { BiChevronRight } from "react-icons/bi";
import { usePlayer } from '@/contexts/PlayerContext';

interface UserPlaylist {
  _id: string;
  name: string;
  image?: string;
}

const ProfilePage = () => {
  const { user } = useAuthStore(); // Assuming playlistsData is available in the auth store
  const { userPlaylistsData, playlistsData } = usePlayer();

  return (
    <ProtectedRoute>
      <div
        className="h-half w-[99.5%] rounded-lg overflow-hidden overflow-y-auto relative"
      >
        <div className="flex flex-col md:flex-row items-center gap-x-7 mb-8 p-6">
        <div className="relative h-64 w-64 rounded-full overflow-hidden">
            <Image
              className="object-cover rounded-full"
              fill
              src={user?.pfp || "/images/default-profile.jfif"} 
              alt={user?.name || "User Profile"}
            />
          </div>

          <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
          <p className="text-gray-300 text-sm font-semibold">Profile</p>
            <h1 className="text-white text-6xl font-bold">{user?.name}</h1>
            <p className="text-gray-300 text-sm">
              <span className="font-bold">Role:  </span>
              {user?.role}
            </p>
            <p className="text-gray-300 text-sm">
              <span className="font-bold">Plan: </span>
              {user?.plan}
            </p>
            {user?.plan === "premium" && (
              <p className="text-gray-300 text-sm">
                <span className="font-bold">Plan Expires: </span>
                {new Date(user.planExpires).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
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
            <h1 className="text-white text-2xl font-semibold">User Playlists</h1>
            <Link
              href="/userPlaylist"
              className="text-neutral-400 hover:text-white flex items-center gap-x-1 cursor-pointer transition text-sm font-medium"
            >
              Show all
              <BiChevronRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-1">
            {userPlaylistsData?.slice(0, 5).map((playlist) => (
              <div key={playlist._id} className="flex flex-col items-center">
                <Link href={`/playlist/${playlist._id}`}>
                  <div className="relative aspect-square w-[150px] sm:w-[180px] overflow-hidden cursor-pointer hover:opacity-80 transition">
                    <Image
                      src={(playlist as any).image || "/images/liked-songs.png"}
                      fill
                      alt={playlist.name}
                      className="object-cover"
                    />
                  </div>
                </Link>
                <p className="text-white mt-4 text-lg font-medium">{playlist.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
