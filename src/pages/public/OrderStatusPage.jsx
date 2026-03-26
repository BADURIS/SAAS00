import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Clock, MapPin, Phone, User, CheckCircle, Package, Truck, ArrowLeft } from 'lucide-react';
import Button from '../../components/shared/Button';

// Reuse status colors/styles for consistency
const getStatusConfig = (status) => {
    switch (status) {
        case 'Pendente':
            return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: Clock, label: 'Aguardando Confirmação' };
        case 'Em Preparo':
            return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: Package, label: 'Em Preparo' };
        case 'Rota de Entrega':
            return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: Truck, label: 'Saiu para Entrega' };
        case 'Entregue':
            return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle, label: 'Entregue' };
        case 'Pedido pronto para retirada':
            return { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', icon: MapPin, label: 'Pronto para Retirada' };
        case 'Pedido retirado':
            return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle, label: 'Pedido Retirado' };
        case 'Cancelado':
            return { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', icon: null, label: 'Cancelado' };
        default:
            return { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', icon: Clock, label: status };
    }
};

export default function OrderStatusPage() {
    const { id } = useParams();
    const { orders } = useStore();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (orders && id) {
            // Flexible matching for ID (with or without #)
            const found = orders.find(o => o.id === id || o.id === `#${id}` || o.id === id.replace('#', ''));
            setOrder(found);
        }
    }, [id, orders]);

    if (!order) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Pedido não encontrado</h2>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Não conseguimos encontrar o pedido #{id}.</p>
                <Link to="/">
                    <Button variant="primary">Voltar ao Início</Button>
                </Link>
            </div>
        );
    }

    const statusConfig = getStatusConfig(order.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>
                <ArrowLeft size={20} /> Voltar ao Cardápio
            </Link>

            <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', overflow: 'hidden', border: '1px solid #e5e7eb' }}>

                {/* Status Banner */}
                <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <div className={`${statusConfig.bg} ${statusConfig.color}`} style={{
                        width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
                        backgroundColor: statusConfig.bg.replace('bg-', 'var(--color-bg-)'), // Fallback if classes fail
                        color: statusConfig.color.replace('text-', 'var(--color-text-)')   // Fallback
                    }}>
                        {StatusIcon && <StatusIcon size={40} />}
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111827' }}>
                        {statusConfig.label}
                    </h1>
                    <p style={{ color: '#6b7280' }}>Pedido {order.id}</p>
                </div>

                <div style={{ padding: '2rem' }}>
                    {/* Items */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Resumo do Pedido</h3>
                        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
                            {order.items.map((item, idx) => (
                                <div key={idx} style={{ padding: '1rem', borderBottom: idx < order.items.length - 1 ? '1px solid #f3f4f6' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>{item.quantity}x</span>
                                        {item.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {order.observation && (
                            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fff1f2', borderRadius: '0.5rem', color: '#be123c', fontSize: '0.9rem' }}>
                                <span style={{ fontWeight: 'bold' }}>Nota:</span> {order.observation}
                            </div>
                        )}
                    </div>

                    {/* Delivery Info */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Detalhes da Entrega</h3>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ padding: '0.75rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
                                <MapPin size={24} color="#4b5563" />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, color: '#1f2937' }}>{order.type === 'pickup' ? 'Retirada no Local' : 'Entrega em Domicílio'}</div>
                                <div style={{ color: '#6b7280', marginTop: '0.25rem' }}>{order.customer.address}</div>
                                <div style={{ color: '#6b7280', marginTop: '0.25rem' }}>{order.customer.name} - {order.customer.phone}</div>
                            </div>
                        </div>
                    </div>

                    {/* Total */}
                    <div style={{ borderTop: '2px dashed #e5e7eb', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ color: '#6b7280' }}>
                            Total a pagar ({order.payment?.method === 'money' ? 'Dinheiro' : (order.payment?.method || 'Processando')})
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                            R$ {order.total.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
