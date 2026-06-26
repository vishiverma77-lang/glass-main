import { getImageUrl } from "../utils/imageUtils";
import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Slider from "../components/Slider";
import {
  HiOutlineAdjustments, HiChevronDown, HiX, HiChevronLeft, HiChevronRight,
  HiOutlineUserGroup, HiOutlineRefresh, HiOutlineCube, HiOutlineShieldCheck
} from "react-icons/hi";

// ─── Category Cards ────────────────────────────────────
const categoryCards = [
  { label: "KITCHEN & BACKSPLASH", image: "/fwdimagesforsite 1/KITCHEN & BACKSPLASH.jpg?w=600&q=80", value: "KITCHEN" },
  { label: "BATHROOM & SHOWER", image: "/fwdimagesforsite 1/oregon pardo 4.jpg?w=600&q=80", value: "BATHROOM" },
  { label: "BEDROOMS", image: "/fwdimagesforsite 1/Veritaas 1.jpg?w=600&q=80", value: "BED Room" },
  { label: "LIVING SPACES", image: "/fwdimagesforsite 1/LIVING SPACES.jpg?w=600&q=80", value: "LIVING Spaces" },
];

// ─── Categories ───────────────────────────────────────
const categories = [
  { label: "All", value: null },
  { label: "Bathroom", value: "BATHROOM" },
  { label: "Kitchen", value: "KITCHEN" },
  { label: "Living Room", value: "LIVING ROOM" },
  { label: "Bedroom", value: "BEDROOM" },
  { label: "Floor", value: "FLOOR" },
  { label: "Wall", value: "WALL" },
  { label: "Outdoor", value: "OUTDOOR" },
  { label: "Parking", value: "PARKING" },
];

// ─── Filter options ────────────────────────────────────
const filterOptions = {
  Size: ['12x12"', '24x24"', '12x24"', '18x18"', '6x6"', '3x6"'],
  Finish: ["Matte", "Glossy", "Polished", "Textured", "Satin"],
  "Sort By": ["Price: Low to High", "Price: High to Low", "Newest First", "Most Popular"],
};

export default function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [openFilter, setOpenFilter] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [sortBy, setSortBy] = useState("Newest First");
  const [storyIndex, setStoryIndex] = useState(0);

  // Ken Burns cross-fade slideshow timer
  useEffect(() => {
    const timer = setInterval(() => {
      setStoryIndex((prev) => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Products fetch (using local backend for speed/consistency)
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/products`)
      .then((res) => {
        // Handle both object-wrapped and direct array responses
        const data = Array.isArray(res.data) ? res.data : (res.data.products || []);
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filtered products
  let filteredProducts = [...products];

  // 1. Category Filter
  if (activeCategory) {
    filteredProducts = filteredProducts.filter(p => p.category?.toUpperCase() === activeCategory);
  }

  // 3. Dropdown Filters (Size, Finish)
  Object.entries(activeFilters).forEach(([key, filterValue]) => {
    if (key === "Size") {
      filteredProducts = filteredProducts.filter(p => {
        // filterValue from dropdown usually has quotes e.g. '12x12"'
        // Backend sizes usually look like '12x12"' or '12x12" '
        const val = filterValue.trim().toLowerCase();
        const strippedVal = val.replace(/["\s]/g, '');

        if (p.sizes && Array.isArray(p.sizes)) {
          return p.sizes.some(s => {
            const cleanS = s.toLowerCase().trim();
            return cleanS.includes(val) || cleanS.replace(/["\s]/g, '').includes(strippedVal);
          });
        }
        if (p.size) {
          const cleanS = p.size.toLowerCase().trim();
          return cleanS.includes(val) || cleanS.replace(/["\s]/g, '').includes(strippedVal);
        }
        return false;
      });
    } else if (key === "Finish") {
      filteredProducts = filteredProducts.filter(p => {
        const val = filterValue.toLowerCase().trim();
        // Check exact finish property if it exists
        if (p.finish && p.finish.toLowerCase().includes(val)) return true;

        // Otherwise search within name and description
        const searchStr = `${p.name || ''} ${p.description || ''}`.toLowerCase();
        return searchStr.includes(val);
      });
    }
  });

  // 4. Sort By
  if (sortBy === "Price: Low to High") {
    filteredProducts.sort((a, b) => (a.priceSqFt || 0) - (b.priceSqFt || 0));
  } else if (sortBy === "Price: High to Low") {
    filteredProducts.sort((a, b) => (b.priceSqFt || 0) - (a.priceSqFt || 0));
  } else if (sortBy === "Newest First") {
    filteredProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // The announcement bar hides after 60px.
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const clearFilter = (key) => {
    const updated = { ...activeFilters };
    delete updated[key];
    setActiveFilters(updated);
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>CÉRÀGRÈS LUXE | Premium Floor, Wall, Bathroom & Kitchen Tiles India</title>
        <meta name="description" content="India's leading brand for luxury tiles. Explore 2500+ designs in vitrified, ceramic, and digital tiles. Shop bathroom and kitchen tiles online." />
        <meta name="keywords" content="luxury tiles, premium flooring, vitrified tiles India, digital wall tiles, ceramic floor tiles, designer tiles, CÉRÀGRÈS LUXE home, best tiles for kitchen, bathroom tile online" />
      </Helmet>

      {/* ══════════════════════════════════════════ */}
      {/* HERO BANNER — PREMIUM FULL SCREEN SLIDER   */}
      {/* ══════════════════════════════════════════ */}
      <Slider />

      {/* ══════════════════════════════════════════ */}
      {/* CATEGORY IMAGE CARDS                      */}
      {/* ══════════════════════════════════════════ */}
      <section className="mt-10 w-full px-2 md:px-6 lg:px-10">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-normal tracking-widest uppercase text-gray-900" style={{ fontFamily: 'Arial, sans-serif' }}>Explore Top Categories</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-10">
          {categoryCards.map((card) => (
            <button
              key={card.label}
              onClick={() => {
                setActiveCategory(card.value);
                document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="flex flex-col items-start gap-3 group focus:outline-none w-full text-left"
            >
              <div className="w-full aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={card.image}
                  alt={card.label}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <span className="text-[12px] md:text-[13px] font-normal text-gray-900 tracking-wider">
                {card.label}
              </span>
            </button>
          ))}
        </div>
      </section>



      {/* ══════════════════════════════════════════ */}
      {/* PROMO BANNER: GET 5 SAMPLES FOR $5        */}
      {/* ══════════════════════════════════════════ */}
      <section className="w-full mt-10 md:mt-16 flex flex-col md:flex-row bg-[#f7f7f7]">
        <div className="w-full md:w-1/2 min-h-[300px] md:min-h-[440px] relative overflow-hidden">
          <img
            src="/images/Cut Size Samples.jpg"
            alt="Curated Tile Samples"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start px-8 py-14 md:px-16 lg:px-24">
          <h2 className="text-[28px] md:text-[36px] font-normal text-gray-900 mb-4 tracking-tight">
            GET 5 SAMPLES FOR $5
          </h2>
          <p className="text-gray-700 text-[14px] md:text-[15px] mb-8 max-w-[420px] leading-relaxed">
            Visualize it in your space with samples. You can pick your own or order a curated bundle.
          </p>
          <button
            onClick={() => {
              navigate('/Shop By Sample');
              window.scrollTo(0, 0);
            }}
            className="border border-gray-900 text-gray-900 bg-transparent px-8 py-3 text-xs md:text-[13px] font-bold tracking-widest hover:bg-gray-900 hover:text-white transition-colors duration-300 uppercase"
          >
            ORDER SAMPLES
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* INFO FOOTER SECTION                       */}
      {/* ══════════════════════════════════════════ */}
      <section className="w-full bg-white py-16 px-6 md:px-12 lg:px-20 mt-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Trade Program */}
          <div className="flex flex-col items-start md:items-start text-left">
            <div className="flex items-center gap-2 mb-3">
              <HiOutlineUserGroup className="text-2xl text-gray-800" />
              <h2 className="text-sl tracking-widest text-gray-900 uppercase">PROFESSIONAL PROGRAM</h2>
            </div>
            <p className="text-gray-500 text-[13px] leading-relaxed">
              <Link to="/login" className="underline hover:text-gray-900">Sign in</Link> to your trade account or <Link to="/apply" className="underline hover:text-gray-900">apply today</Link> for tailored pricing, unlimited samples, and more.
            </p>
          </div>

          {/* Expert Design Services */}
          <div className="flex flex-col items-start md:items-start text-left">
            <div className="flex items-center gap-2 mb-3">
              <HiOutlineRefresh className="text-2xl text-gray-800" />
              <h2 className="text-sl tracking-widest text-gray-900 uppercase">365 DAY RETURNS</h2>
            </div>
            <p className="text-gray-500 text-[13px] leading-relaxed">
              Our Design Consultants help bring your project to life. And it's all complimentary.
            </p>
          </div>

          {/* Get Inspired */}
          <div className="flex flex-col items-start md:items-start text-left">
            <div className="flex items-center gap-2 mb-3">
              <HiOutlineCube className="text-2xl text-gray-800" />
              <h2 className="text-sl tracking-widest text-gray-900 uppercase">PALLET PACKAGING</h2>
            </div>
            <p className="text-gray-500 text-[13px] leading-relaxed">
              Browse <Link to="/lookbook" className="underline hover:text-gray-900">The Lookbook</Link> and see how customers are styling our products in real life.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-start text-left">
            <div className="flex items-center gap-2 mb-3">
              <HiOutlineShieldCheck className="text-2xl text-gray-800" />
              <h2 className="text-sl tracking-widest text-gray-900 uppercase">Warranty Card</h2>
            </div>
            <p className="text-gray-500 text-[13px] leading-relaxed">
              Browse <Link to="/lookbook" className="underline hover:text-gray-900">The Lookbook</Link> and see how customers are styling our products in real life.
            </p>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* LUXURY INTERIORS SHOWCASE (ALTERNATING)    */}
      {/* ══════════════════════════════════════════ */}
      <section className="w-full flex flex-col gap-[12px] bg-white">

        {/* Showcase Block 1: Bathroom Sets */}
        <div className="flex flex-col md:flex-row group overflow-hidden bg-[#002642]">
          {/* Description */}
          <div className="w-full md:w-[40%] flex flex-col justify-center items-start pl-12 pr-6 py-16 md:pl-20 md:pr-10 lg:pl-28 lg:pr-14 xl:pl-36 xl:pr-18 bg-[#002642]">
            <h2 className="text-white tracking-wide mb-6 leading-tight uppercase font-normal" style={{ fontFamily: 'adobe-caslon-w01-smbd, serif', fontSize: '26px' }}>
              THE CONNOISSEUR'S COLLECTION
            </h2>
            <p className="text-gray-300 text-[14px] md:text-[15px] mb-10 max-w-[440px] leading-relaxed">

              Hand picked collections for sophisticated lifestyle. We are constantly searching for the latest in luxury, to surprise and delight you. Exclusively for you we have created unique collections of luxury lifestyle for the most prestigious addresses in the world. Choose your mood and explore our Connoisseur's collection.
            </p>
            <button
              onClick={() => {
                setActiveCategory("BATHROOM");
                document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="border border-white text-white bg-transparent px-8 py-3 text-xs md:text-[13px] font-bold tracking-widest hover:bg-white hover:text-black transition-colors duration-300 uppercase"
            >
              SHOP THE CONNOISSEUR'S COLLECTION
            </button>
          </div>
          {/* Image (Framed Gallery Style) */}
          <div className="w-full md:w-[60%] min-h-[350px] md:min-h-[500px] lg:min-h-[500px] p-6 md:p-10 lg:p-14 bg-[#002642] flex items-center justify-center">
            <div className="w-full h-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <img
                src="/fwdimagesforsite 1/Laverton.jpg?w=1200&q=80"
                alt="Bathroom Sets"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Showcase Block 2: Kitchen Collections */}
        <div className="flex flex-col-reverse md:flex-row group overflow-hidden bg-white">
          {/* Image (Framed Gallery Style) */}
          <div className="w-full md:w-[60%] min-h-[350px] md:min-h-[500px] lg:min-h-[500px] p-6 md:p-10 lg:p-14 bg-white flex items-center justify-center">
            <div className="w-full h-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
              <img
                src="/fwdimagesforsite 1/Rift Camel Carpet.jpg?w=1200&q=80"
                alt="Page Legna Tan"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
              />
            </div>
          </div>
          {/* Description */}
          <div className="w-full md:w-[40%] flex flex-col justify-center items-start pl-6 pr-12 py-16 md:pl-10 md:pr-20 lg:pl-14 lg:pr-28 xl:pl-18 xl:pr-36 bg-white">
            <h2 className="text-[#002642] tracking-wide mb-6 leading-tight uppercase font-normal" style={{ fontFamily: 'adobe-caslon-w01-smbd, serif', fontSize: '26px' }}>
              THE BESPOKE SURFACES
            </h2>
            <p className="text-slate-600 text-[14px] md:text-[15px] mb-10 max-w-[440px] leading-relaxed">
              LUXURIOUS. TIMELESS. BESPOKE. Our surfaces are part of your decor. Finishings to personalise and stylise your walls and floorings. MAKE A STATEMENT .Start transforming your spaces with us.
            </p>
            <button
              onClick={() => {
                setActiveCategory("KITCHEN");
                document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="border border-[#002642] text-[#002642] bg-transparent px-8 py-3 text-xs md:text-[13px] font-bold tracking-widest hover:bg-[#002642] hover:text-white transition-colors duration-300 uppercase"
            >
              SHOP THE BESPOKE SURFACES
            </button>
          </div>
        </div>

        {/* Showcase Block 3: Living Spaces */}
        <div className="flex flex-col md:flex-row group overflow-hidden bg-[#002642]">
          {/* Description */}
          <div className="w-full md:w-[40%] flex flex-col justify-center items-start pl-12 pr-6 py-16 md:pl-20 md:pr-10 lg:pl-28 lg:pr-14 xl:pl-36 xl:pr-18 bg-[#002642]">
            <h2 className="text-white tracking-wide mb-6 leading-tight uppercase font-normal" style={{ fontFamily: 'adobe-caslon-w01-smbd, serif', fontSize: '26px' }}>
              THE PARQUETS
            </h2>
            <p className="text-gray-300 text-[14px] md:text-[15px] mb-10 max-w-[440px] leading-relaxed">
              Ceragres Luxe Parquet surfaces are made for a sustainable, future-oriented everyday life. Here you can unleash your imagination, thanks to its aesthetic configurations. Our parquets are as simple as walking on art.
            </p>
            <button
              onClick={() => {
                setActiveCategory("LIVING Spaces");
                document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="border border-white text-white bg-transparent px-8 py-3 text-xs md:text-[13px] font-bold tracking-widest hover:bg-white hover:text-black transition-colors duration-300 uppercase"
            >
              SHOP THE PARQUETS
            </button>
          </div>
          {/* Image (Framed Gallery Style) */}
          <div className="w-full md:w-[60%] min-h-[350px] md:min-h-[500px] lg:min-h-[500px] p-6 md:p-10 lg:p-14 bg-[#002642] flex items-center justify-center">
            <div className="w-full h-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <img
                src="/fwdimagesforsite 1/Channel.jpg?w=1200&q=80"
                alt="gatsby"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
              />
            </div>
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════ */}
      {/* CINEMATIC EXPERIENTIAL SPACE (VIDEO-LIKE)  */}
      {/* ══════════════════════════════════════════ */}
      <section className="relative w-full h-[400px] md:h-[550px] lg:h-[650px] overflow-hidden flex items-center justify-center text-center">
        {/* Style block for distinct smooth cinematic Ken Burns transitions */}
        <style>{`
          @keyframes kb-in-left {
            0% { transform: scale(1.02) translate(0, 0); }
            100% { transform: scale(1.10) translate(-2.5%, -1%); }
          }
          @keyframes kb-in-right {
            0% { transform: scale(1.02) translate(0, 0); }
            100% { transform: scale(1.10) translate(2.5%, -0.5%); }
          }
          @keyframes kb-out-left {
            0% { transform: scale(1.10) translate(-1.5%, -1%); }
            100% { transform: scale(1.02) translate(1.5%, 0.5%); }
          }
          @keyframes kb-out-right {
            0% { transform: scale(1.10) translate(1.5%, 0.5%); }
            100% { transform: scale(1.02) translate(-1.5%, -0.5%); }
          }
          .animate-kb-in-left {
            animation: kb-in-left 18s ease-in-out infinite alternate;
          }
          .animate-kb-in-right {
            animation: kb-in-right 18s ease-in-out infinite alternate;
          }
          .animate-kb-out-left {
            animation: kb-out-left 18s ease-in-out infinite alternate;
          }
          .animate-kb-out-right {
            animation: kb-out-right 18s ease-in-out infinite alternate;
          }
        `}</style>

        {/* 4 Alternating Ken Burns Images with distinct camera movements */}
        {[
          "/fwdimagesforsite 1/spruzzo oro.jpg?w=1600&q=80",
          "/fwdimagesforsite 1/specchio oro.jpg?w=1600&q=80",
          "/fwdimagesforsite 1/specchio-oro.jpg?w=1600&q=80",
          "/fwdimagesforsite 1/specchio_oro.jpg?w=1600&q=80"
        ].map((src, index) => {
          const animationClasses = [
            "animate-kb-in-left",
            "animate-kb-in-right",
            "animate-kb-out-left",
            "animate-kb-out-right"
          ];
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
                storyIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={src}
                alt={`Cinematic Space Showcase ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
                className={`w-full h-full object-cover ${
                  storyIndex === index ? animationClasses[index] : ""
                }`}
              />
            </div>
          );
        })}

        {/* Premium Dark Radial Overlay to pop the typography */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/45 to-black/60 z-20" />

        {/* Centered Typography Overlay */}
        <div className="relative z-30 flex flex-col items-center justify-center px-6 w-full max-w-[1100px] text-white text-center mx-auto">
          <h2 
            className="mb-3 uppercase font-normal flex flex-col items-center text-center"
            style={{ fontFamily: 'adobe-caslon-w01-smbd, serif', color: '#FCC201', fontSize: '26px' }}
          >
            <span className="block leading-none">THE</span> 
            <span className="block leading-none -mt-1">PRECIOUS METAL</span>
          </h2>
          <p 
            className="text-gray-300 text-sm md:text-base mb-6 max-w-[850px] text-center antialiased"
            style={{ fontWeight: '300', lineHeight: '1.4' }}
          >
            Precious Metal product line is only meant for the most ambitious projects. Each piece of precious metal series of porcelain stoneware from Ceragres Luxe, comes from a surface treatment, exclusive and avant-garde, that makes each of them something very special. A novelty in gold and platinum to decorate the most elite environments. It's a new aesthetic language in porcelain stoneware that emulates the natural stone, rendering a clear tribute to metal.
          </p>
          <button
            onClick={() => {
              navigate('/lookbook');
              window.scrollTo(0, 0);
            }}
            className="text-white hover:text-gray-300 font-bold tracking-widest text-xs md:text-sm uppercase underline underline-offset-8 decoration-1 transition-colors duration-300 bg-transparent border-none cursor-pointer text-center"
          >
            SHOP THE PRECIOUS METAL
          </button>
        </div>
      </section>

    </div>
  );
}
