'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Menu,
} from 'lucide-react';
import { useUIStore } from '@/lib/store';
import { useSession } from 'next-auth/react';
import { hasPermission } from '@/lib/permissions';
import { useTranslation } from '@/lib/i18n/use-translation';

const navItems = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'POS', href: '/pos', icon: ShoppingCart },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'More', href: '#menu', icon: Menu },
];

const MobileNavItem = memo(function MobileNavItem({
  item,
  isActive,
}: {
  item: typeof navItems[0];
  isActive: boolean;
}) {
  return (
    <Link
      href={item.href}
      prefetch={item.href !== '#menu'}
      className={cn(
        'flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-colors min-w-[70px] flex-shrink-0',
        isActive
          ? 'text-primary bg-primary/10'
          : 'text-muted-foreground active:text-foreground'
      )}
    >
      <item.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
      <span className="text-[10px] mt-1 font-medium">{item.name}</span>
    </Link>
  );
});

export function MobileNav() {
  const pathname = usePathname();
  const { openMobileMenu, isMobileMenuOpen } = useUIStore();
  const { data: session } = useSession();
  const { t } = useTranslation();

  const filteredItems = navItems.filter((item) => {
    if (!session?.user) return false;
    const role = session.user.role;

    switch (item.name) {
      case 'Home': return true;
      case 'POS': return hasPermission(role, 'sales:write');
      case 'Inventory': return hasPermission(role, 'items:read');
      case 'Customers': return hasPermission(role, 'customers:read');
      case 'More': return true;
      default: return true;
    }
  });

  return (
    <nav className="bottom-nav md:hidden border-t border-border/40">
      <div className="flex items-center overflow-x-auto whitespace-nowrap no-scrollbar py-2 px-2 gap-2">
        {filteredItems.map((item) => {
          const isActive = item.href !== '#menu' &&
            (pathname === item.href || pathname.startsWith(item.href + '/'));

          if (item.href === '#menu') {
            return (
              <button
                key={item.name}
                onClick={openMobileMenu}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-colors min-w-[70px] flex-shrink-0',
                  isMobileMenuOpen
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground active:text-foreground'
                )}
              >
                <item.icon className={cn('h-5 w-5', isMobileMenuOpen && 'text-primary')} />
                <span className="text-[10px] mt-1 font-medium">{t(item.name)}</span>
              </button>
            );
          }

          return (
            <MobileNavItem
              key={item.name}
              item={{ ...item, name: t(item.name) }}
              isActive={isActive}
            />
          );
        })}
      </div>
    </nav>
  );
}
