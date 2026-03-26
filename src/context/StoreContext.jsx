import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/mockData';

const StoreContext = createContext();

export function useStore() {
    return useContext(StoreContext);
}

export function StoreProvider({ children }) {
    // Products with Stock
    const [products, setProducts] = useState(() => {
        try {
            const saved = localStorage.getItem('store_products');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Ensure new fields exist for existing data
                return parsed.map(p => ({
                    ...p,
                    unit_type: p.unit_type || 'unit',
                    barcode: p.barcode || '',
                    minStock: p.minStock || 5
                }));
            }
        } catch (error) {
            console.error('Store sync error:', error);
        }

        // Initialize stock if not present
        return initialProducts.map(p => ({
            ...p,
            stock: 20, // Default start stock
            minStock: 5
        }));
    });

    // Orders
    const [orders, setOrders] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('store_orders') || '[]');
        } catch (e) {
            console.error('Store orders sync error:', e);
            return [];
        }
    });

    // Inventory Logs
    const [inventoryLogs, setInventoryLogs] = useState(() => {
        return JSON.parse(localStorage.getItem('store_inventory_logs') || '[]');
    });

    useEffect(() => {
        localStorage.setItem('store_products', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem('store_orders', JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        localStorage.setItem('store_inventory_logs', JSON.stringify(inventoryLogs));
    }, [inventoryLogs]);

    // Actions
    const addInventoryLog = (productId, amount, type, reason = '') => {
        const log = {
            id: Date.now(),
            productId,
            changeAmount: amount,
            type,
            reason,
            createdAt: new Date().toISOString()
        };
        setInventoryLogs(prev => [log, ...prev]);
    };

    const updateProductStock = (id, newStock, reason = 'Ajuste Manual') => {
        setProducts(prev => prev.map(p => {
            if (p.id === id) {
                const diff = parseInt(newStock) - p.stock;
                if (diff !== 0) {
                    addInventoryLog(id, diff, 'manual_adjustment', reason);
                }
                return { ...p, stock: parseInt(newStock) };
            }
            return p;
        }));
    };

    const addOrder = (orderData) => {
        const maxId = orders.reduce((max, order) => {
            const idNum = parseInt(order.id.replace('#', ''));
            return idNum > max ? idNum : max;
        }, 0);
        const nextId = maxId + 1;

        const newOrder = {
            ...orderData,
            id: `#${nextId}`,
            date: orderData.created_at || new Date().toISOString()
        };
        setOrders(prev => [newOrder, ...prev]);

        // Decrement Stock & Log
        setProducts(prev => prev.map(p => {
            const itemInOrder = orderData.items.find(i => i.product_id === p.id);
            if (itemInOrder) {
                addInventoryLog(p.id, -itemInOrder.quantity, 'sale', `Venda ${newOrder.id}`);
                return { ...p, stock: Math.max(0, p.stock - itemInOrder.quantity) };
            }
            return p;
        }));

        return newOrder;
    };

    const updateOrderStatus = (orderId, status, reason = null) => {
        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, status, ...(reason && { cancellationReason: reason }) } : o
        ));
    };

    // ... rest of the settings and courier logic remains the same ...
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('store_settings');
        if (saved) return JSON.parse(saved);
        return {
            description: "O verdadeiro sabor do churrasco na sua mesa. Carnes selecionadas e preparadas com excelência para você e sua família.",
            contact: {
                phone: "(11) 99999-9999",
                instagram: "@casadosassados",
                address: "Av. Principal, 123 - Centro\nSão Paulo - SP"
            },
            hours: { weekdays: "11h às 15h / 18h às 23h", weekend: "11h às 23h" }
        };
    });

    const updateSettings = (newSettings) => setSettings(prev => ({ ...prev, ...newSettings }));

    const [couriers, setCouriers] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('store_couriers') || '[]');
        } catch (e) {
            return [];
        }
    });
    const [deliveryFees, setDeliveryFees] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('store_delivery_fees') || '[{"id":1,"name":"Bairro","price":5},{"id":2,"name":"Centro","price":8}]');
        } catch (e) {
            return [{ "id": 1, "name": "Bairro", "price": 5 }, { "id": 2, "name": "Centro", "price": 8 }];
        }
    });

    useEffect(() => localStorage.setItem('store_couriers', JSON.stringify(couriers)), [couriers]);
    useEffect(() => localStorage.setItem('store_delivery_fees', JSON.stringify(deliveryFees)), [deliveryFees]);

    const addCourier = (name) => setCouriers(prev => [...prev, { id: Date.now(), name, active: true }]);
    const removeCourier = (id) => setCouriers(prev => prev.filter(c => c.id !== id));

    const assignCourier = (orderId, courierId, feeValue, feeName) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, courierId, deliveryFee: parseFloat(feeValue) || 0, deliveryZone: feeName || '' } : o));
    };

    return (
        <StoreContext.Provider value={{
            products, orders, inventoryLogs, settings, couriers, deliveryFees,
            updateProductStock, addOrder, updateOrderStatus, updateSettings,
            addCourier, removeCourier, assignCourier
        }}>
            {children}
        </StoreContext.Provider>
    );
}
