import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useDineFlow } from '../../context/DineFlowContext';
import { 
  Clock, 
  CheckCircle, 
  ChefHat, 
  Utensils, 
  ShoppingBag, 
  BellRing, 
  RefreshCw, 
  Sparkles, 
  MapPin, 
  PhoneCall 
} from 'lucide-react';
import type { OrderStatus } from '@/types/order';

const statusSteps = [
  { key: 'Placed', label: 'Order Received', desc: 'Sent to kitchen display' },
  { key: 'Preparing', label: 'Chef Cooking', desc: 'Crafting your gourmet meal' },
  { key: 'Ready', label: 'Ready for Service', desc: 'Plated & awaiting waiter' },
  { key: 'Delivered', label: 'Served & Enjoy', desc: 'Delivered to your table' }
];

export default function OrderStatus() {
  const { currentActiveOrder, updateOrderStatus, orders, setCurrentActiveOrderId } = useDineFlow();
  const location = useLocation();

  const activeOrder = currentActiveOrder || orders[0];

  if (!activeOrder) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <Clock className="w-12 h-12 text-slate-600 mb-3" />
        <h2 className="text-lg font-bold text-white">No active orders found</h2>
        <p className="text-xs text-slate-400 mt-1">Place an order from our menu to track live kitchen preparation.</p>
        <Link
          to="/menu"
          className="mt-5 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-xs"
        >
          View Menu
        </Link>
      </div>
    );
  }

  const getCurrentStepIndex = () => {
    switch (activeOrder.status) {
      case "PLACED":
        return 0;
      case "CONFIRMED":
        return 1;
      case "PREPARING":
        return 2;
      case "READY":
        return 3;
      case "COMPLETED":
        return 4;
      default: return 0;
    }
  };

  const currentStep = getCurrentStepIndex();

  const handleNextStatus = () => {
    const nextStatuses: OrderStatus[] = [
      "PLACED",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
    ];
    const nextIdx =
    currentStep + 1 < nextStatuses.length
      ? currentStep + 1
      : currentStep;

  updateOrderStatus(
    activeOrder.id,
    nextStatuses[nextIdx]
  );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl -z-10" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                  Live Order Tracker
                </span>
                <span className="text-xs text-slate-400">Order ID: <strong className="text-white">{activeOrder.id}</strong></span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Status: <span className="text-orange-400">{activeOrder.status}</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Customer: <strong className="text-slate-200">{activeOrder.customerName}</strong> ({activeOrder.tableNumber})
              </p>
            </div>

            {/* Select Order Switcher */}
            {orders.length > 1 && (
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-400 font-medium">Switch Active Order:</label>
                <select
                  value={activeOrder.id}
                  onChange={(e) => setCurrentActiveOrderId(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.id} - {o.customerName} ({o.status})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Stepper Visualization */}
          <div className="pt-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
              {statusSteps.map((step, idx) => {
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div
                    key={step.key}
                    className={`flex flex-col items-center text-center p-4 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-orange-500/10 border-orange-500 text-white shadow-lg shadow-orange-500/20 ring-1 ring-orange-500'
                        : isPassed
                        ? 'bg-slate-950/80 border-emerald-500/40 text-emerald-400'
                        : 'bg-slate-950/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-3 ${
                        isCurrent
                          ? 'bg-orange-500 text-white animate-pulse'
                          : isPassed
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isPassed && !isCurrent ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span className="text-xs font-bold">{step.label}</span>
                    <span className="text-[10px] mt-1 text-slate-400">{step.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulator Controls */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Demo Simulator: Advance order status to view live kitchen progression
            </span>
            <button
              onClick={handleNextStatus}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700 font-semibold transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Advance Kitchen Status
            </button>
          </div>

        </div>

        {/* Order Details Card */}
        <div className="bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Ordered Items</span>
            <span className="text-xs text-slate-400 font-normal">
              Type: <strong className="text-white">{activeOrder.orderType}</strong>
            </span>
          </h2>

          <div className="space-y-4">
            {activeOrder.items?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 font-extrabold flex items-center justify-center text-xs">
                    {item.quantity}x
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                    <p className="text-xs text-slate-400">${item.price?.toFixed(2)} each</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-orange-400">
                  ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {activeOrder.notes && (
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
              <strong className="text-orange-400 block mb-1">Kitchen Notes:</strong>
              {activeOrder.notes}
            </div>
          )}

          {/* Pricing Breakdown */}
          <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-slate-200 font-medium">${activeOrder.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span className="text-slate-200 font-medium">${activeOrder.tax?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
              <span>Total Paid</span>
              <span className="text-orange-400">${activeOrder.total?.toFixed(2)}</span>
            </div>
          </div>

          {/* Assistance Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => alert('Staff notified! A waiter will attend to Table ' + activeOrder.tableNumber)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
            >
              <BellRing className="w-4 h-4 text-orange-400" />
              Call Waiter to {activeOrder.tableNumber}
            </button>
            
            <Link
              to="/menu"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-500/20"
            >
              Order More Items
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
