import React, { useState, useMemo } from 'react';
import { useDineFlow } from '../../context/DineFlowContext';
import MenuCard from '../../components/MenuCard';
import Loading, { SkeletonCard } from '../../components/Loading';
import { 
  Search, 
  Utensils, 
  Sparkles, 
  Flame, 
  Filter, 
  ShoppingBag,
  Award,
  Coffee,
  IceCream,
  Wine
} from 'lucide-react';

const categories = [
  { id: 'All', label: 'All Dishes', icon: Utensils },
  { id: 'Starters', label: 'Starters', icon: Flame },
  { id: 'Mains', label: 'Main Courses', icon: Award },
  { id: 'Desserts', label: 'Desserts', icon: IceCream },
  { id: 'Beverages', label: 'Beverages', icon: Wine }
];

export default function Menu() {
  const { menuItems, cart, setIsCartOpen } = useDineFlow();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState('All');

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDiet =
        dietFilter === 'All' ||
        (dietFilter === 'Chef Special' && item.tags?.includes('Chef Special')) ||
        (dietFilter === 'Vegetarian' && item.tags?.includes('Vegetarian')) ||
        (dietFilter === 'Gluten-Free' && item.tags?.includes('Gluten-Free'));

      return matchesCategory && matchesSearch && matchesDiet;
    });
  }, [menuItems, selectedCategory, searchQuery, dietFilter]);

  const totalCartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 hero-gradient">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Culinary Excellence Redefined
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-sans">
            Explore Our <span className="text-gradient">Gourmet Menu</span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-400 text-sm sm:text-base leading-relaxed">
            Fresh artisanal ingredients, handcrafted by master chefs. Choose your favorite dishes and order directly to your table or home.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes by name, ingredient, or flavor..."
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 focus:border-orange-500/50 text-white text-sm placeholder-slate-500 shadow-xl focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Category Navigation & Dietary Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const selected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap ${
                    selected
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
                      : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Quick Diet Filters */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="px-2 text-slate-400 flex items-center gap-1 font-medium">
              <Filter className="w-3.5 h-3.5" />
              Filter:
            </span>
            {['All', 'Chef Special', 'Vegetarian', 'Gluten-Free'].map((f) => (
              <button
                key={f}
                onClick={() => setDietFilter(f)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  dietFilter === f
                    ? 'bg-slate-800 text-orange-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

        </div>

        {/* Results Counter */}
        <div className="py-4 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing <strong className="text-white">{filteredItems.length}</strong> items
          </span>
          {searchQuery && (
            <span>
              Searching for "<strong className="text-orange-400">{searchQuery}</strong>"
            </span>
          )}
        </div>

        {/* Menu Cards Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8 my-6">
            <Utensils className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">No dishes match your selection</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your category filter or search query to discover other menu items.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setDietFilter('All');
              }}
              className="mt-5 px-4 py-2 rounded-xl bg-slate-800 text-orange-400 border border-slate-700 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Mobile Floating Cart Action Button */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-6 right-6 z-30 md:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-2xl shadow-orange-500/50 animate-bounce"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>View Cart ({totalCartCount})</span>
          </button>
        </div>
      )}

    </div>
  );
}
