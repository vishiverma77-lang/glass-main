import { getImageUrl } from "../utils/imageUtils";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { HiX, HiTrash, HiOutlineChatAlt, HiOutlineLightBulb } from "react-icons/hi";

const CartDrawer = () => {
    const { isCartOpen, closeCart, cart, updateQuantity, removeFromCart, cartCount } = useCart();
    const navigate = useNavigate();

    const subtotal = cart.reduce((acc, item) => {
        const price = Number(item.price) || 0;
        const qty = Number(item.quantity) || 0;
        return acc + (price * qty);
    }, 0);

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={closeCart}
            />

            {/* Sidebar */}
            <div className="relative w-full max-w-[450px] bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 transform translate-x-0">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
                    <h2 className="text-2xl font-light text-gray-900">
                        Cart <span className="text-gray-400">({cartCount} Item{cartCount !== 1 ? 's' : ''})</span>
                    </h2>
                    <button
                        onClick={closeCart}
                        className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <HiX className="text-2xl" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                <HiX className="text-3xl text-gray-200" />
                            </div>
                            <p className="text-gray-500 font-medium italic">Your cart is currently empty.</p>
                            <button
                                onClick={closeCart}
                                className="px-6 py-2 border border-gray-900 text-gray-900 text-xs font-bold uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all"
                            >
                                Shop Collections
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {cart.map((item, index) => (
                                <div key={`${item._id}-${item.selectedSize}-${item.selectedColor}-${item.isSample}`} className="flex gap-4 group">
                                    <div className="w-24 h-24 bg-gray-50 shrink-0 border border-gray-100 overflow-hidden relative">
                                        <img
                                            src={
                                                item.images && item.images[0]
                                                    ? item.images[0].startsWith('http')
                                                        ? item.images[0]
                                                        : getImageUrl(item.images?.[0])
                                                    : "/logo.jpg"
                                            }
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => { e.target.src = "/logo.jpg"; }}
                                        />
                                        {item.isSample && (
                                            <div className="absolute top-0 left-0 bg-blue-600 text-white text-[8px] font-black uppercase px-2 py-1 tracking-widest italic shadow-lg">
                                                Sample
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-sm font-medium text-gray-900 leading-tight uppercase tracking-tight pr-4 italic">
                                                {item.name} {item.isSample && <span className="text-blue-600 font-black">(SAMPLE)</span>}
                                            </h3>
                                            <span className={`text-sm font-bold ${item.isSample ? 'text-green-600' : 'text-gray-900'}`}>
                                                {item.isSample ? "FREE" : `₹${((Number(item.price) || 0) * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 italic">
                                            {item.isSample ? "Sample Request" : `₹${(Number(item.price) || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} / ${(item.pricingUnit || "Box")}`}
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-gray-400 font-bold uppercase">QTY</span>
                                                <select 
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item._id, item.selectedSize, item.selectedColor, item.isSample, parseInt(e.target.value))}
                                                    className="border border-gray-200 text-xs font-bold py-1 px-2 focus:outline-none focus:border-gray-900 cursor-pointer"
                                                >
                                                    {(item.isSample ? [1, 2] : [1,2,3,4,5,6,7,8,9,10]).map(n => (
                                                        <option key={n} value={n}>{n} {item.isSample ? 'Sample' : (item.pricingUnit || "Box")}{n === 1 ? '' : 's'}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <button 
                                                onClick={() => removeFromCart(item._id, item.selectedSize, item.selectedColor, item.isSample)}
                                                className="text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <HiTrash className="text-lg" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Upsell Sections */}
                            <div className="space-y-4 pt-4">
                                <div className="bg-blue-50/50 border-l-2 border-blue-600 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white border border-blue-100 flex items-center justify-center">
                                            <HiOutlineLightBulb className="text-blue-600" />
                                        </div>
                                        <p className="text-xs font-medium text-gray-900">Don't forget grout</p>
                                    </div>
                                    <button className="text-[10px] font-bold uppercase tracking-widest text-blue-600 border-b border-blue-600">
                                        SHOP GROUT
                                    </button>
                                </div>

                                <div className="bg-gray-50 p-6 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <HiOutlineChatAlt className="text-gray-400 text-xl" />
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900">Need an Expert?</h4>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed italic">
                                        We offer Free Design Services. <button className="text-gray-900 border-b border-gray-900 font-semibold ml-1">Learn More</button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 p-6 space-y-4 bg-gray-50/30">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600 uppercase tracking-widest">Subtotal</span>
                        <span className="text-xl font-bold text-gray-900 tracking-tighter italic">₹{subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => { navigate("/cart"); closeCart(); }}
                            className="w-full py-4 border border-gray-900 text-gray-900 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all transform active:scale-95"
                        >
                            View Cart
                        </button>
                        <button
                            onClick={() => { navigate("/checkout"); closeCart(); }}
                            className="w-full py-4 bg-gray-900 text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg transform active:scale-95"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d1d5db;
                }
            `}</style>
        </div>
    );
};

export default CartDrawer;
