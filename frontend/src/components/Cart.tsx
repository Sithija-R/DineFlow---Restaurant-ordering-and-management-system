import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDineFlow } from "../context/DineFlowContext";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export default function Cart() {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useDineFlow();
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const { subtotal, tax, total } = getCartTotal();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout", { state: { notes } });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="flex w-screen max-w-md flex-col border-l border-slate-800 bg-slate-900 text-white shadow-2xl animate-in slide-in-from-right duration-300">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Your Order</h2>
                <p className="text-xs text-slate-400">{cart.length} item{cart.length !== 1 ? "s" : ""} in cart</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:bg-slate-800 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Items */}
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-slate-700/50 bg-slate-800/80 text-slate-600">
                  <Utensils className="h-10 w-10" />
                </div>
                <h3 className="text-base font-bold text-slate-300">Your cart is empty</h3>
                <p className="mt-2 max-w-xs text-xs text-slate-500">Explore our exquisite menu and add gourmet dishes to begin your order.</p>
                <Button onClick={() => setIsCartOpen(false)} className="dineflow-gradient mt-6 rounded-xl px-5 text-xs font-medium text-white hover:opacity-90">
                  Browse Menu
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Items</span>
                  <Button variant="ghost" size="sm" onClick={clearCart} className="h-7 px-2 text-xs text-red-400 hover:bg-transparent hover:text-red-300">
                    <Trash2 className="mr-1 h-3.5 w-3.5" /> Clear All
                  </Button>
                </div>

                <Separator className="bg-slate-800" />

                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 transition-all hover:border-slate-700">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg bg-slate-800 object-cover" />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="truncate text-sm font-semibold text-white">{item.name}</h4>
                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="h-6 w-6 text-slate-500 hover:bg-transparent hover:text-red-400">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="mt-0.5 text-xs font-bold text-orange-400">${(item.price * item.quantity).toFixed(2)}</p>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">${item.price.toFixed(2)} each</span>

                        <div className="flex items-center rounded-md border border-slate-800 bg-slate-900 p-0.5">
                          <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, -1)} className="h-6 w-6 text-slate-400 hover:bg-slate-800 hover:text-white">
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                          <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, 1)} className="h-6 w-6 text-slate-400 hover:bg-slate-800 hover:text-white">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-2">
                  <label className="mb-1.5 block text-xs font-medium text-slate-300">Special Preparation Notes</label>
                  <Textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Extra spicy, sauce on the side..."
                    className="resize-none rounded-xl border-slate-800 bg-slate-950 text-xs text-white placeholder:text-slate-500 focus-visible:border-orange-500/50 focus-visible:ring-orange-500/20"
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="space-y-3 border-t border-slate-800 bg-slate-950 p-5">
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-slate-200">${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Estimated Tax (10%)</span><span className="font-medium text-slate-200">${tax.toFixed(2)}</span></div>
                <Separator className="my-2 bg-slate-800" />
                <div className="flex justify-between text-sm font-bold text-white"><span>Total Amount</span><span className="text-orange-400">${total.toFixed(2)}</span></div>
              </div>

              <Button onClick={handleCheckout} className="dineflow-gradient h-12 w-full rounded-xl text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:opacity-90">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

