import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Settings, LogOut, ClipboardList, PlusCircle, Bike, BarChart2 } from 'lucide-react';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

export default function AdminLayout() {
    const { orders } = useStore();
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    const pendingCount = orders.filter(o => o.status === 'Pendente').length;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const allItems = [
        { icon: <PlusCircle size={20} />, label: 'PDV', path: '/admin/pos', roles: ['manager', 'employee'] },
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin', roles: ['manager'] },
        { icon: <ShoppingCart size={20} />, label: 'Pedidos', path: '/admin/orders', roles: ['manager', 'employee'] },
        { icon: <Package size={20} />, label: 'Produtos', path: '/admin/products', roles: ['manager'] },
        { icon: <ClipboardList size={20} />, label: 'Estoque', path: '/admin/inventory', roles: ['manager', 'employee'] },
        { icon: <BarChart2 size={20} />, label: 'Relatórios', path: '/admin/reports', roles: ['manager'] },
        { icon: <Bike size={20} />, label: 'Motoboys', path: '/admin/couriers', roles: ['manager'] },
        { icon: <Settings size={20} />, label: 'Configurações', path: '/admin/settings', roles: ['manager'] },
    ];

    const navItems = allItems.filter(item => item.roles.includes(user?.role));

    return (
        <div className="flex min-h-screen bg-zinc-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900 text-white flex flex-col border-r border-zinc-800">
                <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
                    <img src={logo} alt="Logo" className="w-10 h-10 object-contain brightness-0 invert" />
                    <div>
                        <h1 className="text-sm font-black uppercase tracking-tighter leading-none">Butcher POS</h1>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{user?.role}</span>
                    </div>
                </div>

                <nav className="flex-1 p-4">
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link to={item.path} className={`
                                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all relative group
                                    ${isActive(item.path)
                                        ? 'bg-red-600 text-white font-bold shadow-[0_0_20px_rgba(220,38,38,0.3)]'
                                        : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}
                                `}>
                                    {item.icon}
                                    <span className="uppercase tracking-tight">{item.label}</span>
                                    {item.label === 'Pedidos' && pendingCount > 0 && (
                                        <span className="ml-auto bg-white text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full ring-2 ring-red-600">
                                            {pendingCount}
                                        </span>
                                    )}
                                    {isActive(item.path) && (
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-l-full" />
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-6 border-t border-zinc-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-all text-sm font-bold uppercase tracking-widest"
                    >
                        <LogOut size={20} />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 lg:p-12">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
