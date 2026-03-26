import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Clock, MapPin, Phone, User, ShoppingBag, Truck, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import Button from '../../components/shared/Button';

// Neon-styled dark theme status labels
const getStatusColor = (status) => {
    switch (status) {
        case 'Pendente': return 'bg-danger/10 text-danger border-[0.5px] border-danger/30';
        case 'Em Preparo': return 'bg-warning/10 text-warning border-[0.5px] border-warning/30';
        case 'Rota de Entrega': return 'bg-info/10 text-info border-[0.5px] border-info/30';
        case 'Entregue': return 'bg-success/10 text-success border-[0.5px] border-success/30';
        case 'Pedido pronto para retirada': return 'bg-[#B0B0B0]/10 text-[#B0B0B0] border-[0.5px] border-[#B0B0B0]/30';
        case 'Pedido retirado': return 'bg-success/10 text-success border-[0.5px] border-success/30';
        case 'Cancelado': return 'bg-surface-light text-text-muted border-[0.5px] border-surface-light';
        default: return 'bg-surface-light text-text-muted border-[0.5px] border-surface-light';
    }
};

const getStatusLabel = (status) => {
    return status;
};

export default function OrdersPage() {
    const { orders, updateOrderStatus, couriers, deliveryFees, assignCourier } = useStore();

    // State for Courier Assignment Modal
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedCourierId, setSelectedCourierId] = useState('');
    const [selectedFeeId, setSelectedFeeId] = useState('');

    const handleNextStatus = (orderId, currentStatus) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        let nextStatus = currentStatus;

        if (order.type === 'pickup') {
            const pickupFlow = {
                'Pendente': 'Em Preparo',
                'Em Preparo': 'Pedido pronto para retirada',
                'Pedido pronto para retirada': 'Pedido retirado'
            };
            nextStatus = pickupFlow[currentStatus];
            if (nextStatus) updateOrderStatus(orderId, nextStatus);
        } else {
            // Delivery Flow
            if (currentStatus === 'Em Preparo') {
                // Moving to 'Rota de Entrega' -> Open Assignment Modal
                setSelectedOrderId(orderId);
                // Pre-fill fee if available from order
                if (order.deliveryFeeId) {
                    setSelectedFeeId(order.deliveryFeeId);
                } else {
                    setSelectedFeeId('');
                }
                setIsAssignModalOpen(true);
                return;
            }

            const deliveryFlow = {
                'Pendente': 'Em Preparo',
                'Rota de Entrega': 'Entregue'
            };
            nextStatus = deliveryFlow[currentStatus];
            if (nextStatus) updateOrderStatus(orderId, nextStatus);
        }
    };

    const confirmAssignment = () => {
        if (!selectedCourierId || !selectedFeeId) {
            alert('Por favor, selecione um motoboy e uma taxa de entrega.');
            return;
        }

        const fee = deliveryFees.find(f => f.id === parseInt(selectedFeeId));
        const feeValue = fee ? fee.price : 0;
        const feeName = fee ? fee.name : '';

        assignCourier(selectedOrderId, parseInt(selectedCourierId), feeValue, feeName);
        updateOrderStatus(selectedOrderId, 'Rota de Entrega');

        // Reset and close
        setIsAssignModalOpen(false);
        setSelectedOrderId(null);
        setSelectedCourierId('');
        setSelectedFeeId('');
    };

    const handleCancel = (orderId) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        // Restriction: Only 'Pendente' or 'Em Preparo' can be canceled
        if (order.status !== 'Pendente' && order.status !== 'Em Preparo') {
            alert('Este pedido já saiu para entrega ou foi finalizado e não pode ser cancelado.');
            return;
        }

        if (window.confirm('Tem certeza que deseja cancelar este pedido?')) {
            const reason = window.prompt('Por qual motivo você está cancelando este pedido?');
            if (reason) {
                updateOrderStatus(orderId, 'Cancelado', reason);
            }
        }
    };

    // Sort orders by ID (newest first assuming ID increments) or Date if available
    const sortedOrders = [...orders].sort((a, b) => {
        const idA = parseInt(a.id.replace('#', '')) || 0;
        const idB = parseInt(b.id.replace('#', '')) || 0;
        return idB - idA;
    });

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-text-primary p-6 md:p-12 font-sans pb-32">
            
            {/* Modal for Courier Assignment */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50">
                    <div className="bg-[#111] p-8 rounded-none w-[90%] max-w-[450px] border border-surface shadow-2xl">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-surface-light">
                            <Truck className="text-brand" size={24} />
                            <h2 className="text-2xl font-serif text-white tracking-wide">Despachar Pedido</h2>
                        </div>

                        <div className="mb-6">
                            <label className="block mb-2 text-[10px] font-bold tracking-widest uppercase text-text-muted">Motoboy Designado</label>
                            <select
                                value={selectedCourierId}
                                onChange={(e) => setSelectedCourierId(e.target.value)}
                                className="w-full p-4 bg-[#0a0a0a] border border-surface rounded-none text-white focus:outline-none focus:border-brand font-serif text-lg transition-colors"
                            >
                                <option value="">Selecionar Piloto...</option>
                                {couriers.filter(c => c.active).map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-10">
                            <label className="block mb-2 text-[10px] font-bold tracking-widest uppercase text-text-muted">Taxa Regional</label>
                            <select
                                value={selectedFeeId}
                                onChange={(e) => setSelectedFeeId(e.target.value)}
                                className="w-full p-4 bg-[#0a0a0a] border border-surface rounded-none text-white focus:outline-none focus:border-brand font-serif text-lg transition-colors"
                            >
                                <option value="">Selecionar Zona...</option>
                                {deliveryFees.map(f => (
                                    <option key={f.id} value={f.id}>{f.name} - R$ {f.price.toFixed(2)}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-4 justify-end">
                            <button onClick={() => setIsAssignModalOpen(false)} className="px-6 py-3 text-sm font-bold tracking-widest uppercase text-text-muted hover:text-white transition-colors">Cancelar</button>
                            <button 
                                onClick={confirmAssignment} 
                                className="px-8 py-3 bg-brand text-background font-bold tracking-widest uppercase text-sm hover:bg-brand-light transition-colors shadow-[0_0_15px_rgba(230,138,92,0.1)] hover:shadow-[0_0_20px_rgba(230,138,92,0.3)]"
                            >
                                Enviar Retirada
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="mb-12 border-b border-surface-light pb-8">
                <p className="text-brand font-bold tracking-[0.3em] uppercase text-[10px] mb-4 flex items-center gap-2">
                    <Clock size={12} /> Dispatch Center
                </p>
                <div className="flex flex-col md:flex-row md:items-end justify-between">
                    <h1 className="text-white font-serif text-4xl md:text-5xl tracking-wide">
                        Gestão de <span className="italic text-brand-light">Pedidos</span>
                    </h1>
                    <p className="text-text-muted text-sm tracking-widest uppercase mt-4 md:mt-0">
                        {sortedOrders.length} TICKETS ATIVOS
                    </p>
                </div>
            </header>

            {sortedOrders.length === 0 ? (
                <div className="p-20 text-center text-text-muted bg-[#111] border border-surface flex flex-col items-center">
                    <ShoppingBag size={48} className="mb-6 opacity-30 text-white" />
                    <p className="font-serif text-2xl text-white italic mb-2">A cozinha está vazia.</p>
                    <p className="text-xs uppercase tracking-widest">Aguardando novos pedidos entrarem no sistema.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {sortedOrders.map((order) => {
                        const courier = couriers.find(c => c.id === order.courierId);
                        
                        return (
                        <div key={order.id} className="bg-[#151515] border border-surface overflow-hidden flex flex-col group hover:border-surface-light transition-colors relative shadow-2xl">
                            {/* Tape Effect on top for visual flair */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-2 bg-gradient-to-b from-black/50 to-transparent opacity-50 z-10" />

                            {/* Ticket Header */}
                            <div className="p-6 border-b border-dashed border-surface-light flex justify-between items-start bg-black/20">
                                <div>
                                    <div className="font-serif text-4xl text-white tracking-tighter mb-1">{order.id}</div>
                                    <div className="text-text-muted text-[10px] uppercase tracking-widest">{new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                    <span className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] ${getStatusColor(order.status)}`}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                    <span className="text-text-muted text-[10px] uppercase tracking-widest bg-surface/50 px-2 py-1">
                                        {order.type === 'pickup' ? 'Retirada' : 'Entrega'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 flex-1">
                                {/* Customer Info */}
                                <div className="mb-8">
                                    <h3 className="text-brand text-[10px] font-bold tracking-[0.2em] uppercase mb-4">Dados do Cliente</h3>
                                    <div className="flex items-center gap-3 mb-3 text-white font-serif text-lg">
                                        <User size={16} className="text-text-muted" />
                                        {order.customer.name}
                                    </div>
                                    <div className="flex items-center gap-3 mb-3 text-text-secondary text-sm">
                                        <Phone size={14} className="text-text-muted" />
                                        <span className="font-mono text-xs">{order.customer.phone}</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-text-secondary text-sm">
                                        <MapPin size={14} className="mt-1 shrink-0 text-text-muted" />
                                        <span className="flex-1 leading-relaxed opacity-80">{order.customer.address}</span>
                                    </div>
                                </div>

                                {/* Order Items (Receipt Style) */}
                                <div className="mb-8 bg-[#0a0a0a] border border-surface p-5">
                                    <h4 className="text-[10px] font-bold text-text-muted mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                                        Resumo da Comanda
                                    </h4>
                                    <ul className="space-y-4">
                                        {order.items.map((item, idx) => (
                                            <li key={idx} className="flex flex-col">
                                                <div className="flex justify-between items-start text-white/90">
                                                    <span className="font-serif text-lg leading-tight">
                                                        <span className="text-brand mr-2 text-sm">{item.quantity}x</span> 
                                                        {item.name}
                                                    </span>
                                                </div>
                                                {item.observation && (
                                                    <span className="text-xs text-brand-light italic mt-1.5 ml-6 border-lborder-brand-light/30 pl-3">
                                                        Obs: {item.observation}
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                    {order.observation && (
                                        <div className="mt-5pt-5 border-t border-surface border-dashed">
                                            <div className="text-xs text-white/80 italic">
                                                <span className="text-brand font-sans font-bold uppercase text-[10px] tracking-widest mr-2 not-italic">Atenção Geral:</span> 
                                                {order.observation}
                                            </div>
                                        </div>
                                    )}
                                    {order.status === 'Cancelado' && order.cancellationReason && (
                                        <div className="mt-5 pt-5 border-t border-danger/30 text-xs text-danger">
                                            <span className="font-bold uppercase tracking-widest block mb-1">Motivo do Cancelamento:</span>
                                            {order.cancellationReason}
                                        </div>
                                    )}
                                </div>

                                {/* Courier Assignment View */}
                                {order.type === 'delivery' && courier && (
                                    <div className="mb-8 flex items-center justify-between bg-surface/30 border border-surface-light p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center border border-brand/20">
                                                <Truck size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Motorista</p>
                                                <p className="text-white font-serif tracking-wide">{courier.name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Zona</p>
                                            <p className="text-white font-mono text-xs">{order.deliveryZone || 'Padrão'}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Payment & Total */}
                                <div className="border-t border-surface pt-6 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1">Método</p>
                                        <p className="text-white font-serif">{order.payment.method === 'money' ? 'Dinheiro' : order.payment.method}</p>
                                        {order.payment.change > 0 && <p className="text-xs text-text-muted mt-1 font-mono">Troco p/ R$ {order.payment.change}</p>}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1">Total</p>
                                        <p className="text-3xl font-serif font-bold text-brand">
                                            <span className="text-lg mr-1 text-text-muted">R$</span>
                                            {order.total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Footer */}
                            {order.status !== 'Entregue' && order.status !== 'Pedido retirado' && order.status !== 'Cancelado' && order.status !== 'Finalizado' && (
                                <div className="bg-black/40 border-t border-surface-light flex">
                                    <button
                                        onClick={() => handleNextStatus(order.id, order.status)}
                                        className="flex-1 bg-transparent hover:bg-brand/10 text-brand font-bold tracking-[0.2em] uppercase text-[10px] py-5 transition-colors border-r border-surface-light flex justify-center items-center gap-2"
                                    >
                                        <ArrowRight size={14} /> Avançar Status
                                    </button>
                                    <button
                                        onClick={() => handleCancel(order.id)}
                                        className="px-6 text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                                        title="Cancelar Pedido"
                                    >
                                        <XCircle size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )})}
                </div>
            )}
        </div>
    );
}
