-- ==============================================================================
-- 장르나침반 (GenreCompass) PostgreSQL 마이그레이션 DDL
-- Supabase Free Tier 호환 및 RLS 보안 설정
-- ==============================================================================

-- 1. 확장 기능 활성화 (UUID 생성용)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. genres 테이블 (25+ 핵심 장르 데이터)
CREATE TABLE IF NOT EXISTS genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,                                       -- 고유 식별 슬러그 (예: 'roguelite')
  name_ko TEXT NOT NULL,                                           -- 한글 장르명 (예: '로그라이트')
  name_en TEXT NOT NULL,                                           -- 영문 장르명 (예: 'Roguelite')
  category TEXT NOT NULL,                                          -- 대분류 ('액션', 'RPG', '전략', '어드벤처', '시뮬레이션', '퍼즐/리듬')
  coord_x INTEGER NOT NULL CHECK (coord_x BETWEEN -100 AND 100),    -- X축 (-100: 피지컬 ~ +100: 뇌지컬)
  coord_y INTEGER NOT NULL CHECK (coord_y BETWEEN -100 AND 100),    -- Y축 (-100: 단판 몰입 ~ +100: 장기 서사)
  tags TEXT[] NOT NULL DEFAULT '{}',                               -- 퀵 필터 태그 배열
  metaphor TEXT NOT NULL,                                          -- [1단계] 한 줄 비유
  recommend_for TEXT[] NOT NULL,                                   -- [1단계] 추천 성향 3개
  not_recommend_for TEXT[] NOT NULL,                               -- [1단계] 비추천 성향 3개
  core_loop JSONB NOT NULL,                                        -- [2단계] 핵심 루프 배열 [{"step": "...", "desc": "..."}]
  mainstream_bridge JSONB NOT NULL,                                -- [3단계] 대중작 연결 [{"game": "...", "reason": "..."}]
  starter_games JSONB NOT NULL,                                    -- [4단계] 입문작 3선 [{"level": "순한맛", "title": "...", "desc": "...", "store_url": "..."}]
  lineage TEXT[] NOT NULL,                                         -- [부설명] 계보도 트리 배열
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_genres_slug ON genres(slug);
CREATE INDEX IF NOT EXISTS idx_genres_coords ON genres(coord_x, coord_y);
CREATE INDEX IF NOT EXISTS idx_genres_category ON genres(category);

-- 3. vs_pairs 테이블 (1:1 비교 페어)
CREATE TABLE IF NOT EXISTS vs_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  genre_a_slug TEXT REFERENCES genres(slug) ON DELETE CASCADE,
  genre_b_slug TEXT REFERENCES genres(slug) ON DELETE CASCADE,
  summary_diff TEXT NOT NULL,                                      -- 두 장르의 한 줄 핵심 차이
  key_differences JSONB NOT NULL,                                  -- 항목별 비교 배열 [{"criteria": "...", "a_desc": "...", "b_desc": "..."}]
  is_featured BOOLEAN DEFAULT TRUE,                                -- 상단 인기 조합 노출 여부
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vs_pairs_slugs ON vs_pairs(genre_a_slug, genre_b_slug);

-- 4. updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_genres_updated_at ON genres;
CREATE TRIGGER trigger_genres_updated_at
    BEFORE UPDATE ON genres
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Row Level Security (RLS) 보안 정책
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE vs_pairs ENABLE ROW LEVEL SECURITY;

-- 익명/일반 사용자(anon/authenticated) 읽기(SELECT) 전체 허용
DROP POLICY IF EXISTS "Allow public read-only access on genres" ON genres;
CREATE POLICY "Allow public read-only access on genres"
    ON genres FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow public read-only access on vs_pairs" ON vs_pairs;
CREATE POLICY "Allow public read-only access on vs_pairs"
    ON vs_pairs FOR SELECT
    USING (true);
