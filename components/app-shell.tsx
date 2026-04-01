'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LayoutDashboard, Radio, Upload, Brain, TriangleAlert as AlertTriangle, User, LogOut } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  allowedRoles?: string[];
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    href: '/live',
    label: 'Live Stream',
    icon: <Radio className="h-4 w-4" />,
  },
  {
    href: '/batch',
    label: 'Batch',
    icon: <Upload className="h-4 w-4" />,
  },
  {
    href: '/model',
    label: 'Model',
    icon: <Brain className="h-4 w-4" />,
    allowedRoles: ['Company', 'Admin'],
  },
  {
    href: '/incidents',
    label: 'Incidents',
    icon: <AlertTriangle className="h-4 w-4" />,
    allowedRoles: ['Company', 'Admin'],
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: <User className="h-4 w-4" />,
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { session, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (!session) {
    return null;
  }

  const filteredNavItems = navItems.filter(
    item => !item.allowedRoles || item.allowedRoles.includes(session.user.role)
  );

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Image src="/brand/aegis-logo.svg" alt="Aegis IDS logo" width={28} height={28} className="h-7 w-7" />
            <span className="text-xl font-bold text-slate-900">Aegis IDS</span>
          </div>

          <nav className="ml-8 hidden md:flex items-center gap-1">
            {filteredNavItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{session.user.username}</span>
                  <span className="text-xs text-muted-foreground hidden md:inline">
                    ({session.user.role})
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">{session.user.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {session.user.email}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Role: {session.user.role}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="md:hidden border-t">
          <nav className="flex overflow-x-auto p-2 gap-1">
            {filteredNavItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className="gap-2 whitespace-nowrap"
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="p-4 md:p-6">{children}</main>
    </div>
  );
}
