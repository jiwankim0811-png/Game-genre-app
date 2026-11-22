'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Genre } from '@/lib/types';
import {
  X,
  CheckCircle2,
  XCircle,
  Repeat,
  Sparkles,
  ExternalLink,
  Scale,
  GitBranch,
  Flame,
  ArrowRight
} from 'lucide-react';

interface GenreDetailDrawerProps {
  genre: Genre | null;
  onClose: () => void;
  onSelectLineageGenre?: (slug: string) => void;
}

export default function GenreDetailDrawer({
  genre,
  onClose,
  onSelectLineageGenre,
}: GenreDetailDrawerProps) {
  // ESC key listener to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!genre) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      {/* Drawer Container (Desktop: Right slide drawer, Mobile: Bottom Sheet) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${genre.name_ko} 상세 리포트`}
        className="fixed z-50 inset-x-0 bottom-0 md:inset-y-0 md:left-auto md:right-0 w-full md:w-[580px] lg:w-[640px] max-h-[90vh] md:max-h-full bg-[#0f131c] border-t md:border-t-0 md:border-l border-white/10 shadow-2xl rounded-t-3xl md:rounded-none flex flex-col overflow-hidden animate-in slide-in-from-bottom md:slide-in-from-right duration-250"
      >
        {/* Header / Thumb bar */}
        <div className="sticky top-0 z-10 px-6 py-4 bg-[#141924]/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-semibold">
                {genre.category}
              </span>
              <span className="font-mono text-xs text-gray-400">
                좌표 [X:{genre.coord_x > 0 ? `+${genre.coord_x}` : genre.coord_x}, Y:
                {genre.coord_y > 0 ? `+${genre.coord_y}` : genre.coord_y}]
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl text-white mt-1">
              {genre.name_ko}{' '}
              <span className="text-sm font-mono text-gray-500 font-normal">({genre.name_en})</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#1e2535] hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body: STRICT 1 -> 2 -> 3 -> 4 Order */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* ========================================================= */}
          {/* [1단계] 한 줄 비유 및 성향 체크리스트 (추천/비추천) */}
          {/* ========================================================= */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-mono text-xs font-semibold uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px]">1</span>
              <span>한 줄 비유 & 성향 체크리스트</span>
            </div>

            {/* Metaphor Hero Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/15 via-secondary/10 to-transparent border border-primary/30 shadow-lg">
              <p className="font-display font-medium text-base text-white leading-relaxed">
                &ldquo;{genre.metaphor}&rdquo;
              </p>
            </div>

            {/* Recommended & Not Recommended Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Recommended (O) */}
              <div className="p-4 rounded-xl bg-[#141924] border border-tertiary/20 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-tertiary">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>이런 분께 100% 추천!</span>
                </div>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {genre.recommend_for.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-snug">
                      <span className="text-tertiary font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not Recommended (X) */}
              <div className="p-4 rounded-xl bg-[#141924] border border-accent-rose/20 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-accent-rose">
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  <span>이런 분은 비추천 (지뢰 피하기)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {genre.not_recommend_for.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-snug">
                      <span className="text-accent-rose font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* [2단계] 핵심 플레이 루프 (Core Loop) 시각화 다이어그램 */}
          {/* ========================================================= */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-secondary font-mono text-xs font-semibold uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-[10px]">2</span>
              <span>핵심 플레이 루프 (Core Loop)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {genre.core_loop.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#141924] border border-white/5 relative overflow-hidden group hover:border-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-md bg-secondary/15 text-secondary text-xs font-mono font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-display font-semibold text-xs text-white">
                      {step.step.replace(/^\d+\.\s*/, '')}
                    </h4>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed pl-7">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================= */}
          {/* [3단계] 기존 대중작 연결고리 (발판 삼기) */}
          {/* ========================================================= */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-tertiary font-mono text-xs font-semibold uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-tertiary/20 flex items-center justify-center text-tertiary text-[10px]">3</span>
              <span>기존 대중작 연결고리 (발판 삼기)</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {genre.mainstream_bridge.map((bridge, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#141924] border border-white/5 flex items-start gap-3"
                >
                  <div className="px-2.5 py-1 rounded-lg bg-tertiary/15 text-tertiary font-display text-xs font-bold whitespace-nowrap">
                    {bridge.game}
                  </div>
                  <p className="text-xs text-gray-300 leading-snug pt-0.5">
                    {bridge.reason}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================= */}
          {/* [4단계] 입문자 맞춤형 대표작 3선 (순한맛 / 보통 / 매운맛) */}
          {/* ========================================================= */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-mono text-xs font-semibold uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px]">4</span>
              <span>입문자 맞춤형 대표작 3선</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {genre.starter_games.map((sg, idx) => {
                let badgeColor = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
                if (sg.level === '보통') {
                  badgeColor = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
                } else if (sg.level === '매운맛') {
                  badgeColor = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
                }

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#141924] border border-white/5 hover:border-primary/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold ${badgeColor}`}>
                          {sg.level}
                        </span>
                        <h4 className="font-display font-bold text-sm text-white group-hover:text-primary transition">
                          {sg.title}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-400 leading-snug">
                        {sg.desc}
                      </p>
                    </div>

                    <a
                      href={sg.store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e2535] hover:bg-primary hover:text-black text-gray-300 text-xs font-medium transition-colors flex-shrink-0"
                    >
                      <span>스팀 상점</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ========================================================= */}
          {/* 최하단: 장르 계보도 (상위 기원 및 파생 장르 링크) */}
          {/* ========================================================= */}
          {genre.lineage && genre.lineage.length > 0 && (
            <section className="pt-2 pb-4 border-t border-white/5 space-y-3">
              <div className="flex items-center gap-2 text-gray-400 font-mono text-xs font-semibold uppercase tracking-wider">
                <GitBranch className="w-4 h-4 text-secondary" />
                <span>장르 계보도 (상위 기원 및 파생 단계)</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {genre.lineage.map((item, idx) => {
                  const isCurrent = item === genre.name_ko || item === genre.slug;
                  return (
                    <React.Fragment key={idx}>
                      <span
                        className={`text-xs px-3 py-1.5 rounded-xl font-mono border transition ${
                          isCurrent
                            ? 'bg-primary/20 text-primary border-primary/50 font-bold'
                            : 'bg-[#141924] text-gray-300 border-white/5'
                        }`}
                      >
                        {item}
                      </span>
                      {idx < genre.lineage.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
