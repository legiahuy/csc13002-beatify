"use client";

import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/protectedRoute";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import Image from 'next/image'
import upload_area from '@/assets/upload_area.png'
import axios from "axios";
import { toast } from "react-toastify";

export const url = 'http://localhost:4000'

const AddPlaylist = () => {
  const { user, checkAuth } = useAuthStore();

  useEffect(() => {
    const checkUserAuth = async () => {
      await checkAuth(); 
    };
    checkUserAuth();
  }, [checkAuth]);


  const router = useRouter();

  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState(""); 
  const [desc, setDesc] = useState(""); 
  const [colour, setColour] = useState("#121212"); 
  const [loading, setLoading] = useState(false); 

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('desc', desc);
      if (image) formData.append('image', image); 
      formData.append('bgColour', colour);

      const response = await axios.post(`${url}/api/playlist/add`, formData)

      if(response.data.success) {
        toast.success("Playlist added");
        setName("");
        setDesc("");
        setImage(null);
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
      <div className="bg-white-900">
        <form onSubmit={onSubmitHandler} className="flex flex-col items-start gap-8 text-black">
          <div className="flex gap-8">
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
            <p>Playlist name</p>
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
            <p>Playlist description</p>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="bg-transparent outline-purple-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
              placeholder="Type Here"
              type="text"
              required
            />
          </div>

          <div className="flex flex-col gap-3">
            <p>Background Colour</p>
            <input
              onChange={(e)=>setColour(e.target.value)}
              value={colour}
              type="color"
            />
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

export default AddPlaylist;
