import React from 'react';
import { FaPlay, FaStepBackward, FaStepForward } from 'react-icons/fa';
import { BsShuffle, BsRepeat } from 'react-icons/bs';
import { FiVolume2 } from 'react-icons/fi';

const NowPlayingBar: React.FC = () => {
  return (
    <div className="
    bg-gradient-to-b from-gray-900 to-black 
    border-t border-gray-800 
    py-3 px-4 
    flex justify-between items-center
    fixed bottom-0 left-0 right-0
    z-50 h-20">
      {/* Song info */}
      <div className="flex items-center space-x-4">
        <img src="/images/hieuthuhai.jpeg" alt="Album cover" className="w-14 h-14 rounded-md shadow-lg" />
        <div>
          <h4 className="text-white font-semibold">Song name</h4>
          <p className="text-gray-400 text-sm">Artist</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center space-y-2 flex-grow px-4">
        <div className="flex items-center justify-center space-x-6">
          <BsShuffle className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
          <FaStepBackward className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
          <button className="bg-white rounded-full p-2 hover:bg-gray-200 transition-colors">
            <FaPlay className="text-black" />
          </button>
          <FaStepForward className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
          <BsRepeat className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
        </div>

        {/* Music progress bar */}
        <div className="flex items-center space-x-2 w-full max-w-2xl">
          <span className="text-xs text-gray-400 w-10 text-right">0:00</span>
          <div className="flex-grow h-1 bg-gray-600 rounded-full">
            <div className="w-1/3 h-full bg-white rounded-full"></div>
          </div>
          <span className="text-xs text-gray-400 w-10">3:30</span>
        </div>
      </div>

      {/* Volume controls */}
      <div className="flex items-center space-x-4">
        <FiVolume2 className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
        <div className="w-24 h-1 bg-gray-600 rounded-full">
          <div className="w-1/2 h-full bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export default NowPlayingBar;