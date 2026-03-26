import React, { useState } from 'react';
import { Plus, Minus, CreditCard, Banknote, QrCode, Edit, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=400';

export default function POSPage() {
  const { products, addOrder } = useStore();
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [activeCategory, setActiveCategory] = useState('STEAKS');

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        return { ...i, quantity: Math.max(0, i.quantity + delta) };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const serviceFee = subtotal * 0.1; // 10%
  const total = subtotal + serviceFee;

  const handleFinalize = () => {
    if (cart.length === 0) return;

    const order = {
      customer: {
        name: customer || 'Guest',
        phone: 'Presencial',
        address: 'Mesa/Balcão'
      },
      items: cart,
      total: total,
      status: 'Pendente',
      payment: {
        method: paymentMethod,
        change: 0
      },
      type: 'pickup',
      observation: 'POS Order'
    };

    addOrder(order);
    alert('Pedido Processado!');
    setCart([]);
    setCustomer('');
  };

  const categories = ['STEAKS', 'SIDE DISHES', 'BEVERAGES', 'DESSERTS'];

  return (
    <div className="flex h-screen bg-background text-text-primary overflow-hidden">
      
      {/* Left Area: Product Selection */}
      <div className="flex-1 flex flex-col pt-8 px-10 border-r border-surface overflow-hidden">
        
        {/* Header Options */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-white mb-6 tracking-wide">Prime Selections</h1>
            <div className="flex gap-8 border-b border-surface-light w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`pb-3 text-sm font-semibold tracking-widest uppercase transition-colors relative
                    ${activeCategory === cat ? 'text-brand' : 'text-text-secondary hover:text-text-primary'}
                  `}
                >
                  {cat}
                  {activeCategory === cat && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button className="flex items-center gap-2 bg-surface hover:bg-surface-light text-text-primary px-4 py-2.5 rounded-lg text-sm font-medium transition-colors mb-3">
            <Edit size={16} className="text-text-muted" />
            Stock Update
          </button>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pb-8 pr-4 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <div
                key={product.id}
                className="bg-surface rounded-xl overflow-hidden border border-transparent hover:border-surface-light transition-all flex flex-col"
              >
                {/* Image */}
                <div className="relative h-40 bg-surface-dark p-4 group">
                  <div className="absolute inset-0 bg-cover bg-center rounded-t-xl" style={{ backgroundImage: `url(${product.image || PLACEHOLDER_IMG})`, opacity: product.stock > 0 ? 0.9 : 0.4 }} />
                  {/* Stock Indicator */}
                  <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-text-primary text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded">
                    {product.stock} IN STOCK
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-serif text-lg leading-tight text-white">{product.name}</h3>
                    <span className="text-brand font-medium tracking-wide">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-text-muted text-xs line-clamp-2 mb-6">
                    {product.description || 'Premium selection from our finest regional reserve, expertly aged for flavor.'}
                  </p>
                  
                  <button
                    onClick={() => product.stock > 0 && addToCart(product)}
                    disabled={product.stock <= 0}
                    className={`mt-auto w-full py-2.5 rounded text-xs font-bold tracking-widest uppercase transition-all
                      ${product.stock > 0 
                        ? 'bg-[#2A2A2A] hover:bg-[#333333] text-text-secondary hover:text-white' 
                        : 'bg-surface/50 text-text-muted cursor-not-allowed'}
                    `}
                  >
                    Add to order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Area: Current Order */}
      <div className="w-[380px] bg-[#161616] flex flex-col shrink-0">
        <div className="p-8 flex-1 flex flex-col overflow-hidden">
          
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-xl font-serif text-white mb-2">Current Order</h2>
              <div className="flex items-center gap-2 text-xs text-text-muted font-medium">
                <User size={12} />
                <input 
                  type="text" 
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  placeholder="Guest / Table"
                  className="bg-transparent border-none outline-none placeholder:text-text-muted/50 w-24 focus:text-white"
                />
                <span>• Server: Admin</span>
              </div>
            </div>
            <span className="text-[10px] text-text-muted tracking-widest font-mono">ID: #{Math.floor(Math.random()*10000)}</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-text-muted text-sm font-light italic">No items added to order</p>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-14 h-14 rounded-lg bg-surface bg-cover bg-center shrink-0 border border-surface-light" style={{ backgroundImage: `url(${item.image || PLACEHOLDER_IMG})` }} />
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium text-white">{item.name}</h4>
                          <p className="text-[10px] text-text-muted mt-0.5">Standard serving</p>
                        </div>
                        <span className="text-brand font-medium text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      
                      {/* Quantity Control */}
                      <div className="flex items-center gap-4 mt-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-full bg-surface hover:bg-surface-light flex items-center justify-center text-text-muted hover:text-white transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-full bg-surface hover:bg-surface-light flex items-center justify-center text-text-muted hover:text-white transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer Payment Block */}
        <div className="p-8 border-t border-surface/50 bg-[#161616]">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm text-text-secondary">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-text-secondary">
              <span>Service (10%)</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-serif text-white pt-2 border-t border-surface">
              <span>Total</span>
              <span className="text-brand">${total.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-[10px] text-center uppercase tracking-widest text-text-muted font-bold mb-4">Receive Payment</p>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button 
              onClick={() => setPaymentMethod('cash')}
              className={`flex flex-col items-center justify-center gap-2 py-4 rounded-lg border transition-colors
                ${paymentMethod === 'cash' ? 'bg-surface-light border-brand/50 text-white' : 'bg-surface border-transparent text-text-muted hover:text-text-secondary'}
              `}
            >
              <Banknote size={20} />
              <span className="text-[10px] font-bold tracking-widest uppercase">CASH</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('card')}
              className={`flex flex-col items-center justify-center gap-2 py-4 rounded-lg border transition-colors
                ${paymentMethod === 'card' ? 'bg-surface-light border-brand/50 text-white' : 'bg-surface border-transparent text-text-muted hover:text-text-secondary'}
              `}
            >
              <CreditCard size={20} />
              <span className="text-[10px] font-bold tracking-widest uppercase">CARD</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('pix')}
              className={`flex flex-col items-center justify-center gap-2 py-4 rounded-lg border transition-colors
                ${paymentMethod === 'pix' ? 'bg-surface-light border-brand/50 text-white' : 'bg-surface border-transparent text-text-muted hover:text-text-secondary'}
              `}
            >
              <QrCode size={20} />
              <span className="text-[10px] font-bold tracking-widest uppercase">PIX</span>
            </button>
          </div>

          <button
            onClick={handleFinalize}
            disabled={cart.length === 0}
            className={`w-full py-4 rounded-lg font-bold tracking-widest uppercase text-sm transition-all
              ${cart.length > 0 
                ? 'bg-brand hover:bg-brand-light text-background shadow-[0_0_20px_rgba(230,138,92,0.15)] hover:shadow-[0_0_25px_rgba(230,138,92,0.3)]' 
                : 'bg-surface text-text-muted cursor-not-allowed'}
            `}
          >
            Process Order
          </button>
        </div>
      </div>
      
    </div>
  );
}
