import { supabase } from '@/lib/supabase';
import type { LessonRecord } from '@/store/progress';

// Maps the per-account `lesson_progress` rows in Supabase to/from the in-memory
// LessonRecord the progress store uses. RLS guarantees these calls only ever
// touch the signed-in student's own rows.

export async function fetchProgress(): Promise<Record<string, LessonRecord>> {
  const { data, error } = await supabase
    .from('lesson_progress')
    .select(
      'lesson_slug, visited, quiz_done, practice_done, quiz_score, total_questions, visited_at',
    );
  if (error || !data) return {};
  const out: Record<string, LessonRecord> = {};
  for (const r of data) {
    out[r.lesson_slug] = {
      visited: r.visited,
      quizDone: r.quiz_done,
      practiceDone: r.practice_done,
      quizScore: r.quiz_score,
      totalQuestions: r.total_questions,
      visitedAt: r.visited_at ?? undefined,
    };
  }
  return out;
}

export async function upsertLessonProgress(
  studentId: string,
  slug: string,
  rec: LessonRecord,
): Promise<void> {
  const { error } = await supabase.from('lesson_progress').upsert(
    {
      student_id: studentId,
      lesson_slug: slug,
      visited: rec.visited,
      quiz_done: rec.quizDone,
      practice_done: rec.practiceDone,
      quiz_score: rec.quizScore,
      total_questions: rec.totalQuestions,
      visited_at: rec.visitedAt ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'student_id,lesson_slug' },
  );
  // Best-effort: a failed write (offline) is reconciled on next login via the
  // local copy → server merge in hydrate().
  if (error) console.warn('lesson_progress upsert failed', error.message);
}

export async function deleteAllProgress(studentId: string): Promise<void> {
  const { error } = await supabase
    .from('lesson_progress')
    .delete()
    .eq('student_id', studentId);
  if (error) console.warn('lesson_progress delete-all failed', error.message);
}
