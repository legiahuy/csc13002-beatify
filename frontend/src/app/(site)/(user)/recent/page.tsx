"use client";

import Image from "next/image";
import { FaPlay, FaPause } from 'react-icons/fa';
import Link from 'next/link';
import { usePlayer } from "@/contexts/PlayerContext";
import { Loader } from "lucide-react";
import ProtectedRoute from "@/components/protectedRoute";

export default function RecentlyPlayedPage() {
  const { recentlyPlayed, playSong, currentSong, isPlaying, togglePlay } = usePlayer();
  
  if (!recentlyPlayed) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center h-full">
          <Loader className="animate-spin text-white" size={30} />
          <p className="ml-4 text-white">Loading recently played songs...</p>
        </div>
      </ProtectedRoute>
    );
  }

  const recentSongs = recentlyPlayed || [];
  
  const isCurrentSong = (song: any) => currentSong?._id === song._id;
  const isPlayingRecentSongs = currentSong && recentSongs.some((song: any) => song._id === currentSong._id);

  const formatDuration = (duration: string): string => {
    const [minutes, seconds] = duration.split(':');
    const paddedSeconds = seconds.padStart(2, '0');
    return `${minutes}:${paddedSeconds}`;
  };
  
  return (
    <ProtectedRoute>
      <div className="h-full w-[99.5%] rounded-lg overflow-hidden overflow-y-auto">
        <div className="p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center gap-x-7">
            <div className="relative aspect-square w-64 overflow-hidden flex-shrink-0">  
              <Image
                className="object-cover rounded"
                fill
                sizes="256px"
                src="/images/recent-plays.png"
                alt="Recently Played"
              />
            </div>
            <div className="flex flex-col justify-center gap-y-2 mt-4 md:mt-0 flex-grow">
              <p className="text-sm font-semibold text-white uppercase">
                Playlist
              </p>
              <h1 className="text-white text-7xl font-bold break-words">
                Recently Played
              </h1>
              <div className="flex items-center gap-x-2 mt-4">
                <p className="text-gray-300 text-sm font-semibold">
                  Your listening history
                </p>
              </div>
            </div>
          </div>

          {/* Songs Section */}
          <div className="px-6 md:px-12 mt-8">
            <h2 className="text-2xl font-semibold mb-4">Recently Played</h2>
            {recentSongs.length === 0 ? (
              <p className="text-gray-400">No recently played songs.</p>
            ) : (
              <div>
                {recentSongs.map((song: any) => (
                  <div
                    key={song._id}
                    className={`
                      flex items-center text-gray-400 text-sm py-3 
                      hover:bg-white/10
                      cursor-pointer group px-4 rounded-lg
                    `}
                  >
                    {/* Song Cover */}
                    <div className="relative w-12 h-12 mr-4">
                      <Image
                        className="object-cover rounded"
                        fill
                        src={song.image}
                        alt={song.name}
                      />
                    </div>

                    {/* Song Controls */}
                    <div className="w-[30px]">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (isCurrentSong(song)) {
                            togglePlay();
                          } else {
                            playSong(song, { type: "playlist", id: "recent" });
                          }
                        }}
                      >
                        {isCurrentSong(song) && isPlaying ? (
                          <FaPause size={16} />
                        ) : (
                          <FaPlay size={16} />
                        )}
                      </button>
                    </div>

                    {/* Song Details */}
                    <div className="flex-1 ml-4">
                      <Link href={`/song/${song._id}`} className="text-white font-medium hover:underline">
                        {song.name}
                      </Link>
                    </div>

                    {/* Song Duration */}
                    <div className="w-[60px] text-right">{song.duration ? formatDuration(song.duration) : '0:00'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
