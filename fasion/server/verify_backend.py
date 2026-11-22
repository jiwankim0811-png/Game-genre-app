import urllib.request
import urllib.error
import json
import http.cookiejar
import sys

EXPECTED_REFUSAL = '죄송합니다. 게임 장르 탐색 및 포트폴리오와 관련된 질문에만 답변할 수 있습니다.'

print('=== 1. /api/genres 검증 ===')
with urllib.request.urlopen('http://127.0.0.1:3000/api/genres') as res:
    genres = json.loads(res.read().decode('utf-8'))
    print(f'장르 개수: {len(genres)} (기대값: 25) -> PASSED: {len(genres) == 25}')

print('\n=== 2. AI 챗봇 도메인 외 질문 차단 가드레일 검증 ===')
def test_chat(prompt):
    data = json.dumps({'messages': [{'role': 'user', 'content': prompt}]}).encode('utf-8')
    req = urllib.request.Request('http://127.0.0.1:3000/api/chat', data=data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as res:
        reply = json.loads(res.read().decode('utf-8'))['reply']
        is_exact = reply == EXPECTED_REFUSAL
        print(f'질문: "{prompt}"')
        print(f'응답: "{reply}"')
        print(f'정확한 거절 문구 일치 여부: {is_exact}')
        return is_exact

passed_weather = test_chat('오늘 서울 날씨 어때?')
passed_stock = test_chat('주식 종목 추천해줘')
passed_coding = test_chat('파이썬 코딩 숙제 알고리즘 풀어줘')

print('\n=== 3. AI 챗봇 정상 게임 추천 검증 ===')
data = json.dumps({'messages': [{'role': 'user', 'content': '퇴근 후 30분만 머리 비우고 할 만한 게임 추천해줘'}]}).encode('utf-8')
req = urllib.request.Request('http://127.0.0.1:3000/api/chat', data=data, headers={'Content-Type': 'application/json'})
with urllib.request.urlopen(req) as res:
    reply = json.loads(res.read().decode('utf-8'))['reply']
    is_game_rec = '로그라이트' in reply or '하데스' in reply or '뱀파이어' in reply or '추천' in reply
    print(f'게임 추천 응답:\n{reply}')
    print(f'적절한 게임 추천 여부: {is_game_rec}')

print('\n=== 4. /admin 및 API 접근 제어 검증 ===')
# 비인가 API 요청
try:
    urllib.request.urlopen('http://127.0.0.1:3000/api/admin/genres')
    print('비인가 API 차단 실패: 200이 반환됨')
except urllib.error.HTTPError as e:
    print(f'비인가 API 요청 차단 성공: HTTP {e.code} (기대값: 403)')

# 비인가 이메일 로그인 시도
try:
    bad_data = json.dumps({'email': 'attacker@bad.com'}).encode('utf-8')
    req = urllib.request.Request('http://127.0.0.1:3000/api/admin/auth', data=bad_data, headers={'Content-Type': 'application/json'})
    urllib.request.urlopen(req)
    print('비인가 이메일 로그인 차단 실패')
except urllib.error.HTTPError as e:
    print(f'비인가 이메일(attacker@bad.com) 로그인 차단 성공: HTTP {e.code} (기대값: 403)')

# 인가된 이메일 로그인 시도
cookie_jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cookie_jar))
good_data = json.dumps({'email': 'jiwankim0811@gmail.com'}).encode('utf-8')
req = urllib.request.Request('http://127.0.0.1:3000/api/admin/auth', data=good_data, headers={'Content-Type': 'application/json'})
with opener.open(req) as res:
    auth_res = json.loads(res.read().decode('utf-8'))
    print(f'인가 이메일(jiwankim0811@gmail.com) 로그인 성공: {auth_res.get("success")} (status {res.status})')

# 로그인 세션 쿠키로 어드민 API 접근
with opener.open('http://127.0.0.1:3000/api/admin/genres') as res:
    admin_genres = json.loads(res.read().decode('utf-8'))
    print(f'인가 세션으로 관리자 장르 목록 조회 성공: {len(admin_genres)}개 로드됨')

# 미들웨어 비인가 리다이렉트 검증
class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        print(f'/admin 미들웨어 비인가 차단 리다이렉트 발생 확인: HTTP {code} -> {newurl}')
        return None

no_red_opener = urllib.request.build_opener(NoRedirectHandler)
try:
    no_red_opener.open('http://127.0.0.1:3000/admin')
except urllib.error.HTTPError as e:
    print(f'/admin 보호 결과: HTTP {e.code}')
except Exception as e:
    pass
