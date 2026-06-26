import { getImageUrl } from "../utils/imageUtils";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { HiOutlineTrash, HiOutlineArrowLeft, HiOutlineShoppingBag, HiPlus, HiMinus } from "react-icons/hi";

function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartCount, clearCart } = useCart();
    const navigate = useNavigate();

    const subtotal = cart.reduce((acc, item) => {
        const price = Number(item.price || item.piecesPerBox) || 0;
        const qty = Number(item.quantity) || 0;
        return acc + (price * qty);
    }, 0);


    if (cart.length === 0) {
        return (
            <div className="max-w-[1250px] mx-auto px-4 py-20 text-center">
                <div className="mb-6 flex justify-center">
                    <div className="bg-gray-100 p-8 rounded-none">
                        <HiOutlineShoppingBag className="text-6xl text-gray-300" />
                    </div>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter italic">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 italic">Looks like you haven't added any premium tiles to your cart yet.</p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-black text-white font-black px-8 py-3 rounded-none transition-all shadow-lg uppercase tracking-widest text-xs"
                >
                    <HiOutlineArrowLeft /> Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1250px] mx-auto px-4 py-10 min-h-screen font-sans">
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 uppercase tracking-tighter italic">
                    Shopping Cart
                    <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-3 py-1 rounded-none uppercase tracking-widest">
                        {cartCount} Items
                    </span>
                </h1>
                <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-600 font-bold text-[10px] uppercase tracking-[0.2em] transition-colors flex items-center gap-1"
                >
                    <HiOutlineTrash /> Clear All
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Cart Items List */}
                <div className="lg:w-2/3 space-y-4">
                    {cart.map((item) => (
                        <div key={`${item._id}-${item.selectedSize}-${item.selectedColor}-${item.isSample}`} className="bg-white border border-gray-100 rounded-none p-5 flex gap-6 shadow-sm hover:shadow-md transition-all group">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-none overflow-hidden bg-gray-50 shrink-0 relative border border-gray-50">
                                <img
                                    src={getImageUrl(item.images?.[0])}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
                                />
                                {item.isSample && (
                                    <div className="absolute top-0 left-0 bg-blue-600 text-white text-[8px] font-black uppercase px-2 py-1 tracking-widest italic shadow-lg">
                                        Sample
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-black text-gray-900 sm:text-lg group-hover:text-blue-600 transition-colors uppercase tracking-tight line-clamp-1 italic">
                                            {item.name} {item.isSample && <span className="text-blue-600 font-black tracking-widest">(SAMPLE)</span>}
                                        </h3>
                                        <button
                                            onClick={() => removeFromCart(item._id, item.selectedSize, item.selectedColor, item.isSample)}
                                            className="text-gray-200 hover:text-red-500 transition-colors p-1"
                                        >
                                            <HiOutlineTrash className="text-xl" />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                        <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-none border border-gray-200">
                                            <span className="text-[9px] text-gray-400 uppercase tracking-widest font-black">Size</span>
                                            <span className="text-[11px] font-black text-gray-700 uppercase">{item.selectedSize}</span>
                                        </div>
                                        {item.selectedColor && (
                                            <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-none border border-gray-200">
                                                <div
                                                    className="w-2.5 h-2.5 rounded-none border border-black/10"
                                                    style={{ backgroundColor: item.selectedColor.toLowerCase() }}
                                                />
                                                <span className="text-[9px] text-gray-400 uppercase tracking-widest font-black">Color</span>
                                                <span className="text-[11px] font-black text-gray-700 uppercase">{item.selectedColor}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-end mt-4">
                                    {/* Quantity Adjustment */}
                                    <div className="flex items-center bg-gray-100 rounded-none p-1 gap-3 border border-gray-200">
                                        <button
                                            onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor, item.isSample, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center bg-white rounded-none shadow-sm hover:text-blue-600 transition-all font-bold disabled:opacity-50"
                                            disabled={item.quantity <= 1}
                                        >
                                            <HiMinus className="text-sm" />
                                        </button>
                                        <span className="text-sm font-black w-24 text-center text-gray-900">
                                            {item.quantity} {item.isSample ? (item.quantity === 1 ? 'Sample' : 'Samples') : (item.quantity === 1 ? 'Box' : 'Boxes')}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.selectedSize, item.selectedColor, item.isSample, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center bg-white rounded-none shadow-sm hover:text-blue-600 transition-all font-bold disabled:opacity-50"
                                            disabled={item.isSample && item.quantity >= 2}
                                        >
                                            <HiPlus className="text-sm" />
                                        </button>
                                    </div>

                                    {!item.isSample ? (
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-gray-900 tracking-tighter italic">
                                                ₹{((Number(item.price || item.piecesPerBox) || 0) * (Number(item.quantity) || 0)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                            </div>
                                            <div className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">
                                                ₹{(Number(item.price || item.piecesPerBox) || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} / Box
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-green-600 tracking-tighter italic uppercase">FREE</div>
                                            <div className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">Sample Request</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="pt-6">
                        <button
                            onClick={() => navigate("/")}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-8 py-4 rounded-none font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all border border-gray-200"
                        >
                            <HiOutlineArrowLeft /> Add More Premium Tiles
                        </button>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-gray-900 rounded-none p-10 text-white sticky top-0 md:top-[60px] shadow-2xl border border-gray-800 flex flex-col gap-8">
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter uppercase italic mb-1">Cart Summary</h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Review your premium selection</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Subtotal</span>
                                <span className="text-xl font-black tracking-tight italic">₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Standard Shipping</span>
                                <span className="text-sm font-black text-green-500 uppercase tracking-widest italic bg-green-500/10 px-3 py-1 rounded-none">FREE</span>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent my-2" />

                            <div className="flex justify-between items-end">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">Grand Total</span>
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter italic leading-none mt-1">Inclusive of GST</span>
                                </div>
                                <span className="text-4xl font-black text-blue-600 tracking-tighter italic">₹{subtotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            className="w-full bg-blue-600 hover:bg-black text-white font-black py-5 rounded-none transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl uppercase tracking-[0.2em] text-[11px]"
                            onClick={() => navigate("/checkout")}
                        >
                            Confirm Order 🔒
                        </button>


                        <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-800/50 opacity-30">
                            <div className="h-1 w-6 bg-blue-600 rounded-none" />
                            <p className="text-[8px] font-black uppercase tracking-[0.3em]">
                                Verified & Secured
                            </p>
                            <div className="h-1 w-6 bg-blue-600 rounded-none" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
