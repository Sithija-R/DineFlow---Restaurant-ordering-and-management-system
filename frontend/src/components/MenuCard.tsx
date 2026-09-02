import React, { useState } from "react";
import { useDineFlow } from "../context/DineFlowContext";
import { Star, Plus, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import type { MenuItem } from "../types/menu";
import { useCartStore } from "@/stores/cartStore";

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const { addItem } = useCartStore(); 

  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const isAvailable =
    item.status !== "OUT_OF_STOCK" && item.availableCount > 0;

  const handleAddToCart = () => {
    if (!isAvailable) return;

    addItem({ menuItem : item, quantity});
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-600">
            No image available
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

        {/* Category */}
        {item.categoryName && (
          <div className="absolute left-3 top-3">
            <Badge className="border-slate-700/50 bg-slate-900/80 text-slate-300">
              {item.categoryName}
            </Badge>
          </div>
        )}

        {/* Rating - kept for same visual styling */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/70 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          4.9
        </div>

        {/* Price */}
        <span className="absolute bottom-3 left-3 rounded-lg bg-slate-950/85 px-3 py-1.5 text-lg font-bold text-orange-400 backdrop-blur-md">
          LKR {item.price.toFixed(2)}
        </span>

        {/* Sold Out */}
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm">
            <Badge
              variant="outline"
              className="border-red-500/40 bg-red-500/15 px-3 py-1.5 text-xs text-red-400"
            >
              Currently Sold Out
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-lg font-bold text-white transition-colors group-hover:text-orange-400">
          {item.name}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-400">
          {item.description}
        </p>

        {/* Stock */}
        {isAvailable && (
          <div className="mt-3 text-xs text-slate-400">
            {item.availableCount} available
          </div>
        )}

        <div className="mt-auto">
          <Separator className="my-4 bg-slate-800" />

          <div className="flex items-center gap-2">
            {/* Quantity */}
            {isAvailable && (
              <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  className="h-7 w-7 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  −
                </Button>

                <span className="w-6 text-center text-xs font-bold text-white">
                  {quantity}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  disabled={quantity >= item.availableCount}
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(item.availableCount, q + 1)
                    )
                  }
                  className="h-7 w-7 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  +
                </Button>
              </div>
            )}

            {/* Add to Cart */}
            <Button
              disabled={!isAvailable}
              onClick={handleAddToCart}
              className={`h-9 flex-1 rounded-lg text-xs font-semibold ${
                !isAvailable
                  ? "bg-slate-800 text-slate-500"
                  : added
                    ? "bg-emerald-500 text-white hover:bg-emerald-500"
                    : "dineflow-gradient text-white hover:opacity-90"
              }`}
            >
              {added ? (
                <>
                  <Check className="mr-1.5 h-3.5 w-3.5" />
                  Added!
                </>
              ) : isAvailable ? (
                <>
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Add to Cart
                </>
              ) : (
                "Unavailable"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

