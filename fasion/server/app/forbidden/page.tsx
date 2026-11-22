import Link from 'next/link';
import { ShieldX, Home, LogIn } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f131c] px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20">
          <ShieldX className="w-10 h-10 text-red-400" />
        </div>

        <h1 className="text-5xl font-bold font-display text-red-400 mb-3">403</h1>
        <h2 className="text-xl font-semibold text-white mb-3">접근이 거부되었습니다</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          이 페이지는 허가된 관리자만 접근할 수 있습니다.
          <br />
          <span className="text-gray-600">접근 권한이 있으신 경우 관리자로 로그인해주세요.</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-5 py-2.5 rounded-xl transition text-sm"
          >
            <Home className="w-4 h-4" />
            <span>메인으로 이동</span>
          </Link>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 bg-primary hover:bg-cyan-500 text-black font-semibold px-5 py-2.5 rounded-xl transition text-sm"
          >
            <LogIn className="w-4 h-4" />
            <span>관리자 로그인</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
