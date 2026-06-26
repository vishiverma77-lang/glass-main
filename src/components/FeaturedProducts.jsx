import React from "react";
import ProductCard from "./ProductCard";

const featuredProducts = [
    {
        _id: "feat1",
        name: "Statuary White Marble Tile",
        priceSqFt: 185,
        priceBox: 2220,
        size: "24x48 Inch",
        images: ["https://kingstonlavender.com/cdn/shop/files/statuary-white-marble-tile-24x48-polished_1024x1024.jpg?v=1710404455"],
    },
    {
        _id: "feat2",
        name: "Royal Azure Blue Mosaic",
        priceSqFt: 250,
        priceBox: 1500,
        size: "12x12 Inch",
        images: ["https://m.media-amazon.com/images/I/71Y8wIu7IeL._AC_SL1500_.jpg"],
    },
    {
        _id: "feat3",
        name: "Rustic Oak Wood Plank",
        priceSqFt: 145,
        priceBox: 1740,
        size: "8x48 Inch",
        images: ["https://m.media-amazon.com/images/I/81xU+7B0S7L._AC_SL1500_.jpg"],
    },
    {
        _id: "feat4",
        name: "Graphite Slate Stone",
        priceSqFt: 195,
        priceBox: 2340,
        size: "24x24 Inch",
        images: ["https://m.media-amazon.com/images/I/71N1+D9R0yL._AC_SL1500_.jpg"],
    }
];

const FeaturedProducts = () => {
    return (
        <section className="py-20 uppercase tracking-tight">
            <div className="max-w-[1250px] mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <div>
                        <h2 className="text-4xl font-extrabold text-[#1a1a1a] mb-2">
                            Featured <span className="text-blue-600">Collections</span>
                        </h2>
                        <p className="text-gray-500 font-medium">Handpicked premium designs for sophisticated interiors.</p>
                    </div>
                    <button className="mt-6 md:mt-0 px-8 py-3 bg-blue-600 text-white font-bold rounded-none hover:bg-black transition-colors shadow-lg">
                        View All Products
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
