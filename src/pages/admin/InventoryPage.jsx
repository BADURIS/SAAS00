import React from 'react';
import { AlertTriangle, Package, Check, Save } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function InventoryPage() {
    const { products, updateProductStock, updateProductMinStock } = useStore();

    return (
        <div className="text-text-primary">
            <h1 className="text-3xl font-serif font-bold mb-8 text-white tracking-wide">Controle de Estoque</h1>

            <div className="bg-surface rounded-xl border border-surface-light overflow-hidden">
                <table className="w-full border-collapse text-left">
                    <thead className="bg-[#1A1A1A] border-b border-surface-light">
                        <tr>
                            <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Produto</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Estoque Atual</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Estoque Mínimo</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-light/50">
                        {products.map((product) => {
                            const isLowStock = product.stock <= product.minStock;
                            return (
                                <tr key={product.id} className={isLowStock ? 'bg-danger/5' : 'bg-surface hover:bg-surface-light/50 transition-colors'}>
                                    <td className="p-4 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-background bg-cover bg-center border border-surface-light" style={{ backgroundImage: `url(${product.image})` }} />
                                        <span className="font-serif text-white">{product.name}</span>
                                    </td>
                                    <td className="p-4">
                                        <input
                                            type="number"
                                            value={product.stock}
                                            onChange={(e) => updateProductStock(product.id, e.target.value)}
                                            className="w-20 p-2 bg-background border border-surface-light rounded-md font-bold text-white focus:outline-none focus:border-brand/50 transition-colors"
                                        />
                                    </td>
                                    <td className="p-4">
                                        <input
                                            type="number"
                                            value={product.minStock}
                                            onChange={(e) => updateProductMinStock(product.id, e.target.value)}
                                            className="w-20 p-2 bg-background border border-surface-light text-text-primary rounded-md focus:outline-none focus:border-brand/50 transition-colors"
                                        />
                                    </td>
                                    <td className="p-4 text-center">
                                        {isLowStock ? (
                                            <span className="inline-flex items-center gap-1.5 font-bold text-danger bg-danger/10 px-3 py-1 rounded-full text-xs uppercase tracking-wider border border-danger/20">
                                                <AlertTriangle size={14} /> Repor
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 font-bold text-success bg-success/10 px-3 py-1 rounded-full text-xs uppercase tracking-wider border border-success/20">
                                                <Check size={14} /> OK
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 p-4 bg-brand/5 border border-brand/20 rounded-lg text-brand-light text-sm flex items-start gap-3">
                <AlertTriangle size={20} className="shrink-0" />
                <p><strong>Dica:</strong> O estoque é atualizado automaticamente quando um pedido é realizado (pelo site ou pelo PDV).</p>
            </div>
        </div>
    );
}
