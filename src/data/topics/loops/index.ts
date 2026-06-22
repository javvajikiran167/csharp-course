import type { Topic } from '@/data/types';
import { lesson01 } from './lesson-01';
import { lesson02 } from './lesson-02';
import { lesson03 } from './lesson-03';
import { lesson04 } from './lesson-04';
import { lesson05 } from './lesson-05';
import { lesson06 } from './lesson-06';
import { lesson07 } from './lesson-07';

export const loops: Topic = {
  slug: 'loops',
  title: 'Loops & Iteration',
  subtitle:
    'while, for, foreach, do-while, break/continue/return, nested loops and complexity — repetition is half of programming.',
  status: 'unlocked',
  lessons: [
    lesson01,
    lesson02,
    lesson03,
    lesson04,
    lesson05,
    lesson06,
    lesson07,
  ],
};


export const quiz_loops = [
  {
    "id": "loops-q1",
    "kind": "fill",
    "prompt": "Question 1",
    "explanation": "Covered in lessons."
  },
  {
    "id": "loops-q2",
    "kind": "predict",
    "prompt": "Question 2",
    "explanation": "Covered in lessons."
  },
  {
    "id": "loops-q3",
    "kind": "mcq",
    "prompt": "Question 3",
    "explanation": "Covered in lessons."
  },
  {
    "id": "loops-q4",
    "kind": "fill",
    "prompt": "Question 4",
    "explanation": "Covered in lessons."
  },
  {
    "id": "loops-q5",
    "kind": "predict",
    "prompt": "Question 5",
    "explanation": "Covered in lessons."
  },
  {
    "id": "loops-q6",
    "kind": "mcq",
    "prompt": "Question 6",
    "explanation": "Covered in lessons."
  },
  {
    "id": "loops-q7",
    "kind": "fill",
    "prompt": "Question 7",
    "explanation": "Covered in lessons."
  },
  {
    "id": "loops-q8",
    "kind": "predict",
    "prompt": "Question 8",
    "explanation": "Covered in lessons."
  },
  {
    "id": "loops-q9",
    "kind": "mcq",
    "prompt": "Question 9",
    "explanation": "Covered in lessons."
  },
  {
    "id": "loops-q10",
    "kind": "fill",
    "prompt": "Question 10",
    "explanation": "Covered in lessons."
  },
  {
    "id": "loops-q11",
    "kind": "predict",
    "prompt": "Question 11",
    "explanation": "Covered in lessons."
  },
  {
    "id": "loops-q12",
    "kind": "mcq",
    "prompt": "Question 12",
    "explanation": "Covered in lessons."
  },
  {
    "id": "loops-q13",
    "kind": "fill",
    "prompt": "Question 13",
    "explanation": "Covered in lessons."
  },
  {
    "id": "loops-q14",
    "kind": "predict",
    "prompt": "Question 14",
    "explanation": "Covered in lessons."
  }
];
export const practice_loops = [
  {
    "id": "loops-p1",
    "difficulty": "easy",
    "title": "Practice 1",
    "prompt": "Use loops to solve this problem.",
    "hints": [
      "Use for, while, or foreach"
    ]
  },
  {
    "id": "loops-p2",
    "difficulty": "easy",
    "title": "Practice 2",
    "prompt": "Use loops to solve this problem.",
    "hints": [
      "Use for, while, or foreach"
    ]
  },
  {
    "id": "loops-p3",
    "difficulty": "easy",
    "title": "Practice 3",
    "prompt": "Use loops to solve this problem.",
    "hints": [
      "Use for, while, or foreach"
    ]
  },
  {
    "id": "loops-p4",
    "difficulty": "medium",
    "title": "Practice 4",
    "prompt": "Use loops to solve this problem.",
    "hints": [
      "Use for, while, or foreach"
    ]
  },
  {
    "id": "loops-p5",
    "difficulty": "medium",
    "title": "Practice 5",
    "prompt": "Use loops to solve this problem.",
    "hints": [
      "Use for, while, or foreach"
    ]
  },
  {
    "id": "loops-p6",
    "difficulty": "medium",
    "title": "Practice 6",
    "prompt": "Use loops to solve this problem.",
    "hints": [
      "Use for, while, or foreach"
    ]
  },
  {
    "id": "loops-p7",
    "difficulty": "hard",
    "title": "Practice 7",
    "prompt": "Use loops to solve this problem.",
    "hints": [
      "Use for, while, or foreach"
    ]
  },
  {
    "id": "loops-p8",
    "difficulty": "hard",
    "title": "Practice 8",
    "prompt": "Use loops to solve this problem.",
    "hints": [
      "Use for, while, or foreach"
    ]
  },
  {
    "id": "loops-p9",
    "difficulty": "hard",
    "title": "Practice 9",
    "prompt": "Use loops to solve this problem.",
    "hints": [
      "Use for, while, or foreach"
    ]
  },
  {
    "id": "loops-p10",
    "difficulty": "hard",
    "title": "Practice 10",
    "prompt": "Use loops to solve this problem.",
    "hints": [
      "Use for, while, or foreach"
    ]
  }
];
export const projects_loops = [
  {
    "id": "loops-proj-1",
    "difficulty": "starter",
    "title": "Multiplication Table",
    "brief": "Print multiplication tables using loops.",
    "requirements": [
      "Input number",
      "Print 1-10 multiples",
      "Formatted output"
    ],
    "stretch": [
      "Multiple tables",
      "Formatted grid"
    ],
    "concepts": [
      "For loops",
      "Nested loops",
      "Formatting"
    ]
  },
  {
    "id": "loops-proj-2",
    "difficulty": "intermediate",
    "title": "Fibonacci & Prime Finder",
    "brief": "Generate Fibonacci sequence and find prime numbers up to N.",
    "requirements": [
      "Fibonacci sequence",
      "Prime number detection",
      "User input"
    ],
    "stretch": [
      "Performance optimization",
      "Display statistics"
    ],
    "concepts": [
      "While loops",
      "Conditionals",
      "Algorithms"
    ]
  }
];