import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

const fallbackSchema = import.meta.env.VITE_SUPABASE_SCHEMA || 'vektor_drive';

export function getActiveSchema(): string {
  if (typeof window !== 'undefined') {
    const explicit = localStorage.getItem('vektor_active_schema');
    if (explicit) return explicit;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key) || '{}');
          if (parsed?.user?.user_metadata?.schema) {
            return parsed.user.user_metadata.schema;
          }
        } catch (_) {}
      }
    }
  }
  return fallbackSchema;
}

const baseClient = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  db: { schema: fallbackSchema }
});

if (typeof window !== 'undefined') {
  baseClient.auth.onAuthStateChange((event, session) => {
    if (session?.user?.user_metadata?.schema) {
      localStorage.setItem('vektor_active_schema', session.user.user_metadata.schema);
    } else if (event === 'SIGNED_OUT') {
      localStorage.removeItem('vektor_active_schema');
    }
  });
}

export const supabase = new Proxy(baseClient, {
  get(target, prop, receiver) {
    const activeSchema = getActiveSchema();
    if (activeSchema && activeSchema !== fallbackSchema) {
      if (prop === 'from') {
        return (relation: string) => target.schema(activeSchema).from(relation);
      }
      if (prop === 'rpc') {
        return (fn: string, args: any) => target.schema(activeSchema).rpc(fn, args);
      }
    }
    return Reflect.get(target, prop, receiver);
  }
}) as typeof baseClient;
