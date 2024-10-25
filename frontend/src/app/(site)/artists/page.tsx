import Header from "@/components/Header"
import Image from "next/image";
import NowPlayingBar from "@/components/PlayingBar";
import { topArtists } from "@/data/songs";

export default function Artists() {
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-6">
          <h1 className="text-white text-3xl font-bold mb-6">
            Top Artists
          </h1>
          <div className="
            grid 
            grid-cols-2 
            sm:grid-cols-3 
            lg:grid-cols-4 
            2xl:grid-cols-5 
            gap-4
          ">
            {topArtists.map((artist) => (
              <div key={artist.href} className="flex flex-col items-center">
                <div className="
                  relative 
                  aspect-square
                  w-[150px]
                  sm:w-[180px] 
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
      <NowPlayingBar />
    </div>
  );
}
