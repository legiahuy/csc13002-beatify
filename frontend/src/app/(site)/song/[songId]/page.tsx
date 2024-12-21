"use client";

import Image from "next/image";
import { FaPlay, FaPause } from 'react-icons/fa';
import Link from 'next/link';
import { usePlayer } from "@/contexts/PlayerContext";
import { Loader } from "lucide-react";  // Import lucide icons
import { BsThreeDots } from 'react-icons/bs';
import { PlaylistMenu } from "@/components/PlaylistMenu";


interface SongPageProps {
  params: {
    songId: string;
  }
}
const formatDuration = (duration: string): string => {
  const [minutes, seconds] = duration.split(':');
  const paddedSeconds = seconds.padStart(2, '0');
  return `${minutes}:${paddedSeconds}`;
};

export default function SongPage({ params }: SongPageProps) {

  const { songsData, artistsData } = usePlayer();
  
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
        <div className="flex flex-col md:flex-row items-start gap-x-7">
          <div className="relative aspect-square w-64 flex-shrink-0">
            <Image
              className="object-cover rounded-lg"
              fill
              src={song.image} 
              alt={song.name}
            />
          </div>
          <div className="flex flex-col gap-y-2 mt-4 md:mt-0 flex-grow">
            <p className="text-sm font-semibold text-white uppercase">
              {'Single'}
            </p>
            <h1 className="text-white text-8xl font-bold break-words">
              {song.name}
            </h1>
            <div className="flex items-center gap-x-2 mt-4">
              <div className="h-6 w-6 relative">
                <Image
                  className="rounded-full"
                  fill
                  src={firstArtist?.pfp || song.image} 
                  alt={artistLinks.toString()} 
                />
              </div>
              <p className="text-gray-300 text-sm font-semibold">
                {artistLinks} • {song.duration ? formatDuration(song.duration) : '0:00'}
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
                playSong(song, { type: "single", id: song._id });
              }
            }}
            className={`
              bg-gray-100 
              rounded-full 
              w-14 h-14 flex 
              items-center 
              justify-center 
              group-hover:opacity-100 
              group-hover:translate-y-0
              hover:scale-110
              transition
              items-center 
              justify-center 
              bg-gray-100 
              drop-shadow-md 
              `} 
          >
            {isCurrentSong && isPlaying ? (
              <FaPause size={24} className="text-black" />
            ) : (
              <FaPlay size={24} className="text-black ml-1" />
            )}
          </button>
        </div>

        <div className="mt-8">
          <div 
            className="flex items-center justify-center text-gray-400 text-sm px-6 py-4 hover:bg-white/10 rounded-lg cursor-pointer group"
          >
            <div className="w-[30px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isCurrentSong) {
                    togglePlay();
                  } else {
                    playSong(song, { type: "single", id: song._id });
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
            <Link href={`/song/${song._id}`} className="flex-1">
              <div className="text-white font-medium hover:underline">{song.name}</div>
            </Link>
            <div className="flex items-center gap-x-4">
              <div className="w-[60px] text-right">
                {song.duration ? formatDuration(song.duration) : '0:00'}
              </div>
              <div className="w-[40px] flex justify-center">
                <PlaylistMenu 
                  trigger={
                    <button className="p-2 hover:bg-neutral-800 rounded-full">
                      <BsThreeDots size={20} className="text-neutral-400 hover:text-white" />
                    </button>
                  }
                  songId={song._id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
