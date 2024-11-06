"use client";

import { useEffect, useState } from "react";
import Image from 'next/image'
import axios from "axios";
import { toast } from "react-toastify";

export const url = 'http://localhost:4000'

type Artist = {
  pfp: string;
  name: string;
  _id: string;
  desc: string;
  bgColour: string;
};

const ListArtist = () => {
  const [data, setData] = useState<Artist[]>([]);

  const fetchArtists = async() => {
    try {
      const response = await axios.get(`${url}/api/artist/list`)
      if(response.data.success) {
        setData(response.data.artists)
      }

    } catch (error) {
      toast.error("Error Occured")
    }
  }

  const removeArtist = async (id: string) => {
    try {
      const response = await axios.post(`${url}/api/artist/remove`, {id})
      if(response.data.success) {
        //setData(response.data.songs)
        await fetchArtists();
      }
    } catch (error) {
      toast.error("Error Occured")
    }
  }

  useEffect(()=>{
    fetchArtists();
  },[])


  return (
    <div>
      <p className="text-black text-bold">All Artists List</p>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100 text-black">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Background Colour</b>
          <b>Action</b>
          </div>
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 text-black">
              <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-200">
                <Image
                  src={item.pfp}
                  alt={item.name}
                  width={100}   // Fixed width
                  height={100}  // Fixed height to create a square
                  className="object-cover w-full h-full"
                />
              </div>
              <p>{item.name}</p>
              <p>{item.desc}</p>
              <p>{item.bgColour}</p>
              <p className="cursor-pointer" onClick={()=>removeArtist(item._id)}>x</p>
            </div>
          ))
        ) : (
          <p className="mt-5 text-black">No Artists available.</p>
        )}
      </div>
    </div>
  );
};

export default ListArtist;
