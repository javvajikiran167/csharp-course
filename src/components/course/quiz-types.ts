// Quiz question discriminated union — the renderer fans out on `kind`.
export type MultipleChoiceQuestion = {
  id: string;
  kind: 'mcq';
  prompt: string;
  options: { label: string; correct?: boolean }[];
  explanation: string;
};

export type CodePredictQuestion = {
  id: string;
  kind: 'predict';
  prompt: string;
  code: string;
  options: { label: string; correct?: boolean }[];
  explanation: string;
};

export type FillBlankQuestion = {
  id: string;
  kind: 'fill';
  prompt: string;
  // The full line/snippet with `___` marking the blank.
  template: string;
  accept: string[]; // acceptable answers (case-insensitive, trimmed)
  explanation: string;
};

export type Question = MultipleChoiceQuestion | CodePredictQuestion | FillBlankQuestion;
