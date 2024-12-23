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
import { PlaylistMenu } from "@/components/PlaylistMenu";
import { BsThreeDots } from "react-icons/bs";

interface PlaylistPageProps {
  params: {
    playlistId: string;
  };
}

export default function PlaylistPage({ params }: PlaylistPageProps) {
  const { songsData, playlistsData, playSong, currentSong, isPlaying, togglePlay, userPlaylistsData, getUserPlaylistsData } = usePlayer();
  const router = useRouter();
  const { setGradient } = useLayout();
  const { user } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    // Check for liked songs playlist redirect first
    if (userPlaylistsData?.[0]?._id === params.playlistId) {
      router.push('/liked-songs');
      return;
    }

    // Set gradient color
    const playlist = playlistsData?.find((playlist: any) => playlist._id === params.playlistId) || 
                    userPlaylistsData?.find((playlist: any) => playlist._id === params.playlistId);
    const gradientColor = (playlist as any)?.bgColour || '#164e63';
    setGradient(gradientColor);

    if (playlist) {
      setEditedName(playlist.name);
      setPreviewImage((playlist as any).image || "");
    }

    return () => setGradient('#164e63');
  }, [setGradient, playlistsData, params.playlistId, userPlaylistsData, router]);

  const isUserPlaylist = userPlaylistsData?.some(
    (playlist) => playlist._id === params.playlistId && playlist.name.includes("My Playlist")
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append("playlistId", params.playlistId);
      formData.append("name", editedName);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await axios.post(
        "http://localhost:4000/api/userPlaylist/update", 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.data.success) {
        await getUserPlaylistsData();
        setIsEditing(false);
      } else {
        console.error("Failed to update playlist");
      }
    } catch (error) {
      console.error("Error updating playlist:", error);
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

  const playlist = playlistsData.find((playlist: any) => playlist._id === params.playlistId) ||
                  userPlaylistsData?.find((playlist: any) => playlist._id === params.playlistId);

  if (!playlist) {
    return <div className="text-white">Playlist not found!</div>;
  }

  const playlistSongs = songsData.filter((song: any) => song.playlist.includes(playlist.name));
  const isCurrentSong = (song: any) => currentSong?._id === song._id;
  const isPlayingPlaylistSongs = currentSong && playlistSongs.some((song: any) => song._id === currentSong._id);

  const formatDuration = (duration: string): string => {
    const [minutes, seconds] = duration.split(':');
    const paddedSeconds = seconds.padStart(2, '0');
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
                src={(playlist as any).image || "/images/default-playlist.png"}
                alt={playlist.name}
              />
          </div>
          <div className="flex flex-col justify-center gap-y-2 mt-4 md:mt-0 flex-grow">
            <p className="text-sm font-semibold text-white uppercase">
              Playlist
            </p>
              <h1 className="text-white text-7xl font-bold break-words">
                {playlist.name}
              </h1>
              <div className="flex items-center gap-y-2 mt-4">
              <p className="text-gray-300 text-sm font-semibold">
                {playlist.desc || "No description available"}
              </p>
            </div>
          </div>
        </div>

        {/* Play All Button */}
        <div className="mt-6 px-6 md:px-12">
          <button
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

        {/* Songs Section */}
        <div className="px-6 md:px-12 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Playlist Songs</h2>
          {playlistSongs.length === 0 ? (
            <p className="text-gray-400">No songs found for this playlist.</p>
          ) : (
            <div>
              {playlistSongs.map((song: any) => (
                <div
                  key={song._id}
                  className={`
                    flex items-center text-gray-400 text-sm py-3 
                    hover:bg-white/10
                    cursor-pointer group px-4 rounded-lg
                  `}
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

                  {/* Song Details */}
                  <div className="flex-1 ml-4">
                    <Link href={`/song/${song._id}`} className="text-white font-medium hover:underline">
                      {song.name}
                    </Link>
                  </div>

                  {/* Add the playlist menu button before the duration */}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}