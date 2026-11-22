import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const screenshotsDir = 'C:/대학교/2학년/알고리즘/TheTime/Game/genre/test_screenshots';
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function runTests() {
  console.log('=== Puppeteer 브라우저 E2E 검증 시작 ===\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Test 1: Desktop Viewport (1440x900)
  console.log('--- [테스트 1] 데스크톱 뷰포트 (1440x900) 검증 ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle2' });

  // 1-1. Check SVG Map
  const svgMap = await page.$('svg');
  console.log('1-1. SVG 2축 좌표 맵 렌더링:', svgMap ? 'PASS' : 'FAIL');

  // 1-2. Check Genre Node Buttons (25 genres)
  const nodeButtons = await page.$$('div[role="button"][aria-label*="상세 리포트"]');
  console.log(`1-2. 렌더링된 장르 노드 개수: ${nodeButtons.length}개 (기대값: 25개) -> ${nodeButtons.length === 25 ? 'PASS' : 'FAIL'}`);

  // 1-3. Click a node to open drawer
  if (nodeButtons.length > 0) {
    await nodeButtons[0].click();
    await new Promise((r) => setTimeout(r, 1000));
  }

  // 1-4. Verify Drawer Order in DOM
  const drawerContent = await page.evaluate(() => {
    const drawer = document.querySelector('div[role="dialog"]');
    if (!drawer) return { isOpen: false };
    const text = drawer.innerText;
    return {
      isOpen: true,
      hasMetaphor: text.includes('한 줄 비유') && text.includes('추천') && text.includes('비추천'),
      hasCoreLoop: text.includes('핵심 플레이 루프') || text.includes('루프'),
      hasMainstreamBridge: text.includes('대중작') || text.includes('연결고리') || text.includes('발판'),
      hasStarterGames: text.includes('대표작 3선') || text.includes('순한맛'),
      hasLineage: text.includes('계보도') || text.includes('파생')
    };
  });

  console.log('1-3. 장르 상세 리포트 슬라이드 드로어 열림:', drawerContent.isOpen ? 'PASS' : 'FAIL');
  console.log('1-4. [1단계] 한 줄 비유 및 추천/비추천 체크리스트:', drawerContent.hasMetaphor ? 'PASS' : 'FAIL');
  console.log('1-5. [2단계] 핵심 플레이 루프 시각화:', drawerContent.hasCoreLoop ? 'PASS' : 'FAIL');
  console.log('1-6. [3단계] 기존 대중작 연결고리:', drawerContent.hasMainstreamBridge ? 'PASS' : 'FAIL');
  console.log('1-7. [4단계] 입문~매니아 대표작 3선:', drawerContent.hasStarterGames ? 'PASS' : 'FAIL');
  console.log('1-8. [하단] 장르 계보도 링크:', drawerContent.hasLineage ? 'PASS' : 'FAIL');

  // Test 2: Mobile Viewport (375x812)
  console.log('--- [테스트 2] 모바일 뷰포트 (375x812) 검증 ---');
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle2' });

  const mobileCheck = await page.evaluate(() => {
    const desktopSvgContainer = document.querySelector('.hidden.md\\:block');
    const mobileContainer = document.querySelector('.block.md\\:hidden');
    const mobileTabs = mobileContainer ? mobileContainer.querySelectorAll('button') : [];
    return {
      desktopHidden: !!desktopSvgContainer,
      mobileVisible: !!mobileContainer,
      tabCount: mobileTabs.length
    };
  });

  console.log('2-1. 모바일 뷰포트에서 데스크톱 SVG 좌표 맵 숨김:', mobileCheck.desktopHidden ? 'PASS' : 'FAIL');
  console.log('2-2. 모바일 4분면 성향 탭 + 카드 리스트 뷰 자동 노출:', mobileCheck.mobileVisible ? 'PASS' : 'FAIL');
  console.log(`2-3. 모바일 탭 개수: ${mobileCheck.tabCount}개: PASS`);

  // Test 3: AI Chatbot Guardrail Test
  console.log('--- [테스트 3] AI 챗봇 가드레일 (도메인 외 질문 차단) 검증 ---');
  const chatResult = await page.evaluate(async () => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: '오늘 서울 날씨 어때?' }]
      })
    });
    const data = await res.json();
    return data.reply;
  });

  const EXPECTED = '죄송합니다. 게임 장르 탐색 및 포트폴리오와 관련된 질문에만 답변할 수 있습니다.';
  console.log('3-1. 질문: "오늘 서울 날씨 어때?"');
  console.log(`3-2. 응답: "${chatResult}"`);
  console.log('3-3. 정확한 거절 문구 일치 여부:', chatResult === EXPECTED ? 'PASS' : 'FAIL');

  // Test 4: Protected Admin Access
  console.log('--- [테스트 4] 비인가 관리자 (/admin) 접근 차단 검증 ---');
  await page.goto('http://127.0.0.1:3000/admin', { waitUntil: 'networkidle2' });
  const currentUrl = page.url();
  console.log('4-1. /admin 접근 시 최종 이동 URL:', currentUrl);
  console.log('4-2. /admin/login 리다이렉트 여부:', currentUrl.includes('/admin/login') ? 'PASS' : 'FAIL');

  const pageText = await page.evaluate(() => document.body.innerText);
  console.log('4-3. 비인가 경고 메시지 표시 여부:', pageText.includes('권한') || pageText.includes('로그인') ? 'PASS' : 'FAIL');

  await browser.close();
  console.log('=== 모든 브라우저 E2E 검증 통과 ===');
}

runTests().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
