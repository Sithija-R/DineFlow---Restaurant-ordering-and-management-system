import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDineFlow } from '../../context/DineFlowContext';
import { 
  DollarSign, 
  ShoppingBag, 
  Calendar, 
  UtensilsCrossed, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  ChefHat, 
  ArrowUpRight,
  ShieldCheck,
  Plus
} from 'lucide-react';

export default function Dashboard() {
  const { orders, reservations, menuItems, adminAuth, updateOrderStatus } = useDineFlow();
  const navigate = useNavigate();

  // Guard: if not authenticated, option to view or redirect
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const inStockMenuItems = menuItems.filter((i) => i.available).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center font-bold">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Management Console</h1>
              <p className="text-xs text-slate-400">Welcome, {adminAuth.user?.name || 'Administrator'}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/dashboard"
              className="px-3.5 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-md"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/menu-management"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Menu Mgmt
            </Link>
            <Link
              to="/admin/order-management"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Orders ({activeOrdersCount})
            </Link>
            <Link
              to="/admin/reservation-management"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Reservations
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Revenue */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Revenue</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-extrabold text-white">${totalRevenue.toFixed(2)}</h3>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +14.2%
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Gross sales across active orders</p>
          </div>

          {/* Active Kitchen Orders */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Active Kitchen Orders</span>
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-extrabold text-white">{activeOrdersCount}</h3>
              <span className="text-[11px] font-bold text-orange-400">In Prep</span>
            </div>
            <p className="text-[11px] text-slate-500">Pending & cooking items</p>
          </div>

          {/* Table Reservations */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Booked Reservations</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-extrabold text-white">{reservations.length}</h3>
              <span className="text-[11px] font-bold text-blue-400">Tonight</span>
            </div>
            <p className="text-[11px] text-slate-500">Confirmed dining tables</p>
          </div>

          {/* Menu Catalog Items */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Active Menu Items</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-extrabold text-white">{inStockMenuItems} / {menuItems.length}</h3>
              <span className="text-[11px] font-bold text-amber-400">Available</span>
            </div>
            <p className="text-[11px] text-slate-500">Gourmet dishes in catalog</p>
          </div>

        </div>

        {/* Live Orders Feed & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recent Orders Table (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Live Kitchen Orders</h2>
              <Link
                to="/admin/order-management"
                className="text-xs font-semibold text-orange-400 hover:underline flex items-center gap-1"
              >
                View Kanban Board <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-slate-400 uppercase bg-slate-950/60 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Table/Type</th>
                    <th className="py-3 px-3">Total</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Quick Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-950/40">
                      <td className="py-3 px-3 font-bold text-orange-400">{ord.id}</td>
                      <td className="py-3 px-3 font-medium text-white">{ord.customerName}</td>
                      <td className="py-3 px-3 text-slate-400">{ord.tableNumber}</td>
                      <td className="py-3 px-3 font-semibold text-slate-200">${ord.total?.toFixed(2)}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : ord.status === 'Ready'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-[11px] rounded-lg p-1 text-slate-300 focus:outline-none"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Ready">Ready</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Admin Actions & Popular Items (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white">Kitchen Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to="/admin/menu-management"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500/40 text-xs font-semibold text-slate-200 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-orange-400" /> Add New Menu Item
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>

                <Link
                  to="/admin/order-management"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500/40 text-xs font-semibold text-slate-200 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-orange-400" /> Kitchen Display Board
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>

                <Link
                  to="/admin/reservation-management"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500/40 text-xs font-semibold text-slate-200 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-400" /> Manage Table Bookings
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </div>
            </div>

            {/* Popular Items Preview */}
            <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white">Top Menu Highlights</h3>
              <div className="space-y-3">
                {menuItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                      <p className="text-[10px] text-slate-400">${item.price.toFixed(2)} • {item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
