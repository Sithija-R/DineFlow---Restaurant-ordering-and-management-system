
import { Link, useLocation } from "react-router-dom";
import {
  UtensilsCrossed,
  ShoppingBag,
  Calendar,
  Clock,
  ShieldCheck,
  Menu as MenuIcon,
  ChefHat,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";

export default function Navbar() {
  
  const { isAuthenticated, logout } = useAuthStore();
  const { items, setIsCartOpen } = useCartStore();

  const location = useLocation();

  const totalCartItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      path: "/menu",
      label: "Menu",
      icon: UtensilsCrossed,
    },
    {
      path: "/reservation",
      label: "Reservation",
      icon: Calendar,
    },
    {
      path: "/order-status",
      label: "Track Order",
      icon: Clock,
    },
  ];

  return (
    <header className="sticky top-5 z-40 mx-auto flex h-16 w-[80%] justify-between rounded-4xl border border-slate-700 bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* ================= BRAND ================= */}
          <Link
            to="/"
            className="group flex items-center gap-3"
          >
            <UtensilsCrossed className="h-6 w-6 text-orange-400 transition-transform duration-300 group-hover:rotate-12" />

            <div className="flex items-center gap-1.5">
              <span className="font-sans text-2xl font-bold tracking-tight text-white">
                Dine<span className="text-orange-500">Flow</span>
              </span>
            </div>
          </Link>

          {/* ================= DESKTOP NAVIGATION ================= */}
          <nav className="hidden items-center gap-1 rounded-full border border-slate-800/80 bg-slate-950/60 p-1.5 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;

              const active =
                isActive(item.path) ||
                (item.path === "/menu" && isActive("/"));

              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  render={<Link to={item.path} />}
                  className={
                    active
                      ? "rounded-full dineflow-gradient px-4 text-white shadow-md shadow-orange-500/20 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 hover:text-white"
                      : "rounded-full px-4 text-slate-300 hover:bg-slate-800/50 hover:text-white"
                  }
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* ================= DESKTOP ACTIONS ================= */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Cart */}
            <Button
              variant="outline"
              onClick={() => setIsCartOpen(true)}
              className="relative gap-2.5 border-slate-700/60 bg-slate-800/80 text-slate-200 hover:border-orange-500/40 hover:bg-slate-800 hover:text-white"
            >
              <div className="relative">
                <ShoppingBag className="h-5 w-5 text-orange-400" />

                {totalCartItems > 0 && (
                  <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 p-0 text-[11px] text-white shadow-md">
                    {totalCartItems}
                  </Badge>
                )}
              </div>

              <span>Cart</span>
            </Button>

            {/* Admin */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 border-l border-slate-800 pl-2">
                <Button
                  variant="outline"
                  render={<Link to="/admin/dashboard" />}
                  className="border-emerald-500/20 bg-emerald-500/10 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
                >
                  <ChefHat className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-xs text-slate-400 hover:bg-transparent hover:text-red-400"
                >
                  Exit Admin
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                render={<Link to="/admin/login" />}
                className="border-slate-800 bg-slate-950 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:bg-slate-950 hover:text-white"
              >
                <ShieldCheck className="mr-2 h-4 w-4 text-slate-400" />
                Staff Portal
              </Button>
            )}
          </div>

          {/* ================= MOBILE ACTIONS ================= */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Cart */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsCartOpen(true)}
              className="relative border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
            >
              <ShoppingBag className="h-5 w-5 text-orange-400" />

              {totalCartItems > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 p-0 text-[10px] text-white">
                  {totalCartItems}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu */}
       <Sheet>
  <SheetTrigger
    render={
      <Button
        variant="outline"
        size="icon"
        className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
      />
    }
  >
    <MenuIcon className="h-6 w-6" />
    <span className="sr-only">Open menu</span>
  </SheetTrigger>

  <SheetContent
    side="right"
    className="w-[300px] border-slate-800 bg-slate-900 text-white sm:w-[350px]"
  >
    {/* Mobile Header */}
    <div className="mb-8 flex items-center gap-3 border-b border-slate-800 pb-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500">
        <UtensilsCrossed className="h-5 w-5 text-white" />
      </div>

      <div>
        <h2 className="text-lg font-bold">
          Dine<span className="text-orange-500">Flow</span>
        </h2>

        <p className="text-xs text-slate-400">
          Culinary & Order Portal
        </p>
      </div>
    </div>

    {/* Mobile Navigation */}
    <div className="space-y-3">
      {navItems.map((item) => {
        const Icon = item.icon;

        const active =
          isActive(item.path) ||
          (item.path === "/menu" && isActive("/"));

        return (
          <SheetClose
            key={item.path}
            render={
              <Button
                variant="ghost"
                render={<Link to={item.path} />}
                className={`w-full justify-start rounded-xl px-4 py-6 text-base ${
                  active
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-500 hover:to-amber-500 hover:text-white"
                    : "bg-slate-800/60 text-slate-200 hover:bg-slate-800 hover:text-white"
                }`}
              />
            }
          >
            <Icon className="mr-3 h-5 w-5" />
            {item.label}
          </SheetClose>
        );
      })}
    </div>

    {/* Mobile Admin */}
    <div className="mt-6 border-t border-slate-800 pt-6">
      <SheetClose
        render={
          <Button
            variant="outline"
            render={
              <Link
                to={
                  isAuthenticated
                    ? "/admin/dashboard"
                    : "/admin/login"
                }
              />
            }
            className="w-full justify-start border-orange-500/20 bg-slate-950 py-6 text-orange-400 hover:bg-slate-800 hover:text-orange-300"
          />
        }
      >
        {isAuthenticated ? (
          <>
            <ChefHat className="mr-3 h-5 w-5" />
            Admin Dashboard
          </>
        ) : (
          <>
            <ShieldCheck className="mr-3 h-5 w-5" />
            Staff Portal Login
          </>
        )}
      </SheetClose>

      {isAuthenticated && (
        <Button
          variant="ghost"
          onClick={logout}
          className="mt-3 w-full text-slate-400 hover:bg-transparent hover:text-red-400"
        >
          Exit Admin
        </Button>
      )}
    </div>
  </SheetContent>
</Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

