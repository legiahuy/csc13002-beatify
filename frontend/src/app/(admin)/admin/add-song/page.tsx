"use client";

import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/utils/date";
import ProtectedRoute from "@/components/protectedRoute";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import Button from "@/components/Button"
import Image from 'next/image'
import upload_song from '@/assets/upload_song.png'
import upload_added from '@/assets/upload_added.png'
import upload_area from '@/assets/upload_area.png'
import axios from "axios";
import { toast } from "react-toastify";

export const url = 'http://localhost:4000'

const AddSong = () => {
  const { user, logout, checkAuth } = useAuthStore();

  useEffect(() => {
    const checkUserAuth = async () => {
      await checkAuth(); // Ensure this returns a promise if needed
    };
    checkUserAuth();
  }, [checkAuth]);


  const router = useRouter();

  const [image, setImage] = useState<File | null>(null);
  const [song, setSong] = useState<File | null>(null);
  const [name, setName] = useState(""); 
  const [desc, setDesc] = useState(""); 
  const [playlist, setPlaylist] = useState("none"); 
  const [loading, setLoading] = useState(false); 
  const [playlistData, setPlaylistData] = useState([]); 

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('desc', desc);
      if (image) formData.append('image', image); 
      if (song) formData.append('audio', song);   
      formData.append('playlist', playlist);

      const response = await axios.post(`${url}/api/song/add`, formData)

      if(response.data.success) {
        toast.success("Song added");
        setName("");
        setDesc("");
        setPlaylist("none");
        setImage(null);
        setSong(null);
      }
      else {
        toast.error("Something went wrong")
      }

    } catch (error) {
      toast.error("Error occured")
    }
    setLoading(false);
  }

  if (user && user.role !== "admin") {
    router.push("/");
    return null;
  }

  return loading ? (
    <div className="grid place-items-center min-h-[80vh]">
      <div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-purple-800 rounded-full animate-spin"></div>
    </div>
  ) : (
    <ProtectedRoute>
      <div className="bg-gray-900">
        <form onSubmit={onSubmitHandler} className="flex flex-col items-start gap-8 text-white-600">
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
              defaultValue={playlist}
              className="bg-transparent outline-purple-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
            >
              <option value="none">None</option>
            </select>
          </div>

          <button
            type="submit"
            className="text-base bg-black text-white py-2.5 px-14 cursor-pointer"
          >
            ADD
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
};

export default AddSong;
