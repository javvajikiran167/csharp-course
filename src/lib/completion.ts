import type { Topic } from '@/data/types';

// ── Lesson completion ──────────────────────────────────────────────
// In the new structure a lesson is a *reading* unit: it's complete once the
// learner marks it read. Quizzes and practice are assessed at the topic level
// (see below), not per lesson. Keeping this rule in one place so every surface
// that shows completion (lesson pill, timeline, topic + home progress) agrees.
export function isLessonComplete(
  flags: { read?: boolean; quizDone?: boolean; practiceDone?: boolean } | undefined,
): boolean {
  if (!flags) return false;
  // `read` is the new flag. Fall back to the legacy quizDone/practiceDone pair
  // so progress recorded before the redesign still counts.
  return Boolean(flags.read ?? (flags.quizDone && flags.practiceDone));
}

// ── Topic completion ───────────────────────────────────────────────
// A topic is fully complete when every lesson is read, the quiz is passed
// (≥60%, when the topic has one), and practice is acknowledged (when present).
export type TopicCompletionInput = {
  topic: Pick<Topic, 'lessons' | 'quiz' | 'practice'>;
  lessonsRead: number; // how many of the topic's lessons are read
  quizPassed: boolean;
  practiceDone: boolean;
};

export function isTopicComplete({
  topic,
  lessonsRead,
  quizPassed,
  practiceDone,
}: TopicCompletionInput): boolean {
  const allRead = lessonsRead >= topic.lessons.length;
  const quizOk = !topic.quiz || topic.quiz.length === 0 || quizPassed;
  const practiceOk = !topic.practice || topic.practice.length === 0 || practiceDone;
  return allRead && quizOk && practiceOk;
}

// The pass threshold for a topic quiz, shared by the store + UI.
export const QUIZ_PASS_PCT = 60;
