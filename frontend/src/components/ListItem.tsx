"use client"

import { useRouter } from 'next/navigation'
import Image from "next/image"
import { FaPlay } from "react-icons/fa"

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
}) => {
  const router = useRouter();

  const onClick = () => {
    router.push(`/songs/${href}`);
  }
  return (
    <button
      onClick={onClick}
      className="
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
      "
    >
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
          alt={name}
        />
      </div>
      <div className="flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="font-semibold truncate w-full text-white">
          {name}
        </p>
        <p className="text-neutral-400 text-sm pb-4 w-full truncate">
          {artist}
        </p>
      </div>
    </button>
  );
}

export default ListItem;
