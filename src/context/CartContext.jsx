import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("tile_cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist = localStorage.getItem("tile_wishlist");
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });

    useEffect(() => {
        localStorage.setItem("tile_cart", JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem("tile_wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    const toggleWishlist = (product) => {
        setWishlist((prevWishlist) => {
            const exists = prevWishlist.find(item => item._id === product._id);
            if (exists) {
                return prevWishlist.filter(item => item._id !== product._id);
            } else {
                return [...prevWishlist, product];
            }
        });
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item._id === productId);
    };

    const wishlistCount = wishlist.length;

    const addToCart = (product, quantity = 1, selectedSize = null, selectedColor = null, isSample = false) => {
        const sizeToUse = selectedSize || (product.sizes?.length > 0 ? product.sizes[0] : (product.size || "Standard"));
        const colorToUse = selectedColor || (product.colors?.length > 0 ? product.colors[0] : null);

        setCart((prevCart) => {
            // Unique key is ID + Size + Color + isSample
            const existingItem = prevCart.find(
                (item) => item._id === product._id &&
                    item.selectedSize === sizeToUse &&
                    item.selectedColor === colorToUse &&
                    item.isSample === isSample
            );

            if (existingItem) {
                return prevCart.map((item) => {
                    if (item._id === product._id && item.selectedSize === sizeToUse && item.selectedColor === colorToUse && item.isSample === isSample) {
                        const newQuantity = item.quantity + quantity;
                        return { ...item, quantity: isSample ? Math.min(newQuantity, 2) : newQuantity };
                    }
                    return item;
                });
            }

            const initialQuantity = isSample ? Math.min(quantity, 2) : quantity;
            return [...prevCart, { ...product, quantity: initialQuantity, selectedSize: sizeToUse, selectedColor: colorToUse, isSample }];
        });
    };

    const updateQuantity = (productId, selectedSize, selectedColor, isSample, newQuantity) => {
        if (newQuantity < 1) return;
        const clampedQuantity = isSample ? Math.min(newQuantity, 2) : newQuantity;
        setCart((prevCart) =>
            prevCart.map((item) =>
                item._id === productId &&
                    item.selectedSize === selectedSize &&
                    item.selectedColor === selectedColor &&
                    item.isSample === isSample
                    ? { ...item, quantity: clampedQuantity }
                    : item
            )
        );
    };

    const removeFromCart = (productId, selectedSize, selectedColor, isSample) => {
        setCart((prevCart) =>
            prevCart.filter((item) => !(
                item._id === productId &&
                item.selectedSize === selectedSize &&
                item.selectedColor === selectedColor &&
                item.isSample === isSample
            ))
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    const [isCartOpen, setIsCartOpen] = useState(false);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const openWishlist = () => setIsWishlistOpen(true);
    const closeWishlist = () => setIsWishlistOpen(false);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            cartCount,
            isCartOpen,
            openCart,
            closeCart,
            // Wishlist
            wishlist,
            toggleWishlist,
            isInWishlist,
            wishlistCount,
            isWishlistOpen,
            openWishlist,
            closeWishlist
        }}>
            {children}
        </CartContext.Provider>
    );
};
