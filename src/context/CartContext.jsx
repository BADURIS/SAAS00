import React, { createContext, useContext, useState, useEffect } from 'react';

import { useStore } from './StoreContext';

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    const { products } = useStore(); // Access products for stock validation

    // Load from localStorage if available
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('cart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Cart sync error:', error);
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, observation = '') => {
        // Find current stock
        const currentProduct = products.find(p => p.id === product.id);
        const stock = currentProduct ? currentProduct.stock : 0;

        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                if (existing.quantity >= stock) {
                    alert('Quantidade máxima em estoque atingida!');
                    return prev;
                }
                return prev.map(item => {
                    if (item.id === product.id) {
                        // Append observation if unique
                        let newObs = item.observation || '';
                        if (observation && !newObs.includes(observation)) {
                            newObs = newObs ? `${newObs}; ${observation}` : observation;
                        }
                        return { ...item, quantity: item.quantity + 1, observation: newObs };
                    }
                    return item;
                });
            }
            if (stock < 1) {
                alert('Produto esgotado!');
                return prev;
            }
            return [...prev, { ...product, quantity: 1, observation }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, delta) => {
        // Find current stock
        const currentProduct = products.find(p => p.id === productId);
        const stock = currentProduct ? currentProduct.stock : 0;

        setCartItems(prev => prev.map(item => {
            if (item.id === productId) {
                const newQuantity = item.quantity + delta;
                if (newQuantity > stock) {
                    alert('Quantidade máxima em estoque atingida!');
                    return item;
                }
                return { ...item, quantity: Math.max(1, newQuantity) };
            }
            return item;
        }));
    };

    const clearCart = () => setCartItems([]);

    // Recalculate total ensuring price persistence logic (which works fine as is)
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}
