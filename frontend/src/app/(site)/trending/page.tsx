import Header from "@/components/Header"
import ListItem from "@/components/ListItem";
import NowPlayingBar from "@/components/PlayingBar";

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
  },
  // Thêm nhiều bài hát hơn
  {
    image: "/images/hieuthuhai.jpeg",
    name: "Không thể say",
    artist: "HIEUTHUHAI",
    href: "khongthesay"
  },
  {
    image: "/images/sontung.jpg",
    name: "Making My Way",
    artist: "Sơn Tùng M-TP",
    href: "makingmyway"
  },
  {
    image: "/images/jack.jpg",
    name: "Hoa Cỏ Lau",
    artist: "Jack - J97",
    href: "hoacolau"
  }
];

export default function Trending() {
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
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
            {trendingHits.map((item) => (
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
      </Header>
      <NowPlayingBar />
    </div>
  );
}