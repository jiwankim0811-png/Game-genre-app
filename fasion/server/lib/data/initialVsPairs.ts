import { VsPair } from '../types';

export const INITIAL_VS_PAIRS: VsPair[] = [
  {
    genre_a_slug: 'roguelite',
    genre_b_slug: 'deckbuilder',
    summary_diff: '피지컬 실시간 액션 컨트롤로 돌파하는가 vs 턴제 카드 시너지와 덱 압축으로 승부하는가',
    key_differences: [
      {
        criteria: '요구 능력치',
        a_desc: '0.1초 회피 및 대시, 에임 등 반사신경 피지컬',
        b_desc: '에너지 분배, 카드 드로우 확률, 덱 압축 등 두뇌 전략'
      },
      {
        criteria: '진행 템포',
        a_desc: '한시도 쉴 틈 없는 실시간 핵앤슬래시 전투',
        b_desc: '원할 때 멈추고 10분 동안 다음 수를 고민할 수 있는 턴제'
      },
      {
        criteria: '영구 성장 요소',
        a_desc: '거울 강화, 무기 해금 등 게임 외적 스펙업 비중이 큼',
        b_desc: '영구 스펙업보다 플레이어 본인의 덱 설계 노하우 누적이 핵심'
      },
      {
        criteria: '대표작 대조',
        a_desc: '하데스 (Hades), 데드 셀 (Dead Cells)',
        b_desc: '슬레이 더 스파이어, 발라트로 (Balatro)'
      }
    ],
    is_featured: true
  },
  {
    genre_a_slug: 'soulslike',
    genre_b_slug: 'action-rpg',
    summary_diff: '패턴을 외우고 패링 타이밍을 맞추는 피지컬인가 vs 몬스터를 학살하고 전설 템을 맞추는 빌드 파밍인가',
    key_differences: [
      {
        criteria: '핵심 재미 요점',
        a_desc: '극악의 보스전에서 수십 번 죽고 극복했을 때의 인간 승리 성취감',
        b_desc: '수백 마리의 잡몹을 쓸어 담으며 쏟아지는 고급 전리품 획득'
      },
      {
        criteria: '사망 페널티',
        a_desc: '화톳불로 강제 귀환하며 모아둔 소울/룬을 전장에 모두 드롭',
        b_desc: '경험치 약간 손실 또는 포탈 타고 즉시 재진입 가능'
      },
      {
        criteria: '스펙 상승 방식',
        a_desc: '아이템 스펙보다 플레이어의 손가락 숙련도와 적 패턴 파악이 우선',
        b_desc: '좋은 무기와 패시브 시너지를 맞추면 사냥 속도가 기하급수적으로 폭증'
      },
      {
        criteria: '대표작 대조',
        a_desc: '엘든 링, 다크소울, 세키로',
        b_desc: '디아블로 4, 패스 오브 엑자일, 라스트 에포크'
      }
    ],
    is_featured: true
  },
  {
    genre_a_slug: '4x',
    genre_b_slug: 'grand-strategy',
    summary_diff: '빈 타일에서 개척자로 도시를 짓는 문명 개척인가 vs 실제 역사 속 국가의 수뇌부로 판도를 바꾸는 역사 시뮬레이션인가',
    key_differences: [
      {
        criteria: '시작 환경',
        a_desc: '모든 플레이어가 개척자 1기와 전사 1기로 대등하게 빈 땅에서 출발',
        b_desc: '역사적 고증에 따라 대영제국은 강대국으로, 약소국은 풍전등화로 시작'
      },
      {
        criteria: '게임의 목표',
        a_desc: '과학 승리, 문화 승리, 지배 승리 등 시스템적 승리 조건 달성',
        b_desc: '정해진 승리 조건 없이 가문 보존, 판도 변경 등 플레이어의 자율적 목표'
      },
      {
        criteria: '내정의 초점',
        a_desc: '타일별 식량/망치 산출량 계산 및 도시 불가사의 건축',
        b_desc: '가문 혈통, 후계자 암살, 계급 갈등, 무역로 봉쇄 등 정치 역학'
      },
      {
        criteria: '대표작 대조',
        a_desc: '문명 6 (Civilization VI), 스텔라리스',
        b_desc: '크루세이더 킹즈 3, 하츠 오브 아이언 4'
      }
    ],
    is_featured: true
  },
  {
    genre_a_slug: 'battleroyale',
    genre_b_slug: 'extraction-shooter',
    summary_diff: '최후의 1인이 될 때까지 싸우는 1등 경쟁인가 vs 귀중한 전리품을 챙겨 전장에서 살아 돌아오는 생환인가',
    key_differences: [
      {
        criteria: '승리 조건',
        a_desc: '오직 최후의 1인(또는 1팀)만이 승리하며 2등도 패배자',
        b_desc: '0킬이라도 귀한 아이템을 배낭에 채워 탈출구로 나가면 승리'
      },
      {
        criteria: '사망 시 손실',
        a_desc: '해당 판의 아이템만 소멸하며 로비 창고에는 타격 없음',
        b_desc: '가져왔던 비싼 총기와 방탄복, 가방을 모두 잃어버리는 막대한 손실'
      },
      {
        criteria: '자기장 압박',
        a_desc: '시간이 지날수록 맵이 강제로 좁아져 전원 강제 난타전 유도',
        b_desc: '제한 시간 내에 자유롭게 맵을 누비며 원하는 탈출구로 접근'
      },
      {
        criteria: '대표작 대조',
        a_desc: '배틀그라운드, 에이펙스 레전드, 포트나이트',
        b_desc: '탈코프 (Escape from Tarkov), 헌트 쇼다운'
      }
    ],
    is_featured: true
  },
  {
    genre_a_slug: 'metroidvania',
    genre_b_slug: 'roguelite',
    summary_diff: '정교하게 설계된 고정 지도에서 능력을 얻어 길을 여는 탐험인가 vs 매번 바뀌는 무작위 방을 깨는 액션 루프인가',
    key_differences: [
      {
        criteria: '맵 구조',
        a_desc: '개발자가 정밀하게 설계한 거대하고 유기적인 단 하나의 고정 지도',
        b_desc: '매 판 무작위 알고리즘으로 방과 보상이 새롭게 생성되는 랜덤 맵'
      },
      {
        criteria: '진행 방식',
        a_desc: '2단 점프나 대시를 배워 과거의 잠긴 문으로 돌아가는 백트래킹 탐험',
        b_desc: '뒤로 돌아갈 수 없으며 오직 다음 방으로 전진하는 단방향 돌파'
      },
      {
        criteria: '엔딩 및 플레이타임',
        a_desc: '15~30시간에 걸쳐 한 번의 완결된 엔딩 스토리를 감상하는 패키지형',
        b_desc: '한 판에 30분씩 수십~수백 판을 반복해서 즐기는 무한 리플레이성'
      },
      {
        criteria: '대표작 대조',
        a_desc: '할로우 나이트, 오리와 도깨비불',
        b_desc: '하데스, 데드 셀'
      }
    ],
    is_featured: true
  },
  {
    genre_a_slug: 'deckbuilder',
    genre_b_slug: 'autobattler',
    summary_diff: '내가 직접 카드를 내며 콤보를 터뜨리는가 vs 유닛을 사서 체스판에 올린 뒤 자동 전투를 감상하는가',
    key_differences: [
      {
        criteria: '전투 조작',
        a_desc: '손패의 카드를 매 턴 직접 드래그해서 적에게 사용하는 능동적 조작',
        b_desc: '배치만 마치면 AI 유닛들이 알아서 전투를 치르는 관전형 시스템'
      },
      {
        criteria: '플레이 인원',
        a_desc: '완전한 1인 싱글 플레이로 시간제한 없이 고민 가능',
        b_desc: '8명이 동시에 접속하여 라운드마다 타이머에 쫓기며 실시간 경쟁'
      },
      {
        criteria: '자원 관리',
        a_desc: '매 턴 주어지는 3~4개의 에너지 안에서 최선의 카드 순서 연계',
        b_desc: '원금을 50원 이상 유지해 5원의 이자를 받으며 리롤 확률 계산'
      },
      {
        criteria: '대표작 대조',
        a_desc: '슬레이 더 스파이어, 발라트로',
        b_desc: '롤토체스 (TFT), 슈퍼 오토 펫'
      }
    ],
    is_featured: true
  }
];
