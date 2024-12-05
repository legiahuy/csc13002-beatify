"use client"

import { useRouter } from 'next/navigation'
import Image from "next/image"
import { FaPlay } from "react-icons/fa"
import Link from 'next/link'
import { usePlayer } from '@/contexts/PlayerContext';

interface ListItemProps {
  image: string;
  name: string;
  _id: string;
  file: string;
  artist: string[]; // Expecting an array of artist names
}

const ListItem: React.FC<ListItemProps> = ({
  image,
  name,
  _id,
  file,
  artist, // Accepting artist as an array of strings
}: ListItemProps) => {
  const { playSong, songsData } = usePlayer();

  const handlePlay = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    
    // Find the complete song data from songsData
    const songData = songsData?.find(song => song._id === _id);
    if (songData) {
      //playSong(songData);
      playSong(songData, { type: "single", id: songData._id });
    }
  };

  return (
    <Link href={`/song/${_id}`}>
      <div className="
        relative 
        group 
        flex 
        flex-col 
        items-center 
        justify-center 
        rounded-md 
        overflow-hidden 
        gap-x-4 
        bg-neutral-100/10 
        cursor-pointer 
        hover:bg-neutral-100/20 
        transition 
        p-3
      ">
        <div className="
          relative 
          aspect-square 
          w-full
          h-full 
          rounded-md 
          overflow-hidden
        ">
          <Image
            className="object-cover"
            src={image}
            fill
            alt="Image"
          />
          {/* Play Button */}
          <button
            onClick={handlePlay}
            className="
              absolute 
              transition 
              opacity-0 
              rounded-full 
              flex 
              items-center 
              justify-center 
              bg-gray-100 
              p-4 
              drop-shadow-md 
              bottom-2 
              right-2 
              translate-y-1/4
              group-hover:opacity-100 
              group-hover:translate-y-0
              hover:scale-110
            "
          >
            <FaPlay className="text-black" />
          </button>
        </div>
        <div className="flex flex-col items-start w-full pt-4 gap-y-1">
          <p className="font-semibold truncate w-full text-white">{name}</p>
          <p className="text-neutral-400 text-sm pb-4 w-full truncate">
            {artist.join(', ')} {/* Join artist names with commas */}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ListItem;
