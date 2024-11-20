"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";
import { BsShuffle, BsRepeat } from "react-icons/bs";
import { usePlayer } from "@/contexts/PlayerContext";
import { HiSpeakerXMark, HiSpeakerWave } from "react-icons/hi2";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Link from "next/link";

const PlayingBar: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    volume,
    isMuted,
    isRandom,
    audioRef,
    setVolume: updateVolumeContext,
    toggleMute: toggleMuteContext,
    toggleRandom: toggleRandomContext,
    setCurrentTime: updateCurrentTime,
    artistsData,
    playNextSong, // New
    playPreviousSong, // New
  } = usePlayer();

  const [localCurrentTime, setLocalCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    const handleTimeUpdate = () => {
      setLocalCurrentTime(audioRef.current?.currentTime || 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audioRef.current?.duration || 0);
    };

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, [currentSong, audioRef]);

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current) return;

    const rect = volumeBarRef.current.getBoundingClientRect();
    const clickPositionX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newVolume = clickPositionX / rect.width;
    updateVolume(newVolume);
  };

  const handleVolumeDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingVolume(true);
    handleVolumeClick(e);
  };

  const handleVolumeDrag = (e: MouseEvent) => {
    if (!isDraggingVolume || !volumeBarRef.current) return;

    const rect = volumeBarRef.current.getBoundingClientRect();
    const clickPositionX = e.clientX - rect.left;
    const boundedX = Math.max(0, Math.min(clickPositionX, rect.width));
    const newVolume = boundedX / rect.width;
    updateVolume(newVolume);
  };

  const handleVolumeDragEnd = () => {
    setIsDraggingVolume(false);
  };

  const updateVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    updateVolumeContext(clampedVolume);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration || !audioRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickPositionX = e.clientX - rect.left;
    const clickPositionRatio = clickPositionX / rect.width;
    const newTime = clickPositionRatio * duration;

    updateCurrentTime(newTime);
    setLocalCurrentTime(newTime);
  };

  useEffect(() => {
    if (isDraggingVolume) {
      window.addEventListener("mousemove", handleVolumeDrag);
      window.addEventListener("mouseup", handleVolumeDragEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleVolumeDrag);
      window.removeEventListener("mouseup", handleVolumeDragEnd);
    };
  }, [isDraggingVolume]);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  const getArtistInfo = (artistIds: string[]) => {
    return artistIds
      .map((id) => {
        const artist = artistsData?.find((artist) => artist._id === id);
        return artist
          ? {
              id: artist._id,
              name: artist.name,
            }
          : null;
      })
      .filter((artist) => artist !== null);
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black border-t border-gray-800 fixed bottom-0 left-0 right-0 z-50 h-20">
      <div className="h-full w-full px-4 flex items-center">
        {/* Song info - left side */}
        <div className="absolute left-4 flex items-center w-[400px]">
          <img
            src={currentSong?.image || "/default-album.png"}
            alt="Album cover"
            className="w-14 h-14 rounded-md shadow-lg"
          />
          <div className="ml-4 overflow-hidden">
            <h4 className="text-white font-semibold truncate flex items-center gap-2 ">
              <Link href={`/song/${currentSong?._id}`}>
                {currentSong?.name || "No song selected"}
              </Link>
              <button onClick={toggleFavorite}>
                {isFavorite ? (
                  <FaHeart className="text-red-500" size={20} />
                ) : (
                  <FaRegHeart className="text-gray-400 hover:text-white" size={20} />
                )}
              </button>
            </h4>
            <p className="text-gray-400 text-sm truncate">
              {currentSong?.artist_id
                ? getArtistInfo(currentSong.artist_id).map((artist, index) => (
                    <span key={artist?.id}>
                      <Link href={`/artist/${artist?.id}`} className="hover:underline">
                        {artist?.name}
                      </Link>
                      {index < currentSong.artist_id.length - 1 && ", "}
                    </span>
                  ))
                : "No artist"}
            </p>
          </div>
        </div>

        {/* Controls - center */}
        <div className="mx-auto flex flex-col items-center justify-center">
          <div className="flex items-center justify-center space-x-6">
            <BsShuffle 
              className={`cursor-pointer transition-colors ${
                isRandom ? "text-white" : "text-gray-400 hover:text-white"
              }`}
              onClick={toggleRandomContext}
            />
            <FaStepBackward
              className="text-gray-400 hover:text-white cursor-pointer transition-colors"
              onClick={playPreviousSong}
            />
            <button
              className="bg-white rounded-full p-2 hover:bg-gray-200 transition-colors w-8 h-8 flex items-center justify-center"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <FaPause className="text-black text-sm" />
              ) : (
                <FaPlay className="text-black ml-1" />
              )}
            </button>
            <FaStepForward
              className="text-gray-400 hover:text-white cursor-pointer transition-colors"
              onClick={playNextSong}
            />
            <BsRepeat className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
          </div>

          {/* Progress bar */}
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-xs text-gray-400 w-10 text-right">
              {formatTime(localCurrentTime)}
            </span>
            <div
              className="w-[400px] h-1 bg-gray-600 rounded-full relative cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-white rounded-full absolute left-0 top-0"
                style={{ width: `${(localCurrentTime / duration) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume control - right side */}
        <div className="absolute right-4">
          <div className="flex items-center gap-x-2">
            <button onClick={toggleMuteContext}>
              {isMuted || volume === 0 ? (
                <HiSpeakerXMark size={24} className="text-gray-400 hover:text-white cursor-pointer" />
              ) : volume < 0.5 ? (
                <HiSpeakerWave size={24} className="text-gray-400 hover:text-white cursor-pointer" />
              ) : (
                <HiSpeakerWave size={24} className="text-gray-400 hover:text-white cursor-pointer" />
              )}
            </button>
            <div
              ref={volumeBarRef}
              className="w-24 h-1 bg-gray-600 rounded-full relative cursor-pointer"
              onClick={handleVolumeClick}
              onMouseDown={handleVolumeDragStart}
            >
              <div
                className="h-full bg-white rounded-full absolute left-0 top-0"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayingBar;
