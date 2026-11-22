import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdminEmail } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: '이메일을 입력해주세요.' }, { status: 400 });
    }

    if (!isAuthorizedAdminEmail(email)) {
      return NextResponse.json(
        { error: '승인되지 않은 이메일입니다. 관리자 접근 권한이 없습니다.' },
        { status: 403 }
      );
    }

    const response = NextResponse.json({ success: true, email: email.trim().toLowerCase() });

    // In local development or HTTP testing, keep secure: false so cookies can be passed over HTTP
    const isHttps = req.headers.get('x-forwarded-proto') === 'https' || process.env.VERCEL === '1';

    response.cookies.set('genre_admin_email', encodeURIComponent(email.trim().toLowerCase()), {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('genre_admin_email');
  return response;
}
