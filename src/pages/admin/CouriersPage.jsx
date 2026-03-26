import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import Button from '../../components/shared/Button';
import { Bike, Plus, Trash2, DollarSign, FileText } from 'lucide-react';

export default function CouriersPage() {
    const { couriers, deliveryFees, orders, addCourier, removeCourier, addDeliveryFee, removeDeliveryFee } = useStore();
    const [activeTab, setActiveTab] = useState('couriers'); // couriers, fees, report

    // Local state for forms
    const [newCourierName, setNewCourierName] = useState('');
    const [newFeeName, setNewFeeName] = useState('');
    const [newFeePrice, setNewFeePrice] = useState('');

    const handleAddCourier = (e) => {
        e.preventDefault();
        addCourier(newCourierName);
        setNewCourierName('');
    };

    const handleAddFee = (e) => {
        e.preventDefault();
        addDeliveryFee(newFeeName, newFeePrice);
        setNewFeeName('');
        setNewFeePrice('');
    };

    // Calculate Report Data
    const getReportData = () => {
        return couriers.map(courier => {
            const courierOrders = orders.filter(o => o.courierId === courier.id);
            const totalDeliveries = courierOrders.length;
            const totalEarnings = courierOrders.reduce((acc, o) => acc + (o.deliveryFee || 0), 0);

            // Collect unique zones
            const zones = [...new Set(courierOrders.map(o => o.deliveryZone).filter(Boolean))];

            return { ...courier, totalDeliveries, totalEarnings, zones };
        });
    };

    return (
        <div className="text-text-primary">
            <div className="flex items-center gap-4 mb-10">
                <Bike size={32} className="text-brand" />
                <h1 className="text-3xl font-serif font-bold text-white uppercase tracking-wide">Gestão de Motoboys</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-surface-light">
                <button
                    onClick={() => setActiveTab('couriers')}
                    className={`pb-4 px-2 font-bold text-sm tracking-widest uppercase transition-colors border-b-2
                        ${activeTab === 'couriers' ? 'border-brand text-brand' : 'border-transparent text-text-muted hover:text-white'}
                    `}
                >
                    Motoboys
                </button>
                <button
                    onClick={() => setActiveTab('fees')}
                    className={`pb-4 px-2 font-bold text-sm tracking-widest uppercase transition-colors border-b-2
                        ${activeTab === 'fees' ? 'border-brand text-brand' : 'border-transparent text-text-muted hover:text-white'}
                    `}
                >
                    Taxas de Entrega
                </button>
                <button
                    onClick={() => setActiveTab('report')}
                    className={`pb-4 px-2 font-bold text-sm tracking-widest uppercase transition-colors border-b-2
                        ${activeTab === 'report' ? 'border-brand text-brand' : 'border-transparent text-text-muted hover:text-white'}
                    `}
                >
                    Relatório
                </button>
            </div>

            {/* Content */}
            <div className="bg-surface p-8 rounded-xl border border-surface-light">

                {/* 1. Motoboys Tab */}
                {activeTab === 'couriers' && (
                    <div>
                        <form onSubmit={handleAddCourier} className="flex gap-4 mb-8">
                            <input
                                type="text"
                                placeholder="Nome do Motoboy"
                                value={newCourierName}
                                onChange={(e) => setNewCourierName(e.target.value)}
                                className="flex-1 p-3 bg-background border border-surface-light rounded-lg text-white focus:outline-none focus:border-brand/50 transition-colors"
                                required
                            />
                            <Button variant="primary" type="submit" className="flex items-center gap-2">
                                <Plus size={20} /> Adicionar
                            </Button>
                        </form>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {couriers.map(courier => (
                                <div key={courier.id} className="p-4 bg-[#1A1A1A] border border-surface-light rounded-lg flex justify-between items-center group transition-colors hover:border-brand/30">
                                    <span className="font-semibold text-white">{courier.name}</span>
                                    <button
                                        onClick={() => removeCourier(courier.id)}
                                        className="text-text-muted hover:text-danger transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {couriers.length === 0 && <p className="col-span-full text-text-muted italic">Nenhum motoboy cadastrado.</p>}
                        </div>
                    </div>
                )}

                {/* 2. Fees Tab */}
                {activeTab === 'fees' && (
                    <div>
                        <form onSubmit={handleAddFee} className="flex flex-wrap gap-4 mb-8">
                            <input
                                type="text"
                                placeholder="Local / Bairro"
                                value={newFeeName}
                                onChange={(e) => setNewFeeName(e.target.value)}
                                className="flex-[2] min-w-[200px] p-3 bg-background border border-surface-light rounded-lg text-white focus:outline-none focus:border-brand/50 transition-colors"
                                required
                            />
                            <div className="relative flex-1 min-w-[150px]">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">R$</span>
                                <input
                                    type="number"
                                    placeholder="Valor"
                                    value={newFeePrice}
                                    onChange={(e) => setNewFeePrice(e.target.value)}
                                    step="0.50"
                                    className="w-full py-3 pr-3 pl-10 bg-background border border-surface-light rounded-lg text-white focus:outline-none focus:border-brand/50 transition-colors"
                                    required
                                />
                            </div>
                            <Button variant="primary" type="submit" className="flex items-center gap-2">
                                <Plus size={20} /> Adicionar Taxa
                            </Button>
                        </form>

                        <div className="flex flex-col gap-3">
                            {deliveryFees.map(fee => (
                                <div key={fee.id} className="p-4 bg-[#1A1A1A] border border-surface-light rounded-lg flex justify-between items-center group transition-colors hover:border-brand/30">
                                    <span className="font-semibold text-white">{fee.name}</span>
                                    <div className="flex items-center gap-6">
                                        <span className="text-brand font-bold text-lg">R$ {fee.price.toFixed(2)}</span>
                                        <button
                                            onClick={() => removeDeliveryFee(fee.id)}
                                            className="text-text-muted hover:text-danger transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. Report Tab */}
                {activeTab === 'report' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-surface">
                                    <th className="pb-4 text-[10px] uppercase tracking-widest text-text-muted font-bold w-1/4">Motoboy</th>
                                    <th className="pb-4 text-[10px] uppercase tracking-widest text-text-muted font-bold">Locais de Entrega</th>
                                    <th className="pb-4 text-[10px] uppercase tracking-widest text-text-muted font-bold text-center">Entregas</th>
                                    <th className="pb-4 text-[10px] uppercase tracking-widest text-text-muted font-bold text-right">Total Ganho</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getReportData().map(data => (
                                    <tr key={data.id} className="border-b border-surface-light/50 hover:bg-surface-light/20 transition-colors">
                                        <td className="py-4 font-serif text-white">{data.name}</td>
                                        <td className="py-4">
                                            {data.zones.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {data.zones.map((zone, idx) => (
                                                        <span key={idx} className="bg-background text-text-secondary px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider border border-surface-light">
                                                            {zone}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-text-muted italic text-sm">-</span>
                                            )}
                                        </td>
                                        <td className="py-4 text-center">
                                            <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-xs font-bold border border-brand/20">
                                                {data.totalDeliveries}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right font-bold text-brand-light">
                                            R$ {data.totalEarnings.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                {couriers.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-text-muted italic">Nenhum dado disponível.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
