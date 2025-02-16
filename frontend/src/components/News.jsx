import React, { useEffect, useState } from "react";
import api from "../api";

const News = () => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await api.get(`/api/news/`);
      setNews(response.data);
      console.log(response.data);
    } catch (error) {
      setError(
        error.response.data.detail ||
          error.response.data.non_field_errors ||
          "Something went wrong"
      );
      console.error(
        "Error adding Match:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <>
      <h1 className="text-center text-2xl text-white pt-4">
        News from 3x3 world
      </h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 py-4">
        {news.map((item) => (
          <a
            key={item.id}
            href={item.url}
            className="bg-zinc-950 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
          >
            <div className="h-48 w-full ">
              <img
                src={item.img_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 border-t border-zinc-600">
              <h3 className="text-lg font-bold text-stone-100 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">{item.published_date}</p>
            </div>
          </a>
        ))}
      </div>
    </>
  );
};

export default News;
