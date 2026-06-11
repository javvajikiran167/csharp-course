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

export type Lesson = {
  slug: string;
  number: number;
  title: string;
  objective: string;
  blocks: Block[];
  questions: Question[];
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
  // When locked, this lists what's coming so students see the path
  outline?: LessonStub[];
};
