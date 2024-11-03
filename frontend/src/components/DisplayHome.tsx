import Link from 'next/link';
import { BiChevronRight } from 'react-icons/bi';
import Image from 'next/image';
import Header from '@/components/Header';
import ListItem from '@/components/ListItem';
import { trendingHits, topArtists } from "@/data/songs";

const DisplayHome = () => {
    return (
        <div className="
          bg-neutral-900
          rounded-lg
          h-full
          w-[99.5%]
          overflow-hidden
          overflow-y-auto
          pb-20  
        ">
          <Header className="flex-shrink-0">
            <div className="mb-8">
              {/* Trending Hits Section */}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-white text-2xl font-semibold">
                  Trending Hits
                </h1>
                <Link 
                  href="/trending"
                  className="
                    text-neutral-400 
                    hover:text-white 
                    flex 
                    items-center 
                    gap-x-1 
                    cursor-pointer 
                    transition
                    text-sm
                    font-medium
                  "
                >
                  Show all
                  <BiChevronRight size={20} />
                </Link>
              </div>
              <div className="
                grid 
                grid-cols-5
                gap-4
              ">
                {trendingHits?.slice(0, 5).map((item) => (
                  <ListItem 
                    id={item.id}
                    image={item.image}
                    name={item.name}
                    file={item.file}
                    artist={item.artist}
                    key={item.id}
                  />
                ))}
              </div>
            </div>
    
            {/* Top Artists Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-white text-2xl font-semibold">
                  Top Artists
                </h1>
                <Link 
                  href="/artists"
                  className="
                    text-neutral-400 
                    hover:text-white 
                    flex 
                    items-center 
                    gap-x-1 
                    cursor-pointer 
                    transition
                    text-sm
                    font-medium
                  "
                >
                  Show all
                  <BiChevronRight size={20} />
                </Link>
              </div>
              <div className="
                grid 
                grid-cols-5 
                gap-4
              ">
                {topArtists?.slice(0, 5).map((artist) => (
                  <div key={artist.href} className="flex flex-col items-center">
                    <div className="
                      relative 
                      aspect-square
                      w-[150px]
                      rounded-full 
                      overflow-hidden 
                      cursor-pointer 
                      hover:opacity-80 
                      transition
                    ">
                      <Image
                        src={artist.image}
                        fill
                        alt={artist.name}
                        className="object-cover"
                      />
                    </div>
                    <p className="text-white mt-4 text-lg font-medium">{artist.name}</p>
                    <p className="text-neutral-400 text-sm mt-1">{artist.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </Header>
        </div>
      );
}

export default DisplayHome;
