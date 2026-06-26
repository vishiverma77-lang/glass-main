import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShopHero from "../components/ShopHero";
import { getImageUrl } from "../utils/imageUtils";
import { useProductFilter } from "../hooks/useProductFilter";
import ShopFilterBar from "../components/ShopFilterBar";
import ProductCard from "../components/ProductCard";
import TileLoader from "../components/TileLoader";

const colourDetails = {
  azul: {
    title: "SHOP AZUL Colour",
    description: "Experience the vibrant, calming tones of Azul. Perfect for creating a coastal, refreshing space with high-end premium finishes.",
    image: "/images/Blue.jpeg"
  },
  beige: {
    title: "SHOP BEIGE Colour",
    description: "A versatile shade suitable for all styles. It warms and illuminates, invites and welcomes: beige is a subtle, neutral colour, easy to mix and match, that inspires a mood of relaxation.",
    image: "/images/Beige.jpeg"
  },
  black: {
    title: "SHOP BLACK Colour",
    description: "Bold, modern, and timeless. Black tiles define sophisticated luxury, bringing dramatic elegance and high-contrast styling to floors, walls, and showers.",
    image: "/images/Black.jpeg"
  },
  blue: {
    title: "SHOP BLUE Colour",
    description: "Serene and deep, blue tiles create a tranquil oasis. From deep ocean shades to sky hues, blue brings relaxation and high-end aesthetics to your bathrooms and backsplashes.",
    image: "/images/Blue.jpeg"
  },
  bronze: {
    title: "SHOP BRONZE Colour",
    description: "Rich metallic bronze tiles deliver warmth, luxury, and character. Ideal for industrial chic, modern rustic, or contemporary spaces looking for a touch of metallic glam.",
    image: "/images/Metal.jpeg"
  },
  brown: {
    title: "SHOP BROWN Colour",
    description: "Earthiness and warm sophistication. Our brown tiles reflect cozy luxury, blending organic textures with high-durability modern surfaces.",
    image: "/images/Brown.jpeg"
  },
  "dark-grey": {
    title: "SHOP DARK GREY Colour",
    description: "Sleek and minimalist, dark grey tiles add depth and industrial elegance. A perfect neutral anchor for modern kitchens, bathrooms, and commercial spaces.",
    image: "/images/Dark Grey.jpeg"
  },
  grey: {
    title: "SHOP GREY Colour",
    description: "The ultimate modern neutral. Grey tiles bring clean design and calm elegance, fitting seamlessly into any traditional or contemporary design layout.",
    image: "/images/Light Grey.jpeg"
  },
  "metallic-brown": {
    title: "SHOP METALLIC BROWN Colour",
    description: "A luxury fusion of rich earth tones and shimmering metallic finishes. Perfect for creating bold backsplash or wall statement features.",
    image: "/images/Metal.jpeg"
  },
  white: {
    title: "SHOP WHITE Colour",
    description: "Pure, luminous, and expansive. White tiles reflect light and make spaces feel open, hygienic, and bright. A clean canvas for any interior design theme.",
    image: "/images/White.jpeg"
  }
};

export default function ColourPage() {
  const { colourName } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const displayedProducts = useProductFilter(products);

  // Normalize color name from url parameter
  const rawColourKey = colourName ? colourName.toLowerCase().trim() : "";
  // Map 'light-grey' or similar if they use spaces or dashes
  const colourKey = rawColourKey.replace(/_/g, "-");

  const details = colourDetails[colourKey] || {
    title: `SHOP ${colourName?.toUpperCase()} Colour`,
    description: `Browse our exquisite selection of premium ${colourName} tiles. Crafted with state-of-the-art technology to elevate your spaces with beauty and durability.`,
    image: "/images/Beige.jpeg"
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch using search term (capitalized or normalized term)
        const searchTerm = colourName
          ? colourName.charAt(0).toUpperCase() + colourName.slice(1).replace(/-/g, " ")
          : "";
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products?search=${searchTerm}`);
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
  }, [colourName]);

  return (
    <div className="bg-white min-h-screen pb-20">
      <ShopHero
        title={<>{details.title}</>}
        description={<>{details.description}</>}
        imageSrc={details.image}
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
