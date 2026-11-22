'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Genre, VsPair } from '@/lib/types';
import { Scale, ArrowRight, CheckCircle2, ChevronRight, Sparkles, Compass } from 'lucide-react';

interface VsComparatorProps {
  genres: Genre[];
  initialVsPairs: VsPair[];
}

export default function VsComparator({ genres, initialVsPairs }: VsComparatorProps) {
  const [selectedPair, setSelectedPair] = useState<VsPair>(initialVsPairs[0]);
  const [selectedSlugA, setSelectedSlugA] = useState(initialVsPairs[0]?.genre_a_slug || 'roguelite');
  const [selectedSlugB, setSelectedSlugB] = useState(initialVsPairs[0]?.genre_b_slug || 'deckbuilder');

  const genreA = genres.find((g) => g.slug === selectedSlugA) || genres[0];
  const genreB = genres.find((g) => g.slug === selectedSlugB) || genres[1];

  const handleSelectPreset = (pair: VsPair) => {
    setSelectedPair(pair);
    setSelectedSlugA(pair.genre_a_slug);
    setSelectedSlugB(pair.genre_b_slug);
  };

  const handleSelectGenreA = (slug: string) => {
    setSelectedSlugA(slug);
    const found = initialVsPairs.find(
      (p) => (p.genre_a_slug === slug && p.genre_b_slug === selectedSlugB) ||
             (p.genre_b_slug === slug && p.genre_a_slug === selectedSlugB)
    );
    if (found) setSelectedPair(found);
  };

  const handleSelectGenreB = (slug: string) => {
    setSelectedSlugB(slug);
    const found = initialVsPairs.find(
      (p) => (p.genre_a_slug === selectedSlugA && p.genre_b_slug === slug) ||
             (p.genre_b_slug === selectedSlugA && p.genre_a_slug === slug)
    );
    if (found) setSelectedPair(found);
  };

  // Convert coord to 0-100 gauge percent
  const getPhysicalGauge = (coordX: number) => {
    return Math.round(((100 - coordX) / 200) * 100);
  };

  const getPlaytimeGauge = (coordY: number) => {
    return Math.round(((coordY + 100) / 200) * 100);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/30 text-xs font-mono font-medium">
          <Scale className="w-3.5 h-3.5" />
          <span>헷갈리는 게임 장르 1:1 비교기</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
          장르 VS 매치업
        </h1>
        <p className="text-sm text-gray-400">
          이름만 들으면 헷갈리는 두 장르를 좌우로 나란히 비교하여 플레이 감각의 결정적 차이를 짚어드립니다.
        </p>
      </div>

      {/* Preset Matchups Chips */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-gray-500 block text-center">추천 킬러 매치 프리셋:</span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {initialVsPairs.map((pair, idx) => {
            const isSelected =
              pair.genre_a_slug === selectedSlugA && pair.genre_b_slug === selectedSlugB;
            const gA = genres.find((g) => g.slug === pair.genre_a_slug);
            const gB = genres.find((g) => g.slug === pair.genre_b_slug);

            return (
              <button
                key={idx}
                onClick={() => handleSelectPreset(pair)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-primary to-secondary text-black font-semibold shadow-md'
                    : 'bg-[#141924] text-gray-400 border border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                <span>{gA?.name_ko || pair.genre_a_slug}</span>
                <span className="text-[10px] opacity-60">vs</span>
                <span>{gB?.name_ko || pair.genre_b_slug}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VS Arena Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Genre A Card */}
        <div className="p-6 rounded-3xl bg-[#141924] border border-primary/30 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-semibold">
                장르 A
              </span>
              <select
                value={selectedSlugA}
                onChange={(e) => handleSelectGenreA(e.target.value)}
                className="bg-[#0b0f17] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary/50"
              >
                {genres.map((g) => (
                  <option key={g.slug} value={g.slug}>
                    {g.name_ko} ({g.name_en})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h2 className="font-display font-bold text-2xl text-white">{genreA.name_ko}</h2>
              <p className="font-mono text-xs text-gray-500">{genreA.name_en}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0b0f17] border border-white/5">
              <p className="text-xs text-gray-300 italic">&ldquo;{genreA.metaphor}&rdquo;</p>
            </div>

            {/* Gauges */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-gray-400">
                  <span>피지컬 비중 (반사신경/조작)</span>
                  <span className="text-primary font-bold">{getPhysicalGauge(genreA.coord_x)}%</span>
                </div>
                <div className="w-full h-2 bg-[#0b0f17] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${getPhysicalGauge(genreA.coord_x)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-gray-400">
                  <span>장기 성장성 (서사/누적)</span>
                  <span className="text-secondary font-bold">{getPlaytimeGauge(genreA.coord_y)}%</span>
                </div>
                <div className="w-full h-2 bg-[#0b0f17] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full transition-all duration-500"
                    style={{ width: `${getPlaytimeGauge(genreA.coord_y)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Representative Game */}
            <div className="pt-2 text-xs text-gray-400">
              <span className="font-mono text-[10px] text-gray-500 block mb-1">대표 입문작:</span>
              <div className="p-2.5 rounded-xl bg-[#0b0f17] text-white font-medium flex items-center justify-between">
                <span>{genreA.starter_games[0]?.title}</span>
                <span className="text-[10px] font-mono text-primary">{genreA.starter_games[0]?.level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Genre B Card */}
        <div className="p-6 rounded-3xl bg-[#141924] border border-secondary/30 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-secondary/20 text-secondary border border-secondary/30 font-semibold">
                장르 B
              </span>
              <select
                value={selectedSlugB}
                onChange={(e) => handleSelectGenreB(e.target.value)}
                className="bg-[#0b0f17] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-secondary/50"
              >
                {genres.map((g) => (
                  <option key={g.slug} value={g.slug}>
                    {g.name_ko} ({g.name_en})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h2 className="font-display font-bold text-2xl text-white">{genreB.name_ko}</h2>
              <p className="font-mono text-xs text-gray-500">{genreB.name_en}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0b0f17] border border-white/5">
              <p className="text-xs text-gray-300 italic">&ldquo;{genreB.metaphor}&rdquo;</p>
            </div>

            {/* Gauges */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-gray-400">
                  <span>피지컬 비중 (반사신경/조작)</span>
                  <span className="text-primary font-bold">{getPhysicalGauge(genreB.coord_x)}%</span>
                </div>
                <div className="w-full h-2 bg-[#0b0f17] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${getPhysicalGauge(genreB.coord_x)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-gray-400">
                  <span>장기 성장성 (서사/누적)</span>
                  <span className="text-secondary font-bold">{getPlaytimeGauge(genreB.coord_y)}%</span>
                </div>
                <div className="w-full h-2 bg-[#0b0f17] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full transition-all duration-500"
                    style={{ width: `${getPlaytimeGauge(genreB.coord_y)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Representative Game */}
            <div className="pt-2 text-xs text-gray-400">
              <span className="font-mono text-[10px] text-gray-500 block mb-1">대표 입문작:</span>
              <div className="p-2.5 rounded-xl bg-[#0b0f17] text-white font-medium flex items-center justify-between">
                <span>{genreB.starter_games[0]?.title}</span>
                <span className="text-[10px] font-mono text-secondary">{genreB.starter_games[0]?.level}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Difference Table */}
      {selectedPair && selectedPair.key_differences && (
        <div className="p-6 rounded-3xl bg-[#141924] border border-white/5 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-display font-bold text-lg text-white">
              핵심 차이점 비교 분석
            </h3>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed p-3 rounded-xl bg-[#0b0f17] border border-white/5">
            💡 <strong className="text-white">한 줄 요약:</strong> {selectedPair.summary_diff}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-mono">
                  <th className="py-3 px-4 w-1/4">비교 기준</th>
                  <th className="py-3 px-4 w-3/8 text-primary font-bold">{genreA.name_ko}</th>
                  <th className="py-3 px-4 w-3/8 text-secondary font-bold">{genreB.name_ko}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {selectedPair.key_differences.map((diff, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-medium text-gray-300">{diff.criteria}</td>
                    <td className="py-3 px-4 text-gray-200">{diff.a_desc}</td>
                    <td className="py-3 px-4 text-gray-200">{diff.b_desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
