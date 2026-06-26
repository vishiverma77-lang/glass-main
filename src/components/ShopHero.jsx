import React from 'react';

const ShopHero = ({ title, description, imageSrc }) => {
  return (
    <div className="relative w-full h-[650px] overflow-hidden mb-0">
      <img
        src={imageSrc || "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1400&auto=format&fit=crop"}
        alt={typeof title === 'string' ? title : "Hero Background"}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-6 py-12">
        <div className="max-w-4xl mx-auto translate-y-12 md:translate-y-16">
          <h1 className="text-xl md:text-3xl font-light text-white tracking-tight leading-tight mb-3 uppercase drop-shadow-2xl">
            {title}
          </h1>
          <div className="w-16 h-1 bg-white/80 mx-auto mb-4 transition-all duration-1000"></div>
          <p className="text-white text-sm md:text-base lg:text-lg leading-relaxed max-w-[80%] mx-auto drop-shadow-lg font-light">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopHero;
