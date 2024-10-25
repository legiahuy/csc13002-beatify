"use client"

import { useRouter } from 'next/navigation'
import Image from "next/image"
import { FaPlay } from "react-icons/fa"

interface ListItemProps {
  image: string;
  name: string;
  artist: string;
  href: string;
}

const ListItem: React.FC<ListItemProps> = ({
  image,
  name,
  artist,
  href
}) => {
  const router = useRouter();

  const onClick = () => {
    router.push(href);
  }
  return (
    <div
      className="
        relative 
        group 
        flex 
        flex-col
        items-center
        cursor-pointer
      "
    >
      <div className="
        relative
        aspect-square
        w-full
        overflow-hidden
        rounded-md
      ">
        <Image 
          className="object-cover"
          fill
          src={image}
          alt="Image"
        />
        <div 
          className="
            absolute
            transition
            opacity-0
            rounded-full
            flex
            items-center
            justify-center
            bg-green-500
            p-3
            drop-shadow-md
            right-4
            bottom-4
            group-hover:opacity-100
            hover:scale-110
          "
        >
          <FaPlay className="text-black" size={12}/>
        </div>
      </div>
      <div className="flex flex-col w-full gap-y-1 mt-4">
        <p className="font-semibold text-sm text-white truncate w-full">
          {name}
        </p>
        <p className="text-xs text-neutral-400 truncate w-full">
          {artist}
        </p>
      </div>
    </div>
  );
}

export default ListItem;
