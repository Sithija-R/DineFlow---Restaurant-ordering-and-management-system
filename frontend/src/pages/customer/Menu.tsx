import { useState, useMemo, useEffect } from "react";

import MenuCard from "../../components/MenuCard";

import { useMenuStore } from "@/stores/menuStore";
import { useCartStore } from "@/stores/cartStore";

import {
  Search,
  Utensils,
  Sparkles,
  ShoppingBag,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function Menu() {
  const {
    menuItems,
    categories,
    loading,
    error,
    fetchMenuItems,
    fetchCategories,
  } = useMenuStore();

  const { items, setIsCartOpen } = useCartStore();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCategories().catch(() => {});
    fetchMenuItems().catch(() => {});
  }, [fetchCategories, fetchMenuItems]);

  const filteredItems = useMemo(() => {
    if (!Array.isArray(menuItems)) {
      return [];
    }

    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.categoryName === selectedCategory;

      const search = searchQuery.toLowerCase().trim();

      const matchesSearch =
        item.name?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const totalCartCount = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [items]);

  const handleRetry = async () => {
    await Promise.allSettled([
      fetchCategories(),
      fetchMenuItems(),
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-slate-800/80 px-4 pb-16 pt-12 hero-gradient sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute right-1/4 top-0 -z-10 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="mx-auto max-w-5xl space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3.5 py-1.5 text-xs font-semibold text-orange-400">
            <Sparkles className="h-3.5 w-3.5" />
            Culinary Excellence Redefined
          </div>

          <h1 className="font-sans text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Explore Our{" "}
            <span className="text-gradient">
              Gourmet Menu
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Fresh artisanal ingredients, handcrafted by
            master chefs. Choose your favorite dishes and
            order directly to your table or home.
          </p>

          {/* Search */}
          <div className="mx-auto max-w-xl pt-4">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-slate-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search dishes by name, ingredient, or flavor..."
                className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 py-3.5 pl-12 pr-10 text-sm text-white shadow-xl placeholder:text-slate-500 transition-all focus:border-orange-500/50 focus:outline-none"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Categories */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800/80 pb-6 md:flex-row md:items-center">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                selectedCategory === "All"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20"
                  : "border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:text-white"
              }`}
            >
              All
            </button>

            {Array.isArray(categories) &&
              categories.map((cat) => {
                const selected =
                  selectedCategory === cat.name;

                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() =>
                      setSelectedCategory(cat.name)
                    }
                    className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                      selected
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20"
                        : "border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="my-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>

              <h3 className="text-lg font-bold text-red-300">
                Unable to Load Menu
              </h3>

              <p className="mt-1 max-w-md text-xs text-red-400/80">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRetry}
                disabled={loading}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Results Counter */}
        {!error && (
          <div className="flex items-center justify-between py-4 text-xs text-slate-400">
            <span>
              Showing{" "}
              <strong className="text-white">
                {filteredItems.length}
              </strong>{" "}
              items
            </span>

            {searchQuery && (
              <span>
                Searching for{" "}
                <strong className="text-orange-400">
                  "{searchQuery}"
                </strong>
              </span>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && menuItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-800/80 bg-slate-900/40 py-20">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-orange-400" />

            <h3 className="text-lg font-bold text-slate-300">
              Loading Menu
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Fetching today's dishes...
            </p>
          </div>
        ) : error ? null : filteredItems.length > 0 ? (
          /* Menu Cards */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="my-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 p-8 py-16 text-center">
            <Utensils className="mx-auto mb-3 h-12 w-12 text-slate-600" />

            <h3 className="text-lg font-bold text-slate-300">
              No dishes match your selection
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
              Try adjusting your category filter or search
              query to discover other menu items.
            </p>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-orange-400"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Mobile Cart Button */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-6 right-6 z-30 md:hidden">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3.5 text-sm font-bold text-white shadow-2xl shadow-orange-500/50"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>View Cart ({totalCartCount})</span>
          </button>
        </div>
      )}
    </div>
  );
}

