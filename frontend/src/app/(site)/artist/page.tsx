"use client"
import Image from "next/image";
import { topArtists } from "@/data/songs";
import { usePlayer } from '@/contexts/PlayerContext';
import Link from 'next/link';

export default function Artists() {
  const { artistsData } = usePlayer();

  return (
    <div className="rounded-lg h-full w-full overflow-hidden overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-white text-3xl font-bold mb-6">
            Top Artists
          </h1>
          <div className="
            grid 
            grid-cols-2 
            sm:grid-cols-3 
            lg:grid-cols-4 
            2xl:grid-cols-5 
            gap-4
          ">
            {artistsData?.map((artist) => (
              <div className="flex flex-col items-center" key={artist._id}>
                <Link href={`/artist/${artist._id}`} className="flex flex-col items-center">
                  <div className="
                    relative 
                    aspect-square
                    w-[150px]
                    sm:w-[180px] 
                    rounded-full 
                    overflow-hidden 
                    cursor-pointer 
                    hover:opacity-80 
                    transition
                  ">
                    <Image
                      src={artist.pfp}
                      fill
                      alt={artist.name}
                      className="object-cover"
                    />
                  </div>
                  <p className="text-white mt-4 text-lg font-medium">{artist.name}</p>
                  <p className="text-neutral-400 text-sm mt-1">{artist.desc}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
