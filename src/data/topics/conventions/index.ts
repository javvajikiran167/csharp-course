import type { Topic } from '@/data/types';
import { lesson01 } from './lesson-01';

// The first lesson is fully authored — it introduces the topic and shows
// every convention in one example. Lessons 2–7 are listed in the topic
// outline so students see the full path; their full content lands in the
// next authoring sessions.
//
// To unlock more lessons: drop `lesson-NN.ts` into this folder, import here,
// add to `lessons:` array.

export const conventions: Topic = {
  slug: 'conventions',
  title: 'C# Conventions & Style',
  subtitle:
    "Microsoft's official C# style and naming conventions — the rules every professional codebase follows. Positioned after Methods so every term in the conventions has meaning.",
  status: 'unlocked',
  lessons: [lesson01],
  outline: [
    {
      number: 2,
      slug: 'variables-locals',
      title: 'Variables, Parameters, and Local Style',
      objective:
        '`camelCase` for locals and parameters, when to use `var`, naming booleans (`isX`, `hasX`, `canX`).',
    },
    {
      number: 3,
      slug: 'methods-properties',
      title: 'Methods and Properties',
      objective:
        '`PascalCase`, verb-first method names, expression-bodied properties, `Async` suffix for async methods.',
    },
    {
      number: 4,
      slug: 'types',
      title: 'Classes, Records, Interfaces, and Enums',
      objective:
        '`PascalCase` for type names, `I` prefix for interfaces, `T` prefix for generics, plural enum names with [Flags].',
    },
    {
      number: 5,
      slug: 'constants-fields',
      title: 'Constants, Static Fields, and Readonly',
      objective:
        '`PascalCase` for `const` and `static`, `_camelCase` for private instance fields, when to use `readonly` vs `const`.',
    },
    {
      number: 6,
      slug: 'files-namespaces',
      title: 'Files, Namespaces, and Project Layout',
      objective:
        'One public type per file, file name matches the type, namespace matches the folder structure.',
    },
    {
      number: 7,
      slug: 'code-layout',
      title: 'Code Layout & EditorConfig',
      objective:
        'Brace style, 4-space indent, blank lines, `using` ordering — and how `.editorconfig` automates the rules across your team.',
    },
  ],
};


export const quiz_conventions = [
  {
    "id": "conventions-q1",
    "kind": "fill",
    "prompt": "Question 1",
    "explanation": "Covered in lessons."
  },
  {
    "id": "conventions-q2",
    "kind": "predict",
    "prompt": "Question 2",
    "explanation": "Covered in lessons."
  },
  {
    "id": "conventions-q3",
    "kind": "mcq",
    "prompt": "Question 3",
    "explanation": "Covered in lessons."
  },
  {
    "id": "conventions-q4",
    "kind": "fill",
    "prompt": "Question 4",
    "explanation": "Covered in lessons."
  },
  {
    "id": "conventions-q5",
    "kind": "predict",
    "prompt": "Question 5",
    "explanation": "Covered in lessons."
  },
  {
    "id": "conventions-q6",
    "kind": "mcq",
    "prompt": "Question 6",
    "explanation": "Covered in lessons."
  },
  {
    "id": "conventions-q7",
    "kind": "fill",
    "prompt": "Question 7",
    "explanation": "Covered in lessons."
  },
  {
    "id": "conventions-q8",
    "kind": "predict",
    "prompt": "Question 8",
    "explanation": "Covered in lessons."
  },
  {
    "id": "conventions-q9",
    "kind": "mcq",
    "prompt": "Question 9",
    "explanation": "Covered in lessons."
  },
  {
    "id": "conventions-q10",
    "kind": "fill",
    "prompt": "Question 10",
    "explanation": "Covered in lessons."
  },
  {
    "id": "conventions-q11",
    "kind": "predict",
    "prompt": "Question 11",
    "explanation": "Covered in lessons."
  },
  {
    "id": "conventions-q12",
    "kind": "mcq",
    "prompt": "Question 12",
    "explanation": "Covered in lessons."
  },
  {
    "id": "conventions-q13",
    "kind": "fill",
    "prompt": "Question 13",
    "explanation": "Covered in lessons."
  },
  {
    "id": "conventions-q14",
    "kind": "predict",
    "prompt": "Question 14",
    "explanation": "Covered in lessons."
  }
];
export const practice_conventions = [
  {
    "id": "conventions-p1",
    "difficulty": "easy",
    "title": "Practice 1",
    "prompt": "Refactor this code to follow C# conventions.",
    "hints": [
      "Apply naming conventions",
      "Format properly"
    ]
  },
  {
    "id": "conventions-p2",
    "difficulty": "easy",
    "title": "Practice 2",
    "prompt": "Refactor this code to follow C# conventions.",
    "hints": [
      "Apply naming conventions",
      "Format properly"
    ]
  },
  {
    "id": "conventions-p3",
    "difficulty": "easy",
    "title": "Practice 3",
    "prompt": "Refactor this code to follow C# conventions.",
    "hints": [
      "Apply naming conventions",
      "Format properly"
    ]
  },
  {
    "id": "conventions-p4",
    "difficulty": "medium",
    "title": "Practice 4",
    "prompt": "Refactor this code to follow C# conventions.",
    "hints": [
      "Apply naming conventions",
      "Format properly"
    ]
  },
  {
    "id": "conventions-p5",
    "difficulty": "medium",
    "title": "Practice 5",
    "prompt": "Refactor this code to follow C# conventions.",
    "hints": [
      "Apply naming conventions",
      "Format properly"
    ]
  },
  {
    "id": "conventions-p6",
    "difficulty": "medium",
    "title": "Practice 6",
    "prompt": "Refactor this code to follow C# conventions.",
    "hints": [
      "Apply naming conventions",
      "Format properly"
    ]
  },
  {
    "id": "conventions-p7",
    "difficulty": "hard",
    "title": "Practice 7",
    "prompt": "Refactor this code to follow C# conventions.",
    "hints": [
      "Apply naming conventions",
      "Format properly"
    ]
  },
  {
    "id": "conventions-p8",
    "difficulty": "hard",
    "title": "Practice 8",
    "prompt": "Refactor this code to follow C# conventions.",
    "hints": [
      "Apply naming conventions",
      "Format properly"
    ]
  },
  {
    "id": "conventions-p9",
    "difficulty": "hard",
    "title": "Practice 9",
    "prompt": "Refactor this code to follow C# conventions.",
    "hints": [
      "Apply naming conventions",
      "Format properly"
    ]
  },
  {
    "id": "conventions-p10",
    "difficulty": "hard",
    "title": "Practice 10",
    "prompt": "Refactor this code to follow C# conventions.",
    "hints": [
      "Apply naming conventions",
      "Format properly"
    ]
  }
];
export const projects_conventions = [
  {
    "id": "conventions-proj-1",
    "difficulty": "starter",
    "title": "Code Style Audit",
    "brief": "Review and refactor poorly-styled code to follow C# conventions.",
    "requirements": [
      "Apply PascalCase/camelCase",
      "Format code",
      "Add documentation"
    ],
    "stretch": [
      "Enable code analysis",
      "Fix warnings"
    ],
    "concepts": [
      "Naming conventions",
      "Formatting",
      "Documentation"
    ]
  },
  {
    "id": "conventions-proj-2",
    "difficulty": "intermediate",
    "title": "Linter Configuration",
    "brief": "Set up EditorConfig and code analysis rules for a project.",
    "requirements": [
      "Create .editorconfig",
      "Configure StyleCop",
      "Document standards"
    ],
    "stretch": [
      "Team style guide",
      "CI integration"
    ],
    "concepts": [
      "EditorConfig",
      "Code analysis",
      "Team standards"
    ]
  }
];