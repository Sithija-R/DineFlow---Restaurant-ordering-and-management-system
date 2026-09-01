import React from 'react';
import { UtensilsCrossed, Sparkles } from 'lucide-react';

export default function Loading({ text = 'Preparing Culinary Wonders...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 w-full min-h-[300px]">
      <div className="relative flex items-center justify-center mb-6">
        {/* Glowing Rings */}
        <div className="absolute w-20 h-20 rounded-full border-2 border-orange-500/20 animate-ping" />
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-xl shadow-orange-500/20 animate-pulse">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <UtensilsCrossed className="w-8 h-8 text-orange-400 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>
      </div>
      
      <p className="text-sm font-semibold text-slate-300 tracking-wide flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />
        {text}
      </p>
      <p className="text-xs text-slate-500 mt-1">DineFlow Premium Experience</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-slate-900/40 border border-slate-800/60 p-4 space-y-4 animate-pulse">
      <div className="w-full aspect-[4/3] rounded-xl bg-slate-800/60" />
      <div className="space-y-2">
        <div className="h-4 w-3/4 bg-slate-800/80 rounded" />
        <div className="h-3 w-full bg-slate-800/50 rounded" />
        <div className="h-3 w-2/3 bg-slate-800/50 rounded" />
      </div>
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
        <div className="h-6 w-16 bg-slate-800/80 rounded" />
        <div className="h-8 w-24 bg-slate-800/80 rounded-xl" />
      </div>
    </div>
  );
}
