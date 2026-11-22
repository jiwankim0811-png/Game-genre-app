'use client';

import React, { useState } from 'react';
import { Genre } from '@/lib/types';
import { Crosshair, ExternalLink, Sparkles } from 'lucide-react';

interface CoordinateMapProps {
  genres: Genre[];
  selectedGenre: Genre | null;
  onSelectGenre: (genre: Genre) => void;
  searchQuery: string;
  selectedTag: string | null;
  selectedQuadrant: string;
}

export default function CoordinateMap({
  genres,
  selectedGenre,
  onSelectGenre,
  searchQuery,
  selectedTag,
  selectedQuadrant,
}: CoordinateMapProps) {
  const [hoveredGenre, setHoveredGenre] = useState<Genre | null>(null);
  const [mouseCoords, setMouseCoords] = useState<{ x: number; y: number } | null>(null);

  // Filter check
  const isGenreMatch = (g: Genre) => {
    // Quadrant filter
    if (selectedQuadrant === 'Q1' && !(g.coord_x >= 0 && g.coord_y >= 0)) return false;
    if (selectedQuadrant === 'Q2' && !(g.coord_x < 0 && g.coord_y >= 0)) return false;
    if (selectedQuadrant === 'Q3' && !(g.coord_x < 0 && g.coord_y < 0)) return false;
    if (selectedQuadrant === 'Q4' && !(g.coord_x >= 0 && g.coord_y < 0)) return false;

    // Tag filter
    if (selectedTag && !g.tags.includes(selectedTag)) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inName = g.name_ko.toLowerCase().includes(q) || g.name_en.toLowerCase().includes(q);
      const inMetaphor = g.metaphor.toLowerCase().includes(q);
      const inGames = g.starter_games.some(
        (sg) => sg.title.toLowerCase().includes(q) || sg.desc.toLowerCase().includes(q)
      );
      if (!inName && !inMetaphor && !inGames) return false;
    }

    return true;
  };

  // Convert coordinate (-100 ~ 100) to percentage (0% ~ 100%)
  const getPositionPercent = (x: number, y: number) => {
    const left = ((x + 100) / 200) * 100;
    const top = ((100 - y) / 200) * 100;
    return { left: `${left}%`, top: `${top}%` };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width;
    const yPct = (e.clientY - rect.top) / rect.height;
    const normX = Math.round(xPct * 200 - 100);
    const normY = Math.round(100 - yPct * 200);
    setMouseCoords({ x: normX, y: normY });
  };

  return (
    <div className="relative w-full aspect-[4/3] md:aspect-square max-h-[720px] bg-[#0b0f17] rounded-2xl overflow-hidden border border-white/10 shadow-2xl select-none group">
      {/* Live Telemetry Overlay */}
      <div className="absolute top-3 left-3 z-30 pointer-events-none flex items-center gap-2 bg-[#141924]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-md">
        <Crosshair className="w-3.5 h-3.5 text-primary animate-pulse" />
        <span className="font-mono text-[11px] text-gray-300">
          좌표 텔레메트리: X: {mouseCoords ? (mouseCoords.x > 0 ? `+${mouseCoords.x}` : mouseCoords.x) : '0'} | Y:{' '}
          {mouseCoords ? (mouseCoords.y > 0 ? `+${mouseCoords.y}` : mouseCoords.y) : '0'}
        </span>
      </div>

      {/* Axis Cardinal Edge Labels */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
        <span className="font-mono text-[10px] text-tertiary uppercase tracking-widest bg-[#141924]/90 px-2.5 py-0.5 rounded-full border border-tertiary/20">
          ▲ Y: 장기 / 서사 & 영구 성장 (+100)
        </span>
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
        <span className="font-mono text-[10px] text-accent-rose uppercase tracking-widest bg-[#141924]/90 px-2.5 py-0.5 rounded-full border border-accent-rose/20">
          ▼ Y: 단판 / 즉각 몰입 & 휘발성 (-100)
        </span>
      </div>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none -rotate-90 origin-left">
        <span className="font-mono text-[10px] text-primary uppercase tracking-widest bg-[#141924]/90 px-2.5 py-0.5 rounded-full border border-primary/20">
          ◄ X: 피지컬 / 실시간 조작 (-100)
        </span>
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none rotate-90 origin-right">
        <span className="font-mono text-[10px] text-secondary uppercase tracking-widest bg-[#141924]/90 px-2.5 py-0.5 rounded-full border border-secondary/20">
          ► X: 뇌지컬 / 전략 & 설계 (+100)
        </span>
      </div>

      {/* 4 Quadrants Background Tonal Zones */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-40 pointer-events-none">
        {/* Q2 (Top-Left) */}
        <div className="bg-gradient-to-br from-tertiary/10 to-transparent p-4 flex flex-col justify-start items-start border-r border-b border-white/5">
          <span className="font-mono text-[10px] text-tertiary bg-[#141924]/80 px-2 py-0.5 rounded border border-tertiary/20 font-medium">
            Q2 · 피지컬 × 서사 성장
          </span>
        </div>
        {/* Q1 (Top-Right) */}
        <div className="bg-gradient-to-bl from-primary/10 to-transparent p-4 flex flex-col justify-start items-end border-b border-white/5">
          <span className="font-mono text-[10px] text-primary bg-[#141924]/80 px-2 py-0.5 rounded border border-primary/20 font-medium">
            Q1 · 뇌지컬 × 대서사 빌딩
          </span>
        </div>
        {/* Q3 (Bottom-Left) */}
        <div className="bg-gradient-to-tr from-accent-rose/10 to-transparent p-4 flex flex-col justify-end items-start border-r border-white/5">
          <span className="font-mono text-[10px] text-accent-rose bg-[#141924]/80 px-2 py-0.5 rounded border border-accent-rose/20 font-medium">
            Q3 · 피지컬 × 단판 몰입
          </span>
        </div>
        {/* Q4 (Bottom-Right) */}
        <div className="bg-gradient-to-tl from-secondary/10 to-transparent p-4 flex flex-col justify-end items-end">
          <span className="font-mono text-[10px] text-secondary bg-[#141924]/80 px-2 py-0.5 rounded border border-secondary/20 font-medium">
            Q4 · 뇌지컬 × 단판 전술
          </span>
        </div>
      </div>

      {/* SVG Coordinate Lines & Radar Rings */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="-100 -100 200 200"
      >
        <defs>
          <radialGradient id="origin-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Concentric Distance Rings */}
        <circle cx="0" cy="0" r="25" fill="none" stroke="#262a33" strokeDasharray="2 3" strokeWidth="0.5" />
        <circle cx="0" cy="0" r="50" fill="none" stroke="#262a33" strokeDasharray="2 3" strokeWidth="0.5" />
        <circle cx="0" cy="0" r="75" fill="none" stroke="#262a33" strokeDasharray="2 3" strokeWidth="0.5" />
        <circle cx="0" cy="0" r="95" fill="none" stroke="#262a33" strokeWidth="0.75" />
        <circle cx="0" cy="0" r="20" fill="url(#origin-glow)" />

        {/* Center Crosshairs */}
        <line x1="-100" y1="0" x2="100" y2="0" stroke="#4b5563" strokeOpacity="0.4" strokeWidth="0.75" />
        <line x1="0" y1="-100" x2="0" y2="100" stroke="#4b5563" strokeOpacity="0.4" strokeWidth="0.75" />

        {/* Center Target Marker */}
        <circle cx="0" cy="0" r="1.5" fill="#06b6d4" />
      </svg>

      {/* Interactive Nodes Canvas */}
      <div
        className="absolute inset-0 z-20 pointer-events-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMouseCoords(null)}
      >
        {genres.map((g) => {
          const match = isGenreMatch(g);
          const isSelected = selectedGenre?.slug === g.slug;
          const pos = getPositionPercent(g.coord_x, g.coord_y);

          // Category color badge
          let dotColor = 'bg-primary';
          let ringColor = 'ring-primary/40';
          if (g.category === 'RPG') {
            dotColor = 'bg-tertiary';
            ringColor = 'ring-tertiary/40';
          } else if (g.category === '전략') {
            dotColor = 'bg-secondary';
            ringColor = 'ring-secondary/40';
          } else if (g.category === '시뮬레이션') {
            dotColor = 'bg-accent-orange';
            ringColor = 'ring-accent-orange/40';
          }

          return (
            <div
              key={g.slug}
              tabIndex={0}
              role="button"
              aria-label={`${g.name_ko} (${g.name_en}) 상세 리포트 보기`}
              onClick={() => onSelectGenre(g)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectGenre(g);
                }
              }}
              onMouseEnter={() => setHoveredGenre(g)}
              onMouseLeave={() => setHoveredGenre(null)}
              style={{ left: pos.left, top: pos.top }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 focus:outline-none ${
                match ? 'opacity-100 scale-100' : 'opacity-20 scale-90 pointer-events-none'
              } ${isSelected ? 'z-30 scale-125' : 'hover:scale-110 hover:z-25'}`}
            >
              <div className="relative flex items-center group">
                {(isSelected || hoveredGenre?.slug === g.slug) && (
                  <span className={`absolute -inset-2.5 rounded-full ${dotColor}/30 animate-ping`} />
                )}

                <div
                  className={`w-4 h-4 rounded-full ${dotColor} border-2 border-[#0b0f17] shadow-lg flex items-center justify-center transition-all ${
                    isSelected ? `ring-4 ${ringColor}` : 'group-hover:ring-2 ' + ringColor
                  }`}
                />

                <div
                  className={`ml-1.5 px-2 py-0.5 rounded-md bg-[#141924]/90 border border-white/10 backdrop-blur-md shadow-md text-[11px] font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'text-primary font-bold border-primary/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'text-gray-300 group-hover:text-white group-hover:border-white/20'
                  }`}
                >
                  {g.name_ko}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Right Floating Hover Tooltip */}
      {hoveredGenre && (
        <div className="absolute bottom-3 right-3 z-30 pointer-events-none max-w-sm bg-[#141924]/95 backdrop-blur-xl border border-primary/40 rounded-xl p-3 shadow-2xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-display font-bold text-xs text-primary">{hoveredGenre.name_ko}</span>
            <span className="font-mono text-[10px] text-gray-400">
              [{hoveredGenre.coord_x > 0 ? `+${hoveredGenre.coord_x}` : hoveredGenre.coord_x},{' '}
              {hoveredGenre.coord_y > 0 ? `+${hoveredGenre.coord_y}` : hoveredGenre.coord_y}]
            </span>
          </div>
          <p className="text-[11px] text-gray-300 leading-snug line-clamp-2">
            &ldquo;{hoveredGenre.metaphor}&rdquo;
          </p>
          <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400">
            <span>대표작: {hoveredGenre.starter_games[0]?.title}</span>
            <span className="text-primary font-medium flex items-center gap-0.5">
              클릭하여 상세 보기 <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
