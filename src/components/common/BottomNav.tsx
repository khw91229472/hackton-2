'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, BarChart3, Database } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: '홈', icon: Home },
    { href: '/scan', label: '기자재 찾기', icon: Camera, highlight: true },
    { href: '/status', label: '기자재 현황', icon: BarChart3 },
    { href: '/data', label: '데이터 관리', icon: Database },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-lg">
      <div className="mx-auto flex max-w-xl items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center rounded-xl px-3 py-1.5 transition-colors touch-target ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 active:bg-slate-50'
              }`}
            >
              <div className={`relative ${item.highlight && !isActive ? 'p-1 rounded-full bg-blue-50 text-blue-600' : ''}`}>
                <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="mt-1 text-[11px] font-medium tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
