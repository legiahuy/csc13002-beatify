"use client";

import React, { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from 'react-icons/fa';
import { BsShuffle, BsRepeat } from 'react-icons/bs';
import { FiVolume2 } from 'react-icons/fi';
import { usePlayer } from '@/contexts/PlayerContext';

const PlayingBar: React.FC = () => {
  const { currentSong, isPlaying, togglePlay } = usePlayer();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5); // Default volume to 50%
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentSong) return;

    if (!audioRef.current || audioRef.current.src !== currentSong.file) {
      audioRef.current = new Audio(currentSong.file);
      audioRef.current.volume = volume;
      audioRef.current.addEventListener("timeupdate", () => {
        setCurrentTime(audioRef.current!.currentTime);
      });
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current!.duration);
      });
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

    return () => {
      audioRef.current?.pause();
    };
  }, [currentSong, isPlaying]);

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPositionX = e.clientX - rect.left;
    const clickPositionRatio = clickPositionX / rect.width;
    setVolume(clickPositionRatio);
    if (audioRef.current) {
      audioRef.current.volume = clickPositionRatio;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPositionX = e.clientX - rect.left;
    const clickPositionRatio = clickPositionX / rect.width;
    const newTime = clickPositionRatio * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeDragStart = () => {
    setIsDraggingVolume(true);
  };

  const handleVolumeDragEnd = () => {
    setIsDraggingVolume(false);
  };

  const handleVolumeDrag = (e: MouseEvent) => {
    if (!isDraggingVolume || !volumeBarRef.current) return;
    
    const rect = volumeBarRef.current.getBoundingClientRect();
    let clickPositionX = e.clientX - rect.left;
    
    let newVolume = Math.max(0, Math.min(1, clickPositionX / rect.width));
    
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    if (isDraggingVolume) {
      window.addEventListener('mousemove', handleVolumeDrag);
      window.addEventListener('mouseup', handleVolumeDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleVolumeDrag);
      window.removeEventListener('mouseup', handleVolumeDragEnd);
    };
  }, [isDraggingVolume]);

  return (
    <div className="
      bg-gradient-to-b from-gray-900 to-black 
      border-t border-gray-800 
      fixed bottom-0 left-0 right-0
      z-50 h-20
    ">
      <div className="
        h-full
        w-full
        px-4
        flex 
        items-center 
      ">
        {/* Song info - left side */}
        <div className="absolute left-4 flex items-center w-[200px]">
          <img 
            src={currentSong?.image || '/default-album.png'} 
            alt="Album cover" 
            className="w-14 h-14 rounded-md shadow-lg" 
          />
          <div className="ml-4 overflow-hidden">
            <h4 className="text-white font-semibold truncate">
              {currentSong?.name || 'Chưa chọn bài hát'}
            </h4>
            <p className="text-gray-400 text-sm truncate">
              {currentSong?.artist || 'Chưa có nghệ sĩ'}
            </p>
          </div>
        </div>

        {/* Controls - center - with margin auto */}
        <div className="mx-auto flex flex-col items-center justify-center">
          <div className="flex items-center justify-center space-x-6">
            <BsShuffle className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
            <FaStepBackward className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
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
            <FaStepForward className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
            <BsRepeat className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
          </div>

          {/* Progress bar */}
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-xs text-gray-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <div
              className="w-[400px] h-1 bg-gray-600 rounded-full relative cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-white rounded-full absolute left-0 top-0"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume controls - right side - absolute positioning */}
        <div className="absolute right-4 flex items-center justify-end w-[200px]">
          <FiVolume2 className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
          <div
            ref={volumeBarRef}
            className="w-24 h-1 bg-gray-600 rounded-full relative cursor-pointer ml-2"
            onClick={handleVolumeClick}
            onMouseDown={handleVolumeDragStart}
          >
            <div
              className="h-full bg-white rounded-full absolute left-0 top-0"
              style={{ width: `${volume * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayingBar;
