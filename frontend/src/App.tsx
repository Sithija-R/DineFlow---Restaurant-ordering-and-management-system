import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DineFlowProvider } from './context/DineFlowContext';
import Navbar from './components/Navbar';
import Cart from './components/Cart';

// Customer Pages
import Menu from './pages/customer/Menu';
import Checkout from './pages/customer/Checkout';
import OrderStatus from './pages/customer/OrderStatus';
import Reservation from './pages/customer/Reservation';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import MenuManagement from './pages/admin/MenuManagement';
import OrderManagement from './pages/admin/OrderManagement';
import ReservationManagement from './pages/admin/ReservationManagement';

export default function App() {
  return (
    <DineFlowProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-orange-500 selection:text-white">
          <Navbar />
          <Cart />

          <main className="flex-grow">
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<Menu />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-status" element={<OrderStatus />} />
              <Route path="/reservation" element={<Reservation />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/menu-management" element={<MenuManagement />} />
              <Route path="/admin/order-management" element={<OrderManagement />} />
              <Route path="/admin/reservation-management" element={<ReservationManagement />} />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/menu" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-300">DineFlow</span>
                <span>• Gourmet Ordering & Restaurant Management</span>
              </div>
              <p>© {new Date().getFullYear()} DineFlow Inc. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </Router>
    </DineFlowProvider>
  );
}
