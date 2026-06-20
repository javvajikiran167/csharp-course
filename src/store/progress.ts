import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Lesson } from '@/data/types';
import { isLessonComplete, QUIZ_PASS_PCT } from '@/lib/completion';

export type LessonRecord = {
  visited: boolean;
  // The new completion flag: the learner has read the lesson.
  read: boolean;
  // Legacy per-lesson flags (pre-redesign). Kept so old progress migrates and
  // any lingering inline quiz still records. New flow uses `read` + topic quiz.
  quizDone: boolean;
  practiceDone: boolean;
  visitedAt?: string;
};

// Per-topic quiz outcome (the separate Quiz page). We keep the best score.
export type TopicQuizRecord = {
  best: number;
  total: number;
};

// Minimal shape topicProgress needs to derive completion per lesson.
type LessonLike = Pick<Lesson, 'slug'>;

type ProgressState = {
  lessons: Record<string, LessonRecord>;
  topicQuiz: Record<string, TopicQuizRecord>;
  topicPractice: Record<string, boolean>;

  markLessonVisited: (lessonSlug: string) => void;
  setLessonRead: (lessonSlug: string, read: boolean) => void;
  recordTopicQuiz: (topicSlug: string, score: number, total: number) => void;
  setTopicPracticeDone: (topicSlug: string, done: boolean) => void;
  resetLesson: (lessonSlug: string) => void;
  resetTopic: (topicSlug: string, lessonSlugs: string[]) => void;
  reset: () => void;

  // Selectors
  getLessonRecord: (slug: string) => LessonRecord | undefined;
  topicQuizPassed: (topicSlug: string) => boolean;
  topicProgress: (lessons: LessonLike[]) => {
    visited: number;
    completed: number;
    total: number;
    pct: number;
  };
};

const emptyRecord = (): LessonRecord => ({
  visited: false,
  read: false,
  quizDone: false,
  practiceDone: false,
});

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      lessons: {},
      topicQuiz: {},
      topicPractice: {},

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

      setLessonRead: (lessonSlug, read) =>
        set((s) => ({
          lessons: {
            ...s.lessons,
            [lessonSlug]: { ...(s.lessons[lessonSlug] ?? emptyRecord()), visited: true, read },
          },
        })),

      // Records the topic quiz outcome, keeping the best score.
      recordTopicQuiz: (topicSlug, score, total) =>
        set((s) => {
          const prev = s.topicQuiz[topicSlug];
          const best = prev ? Math.max(prev.best, score) : score;
          return { topicQuiz: { ...s.topicQuiz, [topicSlug]: { best, total } } };
        }),

      setTopicPracticeDone: (topicSlug, done) =>
        set((s) => ({ topicPractice: { ...s.topicPractice, [topicSlug]: done } })),

      // Clears completion for one lesson, keeping "visited".
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
          };
        }),

      resetTopic: (topicSlug, lessonSlugs) =>
        set((s) => {
          const lessons = { ...s.lessons };
          for (const slug of lessonSlugs) {
            const existing = lessons[slug];
            lessons[slug] = {
              ...emptyRecord(),
              visited: existing?.visited ?? false,
              visitedAt: existing?.visitedAt,
            };
          }
          const topicQuiz = { ...s.topicQuiz };
          delete topicQuiz[topicSlug];
          const topicPractice = { ...s.topicPractice };
          delete topicPractice[topicSlug];
          return { lessons, topicQuiz, topicPractice };
        }),

      reset: () => set({ lessons: {}, topicQuiz: {}, topicPractice: {} }),

      getLessonRecord: (slug) => get().lessons[slug],

      topicQuizPassed: (topicSlug) => {
        const rec = get().topicQuiz[topicSlug];
        if (!rec || rec.total === 0) return false;
        return (rec.best / rec.total) * 100 >= QUIZ_PASS_PCT;
      },

      topicProgress: (lessons) => {
        const records = get().lessons;
        let visited = 0;
        let completed = 0;
        for (const lesson of lessons) {
          const r = records[lesson.slug];
          if (!r) continue;
          if (r.visited) visited++;
          if (isLessonComplete(r)) completed++;
        }
        const total = lessons.length;
        return {
          visited,
          completed,
          total,
          pct: total ? Math.round((completed / total) * 100) : 0,
        };
      },
    }),
    {
      name: 'csharp-course-progress',
      version: 4,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted: any, version) => {
        if (!persisted?.lessons) return persisted;
        // v1/v2 stored a derived `completed` flag; v3 used quizDone+practiceDone.
        // v4 introduces `read` (lessons are reading units) + topic-level quiz/
        // practice. Map any prior per-lesson completion onto `read` so progress
        // survives the redesign.
        if (version < 4) {
          const lessons: Record<string, LessonRecord> = {};
          for (const [slug, r] of Object.entries<any>(persisted.lessons)) {
            const wasComplete = Boolean(r.completed) || Boolean(r.quizDone && r.practiceDone);
            lessons[slug] = {
              visited: Boolean(r.visited ?? r.completed ?? true),
              read: wasComplete,
              quizDone: Boolean(r.quizDone),
              practiceDone: Boolean(r.practiceDone),
              visitedAt: r.visitedAt,
            };
          }
          return {
            ...persisted,
            lessons,
            topicQuiz: persisted.topicQuiz ?? {},
            topicPractice: persisted.topicPractice ?? {},
          };
        }
        return persisted;
      },
    },
  ),
);
