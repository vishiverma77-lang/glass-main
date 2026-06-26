import React from "react";

const Newsletter = () => {
    return (
        <section className="py-20 bg-blue-600">
            <div className="max-w-[1250px] mx-auto px-4 text-center">
                <h2 className="text-4xl font-extrabold text-white mb-4 uppercase tracking-tighter">
                    Stay Updated with <span className="text-[#1a1a1a]">New Collections</span>
                </h2>
                <p className="text-white/90 mb-8 font-medium">Subscribe to receive the latest design trends and exclusive offers.</p>
                <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-6 py-4 rounded-none outline-none focus:ring-2 focus:ring-[#1a1a1a] text-[#1a1a1a] font-medium"
                    />
                    <button className="px-8 py-4 bg-[#1a1a1a] text-white font-bold rounded-none hover:bg-black transition-colors uppercase text-sm tracking-widest shadow-xl">
                        Subscribe
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Newsletter;
