export type QuadrantType = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface CoreLoopStep {
  step: string;
  desc: string;
}

export interface MainstreamBridge {
  game: string;
  reason: string;
}

export interface StarterGame {
  level: '순한맛' | '보통' | '매운맛';
  title: string;
  desc: string;
  store_url: string;
}

export interface Genre {
  id?: string;
  slug: string;
  name_ko: string;
  name_en: string;
  category: '액션' | 'RPG' | '전략' | '어드벤처' | '시뮬레이션' | '퍼즐/리듬';
  coord_x: number; // -100 (피지컬) ~ +100 (뇌지컬)
  coord_y: number; // -100 (단판) ~ +100 (장기)
  tags: string[];
  metaphor: string;
  recommend_for: string[];
  not_recommend_for: string[];
  core_loop: CoreLoopStep[];
  mainstream_bridge: MainstreamBridge[];
  starter_games: StarterGame[];
  lineage: string[];
  created_at?: string;
  updated_at?: string;
}

export interface KeyDifference {
  criteria: string;
  a_desc: string;
  b_desc: string;
}

export interface VsPair {
  id?: string;
  genre_a_slug: string;
  genre_b_slug: string;
  summary_diff: string;
  key_differences: KeyDifference[];
  is_featured: boolean;
  created_at?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
