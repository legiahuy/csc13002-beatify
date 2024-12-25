import Link from 'next/link';
import { BiChevronRight } from 'react-icons/bi';
import Image from 'next/image';
import ListItem from '@/components/ListItem';
import { usePlayer } from '@/contexts/PlayerContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Song {
    _id: string;
    name: string;
    artist_id: string[];
    desc: string;
    image: string;
    file: string;
}

const DisplayHome = () => {
    const { songsData, artistsData, playlistsData, user, recentlyPlayed } = usePlayer();
    const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);

    // Function to get random songs
    const getRandomSongs = (songs: Song[], count: number): Song[] => {
        // Create a copy of the songs array
        const availableSongs = [...songs];
        const result: Song[] = [];
        
        // Get 'count' number of random songs
        while (result.length < count && availableSongs.length > 0) {
            // Get a random index
            const randomIndex = Math.floor(Math.random() * availableSongs.length);
            // Remove and get the song at the random index
            const [song] = availableSongs.splice(randomIndex, 1);
            result.push(song);
        }
        
        return result;
    };

    useEffect(() => {
        const getRecommendations = async () => {
            if (!user?._id || !songsData) {
                console.log("Missing required data:", { user: !!user, songsData: !!songsData });
                return;
            }

            try {
                // Get IDs of recently played songs to exclude them
                const recentIds = recentlyPlayed?.map(song => song._id) || [];
                
                // Filter out songs that are in recently played
                const availableSongs = songsData.filter(song => 
                    !recentIds.includes(song._id)
                );

                if (recentlyPlayed && recentlyPlayed.length > 0) {
                    // Score each available song based on description similarity with recently played songs
                    const scoredSongs = availableSongs.map(song => {
                        let score = 0;
                        recentlyPlayed.forEach(recent => {
                            if (song.desc && recent.desc) {
                                const songWords = song.desc.toLowerCase().split(/\s+/);
                                const recentWords = recent.desc.toLowerCase().split(/\s+/);
                                const commonWords = songWords.filter(word => recentWords.includes(word));
                                score += commonWords.length;
                            }
                        });
                        return { song, score };
                    });

                    // Sort by score and get top 5
                    const recommendations = scoredSongs
                        .sort((a, b) => b.score - a.score)
                        .filter(item => item.score > 0)
                        .slice(0, 5)
                        .map(item => item.song);

                    console.log("Found recommendations:", recommendations.length);

                    if (recommendations.length > 0) {
                        setRecommendedSongs(recommendations);
                        return;
                    }
                }

                // If no recommendations found or no recently played songs, get random songs
                if (availableSongs.length > 0) {
                    const randomSongs = getRandomSongs(availableSongs, 5);
                    console.log("Using random songs instead:", randomSongs.length);
                    setRecommendedSongs(randomSongs);
                }

            } catch (error) {
                console.error('Error generating recommendations:', error);
            }
        };

        getRecommendations();
    }, [user, songsData, recentlyPlayed]);

    // Utility function to get artist names by IDs
    const getArtistNames = (artistIds: string[]) => {
        return artistIds.map(id => {
            const artist = artistsData?.find(artist => artist._id === id);
            return artist ? artist.name : 'Unknown Artist';
        });
    };

    return (
        <div>


            {/* Trending Hits Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-white text-2xl font-semibold">
                        Trending Hits
                    </h1>
                    <Link 
                        href="/song"
                        className="text-neutral-400 hover:text-white flex items-center gap-x-1 cursor-pointer transition text-sm font-medium"
                    >
                        Show all
                        <BiChevronRight size={20} />
                    </Link>
                </div>
                <div className="grid grid-cols-5 gap-4">
                    {songsData?.slice(0, 5).map((item) => {
                        const artistNames = getArtistNames(item.artist_id);
                        return (
                            <ListItem 
                                _id={item._id}
                                image={item.image}
                                name={item.name}
                                file={item.file}
                                artist={artistNames}
                                key={item._id}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Recommended For You Section */}
            {user && recommendedSongs.length > 0 && (
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-white text-2xl font-semibold">
                            {recentlyPlayed && recentlyPlayed.length > 0 ? 'Recommended For You' : 'You Might Like'}
                        </h1>
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                        {recommendedSongs.map((item) => {
                            const artistNames = getArtistNames(item.artist_id);
                            return (
                                <ListItem 
                                    _id={item._id}
                                    image={item.image}
                                    name={item.name}
                                    file={item.file}
                                    artist={artistNames}
                                    key={item._id}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Top Artists Section */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-white text-2xl font-semibold">
                        Top Artists
                    </h1>
                    <Link 
                        href="/artist"
                        className="text-neutral-400 hover:text-white flex items-center gap-x-1 cursor-pointer transition text-sm font-medium"
                    >
                        Show all
                        <BiChevronRight size={20} />
                    </Link>
                </div>
                <div className="grid grid-cols-5 gap-4">
                    {artistsData?.slice(0, 5).map((artist) => (
                        <div key={artist._id} className="flex flex-col items-center">
                            <Link href={`/artist/${artist._id}`}>
                                <div className="relative aspect-square w-[150px] rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition">
                                    <Image
                                        src={artist.pfp}
                                        fill
                                        alt={artist.name}
                                        className="object-cover"
                                    />
                                </div>
                            </Link>
                            <p className="text-white mt-4 text-lg font-medium">{artist.name}</p>
                            <p className="text-neutral-400 text-sm mt-1">{artist.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Playlists Section */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-white text-2xl font-semibold">
                        Playlists
                    </h1>
                    <Link 
                        href="/playlist"
                        className="text-neutral-400 hover:text-white flex items-center gap-x-1 cursor-pointer transition text-sm font-medium"
                    >
                        Show all
                        <BiChevronRight size={20} />
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {playlistsData?.slice(0, 5).map((playlist) => (
                        <div key={playlist._id} className="flex flex-col items-center">
                            <Link href={`/playlist/${playlist._id}`}>
                                <div className="relative aspect-square w-[150px] sm:w-[180px] overflow-hidden cursor-pointer hover:opacity-80 transition">
                                    <Image
                                        src={playlist.image}
                                        fill
                                        alt={playlist.name}
                                        className="object-cover"
                                    />
                                </div>
                            </Link>
                            <p className="text-white mt-4 text-lg font-medium">{playlist.name}</p>
                            <p className="text-neutral-400 text-sm">{playlist.artist}</p>
                            
                            {/* Optional Fields */}
                            {playlist.type && <p className="text-neutral-500 text-xs mt-1">{playlist.type}</p>}
                            {playlist.year && <p className="text-neutral-500 text-xs">{playlist.year}</p>}
                            {playlist.duration && <p className="text-neutral-500 text-xs">{playlist.duration}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DisplayHome;
