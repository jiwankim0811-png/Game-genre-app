'use client';

import React, { useState, useEffect } from 'react';
import { Genre } from '@/lib/types';
import { INITIAL_GENRES } from '@/lib/data/initialGenres';
import FilterBar from '@/components/coordinate-map/FilterBar';
import CoordinateMap from '@/components/coordinate-map/CoordinateMap';
import MobileQuadrantView from '@/components/coordinate-map/MobileQuadrantView';
import GenreDetailDrawer from '@/components/drawer/GenreDetailDrawer';
import { Compass, Scale, Info, Sparkles, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [genres, setGenres] = useState<Genre[]>(INITIAL_GENRES);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedPlaytime, setSelectedPlaytime] = useState('ALL');
  const [selectedQuadrant, setSelectedQuadrant] = useState('ALL');

  // Load from API on mount
  useEffect(() => {
    fetch('/api/genres')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGenres(data);
        }
      })
      .catch((err) => console.warn('Could not fetch from /api/genres, using initial', err));
  }, []);

  return (
    <div className="w-full flex flex-col flex-1">
      {/* Top Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        selectedPlaytime={selectedPlaytime}
        setSelectedPlaytime={setSelectedPlaytime}
        selectedQuadrant={selectedQuadrant}
        setSelectedQuadrant={setSelectedQuadrant}
      />

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
        {/* Intro Ticker */}
        <div className="mb-4 p-3 rounded-xl bg-[#141924] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
            <span className="font-display font-medium text-white">
              게이머를 위한 직관적 게임 장르 개념 번역기
            </span>
            <span className="text-gray-600 hidden sm:inline">|</span>
            <span className="text-gray-400 hidden sm:inline">
              노드를 클릭하면 입문자 맞춤형 4단계 상세 리포트가 열립니다.
            </span>
          </div>

          <Link
            href="/vs"
            className="flex items-center gap-1 text-secondary hover:text-white font-mono text-[11px] font-medium"
          >
            <span>헷갈리는 장르 1:1 비교(VS) 바로가기</span>
            <span>→</span>
          </Link>
        </div>

        {/* Dual Mode: Desktop (2-Axis SVG Coordinate Map) vs Mobile (4-Quadrant Tabs + Cards) */}
        <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Stage (Desktop Map or Mobile View) */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            {/* Desktop View (>= 768px) */}
            <div className="hidden md:block">
              <CoordinateMap
                genres={genres}
                selectedGenre={selectedGenre}
                onSelectGenre={setSelectedGenre}
                searchQuery={searchQuery}
                selectedTag={selectedTag}
                selectedQuadrant={selectedQuadrant}
              />
            </div>

            {/* Mobile View (< 768px) */}
            <div className="block md:hidden">
              <MobileQuadrantView
                genres={genres}
                onSelectGenre={setSelectedGenre}
                selectedTag={selectedTag}
                searchQuery={searchQuery}
              />
            </div>
          </div>

          {/* Desktop Right Companion Inspector Panel (When drawer is closed) */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-4">
            {selectedGenre ? (
              <div className="p-5 rounded-2xl bg-[#141924] border border-primary/30 shadow-xl space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-semibold">
                    {selectedGenre.category}
                  </span>
                  <span className="font-mono text-xs text-gray-500">
                    X:{selectedGenre.coord_x} Y:{selectedGenre.coord_y}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-xl text-white">{selectedGenre.name_ko}</h3>
                  <p className="font-mono text-xs text-gray-500">{selectedGenre.name_en}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#181e2b] border border-white/5">
                  <p className="text-xs text-gray-300 italic">&ldquo;{selectedGenre.metaphor}&rdquo;</p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-tertiary font-bold">100% 추천 성향:</span>
                  <ul className="text-xs text-gray-300 space-y-1">
                    {selectedGenre.recommend_for.slice(0, 2).map((r, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-tertiary">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-gray-400 font-bold">대표 입문작:</span>
                  <div className="p-2.5 rounded-lg bg-[#181e2b] text-xs text-white font-medium flex items-center justify-between">
                    <span>{selectedGenre.starter_games[0]?.title}</span>
                    <span className="text-[10px] font-mono text-primary">
                      {selectedGenre.starter_games[0]?.level}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedGenre(selectedGenre)}
                  className="w-full py-2.5 rounded-xl bg-primary text-[#0b0f17] font-semibold text-xs hover:bg-primary-light transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>전체 4단계 상세 리포트 열기</span>
                </button>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#141924] border border-white/5 space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto">
                  <Compass className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-base text-white">좌표 맵에서 장르를 선택하세요</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    X축(피지컬 ↔ 뇌지컬), Y축(단판 ↔ 장기) 위에 배치된 25개 주요 장르 노드를 클릭하면 개념 번역 상세 리포트가 열립니다.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#181e2b] border border-white/5 text-left space-y-2 text-xs text-gray-300">
                  <div className="font-mono text-[11px] text-primary font-bold">4분면 성향 가이드:</div>
                  <div className="space-y-1 text-[11px] text-gray-400">
                    <p><strong className="text-white">Q1 (우상단)</strong>: 뇌지컬 × 대서사 (4X, CRPG)</p>
                    <p><strong className="text-white">Q2 (좌상단)</strong>: 피지컬 × 서사 성장 (소울라이크, 메트로배니아)</p>
                    <p><strong className="text-white">Q3 (좌하단)</strong>: 피지컬 × 단판 몰입 (로그라이트, 배틀로얄)</p>
                    <p><strong className="text-white">Q4 (우하단)</strong>: 뇌지컬 × 단판 전술 (덱빌딩, 오토배틀러)</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Structured Genre Detailed Report Drawer [FEAT-02] */}
      <GenreDetailDrawer
        genre={selectedGenre}
        onClose={() => setSelectedGenre(null)}
      />
    </div>
  );
}
