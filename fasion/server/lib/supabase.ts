import { createClient } from '@supabase/supabase-js';
import { INITIAL_GENRES } from './data/initialGenres';
import { INITIAL_VS_PAIRS } from './data/initialVsPairs';
import { Genre, VsPair } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const supabaseAdmin = Boolean(supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// In-memory store for fallback/dev mode
let inMemoryGenres: Genre[] = [...INITIAL_GENRES];
let inMemoryVsPairs: VsPair[] = [...INITIAL_VS_PAIRS];

export async function fetchGenres(): Promise<Genre[]> {
  if (isSupabaseConfigured && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('genres')
        .select('*')
        .order('name_ko');
      if (!error && data && data.length > 0) {
        return data as Genre[];
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local dataset', e);
    }
  }
  return inMemoryGenres;
}

export async function fetchGenreBySlug(slug: string): Promise<Genre | null> {
  if (isSupabaseConfigured && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('genres')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) {
        return data as Genre;
      }
    } catch (e) {
      console.warn('Supabase fetchGenreBySlug failed, falling back', e);
    }
  }
  return inMemoryGenres.find((g) => g.slug === slug) || null;
}

export async function fetchVsPairs(): Promise<VsPair[]> {
  if (isSupabaseConfigured && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('vs_pairs')
        .select('*')
        .order('is_featured', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as VsPair[];
      }
    } catch (e) {
      console.warn('Supabase fetchVsPairs failed, falling back to local dataset', e);
    }
  }
  return inMemoryVsPairs;
}

export async function upsertGenreDb(genre: Genre): Promise<{ success: boolean; data?: Genre; error?: string }> {
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('genres')
        .upsert(genre, { onConflict: 'slug' })
        .select()
        .single();
      if (error) throw error;
      return { success: true, data: data as Genre };
    } catch (err: any) {
      return { success: false, error: err.message || 'DB save error' };
    }
  }

  // Fallback in-memory
  const idx = inMemoryGenres.findIndex((g) => g.slug === genre.slug);
  if (idx >= 0) {
    inMemoryGenres[idx] = { ...genre, updated_at: new Date().toISOString() };
  } else {
    inMemoryGenres.push({ ...genre, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  }
  return { success: true, data: genre };
}

export async function deleteGenreDb(slug: string): Promise<{ success: boolean; error?: string }> {
  if (supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from('genres')
        .delete()
        .eq('slug', slug);
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'DB delete error' };
    }
  }

  inMemoryGenres = inMemoryGenres.filter((g) => g.slug !== slug);
  return { success: true };
}
