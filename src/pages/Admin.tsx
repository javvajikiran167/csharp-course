import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  UserPlus,
  Lock,
  LockOpen,
  Trash2,
  KeyRound,
  Copy,
  Check,
  Inbox,
  RefreshCw,
  ExternalLink,
  HelpCircle,
  BarChart3,
} from 'lucide-react';
import { supabase, ADMIN_FN_URL } from '@/lib/supabase';
import { useAuth } from '@/store/auth';
import { topics } from '@/data/topics';
import type { Topic } from '@/data/types';
import { isAuthored } from '@/lib/access';
import { isLessonComplete } from '@/lib/completion';
import {
  Button,
  Card,
  Pill,
  Eyebrow,
  H1,
  H2,
  Lead,
  Callout,
  ProgressBar,
} from '@/components/primitives';
import { cn } from '@/lib/cn';

// ── Row shapes ────────────────────────────────────────────────────────────
type Student = {
  id: string;
  username: string;
  display_name: string | null;
  created_at: string;
};

type AccessRow = {
  student_id: string;
  topic_slug: string;
};

type UnlockRequest = {
  id: string;
  student_id: string;
  topic_slug: string;
  created_at: string;
};

type ProgressRow = {
  student_id: string;
  lesson_slug: string;
  quiz_done: boolean;
  practice_done: boolean;
};

// Credentials we surface once after creating / resetting (never retrievable later).
type Credentials = { username: string; password: string };

// Supabase dashboard — Authentication → Users for this project. Used for
// managing logins directly (e.g. changing the instructor's own password).
const SUPABASE_DASHBOARD =
  'https://supabase.com/dashboard/project/mhwlivofbcxqwoedgikk/auth/users';

// Only authored topics can be gated.
const chapters: Topic[] = topics.filter(isAuthored);

const chapterTitle = (slug: string): string =>
  chapters.find((c) => c.slug === slug)?.title ?? slug;

const genPassword = () => 'Cs-' + Math.random().toString(36).slice(2, 8);

const credentialString = (c: Credentials) =>
  `Username: ${c.username}\nPassword: ${c.password}`;

// Compact relative time, e.g. "3h ago".
function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Date.now() - then;
  const sec = Math.round(diff / 1000);
  if (sec < 60) return 'just now';
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  return `${day}d ago`;
}

// ── Admin Edge Function helper (service-role lives there) ───────────────────
async function callAdmin(body: unknown): Promise<any> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  const res = await fetch(ADMIN_FN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((json && json.error) || `Request failed (${res.status})`);
  }
  return json;
}

// ── A small copy-to-clipboard button with a transient "Copied" state ────────
function CopyButton({
  value,
  label = 'Copy',
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button
      tone="secondary"
      size="sm"
      onClick={copy}
      aria-label={copied ? 'Copied to clipboard' : label}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" aria-hidden /> Copied
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" aria-hidden /> {label}
        </>
      )}
    </Button>
  );
}

// ── Credentials card — shown once, must be handed to the student now ────────
function CredentialsPanel({
  creds,
  heading,
}: {
  creds: Credentials;
  heading: string;
}) {
  return (
    <Card accent padded="md" className="mt-4 bg-amber-50/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Eyebrow>{heading}</Eyebrow>
          <p className="mt-2 max-w-prose text-body text-ink-600">
            Hand these to the student now. The password can&apos;t be retrieved
            later — only reset.
          </p>
        </div>
        <CopyButton value={credentialString(creds)} />
      </div>
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-body">
        <dt className="text-ink-400">Username</dt>
        <dd className="font-mono text-ink">{creds.username}</dd>
        <dt className="text-ink-400">Password</dt>
        <dd className="font-mono text-ink">{creds.password}</dd>
      </dl>
    </Card>
  );
}

export function Admin() {
  const userId = useAuth((s) => s.userId);
  const displayName = useAuth((s) => s.displayName);

  // Loaded datasets
  const [students, setStudents] = useState<Student[]>([]);
  const [access, setAccess] = useState<AccessRow[]>([]);
  const [requests, setRequests] = useState<UnlockRequest[]>([]);
  const [progress, setProgress] = useState<ProgressRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // "Add a student" form state
  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newPassword, setNewPassword] = useState(genPassword());
  const [newTopics, setNewTopics] = useState<string[]>([]);
  const [newIsAdmin, setNewIsAdmin] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createdCreds, setCreatedCreds] = useState<Credentials | null>(null);
  const [createdRole, setCreatedRole] = useState<'student' | 'instructor'>('student');

  // Per-student reset password reveal: { [studentId]: Credentials }
  const [resetCreds, setResetCreds] = useState<Record<string, Credentials>>({});

  // Track in-flight per-(student, slug) chip toggles to disable them
  const [busyChips, setBusyChips] = useState<Record<string, boolean>>({});
  // Track in-flight per-request actions
  const [busyReqs, setBusyReqs] = useState<Record<string, boolean>>({});

  const refetch = useCallback(async () => {
    setError(null);
    try {
      const [studentsRes, accessRes, requestsRes, progressRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, username, display_name, created_at')
          .eq('is_admin', false)
          .order('created_at', { ascending: true }),
        supabase.from('topic_access').select('student_id, topic_slug'),
        supabase
          .from('unlock_requests')
          .select('id, student_id, topic_slug, created_at')
          .eq('status', 'pending')
          .order('created_at', { ascending: true }),
        supabase
          .from('lesson_progress')
          .select('student_id, lesson_slug, quiz_done, practice_done'),
      ]);

      if (studentsRes.error) throw studentsRes.error;
      if (accessRes.error) throw accessRes.error;
      if (requestsRes.error) throw requestsRes.error;
      if (progressRes.error) throw progressRes.error;

      setStudents((studentsRes.data ?? []) as Student[]);
      setAccess((accessRes.data ?? []) as AccessRow[]);
      setRequests((requestsRes.data ?? []) as UnlockRequest[]);
      setProgress((progressRes.data ?? []) as ProgressRow[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data.');
    }
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      setLoading(true);
      await refetch();
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [refetch]);

  // Map: studentId -> Set of unlocked slugs
  const accessByStudent = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const row of access) {
      const set = map.get(row.student_id) ?? new Set<string>();
      set.add(row.topic_slug);
      map.set(row.student_id, set);
    }
    return map;
  }, [access]);

  const studentById = useMemo(() => {
    const map = new Map<string, Student>();
    for (const s of students) map.set(s.id, s);
    return map;
  }, [students]);

  // Map: studentId -> (lessonSlug -> completion flags)
  const progressByStudent = useMemo(() => {
    const map = new Map<string, Map<string, { quizDone: boolean; practiceDone: boolean }>>();
    for (const r of progress) {
      let m = map.get(r.student_id);
      if (!m) {
        m = new Map();
        map.set(r.student_id, m);
      }
      m.set(r.lesson_slug, { quizDone: r.quiz_done, practiceDone: r.practice_done });
    }
    return map;
  }, [progress]);

  // Completion stats for one student, computed the same way the learner's own
  // pages do (isLessonComplete), across every authored chapter.
  const studentStats = (studentId: string) => {
    const recs = progressByStudent.get(studentId);
    let completed = 0;
    let total = 0;
    const perTopic = chapters.map((topic) => {
      let tc = 0;
      for (const lesson of topic.lessons) {
        total++;
        if (isLessonComplete(lesson, recs?.get(lesson.slug))) {
          completed++;
          tc++;
        }
      }
      return { slug: topic.slug, title: topic.title, completed: tc, total: topic.lessons.length };
    });
    return { completed, total, pct: total ? Math.round((completed / total) * 100) : 0, perTopic };
  };

  // ── Mutations ─────────────────────────────────────────────────────────────
  async function grantAccess(studentId: string, slug: string) {
    const { error: err } = await supabase
      .from('topic_access')
      .upsert(
        { student_id: studentId, topic_slug: slug, granted_by: userId },
        { onConflict: 'student_id,topic_slug' },
      );
    if (err) throw err;
  }

  async function revokeAccess(studentId: string, slug: string) {
    const { error: err } = await supabase
      .from('topic_access')
      .delete()
      .eq('student_id', studentId)
      .eq('topic_slug', slug);
    if (err) throw err;
  }

  async function resolveRequest(reqId: string, status: 'granted' | 'dismissed') {
    const { error: err } = await supabase
      .from('unlock_requests')
      .update({ status, resolved_at: new Date().toISOString() })
      .eq('id', reqId);
    if (err) throw err;
  }

  // ── Section 1: create student ─────────────────────────────────────────────
  const toggleNewTopic = (slug: string) => {
    setNewTopics((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const username = newUsername.trim().toLowerCase();
    if (!username) {
      setError('Username is required.');
      return;
    }
    setCreating(true);
    setError(null);
    setCreatedCreds(null);
    try {
      const json = await callAdmin({
        action: 'create-student',
        username,
        password: newPassword,
        display_name: newDisplayName.trim(),
        is_admin: newIsAdmin,
        topics: newIsAdmin ? [] : newTopics,
      });
      setCreatedCreds({
        username: (json.username as string) ?? username,
        password: (json.password as string) ?? newPassword,
      });
      setCreatedRole(newIsAdmin ? 'instructor' : 'student');
      // Clear the form for the next person.
      setNewUsername('');
      setNewDisplayName('');
      setNewPassword(genPassword());
      setNewTopics([]);
      setNewIsAdmin(false);
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create student.');
    } finally {
      setCreating(false);
    }
  }

  // ── Section 2: request actions ────────────────────────────────────────────
  async function handleGrantRequest(req: UnlockRequest) {
    setBusyReqs((b) => ({ ...b, [req.id]: true }));
    setError(null);
    try {
      await grantAccess(req.student_id, req.topic_slug);
      await resolveRequest(req.id, 'granted');
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to grant request.');
    } finally {
      setBusyReqs((b) => ({ ...b, [req.id]: false }));
    }
  }

  async function handleDismissRequest(req: UnlockRequest) {
    setBusyReqs((b) => ({ ...b, [req.id]: true }));
    setError(null);
    try {
      await resolveRequest(req.id, 'dismissed');
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to dismiss request.');
    } finally {
      setBusyReqs((b) => ({ ...b, [req.id]: false }));
    }
  }

  // ── Section 3: per-student chip toggle / reset / delete ───────────────────
  async function handleToggleChip(
    studentId: string,
    slug: string,
    unlocked: boolean,
  ) {
    const key = `${studentId}:${slug}`;
    setBusyChips((b) => ({ ...b, [key]: true }));
    setError(null);
    try {
      if (unlocked) await revokeAccess(studentId, slug);
      else await grantAccess(studentId, slug);
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update access.');
    } finally {
      setBusyChips((b) => ({ ...b, [key]: false }));
    }
  }

  async function handleResetPassword(student: Student) {
    const password = genPassword();
    setError(null);
    try {
      await callAdmin({
        action: 'reset-password',
        studentId: student.id,
        password,
      });
      setResetCreds((r) => ({
        ...r,
        [student.id]: { username: student.username, password },
      }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to reset password.',
      );
    }
  }

  async function handleDelete(student: Student) {
    const ok = window.confirm(
      `Delete ${student.display_name || student.username}? This permanently removes their login and progress.`,
    );
    if (!ok) return;
    setError(null);
    try {
      await callAdmin({ action: 'delete-student', studentId: student.id });
      setResetCreds((r) => {
        const next = { ...r };
        delete next[student.id];
        return next;
      });
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete student.');
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="container-page py-12 sm:py-16 space-y-12">
      <header className="space-y-3">
        <Eyebrow>Instructor console</Eyebrow>
        <H1>Manage students &amp; access</H1>
        <Lead>
          {displayName
            ? `Signed in as ${displayName}. `
            : ''}
          Create logins, review unlock requests, and control which chapters each
          student can see.
        </Lead>
        <div className="flex flex-wrap gap-2">
          <Button
            tone="ghost"
            size="sm"
            onClick={() => void refetch()}
            aria-label="Refresh data"
          >
            <RefreshCw className="h-4 w-4" aria-hidden /> Refresh
          </Button>
          <a
            href={SUPABASE_DASHBOARD}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-ink bg-white px-3 h-8 text-caption font-medium text-ink transition-colors hover:bg-cream-200"
          >
            <ExternalLink className="h-4 w-4" aria-hidden /> Supabase dashboard
          </a>
        </div>
      </header>

      {/* Always-on guide — so you never need a separate README, and it reads
          fine on a phone. Collapsed by default to stay out of the way. */}
      <details className="group border border-hairline bg-white">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-body font-semibold text-ink">
          <HelpCircle className="h-4 w-4 text-amber-700" aria-hidden />
          How this works
          <span className="ml-auto text-caption font-normal text-ink-400 group-open:hidden">
            Tap to open
          </span>
        </summary>
        <div className="space-y-4 border-t border-hairline px-4 py-4 text-body text-ink-600">
          <div>
            <p className="font-semibold text-ink">1. Create a student login</p>
            <p className="mt-1">
              In <span className="font-medium text-ink">Add a student</span>, type a
              username (lowercase, no spaces). A password is generated for you — or
              type your own. Tick any chapters to unlock right away, then
              <span className="font-medium text-ink"> Create student</span>.
            </p>
          </div>
          <div>
            <p className="font-semibold text-ink">2. Give them the credentials</p>
            <p className="mt-1">
              A card shows the username and password. Tap{' '}
              <span className="font-medium text-ink">Copy</span> and send it to the
              student (WhatsApp, message, on paper — whatever works). They sign in at
              the same website address you use. The password can&apos;t be viewed
              again later — only reset.
            </p>
          </div>
          <div>
            <p className="font-semibold text-ink">3. Release chapters one by one</p>
            <p className="mt-1">
              Under <span className="font-medium text-ink">Students</span>, tap a
              chapter chip to unlock it for that student; tap again to re-lock. The
              change shows up the next time they open the page.
            </p>
          </div>
          <div>
            <p className="font-semibold text-ink">4. Unlock requests</p>
            <p className="mt-1">
              When a student taps &ldquo;Ask instructor to unlock,&rdquo; it appears
              under <span className="font-medium text-ink">Unlock requests</span>.
              Tap <span className="font-medium text-ink">Grant</span> to unlock it,
              or <span className="font-medium text-ink">Dismiss</span> to ignore.
            </p>
          </div>
          <div>
            <p className="font-semibold text-ink">Changing your own password</p>
            <p className="mt-1">
              Use the{' '}
              <a
                href={SUPABASE_DASHBOARD}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-amber-700 underline underline-offset-2"
              >
                Supabase dashboard
              </a>{' '}
              → Authentication → Users → <code>instructor@class.local</code> → reset
              password. (Student passwords you can reset right here, per student.)
            </p>
          </div>
        </div>
      </details>

      {error && (
        <Callout tone="warn" title="Something went wrong">
          {error}
        </Callout>
      )}

      {loading ? (
        <Card padded="lg">
          <p className="text-ink-400">Loading…</p>
        </Card>
      ) : (
        <>
          {/* ── Section 1: Add a student ─────────────────────────────────── */}
          <Card padded="lg" accent>
            <div className="flex items-center gap-3">
              <UserPlus className="h-5 w-5 text-amber-700" aria-hidden />
              <H2 className="mt-0 mb-0">Add a student</H2>
            </div>

            <form onSubmit={handleCreate} className="mt-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label
                    htmlFor="new-username"
                    className="block text-caption font-semibold text-ink"
                  >
                    Username <span className="text-err">*</span>
                  </label>
                  <input
                    id="new-username"
                    type="text"
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    value={newUsername}
                    onChange={(e) =>
                      setNewUsername(e.target.value.toLowerCase())
                    }
                    placeholder="alice"
                    className="w-full border border-hairline bg-white px-3 py-2 font-mono text-body text-ink focus:border-amber-600 focus:outline-none"
                  />
                  <p className="text-caption text-ink-400">
                    Lowercase, no spaces — this is their login.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="new-display"
                    className="block text-caption font-semibold text-ink"
                  >
                    Display name{' '}
                    <span className="font-normal text-ink-400">(optional)</span>
                  </label>
                  <input
                    id="new-display"
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    placeholder="Alice Johnson"
                    className="w-full border border-hairline bg-white px-3 py-2 text-body text-ink focus:border-amber-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="new-password"
                  className="block text-caption font-semibold text-ink"
                >
                  Password
                </label>
                <div className="flex gap-2">
                  <input
                    id="new-password"
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full max-w-xs border border-hairline bg-white px-3 py-2 font-mono text-body text-ink focus:border-amber-600 focus:outline-none"
                  />
                  <Button
                    type="button"
                    tone="secondary"
                    size="md"
                    onClick={() => setNewPassword(genPassword())}
                  >
                    <RefreshCw className="h-4 w-4" aria-hidden /> Regenerate
                  </Button>
                </div>
              </div>

              <label
                className={cn(
                  'flex cursor-pointer items-start gap-2.5 border px-3 py-3 text-body',
                  newIsAdmin
                    ? 'border-amber-300 bg-amber-50 text-ink'
                    : 'border-hairline bg-white text-ink-600',
                )}
              >
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-amber-700"
                  checked={newIsAdmin}
                  onChange={(e) => setNewIsAdmin(e.target.checked)}
                />
                <span>
                  <span className="font-semibold text-ink">
                    Make this an instructor
                  </span>
                  <span className="block text-caption text-ink-400">
                    Full access to every chapter and to this Console. Use only for
                    co-teachers — not students.
                  </span>
                </span>
              </label>

              {newIsAdmin ? (
                <p className="border-l-2 border-amber-300 bg-amber-50/60 px-3 py-2 text-caption text-ink-600">
                  Instructors can see every chapter, so there&apos;s nothing to
                  unlock here.
                </p>
              ) : (
                <fieldset className="space-y-3">
                  <legend className="text-caption font-semibold text-ink">
                    Unlock chapters now{' '}
                    <span className="font-normal text-ink-400">(optional)</span>
                  </legend>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {chapters.map((c) => {
                      const checked = newTopics.includes(c.slug);
                      return (
                        <label
                          key={c.slug}
                          className={cn(
                            'flex cursor-pointer items-center gap-2 border px-3 py-2 text-body',
                            checked
                              ? 'border-amber-300 bg-amber-50 text-ink'
                              : 'border-hairline bg-white text-ink-600',
                          )}
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-amber-700"
                            checked={checked}
                            onChange={() => toggleNewTopic(c.slug)}
                          />
                          <span>{c.title}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              <div>
                <Button
                  type="submit"
                  tone="primary"
                  size="md"
                  disabled={creating || !newUsername.trim()}
                >
                  <UserPlus className="h-4 w-4" aria-hidden />
                  {creating
                    ? 'Creating…'
                    : newIsAdmin
                    ? 'Create instructor'
                    : 'Create student'}
                </Button>
              </div>
            </form>

            {createdCreds && (
              <>
                <CredentialsPanel
                  creds={createdCreds}
                  heading={
                    createdRole === 'instructor'
                      ? 'Instructor created — credentials'
                      : 'Student created — credentials'
                  }
                />
                {createdRole === 'instructor' && (
                  <p className="mt-2 text-caption text-ink-400">
                    They log in with the username above (just the username — no
                    email). Instructors don&apos;t appear in the Students list
                    below.
                  </p>
                )}
              </>
            )}
          </Card>

          {/* ── Section 2: Unlock requests ───────────────────────────────── */}
          <Card padded="lg">
            <div className="flex items-center gap-3">
              <Inbox className="h-5 w-5 text-amber-700" aria-hidden />
              <H2 className="mt-0 mb-0">Unlock requests</H2>
              <Pill tone={requests.length ? 'accent' : 'dim'}>
                {requests.length} pending
              </Pill>
            </div>

            {requests.length === 0 ? (
              <p className="mt-6 text-body text-ink-400">No pending requests.</p>
            ) : (
              <ul className="mt-6 divide-y divide-hairline">
                {requests.map((req) => {
                  const student = studentById.get(req.student_id);
                  const who =
                    student?.display_name ||
                    student?.username ||
                    'Unknown student';
                  const busy = !!busyReqs[req.id];
                  return (
                    <li
                      key={req.id}
                      className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0"
                    >
                      <div className="min-w-0">
                        <p className="text-body text-ink">
                          <span className="font-medium">{who}</span>
                          {student?.username && (
                            <span className="ml-2 font-mono text-caption text-ink-400">
                              @{student.username}
                            </span>
                          )}
                        </p>
                        <p className="text-caption text-ink-600">
                          wants{' '}
                          <span className="font-medium text-ink">
                            {chapterTitle(req.topic_slug)}
                          </span>
                          <span className="ml-2 text-ink-400">
                            {relativeTime(req.created_at)}
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          tone="primary"
                          size="sm"
                          disabled={busy}
                          onClick={() => void handleGrantRequest(req)}
                        >
                          <LockOpen className="h-4 w-4" aria-hidden /> Grant
                        </Button>
                        <Button
                          tone="ghost"
                          size="sm"
                          disabled={busy}
                          onClick={() => void handleDismissRequest(req)}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          {/* ── Section 3: Students ──────────────────────────────────────── */}
          <Card padded="lg">
            <div className="flex items-center gap-3">
              <H2 className="mt-0 mb-0">Students</H2>
              <Pill tone="neutral">{students.length}</Pill>
            </div>

            {students.length === 0 ? (
              <p className="mt-6 text-body text-ink-400">
                No students yet. Add one above.
              </p>
            ) : (
              <ul className="mt-6 space-y-8">
                {students.map((student) => {
                  const unlockedSet =
                    accessByStudent.get(student.id) ?? new Set<string>();
                  const creds = resetCreds[student.id];
                  return (
                    <li
                      key={student.id}
                      className="border-t border-hairline pt-6 first:border-t-0 first:pt-0"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="font-mono text-body text-ink">
                            @{student.username}
                          </p>
                          {student.display_name && (
                            <p className="text-caption text-ink-600">
                              {student.display_name}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            tone="secondary"
                            size="sm"
                            onClick={() => void handleResetPassword(student)}
                          >
                            <KeyRound className="h-4 w-4" aria-hidden /> Reset
                            password
                          </Button>
                          <Button
                            tone="danger"
                            size="sm"
                            onClick={() => void handleDelete(student)}
                            aria-label={`Delete ${student.username}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden /> Delete
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {chapters.map((c) => {
                          const unlocked = unlockedSet.has(c.slug);
                          const key = `${student.id}:${c.slug}`;
                          const busy = !!busyChips[key];
                          const Icon = unlocked ? LockOpen : Lock;
                          return (
                            <button
                              key={c.slug}
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                void handleToggleChip(
                                  student.id,
                                  c.slug,
                                  unlocked,
                                )
                              }
                              aria-pressed={unlocked}
                              aria-label={`${unlocked ? 'Lock' : 'Unlock'} ${c.title} for ${student.username}`}
                              className={cn(
                                'inline-flex items-center gap-1.5 border px-2.5 py-1 text-caption font-medium transition-colors disabled:opacity-50',
                                unlocked
                                  ? 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                                  : 'border-hairline bg-white text-ink-400 hover:text-ink hover:border-ink',
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" aria-hidden />
                              {c.title}
                            </button>
                          );
                        })}
                      </div>

                      {creds && (
                        <CredentialsPanel
                          creds={creds}
                          heading="New password — share it now"
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          {/* ── Section 4: Student progress ──────────────────────────────── */}
          <Card padded="lg">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-amber-700" aria-hidden />
              <H2 className="mt-0 mb-0">Student progress</H2>
            </div>

            {students.length === 0 ? (
              <p className="mt-6 text-body text-ink-400">
                No students yet — progress shows up here once they start.
              </p>
            ) : (
              <ul className="mt-6 space-y-6">
                {students.map((student) => {
                  const st = studentStats(student.id);
                  return (
                    <li
                      key={student.id}
                      className="border-t border-hairline pt-5 first:border-t-0 first:pt-0"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <span className="font-mono text-body text-ink">
                            @{student.username}
                          </span>
                          {student.display_name && (
                            <span className="ml-2 text-caption text-ink-400">
                              {student.display_name}
                            </span>
                          )}
                        </div>
                        <span className="text-caption text-ink-600">
                          {st.completed} / {st.total} lessons ·{' '}
                          <span className="font-semibold text-amber-700">{st.pct}%</span>
                        </span>
                      </div>
                      <div className="mt-2">
                        <ProgressBar value={st.completed} max={st.total || 1} thin />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {st.perTopic.map((t) => {
                          const done = t.total > 0 && t.completed === t.total;
                          const started = t.completed > 0 && !done;
                          return (
                            <span
                              key={t.slug}
                              className={cn(
                                'inline-flex items-center gap-1 border px-2 py-0.5 text-caption',
                                done
                                  ? 'border-ok bg-ok-soft/50 text-ok-text'
                                  : started
                                  ? 'border-amber-300 bg-amber-50 text-amber-800'
                                  : 'border-hairline bg-white text-ink-400',
                              )}
                            >
                              {t.title} {t.completed}/{t.total}
                            </span>
                          );
                        })}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
