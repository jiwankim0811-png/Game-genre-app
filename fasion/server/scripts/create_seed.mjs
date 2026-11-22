import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import compiled data
import { INITIAL_GENRES } from '../dist_data/data/initialGenres.js';
import { INITIAL_VS_PAIRS } from '../dist_data/data/initialVsPairs.js';

function escapeSqlString(str) {
  if (typeof str !== 'string') return "''";
  return "'" + str.replace(/'/g, "''") + "'";
}

function escapeSqlArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return "'{}'";
  const escapedItems = arr.map(item => `"${item.replace(/"/g, '\\"')}"`);
  return "'{" + escapedItems.join(',') + "}'";
}

function escapeSqlJson(obj) {
  return escapeSqlString(JSON.stringify(obj));
}

let sql = `-- ==============================================================================
-- 장르나침반 (GenreCompass) 25개 핵심 입문 장르 & VS 페어 시드 데이터 (seed.sql)
-- ==============================================================================

-- 1. 기존 데이터 정리 (멱등성 보장)
DELETE FROM vs_pairs;
DELETE FROM genres;

-- 2. 25개 핵심 장르 시드 데이터 삽입
INSERT INTO genres (\n  slug, name_ko, name_en, category, coord_x, coord_y, tags,\n  metaphor, recommend_for, not_recommend_for, core_loop,\n  mainstream_bridge, starter_games, lineage\n) VALUES\n`;

const genreValues = INITIAL_GENRES.map(g => {
  return `  (\n    ${escapeSqlString(g.slug)},\n    ${escapeSqlString(g.name_ko)},\n    ${escapeSqlString(g.name_en)},\n    ${escapeSqlString(g.category)},\n    ${g.coord_x},\n    ${g.coord_y},\n    ${escapeSqlArray(g.tags)},\n    ${escapeSqlString(g.metaphor)},\n    ${escapeSqlArray(g.recommend_for)},\n    ${escapeSqlArray(g.not_recommend_for)},\n    ${escapeSqlJson(g.core_loop)}::jsonb,\n    ${escapeSqlJson(g.mainstream_bridge)}::jsonb,\n    ${escapeSqlJson(g.starter_games)}::jsonb,\n    ${escapeSqlArray(g.lineage)}\n  )`;
}).join(',\n');

sql += genreValues + ';\n\n';

sql += `-- 3. 헷갈리는 장르 1:1 비교 페어 (VS 모드) 시드 데이터
INSERT INTO vs_pairs (\n  genre_a_slug, genre_b_slug, summary_diff, key_differences, is_featured\n) VALUES\n`;

const vsValues = INITIAL_VS_PAIRS.map(v => {
  return `  (\n    ${escapeSqlString(v.genre_a_slug)},\n    ${escapeSqlString(v.genre_b_slug)},\n    ${escapeSqlString(v.summary_diff)},\n    ${escapeSqlJson(v.key_differences)}::jsonb,\n    ${v.is_featured ? 'TRUE' : 'FALSE'}\n  )`;
}).join(',\n');

sql += vsValues + ';\n';

// Write to Game/genre/supabase/seed.sql
fs.writeFileSync(path.join(__dirname, '../supabase/seed.sql'), sql, 'utf-8');

console.log(`Generated seed.sql with ${INITIAL_GENRES.length} genres and ${INITIAL_VS_PAIRS.length} vs pairs!`);
