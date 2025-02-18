"use client";

import { useEffect, useState } from "react";
import Image from 'next/image'
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from '@/config';



type Playlist = {
  image: string;
  name: string;
  _id: string;
  desc: string;
  bgColour: string;
};

const ListPlaylist = () => {
  const [data, setData] = useState<Playlist[]>([]);

  const fetchPlaylists = async() => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/playlist/list`)
      if(response.data.success) {
        setData(response.data.playlists)
      }

    } catch (error) {
      console.error("Error adding artist:", error); // Log the error
      toast.error("An error occurred");
    }
  }

  const removePlaylist = async (id: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/playlist/remove`, {id})
      if(response.data.success) {
        //setData(response.data.songs)
        await fetchPlaylists();
      }
    } catch (error) {
      console.error("Error adding artist:", error); // Log the error
      toast.error("An error occurred");
    }
  }

  useEffect(()=>{
    fetchPlaylists();
  },[])


  return (
    <div>
      <p className="text-black text-bold">All Playlists List</p>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100 text-black">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Playlist Colour</b>
          <b>Action</b>
          </div>
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 text-black">
              <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-200">
                <Image src={item.image} alt="" width={100} height={100} />
              </div>
              <p>{item.name}</p>
              <p>{item.desc}</p>
              <p>{item.bgColour}</p>
              <p className="cursor-pointer" onClick={() => {
                if (window.confirm("Are you sure you want to remove this playlist?")) {
                  removePlaylist(item._id);
                }
              }}>x</p>
              </div>
          ))
        ) : (
          <p className="mt-5 text-black">No Playlists available.</p>
        )}
      </div>
    </div>
  );
};

export default ListPlaylist;
