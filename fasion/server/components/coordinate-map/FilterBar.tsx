'use client';

import React from 'react';
import { Search, Compass, SlidersHorizontal, X } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (d: string) => void;
  selectedPlaytime: string;
  setSelectedPlaytime: (p: string) => void;
  selectedQuadrant: string;
  setSelectedQuadrant: (q: string) => void;
}

const POPULAR_TAGS = [
  '#무한리플레이',
  '#극악난이도',
  '#빌드파밍',
  '#수싸움',
  '#타임머신',
  '#서사중심',
  '#100인생존',
];

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedTag,
  setSelectedTag,
  selectedQuadrant,
  setSelectedQuadrant,
}: FilterBarProps) {
  const quadrants = [
    { id: 'ALL', label: '전체 보기' },
    { id: 'Q1', label: '1사분면 (뇌지컬×장기)', desc: '4X, CRPG' },
    { id: 'Q2', label: '2사분면 (피지컬×장기)', desc: '소울라이크, 메트로배니아' },
    { id: 'Q3', label: '3사분면 (피지컬×단판)', desc: '로그라이트, 배틀로얄' },
    { id: 'Q4', label: '4사분면 (뇌지컬×단판)', desc: '덱빌딩, 오토배틀러' },
  ];

  return (
    <div className="w-full bg-[#141924]/80 backdrop-blur-md border-b border-white/5 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="장르명, 키워드, 대표 게임 검색 (예: 하데스, 턴제, 문명)"
            className="w-full pl-10 pr-9 py-2 bg-[#0b0f17] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quadrant Quick Tabs (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 bg-[#0b0f17] p-1 rounded-xl border border-white/5">
          {quadrants.map((q) => {
            const isSelected = selectedQuadrant === q.id;
            return (
              <button
                key={q.id}
                onClick={() => setSelectedQuadrant(q.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  isSelected
                    ? 'bg-primary text-black font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {q.label}
              </button>
            );
          })}
        </div>

        {/* Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <span className="text-[11px] font-mono text-gray-500 hidden sm:inline flex-shrink-0">
            필터:
          </span>
          {POPULAR_TAGS.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-mono transition flex-shrink-0 ${
                  isSelected
                    ? 'bg-primary/20 text-primary border border-primary/40 font-semibold'
                    : 'bg-[#0b0f17] text-gray-400 border border-white/5 hover:border-white/20 hover:text-gray-300'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
