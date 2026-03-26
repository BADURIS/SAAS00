import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Flame, ArrowRight, Star, Clock, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import fireBg from '../../assets/fire_theme.jpg';
import MenuSection from '../../components/public/MenuSection';
import Footer from '../../components/public/Footer';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const NAV_LINKS = [
    { label: 'INÍCIO', id: 'hero-section' },
    { label: 'SOBRE NÓS', id: 'story-section' },
    { label: 'RESERVAS', id: 'reservas-section' }
];

// Animation variants
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.12, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
    })
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
};

export default function HomePage() {
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const loopVideoRef = useRef(null);
    const { cartCount, setIsCartOpen } = useCart();
    const { scrollY } = useScroll();
    const heroBgY = useTransform(scrollY, [0, 600], [0, 120]);
    const [introEnded, setIntroEnded] = useState(false);

    const scrollToMenu = () => {
        document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToSection = (e, id) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleIntroEnd = () => {
        setIntroEnded(true);
        if (loopVideoRef.current) {
            loopVideoRef.current.play().catch(e => console.log('Autoplay prevented:', e));
        }
    };

    return (
        <div className="min-h-screen bg-background text-text-primary font-sans">

            {/* ─── HERO ─────────────────────────────────────────────── */}
            <section id="hero-section" ref={heroRef} className="relative h-screen min-h-[680px] flex flex-col items-center justify-center overflow-hidden bg-black">

                {/* Parallax Video Backgrounds */}
                <motion.div
                    style={{ y: heroBgY }}
                    className="absolute inset-0 scale-105 origin-center"
                >
                    {/* Intro Video (Plays Once) */}
                    <video
                        src="/videos/video hero.mp4"
                        autoPlay
                        muted
                        playsInline
                        onEnded={handleIntroEnd}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${introEnded ? 'opacity-0 z-0' : 'opacity-100 z-10'}`}
                    />

                    {/* Loop Video (Plays After Intro) */}
                    <video
                        ref={loopVideoRef}
                        src="/videos/video hero 2.mp4"
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${introEnded ? 'opacity-100' : 'opacity-0'}`}
                    />

                    <div className="absolute inset-0 z-20 bg-gradient-to-b from-background/70 via-background/40 to-background/95" />
                </motion.div>

                {/* Top brand line */}
                <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-5 z-20">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Casa dos Assados" className="w-8 h-8 object-contain" />
                        <span className="text-brand font-serif font-bold text-sm tracking-[0.25em] uppercase drop-shadow-md">Casa dos Assados</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map(link => (
                            <a
                                key={link.label}
                                href={`#${link.id}`}
                                onClick={(e) => scrollToSection(e, link.id)}
                                className="text-text-muted hover:text-white text-xs tracking-[0.15em] font-medium transition-colors duration-200"
                            >
                                {link.label}
                            </a>
                        ))}
                        <button
                            onClick={() => navigate('/admin')}
                            className="text-text-muted hover:text-brand text-xs tracking-[0.15em] font-bold uppercase transition-colors duration-200 cursor-pointer"
                        >
                            LOGIN PARA STAFF
                        </button>
                    </nav>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative text-text-muted hover:text-white transition-colors"
                        >
                            <ShoppingBag size={24} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-brand text-white rounded-full w-5 h-5 text-[10px] font-bold flex items-center justify-center border-2 border-background">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button onClick={scrollToMenu} className="hidden md:flex items-center gap-2 bg-brand text-background text-xs font-bold tracking-widest px-4 py-2 uppercase hover:bg-brand-light transition-colors duration-200 cursor-pointer">
                            VER CARDÁPIO
                        </button>
                    </div>
                </div>

                {/* Hero Content — Stacked typographic brutalism */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 text-center px-6 max-w-4xl"
                >
                    {/* Eyebrow */}
                    <motion.p variants={fadeUp} custom={0} className="text-brand text-xs tracking-[0.4em] uppercase font-bold mb-6">
                        PREMIUM 500G · PICANHA · TRADIÇÃO À BRASA
                    </motion.p>

                    {/* Main headline — massive serif */}
                    <motion.h1 variants={fadeUp} custom={1} className="font-serif text-white leading-none mb-2">
                        <span className="block text-6xl md:text-8xl lg:text-[7rem] font-bold">A Nobreza</span>
                        <span className="block text-6xl md:text-8xl lg:text-[7rem] font-bold italic text-brand">do Fogo</span>
                    </motion.h1>

                    {/* Sub */}
                    <motion.p variants={fadeUp} custom={2} className="text-text-muted text-sm md:text-base mt-6 mb-10 max-w-lg mx-auto leading-relaxed">
                        Descubra a excelência do churrasco mais vivo. Cortes Premium selecionados, tempero e brasa do bem servidos da carne de quarta-feira.
                    </motion.p>

                    {/* CTA group */}
                    <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={scrollToMenu}
                            className="flex items-center gap-3 bg-brand text-background font-bold px-8 py-4 text-sm tracking-wider uppercase hover:bg-brand-light transition-all duration-300 cursor-pointer shadow-[0_8px_24px_rgba(230,138,92,0.35)]"
                        >
                            Ver Cardápio Completo <ArrowRight size={16} />
                        </button>
                        <button className="flex items-center gap-2 text-white/80 text-sm font-medium tracking-wide border border-white/20 px-8 py-4 hover:border-brand/60 hover:text-white transition-all duration-300 cursor-pointer">
                            Fazer um Pedido
                        </button>
                    </motion.div>
                </motion.div>

                {/* Bottom scroll hint */}
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-text-muted"
                >
                    <ChevronDown size={20} />
                </motion.div>

                {/* Safe work badge removed per user request */}
            </section>

            {/* ─── MENU SECTION ─────────────────────────────────────── */}
            <section id="menu-section" className="py-8">
                {/* Section header */}
                <div className="max-w-7xl mx-auto px-6 mb-6">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-light pb-8"
                    >
                        <div>
                            <p className="text-text-muted text-xs tracking-[0.3em] uppercase mb-2">Uma seleção do melhor</p>
                            <h2 className="font-serif text-4xl md:text-5xl text-white font-bold">O Cardápio<br /> da Brasa</h2>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-brand fill-brand" />)}
                            </div>
                            <p className="text-text-muted text-xs tracking-widest uppercase">ESPECIALIDADE DA CASA</p>
                        </div>
                    </motion.div>
                </div>
                <MenuSection />
            </section>

            {/* ─── STORY SECTION (Cinematic Asymmetric) ───────────────────────────────────── */}
            <section id="story-section" className="relative py-24 lg:py-40 bg-background overflow-hidden border-y border-surface-light">

                {/* 1. Base Video Background (Left aligned visually) */}
                <div className="absolute inset-0 w-full lg:w-[70%] h-full transition-opacity duration-700 z-0">
                    <video src="/videos/video hero 3.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover grayscale opacity-40 mix-blend-screen" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/90 to-background" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
                </div>

                {/* 3. Content Overlap Container */}
                <div className="relative z-20 max-w-7xl mx-auto px-6 flex justify-center lg:justify-end">

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-[55%] xl:w-[50%] bg-surface/30 backdrop-blur-2xl border border-surface-light p-10 lg:p-14 shadow-2xl relative overflow-hidden"
                    >
                        {/* Decorative Badge */}
                        <div className="absolute top-0 right-0 bg-brand text-background text-[10px] font-bold tracking-widest uppercase px-4 py-2">
                            Grill Master
                        </div>

                        <p className="text-text-muted text-xs tracking-[0.4em] uppercase mb-8">
                            Nossa história
                        </p>

                        <h2 className="font-serif text-5xl md:text-6xl text-white font-bold leading-[1.1] mb-8">
                            Onde o Tempo<br />
                            <span className="italic text-brand">Encontra o Tempero</span>
                        </h2>

                        <p className="text-text-secondary leading-relaxed text-sm md:text-base mb-10">
                            Não há atalhos em nossa brasa. Cada corte recebe um ciclo de maturação e um tejo específico sobre a carne — é a partir daí que se transforma um simples pedaço em uma experiência sensorial profunda, projetada para transcender o convencional.
                        </p>

                        {/* Metrics row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-surface-light/50 mb-10">

                            {/* Metric 1 */}
                            <div>
                                <p className="font-serif text-5xl font-bold text-white">100%</p>
                                <p className="text-text-muted text-xs uppercase tracking-[0.2em] mt-2">ARTESANAL • CADA PEÇA</p>
                            </div>

                            {/* Metric 2 */}
                            <div>
                                <p className="font-serif text-5xl font-bold text-white">Dry Aged</p>
                                <p className="text-text-muted text-xs uppercase tracking-[0.2em] mt-2">MATURAÇÃO STRICTA</p>
                            </div>

                        </div>

                        <a
                            href="#"
                            className="inline-flex items-center gap-4 text-white text-xs font-bold uppercase tracking-widest hover:text-brand transition-colors duration-300 group"
                        >
                            <span className="border-b border-brand/50 pb-1 group-hover:border-brand transition-colors">Ver nossa trajetória</span>
                            <ArrowRight size={16} className="text-brand group-hover:translate-x-2 transition-transform duration-300" />
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* ─── RESERVATION CTA ─────────────────────────────────── */}
            <section id="reservas-section" className="py-28 relative overflow-hidden bg-background">
                {/* Background texture */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'radial-gradient(circle, #E68A5C 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }} />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative z-10 max-w-3xl mx-auto text-center px-6"
                >
                    <Flame className="text-brand mx-auto mb-6" size={36} />
                    <h2 className="font-serif text-5xl md:text-6xl text-white font-bold mb-4 leading-tight">
                        Sinta o calor da nossa brasa
                    </h2>
                    <p className="text-text-muted mb-10 text-sm md:text-base leading-relaxed">
                        Reservas limitadas para garantir a sua qualidade de atendimento e a qualidade de cada corte servido.
                    </p>
                    <button
                        onClick={scrollToMenu}
                        className="inline-flex items-center gap-3 bg-brand text-background font-bold px-10 py-5 text-sm tracking-widest uppercase hover:bg-brand-light transition-all duration-300 cursor-pointer shadow-[0_8px_30px_rgba(230,138,92,0.5)]"
                    >
                        Fazer pedido agora
                    </button>
                </motion.div>
            </section>

            <Footer />
        </div>
    );
}
