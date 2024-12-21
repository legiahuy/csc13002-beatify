"use client";

import Image from "next/image";
import { FaPlay, FaPause } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import Link from "next/link";
import { usePlayer } from "@/contexts/PlayerContext";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLayout } from "@/contexts/LayoutContext";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { IoSearch } from 'react-icons/io5';

interface PlaylistPageProps {
  params: {
    playlistId: string;
  };
}

export default function PlaylistPage({ params }: PlaylistPageProps) {
  const {
    songsData,
    playlistsData,
    playSong,
    currentSong,
    isPlaying,
    togglePlay,
    userPlaylistsData,
    getUserPlaylistsData,
  } = usePlayer();
  const router = useRouter();
  const { setGradient } = useLayout();
  const { user } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    // Check for liked songs playlist redirect first
    if (userPlaylistsData?.[0]?._id === params.playlistId) {
      router.push("/liked-songs");
      return;
    }

    // Set gradient color
    const playlist =
      playlistsData?.find((playlist: any) => playlist._id === params.playlistId) ||
      userPlaylistsData?.find((playlist: any) => playlist._id === params.playlistId);
    const gradientColor = (playlist as any)?.bgColour || "#164e63";
    setGradient(gradientColor);

    if (playlist) {
      setEditedName(playlist.name);
    }

    return () => setGradient("#164e63");
  }, [setGradient, playlistsData, params.playlistId, userPlaylistsData, router]);

  const isUserPlaylist = userPlaylistsData?.some(
    (playlist) => playlist._id === params.playlistId && playlist.name.includes("My Playlist")
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      const results = songsData?.filter((song) =>
        song.name.toLowerCase().includes(query.toLowerCase()) ||
        song.desc.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results || []);
    } else {
      setSearchResults([]);
    }
  };

  const addSongToPlaylist = async (songId: string) => {
    const songToAdd = songsData?.find((song) => song._id === songId);
    if (songToAdd) {
      try {
        const currentPlaylist = userPlaylistsData?.find(
          playlist => playlist._id === params.playlistId
        );

        if (!currentPlaylist) {
          alert("Playlist not found");
          return;
        }

        // Check if song already exists in playlist
        if (currentPlaylist.songs.some(song => song._id === songId)) {
          alert("Song already exists in playlist");
          return;
        }

        const response = await axios.post('http://localhost:4000/api/userPlaylist/toggle', {
          playlistId: params.playlistId,
          songId: songId,
          owner: currentPlaylist.owner
        });

        if (response.data.success) {
          await getUserPlaylistsData();
          alert("Song added to playlist");
          setSearchResults([]);
        } else {
          alert("Failed to add song to playlist");
        }
      } catch (error) {
        console.error('Error adding song:', error);
        alert("Failed to add song to playlist");
      }
    } else {
      alert("Song not found");
    }
  };

  const removeSongFromPlaylist = async (songId: string) => {
    try {
      const currentPlaylist = userPlaylistsData?.find(
        playlist => playlist._id === params.playlistId
      );

      if (!currentPlaylist) {
        alert("Playlist not found");
        return;
      }

      const response = await axios.post('http://localhost:4000/api/userPlaylist/toggle', {
        playlistId: params.playlistId,
        songId: songId,
        owner: currentPlaylist.owner
      });

      if (response.data.success) {
        await getUserPlaylistsData();
      } else {
        alert("Failed to remove song from playlist");
      }
    } catch (error) {
      console.error('Error removing song:', error);
      alert("Failed to remove song from playlist");
    }
  };

  const handleNameUpdate = async () => {
    try {
      // Find the current playlist
      const currentPlaylist = userPlaylistsData?.find(
        playlist => playlist._id === params.playlistId
      );

      if (!currentPlaylist) {
        alert("Playlist not found");
        return;
      }

      const response = await axios.post('http://localhost:4000/api/userPlaylist/update', {
        playlistId: params.playlistId,
        name: editedName,
        owner: currentPlaylist.owner
      });

      if (response.data.success) {
        await getUserPlaylistsData();
        setIsEditingName(false);
      }
    } catch (error) {
      console.error('Error updating name:', error);
    }
  };

  if (!songsData || !playlistsData) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="animate-spin text-white" size={30} />
        <p className="ml-4 text-white">Loading playlist data...</p>
      </div>
    );
  }

  const playlist =
    playlistsData.find((playlist: any) => playlist._id === params.playlistId) ||
    userPlaylistsData?.find((playlist: any) => playlist._id === params.playlistId);

  if (!playlist) {
    return <div className="text-white">Playlist not found!</div>;
  }

  const currentUserPlaylist = userPlaylistsData?.find(
    playlist => playlist._id === params.playlistId
  );

  const playlistSongs = currentUserPlaylist?.songs || [];
  const isCurrentSong = (song: any) => currentSong?._id === song._id;
  const isPlayingPlaylistSongs =
    currentSong && playlistSongs.some((song: any) => song._id === currentSong._id);

  const formatDuration = (duration: string): string => {
    const [minutes, seconds] = duration.split(":");
    const paddedSeconds = seconds.padStart(2, "0");
    return `${minutes}:${paddedSeconds}`;
  };

  return (
    <div className="h-full w-[99.5%] rounded-lg overflow-hidden overflow-y-auto">
      <div className="p-6">
        {/* Playlist Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-x-7">
          <div className="relative aspect-square w-64 overflow-hidden flex-shrink-0">
            <Image
              className="object-cover rounded"
              fill
              sizes="256px"
              src={"/images/default-playlist.png"}
              alt={playlist.name}
            />
          </div>
          <div className="flex flex-col justify-center gap-y-2 mt-4 md:mt-0 flex-grow">
            <p className="text-sm font-semibold text-white uppercase">Playlist</p>
            <div className="flex items-center gap-x-2">
              {isEditingName ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onBlur={handleNameUpdate}
                  onKeyPress={(e) => e.key === 'Enter' && handleNameUpdate()}
                  className="bg-neutral-800 text-white px-3 py-1 rounded"
                  autoFocus
                />
              ) : (
                <h1 
                  className="text-white text-4xl font-bold cursor-pointer"
                  onClick={() => setIsEditingName(true)}
                >
                  {playlist.name}
                </h1>
              )}
              <button
                onClick={() => setIsEditingName(true)}
                className="bg-neutral-800 p-2 rounded-full hover:bg-neutral-700 transition"
              >
                <FiEdit2 size={16} className="text-neutral-400 hover:text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 px-6 md:px-12">
          <button
            className="bg-gray-100 
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
              drop-shadow-md "
            onClick={() => {
              if (isPlayingPlaylistSongs) {
                togglePlay();
              } else if (playlistSongs.length > 0) {
                playSong(playlistSongs[0], { type: "playlist", id: playlist._id });
              }
            }}
          >
            {isPlayingPlaylistSongs && isPlaying ? (
              <FaPause size={24} className="text-black" />
            ) : (
              <FaPlay size={24} className="text-black" />
            )}
          </button>
        </div>

        {/* Playlist Songs Section */}
        <div className="px-6 md:px-12 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Playlist Songs</h2>
          {playlistSongs.length === 0 ? (
            <p className="text-gray-400">No songs found for this playlist.</p>
          ) : (
            <div>
              {playlistSongs.map((song: any) => (
                <div
                  key={song._id}
                  className="flex items-center text-gray-400 text-sm py-3 hover:bg-white/10 cursor-pointer group px-4 rounded-lg"
                >
                  <div className="relative w-12 h-12 mr-4">
                    <Image
                      className="object-cover rounded"
                      fill
                      src={song.image}
                      alt={song.name}
                    />
                  </div>

                  <div className="w-[30px]">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (isCurrentSong(song)) {
                          togglePlay();
                        } else {
                          playSong(song, { type: "playlist", id: playlist._id });
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

                  <div className="flex-1 ml-4">
                    <Link href={`/song/${song._id}`} className="text-white font-medium hover:underline">
                      {song.name}
                    </Link>
                  </div>

                  <div className="flex items-center gap-x-4">
                    <div className="w-[60px] text-right">
                      {song.duration ? formatDuration(song.duration) : '0:00'}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSongFromPlaylist(song._id);
                      }}
                      className="text-neutral-400 hover:text-white p-2 hover:bg-neutral-800 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 md:px-12 mt-8">
          <div className="text-white text-xl font-semibold mb-4">
            Let's find something for your playlist
          </div>
          <div className="relative w-1/2">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <IoSearch className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search for songs..."
              className="p-2 pl-10 rounded bg-gray-800 text-white w-full"
            />
          </div>
          
          <div className="mt-4">
            {searchResults.map((song: any) => (
              <div key={song._id} className="flex items-center justify-between py-2 hover:bg-gray-700 px-4 rounded">
                <div className="flex items-center gap-x-4">
                  <Image
                    src={song.image || "/images/default-song.png"}
                    alt={song.name}
                    width={50}
                    height={50}
                    className="rounded"
                  />
                  <p className="text-white">{song.name}</p>
                </div>
                <button
                  onClick={() => addSongToPlaylist(song._id)}
                  className="text-blue-500"
                >
                  Add to Playlist
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
