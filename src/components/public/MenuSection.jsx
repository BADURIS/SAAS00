import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../../components/public/ProductCard';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

const CATEGORIES = [
    { id: 'Assados', label: 'Assados' },
    { id: 'Acompanhamentos', label: 'Acompanhamentos' },
    { id: 'Bebidas', label: 'Bebidas' },
    { id: 'Marmita', label: 'Marmita' }
];

export default function MenuSection() {
    const { addToCart } = useCart();
    const { products } = useStore();
    const [activeCategory, setActiveCategory] = useState('Assados');

    // Group products by category
    const groupedProducts = CATEGORIES.reduce((acc, category) => {
        acc[category.id] = products.filter(p => p.category === category.id);
        return acc;
    }, {});

    const scrollToCategory = (categoryId) => {
        const element = document.getElementById(`category-${categoryId}`);
        if (element) {
            const offset = 160; // Increased offset to account for sticky header + spacing
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            // Manual set to avoid jitter from scroll listener
            setActiveCategory(categoryId);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 200; // Offset to trigger change slightly before section hits top

            // Find the category that corresponds to the current scroll position
            for (const category of CATEGORIES) {
                const element = document.getElementById(`category-${category.id}`);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveCategory(category.id);
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="bg-transparent min-h-screen pb-16">
            <div className="container max-w-7xl mx-auto">

                <h2 className="text-center text-4xl md:text-5xl font-serif font-bold pt-12 pb-4 text-white drop-shadow-md">
                    Nosso Cardápio
                </h2>

                {/* Sticky Category Navigation */}
                <div className="sticky top-0 z-[100] bg-surface/85 backdrop-blur-md py-4 border-b border-surface-light mb-8 overflow-x-auto whitespace-nowrap flex justify-start md:justify-center gap-4 px-4 shadow-md no-scrollbar">
                    {CATEGORIES.map(category => (
                        <button
                            key={category.id}
                            onClick={() => scrollToCategory(category.id)}
                            className={`px-6 py-2.5 rounded-full text-base tracking-wide transition-all duration-300 cursor-pointer flex-shrink-0 ${
                                activeCategory === category.id
                                    ? 'bg-brand text-background font-bold shadow-[0_4px_10px_-2px_rgba(230,138,92,0.4)] border-none'
                                    : 'bg-white/5 text-text-muted font-normal border border-white/10 hover:bg-white/10 hover:text-text-primary'
                            }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Product Sections */}
                <div className="px-4 pb-16">
                    {CATEGORIES.map((category) => {
                        const categoryProducts = groupedProducts[category.id];
                        if (!categoryProducts || categoryProducts.length === 0) return null;

                        return (
                            <div key={category.id} id={`category-${category.id}`} className="mb-16 scroll-mt-[100px]">
                                <motion.h3
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="text-3xl font-serif text-brand mb-6 border-l-4 border-brand pl-4 drop-shadow-sm"
                                >
                                    {category.label}
                                </motion.h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {categoryProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <ProductCard
                                                product={product}
                                                onAdd={addToCart}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
