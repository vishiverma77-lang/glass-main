import React from "react";
import { HiOutlineCheckBadge, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineSparkles } from "react-icons/hi2";

const features = [
    {
        icon: <HiOutlineSparkles className="text-4xl text-blue-600" />,
        title: "Premium Quality",
        description: "Finest grade ceramic and stone sourced for durability and shine."
    },
    {
        icon: <HiOutlineShieldCheck className="text-4xl text-blue-600" />,
        title: "Authentic Design",
        description: "Unique patterns that reflect modern and traditional aesthetics."
    },
    {
        icon: <HiOutlineTruck className="text-4xl text-blue-600" />,
        title: "Express Delivery",
        description: "Specialized logistics to ensure zero-breakage delivery at your doorstep."
    },
    {
        icon: <HiOutlineCheckBadge className="text-4xl text-blue-600" />,
        title: "Expert Guidance",
        description: "Consult with our specialists to find the perfect fit for your space."
    }
];

const BrandTrust = () => {
    return (
        <section className="py-24 bg-[#1a1a1a] text-white">
            <div className="max-w-[1250px] mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold mb-4 uppercase tracking-tighter">
                        Why Choose <span className="text-blue-600">Ceragresluxs?</span>
                    </h2>
                    <div className="w-20 h-1 bg-blue-600 mx-auto rounded-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="mb-6 p-5 bg-white/5 rounded-none transition-all duration-300 group-hover:bg-white/10 group-hover:scale-110">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-[250px]">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandTrust;
