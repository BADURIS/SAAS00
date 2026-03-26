import React from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import Button from '../shared/Button';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
    const navigate = useNavigate();
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        cartTotal,
        isCartOpen,
        setIsCartOpen
    } = useCart();
    const { products } = useStore();

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-full max-w-[400px] bg-background z-[1000] flex flex-col shadow-[-4px_0_20px_rgba(0,0,0,0.5)] animate-[slideIn_0.3s_ease-out] border-l border-surface-light">
            <div className="p-6 border-b border-surface flex justify-between items-center bg-surface">
                <h2 className="text-xl font-bold font-serif text-white">Seu Carrinho</h2>
                <button 
                  onClick={() => setIsCartOpen(false)} 
                  className="text-text-muted hover:text-white transition-colors cursor-pointer"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-background">
                {cartItems.length === 0 ? (
                    <p className="text-center text-text-muted mt-8">
                        Seu carrinho está vazio.
                    </p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {cartItems.map(item => {
                            const currentStock = products.find(p => p.id === item.id)?.stock || 0;
                            const isAtMax = item.quantity >= currentStock;

                            return (
                                <div key={item.id} className="flex gap-4 border-b border-surface pb-4 last:border-0">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-surface-light" />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-text-primary mb-1">{item.name}</h4>
                                        {item.observation && (
                                            <p className="text-xs text-text-muted italic mb-1">
                                                Obs: {item.observation}
                                            </p>
                                        )}
                                        <p className="text-brand font-bold">
                                            R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <button 
                                                onClick={() => updateQuantity(item.id, -1)} 
                                                className="p-1 bg-surface-light text-text-primary hover:text-brand rounded transition-colors cursor-pointer"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-text-primary text-sm min-w-[1.5rem] text-center font-medium">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                disabled={isAtMax}
                                                className={`p-1 bg-surface-light text-text-primary rounded transition-colors ${
                                                    isAtMax ? 'opacity-50 cursor-not-allowed' : 'hover:text-brand cursor-pointer'
                                                }`}
                                            >
                                                <Plus size={14} />
                                            </button>
                                            <button 
                                                onClick={() => removeFromCart(item.id)} 
                                                className="ml-auto text-text-muted hover:text-danger transition-colors cursor-pointer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-surface bg-surface-dark">
                <div className="flex justify-between mb-4 font-bold text-xl text-white">
                    <span>Total:</span>
                    <span className="text-brand">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <Button
                    variant="primary"
                    className="w-full"
                    disabled={cartItems.length === 0}
                    onClick={() => {
                        setIsCartOpen(false);
                        navigate('/checkout');
                    }}
                >
                    Finalizar Pedido
                </Button>
            </div>
        </div>
    );
}
