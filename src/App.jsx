import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/public/HomePage';
import CheckoutPage from './pages/public/CheckoutPage';
import OrderStatusPage from './pages/public/OrderStatusPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import OrdersPage from './pages/admin/OrdersPage';
import ProductsPage from './pages/admin/ProductsPage';
import InventoryPage from './pages/admin/InventoryPage';
import POSPage from './pages/admin/POSPage';
import CouriersPage from './pages/admin/CouriersPage';
import SettingsPage from './pages/admin/SettingsPage';
import LoginPage from './pages/admin/LoginPage';
import CartDrawer from './components/public/CartDrawer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/shared/ProtectedRoute';

function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="app-container">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-status/:id" element={<OrderStatusPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="inventory" element={<InventoryPage />} />
                  <Route path="pos" element={<POSPage />} />
                  <Route path="couriers" element={<CouriersPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Routes>
              <CartDrawer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </StoreProvider>
  );
}

export default App;
