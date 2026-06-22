import type { Question } from '@/components/course/quiz-types';

export type Block =
  | { kind: 'paragraph'; text: string }
  | { kind: 'lead'; text: string }
  | { kind: 'heading'; level: 2 | 3; text: string; id?: string }
  | { kind: 'list'; ordered?: boolean; items: string[] }
  | { kind: 'code'; code: string; language?: string; filename?: string }
  | { kind: 'output'; output?: string; lines?: Array<string | { text: string; dim?: boolean }>; label?: string }
  | { kind: 'callout'; tone: 'note' | 'tip' | 'warn' | 'success'; title?: string; text: string }
  | { kind: 'twoColumn'; cards: { title: string; items: string[] }[] }
  // ── Teaching-focused blocks ──
  // Quick-glance bullets for the instructor; shown collapsible at top of lesson.
  | { kind: 'teachingNotes'; items: string[] }
  // End-of-lesson recap — what the student should walk away with.
  | { kind: 'keyTakeaways'; items: string[] }
  // Several short, alternative examples of the same concept side by side.
  | { kind: 'examples'; intro?: string; examples: { label: string; code: string; output?: string }[] };

// A take-home programming problem. Different from quiz: no inline answer,
// the student writes & runs the code in VS Code. Optional difficulty tag.
export type Challenge = {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  title: string;
  prompt: string;
  hints?: string[];
};

// A larger, multi-step build. Bigger than a challenge: it has a spec
// (requirements), optional stretch goals, and lists the concepts it exercises.
// Two of these live at the end of every topic's Practice page, and the
// standalone Projects chapter collects the cross-topic ones.
export type Project = {
  id: string;
  difficulty: 'starter' | 'intermediate' | 'advanced';
  title: string;
  // One or two sentences: what you're building and why it's realistic.
  brief: string;
  // The must-have checklist — the spec the finished project satisfies.
  requirements: string[];
  // Optional "go further" extensions for fast learners.
  stretch?: string[];
  // Which topic concepts the project exercises (shown as tags).
  concepts?: string[];
};

export type Lesson = {
  slug: string;
  number: number;
  title: string;
  objective: string;
  blocks: Block[];
  // Quizzes and challenges now live at the TOPIC level (separate pages).
  // These remain optional for backward compatibility and the occasional
  // inline "quick check"; new lessons are pure reading + examples.
  questions?: Question[];
  challenges?: Challenge[];
};

// A topic outline entry — used by locked topics to preview the path forward
// without authoring full content yet.
export type LessonStub = {
  number: number;
  slug: string;
  title: string;
  objective: string;
};

export type Topic = {
  slug: string;
  title: string;
  subtitle: string;
  status: 'unlocked' | 'locked';
  lessons: Lesson[];
  // ── Topic-level assessment (the separate Quiz & Practice pages) ──
  // The graded quiz for the whole topic — 12–15 questions at /topic/:slug/quiz.
  quiz?: Question[];
  // The take-home problem set — ≥10 problems at /topic/:slug/practice.
  practice?: Challenge[];
  // Two (or more) larger builds, shown under the practice problems.
  projects?: Project[];
  // When locked, this lists what's coming so students see the path
  outline?: LessonStub[];
};
