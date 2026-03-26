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
import ReportsPage from './pages/admin/ReportsPage';
import Navbar from './components/shared/Navbar';
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
                <Route path="/" element={<><Navbar /><HomePage /></>} />
                <Route path="/checkout" element={<><Navbar /><CheckoutPage /></>} />
                <Route path="/order-status/:id" element={<OrderStatusPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={
                    <ProtectedRoute allowedRoles={['manager']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="orders" element={
                    <ProtectedRoute allowedRoles={['manager', 'employee']}>
                      <OrdersPage />
                    </ProtectedRoute>
                  } />
                  <Route path="products" element={
                    <ProtectedRoute allowedRoles={['manager']}>
                      <ProductsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="inventory" element={
                    <ProtectedRoute allowedRoles={['manager', 'employee']}>
                      <InventoryPage />
                    </ProtectedRoute>
                  } />
                  <Route path="pos" element={
                    <ProtectedRoute allowedRoles={['manager', 'employee']}>
                      <POSPage />
                    </ProtectedRoute>
                  } />
                  <Route path="reports" element={
                    <ProtectedRoute allowedRoles={['manager']}>
                      <ReportsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="couriers" element={
                    <ProtectedRoute allowedRoles={['manager']}>
                      <CouriersPage />
                    </ProtectedRoute>
                  } />
                  <Route path="settings" element={
                    <ProtectedRoute allowedRoles={['manager']}>
                      <SettingsPage />
                    </ProtectedRoute>
                  } />
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
