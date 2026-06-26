import React from "react";
import { HiStar } from "react-icons/hi2";

const testimonials = [
    {
        name: "Rajesh Kumar",
        role: "Architect",
        comment: "The quality of marble tiles from Ceragresluxs is exceptional. Their designs transformed my latest project into a luxury masterpiece.",
        rating: 5
    },
    {
        name: "Priya Sharma",
        role: "Interior Designer",
        comment: "Best collection I've seen in years. The texture and finish of their kitchen backsplashes are unmatched in the market.",
        rating: 5
    },
    {
        name: "Amit Singh",
        role: "Home Owner",
        comment: "Smooth delivery and expert guidance. The team helped me choose the perfect bathroom tiles that fit my budget and style.",
        rating: 4
    }
];

const Testimonials = () => {
    return (
        <section className="py-24 bg-gray-50 uppercase tracking-tight">
            <div className="max-w-[1250px] mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-[#1a1a1a] mb-4">
                        Hear from <span className="text-blue-600">Our Clients</span>
                    </h2>
                    <p className="text-gray-500 font-medium">Real stories from our premium tile installations.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, index) => (
                        <div key={index} className="bg-white p-8 rounded-none shadow-sm border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                            <div className="flex gap-1 mb-4">
                                {[...Array(t.rating)].map((_, i) => (
                                    <HiStar key={i} className="text-blue-600 text-xl" />
                                ))}
                            </div>
                            <p className="text-gray-600 italic mb-6 leading-relaxed">"{t.comment}"</p>
                            <div>
                                <h4 className="font-bold text-[#1a1a1a]">{t.name}</h4>
                                <p className="text-sm text-gray-400 uppercase font-semibold">{t.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
