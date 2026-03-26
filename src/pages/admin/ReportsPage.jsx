import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import {
    TrendingUp,
    Calendar,
    DollarSign,
    Users,
    ChevronDown,
    Filter,
    FileText,
    ArrowUpRight,
    ArrowDownRight,
    Search
} from 'lucide-react';
import AnalysisChart from '../../components/shared/AnalysisChart';

export default function ReportsPage() {
    const { orders, products } = useStore();
    const [filterDays, setFilterDays] = useState(7);

    // Calculate metrics based on period
    const stats = useMemo(() => {
        const now = new Date();
        const periodStart = new Date(now.setDate(now.getDate() - filterDays));

        const periodOrders = orders.filter(o =>
            new Date(o.createdAt) >= periodStart &&
            o.status !== 'Cancelado'
        );

        const totalRevenue = periodOrders.reduce((acc, current) => acc + current.total, 0);
        const avgTicket = periodOrders.length > 0 ? totalRevenue / periodOrders.length : 0;

        // Product Ranking
        const productSales = {};
        periodOrders.forEach(order => {
            order.items.forEach(item => {
                const pid = item.id;
                if (!productSales[pid]) productSales[pid] = { name: item.name, qty: 0, revenue: 0 };
                productSales[pid].qty += item.quantity;
                productSales[pid].revenue += item.subtotal;
            });
        });

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Revenue over time (Mocking days based on period)
        const dailyRevenue = {};
        periodOrders.forEach(o => {
            const dateStr = new Date(o.createdAt).toLocaleDateString();
            dailyRevenue[dateStr] = (dailyRevenue[dateStr] || 0) + o.total;
        });

        const chartData = Object.entries(dailyRevenue).map(([name, value]) => ({ name, value }));

        return {
            totalRevenue,
            orderCount: periodOrders.length,
            avgTicket,
            topProducts,
            chartData
        };
    }, [orders, filterDays]);

    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase">Inteligência de Vendas</h1>
                    <p className="text-zinc-500 font-medium italic">Relatórios consolidados e performance financeira</p>
                </div>
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-zinc-200 shadow-sm">
                    {[1, 7, 30, 90].map(days => (
                        <button
                            key={days}
                            onClick={() => setFilterDays(days)}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filterDays === days
                                ? 'bg-zinc-900 text-white shadow-lg'
                                : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600'
                                }`}
                        >
                            {days === 1 ? 'Hoje' : `${days} Dias`}
                        </button>
                    ))}
                </div>
            </header>

            {/* Top Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Faturamento Total"
                    value={`R$ ${stats.totalRevenue.toLocaleString()}`}
                    icon={<DollarSign className="text-emerald-500" />}
                    trend="+12.5%"
                    isUp={true}
                />
                <StatCard
                    title="Volume de Pedidos"
                    value={stats.orderCount}
                    icon={<TrendingUp className="text-blue-500" />}
                    trend="+5.2%"
                    isUp={true}
                />
                <StatCard
                    title="Ticket Médio"
                    value={`R$ ${stats.avgTicket.toFixed(2)}`}
                    icon={<Users className="text-orange-500" />}
                    trend="-2.1%"
                    isUp={false}
                />
                <div className="bg-zinc-900 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Ações Rápidas</p>
                        <FileText size={18} className="text-red-500" />
                    </div>
                    <div className="mt-4 space-y-2">
                        <button className="w-full py-2 bg-zinc-800 hover:bg-red-600 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all">Exportar PDF</button>
                        <button className="w-full py-2 bg-zinc-800 hover:bg-red-600 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all">Exportar Excel</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="xl:col-span-2">
                    <AnalysisChart
                        data={stats.chartData}
                        title="Faturamento no Período"
                        color="#ef4444"
                    />
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm h-fit">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black uppercase tracking-tighter text-zinc-900">Top 5 Produtos</h3>
                        <Filter size={14} className="text-zinc-400" />
                    </div>
                    <div className="space-y-4">
                        {stats.topProducts.map((product, idx) => (
                            <div key={idx} className="flex items-center gap-4 group">
                                <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center font-black text-xs text-zinc-500 border border-zinc-200 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                    {idx + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-bold uppercase truncate max-w-[150px]">{product.name}</div>
                                    <div className="text-[10px] text-zinc-400 font-mono italic">
                                        R$ {product.revenue.toFixed(2)}
                                    </div>
                                </div>
                                <div className="text-xs font-black text-zinc-900">
                                    {product.qty}x
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Table (Optional Focus) */}
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900">Resumo de Pagamentos</h3>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-zinc-50 text-[10px] font-black uppercase text-zinc-400">
                        <tr>
                            <th className="px-6 py-4">Método</th>
                            <th className="px-6 py-4 text-center">Transações</th>
                            <th className="px-6 py-4 text-right">Total Bruto</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50 text-sm">
                        {['cartao_credito', 'cartao_debito', 'pix', 'dinheiro'].map(method => {
                            const methodOrders = orders.filter(o => o.payment?.method === method && o.status !== 'Cancelado');
                            const total = methodOrders.reduce((acc, o) => acc + o.total, 0);
                            return (
                                <tr key={method} className="hover:bg-zinc-50 transition-colors">
                                    <td className="px-6 py-4 font-bold uppercase text-zinc-600 text-xs">
                                        {method.replace('_', ' ')}
                                    </td>
                                    <td className="px-6 py-4 text-center font-mono">
                                        {methodOrders.length}
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-zinc-900">
                                        R$ {total.toFixed(2)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend, isUp }) {
    return (
        <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm transition-all hover:shadow-md group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                    {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {trend}
                </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{title}</p>
            <h3 className="text-2xl font-black text-zinc-900 tracking-tighter">{value}</h3>
        </div>
    );
}
