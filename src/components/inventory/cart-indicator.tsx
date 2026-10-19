'use client';

import { ShoppingCart, ChevronRight, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/cart-context';
import { formatCurrency } from '@/lib/utils';

export function CartIndicator() {
  const router = useRouter();
  const { itemCount, total } = useCart();

  if (itemCount === 0) return null;

  return (
    <>
      {/* Mobile Cart Bar - Fixed at bottom, above navigation */}
      <div className="fixed bottom-16 left-0 right-0 z-50 px-3 pb-2 md:hidden safe-area-bottom">
        <button
          onClick={() => router.push('/pos?showCart=true')}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-primary text-primary-foreground shadow-2xl hover:bg-primary/90 transition-all animate-in slide-in-from-bottom-4"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center ring-2 ring-primary">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            </div>
            <div className="text-left">
              <p className="text-xs font-medium opacity-80">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
              <p className="text-lg font-bold">{formatCurrency(total)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
            <span className="font-semibold text-sm">View Cart</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </button>
      </div>

      {/* Desktop Cart Button - Floating */}
      <button
        onClick={() => router.push('/pos?showCart=true')}
        className="hidden md:flex fixed bottom-6 right-6 z-50 items-center gap-3 px-5 py-3.5 rounded-full bg-primary text-primary-foreground shadow-2xl hover:bg-primary/90 hover:scale-105 transition-all animate-in slide-in-from-bottom-4"
      >
        <div className="relative">
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-base">{formatCurrency(total)}</span>
          <span className="font-medium text-sm opacity-90">View Cart</span>
        </div>
        <ChevronRight className="h-5 w-5" />
      </button>
    </>
  );
}
