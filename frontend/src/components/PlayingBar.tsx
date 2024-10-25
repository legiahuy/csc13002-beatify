"use client";

import React from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from 'react-icons/fa';
import { BsShuffle, BsRepeat } from 'react-icons/bs';
import { FiVolume2 } from 'react-icons/fi';
import { usePlayer } from '@/contexts/PlayerContext';

const PlayingBar: React.FC = () => {
  const { currentSong, isPlaying, togglePlay } = usePlayer();

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
            <span className="text-xs text-gray-400 w-10 text-right">0:00</span>
            <div className="w-[400px] h-1 bg-gray-600 rounded-full">
              <div className="w-1/3 h-full bg-white rounded-full"></div>
            </div>
            <span className="text-xs text-gray-400 w-10">3:30</span>
          </div>
        </div>

        {/* Volume controls - right side - absolute positioning */}
        <div className="absolute right-4 flex items-center justify-end w-[200px]">
          <FiVolume2 className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
          <div className="w-24 h-1 bg-gray-600 rounded-full ml-2">
            <div className="w-1/2 h-full bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayingBar;
