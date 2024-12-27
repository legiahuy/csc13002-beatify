"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import upload_area from "@/assets/upload_area.png";
import axios from "axios";
import { toast } from "react-toastify";

export const url = "http://localhost:4000";

const AddUser = () => {
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("user");
  const [loading, setLoading] = useState<boolean>(false);

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      if (image) formData.append("image", image); 
      
      const response = await axios.post(`${url}/api/user/add`, formData)

      if (response.data.success) {
        toast.success("User added successfully");
        setName("");
        setEmail("");
        setPassword("");
        setRole("user");
        setImage(null);
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <div className="grid place-items-center min-h-[80vh]">
      <div className="w-16 h-16 border-4 border-gray-400 border-t-purple-800 rounded-full animate-spin"></div>
    </div>
  ) : (
    <div className="bg-white-900">
      <form onSubmit={onSubmitHandler} className="flex flex-col items-start gap-8 text-black">
        <div className="flex gap-8">
          <div className="flex flex-col gap-4">
            <p>Upload Image</p>
            <input
              onChange={onImageChange}
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
          <p>Name</p>
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
          <p>Email</p>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent outline-purple-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
            placeholder="Type Here"
            type="email"
            required
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <p>Password</p>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent outline-purple-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
            placeholder="Type Here"
            type="password"
            required
          />
        </div>

        {/* Role Selection Input */}
        <div className="flex flex-col gap-2.5">
          <p>Role</p>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-transparent outline-purple-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="curator">Curator</option>
          </select>
        </div>

        <button
          type="submit"
          className="text-base bg-black text-white py-2.5 px-14 cursor-pointer"
        >
          ADD USER
        </button>
      </form>
    </div>
  );
};

export default AddUser;
