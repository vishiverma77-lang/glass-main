import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import livingRoomImg from "../assets/images/living_room_premium.png";
import bathroomImg from "../assets/images/bathroom_premium.png";
import kitchenImg from "../assets/images/kitchen_premium.png";

const rooms = [
    {
        name: "Living Room",
        description: "Elegant marble finishes for a grand welcome.",
        image: livingRoomImg,
        link: "/category/LIVING ROOM",
        cols: "md:col-span-2",
    },
    {
        name: "Bathroom",
        description: "Spa-like serenity with anti-skid textures.",
        image: bathroomImg,
        link: "/category/BATHROOM",
        cols: "md:col-span-1",
    },
    {
        name: "Kitchen",
        description: "Modern backsplashes that define your style.",
        image: kitchenImg,
        link: "/category/KITCHEN",
        cols: "md:col-span-1",
    },
];

const ShopByRoom = () => {
    const navigate = useNavigate();

    return (
        <section className="py-20 bg-gray-50 uppercase tracking-tight">
            <div className="max-w-[1250px] mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="max-w-xl">
                        <h2 className="text-4xl font-extrabold text-[#1a1a1a] mb-4">
                            Shop by <span className="text-blue-600">Room</span>
                        </h2>
                        <p className="text-gray-500 font-medium">
                            Discover curated tile collections specifically designed for every corner of your home, combining aesthetics with functionality.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {rooms.map((room, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -10 }}
                            onClick={() => navigate(room.link)}
                            className={`relative group overflow-hidden rounded-none cursor-pointer h-[400px] ${room.cols}`}
                        >
                            <img
                                src={room.image}
                                alt={room.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute bottom-0 left-0 p-8">
                                <h3 className="text-2xl font-bold text-white mb-2">{room.name}</h3>
                                <p className="text-gray-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {room.description}
                                </p>
                                <button className="px-6 py-2 bg-white text-[#1a1a1a] font-bold rounded-none text-xs hover:bg-blue-600 hover:text-white transition-colors uppercase tracking-widest">
                                    Explore
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShopByRoom;
