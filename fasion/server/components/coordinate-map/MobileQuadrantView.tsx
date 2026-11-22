'use client';

import React, { useState } from 'react';
import { Genre } from '@/lib/types';
import { ChevronRight, Sparkles, BookOpen, Clock, Activity } from 'lucide-react';

interface MobileQuadrantViewProps {
  genres: Genre[];
  onSelectGenre: (genre: Genre) => void;
  selectedTag: string | null;
  searchQuery: string;
}

export default function MobileQuadrantView({
  genres,
  onSelectGenre,
  selectedTag,
  searchQuery,
}: MobileQuadrantViewProps) {
  const [activeTab, setActiveTab] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q3');

  const tabs = [
    { id: 'Q3', label: '피지컬×단판 (Q3)', tag: '로그라이트, FPS' },
    { id: 'Q2', label: '피지컬×장기 (Q2)', tag: '소울라이크, ARPG' },
    { id: 'Q4', label: '뇌지컬×단판 (Q4)', tag: '덱빌딩, 오토배틀러' },
    { id: 'Q1', label: '뇌지컬×장기 (Q1)', tag: '4X, 대전략, CRPG' },
  ];

  const filterByQuadrant = (quadrant: string) => {
    return genres.filter((g) => {
      // Quadrant filter
      if (quadrant === 'Q1' && !(g.coord_x >= 0 && g.coord_y >= 0)) return false;
      if (quadrant === 'Q2' && !(g.coord_x < 0 && g.coord_y >= 0)) return false;
      if (quadrant === 'Q3' && !(g.coord_x < 0 && g.coord_y < 0)) return false;
      if (quadrant === 'Q4' && !(g.coord_x >= 0 && g.coord_y < 0)) return false;

      // Tag filter
      if (selectedTag && !g.tags.includes(selectedTag)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = g.name_ko.toLowerCase().includes(q) || g.name_en.toLowerCase().includes(q);
        const inMetaphor = g.metaphor.toLowerCase().includes(q);
        if (!inName && !inMetaphor) return false;
      }

      return true;
    });
  };

  const currentGenres = filterByQuadrant(activeTab);

  return (
    <div className="w-full space-y-4">
      {/* 4 Quadrants Pill Switcher */}
      <div className="grid grid-cols-2 gap-2 bg-[#141924] p-1.5 rounded-2xl border border-white/5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-2.5 rounded-xl text-left transition-all duration-200 flex flex-col gap-0.5 ${
                isActive
                  ? 'bg-primary text-black font-semibold shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-xs font-display">{tab.label}</span>
              <span
                className={`text-[10px] font-mono line-clamp-1 ${
                  isActive ? 'text-black/80' : 'text-gray-500'
                }`}
              >
                {tab.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cards List in this Quadrant */}
      <div className="space-y-3">
        {currentGenres.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-xs bg-[#141924]/40 rounded-2xl border border-white/5">
            해당 조건에 맞는 장르가 없습니다.
          </div>
        ) : (
          currentGenres.map((g) => (
            <div
              key={g.slug}
              onClick={() => onSelectGenre(g)}
              className="p-4 rounded-xl bg-[#141924] border border-white/5 hover:border-primary/40 active:scale-[0.99] transition shadow-md flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                    {g.category}
                  </span>
                  <span className="font-mono text-[10px] text-gray-500">
                    X:{g.coord_x} Y:{g.coord_y}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <h4 className="font-display font-bold text-sm text-white group-hover:text-primary transition truncate">
                    {g.name_ko}
                  </h4>
                  <span className="font-mono text-[11px] text-gray-500 truncate">
                    {g.name_en}
                  </span>
                </div>

                <p className="text-xs text-gray-400 line-clamp-1 italic">
                  &ldquo;{g.metaphor}&rdquo;
                </p>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-primary" />
                    입문: {g.starter_games[0]?.title}
                  </span>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#1e2535] group-hover:bg-primary group-hover:text-black text-gray-400 flex items-center justify-center transition flex-shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
