import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, CreditCard, Banknote, Truck, Store, ArrowLeft, User, Mail, Phone, Map } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import Button from '../../components/shared/Button';

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { addOrder, deliveryFees } = useStore();
    const navigate = useNavigate();

    // Default form values from localStorage to simulate an "account"
    let savedCustomerData = {};
    try {
        savedCustomerData = JSON.parse(localStorage.getItem('saas_customer_data') || '{}');
    } catch (e) {
        console.error("Error parsing saas_customer_data", e);
    }

    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
        defaultValues: savedCustomerData
    });

    const [deliveryType, setDeliveryType] = useState('delivery'); // delivery | pickup
    const [freight, setFreight] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('pix');

    const cep = watch('cep');
    const [selectedFee, setSelectedFee] = useState(null);

    useEffect(() => {
        if (cep && cep.length >= 8 && deliveryType === 'delivery') {
            const lastDigit = parseInt(cep.replace(/\D/g, '').slice(-1));
            const fees = deliveryFees || [];
            if (fees.length > 0) {
                const feeIndex = lastDigit % fees.length;
                const fee = fees[feeIndex];
                setSelectedFee(fee);
                setFreight(fee.price);
            }
        } else {
            setFreight(0);
            setSelectedFee(null);
        }
    }, [cep, deliveryType, deliveryFees]);

    const onSubmit = async (data) => {
        // Save customer data in localStorage for future orders (Smart Guest Checkout)
        const customerDataToSave = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            cep: data.cep,
            street: data.street,
            number: data.number,
            complement: data.complement
        };
        localStorage.setItem('saas_customer_data', JSON.stringify(customerDataToSave));

        const orderData = {
            customer: {
                name: data.name,
                email: data.email || null,
                phone: data.phone,
                address: deliveryType === 'delivery' ? `${data.street}, ${data.number} ${data.complement ? '- ' + data.complement : ''} - CEP: ${data.cep}` : 'Retirada no Balcão'
            },
            items: cartItems,
            total: cartTotal + (deliveryType === 'delivery' ? freight : 0),
            status: 'Pendente',
            payment: {
                method: paymentMethod,
                change: data.change || 0
            },
            observation: data.observation,
            type: deliveryType,
            deliveryFeeId: selectedFee ? selectedFee.id : null,
            deliveryZone: selectedFee ? selectedFee.name : null
        };

        const newOrder = await addOrder(orderData);

        if (newOrder && newOrder.id) {
            clearCart();
            navigate(`/order-status/${newOrder.id.replace('#', '')}`);
        } else {
            alert('Não foi possível realizar o pedido. Tente novamente.');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 font-serif text-center">
                <h2 className="text-3xl text-white font-bold mb-4">Seu carrinho está vazio</h2>
                <p className="text-text-muted mb-8">Adicione os deliciosos cortes da Casa de Carnes antes de fechar o pedido.</p>
                <Button variant="primary" onClick={() => navigate('/')}>Voltar ao Cardápio</Button>
            </div>
        );
    }

    const inputClasses = "w-full bg-background border border-surface-light rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors";
    const labelClasses = "block text-sm font-medium text-text-muted mb-1.5 flex items-center gap-2";

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
                <button 
                    onClick={() => navigate('/')} 
                    className="flex items-center gap-2 text-brand hover:text-white transition-colors cursor-pointer group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
                    <span className="font-bold text-sm tracking-widest uppercase">Voltar</span>
                </button>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-white uppercase tracking-widest text-center flex-1 pr-20">
                    Finalizar Pedido
                </h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-2 space-y-8">
                    {/* Personal Info */}
                    <section className="bg-surface/30 backdrop-blur-md border border-surface-light p-6 md:p-8 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-brand"></div>
                        <h2 className="text-xl font-serif text-white font-bold mb-6 flex items-center gap-2">
                            <span className="bg-brand/20 text-brand p-2 rounded-lg"><User size={20} /></span>
                            1. Seus Dados
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Nome Completo</label>
                                <input 
                                    className={inputClasses}
                                    placeholder="ex: João Silva" 
                                    {...register('name', { required: true })} 
                                />
                                {errors.name && <span className="text-danger text-xs mt-1">Campo obrigatório</span>}
                            </div>
                            <div>
                                <label className={labelClasses}><Phone size={14} className="text-brand"/> WhatsApp / Telefone</label>
                                <input
                                    className={inputClasses}
                                    {...register('phone', { required: true })}
                                    placeholder="(11) 99999-9999"
                                    onInput={(e) => e.target.value = e.target.value.replace(/[^0-9\s()-]/g, '')}
                                />
                                {errors.phone && <span className="text-danger text-xs mt-1">Campo obrigatório</span>}
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClasses}><Mail size={14} className="text-brand"/> E-mail (Opcional) - Facilita pedidos futuros</label>
                                <input 
                                    className={inputClasses}
                                    type="email"
                                    placeholder="seu@email.com" 
                                    {...register('email')} 
                                />
                            </div>
                        </div>
                    </section>

                    {/* Delivery */}
                    <section className="bg-surface/30 backdrop-blur-md border border-surface-light p-6 md:p-8 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-brand"></div>
                        <h2 className="text-xl font-serif text-white font-bold mb-6 flex items-center gap-2">
                            <span className="bg-brand/20 text-brand p-2 rounded-lg"><Truck size={20} /></span>
                            2. Forma de Entrega
                        </h2>

                        <div className="flex gap-4 mb-6">
                            <button 
                                type="button" 
                                onClick={() => setDeliveryType('delivery')} 
                                className={`flex-1 p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                                    deliveryType === 'delivery' 
                                    ? 'bg-brand/10 border-brand text-brand' 
                                    : 'bg-background border-surface-light text-text-muted hover:border-text-primary'
                                }`}
                            >
                                <Truck size={24} />
                                <span className="font-bold">Entrega</span>
                                <span className="text-xs opacity-80">40min até 1h</span>
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setDeliveryType('pickup')} 
                                className={`flex-1 p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                                    deliveryType === 'pickup' 
                                    ? 'bg-brand/10 border-brand text-brand' 
                                    : 'bg-background border-surface-light text-text-muted hover:border-text-primary'
                                }`}
                            >
                                <Store size={24} />
                                <span className="font-bold">Retirada</span>
                                <span className="text-xs opacity-80">Rápido 15min</span>
                            </button>
                        </div>

                        {deliveryType === 'delivery' && (
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 animate-[fadeIn_0.3s_ease-out]">
                                <div className="md:col-span-5 relative">
                                    <label className={labelClasses}><Map size={14} className="text-brand"/> CEP</label>
                                    <div className="relative">
                                        <input
                                            className={`${inputClasses} pr-20`}
                                            {...register('cep', { required: true })}
                                            placeholder="00000-000"
                                            onInput={(e) => e.target.value = e.target.value.replace(/[^0-9-]/g, '')}
                                        />
                                        {freight > 0 && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success font-bold text-xs bg-success/10 px-2 py-1 rounded-md">
                                                + R$ {freight.toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                    {errors.cep && <span className="text-danger text-xs mt-1">Campo obrigatório</span>}
                                </div>
                                <div className="md:col-span-7">
                                    <label className={labelClasses}>Rua</label>
                                    <input className={inputClasses} {...register('street', { required: true })} placeholder="Av. Principal..." />
                                    {errors.street && <span className="text-danger text-xs mt-1">Campo obrigatório</span>}
                                </div>
                                <div className="md:col-span-4">
                                    <label className={labelClasses}>Número</label>
                                    <input
                                        className={inputClasses}
                                        {...register('number', { required: true })}
                                        placeholder="123"
                                        onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                    />
                                    {errors.number && <span className="text-danger text-xs mt-1">Campo obrigatório</span>}
                                </div>
                                <div className="md:col-span-8">
                                    <label className={labelClasses}>Complemento</label>
                                    <input className={inputClasses} {...register('complement')} placeholder="Apto 12..." />
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Payment */}
                    <section className="bg-surface/30 backdrop-blur-md border border-surface-light p-6 md:p-8 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-brand"></div>
                        <h2 className="text-xl font-serif text-white font-bold mb-6 flex items-center gap-2">
                            <span className="bg-brand/20 text-brand p-2 rounded-lg"><DollarSign size={20} /></span>
                            3. Pagamento
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                                paymentMethod === 'pix' ? 'bg-brand/10 border-brand text-brand' : 'bg-background border-surface-light text-text-muted hover:border-text-primary'
                            }`}>
                                <input type="radio" name="payment" value="pix" checked={paymentMethod === 'pix'} onChange={() => setPaymentMethod('pix')} className="sr-only" />
                                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${paymentMethod === 'pix' ? 'bg-brand/20' : 'bg-surface-light'}`}>
                                    <span className="font-bold">PIX</span>
                                </div>
                                <span className="font-bold text-sm">Pix (Online)</span>
                            </label>
                            
                            <label className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                                paymentMethod === 'card' ? 'bg-brand/10 border-brand text-brand' : 'bg-background border-surface-light text-text-muted hover:border-text-primary'
                            }`}>
                                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="sr-only" />
                                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${paymentMethod === 'card' ? 'bg-brand/20' : 'bg-surface-light'}`}>
                                    <CreditCard size={24} className={paymentMethod === 'card' ? 'text-brand' : ''} />
                                </div>
                                <span className="font-bold text-sm text-center">Cartão na Maquininha</span>
                            </label>
                            
                            <label className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                                paymentMethod === 'cash' ? 'bg-brand/10 border-brand text-brand' : 'bg-background border-surface-light text-text-muted hover:border-text-primary'
                            }`}>
                                <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="sr-only" />
                                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${paymentMethod === 'cash' ? 'bg-brand/20' : 'bg-surface-light'}`}>
                                    <Banknote size={24} className={paymentMethod === 'cash' ? 'text-brand' : ''} />
                                </div>
                                <span className="font-bold text-sm">Dinheiro</span>
                            </label>
                        </div>

                        {paymentMethod === 'cash' && (
                            <div className="mt-6 animate-[fadeIn_0.3s_ease-out]">
                                <label className={labelClasses}>Precisa de troco para quanto?</label>
                                <input className={inputClasses} {...register('change')} placeholder="R$ 50,00" />
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-surface/30 backdrop-blur-md border border-surface-light p-6 rounded-2xl">
                        <h2 className="text-xl font-serif text-white font-bold mb-6 border-b border-surface-light pb-4">Resumo do Pedido</h2>
                        
                        <div className="space-y-4 mb-6">
                            {cartItems.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-start text-sm">
                                    <div className="flex text-text-primary">
                                        <span className="font-bold w-6">{item.quantity}x</span>
                                        <span className="flex-1 pr-2">{item.name}</span>
                                    </div>
                                    <span className="text-text-muted whitespace-nowrap">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-surface-light pt-4 space-y-3">
                            <div className="flex justify-between text-text-muted">
                                <span>Subtotal</span>
                                <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                            </div>
                            
                            {deliveryType === 'delivery' && (
                                <div className="flex justify-between text-text-muted">
                                    <span>Frete</span>
                                    <span className={freight > 0 ? "text-success font-bold" : "text-brand"}>
                                        {freight > 0 ? `+ R$ ${freight.toFixed(2).replace('.', ',')}` : 'A calcular'}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between items-end pt-4 border-t border-surface-light mt-4 px-1">
                                <span className="text-white font-bold text-lg uppercase tracking-widest">Total</span>
                                <span className="text-brand font-bold text-3xl">R$ {(cartTotal + (deliveryType === 'delivery' ? freight : 0)).toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>

                        <Button type="submit" variant="primary" className="w-full justify-center mt-8 py-4 text-sm tracking-widest font-bold">
                            FINALIZAR PEDIDO
                        </Button>
                    </div>
                </div>

            </form>
        </div>
    );
}
