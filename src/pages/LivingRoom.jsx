import { getImageUrl } from "../utils/imageUtils";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LivingRoom() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLivingRoomTiles = async () => {
      try {
        const data = res.data?.products || res.data || [];
        const filtered = Array.isArray(data) ? data.filter(tile => tile.category === "LIVING ROOM") : [];
        setProducts(filtered);
      } catch (err) {
        console.error("Data laane mein error:", err);
      }
    };
    fetchLivingRoomTiles();
  }, []);

  return (
    <div className="max-w-[1250px] mx-auto px-4 py-10">
      <Helmet>
        <title>Living Room Tiles | Luxury Floor & Accent Wall Tiles - Ceragreslux</title>
        <meta name="description" content="Enhance your living space with Ceragreslux' luxury floor and accent wall tiles. Choose from a vast range of vitrified, porcelain, and marble-finish tiles." />
        <meta name="keywords" content="living room tiles, living room floor tiles, accent wall tiles, vitrified tiles for living room, luxury flooring India" />
      </Helmet>
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">Living Room Tiles Collection</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-gray-100 rounded-none overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            onClick={() => navigate(`/product/${item._id}`)}
          >
            <div>
              <img
                src={getImageUrl(item.images?.[0])}
                alt={item.name}
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">{item.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{item.size}</p>
              <p className="text-base font-bold text-blue-600">
                ₹{item.priceSqFt}/Sq.Ft
                <span className="block text-xs text-gray-400 font-normal mt-0.5 italic">Or ₹{item.priceBox}/Box</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LivingRoom;