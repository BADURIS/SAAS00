import React, { useMemo } from 'react';
import { DollarSign, ShoppingBag, Package, TrendingUp, Clock, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import AnalysisChart from '../../components/shared/AnalysisChart';
import { useStore } from '../../context/StoreContext';

const StatCard = ({ title, value, icon, trend, color = '#dc2626' }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-3xl font-black text-zinc-900 tracking-tighter">{value}</h3>
            </div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}10`, color }}>
                {icon}
            </div>
        </div>
        {trend && (
            <div className="mt-4 flex items-center gap-1 text-sm font-bold">
                {trend.startsWith('+') ? <ArrowUpRight size={16} className="text-emerald-500" /> : <ArrowDownRight size={16} className="text-red-500" />}
                <span className={trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}>{trend}</span>
                <span className="text-zinc-400 font-medium ml-1">vs ontem</span>
            </div>
        )}
    </div>
);

export default function AdminDashboard() {
    const { orders, products } = useStore();

    const stats = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];

        const todayOrders = orders.filter(o => o.date.startsWith(todayStr));
        const revenueToday = todayOrders.reduce((acc, o) => acc + o.total, 0);
        const avgTicket = todayOrders.length > 0 ? revenueToday / todayOrders.length : 0;

        const pendingOrders = orders.filter(o => o.status === 'Pendente').length;

        // Best sellers ranking
        const productSales = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const id = item.product_id || item.id;
                productSales[id] = (productSales[id] || 0) + item.quantity;
            });
        });

        const ranking = Object.entries(productSales)
            .map(([id, qty]) => {
                const product = products.find(p => p.id === parseInt(id));
                return { name: product?.name || 'Desconhecido', qty, id };
            })
            .sort((a, b) => b.qty - a.qty)
            .slice(0, 5);

        return {
            revenueToday,
            revenueTotal: orders.reduce((acc, o) => acc + o.total, 0),
            avgTicket,
            pendingOrders,
            ranking
        };
    }, [orders, products]);

    const paymentChartData = useMemo(() => {
        const data = orders.reduce((acc, order) => {
            const method = order.payment_method || order.payment?.method || 'OUTRO';
            const label = method.toUpperCase();
            acc[label] = (acc[label] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(data).map(([name, value]) => ({ name, value }));
    }, [orders]);

    return (
        <div className="space-y-8 pb-10">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase">Painel de Gestão</h1>
                    <p className="text-zinc-500 font-medium italic">Visão geral da Casa dos Assados</p>
                </div>
                <div className="bg-zinc-900 text-white px-4 py-2 rounded-lg font-mono text-sm">
                    {new Date().toLocaleDateString('pt-BR')}
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Vendas Hoje" value={`R$ ${stats.revenueToday.toFixed(2)}`} icon={<DollarSign size={24} />} trend="+12%" />
                <StatCard title="Ticket Médio" value={`R$ ${stats.avgTicket.toFixed(2)}`} icon={<TrendingUp size={24} />} color="#FF4D00" />
                <StatCard title="Total Acumulado" value={`R$ ${stats.revenueTotal.toFixed(2)}`} icon={<ShoppingBag size={24} />} color="#000" />
                <StatCard title="Pedidos Pendentes" value={stats.pendingOrders} icon={<Clock size={24} />} color="#dc2626" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Payment Methods Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-zinc-100">
                    <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-2">
                        <CreditCard size={20} className="text-red-600" /> Métodos de Pagamento
                    </h2>
                    <div className="h-[300px]">
                        <AnalysisChart data={paymentChartData} title="" type="bar" color="#dc2626" />
                    </div>
                </div>

                {/* Best Sellers Ranking */}
                <div className="bg-zinc-900 p-8 rounded-2xl text-white shadow-xl">
                    <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-2 text-red-500">
                        <Star size={20} /> Top 5 Produtos
                    </h2>
                    <div className="space-y-6">
                        {stats.ranking.map((item, index) => (
                            <div key={item.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <span className="text-zinc-700 font-black text-2xl italic group-hover:text-red-600 transition-colors">0{index + 1}</span>
                                    <div>
                                        <div className="font-bold uppercase text-xs tracking-wider">{item.name}</div>
                                        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{item.qty.toFixed(1)} vendidos</div>
                                    </div>
                                </div>
                                <div className="h-1 w-12 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-600" style={{ width: `${(item.qty / stats.ranking[0].qty) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
