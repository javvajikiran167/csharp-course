import { create } from 'zustand';
import type { Lesson } from '@/data/types';
import { isLessonComplete, QUIZ_PASS_PCT } from '@/lib/completion';
import {
  fetchProgress,
  upsertLessonProgress,
  deleteAllProgress,
} from '@/lib/progressApi';

// Topic-level quiz/practice progress is stored in lesson_progress under these
// reserved slug prefixes (e.g. "topic-quiz::oop"). They never collide with real
// lesson slugs and let us persist topic assessment without a new table.
const TOPIC_QUIZ_PREFIX = 'topic-quiz::';
const TOPIC_PRACTICE_PREFIX = 'topic-practice::';

export type QuizResult = {
  lessonSlug: string;
  questionId: string;
  correct: boolean;
  attemptedAt: string;
};

export type LessonRecord = {
  visited: boolean;
  // Completion is fully manual: the learner ticks these two boxes. A lesson
  // counts as complete when both are true (see lib/completion for the
  // challenge/quiz-aware rule). quizScore is kept only as an informational hint.
  quizDone: boolean;
  practiceDone: boolean;
  quizScore: number;
  totalQuestions: number;
  visitedAt?: string;
};

// Minimal shape topicProgress needs to derive completion per lesson.
type LessonLike = Pick<Lesson, 'slug' | 'questions' | 'challenges'>;

// Per-topic assessment progress (the dedicated Quiz & Practice pages). Persisted
// in the same lesson_progress table under reserved synthetic slugs so no schema
// change is needed — see TOPIC_QUIZ_PREFIX / TOPIC_PRACTICE_PREFIX below.
export type TopicQuizRecord = { best: number; total: number };

type ProgressState = {
  lessons: Record<string, LessonRecord>;
  // best quiz score + practice acknowledgement, keyed by topic slug
  topicQuiz: Record<string, TopicQuizRecord>;
  topicPractice: Record<string, boolean>;
  results: QuizResult[];
  // The account this progress belongs to. Set by hydrate(); writes go to this
  // student's rows. Null until signed in / after sign out.
  userId: string | null;
  hydrated: boolean;

  // Load this account's progress from Supabase (and migrate any leftover local
  // progress up, one time). Called on sign-in.
  hydrate: (userId: string) => Promise<void>;
  // Wipe in-memory progress on sign-out (so the next user starts clean).
  clear: () => void;

  markLessonVisited: (lessonSlug: string) => void;
  recordQuizScore: (lessonSlug: string, quizScore: number, totalQuestions: number) => void;
  recordResult: (r: QuizResult) => void;
  setQuizDone: (lessonSlug: string, done: boolean) => void;
  setPracticeDone: (lessonSlug: string, done: boolean) => void;
  // A lesson is a reading unit: "read" is its single completion flag. We persist
  // it via the existing quiz_done/practice_done columns (both set together) so no
  // schema change is needed; isLessonComplete reads them back as completion.
  setLessonRead: (lessonSlug: string, read: boolean) => void;

  // ── Topic-level assessment (Quiz & Practice pages) ──
  recordTopicQuiz: (topicSlug: string, score: number, total: number) => void;
  topicQuizPassed: (topicSlug: string) => boolean;
  setTopicPracticeDone: (topicSlug: string, done: boolean) => void;
  resetLesson: (lessonSlug: string) => void;
  reset: () => void;

  // Selectors
  getLessonRecord: (slug: string) => LessonRecord | undefined;
  topicProgress: (lessons: LessonLike[]) => {
    visited: number;
    completed: number;
    total: number;
    pct: number;
    avgQuizScorePct: number | null;
  };
};

const emptyRecord = (): LessonRecord => ({
  visited: false,
  quizDone: false,
  practiceDone: false,
  quizScore: 0,
  totalQuestions: 0,
});

// The pre-account localStorage key. Read once on first sign-in to migrate any
// progress made before accounts existed, then removed.
const LEGACY_KEY = 'csharp-course-progress';

// Field-wise merge: a flag stays true if either side has it; keep the higher
// score and the earliest visit time. Used to reconcile server + local.
function mergeRecords(a?: LessonRecord, b?: LessonRecord): LessonRecord {
  const base = a ?? emptyRecord();
  if (!b) return base;
  return {
    visited: base.visited || b.visited,
    quizDone: base.quizDone || b.quizDone,
    practiceDone: base.practiceDone || b.practiceDone,
    quizScore: Math.max(base.quizScore, b.quizScore),
    totalQuestions: Math.max(base.totalQuestions, b.totalQuestions),
    visitedAt: [base.visitedAt, b.visitedAt]
      .filter((x): x is string => Boolean(x))
      .sort()[0],
  };
}

// Compare the meaningful fields of two records (ignoring the informational
// visitedAt) so hydrate only re-uploads rows that actually differ from the
// server — avoids a redundant write per lesson on every sign-in.
function recordsEqual(a?: LessonRecord, b?: LessonRecord): boolean {
  if (!a || !b) return false;
  return (
    a.visited === b.visited &&
    a.quizDone === b.quizDone &&
    a.practiceDone === b.practiceDone &&
    a.quizScore === b.quizScore &&
    a.totalQuestions === b.totalQuestions
  );
}

function readLegacyLocal(): Record<string, LessonRecord> {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return (parsed?.state?.lessons ?? {}) as Record<string, LessonRecord>;
  } catch {
    return {};
  }
}

export const useProgress = create<ProgressState>()((set, get) => {
  // Push one lesson's current local record up to the server (fire-and-forget;
  // failures are reconciled on next sign-in via the merge in hydrate()).
  const sync = (slug: string) => {
    const { userId, lessons } = get();
    if (!userId) return;
    const rec = lessons[slug];
    if (rec) void upsertLessonProgress(userId, slug, rec);
  };

  // Persist a topic-level assessment record as a synthetic lesson_progress row.
  const syncTopic = (syntheticSlug: string, rec: LessonRecord) => {
    const { userId } = get();
    if (!userId) return;
    void upsertLessonProgress(userId, syntheticSlug, rec);
  };

  return {
    lessons: {},
    topicQuiz: {},
    topicPractice: {},
    results: [],
    userId: null,
    hydrated: false,

    hydrate: async (userId) => {
      set({ userId });
      const server = await fetchProgress();
      const legacy = readLegacyLocal();
      const legacySlugs = Object.keys(legacy);

      // Optimistic records made BEFORE hydrate set userId — e.g. the visit to
      // the lesson the learner deep-linked to or refreshed on. markLessonVisited
      // ran while userId was still null, so sync() skipped the write. Fold those
      // in here (don't clobber them with server-only data) and push them up below.
      const local = get().lessons;

      const slugs = new Set([
        ...Object.keys(server),
        ...legacySlugs,
        ...Object.keys(local),
      ]);
      const lessons: Record<string, LessonRecord> = {};
      const topicQuiz: Record<string, TopicQuizRecord> = { ...get().topicQuiz };
      const topicPractice: Record<string, boolean> = { ...get().topicPractice };
      for (const slug of slugs) {
        // Route reserved synthetic slugs to the topic-level maps; everything
        // else is a real lesson record.
        if (slug.startsWith(TOPIC_QUIZ_PREFIX)) {
          const t = slug.slice(TOPIC_QUIZ_PREFIX.length);
          const r = server[slug];
          if (r) topicQuiz[t] = { best: r.quizScore, total: r.totalQuestions };
          continue;
        }
        if (slug.startsWith(TOPIC_PRACTICE_PREFIX)) {
          const t = slug.slice(TOPIC_PRACTICE_PREFIX.length);
          const r = server[slug];
          if (r) topicPractice[t] = r.practiceDone;
          continue;
        }
        lessons[slug] = mergeRecords(mergeRecords(server[slug], legacy[slug]), local[slug]);
      }
      set({ lessons, topicQuiz, topicPractice, hydrated: true });

      // Persist anything the server doesn't already have in identical form:
      // legacy pre-account progress AND pre-hydrate optimistic visits. Without
      // this, the lesson a learner lands on directly never gets recorded.
      for (const slug of Object.keys(lessons)) {
        if (!recordsEqual(server[slug], lessons[slug])) {
          void upsertLessonProgress(userId, slug, lessons[slug]);
        }
      }
      if (legacySlugs.length) {
        try {
          localStorage.removeItem(LEGACY_KEY);
        } catch {
          /* ignore */
        }
      }
    },

    clear: () =>
      set({ lessons: {}, topicQuiz: {}, topicPractice: {}, results: [], userId: null, hydrated: false }),

    markLessonVisited: (lessonSlug) => {
      const existing = get().lessons[lessonSlug];
      if (existing?.visited) return; // don't bump visitedAt every render
      set((s) => ({
        lessons: {
          ...s.lessons,
          [lessonSlug]: {
            ...(existing ?? emptyRecord()),
            visited: true,
            visitedAt: existing?.visitedAt ?? new Date().toISOString(),
          },
        },
      }));
      sync(lessonSlug);
    },

    // Records the latest quiz outcome (keeping the best score). This is a
    // display hint only — it does NOT mark the lesson complete.
    recordQuizScore: (lessonSlug, quizScore, totalQuestions) => {
      set((s) => {
        const existing = s.lessons[lessonSlug] ?? emptyRecord();
        return {
          lessons: {
            ...s.lessons,
            [lessonSlug]: {
              ...existing,
              visited: true,
              quizScore: Math.max(existing.quizScore, quizScore),
              totalQuestions,
            },
          },
        };
      });
      sync(lessonSlug);
    },

    // Quiz attempt history is kept client-side only (not needed for the
    // cross-device view); add a quiz_attempts table later if you want analytics.
    recordResult: (r) => set((s) => ({ results: [...s.results, r] })),

    setQuizDone: (lessonSlug, done) => {
      set((s) => ({
        lessons: {
          ...s.lessons,
          [lessonSlug]: { ...(s.lessons[lessonSlug] ?? emptyRecord()), visited: true, quizDone: done },
        },
      }));
      sync(lessonSlug);
    },

    setPracticeDone: (lessonSlug, done) => {
      set((s) => ({
        lessons: {
          ...s.lessons,
          [lessonSlug]: { ...(s.lessons[lessonSlug] ?? emptyRecord()), visited: true, practiceDone: done },
        },
      }));
      sync(lessonSlug);
    },

    // Mark the lesson read/unread. Persisted through quiz_done + practice_done so
    // isLessonComplete (which falls back to quizDone && practiceDone) treats a
    // read lesson as complete without needing a dedicated `read` column.
    setLessonRead: (lessonSlug, read) => {
      set((s) => ({
        lessons: {
          ...s.lessons,
          [lessonSlug]: {
            ...(s.lessons[lessonSlug] ?? emptyRecord()),
            visited: true,
            quizDone: read,
            practiceDone: read,
          },
        },
      }));
      sync(lessonSlug);
    },

    // Record a topic-quiz run, keeping the best score. Persisted as a synthetic
    // lesson_progress row (quiz_score=best, total_questions=total, quiz_done=passed).
    recordTopicQuiz: (topicSlug, score, total) => {
      const prev = get().topicQuiz[topicSlug];
      const best = Math.max(prev?.best ?? 0, score);
      set((s) => ({ topicQuiz: { ...s.topicQuiz, [topicSlug]: { best, total } } }));
      const passed = total > 0 && (best / total) * 100 >= QUIZ_PASS_PCT;
      syncTopic(TOPIC_QUIZ_PREFIX + topicSlug, {
        ...emptyRecord(),
        visited: true,
        quizDone: passed,
        quizScore: best,
        totalQuestions: total,
      });
    },

    topicQuizPassed: (topicSlug) => {
      const rec = get().topicQuiz[topicSlug];
      return Boolean(rec && rec.total > 0 && (rec.best / rec.total) * 100 >= QUIZ_PASS_PCT);
    },

    setTopicPracticeDone: (topicSlug, done) => {
      set((s) => ({ topicPractice: { ...s.topicPractice, [topicSlug]: done } }));
      syncTopic(TOPIC_PRACTICE_PREFIX + topicSlug, {
        ...emptyRecord(),
        visited: true,
        practiceDone: done,
      });
    },

    // Clears completion + recorded score for one lesson, keeping "visited".
    resetLesson: (lessonSlug) => {
      set((s) => {
        const existing = s.lessons[lessonSlug];
        return {
          lessons: {
            ...s.lessons,
            [lessonSlug]: {
              ...emptyRecord(),
              visited: existing?.visited ?? false,
              visitedAt: existing?.visitedAt,
            },
          },
          results: s.results.filter((r) => r.lessonSlug !== lessonSlug),
        };
      });
      sync(lessonSlug);
    },

    reset: () => {
      const { userId } = get();
      set({ lessons: {}, results: [] });
      if (userId) void deleteAllProgress(userId);
    },

    getLessonRecord: (slug) => get().lessons[slug],

    topicProgress: (lessons) => {
      const records = get().lessons;
      let visited = 0;
      let completed = 0;
      let scoreSum = 0;
      let scoreMax = 0;
      for (const lesson of lessons) {
        const r = records[lesson.slug];
        if (!r) continue;
        if (r.visited) visited++;
        if (isLessonComplete(r)) completed++;
        if (r.totalQuestions > 0) {
          scoreSum += r.quizScore;
          scoreMax += r.totalQuestions;
        }
      }
      const total = lessons.length;
      return {
        visited,
        completed,
        total,
        pct: total ? Math.round((completed / total) * 100) : 0,
        avgQuizScorePct: scoreMax ? Math.round((scoreSum / scoreMax) * 100) : null,
      };
    },
  };
});
