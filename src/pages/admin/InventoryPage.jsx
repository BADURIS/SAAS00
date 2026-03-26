import React, { useState } from 'react';
import { AlertTriangle, Package, Check, Save, History, Plus, Search } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import Button from '../../components/shared/Button';

export default function InventoryPage() {
    const { products, inventoryLogs, updateProductStock } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [adjModal, setAdjModal] = useState({ open: false, product: null, amount: '', reason: '' });

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.barcode && p.barcode.includes(searchTerm))
    );

    const handleAdjSubmit = (e) => {
        e.preventDefault();
        if (!adjModal.product) return;
        const newStock = adjModal.product.stock + parseFloat(adjModal.amount);
        updateProductStock(adjModal.product.id, newStock, adjModal.reason);
        setAdjModal({ open: false, product: null, amount: '', reason: '' });
    };

    return (
        <div className="space-y-8 pb-10">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase">Gestão de Estoque</h1>
                    <p className="text-zinc-500 font-medium italic">Controle preciso de insumos e produtos</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar produto ou código..."
                        className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none w-64"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Products Table */}
                <div className="xl:col-span-2 space-y-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                        <table className="w-100 text-left border-collapse">
                            <thead className="bg-zinc-50 border-b border-zinc-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400">Produto</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 text-center">Tipo</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 text-center">Atual</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 text-center">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {filteredProducts.map(product => {
                                    const isLow = product.stock <= product.minStock;
                                    return (
                                        <tr key={product.id} className={`group hover:bg-zinc-50/50 transition-colors ${isLow ? 'bg-red-50/30' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-zinc-100 overflow-hidden border border-zinc-200">
                                                        <img src={product.image} alt="" className="h-full w-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-zinc-900 uppercase text-sm">{product.name}</div>
                                                        <div className="text-[10px] text-zinc-400 font-mono italic">Mín: {product.minStock} {product.unit_type === 'kg' ? 'kg' : 'uni'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-[10px] font-black uppercase bg-zinc-100 px-2 py-1 rounded">
                                                    {product.unit_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`font-mono font-black text-lg ${isLow ? 'text-red-600' : 'text-zinc-600'}`}>
                                                    {product.unit_type === 'kg' ? product.stock.toFixed(3) : product.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {isLow ? (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-red-600 bg-red-100 px-2 py-1 rounded">
                                                        <AlertTriangle size={12} /> Crítico
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 bg-emerald-100 px-2 py-1 rounded">
                                                        <Check size={12} /> Normal
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setAdjModal({ open: true, product, amount: '', reason: '' })}
                                                    className="p-2 hover:bg-zinc-900 hover:text-white rounded-lg transition-all text-zinc-400"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* History Sidebar */}
                <div className="bg-zinc-900 rounded-2xl p-6 text-white shadow-xl h-fit sticky top-8">
                    <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-2 text-red-500">
                        <History size={20} /> Histórico
                    </h2>
                    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {inventoryLogs.slice(0, 20).map(log => {
                            const product = products.find(p => p.id === log.productId);
                            const isSale = log.type === 'sale';
                            return (
                                <div key={log.id} className="border-l-2 border-zinc-800 pl-4 py-1 relative">
                                    <div className={`absolute -left-[5px] top-2 h-2 w-2 rounded-full ${isSale ? 'bg-zinc-600' : 'bg-red-600'}`} />
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {log.type === 'sale' ? 'VENDA' : 'AJUSTE'}
                                            </div>
                                            <div className="font-bold text-xs uppercase mt-1">{product?.name || 'Desconhecido'}</div>
                                            <div className="text-[10px] text-zinc-500 mt-1 italic">{log.reason}</div>
                                        </div>
                                        <div className={`font-mono font-black ${log.changeAmount > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {log.changeAmount > 0 ? '+' : ''}{log.changeAmount.toFixed(product?.unit_type === 'kg' ? 3 : 0)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Adjustment Modal */}
            {adjModal.open && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-zinc-200">
                        <div className="bg-zinc-900 p-6 text-white">
                            <h3 className="text-xl font-black uppercase tracking-tighter">Ajuste de Estoque</h3>
                            <p className="text-zinc-400 text-xs mt-1 uppercase font-bold tracking-widest">{adjModal.product?.name}</p>
                        </div>
                        <form onSubmit={handleAdjSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-1">Quantidade da Mudança</label>
                                <input
                                    type="number"
                                    step="0.001"
                                    required
                                    placeholder="Ex: -2.5 ou 10"
                                    className="w-full text-2xl font-black p-4 bg-zinc-50 border-2 border-zinc-100 rounded-xl focus:border-red-600 outline-none"
                                    value={adjModal.amount}
                                    onChange={e => setAdjModal({ ...adjModal, amount: e.target.value })}
                                />
                                <p className="text-[10px] text-zinc-500 mt-2">Use números negativos para saídas e positivos para entradas.</p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-1">Motivo / Observação</label>
                                <input
                                    placeholder="Ex: Quebra, Devolução, etc."
                                    className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-red-600"
                                    value={adjModal.reason}
                                    onChange={e => setAdjModal({ ...adjModal, reason: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button variant="secondary" className="flex-1" onClick={() => setAdjModal({ open: false, product: null, amount: '', reason: '' })}>Cancelar</Button>
                                <Button variant="primary" className="flex-1" type="submit">Salvar Ajuste</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
