import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
    Clock,
    MapPin,
    Phone,
    User,
    ShoppingBag,
    Truck,
    CheckCircle,
    XCircle,
    ChevronRight,
    Search,
    Filter,
    ArrowRight
} from 'lucide-react';
import Button from '../../components/shared/Button';

const getStatusColor = (status) => {
    switch (status) {
        case 'Pendente': return 'bg-red-600 text-white';
        case 'Em Preparo': return 'bg-orange-500 text-white';
        case 'Rota de Entrega': return 'bg-blue-600 text-white';
        case 'Entregue': return 'bg-emerald-600 text-white';
        case 'Pedido pronto para retirada': return 'bg-purple-600 text-white';
        case 'Pedido retirado': return 'bg-emerald-600 text-white';
        case 'Cancelado': return 'bg-zinc-400 text-white';
        default: return 'bg-zinc-200 text-zinc-600';
    }
};

export default function OrdersPage() {
    const { orders, updateOrderStatus, couriers, deliveryFees, assignCourier } = useStore();
    const [filter, setFilter] = useState('Pendente');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedCourierId, setSelectedCourierId] = useState('');
    const [selectedFeeId, setSelectedFeeId] = useState('');

    const filteredOrders = orders.filter(o => {
        const matchesFilter = filter === 'Todos' || o.status === filter;
        const matchesSearch = o.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.id.includes(searchTerm);
        return matchesFilter && matchesSearch;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const handleNextStatus = (orderId, currentStatus) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        if (order.type === 'delivery' && currentStatus === 'Em Preparo') {
            setSelectedOrderId(orderId);
            setIsAssignModalOpen(true);
            return;
        }

        const flows = {
            pickup: {
                'Pendente': 'Em Preparo',
                'Em Preparo': 'Pedido pronto para retirada',
                'Pedido pronto para retirada': 'Pedido retirado'
            },
            delivery: {
                'Pendente': 'Em Preparo',
                'Rota de Entrega': 'Entregue'
            }
        };

        const nextStatus = flows[order.type][currentStatus];
        if (nextStatus) updateOrderStatus(orderId, nextStatus);
    };

    const confirmAssignment = () => {
        if (!selectedCourierId || !selectedFeeId) return alert('Selecione motoboy e taxa.');
        const fee = deliveryFees.find(f => f.id === parseInt(selectedFeeId));
        assignCourier(selectedOrderId, parseInt(selectedCourierId), fee.price, fee.name);
        updateOrderStatus(selectedOrderId, 'Rota de Entrega');
        setIsAssignModalOpen(false);
    };

    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase">Painel de Pedidos</h1>
                    <p className="text-zinc-500 font-medium italic">Monitoramento em tempo real da produção e entregas</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar pedido ou cliente..."
                            className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-red-600 w-64 text-sm"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {/* Filter Tabs */}
            <div className="flex gap-2 bg-zinc-100 p-1 rounded-xl w-fit">
                {['Pendente', 'Em Preparo', 'Rota de Entrega', 'Entregue', 'Cancelado', 'Todos'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all border-l-4" style={{ borderLeftColor: order.status === 'Pendente' ? '#ef4444' : '#e5e7eb' }}>
                        <div className="p-4 bg-zinc-50 border-b border-zinc-100 flex justify-between items-center">
                            <span className="font-black text-lg tracking-tighter">#{order.id.replace('#', '')}</span>
                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="p-6 flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-zinc-900 uppercase text-sm">{order.customer.name}</h3>
                                    <p className="text-[10px] text-zinc-500 font-medium mt-0.5">{order.customer.phone}</p>
                                </div>
                                <div className={`p-2 rounded-lg ${order.type === 'delivery' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                    {order.type === 'delivery' ? <Truck size={16} /> : <ShoppingBag size={16} />}
                                </div>
                            </div>

                            <div className="bg-zinc-50 rounded-xl p-4 space-y-2">
                                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-2">Itens</h4>
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-xs">
                                        <span className="font-medium text-zinc-700">
                                            <span className="font-black text-zinc-900 mr-1">{item.quantity}x</span> {item.name}
                                        </span>
                                        <span className="font-mono text-zinc-400">R$ {item.subtotal.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            {order.observation && (
                                <div className="text-[10px] bg-red-50 text-red-600 p-3 rounded-lg border border-red-100 italic">
                                    <strong>OBS:</strong> {order.observation}
                                </div>
                            )}

                            <div className="flex justify-between items-end pt-4 border-t border-zinc-100">
                                <div>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Pagamento</p>
                                    <p className="text-xs font-bold text-zinc-600 uppercase italic">{order.payment?.method?.replace('_', ' ') || 'Processando'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total</p>
                                    <p className="text-xl font-black text-zinc-900 tracking-tighter">R$ {order.total.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        {!['Entregue', 'Pedido retirado', 'Cancelado'].includes(order.status) && (
                            <div className="p-4 bg-zinc-900 flex gap-2">
                                <button
                                    onClick={() => handleNextStatus(order.id, order.status)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                                >
                                    Avançar Status <ChevronRight size={14} />
                                </button>
                                <button className="p-3 bg-zinc-800 text-zinc-400 hover:text-red-500 rounded-xl transition-all border border-zinc-700">
                                    <XCircle size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Assignment Modal */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="bg-zinc-900 p-6 text-white">
                            <h3 className="text-xl font-black uppercase tracking-tighter">Atribuir Entrega</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-1">Selecione o Motoboy</label>
                                <select
                                    className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-bold text-sm"
                                    value={selectedCourierId}
                                    onChange={e => setSelectedCourierId(e.target.value)}
                                >
                                    <option value="">Selecione...</option>
                                    {couriers.filter(c => c.active).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-1">Taxa de Entrega</label>
                                <select
                                    className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl outline-none font-bold text-sm"
                                    value={selectedFeeId}
                                    onChange={e => setSelectedFeeId(e.target.value)}
                                >
                                    <option value="">Selecione...</option>
                                    {deliveryFees.map(f => <option key={f.id} value={f.id}>{f.name} - R$ {f.price.toFixed(2)}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button variant="secondary" className="flex-1" onClick={() => setIsAssignModalOpen(false)}>Cancelar</Button>
                                <Button variant="primary" className="flex-1" onClick={confirmAssignment}>Confirmar e Enviar</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
