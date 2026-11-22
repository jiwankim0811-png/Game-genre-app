'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Scale, LayoutDashboard, Menu, X, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: '2축 좌표 맵', icon: Compass },
    { href: '/vs', label: '장르 VS 비교기', icon: Scale },
    { href: '/admin', label: '관리자', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0f131c]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-secondary to-tertiary p-0.5 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
            <div className="w-full h-full bg-[#0f131c] rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-primary group-hover:rotate-45 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-lg text-white tracking-tight">
                장르나침반
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-semibold">
                BETA
              </span>
            </div>
            <span className="hidden sm:block text-[11px] font-mono text-gray-500 leading-none">
              GenreCompass · 직관적 게임 장르 번역기
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-[#141924]/60 p-1.5 rounded-2xl border border-white/5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/15 text-primary font-semibold shadow-sm border border-primary/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/vs"
            className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-gradient-to-r from-secondary/20 to-primary/20 text-white border border-white/10 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span>비교 추천 받기</span>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition"
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0f131c] px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-primary/15 text-primary font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
