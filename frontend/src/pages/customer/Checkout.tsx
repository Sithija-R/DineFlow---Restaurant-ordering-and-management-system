import React, { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import {
  CreditCard,
  Smartphone,
  DollarSign,
  QrCode,
  Utensils,
  ShoppingBag,
  User,
  Phone,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { OrderRequest, OrderType } from "@/types/order";
import { useCartStore } from "@/stores/cartStore";
import { useOrderStore } from "@/stores/orderStore";
import { toast } from "@/components/ui/toast";

type PaymentMethod = "Credit Card" | "Apple Pay" | "UPI / QR" | "Cash";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Cart Zustand store
  const { items, getItemCount, getTotal, clearCart } = useCartStore();

  // Order Zustand store
  const { createOrder, loading } = useOrderStore();

  const [orderType, setOrderType] = useState<OrderType>("DINE_IN");

  const [customerName, setCustomerName] = useState("");

  const [customerPhone, setCustomerPhone] = useState("");

  const [customerEmail, setCustomerEmail] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Credit Card");

  const [notes, setNotes] = useState<string>(location.state?.notes || "");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const itemCount = getItemCount();


  if (itemCount === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-500">
          <ShoppingBag className="h-8 w-8" />
        </div>

        <h2 className="text-xl font-bold text-white">Your cart is empty</h2>

        <p className="mt-1 text-xs text-slate-400">
          Please add items to your cart before proceeding to checkout.
        </p>

        <Button
          type="button"
          onClick={() => navigate("/menu")}
          className="dineflow-gradient mt-6 text-white hover:opacity-90"
        >
          Return to Menu
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim()) {
      toast.add({
        title: "Required information missing",
        description: "Please fill out your name and contact phone number.",
        type: "warning",
      });

      return;
    }

    const orderItems = items.map((item) => ({
      menuItemId: item.menuItem.id,
      quantity: item.quantity,
    }));

    const orderRequest: OrderRequest = {
      customerName: customerName.trim(),
      phoneNumber: customerPhone.trim(),
      orderType,
      tableNumber: 1,
      items: orderItems,
    };

    try {
      setIsSubmitting(true);

      const createdOrder = await createOrder(orderRequest);

      clearCart();

      navigate("/order-status", {
        state: {
          newOrderId: createdOrder.id,
          orderReference: createdOrder.orderReference,
        },
      });
    } catch (error) {
      toast.add({
        title: "Order Submission Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to place order. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentOptions: {
    id: PaymentMethod;
    icon: React.ElementType;
    label: string;
  }[] = [
    {
      id: "Credit Card",
      icon: CreditCard,
      label: "Card",
    },
    {
      id: "Apple Pay",
      icon: Smartphone,
      label: "Apple Pay",
    },
    {
      id: "UPI / QR",
      icon: QrCode,
      label: "UPI QR",
    },
    {
      id: "Cash",
      icon: DollarSign,
      label: "Cash / Desk",
    },
  ];

  const isLoading = isSubmitting || loading;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}

        <div className="mb-8 flex items-end justify-between border-b border-slate-800 pb-5">
          <div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/menu")}
              className="-ml-3 mb-2 h-8 text-xs text-slate-400 hover:bg-transparent hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Menu
            </Button>

            <h1 className="text-3xl font-extrabold text-white">
              Checkout & Payment
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Finalize your order details for DineFlow Kitchen
            </p>
          </div>

          <Badge
            variant="outline"
            className="hidden gap-2 border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-orange-400 sm:flex"
          >
            <Clock className="h-4 w-4" />
            Est. Time: ~20-25 mins
          </Badge>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-7 lg:grid-cols-12"
        >
          {/* LEFT SIDE */}

          <div className="space-y-6 lg:col-span-7">
            {/* Order Experience */}

            <Card className="border-slate-800 bg-slate-900/80 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Utensils className="h-4 w-4 text-orange-400" />
                  1. Order Experience
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {/* DINE IN */}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOrderType("DINE_IN")}
                    className={`h-auto flex-col items-start p-4 text-left ${
                      orderType === "DINE_IN"
                        ? "border-orange-500 bg-orange-500/10 hover:bg-orange-500/10"
                        : "border-slate-800 bg-slate-950 hover:bg-slate-900"
                    }`}
                  >
                    <span className="text-[10px] uppercase text-orange-400">
                      Option A
                    </span>

                    <span className="mt-2 text-sm font-bold text-white">
                      Dine-In Service
                    </span>

                    <span className="mt-1 text-[11px] text-slate-500">
                      Enjoy your meal at the restaurant
                    </span>
                  </Button>

                  {/* TAKEAWAY */}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOrderType("TAKEAWAY")}
                    className={`h-auto flex-col items-start p-4 text-left ${
                      orderType === "TAKEAWAY"
                        ? "border-orange-500 bg-orange-500/10 hover:bg-orange-500/10"
                        : "border-slate-800 bg-slate-950 hover:bg-slate-900"
                    }`}
                  >
                    <span className="text-[10px] uppercase text-orange-400">
                      Option B
                    </span>

                    <span className="mt-2 text-sm font-bold text-white">
                      Express Takeaway
                    </span>

                    <span className="mt-1 text-[11px] text-slate-500">
                      Packed hot and ready for counter pickup
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* CONTACT INFORMATION */}

            <Card className="border-slate-800 bg-slate-900/80 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4 text-orange-400" />
                  2. Contact Information
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* NAME */}

                  <div>
                    <label className="mb-1.5 block text-xs text-slate-300">
                      Full Name *
                    </label>

                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />

                      <Input
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="border-slate-800 bg-slate-950 pl-10 text-xs text-white placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  {/* PHONE */}

                  <div>
                    <label className="mb-1.5 block text-xs text-slate-300">
                      Mobile Phone Number *
                    </label>

                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />

                      <Input
                        required
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+94 77 123 4567"
                        className="border-slate-800 bg-slate-950 pl-10 text-xs text-white placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                </div>

                {/* EMAIL */}

                <div>
                  <label className="mb-1.5 block text-xs text-slate-300">
                    Email Address (Optional for Receipt)
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />

                    <Input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="border-slate-800 bg-slate-950 pl-10 text-xs text-white placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* NOTES */}

                <div>
                  <label className="mb-1.5 block text-xs text-slate-300">
                    Kitchen Notes & Dietary Requests
                  </label>

                  <Textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Dressing on the side, no onions..."
                    className="resize-none border-slate-800 bg-slate-950 text-xs text-white placeholder:text-slate-600"
                  />
                </div>
              </CardContent>
            </Card>

            {/* PAYMENT METHOD */}

            <Card className="border-slate-800 bg-slate-900/80 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-4 w-4 text-orange-400" />
                  3. Payment Method
                </CardTitle>
              </CardHeader>

              <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {paymentOptions.map(({ id, icon: Icon, label }) => (
                  <Button
                    key={id}
                    type="button"
                    variant="outline"
                    onClick={() => setPaymentMethod(id)}
                    className={`h-auto flex-col gap-2 py-3 ${
                      paymentMethod === id
                        ? "border-orange-500 bg-orange-500/10 text-orange-400 hover:bg-orange-500/10"
                        : "border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE */}

          <div className="lg:col-span-5">
            <Card className="sticky top-28 border-slate-800 bg-slate-900/90 text-white shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span>Summary Breakdown</span>

                  <Badge className="bg-slate-800 text-slate-300">
                    {itemCount} pieces
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* ITEMS */}

                <div className="max-h-60 space-y-3 overflow-y-auto pr-1">
                  {items.map((item) => {
                    const menuItem = item.menuItem;

                    return (
                      <div
                        key={menuItem.id}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="flex h-5 w-8 shrink-0 items-center justify-center rounded bg-slate-800 text-slate-300">
                            {item.quantity}x
                          </span>

                          <span className="truncate font-medium text-slate-200">
                            {menuItem.name}
                          </span>
                        </div>

                        <span className="ml-3 shrink-0 font-semibold text-slate-300">
                          ${(menuItem.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Separator className="bg-slate-800" />

                {/* TOTALS */}

                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>

                    <span className="text-slate-200">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax & Service Charge (10%)</span>

                    <span className="text-slate-200">${tax.toFixed(2)}</span>
                  </div>

                  <Separator className="my-3 bg-slate-800" />

                  <div className="flex justify-between text-base font-extrabold text-white">
                    <span>Grand Total</span>

                    <span className="text-orange-400">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* SUBMIT */}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="dineflow-gradient h-12 w-full text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:opacity-90"
                >
                  {isLoading ? (
                    "Processing Order..."
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Confirm & Place Order ( ${total.toFixed(2)})
                    </>
                  )}
                </Button>

                <p className="text-center text-[11px] text-slate-500">
                  🔒 Safe & encrypted dining order transaction
                </p>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
