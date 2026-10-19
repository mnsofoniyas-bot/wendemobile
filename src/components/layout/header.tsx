'use client';

import { useMemo } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { User, LogOut, Menu, Search, X, Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useI18nStore } from '@/lib/i18n/store';
import { locales, LocaleKey } from '@/lib/i18n/locales';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getVisibleNavItems } from '@/lib/nav-config';

interface HeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

import { useUIStore } from '@/lib/store';

export function Header({ user }: HeaderProps) {
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useUIStore();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const { locale, setLocale } = useI18nStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const cycleLanguage = () => {
    const keys = Object.keys(locales) as LocaleKey[];
    const currentIndex = keys.indexOf(locale);
    const nextIndex = (currentIndex + 1) % keys.length;
    setLocale(keys[nextIndex]);
  };

  // Filter mobile nav items based on user role permissions (shared config)
  const filteredMobileNavItems = useMemo(() => {
    return getVisibleNavItems(session?.user?.role);
  }, [session]);

  return (
    <>
      <header className="glass border-b border-border sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="touch-btn"
              onClick={openMobileMenu}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-sm sm:text-lg font-bold text-primary truncate">AB Pro</h1>
          </div>

          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('Search anything...') || "Search anything..."}
                className="pl-10 bg-secondary border-border"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={cycleLanguage}
              title={`Switch Language (${locales[locale]?.name})`}
              className="touch-btn text-muted-foreground hover:text-foreground relative"
            >
              <Globe className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 text-[10px] bg-primary text-white rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {locale.toUpperCase()}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title="Toggle theme"
              className="touch-btn text-muted-foreground hover:text-foreground"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Link href="/profile" className="flex items-center gap-2 ml-1 sm:ml-2 hover:opacity-80 transition-opacity">
              <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: '/login', redirect: true })}
              title="Sign out"
              className="touch-btn text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border flex flex-col animate-in slide-in-from-left">
            <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
              <h2 className="text-lg font-bold text-primary">{t('Menu')}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMobileMenu}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1 pb-20">
              {filteredMobileNavItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{t(item.name)}</span>
                  </Link>
                );
              })}
            </nav>
            {/* Bottom safe area padding */}
            <div className="shrink-0 p-3 border-t border-border bg-card space-y-2">
              <Link
                href="/profile"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
              >
                <User className="h-5 w-5" />
                <span className="font-medium">My Profile</span>
              </Link>
              <div className="text-xs text-muted-foreground text-center">
                Logged in as {user.name}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
