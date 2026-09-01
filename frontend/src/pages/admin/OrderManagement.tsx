import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDineFlow } from '../../context/DineFlowContext';
import { 
  ShoppingBag, 
  Clock, 
  ChefHat, 
  CheckCircle2, 
  ArrowLeft, 
  Search, 
  Filter, 
  ArrowRight, 
  AlertCircle,
  Phone,
  User,
  Utensils
} from 'lucide-react';

const columns = [
  { key: 'Placed', label: 'Placed / New', color: 'border-amber-500/40 bg-amber-500/5 text-amber-400' },
  { key: 'Preparing', label: 'In Preparation', color: 'border-orange-500/40 bg-orange-500/5 text-orange-400' },
  { key: 'Ready', label: 'Ready to Serve', color: 'border-blue-500/40 bg-blue-500/5 text-blue-400' },
  { key: 'Delivered', label: 'Completed', color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400' }
];

export default function OrderManagement() {
  const { orders, updateOrderStatus } = useDineFlow();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((o) => {
    return (
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.tableNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-white">Live Kitchen & Order Kanban Board</h1>
              <p className="text-xs text-slate-400">Track and advance order status in real time</p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, Table, Name..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Kanban Board Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {columns.map((col) => {
            const colOrders = filteredOrders.filter((o) => o.status === col.key);
            return (
              <div
                key={col.key}
                className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800/80 flex flex-col h-[calc(100vh-200px)] min-h-[500px]"
              >
                {/* Column Header */}
                <div className={`p-3 rounded-xl border mb-4 flex items-center justify-between font-bold text-xs ${col.color}`}>
                  <span>{col.label}</span>
                  <span className="w-6 h-6 rounded-full bg-slate-950/80 flex items-center justify-center text-xs">
                    {colOrders.length}
                  </span>
                </div>

                {/* Orders Cards List */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {colOrders.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-center text-xs text-slate-600 border border-dashed border-slate-800 rounded-xl p-4">
                      No orders in this stage
                    </div>
                  ) : (
                    colOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-slate-950 rounded-2xl p-4 border border-slate-800 hover:border-orange-500/40 transition-all space-y-3 shadow-lg"
                      >
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="font-extrabold text-orange-400 text-xs">{ord.id}</span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                            {ord.tableNumber}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {ord.customerName}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" />
                            {ord.customerPhone}
                          </p>
                        </div>

                        {/* Items summary */}
                        <div className="bg-slate-900/80 p-2.5 rounded-xl text-[11px] space-y-1 text-slate-300">
                          {ord.items?.map((it, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="truncate max-w-[140px]">{it.quantity}x {it.name}</span>
                              <span className="font-semibold text-slate-400">${((it.price || 0) * (it.quantity || 1)).toFixed(2)}</span>
                            </div>
                          ))}
                          {ord.notes && (
                            <div className="pt-1 text-[10px] text-amber-400 border-t border-slate-800">
                              Note: {ord.notes}
                            </div>
                          )}
                        </div>

                        {/* Total & Status Changer */}
                        <div className="flex items-center justify-between pt-1 text-xs">
                          <span className="font-bold text-white">${ord.total?.toFixed(2)}</span>
                          <div className="flex gap-1">
                            {col.key === 'Placed' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'Preparing')}
                                className="px-2.5 py-1 rounded-lg bg-orange-500 text-white font-bold text-[11px] flex items-center gap-1"
                              >
                                Cook <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                            {col.key === 'Preparing' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'Ready')}
                                className="px-2.5 py-1 rounded-lg bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1"
                              >
                                Ready <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                            {col.key === 'Ready' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'Delivered')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1"
                              >
                                Serve <CheckCircle2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    ))
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
