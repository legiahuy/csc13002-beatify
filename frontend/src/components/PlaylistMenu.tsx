import React, { useState, useRef, useEffect } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import axios from 'axios';

interface PlaylistMenuProps {
  trigger: React.ReactNode;
  songId: string;
}

export const PlaylistMenu: React.FC<PlaylistMenuProps> = ({ trigger, songId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const { userPlaylistsData, getUserPlaylistsData } = usePlayer();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleAddToPlaylist = async (playlistId: string, owner: string) => {
    try {
      // Find the target playlist
      const targetPlaylist = userPlaylistsData?.find(
        playlist => playlist._id === playlistId
      );

      if (!targetPlaylist) {
        alert("Playlist not found");
        return;
      }

      // Check if song already exists in playlist
      if (targetPlaylist.songs.some(song => song._id === songId)) {
        alert("Song already exists in playlist");
        return;
      }

      const response = await axios.post('http://localhost:4000/api/userPlaylist/toggle', {
        playlistId,
        songId,
        owner
      });
      
      if (response.data.success) {
        await getUserPlaylistsData();
        setIsOpen(false);
        setShowPlaylists(false);
        alert("Song added to playlist");
      } else {
        alert("Failed to add song to playlist");
      }
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      alert("Failed to add song to playlist");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowPlaylists(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <div 
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
          if (!isOpen) setShowPlaylists(false);
        }}
      >
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-neutral-800 ring-1 ring-black ring-opacity-5"
          style={{ zIndex: 1000 }}
        >
          <div className="py-1">
            <button
              className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                setShowPlaylists(true);
              }}
            >
              Add to Playlist
            </button>
          </div>
        </div>
      )}

      {showPlaylists && (
        <div 
          className="absolute right-[105%] top-0 w-48 rounded-md shadow-lg bg-neutral-800 ring-1 ring-black ring-opacity-5"
          style={{ zIndex: 1001 }}
        >
          <div className="max-h-[300px] overflow-y-auto">
            {userPlaylistsData?.filter(playlist => playlist.name !== "Liked Songs").map((playlist) => (
              <button
                key={playlist._id}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToPlaylist(playlist._id, playlist.owner);
                }}
              >
                {playlist.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};