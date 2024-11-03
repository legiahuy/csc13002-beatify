"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { trendingHits } from '@/data/songs';

interface Song {
  image: string;
  name: string;
  artist: string;
  file: string;
  type?: string;
  year?: string;
  duration?: string;
  id: string;
}

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  togglePlay: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Cleanup the audio element when component unmounts
    return () => {
      audio?.pause();
      setAudio(null);
    };
  }, [audio]);

  const playSong = (song: Song) => {
    if (audio) {
      audio.pause(); // Pause any currently playing song
    }

    // Create a new audio element and play the selected song
    const newAudio = new Audio(song.file);
    setAudio(newAudio);
    setCurrentSong(song);
    setIsPlaying(true);

    // Play the song when loaded
    newAudio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });

    // Update the `isPlaying` state when the song ends
    newAudio.onended = () => setIsPlaying(false);
  };

  const pauseSong = () => {
    if (audio) {
      audio.pause();
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseSong();
    } else if (currentSong && audio) {
      audio.play().catch((error) => console.error("Error playing audio:", error));
      setIsPlaying(true);
    }
  };

  return (
    <PlayerContext.Provider value={{
      currentSong,
      isPlaying,
      playSong,
      pauseSong,
      togglePlay
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