"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";
import { BsShuffle, BsRepeat } from "react-icons/bs";
import { usePlayer } from "@/contexts/PlayerContext";
import { HiSpeakerXMark, HiSpeakerWave } from "react-icons/hi2";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import { Tooltip } from "@/components/Tooltip";
import { MdSpeed } from "react-icons/md";
import { IoMusicalNotes } from "react-icons/io5";
import { filterLabels } from "@/contexts/PlayerContext"; // Import filterLabels
import { BiReset } from "react-icons/bi";
import { HiSave } from "react-icons/hi";

const PlayingBar: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    volume,
    isMuted,
    isRandom,
    isRepeat,
    audioRef,
    setVolume: updateVolumeContext,
    toggleMute: toggleMuteContext,
    toggleFavourite: toggleFavouriteContext,
    toggleRandom: toggleRandomContext,
    toggleRepeat: toggleRepeatContext,
    setCurrentTime: updateCurrentTime,
    artistsData,
    userPlaylistsData,
    playNextSong,
    playPreviousSong,
    user,
    getUserPlaylistsData,
    playbackSpeed,
    setPlaybackSpeed,
    filters,
    updateFilter,
    isPremiumUser,
  } = usePlayer();

  const [localCurrentTime, setLocalCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const [showEqualizer, setShowEqualizer] = useState(false);
  const speedMenuRef = useRef<HTMLDivElement>(null);
  const eqMenuRef = useRef<HTMLDivElement>(null);

  const likedSongsPlaylist = userPlaylistsData?.[0];
  const isCurrentSongLiked = currentSong 
    ? likedSongsPlaylist?.songs.some(song => song._id === currentSong._id)
    : false;

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
    const progressWidth = rect.width;
    const clickPositionRatio = Math.max(0, Math.min(1, clickPositionX / progressWidth));
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

  const SpeedButton = ({ speed }: { speed: number }) => {
    const handleClick = () => {
      if (!isPremiumUser && speed !== 1) {
        return;
      }
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
    };

    return (
      <button
        onClick={handleClick}
        className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-800 ${
          playbackSpeed === speed ? 'text-white bg-gray-800' : 'text-gray-400'
        }`}
      >
        {speed}x
      </button>
    );
  };

  const EqualizerControl = () => {
    const handleEqChange = (index: number, value: number) => {
      if (!isPremiumUser) return;
      updateFilter(index, value);
    };

    const handleResetEq = () => {
      if (!isPremiumUser) return;
      // Reset all filters to 0
      filterLabels.forEach((_, index) => {
        updateFilter(index, 0);
      });
      // Automatically save the reset state
      const resetSettings = Array(filterLabels.length).fill(0);
      localStorage.setItem('savedEqSettings', JSON.stringify(resetSettings));
    };

    const handleSaveEq = () => {
      if (!isPremiumUser) return;
      // Save current EQ settings to localStorage
      const eqSettings = filters.map(filter => filter?.gain.value || 0);
      localStorage.setItem('savedEqSettings', JSON.stringify(eqSettings));
    };
  
    return (
      <div className="absolute bottom-full right-0 mb-2 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-gray-800">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-sm font-semibold">Equalizer</h3>
            <button 
              onClick={() => setShowEqualizer(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
            <button 
              onClick={handleResetEq}
              className="text-gray-400 hover:text-white flex items-center gap-1 text-sm"
              title="Reset EQ"
            >
              <BiReset size={16} />
              Reset
            </button>
            <button 
              onClick={handleSaveEq}
              className="text-gray-400 hover:text-white flex items-center gap-1 text-sm"
              title="Save EQ"
            >
              <HiSave size={16} />
              Save
            </button>
          </div>
        </div>
        <div className="flex gap-6 items-end mt-4">
          {filterLabels.map((label, index) => (
            <div key={label} className="flex flex-col items-center gap-2 group w-8">
              <span className="text-xs text-gray-400 font-medium text-center">
                {filters[index]?.gain.value > 0 ? "+" : ""}
                {filters[index]?.gain.value.toFixed(1)}
              </span>
              <div className="h-32 relative w-full flex items-center justify-center">
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="0.1"
                  value={filters[index]?.gain.value || 0}
                  onChange={(e) => handleEqChange(index, Number(e.target.value))}
                  className="absolute -rotate-90 w-32 origin-center
                    appearance-none bg-transparent cursor-pointer
                    [&::-webkit-slider-runnable-track]:bg-gray-700
                    [&::-webkit-slider-runnable-track]:rounded-full
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:transition-colors"
                  disabled={!isPremiumUser}
                />
              </div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle speed menu
      if (speedMenuRef.current && !speedMenuRef.current.contains(event.target as Node)) {
        setShowSpeedMenu(false);
      }
      // Handle EQ menu
      if (eqMenuRef.current && !eqMenuRef.current.contains(event.target as Node)) {
        setShowEqualizer(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black border-t border-gray-800 fixed bottom-0 left-0 right-0 z-50 h-20">
      <div className="h-full w-full px-4 flex items-center">
        {/* Song info - left side */}
        <div className="absolute left-4 flex items-center w-[400px]">
          <img
            src={currentSong?.image || "/images/default-profile.jfif"}
            alt="Album cover"
            className="w-14 h-14 rounded-md shadow-lg"
          />
          <div className="ml-4 overflow-hidden">
            <h4 className="text-white font-semibold truncate flex items-center gap-2 ">
              <Link href={`/song/${currentSong?._id}`}>
                {currentSong?.name || "No song selected"}
              </Link>
              <button onClick={toggleFavouriteContext}>
                {isCurrentSongLiked ? (
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
            <BsRepeat className={`cursor-pointer transition-colors ${
                isRepeat ? "text-white" : "text-gray-400 hover:text-white"
              }`}
              onClick={toggleRepeatContext} />
          </div>

          {/* Progress bar */}
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-xs text-gray-400 w-10 text-right">
              {formatTime(localCurrentTime)}
            </span>
            <div
              className="w-[400px] h-1 bg-gray-600 rounded-full relative cursor-pointer group"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-white rounded-full absolute left-0 top-0"
                style={{ width: `${(localCurrentTime / duration) * 100}%` }}
              />
            </div>
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${(localCurrentTime / duration) * 100}%`, transform: 'translate(-50%, -50%)' }}
             />
            <span className="text-xs text-gray-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume and playback speed controls - right side */}
        <div className="absolute right-4">
          <div className="flex items-center gap-x-4">
            {/* Equalizer Control */}
            <div className="relative" ref={eqMenuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isPremiumUser) {
                    setShowEqualizer(!showEqualizer);
                    setShowSpeedMenu(false); // Close other menu
                  }
                }}
                className={`flex items-center gap-1 ${
                  isPremiumUser ? 'text-gray-400 hover:text-white' : 'text-gray-500 cursor-not-allowed'
                }`}
              >
                <IoMusicalNotes size={20} />
              </button>
              
              {!isPremiumUser && (
                <Tooltip content="Premium feature!">
                  <div className="absolute inset-0" />
                </Tooltip>
              )}
              
              {showEqualizer && isPremiumUser && <EqualizerControl />}
            </div>

            {/* Playback Speed Control - Move it before volume controls */}
            <div className="relative" ref={speedMenuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isPremiumUser) {
                    setShowSpeedMenu(!showSpeedMenu);
                    setShowEqualizer(false); // Close other menu
                  }
                }}
                className={`flex items-center gap-1 ${
                  isPremiumUser ? 'text-gray-400 hover:text-white' : 'text-gray-500 cursor-not-allowed'
                }`}
              >
                <MdSpeed size={20} />
                <span className="text-xs">{playbackSpeed}x</span>
              </button>
              
              {!isPremiumUser && (
                <Tooltip content="Premium feature!">
                  <div className="absolute inset-0" />
                </Tooltip>
              )}
              
              {showSpeedMenu && isPremiumUser && (
                <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg shadow-lg p-2 w-24">
                  {speedOptions.map((speed) => (
                    <SpeedButton key={speed} speed={speed} />
                  ))}
                </div>
              )}
            </div>

            {/* Volume Controls */}
            <div className="flex items-center gap-x-2">
              <button onClick={toggleMuteContext}>
                {isMuted || volume === 0 ? (
                  <HiSpeakerXMark size={24} className="text-gray-400 hover:text-white cursor-pointer" />
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
    </div>
  );
};

export default PlayingBar;
