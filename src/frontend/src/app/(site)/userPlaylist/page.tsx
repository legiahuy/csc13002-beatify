"use client";
import Image from "next/image";
import { usePlayer } from '@/contexts/PlayerContext';
import Link from 'next/link';
import ProtectedRoute from "@/components/protectedRoute";



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
  const { userPlaylistsData } = usePlayer();

  return (
    <ProtectedRoute>
    <div className="rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-white text-3xl font-bold mb-6">
          Playlists
        </h1>

          <div className="mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-1">
            {userPlaylistsData?.map((playlist) => (
              <div key={playlist._id} className="flex flex-col items-center">
                <Link href={`/playlist/${playlist._id}`}>
                  <div className="relative aspect-square w-[150px] sm:w-[180px] overflow-hidden cursor-pointer hover:opacity-80 transition">
                    <Image
                      src={(playlist as any).image || "/images/liked-songs.jfif"}
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
    </div>
    </ProtectedRoute>        
  );
}
