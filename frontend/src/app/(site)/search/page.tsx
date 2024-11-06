"use client"

import { useSearchParams } from 'next/navigation';
import { trendingHits, topArtists } from "@/data/songs";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import NowPlayingBar from "@/components/PlayingBar";
import Image from "next/image";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';

  // Tìm kiếm bài hát với điều kiện lỏng lẻo hơn
  const songResults = trendingHits.filter(song => 
    song.name.toLowerCase().includes(query) || 
    song.artist.toLowerCase().includes(query)
  );

  // Tìm kiếm nghệ sĩ
  const artistResults = topArtists.filter(artist => 
    artist.name.toLowerCase().includes(query)
  );

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-bold mb-6">
            Search Results for "{query}"
          </h1>

          {/* Phần kết quả bài hát */}
          {songResults.length > 0 && (
            <div className="mb-8">
              <h2 className="text-white text-2xl font-bold mb-4">Songs</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {songResults.map((item) => (
                  <ListItem
                    key={item.id}
                    id={item.id}
                    image={item.image}
                    name={item.name}
                    file={item.file}
                    artist={item.artist}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Phần kết quả nghệ sĩ */}
          {artistResults.length > 0 && (
            <div className="mb-8">
              <h2 className="text-white text-2xl font-bold mb-4">Artists</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {artistResults.map((artist) => (
                  <Link href={`/artist/${artist.href}`} key={artist.href}>
                    <div className="flex flex-col items-center group">
                      <div className="
                        relative 
                        aspect-square 
                        w-full
                        rounded-full 
                        overflow-hidden 
                        cursor-pointer 
                        hover:opacity-80 
                        transition
                      ">
                        <Image
                          src={artist.image}
                          fill
                          alt={artist.name}
                          className="object-cover"
                        />
                      </div>
                      <p className="text-white mt-4 text-base font-medium truncate w-full text-center">
                        {artist.name}
                      </p>
                      <p className="text-neutral-400 text-sm mt-1">
                        {artist.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Hiển thị khi không có kết quả */}
          {songResults.length === 0 && artistResults.length === 0 && (
            <p className="text-neutral-400">No results found for "{query}"</p>
          )}
        </div>
      </Header>
      <NowPlayingBar />
    </div>
  );
} 