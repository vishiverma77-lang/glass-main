import { getImageUrl } from "../utils/imageUtils";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function SearchResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get("q") || "";
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!searchTerm) {
                setProducts([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                // Fetch from the local backend using the unified search query
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products?search=${encodeURIComponent(searchTerm)}`);
                
                // Handle both array and object responses
                const results = Array.isArray(res.data) ? res.data : (res.data.products || []);
                setProducts(results);
            } catch (err) {
                console.error("Error searching products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [searchTerm]);

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-12 min-h-screen">
            {/* Header section with search info */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-gray-100 pb-8">
                <div>
                    <h4 className="text-xs font-black tracking-[0.2em] text-blue-600 uppercase mb-2">Search Results</h4>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                        "{searchTerm}"
                    </h1>
                </div>
                <div className="bg-gray-50 px-6 py-3 border border-gray-100">
                    <span className="text-sm font-bold text-gray-600 tracking-wider">
                        {products.length} {products.length === 1 ? "Product" : "Products"} Found
                    </span>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col justify-center items-center h-[50vh] gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-400 font-medium animate-pulse">Searching premium collections...</p>
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                    {products.map((item) => (
                        <div key={item._id} className="h-full">
                            {/* Mapping backend fields to ProductCard props */}
                            <ProductCard 
                                {...item}
                                id={item._id}
                                image={getImageUrl(item.images?.[0])}
                                title={item.name}
                                brand={item.brand || item.category || "Premium"}
                                rating={5.0}
                                reviews={Math.floor(Math.random() * 50) + 10}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-gray-50 border border-dashed border-gray-200 rounded-lg max-w-2xl mx-auto">
                    <div className="text-5xl mb-6">🔍</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No matches found</h3>
                    <p className="text-gray-500 mb-8 px-8">We couldn't find any products matching your search. Try searching for "Bathroom", "Kitchen", "Marble", or a different term.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-blue-600 text-white font-bold hover:bg-black transition-all shadow-lg"
                    >
                        Back to Home
                    </button>
                </div>
            )}
        </div>
    );
}

export default SearchResults;
