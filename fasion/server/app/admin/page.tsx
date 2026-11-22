'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, PlusCircle, Trash2, Edit3, Sparkles,
  LogOut, RefreshCw, Loader2, AlertCircle, CheckCircle2, X, Compass
} from 'lucide-react';
import Link from 'next/link';
import { Genre } from '@/lib/types';

type AdminView = 'list' | 'add' | 'edit';

export default function AdminDashboard() {
  const router = useRouter();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [view, setView] = useState<AdminView>('list');
  const [editTarget, setEditTarget] = useState<Genre | null>(null);
  const [loading, setLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  // Draft form
  const [draftName, setDraftName] = useState('');
  const [draftJson, setDraftJson] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchAdminGenres = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/genres', { credentials: 'include' });
      if (res.status === 403) {
        router.push('/admin/login?error=unauthorized');
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) setGenres(data);
    } catch {
      showMessage('error', '장르 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // Check session by calling a protected endpoint
    fetchAdminGenres();
    // Try to get email from cookie (client-readable portion)
    const match = document.cookie.match(/genre_admin_email=([^;]+)/);
    if (match) setAdminEmail(decodeURIComponent(match[1]));
  }, [fetchAdminGenres]);

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  }

  async function handleDelete(slug: string) {
    if (deleteConfirm !== slug) {
      setDeleteConfirm(slug);
      return;
    }
    try {
      const res = await fetch(`/api/admin/genres?slug=${slug}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        showMessage('success', `'${slug}' 장르가 삭제되었습니다.`);
        setDeleteConfirm(null);
        fetchAdminGenres();
      } else {
        const d = await res.json();
        showMessage('error', d.error || '삭제 실패');
      }
    } catch {
      showMessage('error', '삭제 중 오류가 발생했습니다.');
    }
  }

  async function handleGenerateDraft() {
    if (!draftName.trim()) return;
    setGenLoading(true);
    try {
      const res = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ genreName: draftName }),
      });
      const data = await res.json();
      if (res.ok) {
        setDraftJson(JSON.stringify(data.draft, null, 2));
        showMessage('success', 'AI 초안이 생성되었습니다. 아래에서 검토 후 저장하세요.');
      } else {
        showMessage('error', data.error || 'AI 생성 실패');
      }
    } catch {
      showMessage('error', 'AI 생성 중 오류 발생');
    } finally {
      setGenLoading(false);
    }
  }

  async function handleSaveGenre() {
    try {
      const genre: Genre = JSON.parse(draftJson);
      const res = await fetch('/api/admin/genres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(genre),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage('success', `'${genre.name_ko}' 장르가 저장되었습니다.`);
        setView('list');
        setDraftJson('');
        setDraftName('');
        fetchAdminGenres();
      } else {
        showMessage('error', data.error || '저장 실패');
      }
    } catch (e: any) {
      showMessage('error', 'JSON 파싱 오류: ' + e.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f131c] text-white">
      {/* Top Nav */}
      <div className="sticky top-0 z-40 bg-[#0b0f17] border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-primary font-bold text-lg font-display">
            <Compass className="w-5 h-5" />
            <span>장르나침반</span>
          </Link>
          <span className="text-gray-600">/</span>
          <div className="flex items-center gap-1.5 text-sm text-gray-300">
            <LayoutDashboard className="w-4 h-4" />
            <span>관리자 대시보드</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {adminEmail && (
            <span className="text-xs text-gray-500 hidden sm:block">{adminEmail}</span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition px-2 py-1 rounded-lg hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            <span>로그아웃</span>
          </button>
        </div>
      </div>

      {/* Message Toast */}
      {message && (
        <div
          className={`fixed top-16 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm
            ${message.type === 'success' ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' : 'bg-red-500/20 border border-red-500/40 text-red-300'}`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-2 opacity-60 hover:opacity-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold font-display">장르 관리</h1>
            <p className="text-sm text-gray-500 mt-0.5">총 {genres.length}개 장르</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAdminGenres}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>새로고침</span>
            </button>
            <button
              onClick={() => { setView('add'); setDraftJson(''); setDraftName(''); }}
              className="flex items-center gap-1.5 text-sm bg-primary hover:bg-cyan-500 text-black font-semibold px-4 py-2 rounded-xl transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>장르 추가</span>
            </button>
          </div>
        </div>

        {/* View: Genre List */}
        {view === 'list' && (
          <div className="bg-[#141924] border border-white/5 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : genres.length === 0 ? (
              <div className="text-center py-20 text-gray-500 text-sm">
                등록된 장르가 없습니다.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-left">
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">장르명</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Slug</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">카테고리</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">좌표</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {genres.map((genre, i) => (
                      <tr
                        key={genre.slug}
                        className={`border-b border-white/5 hover:bg-white/2 transition ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}
                      >
                        <td className="px-5 py-3">
                          <div>
                            <span className="font-medium text-white">{genre.name_ko}</span>
                            <span className="ml-2 text-gray-500 text-xs">{genre.name_en}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {genre.tags?.slice(0, 3).map((t) => (
                              <span key={t} className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary/80 rounded">{t}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-3 font-mono text-xs text-gray-500 hidden sm:table-cell">{genre.slug}</td>
                        <td className="px-5 py-3 text-gray-400 hidden md:table-cell">{genre.category}</td>
                        <td className="px-5 py-3 font-mono text-xs text-gray-500 hidden md:table-cell">
                          ({genre.coord_x}, {genre.coord_y})
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setEditTarget(genre);
                                setDraftJson(JSON.stringify(genre, null, 2));
                                setView('edit');
                              }}
                              className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
                              title="편집"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(genre.slug)}
                              className={`p-1.5 rounded-lg transition ${
                                deleteConfirm === genre.slug
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'hover:bg-red-500/10 text-gray-400 hover:text-red-400'
                              }`}
                              title={deleteConfirm === genre.slug ? '한 번 더 클릭하면 삭제됩니다' : '삭제'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* View: Add / Edit */}
        {(view === 'add' || view === 'edit') && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => { setView('list'); setEditTarget(null); setDraftJson(''); }}
                className="text-sm text-gray-400 hover:text-white transition"
              >
                ← 목록으로
              </button>
              <span className="text-gray-600">/</span>
              <span className="text-sm text-white font-medium">
                {view === 'add' ? '새 장르 추가' : `편집: ${editTarget?.name_ko}`}
              </span>
            </div>

            {/* AI Draft Generator (only on Add) */}
            {view === 'add' && (
              <div className="bg-[#141924] border border-secondary/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  <h2 className="font-semibold font-display text-white">AI 장르 초안 생성</h2>
                  <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">Gemini</span>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    placeholder="장르명 입력 (예: 로그라이크, 메트로배니아)"
                    className="flex-1 bg-[#0b0f17] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-secondary/50 transition"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateDraft()}
                  />
                  <button
                    onClick={handleGenerateDraft}
                    disabled={genLoading || !draftName.trim()}
                    className="flex items-center gap-2 bg-secondary hover:bg-indigo-500 disabled:bg-secondary/30 text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm"
                  >
                    {genLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{genLoading ? '생성 중...' : '초안 생성'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* JSON Editor */}
            <div className="bg-[#141924] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold font-display text-white">장르 JSON 데이터</h2>
                <span className="text-xs text-gray-500">Genre 타입 형식에 맞게 편집하세요</span>
              </div>
              <textarea
                value={draftJson}
                onChange={(e) => setDraftJson(e.target.value)}
                className="w-full h-96 bg-[#0b0f17] border border-white/10 rounded-xl p-4 text-xs font-mono text-green-300 focus:outline-none focus:border-primary/50 resize-none transition"
                spellCheck={false}
              />
              <div className="flex items-center justify-end gap-3 mt-4">
                <button
                  onClick={() => { setView('list'); setEditTarget(null); }}
                  className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveGenre}
                  disabled={!draftJson.trim()}
                  className="flex items-center gap-2 bg-primary hover:bg-cyan-500 disabled:bg-primary/30 text-black font-semibold px-5 py-2 rounded-xl transition text-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>저장</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
