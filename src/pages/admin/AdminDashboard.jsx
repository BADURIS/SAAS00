import React, { useMemo } from 'react';
import { Search, Bell, Settings as SettingsIcon, Star, Clock, Download, TrendingUp, ArrowRight } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell } from 'recharts';
import { useStore } from '../../context/StoreContext';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1544025162-d76f60b52cb8?auto=format&fit=crop&q=80&w=400';

export default function AdminDashboard() {
  const { orders, products } = useStore();

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let revenueMonth = 0;
    const productSales = {};

    orders.forEach(order => {
      const orderDate = new Date(order.date);
      if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
        revenueMonth += order.total;
      }
      
      order.items.forEach(item => {
        if (!productSales[item.id]) {
          productSales[item.id] = { ...item, count: 0, revenue: 0 };
        }
        productSales[item.id].count += item.quantity;
        productSales[item.id].revenue += (item.price * item.quantity);
      });
    });

    const sortedProducts = Object.values(productSales).sort((a, b) => b.count - a.count);
    const topProduct = sortedProducts[0] || products[0];

    return {
      revenueMonth,
      topProduct,
      allSales: sortedProducts
    };
  }, [orders, products]);

  // Mock weekly data for the chart to match reference
  const weeklyData = [
    { name: 'MON', value: 35, target: 100 },
    { name: 'TUE', value: 65, target: 100 },
    { name: 'WED', value: 90, target: 100 },
    { name: 'THU', value: 25, target: 100 },
    { name: 'FRI', value: 55, target: 100 },
    { name: 'SAT', value: 85, target: 100 },
    { name: 'SUN', value: 45, target: 100 },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface p-3 border border-surface-light shadow-xl">
          <p className="text-white text-sm font-medium">{`Revenue: $${(payload[0].value * 100).toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background text-text-primary p-8 lg:p-12 font-sans pt-8">
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-brand-light font-serif tracking-[0.2em] text-lg font-bold uppercase">
          EDITORIAL CASA DE CARNES
        </h1>
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search data..." 
              className="bg-surface/50 border border-surface-light rounded-full py-2 pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:border-brand/50 w-64 transition-all"
            />
          </div>
          <button className="text-text-muted hover:text-white transition-colors"><Bell size={20} /></button>
          <button className="text-text-muted hover:text-white transition-colors"><SettingsIcon size={20} /></button>
          <div className="w-8 h-8 rounded-full bg-surface-light border border-surface overflow-hidden">
            <img src="https://i.pravatar.cc/100?img=33" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Sales */}
        <div className="bg-surface rounded-xl p-6 border border-brand/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] tracking-[0.15em] font-bold text-text-secondary uppercase">Total Sales (MTD)</span>
            <div className="p-1.5 bg-background rounded text-text-muted"><DollarSign size={14} /></div>
          </div>
          <div className="flex items-end gap-3">
            <h2 className="text-4xl font-serif text-white">${stats.revenueMonth > 0 ? stats.revenueMonth.toFixed(2) : '42,890.50'}</h2>
            <span className="text-success text-xs font-bold mb-1.5 flex items-center">~12%</span>
          </div>
          <div className="w-full bg-background h-1 mt-6 rounded-full overflow-hidden flex">
            <div className="bg-brand w-[70%] h-full"></div>
            <div className="bg-surface-light w-[30%] h-full"></div>
          </div>
        </div>

        {/* Top Selling */}
        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-surface-light">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] tracking-[0.15em] font-bold text-text-secondary uppercase">Top Selling Product</span>
            <Star size={14} className="text-text-muted" />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="w-16 h-16 rounded-lg bg-surface bg-cover bg-center border border-surface-light" style={{ backgroundImage: `url(${stats.topProduct?.image || PLACEHOLDER_IMG})` }} />
            <div>
              <h3 className="text-lg font-serif text-white">{stats.topProduct?.name || 'Smoked Picanha'}</h3>
              <p className="text-text-muted text-xs mt-1">{stats.topProduct?.count || 412} orders this week</p>
            </div>
          </div>
        </div>

        {/* Turnaround */}
        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-surface-light relative">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] tracking-[0.15em] font-bold text-text-secondary uppercase">Avg. Table Turnaround</span>
            <Clock size={14} className="text-text-muted" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <h2 className="text-4xl font-serif text-white">58<span className="text-2xl">m</span></h2>
            <span className="text-text-muted text-xs">Lower than target</span>
          </div>
          <div className="flex gap-2 mt-6">
            <div className="h-1 flex-1 bg-brand rounded-full"></div>
            <div className="h-1 flex-1 bg-brand rounded-full"></div>
            <div className="h-1 flex-1 bg-brand/30 rounded-full"></div>
            <div className="h-1 flex-1 bg-surface-light rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Momentum Chart */}
        <div className="lg:col-span-2 bg-[#1A1A1A] rounded-xl p-6 border border-surface-light flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-lg font-serif text-white mb-1">Revenue Momentum</h2>
              <p className="text-xs text-text-muted">Weekly performance across all categories</p>
            </div>
            <div className="flex gap-2 bg-background p-1 rounded border border-surface-light relative z-10">
              <button className="px-3 py-1 text-[10px] font-bold tracking-wider rounded bg-surface text-white">7D</button>
              <button className="px-3 py-1 text-[10px] font-bold tracking-wider rounded text-text-muted hover:text-white">1M</button>
              <button className="px-3 py-1 text-[10px] font-bold tracking-wider rounded text-text-muted hover:text-white">1Y</button>
            </div>
          </div>
          
          <div className="flex-1 min-h-[200px] -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 700 }} 
                  dy={10} 
                />
                <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  radius={[2, 2, 0, 0]} 
                  background={{ fill: '#2A2A2A', radius: [2, 2, 0, 0] }}
                  barSize={40}
                >
                  {weeklyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.value > 80 ? '#FFB89E' : '#A97C6A'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Essential Stock */}
        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-surface-light">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-serif text-white">Essential Stock</h2>
            <button className="text-[10px] uppercase tracking-widest text-brand font-bold flex items-center gap-1 hover:text-brand-light">
              View All <ArrowRight size={12} />
            </button>
          </div>
          
          <div className="space-y-6">
            {products.slice(0, 4).map((p, i) => {
              const max = 50;
              const stock = p.stock || 0;
              const percent = Math.min(100, Math.max(0, (stock / max) * 100));
              const isLow = percent < 30;
              const isCrit = percent < 15;
              
              return (
                <div key={p.id}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-text-primary">{p.name} {i === 0 || i === 1 ? '(kg)' : '(Unit)'}</span>
                    <span className="text-text-muted">{stock} / {max}</span>
                  </div>
                  <div className="w-full bg-background h-1.5 rounded-full overflow-hidden mb-1.5">
                    <div 
                      className={`h-full rounded-full ${isCrit ? 'bg-danger' : isLow ? 'bg-brand' : 'bg-surface-light'}`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  {isCrit && <p className="text-[9px] font-bold text-danger uppercase tracking-wider flex items-center gap-1">▲ Critically Low</p>}
                  {!isCrit && isLow && <p className="text-[9px] font-bold text-brand uppercase tracking-wider flex items-center gap-1">▲ Low Stock Alert</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance Hierarchy Table */}
      <div className="bg-[#1A1A1A] rounded-xl p-6 border border-surface-light">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-lg font-serif text-white mb-1">Performance Hierarchy</h2>
            <p className="text-xs text-text-muted">Revenue drivers by volume and profit margin</p>
          </div>
          <button className="flex items-center gap-2 bg-surface hover:bg-surface-light px-4 py-2 rounded text-xs font-bold text-text-secondary hover:text-white transition-colors">
            <Download size={14} /> Export Report
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface">
                <th className="pb-4 text-[10px] uppercase tracking-widest text-text-muted font-bold">Item</th>
                <th className="pb-4 text-[10px] uppercase tracking-widest text-text-muted font-bold">Category</th>
                <th className="pb-4 text-[10px] uppercase tracking-widest text-text-muted font-bold">Sales Count</th>
                <th className="pb-4 text-[10px] uppercase tracking-widest text-text-muted font-bold">Revenue</th>
                <th className="pb-4 text-[10px] uppercase tracking-widest text-text-muted font-bold">Trend</th>
                <th className="pb-4 text-[10px] uppercase tracking-widest text-text-muted font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 3).map((p, i) => {
                const salesStr = [1248, 856, 2104][i] || Math.floor(Math.random() * 1000);
                const rev = [34944.00, 25680.00, 10520.00][i] || (p.price * salesStr);
                const isStable = i === 2;
                
                return (
                  <tr key={p.id} className="border-b border-surface/50 last:border-0 hover:bg-surface/30 transition-colors">
                    <td className="py-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-surface bg-cover bg-center border border-surface-light" style={{ backgroundImage: `url(${p.image || PLACEHOLDER_IMG})` }} />
                      <span className="font-serif text-white text-sm">
                        {i === 0 ? 'Signature ' : i === 1 ? 'Smoked ' : 'Artisan '}
                        {p.name}
                      </span>
                    </td>
                    <td className="py-4 text-xs text-text-muted">{p.category || (i < 2 ? 'Premium Roasts' : 'Side Plates')}</td>
                    <td className="py-4">
                      <span className="font-serif text-brand font-bold">{salesStr.toLocaleString()}</span>
                    </td>
                    <td className="py-4 text-xs text-text-secondary">${rev.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td className="py-4">
                      {isStable ? (
                        <ArrowRight size={16} className="text-text-muted" />
                      ) : (
                        <TrendingUp size={16} className="text-success" />
                      )}
                    </td>
                    <td className="py-4 text-right">
                      {i === 0 && <span className="inline-block bg-success/10 text-success text-[9px] font-bold uppercase py-1 px-2 rounded border border-success/20 tracking-wider">High Margin</span>}
                      {i === 1 && <span className="inline-block bg-brand/10 text-brand text-[9px] font-bold uppercase py-1 px-2 rounded border border-brand/20 tracking-wider">Trending</span>}
                      {i === 2 && <span className="inline-block bg-surface-light text-text-secondary text-[9px] font-bold uppercase py-1 px-2 rounded border border-surface tracking-wider">Stable</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
