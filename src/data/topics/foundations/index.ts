import type { Topic } from '@/data/types';
import { lesson01 } from './lesson-01';
import { lesson02 } from './lesson-02';
import { lesson03 } from './lesson-03';
import { lesson04 } from './lesson-04';
import { lesson05 } from './lesson-05';
import { lesson06 } from './lesson-06';
import { lesson07 } from './lesson-07';
import { lesson08 } from './lesson-08';
import { lesson09 } from './lesson-09';

export const foundations: Topic = {
  slug: 'foundations',
  title: 'Foundations of C#',
  subtitle:
    'From why C# exists, through what actually happens when you press Run, to building a working interactive program from scratch.',
  status: 'unlocked',
  lessons: [
    lesson01,
    lesson02,
    lesson03,
    lesson04,
    lesson05,
    lesson06,
    lesson07,
    lesson08,
    lesson09,
  ],
};


export const quiz_foundations = [
  {
    "id": "foundations-q1",
    "kind": "fill",
    "prompt": "Question 1",
    "explanation": "Covered in lessons."
  },
  {
    "id": "foundations-q2",
    "kind": "predict",
    "prompt": "Question 2",
    "explanation": "Covered in lessons."
  },
  {
    "id": "foundations-q3",
    "kind": "mcq",
    "prompt": "Question 3",
    "explanation": "Covered in lessons."
  },
  {
    "id": "foundations-q4",
    "kind": "fill",
    "prompt": "Question 4",
    "explanation": "Covered in lessons."
  },
  {
    "id": "foundations-q5",
    "kind": "predict",
    "prompt": "Question 5",
    "explanation": "Covered in lessons."
  },
  {
    "id": "foundations-q6",
    "kind": "mcq",
    "prompt": "Question 6",
    "explanation": "Covered in lessons."
  },
  {
    "id": "foundations-q7",
    "kind": "fill",
    "prompt": "Question 7",
    "explanation": "Covered in lessons."
  },
  {
    "id": "foundations-q8",
    "kind": "predict",
    "prompt": "Question 8",
    "explanation": "Covered in lessons."
  },
  {
    "id": "foundations-q9",
    "kind": "mcq",
    "prompt": "Question 9",
    "explanation": "Covered in lessons."
  },
  {
    "id": "foundations-q10",
    "kind": "fill",
    "prompt": "Question 10",
    "explanation": "Covered in lessons."
  },
  {
    "id": "foundations-q11",
    "kind": "predict",
    "prompt": "Question 11",
    "explanation": "Covered in lessons."
  },
  {
    "id": "foundations-q12",
    "kind": "mcq",
    "prompt": "Question 12",
    "explanation": "Covered in lessons."
  },
  {
    "id": "foundations-q13",
    "kind": "fill",
    "prompt": "Question 13",
    "explanation": "Covered in lessons."
  },
  {
    "id": "foundations-q14",
    "kind": "predict",
    "prompt": "Question 14",
    "explanation": "Covered in lessons."
  }
];
export const practice_foundations = [
  {
    "id": "foundations-p1",
    "difficulty": "easy",
    "title": "Practice 1",
    "prompt": "Write C# code to solve this problem.",
    "hints": [
      "Use variables and operators"
    ]
  },
  {
    "id": "foundations-p2",
    "difficulty": "easy",
    "title": "Practice 2",
    "prompt": "Write C# code to solve this problem.",
    "hints": [
      "Use variables and operators"
    ]
  },
  {
    "id": "foundations-p3",
    "difficulty": "easy",
    "title": "Practice 3",
    "prompt": "Write C# code to solve this problem.",
    "hints": [
      "Use variables and operators"
    ]
  },
  {
    "id": "foundations-p4",
    "difficulty": "medium",
    "title": "Practice 4",
    "prompt": "Write C# code to solve this problem.",
    "hints": [
      "Use variables and operators"
    ]
  },
  {
    "id": "foundations-p5",
    "difficulty": "medium",
    "title": "Practice 5",
    "prompt": "Write C# code to solve this problem.",
    "hints": [
      "Use variables and operators"
    ]
  },
  {
    "id": "foundations-p6",
    "difficulty": "medium",
    "title": "Practice 6",
    "prompt": "Write C# code to solve this problem.",
    "hints": [
      "Use variables and operators"
    ]
  },
  {
    "id": "foundations-p7",
    "difficulty": "hard",
    "title": "Practice 7",
    "prompt": "Write C# code to solve this problem.",
    "hints": [
      "Use variables and operators"
    ]
  },
  {
    "id": "foundations-p8",
    "difficulty": "hard",
    "title": "Practice 8",
    "prompt": "Write C# code to solve this problem.",
    "hints": [
      "Use variables and operators"
    ]
  },
  {
    "id": "foundations-p9",
    "difficulty": "hard",
    "title": "Practice 9",
    "prompt": "Write C# code to solve this problem.",
    "hints": [
      "Use variables and operators"
    ]
  },
  {
    "id": "foundations-p10",
    "difficulty": "hard",
    "title": "Practice 10",
    "prompt": "Write C# code to solve this problem.",
    "hints": [
      "Use variables and operators"
    ]
  }
];
export const projects_foundations = [
  {
    "id": "foundations-proj-1",
    "difficulty": "starter",
    "title": "Calculator",
    "brief": "Build a simple calculator with basic operations.",
    "requirements": [
      "Add, subtract, multiply, divide"
    ],
    "stretch": [
      "Power function",
      "Modulo"
    ],
    "concepts": [
      "Variables",
      "Operators",
      "Methods"
    ]
  },
  {
    "id": "foundations-proj-2",
    "difficulty": "intermediate",
    "title": "Temperature Converter",
    "brief": "Convert between Celsius and Fahrenheit with validation.",
    "requirements": [
      "C to F conversion",
      "F to C conversion",
      "Input validation"
    ],
    "stretch": [
      "Kelvin conversion",
      "Format output"
    ],
    "concepts": [
      "Math",
      "Validation",
      "User input"
    ]
  }
];