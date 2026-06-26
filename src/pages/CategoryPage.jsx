import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import ProductCard from "../components/ProductCard";

function CategoryPage() {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/all`);
                // Filter by category, tags, tileUses, effects, formats, colors, etc.
                const catLower = categoryName.trim().toLowerCase().replace(/-/g, ' ');
                const filtered = res.data.filter(tile => {
                    const matchSub = (str) => {
                      if (!str) return false;
                      const s = str.trim().toLowerCase();
                      return s.includes(catLower) || catLower.includes(s);
                    };
                    const matchArray = (arr) => arr && arr.some(v => matchSub(v));

                    return (
                        matchSub(tile.category) ||
                        matchArray(tile.tileUses) ||
                        matchArray(tile.effects) ||
                        matchArray(tile.formats) ||
                        matchArray(tile.colors) ||
                        matchArray(tile.styles) ||
                        matchArray(tile.materials) ||
                        matchArray(tile.looks) ||
                        matchArray(tile.finishes) ||
                        matchArray(tile.mosaici) ||
                        matchSub(tile.series)
                    );
                });
                setProducts(filtered);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryName]);

    return (
        <div className="max-w-[1250px] mx-auto px-4 py-10 min-h-screen">
            <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                    <h2 className="text-4xl font-black text-gray-900 capitalize tracking-tight">
                        {categoryName.toLowerCase()}
                    </h2>
                    <div className="h-1.5 w-12 bg-blue-600 rounded-none" />
                </div>
                <div className="bg-gray-100 px-4 py-1.5 rounded-none">
                    <span className="text-sm font-bold text-gray-600 tracking-wide">{products.length} Products</span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-none h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {products.map((item) => {
                        const formattedItem = {
                            ...item,
                            id: item._id,
                            image: (item.images && item.images.length > 0) 
                              ? (item.images[0].startsWith('http') ? item.images[0] : `${import.meta.env.VITE_API_BASE_URL}/${item.images[0]}`)
                              : '/products/default.jpg',
                            title: item.name,
                            brand: item.brand || "Premium Collection"
                        };
                        return <ProductCard key={item._id} {...formattedItem} />;
                    })}
                </div>
            ) : (

                <div className="text-center py-20 bg-gray-100 rounded-none border border-dashed border-gray-300">
                    <p className="text-gray-400 text-lg">No products found in this category.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 text-blue-600 font-semibold hover:underline"
                    >
                        Back to Home
                    </button>
                </div>
            )}
        </div>
    );
}

export default CategoryPage;
