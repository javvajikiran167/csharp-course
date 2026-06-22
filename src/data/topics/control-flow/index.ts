import type { Topic } from '@/data/types';
import { lesson01 } from './lesson-01';
import { lesson02 } from './lesson-02';
import { lesson03 } from './lesson-03';
import { lesson04 } from './lesson-04';
import { lesson05 } from './lesson-05';
import { lesson06 } from './lesson-06';
import { lesson07 } from './lesson-07';

export const controlFlow: Topic = {
  slug: 'control-flow',
  title: 'Control Flow',
  subtitle:
    'Make decisions in code with if/else, ternary, switch, and pattern matching — the heart of every program logic problem.',
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


export const quiz_control_flow = [
  {
    "id": "control-flow-q1",
    "kind": "fill",
    "prompt": "Question 1",
    "explanation": "Covered in lessons."
  },
  {
    "id": "control-flow-q2",
    "kind": "predict",
    "prompt": "Question 2",
    "explanation": "Covered in lessons."
  },
  {
    "id": "control-flow-q3",
    "kind": "mcq",
    "prompt": "Question 3",
    "explanation": "Covered in lessons."
  },
  {
    "id": "control-flow-q4",
    "kind": "fill",
    "prompt": "Question 4",
    "explanation": "Covered in lessons."
  },
  {
    "id": "control-flow-q5",
    "kind": "predict",
    "prompt": "Question 5",
    "explanation": "Covered in lessons."
  },
  {
    "id": "control-flow-q6",
    "kind": "mcq",
    "prompt": "Question 6",
    "explanation": "Covered in lessons."
  },
  {
    "id": "control-flow-q7",
    "kind": "fill",
    "prompt": "Question 7",
    "explanation": "Covered in lessons."
  },
  {
    "id": "control-flow-q8",
    "kind": "predict",
    "prompt": "Question 8",
    "explanation": "Covered in lessons."
  },
  {
    "id": "control-flow-q9",
    "kind": "mcq",
    "prompt": "Question 9",
    "explanation": "Covered in lessons."
  },
  {
    "id": "control-flow-q10",
    "kind": "fill",
    "prompt": "Question 10",
    "explanation": "Covered in lessons."
  },
  {
    "id": "control-flow-q11",
    "kind": "predict",
    "prompt": "Question 11",
    "explanation": "Covered in lessons."
  },
  {
    "id": "control-flow-q12",
    "kind": "mcq",
    "prompt": "Question 12",
    "explanation": "Covered in lessons."
  },
  {
    "id": "control-flow-q13",
    "kind": "fill",
    "prompt": "Question 13",
    "explanation": "Covered in lessons."
  },
  {
    "id": "control-flow-q14",
    "kind": "predict",
    "prompt": "Question 14",
    "explanation": "Covered in lessons."
  }
];
export const practice_control_flow = [
  {
    "id": "control-flow-p1",
    "difficulty": "easy",
    "title": "Practice 1",
    "prompt": "Write conditional logic to solve this.",
    "hints": [
      "Use if/else or switch"
    ]
  },
  {
    "id": "control-flow-p2",
    "difficulty": "easy",
    "title": "Practice 2",
    "prompt": "Write conditional logic to solve this.",
    "hints": [
      "Use if/else or switch"
    ]
  },
  {
    "id": "control-flow-p3",
    "difficulty": "easy",
    "title": "Practice 3",
    "prompt": "Write conditional logic to solve this.",
    "hints": [
      "Use if/else or switch"
    ]
  },
  {
    "id": "control-flow-p4",
    "difficulty": "medium",
    "title": "Practice 4",
    "prompt": "Write conditional logic to solve this.",
    "hints": [
      "Use if/else or switch"
    ]
  },
  {
    "id": "control-flow-p5",
    "difficulty": "medium",
    "title": "Practice 5",
    "prompt": "Write conditional logic to solve this.",
    "hints": [
      "Use if/else or switch"
    ]
  },
  {
    "id": "control-flow-p6",
    "difficulty": "medium",
    "title": "Practice 6",
    "prompt": "Write conditional logic to solve this.",
    "hints": [
      "Use if/else or switch"
    ]
  },
  {
    "id": "control-flow-p7",
    "difficulty": "hard",
    "title": "Practice 7",
    "prompt": "Write conditional logic to solve this.",
    "hints": [
      "Use if/else or switch"
    ]
  },
  {
    "id": "control-flow-p8",
    "difficulty": "hard",
    "title": "Practice 8",
    "prompt": "Write conditional logic to solve this.",
    "hints": [
      "Use if/else or switch"
    ]
  },
  {
    "id": "control-flow-p9",
    "difficulty": "hard",
    "title": "Practice 9",
    "prompt": "Write conditional logic to solve this.",
    "hints": [
      "Use if/else or switch"
    ]
  },
  {
    "id": "control-flow-p10",
    "difficulty": "hard",
    "title": "Practice 10",
    "prompt": "Write conditional logic to solve this.",
    "hints": [
      "Use if/else or switch"
    ]
  }
];
export const projects_control_flow = [
  {
    "id": "control-flow-proj-1",
    "difficulty": "starter",
    "title": "Grade Evaluator",
    "brief": "Evaluate student grades and assign letter grades.",
    "requirements": [
      "Input score",
      "Assign A-F",
      "Display result"
    ],
    "stretch": [
      "GPA calculation",
      "Class statistics"
    ],
    "concepts": [
      "If/else",
      "Conditionals",
      "Switch"
    ]
  },
  {
    "id": "control-flow-proj-2",
    "difficulty": "intermediate",
    "title": "ATM Simulator",
    "brief": "Simulate ATM menu with deposit, withdraw, balance check.",
    "requirements": [
      "Menu system",
      "Deposit logic",
      "Withdraw logic",
      "Balance"
    ],
    "stretch": [
      "Transaction history",
      "Pin validation"
    ],
    "concepts": [
      "Switch statements",
      "Validation",
      "State"
    ]
  }
];