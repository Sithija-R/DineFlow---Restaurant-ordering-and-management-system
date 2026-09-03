import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  BellRing,
  RefreshCw,
  PackageCheck,
  ChefHat,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

import { useOrderStore } from "@/stores/orderStore";
import type { OrderStatus } from "@/types/order";

const statusSteps: {
  key: OrderStatus;
  label: string;
  desc: string;
  icon: typeof Clock;
}[] = [
  {
    key: "PLACED",
    label: "Order Received",
    desc: "Sent to kitchen",
    icon: PackageCheck,
  },
  {
    key: "CONFIRMED",
    label: "Order Confirmed",
    desc: "Kitchen accepted",
    icon: CheckCircle,
  },
  {
    key: "PREPARING",
    label: "Chef Cooking",
    desc: "Preparing your meal",
    icon: ChefHat,
  },
  {
    key: "READY",
    label: "Ready for Service",
    desc: "Ready to be served",
    icon: Clock,
  },
  {
    key: "COMPLETED",
    label: "Completed",
    desc: "Enjoy your meal",
    icon: CheckCircle,
  },
];

const getStatusStepIndex = (status: OrderStatus): number => {
  switch (status) {
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

    case "CANCELLED":
      return -1;

    default:
      return 0;
  }
};

const getStatusBadgeClass = (status: OrderStatus) => {
  switch (status) {
    case "PLACED":
      return "border-blue-500/30 bg-blue-500/10 text-blue-400";

    case "CONFIRMED":
      return "border-cyan-500/30 bg-cyan-500/10 text-cyan-400";

    case "PREPARING":
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";

    case "READY":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";

    case "COMPLETED":
      return "border-green-500/30 bg-green-500/10 text-green-400";

    case "CANCELLED":
      return "border-red-500/30 bg-red-500/10 text-red-400";

    default:
      return "border-slate-700 bg-slate-800 text-slate-400";
  }
};

export default function OrderStatus() {
  const location = useLocation();

  const { currentOrder, loading, error, getOrderByReference } = useOrderStore();

  const [searchReference, setSearchReference] = useState("");

  /*
   * Checkout sends the newly-created order reference
   * through React Router state.
   */
  const orderReference = location.state?.orderReference as string | undefined;

  /*
   * Load the order automatically when coming from Checkout.
   */
  useEffect(() => {
    if (!orderReference) {
      return;
    }

    setSearchReference(orderReference);

    const loadOrder = async () => {
      try {
        await getOrderByReference(orderReference);
      } catch (error) {
        console.error("Failed to load order:", error);

        toast.add({
          title: "Unable to load order",
          description:
            error instanceof Error
              ? error.message
              : "We could not find your order.",
          type: "error",
        });
      }
    };

    loadOrder();
  }, [orderReference, getOrderByReference]);

  /*
   * Search order by reference.
   */
  const handleSearch = async () => {
    const reference = searchReference.trim();

    if (!reference) {
      toast.add({
        title: "Order reference required",
        description: "Please enter your order reference.",
        type: "warning",
      });

      return;
    }

    try {
      await getOrderByReference(reference);

      toast.add({
        title: "Order found",
        description: `Order ${reference} has been loaded.`,
        type: "success",
      });
    } catch (error) {
      console.error("Failed to find order:", error);

      toast.add({
        title: "Order not found",
        description:
          error instanceof Error
            ? error.message
            : "No order was found with that reference.",
        type: "error",
      });
    }
  };

  /*
   * Allow Enter key to search.
   */
  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  /*
   * Refresh currently displayed order.
   */
  const handleRefresh = async () => {
    if (!currentOrder) {
      return;
    }

    try {
      await getOrderByReference(currentOrder.orderReference);

      toast.add({
        title: "Order refreshed",
        description: "Latest order status has been loaded.",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to refresh order:", error);

      toast.add({
        title: "Refresh failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to refresh the order.",
        type: "error",
      });
    }
  };

  /*
   * Demo waiter notification.
   */
  const handleCallWaiter = () => {
    if (!currentOrder) {
      return;
    }

    const locationText =
      currentOrder.orderType === "DINE_IN" && currentOrder.tableNumber
        ? `Table ${currentOrder.tableNumber}`
        : "your table";

    toast.add({
      title: "Waiter notified",
      description: `A waiter has been notified to assist at ${locationText}.`,
      type: "success",
    });
  };

  /*
   * Loading state.
   */
  if (loading && !currentOrder) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Search bar remains visible while loading */}
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                  <Input
                    value={searchReference}
                    onChange={(e) => setSearchReference(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Enter order reference..."
                    className="border-slate-700 bg-slate-950 pl-10 text-white placeholder:text-slate-500"
                  />
                </div>

                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-orange-500 text-white hover:bg-orange-600"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search Order
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40 bg-slate-800" />
              <Skeleton className="mt-3 h-8 w-64 bg-slate-800" />
              <Skeleton className="mt-2 h-4 w-48 bg-slate-800" />
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-32 rounded-2xl bg-slate-800"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40 bg-slate-800" />
            </CardHeader>

            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-16 w-full rounded-xl bg-slate-800"
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  /*
   * No order loaded yet.
   */
  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10">
                <Search className="h-6 w-6 text-orange-400" />
              </div>

              <CardTitle className="mt-2 text-xl text-white">
                Track Your Order
              </CardTitle>

              <p className="text-xs text-slate-400">
                Enter your order reference to view the current kitchen status.
              </p>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                  <Input
                    value={searchReference}
                    onChange={(e) => setSearchReference(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="e.g. ORD-2026-001"
                    className="h-11 border-slate-700 bg-slate-950 pl-10 text-white placeholder:text-slate-500 focus-visible:ring-orange-500"
                  />
                </div>

                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="h-11 bg-orange-500 px-6 text-white hover:bg-orange-600"
                >
                  {loading ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  Search
                </Button>
              </div>

              {error && (
                <p className="mt-3 text-center text-xs text-red-400">{error}</p>
              )}

              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
                  render={<Link to="/menu" />}
                >
                  Back to Menu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentStep = getStatusStepIndex(currentOrder.status);

  /*
   * OrderResponse doesn't contain subtotal,
   * so calculate it from order items.
   */
  const subtotal = currentOrder.items.reduce(
    (total, item) => total + item.subtotal,
    0
  );

  const total = currentOrder.total;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* ================================= */}
        {/* Search Order                       */}
        {/* ================================= */}

        <Card>
          <CardContent className="p-5">
            <div className="mb-3">
              <h2 className="text-sm font-bold text-white">
                Track Another Order
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Enter an order reference to view its current status.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <Input
                  value={searchReference}
                  onChange={(e) => setSearchReference(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Enter order reference..."
                  className="h-10 border-slate-700 bg-slate-950 pl-10 text-white placeholder:text-slate-500 focus-visible:ring-orange-500"
                />
              </div>

              <Button
                onClick={handleSearch}
                disabled={loading}
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                {loading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                Search Order
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ================================= */}
        {/* Order Header                       */}
        {/* ================================= */}

        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

          <CardHeader className="relative border-b border-slate-800 pb-6">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-orange-500/20 bg-orange-500/10 text-orange-400">
                    Live Order Tracker
                  </Badge>

                  <span className="text-xs text-slate-400">
                    Order #
                    <strong className="ml-1 text-white">
                      {currentOrder.orderReference}
                    </strong>
                  </span>
                </div>

                <h1 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                  Status:{" "}
                  <span
                    className={
                      getStatusBadgeClass(currentOrder.status)
                        .split(" ")
                        .find((className) => className.startsWith("text-")) ||
                      "text-slate-400"
                    }
                  >
                    {currentOrder.status}
                  </span>
                </h1>

                <p className="mt-2 text-xs text-slate-400">
                  Customer:{" "}
                  <strong className="text-slate-200">
                    {currentOrder.customerName}
                  </strong>
                  {currentOrder.orderType === "DINE_IN" &&
                    currentOrder.tableNumber && (
                      <>
                        {" "}
                        · Table{" "}
                        <strong className="text-slate-200">
                          {currentOrder.tableNumber}
                        </strong>
                      </>
                    )}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
              >
                <RefreshCw
                  className={`mr-2 h-3.5 w-3.5 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>
            </div>
          </CardHeader>

          <CardContent className="relative pt-8">
            {/* Cancelled */}
            {currentOrder.status === "CANCELLED" ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                  <Clock className="h-6 w-6" />
                </div>

                <h3 className="mt-3 font-bold text-white">Order Cancelled</h3>

                <p className="mt-1 text-xs text-slate-400">
                  Unfortunately, this order has been cancelled.
                </p>
              </div>
            ) : (
              /* Status Stepper */
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {statusSteps.map((step, index) => {
                  const isPassed = index < currentStep;
                  const isCurrent = index === currentStep;

                  const Icon = step.icon;

                  return (
                    <div
                      key={step.key}
                      className={[
                        "flex flex-col items-center rounded-2xl border p-4 text-center transition-all",
                        isCurrent
                          ? "border-orange-500 bg-orange-500/10 text-white shadow-lg shadow-orange-500/10 ring-1 ring-orange-500"
                          : isPassed
                          ? "border-emerald-500/40 bg-slate-950/80 text-emerald-400"
                          : "border-slate-800 bg-slate-950/40 text-slate-500",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "mb-3 flex h-10 w-10 items-center justify-center rounded-full",
                          isCurrent
                            ? "bg-orange-500 text-white"
                            : isPassed
                            ? "bg-emerald-500 text-slate-950"
                            : "bg-slate-800 text-slate-500",
                        ].join(" ")}
                      >
                        {isPassed ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>

                      <span className="text-xs font-bold">{step.label}</span>

                      <span className="mt-1 text-[10px] text-slate-400">
                        {step.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ================================= */}
        {/* Order Details                       */}
        {/* ================================= */}

        <Card>
          <CardHeader className="border-b border-slate-800">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <CardTitle className="text-lg font-bold text-white">
                Ordered Items
              </CardTitle>

              <Badge
                variant="outline"
                className="w-fit border-slate-700 bg-slate-950 text-slate-300"
              >
                {currentOrder.orderType === "DINE_IN"
                  ? `Dine In${
                      currentOrder.tableNumber
                        ? ` · Table ${currentOrder.tableNumber}`
                        : ""
                    }`
                  : "Takeaway"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              {currentOrder.items.map((item) => (
                <div
                  key={item.menuItemId}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-800/60 bg-slate-950/60 p-3.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-xs font-extrabold text-orange-400">
                      {item.quantity}x
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-semibold text-white">
                        {item.menuItemName}
                      </h4>

                      <p className="text-xs text-slate-400">
                        LKR {item.unitPrice.toFixed(2)} each
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-sm font-bold text-orange-400">
                    LKR {item.subtotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="bg-slate-800" />

            {/* Pricing */}
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>

                <span className="font-medium text-slate-200">
                  LKR {subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Order Total</span>

                <span className="font-medium text-slate-200">
                  LKR {total.toFixed(2)}
                </span>
              </div>

              <Separator className="my-3 bg-slate-800" />

              <div className="flex justify-between text-base font-extrabold text-white">
                <span>Total</span>

                <span className="text-orange-400">LKR {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Assistance */}
            <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={handleCallWaiter}
                className="w-full border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white sm:w-auto"
              >
                <BellRing className="mr-2 h-4 w-4 text-orange-400" />
                Call Waiter
              </Button>

              <Button
                className="w-full bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 sm:w-auto"
                render={<Link to="/menu" />}
              >
                Order More Items
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ================================= */}
        {/* Order Information                  */}
        {/* ================================= */}

        <Card>
          <CardContent className="p-5">
            <div className="flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-slate-500">Order Reference</span>

                <p className="mt-1 font-semibold text-slate-200">
                  {currentOrder.orderReference}
                </p>
              </div>

              <div>
                <span className="text-slate-500">Placed At</span>

                <p className="mt-1 font-semibold text-slate-200">
                  {new Date(currentOrder.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <span className="text-slate-500">Current Status</span>

                <Badge
                  className={`mt-1 ${getStatusBadgeClass(currentOrder.status)}`}
                >
                  {currentOrder.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
