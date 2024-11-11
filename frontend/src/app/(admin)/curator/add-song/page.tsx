"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import upload_song from "@/assets/upload_song.png";
import upload_added from "@/assets/upload_added.png";
import upload_area from "@/assets/upload_area.png";
import axios from "axios";
import { toast } from "react-toastify";

export const url = "http://localhost:4000";

interface Playlist {
  name: string;
}

interface Artist {
  name: string;
  _id: string;
  pfp: string;
}

const AddSong = () => {
  const [image, setImage] = useState<File | null>(null);
  const [song, setSong] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [playlist, setPlaylist] = useState("none");
  const [loading, setLoading] = useState(false);
  const [playlistData, setPlaylistData] = useState<Playlist[]>([]);
  const [artistData, setArtistData] = useState<Artist[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      if (image) formData.append("image", image);
      if (song) formData.append("audio", song);
      formData.append("playlist", playlist);
  
      // Append each artist ID individually
      selectedArtists.forEach((id) => formData.append("artist_id[]", id));
  
      const response = await axios.post(`${url}/api/song/add`, formData);

      console.log(response.data)
  
      if (response.data.success) {
        toast.success("Song added");
        setName("");
        setDesc("");
        setPlaylist("none");
        setSelectedArtists([]);
        setImage(null);
        setSong(null);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Error occurred");
    }
    setLoading(false);
  };
  
  const loadPlaylistData = async () => {
    try {
      const response = await axios.get(`${url}/api/playlist/list`);
      if (response.data.success) {
        setPlaylistData(response.data.playlists);
      } else {
        toast.error("Unable to load playlists data");
      }
    } catch (error) {
      toast.error("Error occurred");
    }
  };

  const loadArtistData = async () => {
    try {
      const response = await axios.get(`${url}/api/artist/list`);
      if (response.data.success) {
        setArtistData(response.data.artists);
      } else {
        toast.error("Unable to load artists data");
      }
    } catch (error) {
      toast.error("Error occurred");
    }
  };

  const handleAddArtist = (artistId: string) => {
    if (artistId && !selectedArtists.includes(artistId)) {
      setSelectedArtists([...selectedArtists, artistId]);
    }
  };

  const handleRemoveArtist = (artistId: string) => {
    setSelectedArtists(selectedArtists.filter((id) => id !== artistId));
  };

  useEffect(() => {
    loadPlaylistData();
    loadArtistData();
  }, []);

  return loading ? (
    <div className="grid place-items-center min-h-[80vh]">
      <div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-purple-800 rounded-full animate-spin"></div>
    </div>
  ) : (
    <div className="bg-white-900">
      <form onSubmit={onSubmitHandler} className="flex flex-col items-start gap-8 text-black">
        <div className="flex gap-8">
          <div className="flex flex-col gap-4">
            <p>Upload Song</p>
            <input
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSong(e.target.files[0]);
                }
              }}
              type="file"
              id="song"
              accept="audio/*"
              hidden
            />
            <label htmlFor="song">
              <Image
                src={song ? upload_added : upload_song}
                className="w-24 cursor-pointer"
                alt="Upload song"
              />
            </label>
          </div>
          <div className="flex flex-col gap-4">
            <p>Upload Image</p>
            <input
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0]);
                }
              }}
              type="file"
              id="image"
              accept="image/*"
              hidden
            />
            <label htmlFor="image">
              <Image
                src={image ? URL.createObjectURL(image) : upload_area}
                className="w-24 cursor-pointer"
                alt="Upload area"
                width={200}
                height={200}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <p>Song name</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent outline-purple-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
            placeholder="Type Here"
            type="text"
            required
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <p>Song description</p>
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="bg-transparent outline-purple-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
            placeholder="Type Here"
            type="text"
            required
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <p>Playlist</p>
          <select
            value={playlist}
            onChange={(e) => setPlaylist(e.target.value)}
            className="bg-transparent outline-purple-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          >
            <option value="none">None</option>
            {playlistData.map((item, index) => (
              <option key={index} value={item.name}>{item.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2.5">
          <p>Artist</p>
          <select
            onChange={(e) => handleAddArtist(e.target.value)}
            className="bg-transparent outline-purple-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          >
            <option value="">Select an Artist</option>
            {artistData.map((artist) => (
              <option key={artist._id} value={artist._id}>{artist.name}</option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedArtists.map((id) => {
              const artist = artistData.find((artist) => artist._id === id);
              return artist ? (
                <div key={id} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                      <Image
                        src={artist.pfp}
                        alt={`${artist.name}'s profile`}
                        width={40} // Larger width and height to ensure high resolution
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  <span>{artist.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveArtist(id)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>

        <button
          type="submit"
          className="text-base bg-black text-white py-2.5 px-14 cursor-pointer"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddSong;
