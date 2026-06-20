import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Lesson } from '@/data/types';
import { isLessonComplete } from '@/lib/completion';

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

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      lessons: {},
      results: [],

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
      },

      recordResult: (r) => set((s) => ({ results: [...s.results, r] })),

      setQuizDone: (lessonSlug, done) =>
        set((s) => ({
          lessons: {
            ...s.lessons,
            [lessonSlug]: { ...(s.lessons[lessonSlug] ?? emptyRecord()), visited: true, quizDone: done },
          },
        })),

      setPracticeDone: (lessonSlug, done) =>
        set((s) => ({
          lessons: {
            ...s.lessons,
            [lessonSlug]: { ...(s.lessons[lessonSlug] ?? emptyRecord()), visited: true, practiceDone: done },
          },
        })),

      // Clears completion + recorded score for one lesson, keeping "visited".
      resetLesson: (lessonSlug) =>
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
        }),

      reset: () => set({ lessons: {}, results: [] }),

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
    }),
    {
      name: 'csharp-course-progress',
      version: 3,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted: any, version) => {
        if (!persisted?.lessons) return persisted;
        // v1/v2 stored a derived `completed` flag and auto-marked on quiz finish.
        // Map any prior completion onto the new manual flags so progress survives.
        if (version < 3) {
          const lessons: Record<string, LessonRecord> = {};
          for (const [slug, r] of Object.entries<any>(persisted.lessons)) {
            const wasComplete = Boolean(r.completed);
            lessons[slug] = {
              visited: Boolean(r.visited ?? r.completed ?? true),
              quizDone: wasComplete,
              practiceDone: wasComplete,
              quizScore: r.quizScore ?? 0,
              totalQuestions: r.totalQuestions ?? 0,
              visitedAt: r.visitedAt,
            };
          }
          return { ...persisted, lessons };
        }
        return persisted;
      },
    },
  ),
);
