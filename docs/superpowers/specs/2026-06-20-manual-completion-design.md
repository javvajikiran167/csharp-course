# Manual lesson-completion tracking

Date: 2026-06-20

## Problem

Completion was inferred automatically (a lesson became "complete" when the
quiz finished), which conflated "visited" with "completed" and never tracked
the practice challenges at all. Users want explicit control.

## Decisions (from brainstorming)

- **Fully manual.** Two checkboxes per lesson the learner ticks themselves:
  **Quiz completed** and **Practice completed**. Nothing is auto-marked.
- A lesson is **complete** when both are ticked. A lesson with no challenges
  needs only the quiz; a lesson with no quiz needs only practice.
- **Practice is one checkbox per lesson** (not per challenge).
- Each lesson is **resettable** (clears both flags and the recorded quiz score;
  keeps "visited").
- The quiz still self-grades; the best score is shown as a hint next to the
  Quiz checkbox but does not drive completion.

## Design

**`src/lib/completion.ts`** — `isLessonComplete(lesson, { quizDone, practiceDone })`
encapsulating the rule above (challenge/quiz-aware).

**`src/store/progress.ts`** — `LessonRecord` gains `quizDone` and `practiceDone`;
drops the stored `completed`/`completedAt` (now derived).
- Actions: `markLessonVisited`, `recordQuizScore(slug, score, total)` (best score
  + visited), `setQuizDone(slug, on)`, `setPracticeDone(slug, on)`,
  `resetLesson(slug)`, global `reset()`.
- `topicProgress` takes the lesson objects (not just slugs) so it can derive
  completion; still reports visited / completed / pct / avg quiz score.
- Persist version bumped to 3; migration sets `quizDone = practiceDone = true`
  for records previously `completed`, preserving existing progress.

**`src/components/course/QuizBlock.tsx`** — stop auto-completing; call
`recordQuizScore` on finish. Done-screen copy points at the checkbox.

**`src/components/course/LessonProgress.tsx`** (new) — end-of-lesson card with the
two checkboxes (Practice row hidden when the lesson has no challenges), the score
hint, a derived status line, and a "Reset lesson" action.

**Wiring** — `Lesson.tsx` renders `LessonProgress` after the challenges and uses
the helper for the "Completed" pill; `LessonTimeline`, `Topic`, and `Home` derive
completion via the helper / refactored `topicProgress`.

## Out of scope (YAGNI)

Per-challenge checkboxes; a new global "reset everything" UI (the store keeps
`reset()` but nothing new surfaces it).
