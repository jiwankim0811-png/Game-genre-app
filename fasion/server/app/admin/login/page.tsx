'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Compass, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/admin';
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    errorParam === 'unauthorized' ? '접근 권한이 없거나 로그인이 필요합니다.' : null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '로그인에 실패했습니다.');
        setLoading(false);
        return;
      }

      // Success – navigate to admin
      router.push(nextPath);
    } catch (err: any) {
      setError('서버 오류가 발생했습니다. 다시 시도해주세요.');
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#141924] border border-white/10 rounded-2xl p-8 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <LogIn className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-semibold text-white font-display">관리자 로그인</h1>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-5 flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            관리자 이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
            autoFocus
            className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition"
          />
          <p className="mt-1.5 text-xs text-gray-600">
            ADMIN_ALLOWED_EMAILS에 등록된 이메일만 접근 가능합니다.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-cyan-500 disabled:bg-primary/40 text-black font-semibold py-3 rounded-xl transition text-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>확인 중...</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>관리자로 로그인</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-white/5 text-center">
        <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition">
          ← 메인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f131c] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold text-2xl font-display">
            <Compass className="w-8 h-8" />
            <span>장르나침반</span>
          </Link>
          <p className="mt-2 text-gray-400 text-sm">관리자 전용 로그인</p>
        </div>

        <Suspense fallback={
          <div className="bg-[#141924] border border-white/10 rounded-2xl p-8 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        }>
          <LoginForm />
        </Suspense>

        <p className="text-center text-xs text-gray-700 mt-4">
          GenreCompass Admin · 허가된 이메일만 접근 가능합니다
        </p>
      </div>
    </div>
  );
}
