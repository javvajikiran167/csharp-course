import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type QuizResult = {
  lessonSlug: string;
  questionId: string;
  correct: boolean;
  attemptedAt: string;
};

export type LessonRecord = {
  visited: boolean;
  completed: boolean;
  quizScore: number;
  totalQuestions: number;
  visitedAt?: string;
  completedAt?: string;
};

export type LessonStatus = 'not-started' | 'visited' | 'completed';

type ProgressState = {
  lessons: Record<string, LessonRecord>;
  results: QuizResult[];

  markLessonVisited: (lessonSlug: string) => void;
  markLessonComplete: (lessonSlug: string, quizScore: number, totalQuestions: number) => void;
  recordResult: (r: QuizResult) => void;
  reset: () => void;

  // Selectors
  isLessonComplete: (slug: string) => boolean;
  getLessonStatus: (slug: string) => LessonStatus;
  getLessonRecord: (slug: string) => LessonRecord | undefined;
  topicProgress: (lessonSlugs: string[]) => {
    visited: number;
    completed: number;
    total: number;
    pct: number;
    avgQuizScorePct: number | null;
  };
};

const emptyRecord = (): LessonRecord => ({
  visited: false,
  completed: false,
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
        // Don't overwrite completed records and don't bump visitedAt every render.
        if (existing?.completed) return;
        if (existing?.visited) return;
        set((s) => ({
          lessons: {
            ...s.lessons,
            [lessonSlug]: {
              ...(existing ?? emptyRecord()),
              visited: true,
              visitedAt: new Date().toISOString(),
            },
          },
        }));
      },

      markLessonComplete: (lessonSlug, quizScore, totalQuestions) => {
        set((s) => {
          const existing = s.lessons[lessonSlug] ?? emptyRecord();
          // Keep the BEST score across retries.
          const bestScore = Math.max(existing.quizScore, quizScore);
          return {
            lessons: {
              ...s.lessons,
              [lessonSlug]: {
                ...existing,
                visited: true,
                completed: true,
                quizScore: bestScore,
                totalQuestions,
                completedAt: existing.completedAt ?? new Date().toISOString(),
              },
            },
          };
        });
      },

      recordResult: (r) => set((s) => ({ results: [...s.results, r] })),

      reset: () => set({ lessons: {}, results: [] }),

      isLessonComplete: (slug) => Boolean(get().lessons[slug]?.completed),

      getLessonStatus: (slug) => {
        const rec = get().lessons[slug];
        if (!rec) return 'not-started';
        if (rec.completed) return 'completed';
        if (rec.visited) return 'visited';
        return 'not-started';
      },

      getLessonRecord: (slug) => get().lessons[slug],

      topicProgress: (lessonSlugs) => {
        const lessons = get().lessons;
        let visited = 0;
        let completed = 0;
        let scoreSum = 0;
        let scoreMax = 0;
        for (const s of lessonSlugs) {
          const r = lessons[s];
          if (!r) continue;
          if (r.visited) visited++;
          if (r.completed) {
            completed++;
            scoreSum += r.quizScore;
            scoreMax += r.totalQuestions;
          }
        }
        const total = lessonSlugs.length;
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
      version: 2,
      storage: createJSONStorage(() => localStorage),
      // Migrate from v1 (no `visited` field) — fill defaults
      migrate: (persisted: any, version) => {
        if (version < 2 && persisted?.lessons) {
          const lessons: Record<string, LessonRecord> = {};
          for (const [slug, r] of Object.entries<any>(persisted.lessons)) {
            lessons[slug] = {
              visited: true, // any persisted record means they've been there
              completed: Boolean(r.completed),
              quizScore: r.quizScore ?? 0,
              totalQuestions: r.totalQuestions ?? 0,
            };
          }
          return { ...persisted, lessons };
        }
        return persisted;
      },
    },
  ),
);
