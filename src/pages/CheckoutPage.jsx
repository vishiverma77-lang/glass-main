import { getImageUrl } from "../utils/imageUtils";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import { HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlineTruck, HiOutlineCreditCard, HiOutlineCash } from "react-icons/hi";

const CheckoutPage = () => {
    const { cart, cartCount, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
        paymentMethod: "COD"
    });

    const subtotal = cart.reduce((acc, item) => {
        const price = Number(item.price || item.piecesPerBox) || 0;
        const qty = Number(item.quantity) || 0;
        return acc + (price * qty);
    }, 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "phone") {
            // Only allow digits, max 10 characters
            const cleanValue = value.replace(/\D/g, "").slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: cleanValue }));
        } else if (name === "pincode") {
            // Only allow digits, max 6 characters
            const cleanValue = value.replace(/\D/g, "").slice(0, 6);
            setFormData(prev => ({ ...prev, [name]: cleanValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validations
        if (!formData.fullName.trim()) {
            alert("Please enter your full name.");
            return;
        }
        if (formData.phone.length !== 10) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }
        if (!formData.address.trim()) {
            alert("Please enter your delivery address.");
            return;
        }
        if (formData.pincode.length !== 6) {
            alert("Please enter a valid 6-digit pincode.");
            return;
        }

        const orderData = {
            customer: formData,
            items: cart.map(item => ({
                productId: item._id,
                name: item.name,
                selectedSize: item.selectedSize,
                selectedColor: item.selectedColor,
                quantity: item.quantity,
                pricePerBox: item.price !== undefined ? item.price : item.piecesPerBox,
                isSample: item.isSample || false
            })),
            totalAmount: subtotal,
            paymentMethod: formData.paymentMethod,
            // Link order to logged-in user if available
            ...(user && { userId: user._id || user.id })
        };

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, orderData);
            setOrderPlaced(true);
            clearCart();
        } catch (err) {
            console.error("Error placing order:", err);
            alert("Failed to place order. Please try again.");
        }
    };


    if (orderPlaced) {
        return (
            <div className="max-w-[800px] mx-auto px-4 py-20 text-center animate-in fade-in zoom-in duration-500">
                <div className="mb-8 flex justify-center">
                    <div className="bg-green-50 p-10 rounded-none border-4 border-green-100 shadow-xl shadow-green-100/50">
                        <HiOutlineCheckCircle className="text-8xl text-green-500" />
                    </div>
                </div>
                <h1 className="text-4xl font-black text-gray-900 mb-4 uppercase tracking-tighter italic">Order Placed Successfully!</h1>
                <p className="text-gray-500 text-lg mb-10 italic max-w-md mx-auto">
                    Thank you for choosing premium tiles. Your order has been received and is being processed for delivery.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="bg-gray-900 text-white font-black px-10 py-4 rounded-none hover:bg-blue-600 transition-all shadow-2xl uppercase tracking-[0.2em] text-xs"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="max-w-[1250px] mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter italic">Checkout requires items</h2>
                <button onClick={() => navigate("/")} className="text-blue-600 font-black hover:underline uppercase tracking-widest text-xs italic">Back to Home</button>
            </div>
        );
    }

    return (
        <div className="max-w-[1250px] mx-auto px-4 py-10 min-h-screen">
            <div className="mb-10">
                <button
                    onClick={() => navigate("/cart")}
                    className="flex items-center gap-2 text-gray-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-[.2em] transition-all"
                >
                    <HiOutlineArrowLeft /> Back to Cart
                </button>
                <h1 className="text-4xl font-black text-gray-900 mt-4 uppercase tracking-tighter italic">Checkout</h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-16">
                {/* Form Section */}
                <div className="lg:w-2/3">
                    <form onSubmit={handleSubmit} id="checkout-form">
                        <div className="space-y-10">
                            {/* Shipping Information */}
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-gray-900 text-white flex items-center justify-center font-black rounded-none">1</div>
                                    <h2 className="text-xl font-black tracking-widest uppercase italic">Shipping Details</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 italic">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            required
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-100 px-5 py-4 focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-gray-900"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 italic">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-100 px-5 py-4 focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-gray-900"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 italic">Address</label>
                                        <textarea
                                            name="address"
                                            required
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full bg-gray-50 border border-gray-100 px-5 py-4 focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-gray-900"
                                            placeholder="Enter your full delivery address"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 italic">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-100 px-5 py-4 focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-gray-900"
                                            placeholder="Enter city"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 italic">Pincode</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            required
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-100 px-5 py-4 focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-gray-900"
                                            placeholder="6-digit pincode"
                                        />
                                    </div>
                                </div>
                            </section>

                            <div className="h-px bg-gray-100" />

                            {/* Payment Method */}
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-gray-900 text-white flex items-center justify-center font-black rounded-none">2</div>
                                    <h2 className="text-xl font-black tracking-widest uppercase italic">Payment Method</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label
                                        className={`relative flex items-center p-6 border-2 cursor-pointer transition-all hover:scale-[1.01] ${formData.paymentMethod === "COD" ? "border-blue-600 bg-blue-50/10" : "border-gray-100 bg-gray-50"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="COD"
                                            checked={formData.paymentMethod === "COD"}
                                            onChange={handleInputChange}
                                            className="hidden"
                                        />
                                        <div className="flex items-center gap-4">
                                            <div className={`w-6 h-6 rounded-none border-2 flex items-center justify-center transition-all ${formData.paymentMethod === "COD" ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}>
                                                {formData.paymentMethod === "COD" && <div className="w-2 h-2 bg-white" />}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 uppercase tracking-widest text-xs flex items-center gap-2 italic">
                                                    <HiOutlineCash /> Cash on Delivery
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 italic">Pay when you receive</p>
                                            </div>
                                        </div>
                                    </label>

                                    <label
                                        className={`relative flex items-center p-6 border-2 cursor-pointer transition-all hover:scale-[1.01] opacity-50 ${formData.paymentMethod === "ONLINE" ? "border-blue-600 bg-blue-50/10" : "border-gray-100 bg-gray-50"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="ONLINE"
                                            disabled
                                            className="hidden"
                                        />
                                        <div className="flex items-center gap-4">
                                            <div className="w-6 h-6 rounded-none border-2 border-gray-200" />
                                            <div>
                                                <p className="font-black text-gray-400 uppercase tracking-widest text-xs flex items-center gap-2 italic">
                                                    <HiOutlineCreditCard /> Online Payment
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 italic">Coming Soon</p>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </section>
                        </div>
                    </form>
                </div>

                {/* Sidebar Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-white border rounded-none p-10 sticky top-0 md:top-[60px] shadow-2xl">
                        <h2 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-widest italic border-b border-gray-100 pb-4">Order Summary</h2>

                        <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map((item, i) => (
                                <div key={i} className="flex gap-4 border-b border-gray-800/50 pb-4 last:border-0 last:pb-0">
                                    <div className="w-12 h-12 rounded-none overflow-hidden bg-gray-800 shrink-0">
                                        <img
                                            src={item.images && item.images[0] ? (item.images[0].startsWith('http') ? item.images[0] : getImageUrl(item.images?.[0])) : "/logo.jpg"}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = "/logo.jpg"; }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight line-clamp-1 italic italic">
                                                {item.name} {item.isSample && <span className="text-blue-500 font-black text-[8px]">(SAMPLE)</span>}
                                            </p>
                                            <p className="text-[11px] font-black text-gray-900 italic shrink-0">
                                                {item.isSample ? "FREE" : `₹${((Number(item.price || item.piecesPerBox) || 0) * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic">
                                                Qty: {item.quantity} {item.isSample ? (item.quantity === 1 ? 'Sample' : 'Samples') : (item.quantity === 1 ? 'Box' : 'Boxes')}
                                            </p>
                                            {!item.isSample && (
                                                <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest italic">₹{(Number(item.price || item.piecesPerBox) || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}/box</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-50 -mx-10 px-10 py-8 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-gray-500 font-black uppercase tracking-[.2em]">Subtotal</span>
                                <span className="text-xl font-black text-gray-900 italic tracking-tighter italic">₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-gray-500 font-black uppercase tracking-[.2em]">Shipping</span>
                                <span className="text-[10px] font-black text-green-500 uppercase italic">Free</span>
                            </div>
                            <div className="h-px bg-gray-200" />
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-[11px] text-gray-900 font-black uppercase tracking-[.3em] block">Total</span>
                                    <span className="text-[8px] text-gray-400 font-bold uppercase italic tracking-widest italic">Inclusive of all taxes</span>
                                </div>
                                <span className="text-4xl font-black text-blue-600 tracking-tighter italic">₹{subtotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            className="w-full bg-blue-600 text-white font-black py-5 rounded-none mt-8 hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl uppercase tracking-[.2em] text-[11px]"
                        >
                            Place Order (COD) ✨
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2 opacity-30">
                            <HiOutlineTruck className="text-xl" />
                            <p className="text-[8px] font-black uppercase tracking-[.5em]">Express Delivery</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
