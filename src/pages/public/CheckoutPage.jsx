import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, CreditCard, Banknote, Truck, Store, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import Button from '../../components/shared/Button';

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { addOrder, deliveryFees } = useStore();
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const [deliveryType, setDeliveryType] = useState('delivery'); // delivery | pickup
    const [freight, setFreight] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('pix');

    // Watch CEP to simulate freight
    const cep = watch('cep');
    const [selectedFee, setSelectedFee] = useState(null);

    useEffect(() => {
        if (cep && cep.length >= 8 && deliveryType === 'delivery') {
            // Simulate freight calculation based on CEP
            // Simple mock: Last digit odd = expensive, even = cheap
            const lastDigit = parseInt(cep.replace(/\D/g, '').slice(-1));
            const fees = deliveryFees || [];
            if (fees.length > 0) {
                const feeIndex = lastDigit % fees.length; // Rotate through available fees
                const fee = fees[feeIndex];
                setSelectedFee(fee);
                setFreight(fee.price);
            }
        } else {
            setFreight(0);
            setSelectedFee(null);
        }
    }, [cep, deliveryType, deliveryFees]);

    const onSubmit = (data) => {
        const orderData = {
            customer: {
                name: data.name,
                phone: data.phone,
                address: deliveryType === 'delivery' ? `${data.street}, ${data.number} - ${data.cep}` : 'Retirada no Balcão'
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

        // Use StoreContext to add order

        // Use StoreContext to add order
        const newOrder = addOrder(orderData);

        // Clear cart and redirect
        clearCart();

        // alert('Pedido Realizado com Sucesso!'); // Removed alert for smoother flow
        navigate(`/order-status/${newOrder.id.replace('#', '')}`);
    };

    if (cartItems.length === 0) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h2>Seu carrinho está vazio</h2>
                <Button variant="primary" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>Voltar ao Cardápio</Button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#E68A5C', cursor: 'pointer', fontWeight: 'bold' }}>
                    <ArrowLeft size={24} /> Voltar
                </button>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 auto', textAlign: 'center', paddingRight: '100px' }}>Finalizar Pedido</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '2rem' }}>

                {/* Personal Info */}
                <section style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        1. Seus Dados
                    </h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label>Nome Completo</label>
                            <input {...register('name', { required: true })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd' }} />
                            {errors.name && <span style={{ color: 'red', fontSize: '0.8rem' }}>Campo obrigatório</span>}
                        </div>
                        <div>
                            <label>WhatsApp / Telefone</label>
                            <input
                                {...register('phone', { required: true })}
                                placeholder="(11) 99999-9999"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd' }}
                                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9\s()-]/g, '')}
                            />
                            {errors.phone && <span style={{ color: 'red', fontSize: '0.8rem' }}>Campo obrigatório</span>}
                        </div>
                    </div>
                </section>

                {/* Delivery */}
                <section style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        2. Entrega
                    </h2>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <button type="button" onClick={() => setDeliveryType('delivery')} style={{
                            flex: 1, padding: '1rem', borderRadius: '0.5rem', border: deliveryType === 'delivery' ? '2px solid var(--color-primary)' : '1px solid #ddd',
                            backgroundColor: deliveryType === 'delivery' ? '#fff1f1' : 'white', fontWeight: 'bold'
                        }}>
                            <Truck size={20} style={{ marginBottom: '0.5rem' }} /> <br /> Entrega <br /> <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>40min até 1h</span>
                        </button>
                        <button type="button" onClick={() => setDeliveryType('pickup')} style={{
                            flex: 1, padding: '1rem', borderRadius: '0.5rem', border: deliveryType === 'pickup' ? '2px solid var(--color-primary)' : '1px solid #ddd',
                            backgroundColor: deliveryType === 'pickup' ? '#fff1f1' : 'white', fontWeight: 'bold'
                        }}>
                            <Store size={20} style={{ marginBottom: '0.5rem' }} /> <br /> Retirada <br /> <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>45min</span>
                        </button>
                    </div>

                    {deliveryType === 'delivery' && (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '1rem' }}>
                                <div>
                                    <label>CEP</label>
                                    <input
                                        {...register('cep', { required: true })}
                                        placeholder="00000-000"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd' }}
                                        onInput={(e) => e.target.value = e.target.value.replace(/[^0-9-]/g, '')}
                                    />
                                </div>
                                {freight > 0 && <div style={{ display: 'flex', alignItems: 'center', color: 'green', fontWeight: 'bold' }}>+ R$ 5,00</div>}
                            </div>
                            <div>
                                <label>Rua</label>
                                <input {...register('street', { required: true })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem' }}>
                                <div>
                                    <label>Número</label>
                                    <input
                                        {...register('number', { required: true })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd' }}
                                        onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                    />
                                </div>
                                <div>
                                    <label>Complemento</label>
                                    <input {...register('complement')} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd' }} />
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Payment */}
                <section style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>3. Pagamento</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '0.5rem', cursor: 'pointer' }}>
                            <input type="radio" name="payment" value="pix" checked={paymentMethod === 'pix'} onChange={() => setPaymentMethod('pix')} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ fontWeight: 'bold' }}>Pix</div>
                            </div>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '0.5rem', cursor: 'pointer' }}>
                            <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CreditCard size={18} /> Cartão (Entregador leva maquininha)
                            </div>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '0.5rem', cursor: 'pointer' }}>
                            <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Banknote size={18} /> Dinheiro
                            </div>
                        </label>

                        {paymentMethod === 'cash' && (
                            <div style={{ marginLeft: '2rem', marginTop: '0.5rem' }}>
                                <label>Precisa de troco para quanto?</label>
                                <input {...register('change')} placeholder="R$ 50,00" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd', marginTop: '0.25rem' }} />
                            </div>
                        )}
                    </div>
                </section>

                {/* Order Summary */}
                <section style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Resumo</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Subtotal</span>
                        <span>R$ {cartTotal.toFixed(2)}</span>
                    </div>
                    {deliveryType === 'delivery' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                            <span>Frete</span>
                            <span>R$ {freight.toFixed(2)}</span>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid #ddd', paddingTop: '1rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
                        <span>Total</span>
                        <span>R$ {(cartTotal + (deliveryType === 'delivery' ? freight : 0)).toFixed(2)}</span>
                    </div>
                </section>

                <Button variant="primary" style={{ width: '100%', justifyContent: 'center', padding: '1.25rem', fontSize: '1.25rem' }}>
                    Confirmar Pedido
                </Button>
            </form>
        </div>
    );
}
