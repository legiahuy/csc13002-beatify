import Header from "@/components/Header"
import ListItem from "@/components/ListItem";
import NowPlayingBar from "@/components/PlayingBar";
import Image from "next/image";
import Link from "next/link";
import { BiChevronRight } from "react-icons/bi";

// Thêm data cho trending hits và top artists
const trendingHits = [
  {
    image: "/images/hieuthuhai.jpeg",
    name: "APT.",
    artist: "ROSÉ, Bruno Mars",
    href: "apt"
  },
  {
    image: "/images/nguoihaynoi.jpg",
    name: "NGUOIHAYNOID",
    artist: "hoài nam",
    href: "nguoihaynoid"
  },
  {
    image: "/images/dunglam.jpg",
    name: "Đừng làm trái tim anh đau",
    artist: "Sơn Tùng M-TP",
    href: "dunglam"
  },
  {
    image: "/images/thienlyoi.jpg",
    name: "Thiên lý ơi",
    artist: "Jack - J97",
    href: "thienly"
  },
  {
    image: "/images/nguoihaynoi.jpg",
    name: "NGUOIHAYNOID",
    artist: "hoài nam",
    href: "nguoihaynoid2"
  }
];

const topArtists = [
  {
    image: "/images/hieuthuhai.jpeg",
    name: "Hiếu Thứ Hai",
    title: "Nghệ sĩ",
    href: "vu"
  },
  {
    image: "/images/sontung.jpg",
    name: "Sơn Tùng M-TP",
    title: "Nghệ sĩ",
    href: "sontung"
  },
  {
    image: "/images/jack.jpg",
    name: "Jack - J97",
    title: "Nghệ sĩ",
    href: "jack"
  },
  {
    image: "/images/tlinh.jpg",
    name: "TLINH",
    title: "Nghệ sĩ",
    href: "tlinh"
  },
  {
    image: "/images/dalab.jpg",
    name: "Da LAB",
    title: "Nghệ sĩ",
    href: "dalab"
  }
];

export default function Home() {
  return (
    <div className="
      bg-neutral-900
      rounded-lg
      h-full
      w-full
      overflow-hidden
      overflow-y-auto
    ">
      <Header>
        {/* Trending Hits Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-white text-2xl font-semibold">
              TRENDING HITS
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
            {trendingHits.slice(0, 5).map((item) => (
              <ListItem 
                key={item.href}
                image={item.image}
                name={item.name}
                href={item.href}
                artist={item.artist}
              />
            ))}
          </div>
        </div>

        {/* Top Artists Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-white text-2xl font-semibold">
              TOP ARTISTS
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
