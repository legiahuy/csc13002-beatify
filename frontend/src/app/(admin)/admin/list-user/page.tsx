"use client";

import { useEffect, useState } from "react";
import Image from 'next/image';
import axios from "axios";
import { toast } from "react-toastify";

export const url = 'http://localhost:4000';

type User = {
  pfp: string;
  name: string;
  _id: string;
  email: string;
  role: string;
};

const ListUser = () => {
  const [data, setData] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${url}/api/user/list`);
      if (response.data.success) {
        setData(response.data.users);
      }
    } catch (error) {
      toast.error("Error Occured");
    }
  };

  const removeUser = async (id: string) => {
    try {
      const response = await axios.post(`${url}/api/user/remove`, { id });
      if (response.data.success) {
        await fetchUsers();
      }
    } catch (error) {
      toast.error("Error Occured");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <p className="text-black text-bold">All Users List</p>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_1fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100 text-black">
          <b>Image</b>
          <b>Name</b>
          <b>Email</b>
          <b>Role</b>
          <b>Action</b>
        </div>
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_1fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 text-black">
              <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-200">
                <Image
                  src={item.pfp}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                />
              </div>
              <p>{item.name}</p>
              <p>{item.email}</p>
              <p>{item.role}</p>
              <p className="cursor-pointer" onClick={() => removeUser(item._id)}>x</p>
            </div>
          ))
        ) : (
          <p className="mt-5 text-black">No Users available.</p>
        )}
      </div>
    </div>
  );
};

export default ListUser;
