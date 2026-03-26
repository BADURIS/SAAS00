import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Clock, MapPin, Phone, User, ShoppingBag, Truck, CheckCircle, XCircle } from 'lucide-react';
import Button from '../../components/shared/Button';

const getStatusColor = (status) => {
    switch (status) {
        case 'Pendente': return 'bg-danger/10 text-danger border-danger/20';
        case 'Em Preparo': return 'bg-warning/10 text-warning border-warning/20';
        case 'Rota de Entrega': return 'bg-info/10 text-info border-info/20';
        case 'Entregue': return 'bg-success/10 text-success border-success/20';
        case 'Pedido pronto para retirada': return 'bg-[#B0B0B0]/10 text-[#B0B0B0] border-[#B0B0B0]/20';
        case 'Pedido retirado': return 'bg-success/10 text-success border-success/20';
        case 'Cancelado': return 'bg-surface-light text-text-muted border-surface';
        default: return 'bg-surface-light text-text-muted border-surface';
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
        // Extract number from "#123"
        const idA = parseInt(a.id.replace('#', '')) || 0;
        const idB = parseInt(b.id.replace('#', '')) || 0;
        return idB - idA;
    });

    return (
        <div className="text-text-primary">
            {/* Modal for Courier Assignment */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-surface p-8 rounded-xl w-[90%] max-w-[400px] border border-surface-light shadow-xl">
                        <h2 className="text-xl font-serif text-white mb-6">Atribuir Entrega</h2>

                        <div className="mb-4">
                            <label className="block mb-2 text-xs font-bold tracking-widest uppercase text-text-secondary">Motoboy</label>
                            <select
                                value={selectedCourierId}
                                onChange={(e) => setSelectedCourierId(e.target.value)}
                                className="w-full p-2.5 bg-background border border-surface-light rounded-lg text-text-primary focus:outline-none focus:border-brand/50"
                            >
                                <option value="">Selecione...</option>
                                {couriers.filter(c => c.active).map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-8">
                            <label className="block mb-2 text-xs font-bold tracking-widest uppercase text-text-secondary">Taxa de Entrega</label>
                            <select
                                value={selectedFeeId}
                                onChange={(e) => setSelectedFeeId(e.target.value)}
                                className="w-full p-2.5 bg-background border border-surface-light rounded-lg text-text-primary focus:outline-none focus:border-brand/50"
                            >
                                <option value="">Selecione...</option>
                                {deliveryFees.map(f => (
                                    <option key={f.id} value={f.id}>{f.name} - R$ {f.price.toFixed(2)}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-4 justify-end">
                            <button onClick={() => setIsAssignModalOpen(false)} className="px-4 py-2 text-sm font-bold tracking-widest uppercase text-text-secondary hover:text-white transition-colors">Cancelar</button>
                            <Button variant="primary" onClick={confirmAssignment}>Confirmar e Enviar</Button>
                        </div>
                    </div>
                </div>
            )}

            <h1 className="text-3xl font-serif font-bold text-white mb-8 tracking-wide">Gestão de Pedidos</h1>

            {sortedOrders.length === 0 ? (
                <div className="p-12 text-center text-text-muted bg-surface rounded-xl border border-surface-light">
                    <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="font-serif">Nenhum pedido realizado ainda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedOrders.map((order) => (
                        <div key={order.id} className="bg-surface rounded-xl border border-surface-light overflow-hidden flex flex-col transition-colors hover:border-brand/30">
                            {/* Header */}
                            <div className="p-4 border-b border-surface-light flex justify-between items-center bg-[#1A1A1A]">
                                <div className="font-serif font-bold text-lg text-white">{order.id}</div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                    {getStatusLabel(order.status)}
                                </span>
                            </div>

                            <div className="p-6 flex-1">
                                {/* Customer Info */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-2 text-white font-medium">
                                        <User size={16} className="text-brand" />
                                        {order.customer.name}
                                    </div>
                                    <div className="flex items-center gap-2 mb-2 text-text-secondary text-sm">
                                        <Phone size={14} />
                                        {order.customer.phone}
                                    </div>
                                    <div className="flex items-start gap-2 text-text-secondary text-sm">
                                        <MapPin size={14} className="mt-1 shrink-0" />
                                        <span className="flex-1 leading-snug">{order.customer.address}</span>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="mb-6 bg-background p-4 rounded-lg border border-surface-light">
                                    <h4 className="text-[10px] font-bold text-text-muted mb-3 uppercase tracking-widest">Itens do Pedido</h4>
                                    <ul className="space-y-3">
                                        {order.items.map((item, idx) => (
                                            <li key={idx} className="flex flex-col text-sm border-b border-surface/50 pb-2 last:border-0 last:pb-0">
                                                <div className="flex justify-between text-text-primary">
                                                    <span><span className="font-bold text-brand">{item.quantity}x</span> {item.name}</span>
                                                </div>
                                                {item.observation && (
                                                    <span className="text-xs text-danger italic mt-1 ml-6">
                                                        Obs: {item.observation}
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                    {order.observation && (
                                        <div className="mt-3 pt-3 border-t border-surface-light text-sm text-brand-light">
                                            <span className="font-bold uppercase text-[10px] tracking-widest">Obs:</span> {order.observation}
                                        </div>
                                    )}
                                    {order.status === 'Cancelado' && order.cancellationReason && (
                                        <div className="mt-3 pt-3 border-t border-danger/30 text-sm text-danger bg-danger/5 p-3 rounded-lg">
                                            <span className="font-bold uppercase text-[10px] tracking-widest block mb-1">PEDIDO CANCELADO</span>
                                            Motivo: {order.cancellationReason}
                                        </div>
                                    )}
                                </div>

                                {/* Payment & Total */}
                                <div className="flex justify-between items-end border-t border-surface-light pt-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="text-xs text-text-secondary font-bold uppercase tracking-widest bg-surface-light px-2 py-1 rounded inline-block w-fit">
                                            {order.payment.method === 'money' ? 'Dinheiro' : order.payment.method}
                                        </div>
                                        {order.payment.change > 0 && <div className="text-xs text-text-muted">Troco p/ R$ {order.payment.change}</div>}
                                    </div>
                                    <div className="text-xl font-serif font-bold text-brand">
                                        R$ {order.total.toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            {order.status !== 'Entregue' && order.status !== 'Pedido retirado' && order.status !== 'Cancelado' && order.status !== 'Finalizado' && (
                                <div className="p-4 bg-[#1A1A1A] border-t border-surface-light flex gap-3">
                                    <button
                                        onClick={() => handleNextStatus(order.id, order.status)}
                                        className="flex-1 bg-brand hover:bg-brand-light text-background font-bold tracking-widest uppercase text-[10px] py-3 rounded transition-colors shadow-[0_0_15px_rgba(230,138,92,0.1)] hover:shadow-[0_0_20px_rgba(230,138,92,0.2)]"
                                    >
                                        Avançar Status
                                    </button>
                                    <button
                                        onClick={() => handleCancel(order.id)}
                                        className="p-3 rounded border border-danger/50 text-danger hover:bg-danger hover:text-white transition-colors"
                                        title="Cancelar Pedido"
                                    >
                                        <XCircle size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
