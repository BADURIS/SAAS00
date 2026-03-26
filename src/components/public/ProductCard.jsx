import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../shared/Button';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product, onAdd }) {
    const [observation, setObservation] = useState('');

    const { cartItems } = useCart();
    const cartItem = cartItems.find(item => item.id === product.id);
    const currentQty = cartItem ? cartItem.quantity : 0;
    const isMaxReached = currentQty >= product.stock;

    const handleAdd = () => {
        if (product.stock > 0 && !isMaxReached) {
            onAdd(product, observation);
            setObservation(''); // Reset after adding
        }
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="bg-surface rounded-2xl overflow-hidden shadow-lg border border-surface-light flex flex-col group hover:shadow-2xl hover:shadow-brand/20 transition-all duration-300"
        >
            <div className="h-48 overflow-hidden relative">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/80 flex justify-center items-center text-white font-bold text-xl uppercase tracking-widest backdrop-blur-sm">
                        Esgotado
                    </div>
                )}
            </div>
            
            <div className="p-6 flex-1 flex flex-col bg-surface/50 backdrop-blur-sm">
                <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="text-xl font-bold text-text-primary leading-tight">{product.name}</h3>
                    <span className="text-brand font-bold text-xl whitespace-nowrap">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                </div>
                
                <p className="text-text-muted text-sm mb-4 flex-1">
                    {product.description}
                </p>

                {/* Observation Field */}
                <div className="mb-4">
                    <textarea
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                        placeholder="Observação (ex: Ao ponto, sem cebola...)"
                        maxLength={100}
                        className="w-full p-3 bg-background border border-surface-light rounded-lg text-sm resize-none min-h-[60px] text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
                    />
                </div>

                <Button
                    variant="primary"
                    onClick={handleAdd}
                    disabled={product.stock <= 0 || isMaxReached}
                    className="w-full"
                >
                    {product.stock <= 0 ? 'Volto Logo' : (isMaxReached ? 'Máx. Atingido' : 'Adicionar ao Pedido')}
                </Button>
            </div>
        </motion.div>
    );
}
