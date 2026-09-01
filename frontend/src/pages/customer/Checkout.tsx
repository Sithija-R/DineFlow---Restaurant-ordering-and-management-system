import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDineFlow } from "../../context/DineFlowContext";
import { CreditCard, Smartphone, DollarSign, QrCode, Utensils, ShoppingBag, User, Phone, Mail, ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type OrderType = "Dine-in" | "Takeaway";
type PaymentMethod = "Credit Card" | "Apple Pay" | "UPI / QR" | "Cash";

export default function Checkout() {
  const { cart, getCartTotal, placeOrder } = useDineFlow();
  const navigate = useNavigate();
  const location = useLocation();
  const [orderType, setOrderType] = useState<OrderType>("Dine-in");
  const [tableNumber, setTableNumber] = useState("T-04");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Credit Card");
  const [notes, setNotes] = useState(location.state?.notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { subtotal, tax, total } = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4"><ShoppingBag className="w-8 h-8" /></div>
        <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
        <p className="text-xs text-slate-400 mt-1">Please add items to your cart before proceeding to checkout.</p>
        <Button onClick={() => navigate("/menu")} className="dineflow-gradient mt-6 text-white hover:opacity-90">Return to Menu</Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert("Please fill out your name and contact phone number.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const createdOrder = placeOrder({ customerName, customerPhone, customerEmail, orderType, tableNumber: orderType === "Dine-in" ? tableNumber : "Takeaway Counter", paymentMethod, notes });
      setIsSubmitting(false);
      navigate("/order-status", { state: { newOrderId: createdOrder.id } });
    }, 1000);
  };

  const paymentOptions = [
    { id: "Credit Card" as PaymentMethod, icon: CreditCard, label: "Card" },
    { id: "Apple Pay" as PaymentMethod, icon: Smartphone, label: "Apple Pay" },
    { id: "UPI / QR" as PaymentMethod, icon: QrCode, label: "UPI QR" },
    { id: "Cash" as PaymentMethod, icon: DollarSign, label: "Cash / Desk" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between border-b border-slate-800 pb-5">
          <div>
            <Button variant="ghost" onClick={() => navigate("/menu")} className="mb-2 -ml-3 h-8 text-xs text-slate-400 hover:bg-transparent hover:text-white"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu</Button>
            <h1 className="text-3xl font-extrabold text-white">Checkout & Payment</h1>
            <p className="mt-1 text-xs text-slate-400">Finalize your order details for DineFlow Kitchen</p>
          </div>
          <Badge variant="outline" className="hidden gap-2 border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-orange-400 sm:flex"><Clock className="h-4 w-4" /> Est. Time: ~20-25 mins</Badge>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-7 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">

            <Card className="border-slate-800 bg-slate-900/80 text-white">
              <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Utensils className="h-4 w-4 text-orange-400" />1. Order Experience</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {(["Dine-in", "Takeaway"] as OrderType[]).map((type) => (
                    <Button key={type} type="button" variant="outline" onClick={() => setOrderType(type)} className={`h-auto flex-col items-start p-4 text-left ${orderType === type ? "border-orange-500 bg-orange-500/10 hover:bg-orange-500/10" : "border-slate-800 bg-slate-950 hover:bg-slate-900"}`}>
                      <span className="text-[10px] uppercase text-orange-400">{type === "Dine-in" ? "Option A" : "Option B"}</span>
                      <span className="mt-2 text-sm font-bold text-white">{type === "Dine-in" ? "Dine-In Table Service" : "Express Takeaway"}</span>
                      <span className="mt-1 text-[11px] text-slate-500">{type === "Dine-in" ? "Served directly to your designated table" : "Packed hot and ready for counter pickup"}</span>
                    </Button>
                  ))}
                </div>

                {orderType === "Dine-in" && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-300">Select Your Table Number</label>
                    <Select value={tableNumber} onValueChange={setTableNumber}>
                      <SelectTrigger className="border-slate-800 bg-slate-950 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent className="border-slate-800 bg-slate-900 text-white">
                        {["T-01", "T-02", "T-03", "T-04", "T-05", "T-08 (Patio)", "VIP Table 1"].map((table) => <SelectItem key={table} value={table}>Table {table}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/80 text-white">
              <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><User className="h-4 w-4 text-orange-400" />2. Contact Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div><label className="mb-1.5 block text-xs text-slate-300">Full Name *</label><div className="relative"><User className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><Input required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Alex Morgan" className="border-slate-800 bg-slate-950 pl-10 text-xs text-white placeholder:text-slate-600" /></div></div>
                  <div><label className="mb-1.5 block text-xs text-slate-300">Mobile Phone Number *</label><div className="relative"><Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><Input required type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="border-slate-800 bg-slate-950 pl-10 text-xs text-white placeholder:text-slate-600" /></div></div>
                </div>
                <div><label className="mb-1.5 block text-xs text-slate-300">Email Address (Optional for Receipt)</label><div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><Input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="alex@example.com" className="border-slate-800 bg-slate-950 pl-10 text-xs text-white placeholder:text-slate-600" /></div></div>
                <div><label className="mb-1.5 block text-xs text-slate-300">Kitchen Notes & Dietary Requests</label><Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Dressing on the side, no onions..." className="resize-none border-slate-800 bg-slate-950 text-xs text-white placeholder:text-slate-600" /></div>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/80 text-white">
              <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><CreditCard className="h-4 w-4 text-orange-400" />3. Payment Method</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {paymentOptions.map(({ id, icon: Icon, label }) => (
                  <Button key={id} type="button" variant="outline" onClick={() => setPaymentMethod(id)} className={`h-auto flex-col gap-2 py-3 ${paymentMethod === id ? "border-orange-500 bg-orange-500/10 text-orange-400 hover:bg-orange-500/10" : "border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900"}`}>
                    <Icon className="h-5 w-5" /><span className="text-xs">{label}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5">
            <Card className="sticky top-28 border-slate-800 bg-slate-900/90 text-white shadow-xl">
              <CardHeader><CardTitle className="flex items-center justify-between text-base">Summary Breakdown<Badge className="bg-slate-800 text-slate-300">{cart.length} items</Badge></CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className="max-h-60 space-y-3 overflow-y-auto pr-1">
                  {cart.map((item) => <div key={item.id} className="flex items-center justify-between text-xs"><div className="flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded bg-slate-800 text-slate-300">{item.quantity}x</span><span className="font-medium text-slate-200">{item.name}</span></div><span className="font-semibold text-slate-300">${(item.price * item.quantity).toFixed(2)}</span></div>)}
                </div>
                <Separator className="bg-slate-800" />
                <div className="space-y-2 text-xs text-slate-400"><div className="flex justify-between"><span>Subtotal</span><span className="text-slate-200">${subtotal.toFixed(2)}</span></div><div className="flex justify-between"><span>Tax & Service Charge (10%)</span><span className="text-slate-200">${tax.toFixed(2)}</span></div><Separator className="my-3 bg-slate-800" /><div className="flex justify-between text-base font-extrabold text-white"><span>Grand Total</span><span className="text-orange-400">${total.toFixed(2)}</span></div></div>
                <Button type="submit" disabled={isSubmitting} className="dineflow-gradient h-12 w-full text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:opacity-90">{isSubmitting ? "Processing Order..." : <><CheckCircle2 className="mr-2 h-5 w-5" /> Confirm & Place Order (${total.toFixed(2)})</>}</Button>
                <p className="text-center text-[11px] text-slate-500">🔒 Safe & encrypted dining order transaction</p>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}

