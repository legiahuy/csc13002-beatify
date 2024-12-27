"use client";
import Image from "next/image";
import { usePlayer } from '@/contexts/PlayerContext';
import Link from 'next/link';

interface Playlist {
  image: string;
  name: string;
  artist: string;
  file: string;
  type?: string;
  year?: string;
  duration?: string;
  _id: string;
}

export default function Playlists() {
  const { playlistsData } = usePlayer();

  return (
    <div className="rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-white text-3xl font-bold mb-6">
          Playlists
        </h1>
        <div className="
          grid 
          grid-cols-2 
          sm:grid-cols-3 
          lg:grid-cols-4 
          2xl:grid-cols-5 
          gap-4
        ">
          {playlistsData?.map((playlist: Playlist) => (
            <div className="flex flex-col items-center" key={playlist._id}>
              <Link href={`/playlist/${playlist._id}`} className="flex flex-col items-center">
                <div className="
                  relative 
                  aspect-square
                  w-[150px]
                  sm:w-[180px] 
                  overflow-hidden 
                  cursor-pointer 
                  hover:opacity-80 
                  transition
                ">
                  <Image
                    src={playlist.image}
                    fill
                    alt={playlist.name}
                    className="object-cover"
                  />
                </div>
                <p className="text-white mt-4 text-lg font-medium">{playlist.name}</p>
                <p className="text-neutral-400 text-sm">{playlist.artist}</p>
                
                {/* Optional Fields */}
                {playlist.type && <p className="text-neutral-500 text-xs mt-1">{playlist.type}</p>}
                {playlist.year && <p className="text-neutral-500 text-xs">{playlist.year}</p>}
                {playlist.duration && <p className="text-neutral-500 text-xs">{playlist.duration}</p>}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
