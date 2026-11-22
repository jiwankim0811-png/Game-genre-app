import { NextRequest, NextResponse } from 'next/server';
import { getAdminEmailFromRequest, isAuthorizedAdminEmail } from '@/lib/adminAuth';
import { fetchGenres, upsertGenreDb, deleteGenreDb } from '@/lib/supabase';
import { Genre } from '@/lib/types';

export async function GET(req: NextRequest) {
  const email = getAdminEmailFromRequest(req);
  if (!isAuthorizedAdminEmail(email)) {
    return NextResponse.json({ error: '403 Forbidden: 관리자 권한이 없습니다.' }, { status: 403 });
  }

  const genres = await fetchGenres();
  return NextResponse.json(genres);
}

export async function POST(req: NextRequest) {
  const email = getAdminEmailFromRequest(req);
  if (!isAuthorizedAdminEmail(email)) {
    return NextResponse.json({ error: '403 Forbidden: 관리자 권한이 없습니다.' }, { status: 403 });
  }

  try {
    const genre: Genre = await req.json();
    if (!genre.slug || !genre.name_ko) {
      return NextResponse.json({ error: 'slug와 name_ko는 필수입니다.' }, { status: 400 });
    }

    const result = await upsertGenreDb(genre);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, genre: result.data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const email = getAdminEmailFromRequest(req);
  if (!isAuthorizedAdminEmail(email)) {
    return NextResponse.json({ error: '403 Forbidden: 관리자 권한이 없습니다.' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'slug가 필요합니다.' }, { status: 400 });
  }

  const result = await deleteGenreDb(slug);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
