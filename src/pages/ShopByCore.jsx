import ShopHero from "../components/ShopHero";
import { getImageUrl } from "../utils/imageUtils";
import { useProductFilter } from "../hooks/useProductFilter";
import React, { useEffect, useState } from "react";
import ShopFilterBar from "../components/ShopFilterBar";
import ProductCard from "../components/ProductCard";
import TileLoader from "../components/TileLoader";




export default function ShopByCore() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const displayedProducts = useProductFilter(products);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products?search=Core`);
        const data = await res.json();
        
        const formatted = data.map((item, index) => ({
          ...item,
          id: item._id || index,
          image: getImageUrl(item.images?.[0]),
          likes: item.likes || "0",
          colors: item.colors || [],
          brand: item.brand || "CERAGRES",
          title: item.name,
          price: item.piecesPerBox || item.price,
          rating: item.rating || "5.0",
          reviews: item.reviews || "0"
        }));

        setProducts(formatted);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);
  

  return (
    <div className="bg-white min-h-screen pb-20">
            <ShopHero 
        title={<>SHOP BY CORE</>}
        description={<> A bold surface, rich in natural details, gives character to spaces with essential style.The cool wind of the Mediterranean that blows from the northeast, cause of sedimentation and erosion over the course of millennia, is the inspiration for a texture dotted by light and dark spots that blend together creating surfaces with a uniform colour.
Core is distinguished by a fine texture of stone. </>}
        imageSrc="/images/Core.jpeg"
      />
      <ShopFilterBar />

      <div className="max-w-[1400px] mx-auto px-6 mt-12 mb-20 bg-white">
        {/* Top options controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold text-[#2a2a2a]">{displayedProducts.length} Results</h2>
          <div className="w-full sm:w-auto">
             <select className="w-full sm:w-64 border border-gray-300 rounded-sm px-4 py-2 text-sm text-[#2a2a2a] font-medium outline-none focus:border-gray-500 bg-white shadow-sm hover:border-gray-400 transition-colors cursor-pointer">
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Top Rated</option>
              <option>New Arrivals</option>
            </select>
          </div>
        </div>

        {/* The Responsive Grid */}
        {isLoading ? (
          <TileLoader />
        ) : displayedProducts.length === 0 ? (
          <div className="py-20 text-center col-span-full">
            <p className="text-xl font-bold text-slate-400">No Products Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {displayedProducts.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
        
        {/* Load More Button */}
        <div className="mt-16 flex justify-center">
            <button className="px-10 py-3 border-2 border-gray-900 text-gray-900 font-bold tracking-widest text-sm hover:bg-gray-900 hover:text-white transition-colors duration-300 uppercase">
                Load More Products
            </button>
        </div>
      </div>

    </div>
  );
}

