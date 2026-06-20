import { createClient } from '@supabase/supabase-js';

// Public client values — protection is enforced by Row Level Security on the
// server, never by hiding these. See .env for details.
const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !key) {
  // Fail loudly in dev rather than producing a confusing runtime error later.
  console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env');
}

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // Distinct key so auth state doesn't collide with the progress/prefs stores.
    storageKey: 'csharp-course-auth',
  },
});

// Students log in with a plain username; we map it to a synthetic email so we
// can use Supabase's email/password auth without asking students for an email.
export const EMAIL_DOMAIN = 'class.local';
export const usernameToEmail = (u: string) =>
  `${u.trim().toLowerCase()}@${EMAIL_DOMAIN}`;

export const ADMIN_FN_URL = `${url}/functions/v1/admin-users`;
