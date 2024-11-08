"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import axios from 'axios';

interface Song {
  image: string;
  name: string;
  file: string;
  desc: string;
  _id: string;
  playlist: string;
  artist_id: string[];
  duration: string;
}

interface Playlist {
  image: string;
  name: string;
  artist: string;
  file: string;
  type?: string;
  year?: string;
  duration?: string;
  id: string;
}

interface Artist {
  pfp: string;
  name: string;
  desc: string;
  bgColour: string;
  _id: string;
}

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setCurrentTime: (time: number) => void;
  getSongsData: () => Promise<void>; // Function for fetching songs data
  getPlaylistsData: () => Promise<void>; // Function for fetching playlists data
  getArtistsData: () => Promise<void>;
  songsData: Song[] | null; // Added songsData
  playlistsData: Playlist[] | null; // Added playlistsData
  artistsData: Artist[] | null;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [songsData, setSongsData] = useState<Song[] | null>(null);
  const [playlistsData, setPlaylistsData] = useState<Playlist[] | null>(null);
  const [artistsData, setArtistsData] = useState<Artist[] | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const url = "http://localhost:4000";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleSetVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
    if (newVolume === 0 && !isMuted) {
      setIsMuted(true);
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = !isMuted ? 0 : volume;
    }
  };

  const playSong = (song: Song) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (!audioRef.current || currentSong?._id !== song._id) {
      audioRef.current = new Audio(song.file);
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.onended = () => setIsPlaying(false);
    }

    setCurrentSong(song);
    setIsPlaying(true);
    audioRef.current.play().catch(console.error);
  };

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const setCurrentTime = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const getSongsData = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list`);
      setSongsData(response.data.songs);
      setCurrentSong(response.data.songs[0]);
    } catch (error) {
      console.error("Error fetching songs data:", error);
    }
  };

  const getPlaylistsData = async () => {
    try {
      const response = await axios.get(`${url}/api/playlist/list`);
      setPlaylistsData(response.data.playlists);
    } catch (error) {
      console.error("Error fetching playlists data:", error);
    }
  };

  const getArtistsData = async () => {
    try {
      const response = await axios.get(`${url}/api/artist/list`);
      setArtistsData(response.data.artists);
    } catch (error) {
      console.error("Error fetching artists data:", error);
    }
  };

  useEffect(() => {
    getSongsData();
    getPlaylistsData();
    getArtistsData();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <PlayerContext.Provider value={{
      currentSong,
      isPlaying,
      volume,
      isMuted,
      audioRef,
      playSong,
      pauseSong,
      togglePlay,
      setVolume: handleSetVolume,
      toggleMute: handleToggleMute,
      setCurrentTime,
      songsData,
      playlistsData,
      artistsData,
      getSongsData,
      getPlaylistsData,
      getArtistsData,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
