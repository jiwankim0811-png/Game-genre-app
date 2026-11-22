import { NextRequest, NextResponse } from 'next/server';
import { getAdminEmailFromRequest, isAuthorizedAdminEmail } from '@/lib/adminAuth';
import { generateGenreDraft } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  const email = getAdminEmailFromRequest(req);
  if (!isAuthorizedAdminEmail(email)) {
    return NextResponse.json({ error: '403 Forbidden: 관리자 권한이 없습니다.' }, { status: 403 });
  }

  try {
    const { genreName } = await req.json();
    if (!genreName || typeof genreName !== 'string') {
      return NextResponse.json({ error: '장르명을 입력해 주세요.' }, { status: 400 });
    }

    const draft = await generateGenreDraft(genreName);
    return NextResponse.json({ draft });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
