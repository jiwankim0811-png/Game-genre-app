import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#0b0f17] py-6 px-4 sm:px-6 lg:px-8 text-xs text-gray-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-display font-medium text-gray-400">
            장르나침반 (GenreCompass)
          </p>
          <p className="text-[11px] text-gray-600 mt-0.5">
            게이머를 위한 2축 사분면(피지컬 ↔ 뇌지컬, 단판 ↔ 장기) 기반 직관적 게임 장르 개념 번역기
          </p>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <Link href="/" className="hover:text-gray-300 transition">
            좌표 맵
          </Link>
          <Link href="/vs" className="hover:text-gray-300 transition">
            1:1 장르 비교
          </Link>
          <Link href="/admin" className="hover:text-gray-300 transition">
            관리자
          </Link>
        </div>
      </div>
    </footer>
  );
}
