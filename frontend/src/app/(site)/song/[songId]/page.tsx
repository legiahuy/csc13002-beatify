"use client";

import Image from "next/image";
import { FaPlay, FaPause } from 'react-icons/fa';
import Link from 'next/link';
import { usePlayer } from "@/contexts/PlayerContext";
import { Loader } from "lucide-react";  // Import lucide icons


interface SongPageProps {
  params: {
    songId: string;
  }
}

export default function SongPage({ params }: SongPageProps) {

  const { songsData, artistsData } = usePlayer();
  
  // Handle case when songsData is null or undefined
  if (!songsData || !artistsData) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="animate-spin text-white-500" size={30} />
        <p className="ml-4 text-white">Loading songs...</p>
      </div>
    );
  }

  const song = songsData.find((item) => item._id === params.songId);
  const { playSong, currentSong, isPlaying, togglePlay } = usePlayer();

  if (!song) {
    return <div>Song not found!</div>;
  }

  const isCurrentSong = currentSong?._id === song._id;

  // Retrieve artist names and make them clickable
  const artistLinks = song.artist_id.map((artistId, index) => {
    const artist = artistsData.find(artist => artist._id === artistId);
    return artist ? (
      <span key={artist._id}>
        <Link href={`/artist/${artist._id}`}>
          <span className="hover:underline text-gray-300">{artist.name}</span>
        </Link>
        {index < song.artist_id.length - 1 && " • "}
      </span>
    ) : (
      <span key={artistId}>Unknown Artist</span>
    );
  });

  const firstArtist = artistsData.find(artist => artist._id === song.artist_id[0]);

  return (
    <div className="h-full w-[99.5%] rounded-lg overflow-hidden overflow-y-auto">
      <div></div>
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-end gap-x-7">
          <div className="relative h-64 w-64 shadow-2xl">
            <Image
              className="object-cover rounded-lg"
              fill
              src={song.image} // Use the first artist's image, fallback to song image
              alt={song.name}
            />
          </div>
          <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
            <p className="text-sm font-semibold text-white uppercase">
              {'Single'}
            </p>
            <h1 className="text-white text-8xl font-bold">
              {song.name}
            </h1>
            <div className="flex items-center gap-x-2 mt-4">
              <div className="h-6 w-6 relative">
                <Image
                  className="rounded-full"
                  fill
                  src={firstArtist?.pfp || song.image} // Use first artist's image for the circle
                  alt={artistLinks.toString()} // Accessibility: List all artists as alt text
                />
              </div>
              <p className="text-gray-300 text-sm font-semibold">
                {artistLinks} • {song.duration || '0:00'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-x-4">
          <button
            onClick={() => {
              if (isCurrentSong) {
                togglePlay();
              } else {
                playSong(song);
              }
            }}
            className="bg-green-500 rounded-full w-14 h-14 flex items-center justify-center hover:scale-105 transition"
          >
            {isCurrentSong && isPlaying ? (
              <FaPause size={24} className="text-black" />
            ) : (
              <FaPlay size={24} className="text-black ml-1" />
            )}
          </button>
        </div>

        <div className="mt-8">
          <div className="flex text-white text-sm px-6 py-4">
            <div className="flex-1">Title</div>
            <div className="w-[100px] text-right">⏱</div>
          </div>
          <Link href={`/song/${song._id}`}>
            <div 
              className="flex items-center text-neutral-400 text-sm px-6 py-4 hover:bg-white/10 rounded-lg cursor-pointer group"
            >
              <div className="w-[30px]">
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent page change when clicking play
                    if (isCurrentSong) {
                      togglePlay();
                    } else {
                      playSong(song);
                    }
                  }}
                >
                  {isCurrentSong && isPlaying ? (
                    <FaPause size={16} />
                  ) : (
                    <FaPlay size={16} />
                  )}
                </button>
              </div>
              <div className="flex-1">{song.name}</div>
              <div className="w-[100px] text-right">{song.duration}</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
