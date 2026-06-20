import type { Lesson } from '@/data/types';

// A lesson is complete when both its quiz and its practice are marked done.
// A lesson with no challenges needs only the quiz; one with no quiz (rare)
// needs only practice. Keeping this rule in one place so every surface that
// shows completion (lesson pill, timeline, topic + home progress) agrees.
export function isLessonComplete(
  lesson: Pick<Lesson, 'questions' | 'challenges'>,
  flags: { quizDone: boolean; practiceDone: boolean } | undefined,
): boolean {
  if (!flags) return false;
  const needsQuiz = (lesson.questions?.length ?? 0) > 0;
  const needsPractice = (lesson.challenges?.length ?? 0) > 0;
  return (!needsQuiz || flags.quizDone) && (!needsPractice || flags.practiceDone);
}
