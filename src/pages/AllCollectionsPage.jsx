import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import { COLLECTIONS } from "../admin/constants";
import { getImageUrl } from "../utils/imageUtils";
import TileLoader from "../components/TileLoader";

const getCollectionUrl = (name) => {
  const specialUrls = {
    "B&W": "/collection/bandw"
  };
  if (specialUrls[name]) return specialUrls[name];

  const formatted = name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");
  return `/collection/${formatted}`;
};

const getCollectionImage = (name, fallbackProductImage) => {
  // Check if dedicated cover exists in public/images
  const specialMap = {
    "B&W": "/images/B&W.jpeg",
    "Corten": "/images/CORTEN.jpeg",
    "Denver": "/images/DENVER.jpeg",
    "Etruria": "/images/ETRURIA.jpeg",
  };

  if (specialMap[name]) return specialMap[name];
  
  // If we have a fallback product image, use it!
  if (fallbackProductImage) {
    return getImageUrl(fallbackProductImage);
  }

  // Otherwise try the default naming convention
  return `/images/${name}.jpeg`;
};

export default function AllCollectionsPage() {
  const [collectionsData, setCollectionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
        if (!res.ok) throw new Error("Failed to load products");
        const products = await res.json();

        // Group counts & fallbacks
        const counts = {};
        const fallbacks = {};

        COLLECTIONS.forEach(col => {
          counts[col] = 0;
          fallbacks[col] = null;
        });

        products.forEach(p => {
          if (p.series) {
            // Find case-insensitive match
            const matchedCol = COLLECTIONS.find(c => c.toLowerCase() === p.series.toLowerCase().trim());
            if (matchedCol) {
              counts[matchedCol]++;
              if (!fallbacks[matchedCol] && p.images && p.images.length > 0) {
                fallbacks[matchedCol] = p.images[0];
              }
            }
          }
        });

        const formatted = COLLECTIONS.map(col => ({
          name: col,
          count: counts[col],
          image: getCollectionImage(col, fallbacks[col]),
          url: getCollectionUrl(col)
        })).filter(col => col.count > 0);

        // Sort alphabetically (A to Z)
        formatted.sort((a, b) => a.name.localeCompare(b.name));

        setCollectionsData(formatted);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setCollectionsData([]);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Banner Header */}
      <div className="relative h-[60vh] w-full overflow-hidden bg-slate-900 flex items-center justify-center">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/stone.jpeg" 
            alt="All Collections Banner"
            className="w-full h-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        {/* Center Text */}
        <div className="relative z-10 text-center px-6 translate-y-24">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-widest mb-2 drop-shadow-md">
            All Collections
          </h1>
          <div className="w-16 h-1 bg-white mx-auto mt-4" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 mt-16">
        {isLoading ? (
          <TileLoader />
        ) : collectionsData.length === 0 ? (
          <div className="text-center py-20 border border-slate-100 bg-white">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">No active collections found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {collectionsData.map((col) => (
              <div 
                key={col.name}
                onClick={() => navigate(col.url)}
                className="group cursor-pointer border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full rounded-none"
              >
                {/* Image Container */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-50 relative">
                  <img 
                    src={col.image} 
                    alt={col.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      // Fallback to placeholder if jpeg loading fails
                      e.target.onerror = null;
                      e.target.src = "/images/stone.jpeg";
                    }}
                  />
                  {col.count > 0 && (
                    <span className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1">
                      {col.count} {col.count === 1 ? 'Item' : 'Items'}
                    </span>
                  )}
                </div>

                {/* Info Container */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
                      {col.name}
                    </h3>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-black uppercase tracking-widest text-[#002642] group-hover:text-blue-600 transition-colors">
                    <span>Visit Now</span>
                    <HiArrowRight className="text-sm transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
