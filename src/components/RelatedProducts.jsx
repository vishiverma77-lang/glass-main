import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import axios from "axios";
import { getImageUrl } from "../utils/imageUtils";

const RelatedProducts = ({ category, currentProductId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            if (!currentProductId) return;
            setLoading(true);
            try {
                // Try to fetch products. Use the local backend.
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
                
                // Handle different response formats (array, .products, .data)
                let allProducts = [];
                if (Array.isArray(res.data)) {
                    allProducts = res.data;
                } else if (res.data && Array.isArray(res.data.products)) {
                    allProducts = res.data.products;
                } else if (res.data && Array.isArray(res.data.data)) {
                    allProducts = res.data.data;
                }
                
                // Filter by category (case-insensitive) and exclude current product
                let related = allProducts.filter(
                    (p) => {
                        if (String(p._id) === String(currentProductId)) return false;
                        
                        const pCat = String(p.category || "").trim().toLowerCase();
                        const targetCat = String(category || "").trim().toLowerCase();
                        
                        return pCat === targetCat && targetCat !== "";
                    }
                );

                // Fallback: If no related products found in same category, show some other products
                if (related.length === 0) {
                    related = allProducts
                        .filter(p => String(p._id) !== String(currentProductId))
                        .slice(0, 8);
                }
                
                setProducts(related.slice(0, 12)); // Max 12 products
            } catch (err) {
                console.error("Error fetching related products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedProducts();
    }, [category, currentProductId]);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const scrollTo = direction === "left" 
                ? scrollLeft - clientWidth / 2 
                : scrollLeft + clientWidth / 2;
            
            scrollContainerRef.current.scrollTo({
                left: scrollTo,
                behavior: "smooth"
            });
        }
    };

    if (loading) return (
        <div className="py-12 text-center text-gray-400 italic">Finding related selections...</div>
    );
    
    if (products.length === 0) return null;

    return (
        <section className="py-16 bg-white border-t border-gray-100">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                            Customers Also Viewed
                        </h2>
                        <div className="h-0.5 w-12 bg-blue-600 mt-2" />
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => scroll("left")}
                            className="w-10 h-10 flex items-center justify-center border border-gray-200 hover:border-gray-900 transition-all rounded-full group"
                        >
                            <HiChevronLeft className="text-xl text-gray-400 group-hover:text-gray-900" />
                        </button>
                        <button 
                            onClick={() => scroll("right")}
                            className="w-10 h-10 flex items-center justify-center border border-gray-200 hover:border-gray-900 transition-all rounded-full group"
                        >
                            <HiChevronRight className="text-xl text-gray-400 group-hover:text-gray-900" />
                        </button>
                    </div>
                </div>

                <div 
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}
                >
                    {products.map((product) => {
                        const secondImage = product.images && product.images.length > 1 ? getImageUrl(product.images[1]) : null;
                        return (
                            <div 
                                key={product._id}
                                className="w-[280px] md:w-[320px] flex-shrink-0 snap-start group flex flex-col h-full rounded-none"
                            >
                                <Link to={`/product/${product._id}`} className="block mb-4" onClick={() => window.scrollTo(0, 0)}>
                                    <div className="aspect-square bg-gray-50 overflow-hidden relative mb-4 rounded-none">
                                        <img 
                                            src={getImageUrl(product.images?.[0])} 
                                            alt={product.name}
                                            className={`w-full h-full object-cover rounded-none transition-opacity duration-500 ease-in-out ${
                                                secondImage ? "group-hover:opacity-0" : ""
                                            }`}
                                            onError={(e) => { e.target.src = "/logo.jpg"; }}
                                        />
                                        {secondImage && (
                                            <img 
                                                src={secondImage} 
                                                alt={`${product.name} - Alternate View`}
                                                className="absolute inset-0 w-full h-full object-cover rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
                                                onError={(e) => { e.target.src = "/logo.jpg"; }}
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-[13px] font-medium text-gray-900 line-clamp-2 h-10 mb-2 leading-relaxed uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                                        {product.name}
                                    </h3>
                                </Link>
                                
                                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                                    {(!product.price || Number(product.price) === 0) ? (
                                        <div></div>
                                    ) : (
                                        <div className="text-sm font-bold text-gray-900 italic">
                                            ₹{product.price} <span className="text-[10px] text-gray-400 font-normal lowercase tracking-wider ml-1">sq. ft</span>
                                        </div>
                                    )}
                                    <button 
                                        className="px-4 py-2 bg-[#e4e2d9] text-[9px] font-black uppercase tracking-widest text-gray-900 hover:bg-gray-900 hover:text-white transition-all transform active:scale-95 shadow-sm rounded-none"
                                    >
                                        ORDER SAMPLE +
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
};

export default RelatedProducts;
