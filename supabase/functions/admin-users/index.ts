// Supabase Edge Function: admin-users
//
// Holds the SERVICE-ROLE key (server-side only) and performs the privileged
// account actions the browser must never do directly: creating student logins,
// resetting passwords, and deleting accounts. Deployed with verify_jwt = false
// because it implements its own auth (the one-time bootstrap has no caller, and
// every other action checks the caller's JWT against profiles.is_admin).
//
// Deploy:  supabase functions deploy admin-users --no-verify-jwt
// (or via the Supabase MCP deploy_edge_function tool, which is how it was first
// shipped). SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected by Supabase.

import { createClient } from 'jsr:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const EMAIL_DOMAIN = 'class.local';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function callerProfile(req: Request) {
  const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '');
  if (!token) return null;
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return null;
  const { data: profile } = await admin
    .from('profiles')
    .select('id, is_admin, username')
    .eq('id', data.user.id)
    .single();
  return profile;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const body = await req.json();
    const action = String(body.action ?? '');

    // ── One-time bootstrap: only works while NO admin exists ──
    if (action === 'bootstrap-admin') {
      const { count } = await admin
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('is_admin', true);
      if ((count ?? 0) > 0)
        return json({ error: 'An admin already exists. Bootstrap is closed.' }, 403);
      const username = String(body.username ?? 'instructor').trim().toLowerCase();
      const password = String(body.password ?? '');
      if (password.length < 8)
        return json({ error: 'Password must be at least 8 characters.' }, 400);
      const email = `${username}@${EMAIL_DOMAIN}`;
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          username,
          display_name: String(body.display_name ?? 'Instructor'),
          is_admin: true,
        },
      });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true, username, email, userId: data.user.id });
    }

    // ── Everything below requires an authenticated admin caller ──
    const caller = await callerProfile(req);
    if (!caller || !caller.is_admin)
      return json({ error: 'Not authorized.' }, 403);

    if (action === 'create-student') {
      const username = String(body.username ?? '').trim().toLowerCase();
      const password = String(body.password ?? '');
      const display_name = String(body.display_name ?? '') || username;
      const isAdmin = Boolean(body.is_admin);
      const topics: string[] = Array.isArray(body.topics) ? body.topics : [];
      if (!username) return json({ error: 'Username is required.' }, 400);
      if (password.length < 6)
        return json({ error: 'Password must be at least 6 characters.' }, 400);
      // Username is the only identifier anyone ever types; the email is an
      // internal, never-shown detail required by Supabase Auth.
      const email = `${username}@${EMAIL_DOMAIN}`;
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { username, display_name, is_admin: isAdmin },
      });
      if (error) return json({ error: error.message }, 400);
      const studentId = data.user.id;
      // Instructors see every chapter, so per-chapter grants only apply to
      // students.
      if (!isAdmin && topics.length) {
        const rows = topics.map((t) => ({
          student_id: studentId,
          topic_slug: t,
          granted_by: caller.id,
        }));
        const { error: aerr } = await admin
          .from('topic_access')
          .upsert(rows, { onConflict: 'student_id,topic_slug' });
        if (aerr) return json({ error: aerr.message }, 400);
      }
      return json({ ok: true, studentId, username, email, password, is_admin: isAdmin });
    }

    if (action === 'reset-password') {
      const studentId = String(body.studentId ?? '');
      const password = String(body.password ?? '');
      if (!studentId || password.length < 6)
        return json({ error: 'studentId and a 6+ char password are required.' }, 400);
      const { error } = await admin.auth.admin.updateUserById(studentId, { password });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === 'delete-student') {
      const studentId = String(body.studentId ?? '');
      if (!studentId) return json({ error: 'studentId is required.' }, 400);
      const { error } = await admin.auth.admin.deleteUser(studentId);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: `Unknown action: ${action}` }, 400);
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500);
  }
});
