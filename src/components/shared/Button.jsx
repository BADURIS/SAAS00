import React from 'react';

export default function Button({ children, variant = 'primary', className = '', style = {}, disabled, onClick, ...props }) {
    const baseClasses = "px-6 py-3 rounded-md font-semibold text-base transition-all cursor-pointer inline-flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed";
    
    // Using Tailwind colors defined in the theme (brand, background, surface, etc.)
    const variants = {
        primary: "bg-brand text-background hover:bg-brand-light shadow-[0_4px_6px_-1px_rgba(230,138,92,0.4)]",
        secondary: "bg-transparent text-text-secondary border-2 border-text-secondary hover:text-white hover:border-white"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant] || variants.primary} ${className}`}
            style={style}
            {...props}
        >
            {children}
        </button>
    );
}
