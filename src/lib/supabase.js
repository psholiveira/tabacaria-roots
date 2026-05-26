import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn('[Supabase] Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não configuradas. Usando dados locais como fallback.');
}

export const supabase = createClient(url ?? '', key ?? '');
