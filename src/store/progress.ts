import { create } from 'zustand';
import type { Lesson } from '@/data/types';
import { isLessonComplete } from '@/lib/completion';
import {
  fetchProgress,
  upsertLessonProgress,
  deleteAllProgress,
} from '@/lib/progressApi';

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

type ProgressState = {
  lessons: Record<string, LessonRecord>;
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

  return {
    lessons: {},
    results: [],
    userId: null,
    hydrated: false,

    hydrate: async (userId) => {
      set({ userId });
      const server = await fetchProgress();
      const legacy = readLegacyLocal();
      const legacySlugs = Object.keys(legacy);

      const slugs = new Set([...Object.keys(server), ...legacySlugs]);
      const lessons: Record<string, LessonRecord> = {};
      for (const slug of slugs) {
        lessons[slug] = mergeRecords(server[slug], legacy[slug]);
      }
      set({ lessons, hydrated: true });

      // One-time migration of pre-account progress: push the merged result up so
      // the server becomes authoritative, then drop the old local blob.
      if (legacySlugs.length) {
        for (const slug of slugs) void upsertLessonProgress(userId, slug, lessons[slug]);
        try {
          localStorage.removeItem(LEGACY_KEY);
        } catch {
          /* ignore */
        }
      }
    },

    clear: () => set({ lessons: {}, results: [], userId: null, hydrated: false }),

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
        if (isLessonComplete(lesson, r)) completed++;
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
