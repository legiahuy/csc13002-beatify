import Link from 'next/link';
import { BiChevronRight } from 'react-icons/bi';
import Image from 'next/image';
import ListItem from '@/components/ListItem';
import { usePlayer } from '@/contexts/PlayerContext';

const DisplayHome = () => {

    const { songsData, artistsData } = usePlayer();

    // Utility function to get artist names by IDs
    const getArtistNames = (artistIds: string[]) => {
        return artistIds.map(id => {
            const artist = artistsData?.find(artist => artist._id === id);
            return artist ? artist.name : 'Unknown Artist'; // Return artist name or fallback to 'Unknown Artist'
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
                        // Get artist names for each song
                        const artistNames = getArtistNames(item.artist_id);

                        return (
                            <ListItem 
                                _id={item._id}
                                image={item.image}
                                name={item.name}
                                file={item.file}
                                artist={artistNames}  // Pass the list of artist names
                                key={item._id}
                            />
                        );
                    })}
                </div>
            </div>

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
        </div>
    );
}

export default DisplayHome;
