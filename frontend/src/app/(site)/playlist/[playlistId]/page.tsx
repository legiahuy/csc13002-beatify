"use client";

import Image from "next/image";
import { FaPlay, FaPause } from 'react-icons/fa';
import Link from 'next/link';
import { usePlayer } from "@/contexts/PlayerContext";
import { Loader } from "lucide-react";  // Import lucide icons

interface PlaylistPageProps {
  params: {
    playlistId: string;
  }
}

export default function PlaylistPage({ params }:PlaylistPageProps) {
  const { songsData, playlistsData, playSong, currentSong, isPlaying, togglePlay } = usePlayer();
  
  if (!songsData || !playlistsData) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="animate-spin text-white" size={30} />
        <p className="ml-4 text-white">Loading playlist data...</p>
      </div>
    );
  }

  const playlist = playlistsData.find((playlist) => playlist._id === params.playlistId);

  if (!playlist) {
    return <div className="text-white">Playlist not found!</div>;
  }

  const playlistSongs = songsData.filter((song) => song.playlist.includes(playlist.name));

  // Ensure the bgColour is a valid CSS color or fallback to a default one
  const bgColor = playlist.bgColour || "#000000"; // Fallback to black if no color is provided

  return (
    <div className="h-full w-[99.5%] rounded-lg overflow-hidden overflow-y-auto"
         style={{
           background: `linear-gradient(180deg, ${bgColor} 0%, rgba(0, 0, 0, 0.7) 100%)`
         }}>
      <div className="flex flex-col md:flex-row items-center gap-x-7 mb-8 p-6">
        {/* Playlist picture */}
        <div className="relative h-64 w-64">
          <Image
            className="object-cover"
            fill
            src={playlist.image || "/default-profile.png"}  // Fallback image if pfp is not available
            alt={playlist.name}
          />
        </div>

        <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
          <h1 className="text-white text-6xl font-bold">{playlist.name}</h1>
          <p className="text-gray-300 text-sm font-semibold">{playlist.desc || "No bio available"}</p>
        </div>
      </div>

      <div>
        <h2 className="text-white text-xl font-semibold mb-4">Songs</h2>
        {playlistSongs.length === 0 ? (
          <p className="text-white">No songs found for this playlist.</p>
        ) : (
          <div>
            {playlistSongs.map((song) => (
              <div
                key={song._id}
                className="flex items-center text-neutral-400 text-sm px-6 py-4 hover:bg-white/10 rounded-lg cursor-pointer group"
              >
                <div className="w-[30px]">
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent page change when clicking play
                      const isCurrentSong = currentSong?._id === song._id;
                      if (isCurrentSong) {
                        togglePlay();
                      } else {
                        playSong(song, { type: "playlist", id: playlist._id });
                      }
                    }}
                  >
                    {currentSong?._id === song._id && isPlaying ? (
                      <FaPause size={16} />
                    ) : (
                      <FaPlay size={16} />
                    )}
                  </button>
                </div>
                <div className="flex-1">
                  <Link href={`/song/${song._id}`} className="text-white hover:underline">
                    {song.name}
                  </Link>
                </div>
                <div className="w-[100px] text-right">{song.duration || '0:00'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
