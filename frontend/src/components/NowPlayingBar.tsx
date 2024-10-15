import React from 'react';
import { FaPlay, FaStepBackward, FaStepForward } from 'react-icons/fa';
import { BsShuffle, BsRepeat } from 'react-icons/bs';
import { FiVolume2 } from 'react-icons/fi';

const NowPlayingBar: React.FC = () => {
  return (
    <div className="
    bg-gray-900 
    border-t 
    border-gray-800 p-4 flex flex-col 
    items-center">
      {/* Controls */}
      <div className="
      flex 
      items-center 
      justify-center 
      space-x-6 mb-2">
        <BsShuffle className="
        text-gray-400 
        hover:text-white 
        cursor-pointer" />
        <FaStepBackward className="
        text-gray-400 
        hover:text-white 
        cursor-pointer" />
        <button className="
        bg-white 
        rounded-full p-2">
          <FaPlay className="text-black" />
        </button>
        <FaStepForward className="
        text-gray-400 
        hover:text-white 
        cursor-pointer" />
        <BsRepeat className="
        text-gray-400 
        hover:text-white 
        cursor-pointer" />
      </div>

      {/* Music progress bar */}
      <div className="
      flex 
      items-center 
      space-x-2 w-1/2">
        <span className="text-xs text-gray-400">0:00</span>
        <div className="flex-1 h-1 bg-gray-600 rounded-full">
          <div className="w-1/3 h-full bg-white rounded-full"></div>
        </div>
        <span className="text-xs text-gray-400">3:30</span>
      </div>

      {/* volume controls */}
      <div className="
      flex 
      items-center 
      space-x-4 mt-4">
        <FiVolume2 className="
        text-gray-400 
        hover:text-white 
        cursor-pointer" />
        <div className="
        w-20 h-1 
        bg-gray-600 
        rounded-full">
          <div className="
          w-1/2 h-full 
          bg-white rounded-full">
          </div>
        </div>
      </div>
    </div>
  );
}

export default NowPlayingBar;