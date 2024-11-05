"use client";

import { useEffect, useState } from "react";
import Image from 'next/image'
import axios from "axios";
import { toast } from "react-toastify";

export const url = 'http://localhost:4000'

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
      const response = await axios.get(`${url}/api/playlist/list`)
      if(response.data.success) {
        setData(response.data.playlists)
      }

    } catch (error) {
      toast.error("Error Occured")
    }
  }

  const removePlaylist = async (id: string) => {
    try {
      const response = await axios.post(`${url}/api/song/remove`, {id})
      if(response.data.success) {
        //setData(response.data.songs)
        await fetchPlaylists();
      }
    } catch (error) {
      toast.error("Error Occured")
    }
  }

  useEffect(()=>{
    fetchPlaylists();
  },[])


  return (
    <div>
      <p>All Playlists List</p>
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
              <Image src={item.image} alt="" width={100} height={100} />
              <p>{item.name}</p>
              <p>{item.desc}</p>
              <p>{item.bgColour}</p>
              <p className="cursor-pointer" onClick={()=>removePlaylist(item._id)}>x</p>
            </div>
          ))
        ) : (
          <p>No Playlists available.</p>
        )}
      </div>
    </div>
  );
};

export default ListPlaylist;
