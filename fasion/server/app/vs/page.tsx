import React from 'react';
import { fetchGenres, fetchVsPairs } from '@/lib/supabase';
import VsComparator from '@/components/vs/VsComparator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '장르 1:1 비교 (VS 모드) | 장르나침반',
  description: '소울라이크 vs 액션RPG, 로그라이트 vs 덱빌딩 등 헷갈리는 장르의 핵심 차이점을 나란히 비교합니다.',
};

export const revalidate = 60; // ISR 60s

export default async function VsPage() {
  const [genres, vsPairs] = await Promise.all([
    fetchGenres(),
    fetchVsPairs(),
  ]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
      <VsComparator genres={genres} initialVsPairs={vsPairs} />
    </div>
  );
}
