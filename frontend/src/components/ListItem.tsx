"use client"

import { useRouter } from 'next/navigation'
import Image from "next/image"
import { FaPlay } from "react-icons/fa"
import Link from 'next/link'  // Sửa lại cách import
import { usePlayer } from '@/contexts/PlayerContext';

interface ListItemProps {
  image: string;
  name: string;
  href: string;
  artist: string;
}

const ListItem: React.FC<ListItemProps> = ({
  image,
  name,
  href,
  artist
}: ListItemProps) => {
  const { playSong } = usePlayer();
  
  const handlePlay = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    playSong({ href, name, artist, image });
  };

  return (
    <Link href={`/songs/${href}`}> {/* Thêm /songs/ vào trước href */}
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
          {/* Tách button play ra khỏi Link */}
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
              bg-green-500 
              p-4 
              drop-shadow-md 
              bottom-2 
              right-2 
              translate-y-1/4
              group-hover:opacity-100 
              group-hover:translate-y-0
              hover:scale-110
              hover:bg-green-400
            "
          >
            <FaPlay className="text-black" />
          </button>
        </div>
        <div className="flex flex-col items-start w-full pt-4 gap-y-1">
          <p className="font-semibold truncate w-full text-white">{name}</p>
          <p className="text-neutral-400 text-sm pb-4 w-full truncate">
            {artist}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ListItem;
