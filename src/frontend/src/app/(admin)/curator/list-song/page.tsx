"use client";

import { useEffect, useState } from "react";
import Image from 'next/image'
import axios from "axios";
import { toast } from "react-toastify";

export const url = 'http://localhost:4000'

type Song = {
  image: string;
  name: string;
  playlist: string;
  duration: string;
  _id: string;
};

const ListSong = () => {
  const [data, setData] = useState<Song[]>([]);

  const fetchSongs = async() => {
    try {
      const response = await axios.get(`${url}/api/song/list`)
      if(response.data.success) {
        setData(response.data.songs)
      }

    } catch (error) {
      toast.error("Error Occured")
    }
  }

  const removeSong = async (id: string) => {
    try {
      const response = await axios.post(`${url}/api/song/remove`, {id})
      if(response.data.success) {
        //setData(response.data.songs)
        await fetchSongs();
      }
    } catch (error) {
      toast.error("Error Occured")
    }
  }

  useEffect(()=>{
    fetchSongs();
  },[])


  return (
    <div>
      <p className="text-black text-bold">All Songs List</p>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100 text-black">
          <b>Image</b>
          <b>Name</b>
          <b>Playlist</b>
          <b>Duration</b>
          <b>Action</b>
          </div>
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 text-black">
              <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-200">
                <Image src={item.image} alt="" width={100} height={100} />
              </div>
              <p>{item.name}</p>
              <p>{item.playlist}</p>
              <p>{item.duration}</p>
              <p className="cursor-pointer" onClick={() => {
                if (window.confirm("Are you sure you want to remove this song?")) {
                  removeSong(item._id);
                }
              }}>x</p>
            </div>
          ))
        ) : (
          <p className="mt-5 text-black">No songs available.</p>
        )}
      </div>
    </div>
  );
};

export default ListSong;
