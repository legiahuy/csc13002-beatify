"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const GenresPage = () => {
  const [genres, setGenres] = useState<any[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/genres');
        setGenres(response.data);
      } catch (error) {
        console.error("Error fetching genres", error);
      }
    };

    fetchGenres();
  }, []);

  return (
    <div className="mb-8">
      <h1 className="text-3xl text-white">GENRES</h1>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {genres.map((genre) => (
          <div
            key={genre.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition duration-200 hover:scale-105"
          >
            <img
              src={genre.image}
              alt={genre.name}
              className="w-full h-32 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-white text-lg font-semibold truncate">{genre.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenresPage;
