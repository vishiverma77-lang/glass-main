import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import bathroomImg from "../assets/images/bathroom.webp";
import kitchenImg from "../assets/images/kitchen.webp";
import livingroomImg from "../assets/images/livingroom.webp";
import bedroomImg from "../assets/images/bedroom.webp";
import outdoorImg from "../assets/images/outdoor.webp";
import commercialImg from "../assets/images/commercial.webp";

const categories = [
  { name: "BATHROOM", link: "/category/BATHROOM", image: bathroomImg },
  { name: "KITCHEN", link: "/category/KITCHEN", image: kitchenImg },
  { name: "LIVING ROOM", link: "/category/LIVING ROOM", image: livingroomImg },
  { name: "BEDROOM", link: "/category/BEDROOM", image: bedroomImg },
  { name: "OUTDOOR", link: "/category/OUTDOOR", image: outdoorImg },
  { name: "COMMERCIAL SPACES", link: "/category/COMMERCIAL", image: commercialImg },
];

function TilesCategory() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 max-w-[1250px] mx-auto uppercase tracking-tight">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold text-[#1a1a1a] mb-4">
          Browse by <span className="text-blue-600">Category</span>
        </h2>
        <div className="w-16 h-1 bg-blue-600 mx-auto rounded-none mb-6" />
        <p className="text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Exquisite tiles categorized for your convenience. From elegant bathroom marbles to rugged outdoor stones, find the perfect match for your vision.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {categories.map((cat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -8 }}
            className="cursor-pointer group text-center"
            onClick={() => navigate(cat.link)}
          >
            <div className="overflow-hidden rounded-2xl aspect-square mb-4 shadow-sm group-hover:shadow-2xl transition-all duration-500">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <h3 className="text-xs font-black text-[#1a1a1a] tracking-widest group-hover:text-blue-600 transition-colors">
              {cat.name}
            </h3>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default TilesCategory;