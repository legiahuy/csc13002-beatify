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

interface UserPlaylist {
  _id: string;
  name: string;
  songs: Song[];
  owner: string;
  createdAt: string;
  updatedAt: string;
}

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isRandom: boolean;
  isRepeat: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  playSong: (song: Song, scope: { type: "artist" | "playlist" | "single"; id: string }) => void;
  pauseSong: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFavourite: () => void;
  toggleRandom: () => void;
  toggleRepeat: () => void;
  setCurrentTime: (time: number) => void;
  playNextSong: () => void;
  playPreviousSong: () => void;
  getSongsData: () => Promise<void>;
  getPlaylistsData: () => Promise<void>;
  getArtistsData: () => Promise<void>;
  songsData: Song[] | null;
  playlistsData: Playlist[] | null;
  artistsData: Artist[] | null;
  user: any | null;
  getUserPlaylistsData: () => Promise<void>;
  userPlaylistsData: UserPlaylist[] | null;
  recentlyPlayed: Song[] | null;
  getRecentlyPlayedData: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

interface PlayerProviderProps {
  children: ReactNode;
  user: any | null;
}

export function PlayerProvider({ children, user }: PlayerProviderProps) {
  const [songsData, setSongsData] = useState<Song[] | null>(null);
  const [playlistsData, setPlaylistsData] = useState<Playlist[] | null>(null);
  const [artistsData, setArtistsData] = useState<Artist[] | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentQueue, setCurrentQueue] = useState<Song[] | null>(null); // Queue of songs
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isRandom, setIsRandom] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const [navigationScope, setNavigationScope] = useState<{
    type: "artist" | "playlist" | "single";
    id: string;
  }>({ type: "single", id: "" });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [userPlaylistsData, setUserPlaylistsData] = useState<UserPlaylist[] | null>(null);

  const currentSongRef = useRef<Song | null>(null);
  const navigationScopeRef = useRef<{ type: "artist" | "playlist" | "single"; id: string }>({ type: "single", id: "" });

  const url = "http://localhost:4000";

  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[] | null>(null);

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

  const handleToggleFavourite = async () => {
    if (!currentSong || !user?._id) return;
    try {
      const response = await axios.post('http://localhost:4000/api/userPlaylist/toggleLikedSong', {
        userId: user._id,
        songId: currentSong._id
      });

      if (response.data.success) {
        await getUserPlaylistsData();
      }
    } catch (error) {
      console.error('Error toggling favorite song:', error);
    }
  };

  const handleToggleRandom = () => {
    setIsRandom(!isRandom);
  }

  const handleToggleRepeat = () => {
    setIsRepeat(!isRepeat);
  }

  

  const playSong = async (song: Song, scope: { type: "artist" | "playlist" | "single"; id: string }) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
    }
  
    // Add the song to recently played if user is logged in
    if (user?._id) {
      try {
        await axios.post(`${url}/api/user/add-to-recently-played`, {
          userId: user._id,
          songId: song._id
        });
        // Optionally refresh the recently played list
        await getRecentlyPlayedData();
      } catch (error) {
        console.error("Error adding song to recently played:", error);
      }
    }
  
    const audio = new Audio(song.file);
    audioRef.current = audio;
    audioRef.current.volume = isMuted ? 0 : volume;
    
    setCurrentSong(song);
    setIsPlaying(true);
    setNavigationScope(scope);
    
    audio.addEventListener('ended', () => {
      console.log("Song ended. Current song:", song);
      console.log("Scope:", scope);
      console.log("Is repeat:", isRepeat);
      
      if (scope.type === "single" && !isRepeat) {
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
        }
      } else {
        playNextSong();
      }
    });
  
    audioRef.current.play().catch(console.error);
  };
  
  const playNextSong = () => {
    const currentSong = currentSongRef.current;
    const navigationScope = navigationScopeRef.current;
    
    console.log("playNextSong called. Current song:", currentSong);
    console.log("Navigation scope:", navigationScope);
    
    if (!currentSong || !songsData) return;

    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      playSong(currentSong, navigationScope);
      return;
    }

    let songList: Song[] = [];

    if (navigationScope.type === "playlist") {
      if (navigationScope.id === "liked-songs" && userPlaylistsData?.[0]) {
        songList = userPlaylistsData[0].songs;
      } else if (playlistsData) {
        const playlist = playlistsData.find((pl) => pl._id === navigationScope.id);
        if (playlist) {
          songList = songsData.filter((song) => song.playlist.includes(playlist.name));
        }
      }
    } else if (navigationScope.type === "artist" && artistsData) {
      const artist = artistsData.find((ar) => ar._id === navigationScope.id);
      if (artist) {
        songList = songsData.filter((song) => song.artist_id.includes(artist._id));
      }
    } else if (navigationScope.type === "single") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
      return;
    }

    const currentIndex = songList.findIndex((song) => song._id === currentSong._id);

    if (isRandom) {
      const availableSongs = songList.filter((song) => song._id !== currentSong._id);
      if (availableSongs.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableSongs.length);
        playSong(availableSongs[randomIndex], navigationScope);
      }
    } else {
      if (currentIndex !== -1) {
        if (currentIndex < songList.length - 1) {
          console.log("currentIndex: ", currentIndex);
          playSong(songList[currentIndex + 1], navigationScope);
        } else {
          playSong(songList[0], navigationScope); // Loop back to the first song
        }
      }
    }
  };

  const playPreviousSong = () => {
    if (!currentSong || !songsData) return;

    // For single mode or repeat, always restart the current song
    if (navigationScope.type === "single" || isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      playSong(currentSong, navigationScope);
      return;
    }

    let songList: Song[] = [];

    if (navigationScope.type === "playlist") {
      if (navigationScope.id === "liked-songs" && userPlaylistsData?.[0]) {
        // If we're in the liked songs playlist
        songList = userPlaylistsData[0].songs;
      } else if (playlistsData) {
        // For regular playlists
        const playlist = playlistsData.find((pl) => pl._id === navigationScope.id);
        if (playlist) {
          songList = songsData.filter((song) => song.playlist.includes(playlist.name));
        }
      }
    } else if (navigationScope.type === "artist" && artistsData) {
      const artist = artistsData.find((ar) => ar._id === navigationScope.id);
      if (artist) {
        songList = songsData.filter((song) => song.artist_id.includes(artist._id));
      }
    } else {
      songList = [currentSong];
    }

    const currentIndex = songList.findIndex((song) => song._id === currentSong._id);

    if (currentIndex !== -1) {
      if (currentIndex > 0) {
        playSong(songList[currentIndex - 1], navigationScope);
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

  const getUserPlaylistsData = async () => {
    if (!user?._id) return;
    try {
      const response = await axios.post(`${url}/api/userPlaylist/list`, {
        "owner": user?._id  
      });
      setUserPlaylistsData(response.data.playlists);
    } catch (error) {
      console.error("Error fetching user playlists:", error);
    }
  };

  const getRecentlyPlayedData = async () => {
    if (!user?._id) return;
    try {
      const response = await axios.post(`${url}/api/user/list-recently-played`, {
        userId: user._id
      });
      
      if (response.data.success && songsData) {
        // Convert song IDs to full song objects
        console.log("response.data.recentlyPlayed", response.data.recentlyPlayed);
        const recentSongs = response.data.recentlyPlayed || [];
        console.log(recentSongs)
        setRecentlyPlayed(recentSongs);
      }
    } catch (error) {
      console.error("Error fetching recently played songs:", error);
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

  useEffect(() => {
    if (user?._id) {
      getUserPlaylistsData();
      getRecentlyPlayedData();
    }
  }, [user]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        volume,
        isMuted,
        isRandom,
        isRepeat,
        audioRef,
        playSong,
        pauseSong,
        togglePlay,
        setVolume: handleSetVolume,
        toggleMute: handleToggleMute,
        toggleFavourite: handleToggleFavourite,
        toggleRandom: handleToggleRandom,
        toggleRepeat: handleToggleRepeat,
        setCurrentTime,
        songsData,
        playlistsData,
        artistsData,
        playNextSong,
        playPreviousSong,
        getSongsData,
        getPlaylistsData,
        getArtistsData,
        getUserPlaylistsData,
        userPlaylistsData,
        user,
        recentlyPlayed,
        getRecentlyPlayedData,
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
