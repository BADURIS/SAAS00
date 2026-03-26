import React, { useState, useEffect, useRef } from 'react';
import {
    Plus, Minus, ShoppingCart, Trash2, Search,
    Barcode, ChevronRight, Package, Scale,
    History, Clock, CheckCircle2, AlertCircle,
    Truck, User, CreditCard, Banknote, QrCode
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import Button from '../../components/shared/Button';
// Removed framer-motion for stability

export default function POSPage() {
    const { products, addOrder } = useStore();
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [customer, setCustomer] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('money');
    const [orderType, setOrderType] = useState('pickup');
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [showWeightModal, setShowWeightModal] = useState(null);
    const [tempWeight, setTempWeight] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const searchRef = useRef(null);

    // Auto-focus search on mount and after actions
    useEffect(() => {
        searchRef.current?.focus();
    }, []);

    const filteredProducts = (products || []).filter(p =>
        (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.barcode || '').includes(searchTerm) ||
        (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddToCart = (product) => {
        if (product.unit_type === 'kg') {
            setShowWeightModal(product);
            setTempWeight('');
        } else {
            addToCart(product, 1);
        }
    };

    const addToCart = (product, quantity, note = '') => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id && i.note === note);
            if (existing && product.unit_type === 'unit') {
                return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
            }
            return [...prev, { ...product, quantity, note, cart_id: Date.now() }];
        });
        setSearchTerm('');
        searchRef.current?.focus();
    };

    const confirmWeight = () => {
        const weight = parseFloat(tempWeight);
        if (weight > 0) {
            addToCart(showWeightModal, weight);
            setShowWeightModal(null);
        }
    };

    const removeFromCart = (cart_id) => {
        setCart(prev => prev.filter(i => i.cart_id !== cart_id));
    };

    const updateQuantity = (cart_id, delta) => {
        setCart(prev => prev.map(i => {
            if (i.cart_id === cart_id) {
                const newQty = Math.max(0.1, i.quantity + delta);
                return { ...i, quantity: i.unit_type === 'unit' ? Math.ceil(newQty) : newQty };
            }
            return i;
        }));
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = subtotal + parseFloat(deliveryFee || 0);

    const [cashReceived, setCashReceived] = useState('');
    const [isImmediate, setIsImmediate] = useState(false);

    const change = (parseFloat(cashReceived) || 0) - total;

    const handleFinalize = async () => {
        if (cart.length === 0) return;
        setIsProcessing(true);

        const order = {
            customer: {
                name: customer || 'Cliente Balcão',
                phone: 'Presencial',
                address: orderType === 'delivery' ? 'Entrega Local' : 'Retirada'
            },
            items: cart.map(item => ({
                product_id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.price * item.quantity,
                unit_type: item.unit_type,
                note: item.note
            })),
            total: total,
            status: isImmediate ? (orderType === 'pickup' ? 'Pedido retirado' : 'Entregue') : 'Pendente',
            payment: {
                method: paymentMethod,
                received: parseFloat(cashReceived || 0),
                change: Math.max(0, change)
            },
            type: orderType,
            deliveryFee: parseFloat(deliveryFee || 0),
            createdAt: new Date().toISOString()
        };

        try {
            await addOrder(order);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setCart([]);
                setCustomer('');
                setDeliveryFee(0);
                setCashReceived('');
                setSearchTerm('');
            }, 2000);
        } catch (error) {
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex bg-[#0a0a0b] text-white overflow-hidden relative" style={{ height: 'calc(100vh - 64px)' }}>
            {/* Main Content: Product Selection */}
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
                <div className="mb-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                            <Search size={22} />
                        </div>
                        <input
                            ref={searchRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && filteredProducts.length === 1) {
                                    handleAddToCart(filteredProducts[0]);
                                }
                            }}
                            placeholder="Pesquisar produto ou bipar código de barras..."
                            className="w-full bg-[#161618] border-2 border-zinc-800 focus:border-red-600 pl-12 pr-4 py-4 text-xl outline-none transition-all uppercase placeholder:text-zinc-600 font-mono tracking-tight"
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-600">
                            <Barcode size={24} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                onClick={() => handleAddToCart(product)}
                                className="group relative bg-[#131315] border border-zinc-800 p-4 cursor-pointer hover:border-red-600/50 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold uppercase leading-tight group-hover:text-red-500 transition-colors">{product.name}</h3>
                                    {product.unit_type === 'kg' ? (
                                        <Scale size={18} className="text-zinc-500" />
                                    ) : (
                                        <Package size={18} className="text-zinc-500" />
                                    )}
                                </div>
                                <div className="flex items-end justify-between mt-4">
                                    <div className="text-2xl font-black text-red-600">
                                        R$ {product.price.toFixed(2)}
                                        <span className="text-[10px] text-zinc-500 ml-1 font-normal italic">/{product.unit_type}</span>
                                    </div>
                                    <div className="text-[10px] text-zinc-600 font-mono uppercase">
                                        #{product.barcode || '---'}
                                    </div>
                                </div>

                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-600/20 pointer-events-none transition-all" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fast Shortcuts */}
                <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-zinc-900 overflow-x-auto no-scrollbar">
                    {['FRANGO', 'COSTELA', 'MAIONESE', 'COCA 2L', 'CERVEJA'].map(fav => (
                        <button
                            key={fav}
                            onClick={() => setSearchTerm(fav)}
                            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-bold uppercase tracking-widest text-zinc-400 transition-colors whitespace-nowrap"
                        >
                            {fav}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sidebar: Cart & Checkout */}
            <div className="w-[420px] bg-[#0d0d0f] border-l border-zinc-800 flex flex-col shadow-2xl relative z-10">
                <div className="p-6 border-b border-zinc-800 bg-[#111113] flex items-center justify-between">
                    <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <ShoppingCart size={24} className="text-red-600" /> Subtotal
                    </h2>
                    <span className="text-sm font-mono text-zinc-500 uppercase">{cart.length} itens</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-700 opacity-50 grayscale">
                            <Package size={64} className="mb-4 stroke-[1px]" />
                            <span className="uppercase text-xs font-bold tracking-[0.2em]">Carrinho Vazio</span>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div
                                key={item.cart_id}
                                className="bg-[#161618] border border-zinc-800 p-3 relative group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1 pr-8">
                                        <div className="font-bold text-sm uppercase leading-tight tracking-tight">{item.name}</div>
                                        <div className="text-[10px] text-zinc-500 mt-1 uppercase font-semibold">
                                            {item.quantity}{item.unit_type} × R${item.price.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-black text-white leading-none">
                                            R$ {(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center bg-black border border-zinc-800">
                                        <button onClick={() => updateQuantity(item.cart_id, -1)} className="p-1 hover:text-red-500 transition-colors"><Minus size={14} /></button>
                                        <span className="w-10 text-center font-mono text-xs">{item.unit_type === 'kg' ? item.quantity.toFixed(3) : item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.cart_id, 1)} className="p-1 hover:text-red-500 transition-colors"><Plus size={14} /></button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.cart_id)}
                                        className="text-zinc-600 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 bg-[#111113] border-t border-zinc-800 space-y-4">
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative col-span-2">
                                <label className="text-[9px] font-black uppercase text-zinc-500 absolute top-2 left-3">Cliente</label>
                                <input
                                    type="text"
                                    value={customer}
                                    onChange={(e) => setCustomer(e.target.value)}
                                    className="w-full bg-black border border-zinc-800 text-sm px-3 pt-6 pb-2 outline-none focus:border-red-900/50 transition-colors uppercase placeholder:text-zinc-800"
                                    placeholder="NOME OU WHATSAPP"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <label className="text-[9px] font-black uppercase text-zinc-500 absolute top-2 left-3">Taxa Entrega</label>
                                <input
                                    type="number"
                                    value={deliveryFee}
                                    onChange={(e) => setDeliveryFee(e.target.value)}
                                    className="w-full bg-black border border-zinc-800 text-sm px-3 pt-6 pb-2 outline-none focus:border-red-900/50 transition-colors font-mono"
                                />
                            </div>
                            <div className="relative">
                                <label className="text-[9px] font-black uppercase text-zinc-500 absolute top-2 left-3">Pagamento</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full bg-black border border-zinc-800 text-sm px-3 pt-6 pb-2 outline-none focus:border-red-900/50 appearance-none uppercase"
                                >
                                    <option value="money">Dinheiro</option>
                                    <option value="pix">PIX</option>
                                    <option value="debit">Débito</option>
                                    <option value="credit">Crédito</option>
                                </select>
                            </div>
                        </div>

                        {paymentMethod === 'money' && (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <label className="text-[9px] font-black uppercase text-zinc-500 absolute top-2 left-3">Valor Recebido</label>
                                    <input
                                        type="number"
                                        value={cashReceived}
                                        onChange={(e) => setCashReceived(e.target.value)}
                                        className="w-full bg-red-900/10 border border-red-900/30 text-red-500 font-black px-3 pt-6 pb-2 outline-none focus:border-red-600 transition-all font-mono text-lg"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="relative bg-zinc-900 border border-zinc-800 flex flex-col justify-center px-3">
                                    <span className="text-[9px] font-black uppercase text-zinc-500">Troco</span>
                                    <span className={`text-lg font-black font-mono ${(change >= 0 && !isNaN(change)) ? 'text-emerald-500' : 'text-zinc-700'}`}>
                                        R$ {(isNaN(change) || change < 0) ? '0.00' : change.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                            <div>
                                <span className="block text-[9px] font-black uppercase text-zinc-500">Status da Venda</span>
                                <span className="text-xs font-bold uppercase tracking-tight">{isImmediate ? 'Finalizar e Baixar' : 'Apenas Registrar (Pendente)'}</span>
                            </div>
                            <button
                                onClick={() => setIsImmediate(!isImmediate)}
                                className={`w-12 h-6 rounded-full transition-all relative ${isImmediate ? 'bg-red-600' : 'bg-zinc-700'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isImmediate ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-800">
                        <div className="flex justify-between items-baseline mb-4">
                            <span className="text-xs font-black uppercase text-zinc-500">Valor Total</span>
                            <span className="text-5xl font-black tracking-tighter text-red-600">
                                R$ {total.toFixed(2)}
                            </span>
                        </div>

                        <button
                            onClick={handleFinalize}
                            disabled={cart.length === 0 || isProcessing || (paymentMethod === 'money' && change < 0)}
                            className="w-full group relative overflow-hidden bg-white text-black py-5 font-black uppercase tracking-widest text-lg flex items-center justify-center gap-3 hover:bg-red-600 hover:text-white transition-all disabled:bg-zinc-800 disabled:text-zinc-600"
                        >
                            {isProcessing ? (
                                <Clock className="animate-spin" />
                            ) : (
                                <>
                                    {isImmediate ? 'Finalizar Venda' : 'Salvar Pedido'}
                                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals & Overlays */}
            {showWeightModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                >
                    <div
                        className="bg-[#111113] border-4 border-zinc-800 w-full max-w-md"
                    >
                        <div className="p-8">
                            <h3 className="text-zinc-500 font-black uppercase text-sm mb-2 tracking-widest">Inserir Peso (KG)</h3>
                            <div className="text-4xl font-black uppercase mb-8 leading-tight tracking-tighter">
                                {showWeightModal.name}
                            </div>

                            <div className="relative mb-8">
                                <input
                                    autoFocus
                                    type="number"
                                    step="0.001"
                                    placeholder="0.000"
                                    value={tempWeight}
                                    onChange={(e) => setTempWeight(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && confirmWeight()}
                                    className="w-full bg-black border-2 border-zinc-800 p-6 text-7xl font-mono text-white outline-none focus:border-red-600 transition-all text-center"
                                />
                                <div className="absolute top-1/2 -translate-y-1/2 right-6 text-2xl font-black text-zinc-600">KG</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setShowWeightModal(null)}
                                    className="py-4 border-2 border-zinc-800 text-zinc-500 font-bold uppercase hover:bg-zinc-900 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmWeight}
                                    className="py-4 bg-red-600 text-white font-black uppercase tracking-widest hover:bg-red-700 transition-colors"
                                >
                                    Adicionar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showSuccess && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-red-600 text-white"
                >
                    <div
                        className="flex flex-col items-center"
                    >
                        <CheckCircle2 size={120} className="mb-6 stroke-[3px]" />
                        <h2 className="text-6xl font-black uppercase tracking-tighter italic">Venda Concluída</h2>
                        <p className="mt-4 font-mono uppercase tracking-[0.3em] opacity-80">Estoque atualizado com sucesso</p>
                    </div>
                </div>
            )}
        </div>
    );
}
