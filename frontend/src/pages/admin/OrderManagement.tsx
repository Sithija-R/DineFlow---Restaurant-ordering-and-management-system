import  { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Phone,
  Search,
  User,
} from "lucide-react";

import type { OrderStatus } from "../../types/order";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { toast } from "../../components/ui/toast";
import { useOrderStore } from "@/stores/orderStore";

const columns: {
  key: OrderStatus;
  label: string;
  color: string;
}[] = [
  {
    key: "PLACED",
    label: "Placed / New",
    color: "border-amber-500/40 bg-amber-500/5 text-amber-400",
  },
  {
    key: "CONFIRMED",
    label: "Confirmed",
    color: "border-cyan-500/40 bg-cyan-500/5 text-cyan-400",
  },
  {
    key: "PREPARING",
    label: "In Preparation",
    color: "border-orange-500/40 bg-orange-500/5 text-orange-400",
  },
  {
    key: "READY",
    label: "Ready to Serve",
    color: "border-blue-500/40 bg-blue-500/5 text-blue-400",
  },
  {
    key: "COMPLETED",
    label: "Completed",
    color: "border-emerald-500/40 bg-emerald-500/5 text-emerald-400",
  },
];

export default function OrderManagement() {
  const { orders, loading, fetchOrders, updateOrderStatus } = useOrderStore();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchOrders().catch((error) => {
      console.error("Failed to load orders:", error);

      toast.add({
        title: "Failed to load orders",
        description:
          error instanceof Error ? error.message : "Unable to load orders.",
        type: "error",
      });
    });
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();

    return (
      order.orderReference.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.phoneNumber.toLowerCase().includes(query)
    );
  });

  const handleStatusUpdate = async (
    orderId: number,
    status: OrderStatus,
    orderReference: string
  ) => {
    try {
      await updateOrderStatus(orderId, status);

      toast.add({
        title: "Order status updated",
        description: `${orderReference} is now ${status.toLowerCase()}.`,
        type: "success",
      });
    } catch (error) {
      console.error("Failed to update order status:", error);

      toast.add({
        title: "Status update failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to update order status.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Navigation Bar */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="rounded-xl bg-slate-800 p-2 text-slate-300 hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div>
              <h1 className="text-lg font-bold text-white">
                Live Kitchen & Order Kanban Board
              </h1>

              <p className="text-xs text-slate-400">
                Track and advance order status in real time
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by ID, Name, Phone..."
              className="border-slate-800 bg-slate-950 pl-10 text-xs text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => {
            const columnOrders = filteredOrders.filter(
              (order) => order.status === column.key
            );

            return (
              <div
                key={column.key}
                className="flex h-[calc(100vh-200px)] min-h-[500px] flex-col rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4"
              >
                {/* Column Header */}
                <div
                  className={`mb-4 flex items-center justify-between rounded-xl border p-3 text-xs font-bold ${column.color}`}
                >
                  <span>{column.label}</span>

                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950/80 text-xs">
                    {columnOrders.length}
                  </span>
                </div>

                {/* Orders */}
                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {loading && columnOrders.length === 0 ? (
                    <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-600">
                      Loading orders...
                    </div>
                  ) : columnOrders.length === 0 ? (
                    <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-800 p-4 text-center text-xs text-slate-600">
                      No orders in this stage
                    </div>
                  ) : (
                    columnOrders.map((order) => (
                      <Card
                        key={order.id}
                        className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-lg transition-all hover:border-orange-500/40"
                      >
                        {/* Order Header */}
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-xs font-extrabold text-orange-400">
                            {order.orderReference}
                          </span>

                          <Badge
                            variant="outline"
                            className="border-slate-800 bg-slate-900 text-[11px] text-slate-300"
                          >
                            {order.orderType === "DINE_IN"
                              ? "Dine In"
                              : "Takeaway"}
                          </Badge>
                        </div>

                        {/* Customer */}
                        <div>
                          <h4 className="flex items-center gap-1.5 text-xs font-bold text-white">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            {order.customerName}
                          </h4>

                          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                            <Phone className="h-3 w-3 text-slate-500" />
                            {order.phoneNumber}
                          </p>
                        </div>

                        {/* Items */}
                        <div className="space-y-1 rounded-xl bg-slate-900/80 p-2.5 text-[11px] text-slate-300">
                          {order.items.map((item) => (
                            <div
                              key={item.menuItemId}
                              className="flex justify-between gap-2"
                            >
                              <span className="max-w-[140px] truncate">
                                {item.quantity}x {item.menuItemName}
                              </span>

                              <span className="font-semibold text-slate-400">
                                ${item.subtotal.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Total & Actions */}
                        <div className="flex items-center justify-between pt-1 text-xs">
                          <span className="font-bold text-white">
                            ${order.total.toFixed(2)}
                          </span>

                          <div className="flex gap-1">
                            {/* PLACED → PREPARING */}
                            {column.key === "PLACED" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(
                                    order.id,
                                    "PREPARING",
                                    order.orderReference
                                  )
                                }
                                className="h-7 bg-orange-500 px-2.5 text-[11px] font-bold text-white hover:bg-orange-600"
                              >
                                Cook
                                <ArrowRight className="ml-1 h-3 w-3" />
                              </Button>
                            )}

                            {/* PREPARING → READY */}
                            {column.key === "PREPARING" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(
                                    order.id,
                                    "READY",
                                    order.orderReference
                                  )
                                }
                                className="h-7 bg-blue-500 px-2.5 text-[11px] font-bold text-white hover:bg-blue-600"
                              >
                                Ready
                                <ArrowRight className="ml-1 h-3 w-3" />
                              </Button>
                            )}

                            {/* READY → COMPLETED */}
                            {column.key === "READY" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(
                                    order.id,
                                    "COMPLETED",
                                    order.orderReference
                                  )
                                }
                                className="h-7 bg-emerald-500 px-2.5 text-[11px] font-bold text-white hover:bg-emerald-600"
                              >
                                Serve
                                <CheckCircle2 className="ml-1 h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
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
