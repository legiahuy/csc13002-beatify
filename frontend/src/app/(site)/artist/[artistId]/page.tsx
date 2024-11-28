"use client";

import Image from "next/image";
import { FaPlay, FaPause } from "react-icons/fa";
import Link from "next/link";
import { usePlayer } from "@/contexts/PlayerContext";

interface ArtistPageProps {
  params: {
    artistId: string;
  };
}

export default function ArtistPage({ params }: ArtistPageProps) {
  const { songsData, artistsData, playSong, currentSong, isPlaying, togglePlay } = usePlayer();

  if (!songsData || !artistsData) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-white">Loading artist data...</p>
      </div>
    );
  }

  const artist = artistsData.find((a: any) => a._id === params.artistId);

  if (!artist) {
    return <div className="text-white">Artist not found!</div>;
  }

  const artistSongs = songsData.filter((song: any) => song.artist_id.includes(artist._id));
  const isCurrentSong = (song: any) => currentSong?._id === song._id;
  const isPlayingArtistSongs = currentSong && artistSongs.some((song: any) => song._id === currentSong._id);

  return (
    <div className="bg-gradient-to-b from-[#121212] to-[#18181b] text-white min-h-screen w-full">
      {/* Artist Header */}
      <div className="relative w-full h-72 md:h-96 bg-black">
        <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12">
          <div className="relative h-24 w-24 md:h-32 md:w-32">
            <Image
              className="object-cover rounded-full"
              fill
              src={artist.pfp || "/default-profile.png"}
              alt={artist.name}
            />
          </div>
          <h1 className="text-5xl font-bold mt-4">{artist.name}</h1>
          <p className="text-gray-300 text-sm">{artist.desc || "No bio available"}</p>
        </div>
      </div>

      {/* Play All Button */}
      <div className="mt-6 px-6 md:px-12">
        <button
          className="bg-green-500 rounded-full w-14 h-14 flex items-center justify-center hover:scale-105 transition"
          onClick={() => {
            if (isPlayingArtistSongs) {
              togglePlay();
            } else if (artistSongs.length > 0) {
              playSong(artistSongs[0], { type: "artist", id: artist._id });
            }
          }}
        >
          {isPlayingArtistSongs && isPlaying ? (
            <FaPause size={24} className="text-black" />
          ) : (
            <FaPlay size={24} className="text-black" />
          )}
        </button>
      </div>

      {/* Songs Section */}
      <div className="px-6 md:px-12 mt-8">
        <h2 className="text-2xl font-semibold mb-4">Popular Songs</h2>
        {artistSongs.length === 0 ? (
          <p className="text-gray-400">No songs found for this artist.</p>
        ) : (
          <div className="divide-y divide-gray-800">
            {artistSongs.map((song: any) => (
              <div
                key={song._id}
                className="flex items-center text-gray-400 text-sm py-3 hover:bg-[#2a2a2a] rounded-lg cursor-pointer group px-4"
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
                        playSong(song, { type: "artist", id: artist._id });
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
                <div className="w-[60px] text-right">{song.duration || "0:00"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}