import Header from "@/components/Header"
import Image from "next/image";
import NowPlayingBar from "@/components/PlayingBar";

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
  },
  // Thêm nhiều nghệ sĩ hơn
  {
    image: "/images/hoangthuylinh.jpg",
    name: "Hoàng Thùy Linh",
    title: "Nghệ sĩ",
    href: "hoangthuylinh"
  },
  {
    image: "/images/denluot.jpg",
    name: "Đen Vâu",
    title: "Nghệ sĩ",
    href: "denvau"
  },
  {
    image: "/images/mytan.jpg",
    name: "Mỹ Tâm",
    title: "Nghệ sĩ",
    href: "mytam"
  }
];

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