import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { HiX, HiTrash, HiOutlineHeart, HiOutlineShoppingCart } from "react-icons/hi";
import { getImageUrl } from "../utils/imageUtils";

const WishlistDrawer = () => {
    const { isWishlistOpen, closeWishlist, wishlist, toggleWishlist, wishlistCount, addToCart, openCart } = useCart();
    const navigate = useNavigate();

    if (!isWishlistOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={closeWishlist}
            />

            {/* Sidebar */}
            <div className="relative w-full max-w-[450px] bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 transform translate-x-0">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
                    <h2 className="text-2xl font-light text-gray-900">
                        Wishlist <span className="text-gray-400">({wishlistCount} Item{wishlistCount !== 1 ? 's' : ''})</span>
                    </h2>
                    <button
                        onClick={closeWishlist}
                        className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <HiX className="text-2xl" />
                    </button>
                </div>

                {/* Wishlist Items */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
                    {wishlist.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                <HiOutlineHeart className="text-3xl text-gray-200" />
                            </div>
                            <p className="text-gray-500 font-medium italic">Your wishlist is currently empty.</p>
                            <button
                                onClick={closeWishlist}
                                className="px-6 py-2 border border-gray-900 text-gray-900 text-xs font-bold uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all"
                            >
                                Shop Collections
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {wishlist.map((item) => (
                                <div key={item._id} className="flex gap-4 group border-b border-gray-50 pb-4">
                                    {/* Image */}
                                    <div className="w-20 h-20 bg-gray-50 shrink-0 border border-gray-100 overflow-hidden relative">
                                        <img
                                            src={
                                                item.images && item.images[0]
                                                    ? item.images[0].startsWith('http')
                                                        ? item.images[0]
                                                        : getImageUrl(item.images[0])
                                                    : "/logo.jpg"
                                            }
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                                            onClick={() => {
                                                navigate(`/product/${item._id}`);
                                                closeWishlist();
                                            }}
                                            onError={(e) => { e.target.src = "/logo.jpg"; }}
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 
                                                    className="text-sm font-medium text-gray-900 leading-tight uppercase tracking-tight pr-4 cursor-pointer hover:text-blue-600 transition-colors"
                                                    onClick={() => {
                                                        navigate(`/product/${item._id}`);
                                                        closeWishlist();
                                                    }}
                                                >
                                                    {item.name}
                                                </h3>
                                                <button 
                                                    onClick={() => toggleWishlist(item)}
                                                    className="text-gray-300 hover:text-red-500 transition-colors"
                                                    title="Remove from wishlist"
                                                >
                                                    <HiTrash className="text-lg" />
                                                </button>
                                            </div>
                                            {item.price > 0 && (
                                                <div className="text-xs font-bold text-gray-900 mt-1">
                                                    ₹{item.price.toLocaleString()} <span className="text-[9px] text-gray-400 uppercase tracking-widest font-normal">/ {item.pricingUnit || "box"}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Action buttons */}
                                        <div className="flex items-center gap-3 mt-2">
                                            <button
                                                onClick={() => {
                                                    const optColor = item.colors?.[0] || null;
                                                    // Add as standard product
                                                    addToCart(item, 1, null, optColor, false);
                                                    openCart();
                                                    closeWishlist();
                                                }}
                                                className="flex items-center gap-1.5 bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 uppercase hover:bg-blue-600 transition-colors shadow-sm"
                                            >
                                                <HiOutlineShoppingCart className="text-sm" />
                                                Add to Cart
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const optColor = item.colors?.[0] || null;
                                                    // Add as sample
                                                    addToCart(item, 1, null, optColor, true);
                                                    openCart();
                                                    closeWishlist();
                                                }}
                                                className="bg-gray-100 text-gray-800 text-[10px] font-bold px-3 py-1.5 uppercase hover:bg-gray-200 transition-colors border border-gray-200"
                                            >
                                                + Add Sample
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 p-6 bg-gray-50/30">
                    <button
                        onClick={closeWishlist}
                        className="w-full py-3 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-all text-center shadow-lg"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WishlistDrawer;
