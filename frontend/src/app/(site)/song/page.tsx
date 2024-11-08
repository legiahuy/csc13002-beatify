"use client"
import Header from "@/components/Header"
import ListItem from "@/components/ListItem";
import { usePlayer } from "@/contexts/PlayerContext";

export default function Trending() {
  const { songsData, artistsData } = usePlayer();

  // Utility function to get artist names by IDs
  const getArtistNames = (artistIds: string[]) => {
    return artistIds.map(id => {
      const artist = artistsData?.find(artist => artist._id === id);
      return artist ? artist.name : 'Unknown Artist';
    });
  };

  return (
    <div className="rounded-lg h-full w-full overflow-hidden overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-6">
            Trending Hits
          </h1>
          <div className="
            grid 
            grid-cols-2 
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
            gap-4
          ">
            {songsData?.map((item) => (
              <ListItem 
                _id={item._id}
                image={item.image}
                name={item.name}
                file={item.file}
                artist={getArtistNames(item.artist_id)} // Convert artist IDs to names
                key={item._id}
              />
            ))}
          </div>
        </div>
    </div>
  );
}