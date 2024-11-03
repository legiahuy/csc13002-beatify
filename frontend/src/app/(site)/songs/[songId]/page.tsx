"use client";

import { trendingHits } from "@/data/songs";
import Header from "@/components/Header";
import Image from "next/image";
import NowPlayingBar from "@/components/PlayingBar";
import { FaPlay, FaPause } from 'react-icons/fa';
import { usePlayer } from '@/contexts/PlayerContext';
import Link from 'next/link';

interface SongPageProps {
  params: {
    songId: string;
  }
}

export default function SongPage({ params }: SongPageProps) {
  const song = trendingHits.find((item) => item.id === params.songId);
  const { playSong, currentSong, isPlaying, togglePlay } = usePlayer();

  if (!song) {
    return <div>Không tìm thấy bài hát</div>;
  }

  const isCurrentSong = currentSong?.id === song.id;

  return (
    <div className="bg-gradient-to-b from-neutral-800 to-neutral-900 h-full w-[99.5%] rounded-lg overflow-hidden overflow-y-auto">
      <Header>
        <div></div>
      </Header>
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-end gap-x-7">
          <div className="relative h-64 w-64 shadow-2xl">
            <Image
              className="object-cover rounded-lg"
              fill
              src={song.image}
              alt={song.name}
            />
          </div>
          <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
            <p className="text-sm font-semibold text-white uppercase">
              {song.type || 'Single'}
            </p>
            <h1 className="text-white text-8xl font-bold">
              {song.name}
            </h1>
            <div className="flex items-center gap-x-2 mt-4">
              <div className="h-6 w-6 relative">
                <Image
                  className="rounded-full"
                  fill
                  src={song.image}
                  alt={song.artist}
                />
              </div>
              <p className="text-white text-sm font-semibold">
                {song.artist} • {song.year || '2024'} • 1 bài hát, {song.duration || '2 phút 52 giây'}
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
            className="
              bg-green-500
              rounded-full
              w-14
              h-14
              flex
              items-center
              justify-center
              hover:scale-105
              transition
            "
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
            <div className="w-[30px]">#</div>
            <div className="flex-1">Tiêu đề</div>
            <div className="w-[100px] text-right">⏱</div>
          </div>
          <Link href={`/songs/${song.id}`}>
            <div 
              className="
                flex 
                items-center 
                text-neutral-400 
                text-sm 
                px-6 
                py-4 
                hover:bg-white/10 
                rounded-lg 
                cursor-pointer
                group
              "
            >
              <div className="w-[30px]">
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Ngăn chặn chuyển trang khi click vào play
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
      <NowPlayingBar />
    </div>
  );
}
