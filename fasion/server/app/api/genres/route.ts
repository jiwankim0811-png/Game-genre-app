import { NextResponse } from 'next/server';
import { fetchGenres } from '@/lib/supabase';

export const revalidate = 60; // ISR cache for 60 seconds

export async function GET() {
  try {
    const genres = await fetchGenres();
    return NextResponse.json(genres);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
