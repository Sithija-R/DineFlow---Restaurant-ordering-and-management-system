import { useEffect } from "react";
import { Link } from "react-router-dom";
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
  Plus,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";

import { useOrderStore } from "@/stores/orderStore";
import { useAuthStore } from "@/stores/authStore";
import type { OrderStatus } from "@/types/order";

export default function Dashboard() {

  const { orders, loading, error, fetchOrders, updateOrderStatus } = useOrderStore();
  const { userInfo } = useAuthStore();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        await fetchOrders();
      } catch (error) {
        console.error("Failed to load orders:", error);
        toast.add({
          title: "Failed to load orders",
          description: error instanceof Error ? error.message : "Unable to load orders.",
          type: "error",
        });
      }
    };
    loadOrders();
  }, [fetchOrders]);


    //  ORDER COUNTS
  const activeOrders = orders.filter(
    (order) => order.status !== "COMPLETED" && order.status !== "CANCELLED"
  );

  const activeOrdersCount = activeOrders.length;

  const totalRevenue = orders
    .filter((order) => order.status !== "CANCELLED")
    .reduce((sum, order) => sum + (order.total || 0), 0);

  const placedOrdersCount = orders.filter(
    (order) => order.status === "PLACED"
  ).length;

  const confirmedOrdersCount = orders.filter(
    (order) => order.status === "CONFIRMED"
  ).length;

  const preparingOrdersCount = orders.filter(
    (order) => order.status === "PREPARING"
  ).length;

  const readyOrdersCount = orders.filter(
    (order) => order.status === "READY"
  ).length;

  const completedOrdersCount = orders.filter(
    (order) => order.status === "COMPLETED"
  ).length;

  const cancelledOrdersCount = orders.filter(
    (order) => order.status === "CANCELLED"
  ).length;


// STATUS UPDATE
  const handleStatusChange = async (orderId: number, status: OrderStatus) => {
    const order = orders.find((item) => item.id === orderId);

    try {
      await updateOrderStatus(orderId, status);

      toast.add({
        title: "Order status updated",
        description: order
          ? `Order ${order.orderReference} is now ${status}.`
          : `Order status changed to ${status}.`,
        type: "success",
      });
    } catch (error) {
      console.error("Failed to update order status:", error);

      toast.add({
        title: "Update failed",
        description:error instanceof Error ? error.message : "Unable to update the order status.",
        type: "error",
      });
    }
  };

  const handleRetry = async () => {
    try {
      await fetchOrders();

      toast.add({
        title: "Orders refreshed",
        description: "Latest orders have been loaded.",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to refresh orders:", error);

      toast.add({
        title: "Refresh failed",
        description:
          error instanceof Error ? error.message : "Unable to refresh orders.",
        type: "error",
      });
    }
  };

  const getStatusClass = (status: OrderStatus) => {
    switch (status) {
      case "PLACED":
        return "border-orange-500/20 bg-orange-500/10 text-orange-400";

      case "CONFIRMED":
        return "border-purple-500/20 bg-purple-500/10 text-purple-400";

      case "PREPARING":
        return "border-amber-500/20 bg-amber-500/10 text-amber-400";

      case "READY":
        return "border-blue-500/20 bg-blue-500/10 text-blue-400";

      case "COMPLETED":
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

      case "CANCELLED":
        return "border-red-500/20 bg-red-500/10 text-red-400";

      default:
        return "border-slate-500/20 bg-slate-500/10 text-slate-400";
    }
  };

  const getOrderLocation = (
    orderType: "DINE_IN" | "TAKEAWAY",
    tableNumber?: number
  ) => {
    if (orderType === "DINE_IN") {
      return tableNumber ? `Table ${tableNumber}` : "Dine-In";
    }

    return "Takeaway";
  };

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 8);

  /* -----------------------------
     LOADING SKELETON
  ----------------------------- */

  const MetricsSkeleton = () => (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="border-slate-800 bg-slate-900/80">
          <CardContent className="space-y-4 p-5">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28 bg-slate-800" />
              <Skeleton className="h-9 w-9 rounded-xl bg-slate-800" />
            </div>

            <Skeleton className="h-8 w-24 bg-slate-800" />
            <Skeleton className="h-3 w-40 bg-slate-800" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (

    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* =============================
            ADMIN NAVIGATION
        ============================== */}

        <Card className="border-slate-800 bg-slate-900/90">
          <CardContent className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                <ChefHat className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-lg font-bold text-white">
                  Management Console
                </h1>

                <p className="text-xs text-slate-400">
                  Welcome{" "}
                  <span className="font-medium text-slate-300">
                    {userInfo?.name || "Administrator"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                className="bg-orange-500 text-xs font-bold text-white hover:bg-orange-600"
                render={<Link to="/admin/dashboard" />}
              >
                Dashboard
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 hover:text-white"
                render={<Link to="/admin/menu-management" />}
              >
                Menu Mgmt
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 hover:text-white"
                render={<Link to="/admin/order-management" />}
              >
                Orders ({activeOrdersCount})
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 hover:text-white"
                render={<Link to="/admin/reservation-management" />}
              >
                Reservations
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* =============================
            METRICS
        ============================== */}

        {loading && orders.length === 0 ? (
          <MetricsSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* TOTAL REVENUE */}

            <Card className="!border-slate-700 bg-slate-900/80">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold text-slate-400">
                    Total Revenue
                  </CardTitle>

                  <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400">
                    <DollarSign className="h-4 w-4" />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-extrabold text-white">
                    {totalRevenue.toFixed(2)}
                  </h3>
                  <p>LKR</p>
                  <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-400">
                    <TrendingUp className="h-3 w-3" />
                    Revenue
                  </span>
                </div>

                <p className="mt-2 text-[11px] text-slate-500">
                  Revenue from non-cancelled orders
                </p>
              </CardContent>
            </Card>

            {/* ACTIVE ORDERS */}

            <Card className="border-slate-800 bg-slate-900/80">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold text-slate-400">
                    Active Kitchen Orders
                  </CardTitle>

                  <div className="rounded-xl bg-orange-500/10 p-2 text-orange-400">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-extrabold text-white">
                    {activeOrdersCount}
                  </h3>

                  <span className="text-[11px] font-bold text-orange-400">
                    Active
                  </span>
                </div>

                <p className="mt-2 text-[11px] text-slate-500">
                  Orders currently being processed
                </p>
              </CardContent>
            </Card>

            {/* PREPARING */}

            <Card className="border-slate-800 bg-slate-900/80">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold text-slate-400">
                    Preparing Orders
                  </CardTitle>

                  <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400">
                    <ChefHat className="h-4 w-4" />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-extrabold text-white">
                    {preparingOrdersCount}
                  </h3>

                  <span className="text-[11px] font-bold text-amber-400">
                    Kitchen
                  </span>
                </div>

                <p className="mt-2 text-[11px] text-slate-500">
                  Orders currently being prepared
                </p>
              </CardContent>
            </Card>

            {/* READY */}

            <Card className="border-slate-800 bg-slate-900/80">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold text-slate-400">
                    Ready Orders
                  </CardTitle>

                  <div className="rounded-xl bg-blue-500/10 p-2 text-blue-400">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-extrabold text-white">
                    {readyOrdersCount}
                  </h3>

                  <span className="text-[11px] font-bold text-blue-400">
                    Ready
                  </span>
                </div>

                <p className="mt-2 text-[11px] text-slate-500">
                  Orders ready for customers
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* =============================
            STATUS OVERVIEW
        ============================== */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Card className="border-slate-800 bg-slate-900/80">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold text-slate-400">
                  New Orders
                </p>

                <h3 className="mt-2 text-2xl font-extrabold text-white">
                  {placedOrdersCount}
                </h3>
              </div>

              <Badge
                variant="outline"
                className="border-orange-500/20 bg-orange-500/10 text-orange-400"
              >
                PLACED
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/80">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold text-slate-400">Kitchen</p>

                <h3 className="mt-2 text-2xl font-extrabold text-white">
                  {preparingOrdersCount}
                </h3>
              </div>

              <Badge
                variant="outline"
                className="border-amber-500/20 bg-amber-500/10 text-amber-400"
              >
                PREPARING
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/80">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs font-semibold text-slate-400">
                  Ready for Pickup
                </p>

                <h3 className="mt-2 text-2xl font-extrabold text-white">
                  {readyOrdersCount}
                </h3>
              </div>

              <Badge
                variant="outline"
                className="border-blue-500/20 bg-blue-500/10 text-blue-400"
              >
                READY
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* =============================
            MAIN CONTENT
        ============================== */}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* LIVE ORDERS */}

          <Card className="border-slate-800 bg-slate-900/80 lg:col-span-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-white">
                    Live Kitchen Orders
                  </CardTitle>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Latest orders received by the restaurant
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-semibold text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
                  render={<Link to="/admin/order-management" />}
                >
                  View Orders
                  <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>

            <Separator className="bg-slate-800" />

            <CardContent className="p-0">
              {loading && orders.length === 0 ? (
                <div className="space-y-4 p-6">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-24 bg-slate-800" />
                      <Skeleton className="h-10 flex-1 bg-slate-800" />
                      <Skeleton className="h-8 w-24 bg-slate-800" />
                    </div>
                  ))}
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                  <ShoppingBag className="mb-3 h-8 w-8 text-slate-600" />
                  <p className="text-sm font-semibold text-slate-300">
                    No orders yet
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    New customer orders will appear here.
                  </p>

                  {error && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRetry}
                      disabled={loading}
                      className="mt-4 border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <RefreshCw
                        className={`mr-2 h-3.5 w-3.5 ${
                          loading ? "animate-spin" : ""
                        }`}
                      />
                      Retry
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/60 text-slate-400">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Order</th>
                        <th className="px-4 py-3 font-semibold">Customer</th>
                        <th className="px-4 py-3 font-semibold">Table / Type</th>
                        <th className="px-4 py-3 font-semibold">Total</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 text-right font-semibold">Update</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-800/60">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="transition-colors hover:bg-slate-950/40">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-bold text-orange-400">
                                #{order.orderReference}
                              </p>
                              <p className="mt-0.5 text-[10px] text-slate-600">
                                ID: {order.id}
                              </p>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-white">
                                {order.customerName}
                              </p>

                              <p className="mt-0.5 text-[10px] text-slate-500">
                                {order.phoneNumber}
                              </p>
                            </div>
                          </td>

                          <td className="px-4 py-3 text-slate-400">
                            {getOrderLocation(
                              order.orderType,
                              order.tableNumber
                            )}
                          </td>

                          <td className="px-4 py-3 font-semibold text-slate-200">
                            ${order.total.toFixed(2)}
                          </td>

                          <td className="px-4 py-3">
                            <Badge
                              variant="outline"
                              className={getStatusClass(order.status)}
                            >
                              {order.status}
                            </Badge>
                          </td>

                          <td className="px-4 py-3 text-right">
                            <Select
                              value={order.status}
                              disabled={loading}
                              onValueChange={(value) =>
                                handleStatusChange(
                                  order.id,
                                  value as OrderStatus
                                )
                              }
                            >
                              <SelectTrigger className="ml-auto h-8 w-[125px] border-slate-800 bg-slate-950 text-[11px] text-slate-300">
                                <SelectValue />
                              </SelectTrigger>

                              <SelectContent className="border-slate-800 bg-slate-900 text-white">
                                <SelectItem value="PLACED">Placed</SelectItem>
                                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                <SelectItem value="PREPARING">Preparing</SelectItem>
                                <SelectItem value="READY">Ready</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* =============================
              RIGHT SIDEBAR
          ============================== */}

          <div className="space-y-6 lg:col-span-4">
            {/* QUICK ACTIONS */}

            <Card className="border-slate-800 bg-slate-900/80">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-white">
                  Kitchen Quick Actions
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="h-auto w-full justify-between border-slate-800 bg-slate-950 p-3 text-xs font-semibold text-slate-200 hover:border-orange-500/40 hover:bg-slate-900 hover:text-white"
                  render={<Link to="/admin/menu-management" />}
                >
                  <span className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-orange-400" />
                    Add New Menu Item
                  </span>

                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-500" />
                </Button>

                <Button
                  variant="outline"
                  className="h-auto w-full justify-between border-slate-800 bg-slate-950 p-3 text-xs font-semibold text-slate-200 hover:border-orange-500/40 hover:bg-slate-900 hover:text-white"
                  render={<Link to="/admin/kitchen-display-board" />}
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-orange-400" />
                    Kitchen Display Board
                  </span>

                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-500" />
                </Button>

                <Button
                  variant="outline"
                  className="h-auto w-full justify-between border-slate-800 bg-slate-950 p-3 text-xs font-semibold text-slate-200 hover:border-orange-500/40 hover:bg-slate-900 hover:text-white"
                  render={<Link to="/admin/order-management" />}
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-400" />
                    Manage Table Bookings
                  </span>

                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-500" />
                </Button>
              </CardContent>
            </Card>

            {/* STATUS SUMMARY */}

            <Card className="border-slate-800 bg-slate-900/80">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-white">
                  Order Status Summary
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Placed</span>

                  <span className="font-bold text-orange-400">
                    {placedOrdersCount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Confirmed</span>

                  <span className="font-bold text-purple-400">
                    {confirmedOrdersCount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Preparing</span>

                  <span className="font-bold text-amber-400">
                    {preparingOrdersCount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Ready</span>

                  <span className="font-bold text-blue-400">
                    {readyOrdersCount}
                  </span>
                </div>

                <Separator className="bg-slate-800" />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Completed</span>

                  <span className="font-bold text-emerald-400">
                    {completedOrdersCount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Cancelled</span>

                  <span className="font-bold text-red-400">
                    {cancelledOrdersCount}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* TOTAL ORDERS */}

            <Card className="border-slate-800 bg-slate-900/80">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-orange-500/10 p-3 text-orange-400">
                    <UtensilsCrossed className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Total Orders</p>

                    <p className="text-xl font-extrabold text-white">
                      {orders.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
