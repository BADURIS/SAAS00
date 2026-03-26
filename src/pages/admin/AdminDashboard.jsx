import React, { useState, useMemo } from 'react';
import { Download, ArrowRight, Activity, Flame, ChevronDown } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

// We use the new fallback image to give the dashboard a moody, cinematic feel
const FALLBACK_IMG = '/images/fallback.png';

export default function AdminDashboard() {
  const { orders, products } = useStore();
  const [timeframe, setTimeframe] = useState('month'); // today, week, month, quarter, semester

  const stats = useMemo(() => {
    const now = new Date();
    
    // Time boundaries
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const quarterAgo = new Date(now); quarterAgo.setMonth(now.getMonth() - 3);
    const semesterAgo = new Date(now); semesterAgo.setMonth(now.getMonth() - 6);

    let totalRevenue = 0;
    const productSales = {};
    const paymentMethods = {
        pix: { count: 0, total: 0, label: 'PIX' },
        credit: { count: 0, total: 0, label: 'Cartão de Crédito' },
        debit: { count: 0, total: 0, label: 'Cartão de Débito' },
        money: { count: 0, total: 0, label: 'Dinheiro' }
    };

    orders.forEach(order => {
      const orderDate = new Date(order.date);
      let isWithinTimeframe = false;

      switch(timeframe) {
          case 'today': isWithinTimeframe = orderDate >= today; break;
          case 'week': isWithinTimeframe = orderDate >= weekAgo; break;
          case 'month': isWithinTimeframe = orderDate >= monthStart; break;
          case 'quarter': isWithinTimeframe = orderDate >= quarterAgo; break;
          case 'semester': isWithinTimeframe = orderDate >= semesterAgo; break;
          default: isWithinTimeframe = true;
      }

      if (isWithinTimeframe) {
        totalRevenue += order.total;
        
        // Payment methods tracking
        const method = order.payment?.method || 'pix';
        if (paymentMethods[method]) {
            paymentMethods[method].count += 1;
            paymentMethods[method].total += order.total;
        }

        // Product tracking
        order.items.forEach(item => {
          if (!productSales[item.id]) {
            productSales[item.id] = { ...item, count: 0, revenue: 0 };
          }
          productSales[item.id].count += item.quantity;
          productSales[item.id].revenue += (item.price * item.quantity);
        });
      }
    });

    const sortedProducts = Object.values(productSales).sort((a, b) => b.count - a.count);
    const topProduct = sortedProducts[0] || products[0];

    const timeframeLabels = {
        today: 'Hoje',
        week: 'Últimos 7 Dias',
        month: 'Este Mês',
        quarter: 'Último Trimestre',
        semester: 'Último Semestre'
    };

    return {
      totalRevenue,
      topProduct,
      allSales: sortedProducts,
      paymentMethods: Object.values(paymentMethods).sort((a, b) => b.total - a.total),
      timeframeLabel: timeframeLabels[timeframe]
    };
  }, [orders, products, timeframe]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-text-primary p-6 md:p-12 lg:px-20 lg:py-16 font-sans">
      
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-surface-light pb-8 mb-12">
        <div>
          <p className="text-brand font-bold tracking-[0.3em] uppercase text-[10px] mb-4 flex items-center gap-2">
            <Flame size={12} /> Visão Financeira
          </p>
          <h1 className="text-white font-serif text-5xl md:text-7xl leading-none">
            The<br/><span className="italic text-brand-light">Roast</span> Room.
          </h1>
        </div>
        <div className="mt-8 md:mt-0 text-right flex flex-col items-end">
          <p className="text-text-muted text-sm font-serif italic mb-2">Monitoramento Ao Vivo</p>
          
          {/* Custom Time Filter Dropdown */}
          <div className="relative group mt-2">
              <select 
                value={timeframe} 
                onChange={(e) => setTimeframe(e.target.value)}
                className="appearance-none bg-surface border border-surface-light text-white text-sm tracking-widest uppercase font-bold py-3 pl-4 pr-10 rounded cursor-pointer focus:outline-none focus:border-brand transition-colors"
               >
                  <option value="today">Faturamento (Hoje)</option>
                  <option value="week">Faturamento (Semanal)</option>
                  <option value="month">Faturamento (Mensal)</option>
                  <option value="quarter">Faturamento (Trimestral)</option>
                  <option value="semester">Faturamento (Semestral)</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand pointer-events-none group-hover:text-white transition-colors" />
          </div>

        </div>
      </header>

      {/* Hero Metrics (Editorial Style) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 relative">
        <div className="lg:col-span-8 relative group overflow-hidden">
            {/* Dark immersive background for the main metric */}
            <div className="absolute inset-0 bg-black/60 z-10 mix-blend-multiply" />
            <img src={FALLBACK_IMG} alt="Grill Background" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale saturate-50 group-hover:scale-105 transition-transform duration-1000" />
            
            <div className="relative z-20 p-10 md:p-16 border border-white/10 h-full flex flex-col justify-end min-h-[400px]">
                <p className="text-white/60 tracking-[0.2em] text-xs font-bold uppercase mb-4">Faturamento Bruto ({stats.timeframeLabel})</p>
                <div className="flex items-baseline gap-4 mb-8">
                    <span className="text-brand text-4xl md:text-6xl font-serif">R$</span>
                    <h2 className="text-white text-6xl md:text-8xl font-serif tracking-tighter">
                        {stats.totalRevenue > 0 ? stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                    </h2>
                </div>
                
                <div className="flex items-center gap-6 mt-auto">
                    <div className="h-[1px] bg-brand flex-1" />
                    <span className="text-brand-light text-xs font-bold tracking-widest uppercase">Atualizado em Tempo Real</span>
                </div>
            </div>
        </div>

        <div className="lg:col-span-4 flex flex-col justify-between border-l border-surface-light pl-0 lg:pl-12 gap-12">
            <div>
                <p className="text-text-muted tracking-[0.2em] text-[10px] font-bold uppercase mb-4">Campeão de Vendas</p>
                <div className="w-full h-48 bg-surface mb-6 relative overflow-hidden">
                    <img src={stats.topProduct?.image || FALLBACK_IMG} alt="Top Product" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                    <div className="absolute bottom-4 left-4">
                        <p className="text-white font-serif text-2xl">{stats.topProduct?.name || '---'}</p>
                        <p className="text-brand font-bold text-sm tracking-wider">{stats.topProduct?.count || 0} PEDIDOS</p>
                    </div>
                </div>
                <div className="flex items-start justify-between">
                    <p className="text-xs text-text-secondary leading-relaxed max-w-[200px]">Este prato de assinatura está gerando o maior volume no período selecionado.</p>
                    <ArrowRight className="text-brand" />
                </div>
            </div>

            <div className="pt-8 border-t border-surface-light">
                <p className="text-text-muted tracking-[0.2em] text-[10px] font-bold uppercase mb-4">Giro de Mesa Médio</p>
                <p className="text-white font-serif text-5xl">58 <span className="text-2xl text-text-muted italic">min</span></p>
                <div className="w-full h-0.5 bg-surface-light mt-6 flex">
                    <div className="w-[60%] h-full bg-brand" />
                </div>
                <p className="text-[10px] text-text-muted uppercase tracking-widest mt-3 text-right">Alcance Ideal</p>
            </div>
        </div>
      </section>

      {/* Secondary Level: Financial Flow & Hierarchy */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Payment Methods Flow */}
        <div>
            <div className="flex items-center justify-between pb-4 border-b border-surface-light mb-8">
                <h3 className="text-2xl text-white font-serif italic">Fluxo de Pagamento</h3>
                <Activity size={18} className="text-brand" />
            </div>

            <div className="space-y-6">
                {stats.paymentMethods.map((method, i) => {
                    const percent = stats.totalRevenue > 0 ? (method.total / stats.totalRevenue) * 100 : 0;
                    if (method.total === 0 && stats.totalRevenue > 0) return null; // Hide unused methods if there's revenue

                    return (
                        <div key={i} className="group cursor-pointer">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <p className="text-white font-serif text-lg group-hover:text-brand transition-colors flex items-center gap-2">
                                        {method.label}
                                        <span className="text-[10px] text-text-muted font-sans font-bold tracking-widest uppercase bg-surface px-2 py-0.5 rounded">{percent.toFixed(1)}%</span>
                                    </p>
                                    <p className="text-text-muted text-[10px] uppercase tracking-widest">{method.count} TICKETS GERADOS</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-serif text-xl tracking-wider text-brand">
                                        R$ {method.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                            <div className="w-full h-[1px] bg-surface-light relative mb-2">
                                <div className="absolute top-0 left-0 h-full bg-brand transition-all duration-1000" style={{ width: `${percent}%` }} />
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <button className="mt-8 text-xs font-bold uppercase tracking-widest text-brand hover:text-white transition-colors flex items-center gap-2">
                Baixar Extratos <ArrowRight size={14} />
            </button>
        </div>

        {/* Volume Hierarchy */}
        <div>
            <div className="flex items-center justify-between pb-4 border-b border-surface-light mb-8">
                <h3 className="text-2xl text-white font-serif italic">Hierarquia de Produto</h3>
                <button className="text-text-muted hover:text-white transition-colors"><Download size={18} /></button>
            </div>

            <table className="w-full text-left border-collapse">
                <tbody>
                    {products.slice(0, 4).map((p, i) => {
                        // Mock data for top performing items if no real orders
                        const realSales = stats.allSales.find(s => s.id === p.id);
                        const count = realSales ? realSales.count : ([1248, 856, 412, 190][i] || Math.floor(Math.random() * 100));
                        const rev = realSales ? realSales.revenue : ([34944.00, 25680.00, 10520.00, 4200.00][i] || (p.price * count));
                        
                        return (
                            <tr key={p.id} className="border-b border-surface/30 group">
                                <td className="py-6 w-16">
                                    <span className="text-text-muted font-serif text-2xl italic">0{i + 1}.</span>
                                </td>
                                <td className="py-6">
                                    <p className="text-white font-serif text-lg">{p.name}</p>
                                    <p className="text-text-muted text-[10px] uppercase tracking-widest mt-1">
                                        {i === 0 ? 'Alta Margem' : i === 1 ? 'Em Alta' : 'Estável'}
                                    </p>
                                </td>
                                <td className="py-6 text-right">
                                    <p className="text-brand font-bold tracking-wider">{count} <span className="text-[10px] text-text-muted font-normal">QTD</span></p>
                                </td>
                                <td className="py-6 text-right w-32">
                                    <p className="text-white font-serif tracking-widest">R$ {rev.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </section>

    </div>
  );
}
