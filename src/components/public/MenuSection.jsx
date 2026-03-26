import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import Button from '../../components/shared/Button';

// The user requested specific categories: Carne, Frango, Linguiça, Costela, Bebidas, etc.
// We map mockData 'Assados' into Carne/Frango/Costela in a real app, 
// here we'll define the tabs and filter the global products accordingly.
const CATEGORIES = [
    { id: 'Carnes', label: 'Carnes' },
    { id: 'Frangos', label: 'Frangos' },
    { id: 'Linguiças', label: 'Linguiças' },
    { id: 'Costelas', label: 'Costelas' },
    { id: 'Acompanhamentos', label: 'Acompanhamentos' },
    { id: 'Bebidas', label: 'Bebidas' },
    // Fallback for mock data items
    { id: 'Assados', label: 'Assados Gerais' },
    { id: 'Marmita', label: 'Marmitas' }
];

export default function MenuSection() {
    const { addToCart } = useCart();
    const { products } = useStore();
    const [activeCategory, setActiveCategory] = useState('Assados'); // Defaulting to Assados for mock data
    const [activeIndex, setActiveIndex] = useState(0);

    // Group products
    const groupedProducts = CATEGORIES.reduce((acc, category) => {
        // Simple fuzzy match for mock data mapping
        acc[category.id] = products.filter(p => {
            if (p.category === category.id) return true;
            // Map the user's new tab strings to existing mock data descriptions/names
            const lowerName = p.name.toLowerCase();
            if (category.id === 'Costelas' && lowerName.includes('costela')) return true;
            if (category.id === 'Frangos' && lowerName.includes('frango')) return true;
            if (category.id === 'Bebidas' && p.category === 'Bebidas') return true;
            if (category.id === 'Acompanhamentos' && p.category === 'Acompanhamentos') return true;
            return false;
        });
        return acc;
    }, {});

    // Ensure products exist for the active category
    // Fallback to deduping logic (e.g., Costela BBQ might appear in 'Costelas' and 'Assados Gerais', we just render the active tab)
    const currentItems = Array.from(new Set(groupedProducts[activeCategory] || []));

    // Reset carousel index when category changes
    useEffect(() => {
        setActiveIndex(0);
    }, [activeCategory]);

    const handleNext = () => {
        if (activeIndex < currentItems.length - 1) setActiveIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        if (activeIndex > 0) setActiveIndex(prev => prev - 1);
    };

    // Swipe handlers for mobile
    let touchStartX = 0;
    const handleTouchStart = (e) => { touchStartX = e.touches[0].clientX; };
    const handleTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        if (touchStartX - touchEndX > 50) handleNext();
        if (touchEndX - touchStartX > 50) handlePrev();
    };

    return (
        <section className="bg-background min-h-[90vh] py-16 overflow-hidden flex flex-col items-center">
            
            <div className="text-center mb-10 w-full px-4">
                <p className="text-brand font-serif text-sm tracking-[0.3em] uppercase mb-4">A excelência do fogo</p>
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 drop-shadow-lg">
                    Nosso Menu
                </h2>

                {/* Tabbed Navigation (Isolated Categories) */}
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
                    {CATEGORIES.map(category => {
                        // Only show tabs that actually have products (optional, but good for UX)
                        const hasProducts = (groupedProducts[category.id] && groupedProducts[category.id].length > 0) || 
                                           (category.id === 'Carnes' || category.id === 'Frangos' || category.id === 'Costelas'); // Force show the requested tabs
                        
                        // Wait, to keep it clean, let's just show all requested tabs.
                        const isActive = activeCategory === category.id;
                        
                        return (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-5 py-2 rounded-full text-xs md:text-sm tracking-widest uppercase transition-all duration-500 border ${
                                    isActive 
                                    ? 'bg-brand border-brand text-background font-bold shadow-[0_0_20px_rgba(230,138,92,0.4)]' 
                                    : 'bg-transparent border-surface-light text-text-muted hover:border-text-muted hover:text-white'
                                }`}
                            >
                                {category.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 3D Cover Flow Carousel */}
            <div 
                className="relative w-full max-w-7xl h-[550px] md:h-[650px] mt-8 flex flex-col items-center justify-center outline-none"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {currentItems.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-text-muted flex flex-col items-center gap-4"
                    >
                        <ShoppingBag size={48} className="opacity-20" />
                        <p className="font-serif italic text-xl">Nenhum item disponível nesta categoria no momento.</p>
                    </motion.div>
                ) : (
                    <>
                        <div className="relative w-full h-[400px] md:h-[500px] flex justify-center items-center perspective-1000">
                            <AnimatePresence>
                                {currentItems.map((product, index) => {
                                    const offset = index - activeIndex;
                                    const absOffset = Math.abs(offset);
                                    const isActive = offset === 0;

                                    // Math for the 3D effect
                                    const xBase = typeof window !== 'undefined' && window.innerWidth < 768 ? 160 : 280;
                                    const xTranslate = offset * xBase;
                                    const scale = 1 - absOffset * 0.15;
                                    const zIndex = 50 - absOffset;
                                    const opacity = absOffset >= 3 ? 0 : 1 - (absOffset * 0.4);
                                    
                                    // Pointer events only on active or immediate siblings to allow clicks
                                    const pointerEvents = absOffset <= 1 ? 'auto' : 'none';

                                    return (
                                        <motion.div
                                            key={product.id}
                                            className="absolute top-0 w-[280px] h-[380px] md:w-[350px] md:h-[480px] rounded-2xl overflow-hidden cursor-pointer"
                                            style={{ 
                                                marginLeft: typeof window !== 'undefined' && window.innerWidth < 768 ? '-140px' : '-175px',
                                                pointerEvents 
                                            }}
                                            animate={{
                                                x: xTranslate,
                                                scale: scale,
                                                opacity: opacity,
                                                zIndex: zIndex,
                                                rotateY: offset * -15 // tilts inwards
                                            }}
                                            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                                            onClick={() => setActiveIndex(index)}
                                        >
                                            <div className={`w-full h-full relative group ${isActive ? 'shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'shadow-none'}`}>
                                                {/* Image */}
                                                <img 
                                                    src={product.image || '/images/fallback.png'} 
                                                    alt={product.name} 
                                                    onError={(e) => { e.target.onerror = null; e.target.src = '/images/fallback.png'; }}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                
                                                {/* Gradient Overlay */}
                                                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-80'}`} />
                                                
                                                {/* Dim active siblings */}
                                                {!isActive && (
                                                    <div className="absolute inset-0 bg-black/50 transition-colors duration-500 hover:bg-black/30" />
                                                )}

                                                {/* Text Content (Only visible clearly when active, but kept in DOM for smooth transition) */}
                                                <motion.div 
                                                    className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center text-center"
                                                    animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                                                    transition={{ duration: 0.4, delay: isActive ? 0.1 : 0 }}
                                                >
                                                    <h3 className="text-2xl font-serif text-white font-bold mb-2 drop-shadow-md">{product.name}</h3>
                                                    <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">{product.description}</p>
                                                    <p className="text-brand font-bold text-xl mb-6">
                                                        R$ {Number(product.price).toFixed(2).replace('.', ',')}
                                                    </p>
                                                    
                                                    {/* Add to Cart Button */}
                                                    <Button 
                                                        variant="primary" 
                                                        className="w-full max-w-[200px]"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            addToCart(product, 1, '');
                                                        }}
                                                    >
                                                        Adicionar
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Navigation Arrows */}
                        <div className="flex items-center gap-8 mt-4 md:mt-8 z-50">
                            <button 
                                onClick={handlePrev} 
                                disabled={activeIndex === 0}
                                className="p-3 rounded-full border border-surface-light text-text-primary hover:bg-brand hover:text-black hover:border-brand disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            
                            {/* Dots Indicator */}
                            <div className="flex gap-2">
                                {currentItems.map((_, idx) => (
                                    <div 
                                        key={idx}
                                        className={`h-1.5 rounded-full transition-all duration-500 ${idx === activeIndex ? 'w-8 bg-brand' : 'w-2 bg-surface-light'}`}
                                    />
                                ))}
                            </div>

                            <button 
                                onClick={handleNext}
                                disabled={activeIndex === currentItems.length - 1}
                                className="p-3 rounded-full border border-surface-light text-text-primary hover:bg-brand hover:text-black hover:border-brand disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
