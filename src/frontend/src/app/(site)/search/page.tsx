"use client"

import { useSearchParams } from 'next/navigation';
import ListItem from "@/components/ListItem";
import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "@/contexts/PlayerContext";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const { songsData, artistsData } = usePlayer();

  // Search songs with loose conditions
  const songResults = songsData?.filter(song => 
    song.name.toLowerCase().includes(query) || 
    song.artist_id.some(artistId => {
      const artist = artistsData?.find(a => a._id === artistId);
      return artist?.name.toLowerCase().includes(query);
    })
  ) || [];

  // Search artists
  const artistResults = artistsData?.filter(artist => 
    artist.name.toLowerCase().includes(query)
  ) || [];

  // Utility function to get artist names
  const getArtistNames = (artistIds: string[]) => {
    return artistIds.map(id => {
      const artist = artistsData?.find(artist => artist._id === id);
      return artist ? artist.name : 'Unknown Artist';
    });
  };

  return (
    <div className="rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <div className="mb-2">
        <h1 className="text-white text-3xl font-bold mb-6">
          Search Results for "{query}"
        </h1>

        {/* Songs Results */}
        {songResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-white text-2xl font-bold mb-4">Songs</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {songResults.map((song) => (
                <ListItem
                  key={song._id}
                  _id={song._id}
                  image={song.image}
                  name={song.name}
                  file={song.file}
                  artist={getArtistNames(song.artist_id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Artists Results */}
        {artistResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-white text-2xl font-bold mb-4">Artists</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {artistResults.map((artist) => (
                <Link href={`/artist/${artist._id}`} key={artist._id}>
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
                        src={artist.pfp}
                        fill
                        alt={artist.name}
                        className="object-cover"
                      />
                    </div>
                    <p className="text-white mt-4 text-base font-medium truncate w-full text-center">
                      {artist.name}
                    </p>
                    <p className="text-neutral-400 text-sm mt-1">
                      {artist.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {songResults.length === 0 && artistResults.length === 0 && (
          <p className="text-neutral-400">No results found for "{query}"</p>
        )}
      </div>
    </div>
  );
} 