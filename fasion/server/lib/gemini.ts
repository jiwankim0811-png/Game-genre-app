import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatMessage, Genre } from './types';
import { INITIAL_GENRES } from './data/initialGenres';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const OUT_OF_SCOPE_REFUSAL = '죄송합니다. 게임 장르 탐색 및 포트폴리오와 관련된 질문에만 답변할 수 있습니다.';

// Explicit off-topic keywords
const OFF_TOPIC_KEYWORDS = [
  '날씨', '기온', '비와', '눈와', '우산', '미세먼지',
  '주식', '코스피', '나스닥', '삼성전자', '비트코인', '이더리움', '주가', '투자', '재테크', '부동산',
  '파이썬 코드', '자바스크립트 작성', '코딩 숙제', '알고리즘 풀어줘', 'sql 쿼리 짜줘', '버그 고쳐줘', 'html 만들어줘',
  '정치', '대통령', '선거', '국회', '정당', '뉴스 알려줘',
  '수학 문제', '미적분', '영어 번역해줘', '작문해줘', '시 써줘', '의학', '병원', '약 추천'
];

// Pure game keywords
const GAME_KEYWORDS = [
  '게임', '장르', '스팀', '플스', '닌텐도', '콘솔', '인디', 'pc', '플레이',
  '소울라이크', '로그라이크', '로그라이트', '메트로배니아', '4x', 'crpg',
  '액션', 'rpg', '전략', 'fps', 'tps', '슈팅', '퍼즐', '생존', '배틀로얄',
  '하데스', '엘든링', '발더스', '문명', '롤', 'tft', '피지컬', '뇌지컬',
  '포트폴리오', '장르나침반', '장르맵', 'genrecompass', '개발자', '프로젝트', '난이도', '플레이타임'
];

export function isStrictlyOutOfScope(prompt: string): boolean {
  const lower = prompt.toLowerCase();

  // 1. Check for explicit off-topic terms
  const hasOffTopic = OFF_TOPIC_KEYWORDS.some((kw) => lower.includes(kw));
  if (hasOffTopic) {
    // If it mentions off-topic, only allow if explicitly mentions '게임' or '장르'
    const hasExplicitGame = lower.includes('게임') || lower.includes('장르');
    if (!hasExplicitGame) {
      return true;
    }
  }

  // 2. Check if the question is at least tangentially game/service related
  const hasGameTopic = GAME_KEYWORDS.some((kw) => lower.includes(kw));
  // If it doesn't match any game keywords and is too generic
  if (!hasGameTopic) {
    const isGenericGreeting = ['안녕', '반가워', '누구', '소개', '도움'].some((kw) => lower.includes(kw));
    if (!isGenericGreeting) {
      return true;
    }
  }

  return false;
}

const SYSTEM_INSTRUCTION = `
당신은 '장르나침반(GenreCompass)'의 친절하고 전문적인 AI 게임 큐레이터입니다.
사용자에게 맞춤형 게임 장르를 추천하고, 낯선 서브 장르 용어를 알기 쉽게 비유로 설명하며, 본 웹 포트폴리오 서비스를 안내합니다.

[가장 중요한 필수 가드레일 규칙]
1. 당신의 답변 범위는 오직 '게임 장르 개념 설명, 취향 기반 게임/장르 추천, 본 포트폴리오 서비스(장르나침반, 장르맵) 안내'로 엄격히 제한됩니다.
2. 만약 사용자의 질문이 날씨, 주식/재테크, 일반 상식, 코딩/숙제 대행, 정치, 시사 등 게임 장르 및 포트폴리오와 무관한 주제라면,
절대 잡담이나 일반 답변을 하지 말고, 생각하지도 말고 정확히 아래 한 문장만 토씨 하나 틀리지 않고 그대로 출력하십시오:
"${OUT_OF_SCOPE_REFUSAL}"

[답변 가이드라인]
- 25개 주요 장르(4X, CRPG, 소울라이크, 메트로배니아, 로그라이트, 덱빌딩, 배틀로얄, 하이퍼 FPS 등)를 적극 인용하세요.
- 피지컬(조작)과 뇌지컬(전략), 단판 몰입과 장기 성장의 2축 4분면 관점에서 장르의 맛을 설명하세요.
- 간결하고 친절한 경어체를 사용하며, 답변 길이는 2~3문단 이내로 핵심만 전달하세요.
`;

function getIntelligentFallbackResponse(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (lower.includes('30분') || lower.includes('단판') || lower.includes('퇴근') || lower.includes('가볍게') || lower.includes('머리 비우고')) {
    return `퇴근 후 짧고 강렬하게 즐길 수 있는 **로그라이트(Roguelite)** 장르를 추천합니다!

- **추천 장르**: 로그라이트 (Roguelite, 3사분면: 피지컬 + 단판 몰입)
- **대표작**: *하데스 (Hades)*, *뱀파이어 서바이벌 (Vampire Survivors)*
- **특징**: 한 판에 20~30분 내외로 끝나며, 실패해도 일부 재화가 영구 보존되어 퇴근 후 부담 없이 성취감을 맛보기 최적입니다. 머리를 많이 쓰기보다 손맛과 즉각적인 도파민을 원하신다면 뱀파이어 서바이벌부터 시작해보세요!`;
  }

  if (lower.includes('전략') || lower.includes('머리') || lower.includes('뇌지컬') || lower.includes('생각')) {
    return `깊이 있는 수 싸움과 지적 희열을 원하신다면 **덱빌딩 로그라이크**나 **4X 대전략**을 추천합니다!

- **추천 장르 1**: 덱빌딩 로그라이크 (4사분면: 뇌지컬 + 단판~중기) — *슬레이 더 스파이어 (Slay the Spire)*
- **추천 장르 2**: 4X 대전략 (1사분면: 뇌지컬 + 장기 성장) — *문명 6 (Civilization VI)*
- **특징**: 빠른 반사신경 없이 오직 선택과 설계로 판을 풀어나가는 장르들입니다. 턴제 방식이므로 커피 한 잔 마시며 여유롭게 고심할 수 있습니다.`;
  }

  if (lower.includes('소울') || lower.includes('어려운') || lower.includes('도전') || lower.includes('피지컬')) {
    return `자신의 한계를 시험하고 극한의 성취감을 느끼고 싶으시다면 **소울라이크(Soulslike)**를 추천합니다!

- **추천 장르**: 소울라이크 (2사분면: 피지컬 + 장기 숙련)
- **대표작**: *엘든 링 (Elden Ring)*, *다크 소울 3*
- **입문 팁**: 처음엔 높은 난이도로 좌절할 수 있지만, 적의 패턴을 학습하고 마침내 승리했을 때의 쾌감은 타 장르와 비교할 수 없습니다. 입문자라면 오픈월드 자유도가 높은 *엘든 링*을 권장합니다.`;
  }

  return `안녕하세요! **장르나침반(GenreCompass)** AI 큐레이터입니다.

원하시는 플레이 성향(예: "피지컬보단 전략이 좋아요", "한 판 30분 짧은 게임", "발더스 게이트 같은 게임")을 말씀해주시면 2축 4분면(피지컬/뇌지컬 x 단판/장기) 기준으로 딱 맞는 장르를 추천해 드리겠습니다. 상단 좌표 맵에서 25개 장르 노드를 직접 탐색해보실 수도 있습니다!`;
}

export async function generateChatResponse(messages: ChatMessage[]): Promise<string> {
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage || !lastMessage.content) {
    return '궁금하신 게임 장르나 플레이 성향을 말씀해 주세요.';
  }

  const promptText = lastMessage.content.trim().slice(0, 300);

  // 1. Strict pre-flight domain guardrail check
  if (isStrictlyOutOfScope(promptText)) {
    return OUT_OF_SCOPE_REFUSAL;
  }

  // 2. Try Gemini Generative AI if key is present
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: SYSTEM_INSTRUCTION,
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.2,
        },
      });

      const historySlice = messages.slice(-5, -1).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content.slice(0, 300) }],
      }));

      const chat = model.startChat({ history: historySlice });
      const result = await chat.sendMessage(promptText);
      const text = result.response.text().trim();

      // Post-flight check
      if (isStrictlyOutOfScope(promptText) || text.includes('기온') || text.includes('코스피')) {
        return OUT_OF_SCOPE_REFUSAL;
      }

      return text;
    } catch (error: any) {
      console.warn('Gemini API call returned error or quota exceeded, falling back to intelligent knowledge base:', error?.message);
    }
  }

  // 3. Fallback to intelligent local knowledge-base matching
  return getIntelligentFallbackResponse(promptText);
}

export async function generateGenreDraft(genreName: string): Promise<Partial<Genre>> {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY가 설정되지 않았습니다.');
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const prompt = `
당신은 게임 장르 분류 전문가입니다. 게임 장르 '${genreName}'에 대해 아래 JSON 스키마에 맞춘 한국어 상세 리포트 초안을 작성하세요.

JSON Schema:
{
  "slug": "영문 소문자 케밥케이스 슬러그",
  "name_ko": "한글 장르명",
  "name_en": "영문 장르명",
  "category": "액션 | RPG | 전략 | 어드벤처 | 시뮬레이션 | 퍼즐/리듬 중 하나",
  "coord_x": -100(피지컬)부터 100(뇌지컬) 사이 정수,
  "coord_y": -100(단판)부터 100(장기) 사이 정수,
  "tags": ["#태그1", "#태그2", "#태그3"],
  "metaphor": "장르의 본질을 꿰뚫는 한 줄 비유",
  "recommend_for": ["이런 사람에게 추천 1", "추천 2", "추천 3"],
  "not_recommend_for": ["이런 사람은 비추천 1", "비추천 2", "비추천 3"],
  "core_loop": [
    {"step": "1. 단계명", "desc": "1줄 설명"},
    {"step": "2. 단계명", "desc": "1줄 설명"},
    {"step": "3. 단계명", "desc": "1줄 설명"},
    {"step": "4. 단계명", "desc": "1줄 설명"}
  ],
  "mainstream_bridge": [
    {"game": "대중작 이름(롤, 젤다 등)", "reason": "연결 이유"},
    {"game": "대중작 이름", "reason": "연결 이유"}
  ],
  "starter_games": [
    {"level": "순한맛", "title": "입문용 타이틀", "desc": "입문 추천 이유", "store_url": "https://store.steampowered.com/search/?term=게임명"},
    {"level": "보통", "title": "표준 대표작 타이틀", "desc": "표준 추천 이유", "store_url": "https://store.steampowered.com/search/?term=게임명"},
    {"level": "매운맛", "title": "매니아 전용 타이틀", "desc": "하드코어 추천 이유", "store_url": "https://store.steampowered.com/search/?term=게임명"}
  ],
  "lineage": ["기원 장르", "파생 단계", "${genreName}"]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch {
    // Return sample draft template if API is down
    return {
      slug: genreName.toLowerCase().replace(/\s+/g, '-'),
      name_ko: genreName,
      name_en: genreName,
      category: '액션',
      coord_x: 0,
      coord_y: 0,
      tags: ['#신규장르', '#인디'],
      metaphor: `${genreName} 장르의 핵심 매력을 한 줄로 요약한 비유입니다.`,
      recommend_for: ['새로운 재미를 찾는 게이머', '도전을 즐기는 유저'],
      not_recommend_for: ['반복 플레이를 싫어하는 유저'],
      core_loop: [
        { step: '1. 진입 및 탐색', desc: '게임 환경을 파악하고 기초 자원을 수집합니다.' },
        { step: '2. 성장 및 파밍', desc: '캐릭터와 장비를 강화합니다.' },
        { step: '3. 고난도 도전', desc: '보스나 난관을 돌파합니다.' },
        { step: '4. 보상 및 확장', desc: '새로운 능력치와 콘텐츠를 해금합니다.' }
      ],
      mainstream_bridge: [
        { game: '리그 오브 레전드', reason: '조작감과 맵 리딩의 기초 감각을 공유합니다.' }
      ],
      starter_games: [
        { level: '순한맛', title: `${genreName} 입문작`, desc: '진입장벽이 낮아 추천합니다.', store_url: 'https://store.steampowered.com' },
        { level: '보통', title: `${genreName} 대표작`, desc: '장르의 표준 재미를 전달합니다.', store_url: 'https://store.steampowered.com' },
        { level: '매운맛', title: `${genreName} 매니아작`, desc: '극상의 난이도를 자랑합니다.', store_url: 'https://store.steampowered.com' }
      ],
      lineage: ['고전 게임', '하이브리드 장르', genreName]
    };
  }
}
