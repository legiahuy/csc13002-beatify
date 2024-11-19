"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import axios from "axios";

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
  bgColour: string;
  desc: string;
  _id: string;
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
  playSong: (song: Song, scope: { type: "artist" | "playlist" | "single"; id: string }) => void;
  pauseSong: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setCurrentTime: (time: number) => void;
  playNextSong: () => void;
  playPreviousSong: () => void;
  getSongsData: () => Promise<void>;
  getPlaylistsData: () => Promise<void>;
  getArtistsData: () => Promise<void>;
  songsData: Song[] | null;
  playlistsData: Playlist[] | null;
  artistsData: Artist[] | null;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [songsData, setSongsData] = useState<Song[] | null>(null);
  const [playlistsData, setPlaylistsData] = useState<Playlist[] | null>(null);
  const [artistsData, setArtistsData] = useState<Artist[] | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentQueue, setCurrentQueue] = useState<Song[] | null>(null); // Queue of songs
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isRandom, setIsRandom] = useState(false);
  const [navigationScope, setNavigationScope] = useState<{
    type: "artist" | "playlist" | "single";
    id: string;
  }>({ type: "single", id: "" });
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

  
  const playSong = (song: Song, scope: { type: "artist" | "playlist" | "single"; id: string }) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  
    if (!audioRef.current || currentSong?._id !== song._id) {
      audioRef.current = new Audio(song.file);
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.onended = playNextSong;
    }
  
    setCurrentSong(song);
    setIsPlaying(true);
    setNavigationScope(scope); // Set the navigation scope
    audioRef.current.play().catch(console.error);
  };
  
  const playNextSong = () => {
    if (!currentSong || !songsData) return;

    let songList: Song[] = [];

    if (navigationScope.type === "playlist" && playlistsData) {
      const playlist = playlistsData.find((pl) => pl._id === navigationScope.id);
      if (playlist) {
        songList = songsData.filter((song) => song.playlist.includes(playlist.name));
      }
    } else if (navigationScope.type === "artist" && artistsData) {
      const artist = artistsData.find((ar) => ar._id === navigationScope.id);
      if (artist) {
        songList = songsData.filter((song) => song.artist_id.includes(artist._id));
      }
    } else if (navigationScope.type === "single") {
      songList = [currentSong]; // Only the current song
    }

    const currentIndex = songList.findIndex((song) => song._id === currentSong._id);

    if (isRandom) {
      // If random is enabled, play a random song
      const randomIndex = Math.floor(Math.random() * songList.length);
      playSong(songList[randomIndex], navigationScope);
    } else {
      if (currentIndex !== -1) {
        // If not random, play the next song sequentially
        if (currentIndex < songList.length - 1) {
          playSong(songList[currentIndex + 1], navigationScope);
        } else {
          playSong(songList[0], navigationScope); // Loop back to the first song
        }
      }
    }
  };

  const playPreviousSong = () => {
    if (!currentSong || !songsData) return;

    let songList: Song[] = [];

    if (navigationScope.type === "playlist" && playlistsData) {
      const playlist = playlistsData.find((pl) => pl._id === navigationScope.id);
      if (playlist) {
        songList = songsData.filter((song) => song.playlist.includes(playlist.name));
      }
    } else if (navigationScope.type === "artist" && artistsData) {
      const artist = artistsData.find((ar) => ar._id === navigationScope.id);
      if (artist) {
        songList = songsData.filter((song) => song.artist_id.includes(artist._id));
      }
    } else if (navigationScope.type === "single") {
      songList = [currentSong]; // Only the current song
    }

    const currentIndex = songList.findIndex((song) => song._id === currentSong._id);

    if (currentIndex !== -1) {
      if (currentIndex > 0) {
        playSong(songList[currentIndex - 1], navigationScope); // Play previous song
      } else {
        playSong(songList[songList.length - 1], navigationScope); // Loop back to the last song
      }
    }
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
    } catch (error) {
      console.error("Error fetching songs data:", error);
    }
  };

  const getPlaylistsData = async () => {
    try {
      const response = await axios.get(`${url}/api/playlist/list`);
      const playlists = response.data.playlists;
      setPlaylistsData(playlists);

      if (playlists && playlists.length > 0) {
        const firstPlaylistSongs = songsData?.filter((song) =>
          song.playlist.includes(playlists[0].name)
        );
        if (firstPlaylistSongs && firstPlaylistSongs.length > 0) {
          setCurrentQueue(firstPlaylistSongs);
          setCurrentSong(firstPlaylistSongs[0]);
        }
      }
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
    <PlayerContext.Provider
      value={{
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
        playNextSong,
        playPreviousSong,
        getSongsData,
        getPlaylistsData,
        getArtistsData,
        
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
