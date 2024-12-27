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

// Add new types for EQ functionality
const frequencies = [100, 1000, 8000];
const filterLabels = ['Low', 'Mid', 'High'];

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
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  isPremiumUser: boolean;
  addSongToPlaylist: (songId: string, playlistId: string) => Promise<void>;
  filters: BiquadFilterNode[];
  updateFilter: (index: number, value: number) => void;
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
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [filters, setFilters] = useState<BiquadFilterNode[]>([]);
  const [audioSource, setAudioSource] = useState<MediaElementAudioSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  

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

  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  const isPremiumUser = user?.plan === "premium";

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

  const setupAudioChain = (audio: HTMLAudioElement) => {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioContext(context);
    
    try {
      const source = context.createMediaElementSource(audio);
      setAudioSource(source);

      // Load saved EQ settings
      const savedSettings = localStorage.getItem('savedEqSettings');
      const eqSettings = savedSettings ? JSON.parse(savedSettings) : Array(frequencies.length).fill(0);

      // Create new filters with saved settings
      const newFilters = frequencies.map((frequency, index) => {
        const filter = context.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = frequency;
        filter.Q.value = 1;
        filter.gain.value = eqSettings[index]; // Apply saved settings
        return filter;
      });
      
      setFilters(newFilters);

      // Connect the audio chain
      source.connect(newFilters[0]);
      for (let i = 0; i < newFilters.length - 1; i++) {
        newFilters[i].connect(newFilters[i + 1]);
      }
      newFilters[newFilters.length - 1].connect(context.destination);
      
      return true;
    } catch (e) {
      console.error('Error setting up audio chain:', e);
      return false;
    }
  };

  const playSong = async (song: Song, scope: { type: "artist" | "playlist" | "single"; id: string }) => {
    try {
      // Stop current playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
      }

      // Create new audio element
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      
      // Set up audio before loading source
      const setupSuccess = setupAudioChain(audio);
      if (!setupSuccess) {
        throw new Error('Failed to set up audio chain');
      }

      // Now load the source
      audio.src = song.file;
      audioRef.current = audio;

      // Set initial properties
      audio.volume = isMuted ? 0 : volume;
      if (isPremiumUser) {
        audio.playbackRate = playbackSpeed;
      }

      // Add ended event handler
      audio.onended = () => {
        if (isRepeat) {
          audio.currentTime = 0;
          audio.play();
        } else {
          playNextSong();
        }
      };

      setCurrentSong(song);
      setIsPlaying(true);
      setNavigationScope(scope);
      navigationScopeRef.current = scope;
      currentSongRef.current = song;

      // Add to recently played if user is logged in
      if (user?._id) {
        try {
          await axios.post(`${url}/api/user/add-to-recently-played`, {
            userId: user._id,
            songId: song._id
          });
          await getRecentlyPlayedData();
        } catch (error) {
          console.error("Error adding song to recently played:", error);
        }
      }

      await audio.play();

    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  };

  const setCurrentTime = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Clean up function
  useEffect(() => {
    return () => {
      if (audioSource) {
        audioSource.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (audioSource) {
        audioSource.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  const playNextSong = () => {
    if (isRepeat) {
      console.log("Playing repeat song");
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }
    console.log("playNextSong called");
    const currentScope = navigationScopeRef.current;
    console.log("Current scope:", currentScope);
    
    if (!currentSongRef.current || !songsData) {
        console.log("Missing currentSong or songsData");
        return;
    }

    let songList: Song[] = [];

    // Get the correct song list based on navigation scope
    if (currentScope.type === "playlist") {
        console.log("In playlist mode");
        if (currentScope.id === "liked-songs" && userPlaylistsData?.[0]) {
            songList = userPlaylistsData[0].songs;
            console.log("Found liked songs:", songList.length);
        } else {
            // Tìm trong userPlaylistsData trước
            const userPlaylist = userPlaylistsData?.find(
                (playlist) => playlist._id === currentScope.id
            );
            
            if (userPlaylist) {
                songList = userPlaylist.songs;
                console.log("Found user playlist songs:", songList.length);
            } else {
                const playlist = playlistsData?.find(
                    (pl) => pl._id === currentScope.id
                );
                
                if (playlist) {
                    songList = songsData.filter((song) => 
                        song.playlist.includes(playlist.name)
                    );
                    console.log("Found regular playlist songs:", songList.length);
                }
            }
        }
        
        // Log thêm thông tin để debug
        console.log("Current playlist ID:", currentScope.id);
        console.log("Available playlists:", playlistsData?.map(p => ({id: p._id, name: p.name})));
        console.log("Available user playlists:", userPlaylistsData?.map(p => ({id: p._id, name: p.name})));
    } else if (currentScope.type === "artist" && artistsData) {
        const artist = artistsData.find((ar) => ar._id === currentScope.id);
        if (artist) {
            songList = songsData.filter((song) => song.artist_id.includes(artist._id));
            console.log("Found artist songs:", songList.length);
        }
    } else if (currentSongRef.current) {
        songList = [currentSongRef.current];
    }

    if (songList.length === 0) {
        console.log("No songs in list");
        return;
    }

    const currentIndex = songList.findIndex((song) => song._id === currentSongRef.current?._id);
    console.log("Current index:", currentIndex, "Total songs:", songList.length);

    // Handle random play
    if (isRandom) {
        const availableSongs = songList.filter((song) => song._id !== currentSongRef.current?._id);
        if (availableSongs.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableSongs.length);
            const nextSong = availableSongs[randomIndex];
            console.log("Playing random song:", nextSong.name);
            playSong(nextSong, currentScope);
        }
    } else {
        // Normal sequential play
        if (currentIndex !== -1) {
            if (currentIndex < songList.length - 1) {
                const nextSong = songList[currentIndex + 1];
                console.log("Playing next song:", nextSong.name);
                playSong(nextSong, currentScope);
            } else {
                // Loop back to first song if at the end
                console.log("Looping back to first song");
                playSong(songList[0], currentScope);
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

  const handleSetPlaybackSpeed = (speed: number) => {
    if (!isPremiumUser) {
      console.warn("Premium subscription required for playback speed control");
      return;
    }
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const addSongToPlaylist = async (songId: string, playlistId: string) => {
    try {
      const response = await axios.post('http://localhost:4000/api/userPlaylist/add-song', {
        playlistId,
        songId
      });
      
      if (response.data.success) {
        // Refresh the user playlists data
        await getUserPlaylistsData();
      }
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      throw error;
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

  const updateFilter = (index: number, value: number) => {
    if (filters[index]) {
      filters[index].gain.value = value;
    }
  };

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
        playbackSpeed,
        setPlaybackSpeed: handleSetPlaybackSpeed,
        isPremiumUser,
        addSongToPlaylist,
        filters,
        updateFilter,
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

export { filterLabels, frequencies };
