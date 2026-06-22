import type { Topic } from '@/data/types';

export const capstone: Topic = {
  slug: 'capstone',
  title: 'Job Prep & Capstone',
  subtitle: 'Mock interviews, algorithms in C#, code review, and a full-stack capstone project.',
  status: 'unlocked',
  lessons: [
  {
    "slug": "algorithms",
    "number": 1,
    "title": "Common Algorithm Problems in C#",
    "objective": "Two-pointer, sliding window, hash map — practiced in C# syntax.",
    "blocks": [
      {
        "kind": "lead",
        "text": "Technical interviews love algorithms. You don't need to invent new ones—learn the classics and their C# implementations."
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "Two-Pointer Technique",
        "id": "two-pointer"
      },
      {
        "kind": "code",
        "code": "public int[] TwoSum(int[] nums, int target) {\n    int left = 0, right = nums.Length - 1;\n    while (left < right) {\n        int sum = nums[left] + nums[right];\n        if (sum == target) return new[] { left, right };\n        if (sum < target) left++;\n        else right--;\n    }\n    return Array.Empty<int>();\n}",
        "language": "csharp"
      },
      {
        "kind": "heading",
        "level": 2,
        "text": "Sliding Window",
        "id": "sliding-window"
      },
      {
        "kind": "code",
        "code": "public int MaxSubarraySum(int[] nums, int k) {\n    int windowSum = nums.Take(k).Sum();\n    int maxSum = windowSum;\n    for (int i = k; i < nums.Length; i++) {\n        windowSum = windowSum - nums[i - k] + nums[i];\n        maxSum = Math.Max(maxSum, windowSum);\n    }\n    return maxSum;\n}",
        "language": "csharp"
      },
      {
        "kind": "tip",
        "tone": "tip",
        "title": "Practice on LeetCode",
        "text": "LeetCode has C# support. Filter by \"Easy\" and start with array/string problems."
      },
      {
        "kind": "keyTakeaways",
        "items": [
          "Two-pointer for sorted arrays",
          "Sliding window for subarray problems",
          "Hash maps for O(1) lookups"
        ]
      }
    ]
  },
  {
    "slug": "mock-interview",
    "number": 2,
    "title": "A Walk Through a Mock Interview",
    "objective": "What hiring managers actually ask, and how to think aloud.",
    "blocks": []
  },
  {
    "slug": "code-review",
    "number": 3,
    "title": "How to Read & Review Other People's Code",
    "objective": "A practical skill every job posting expects.",
    "blocks": []
  },
  {
    "slug": "capstone-spec",
    "number": 4,
    "title": "Capstone Spec — Tasks App End-to-End",
    "objective": "EF Core backend, ASP.NET API, tests, deployment.",
    "blocks": []
  },
  {
    "slug": "capstone-build",
    "number": 5,
    "title": "Capstone — Build & Iterate",
    "objective": "Implement, test, refactor.",
    "blocks": []
  },
  {
    "slug": "next-steps",
    "number": 6,
    "title": "Where to Go From Here",
    "objective": "Specializations: Unity, mobile (MAUI), cloud (Azure), advanced .NET.",
    "blocks": []
  }
],
  outline: []
};

export const quiz_capstone = [
  {
    "id": "capstone-q1",
    "kind": "fill",
    "prompt": "Question 1",
    "explanation": "Covered in lessons."
  },
  {
    "id": "capstone-q2",
    "kind": "predict",
    "prompt": "Question 2",
    "explanation": "Covered in lessons."
  },
  {
    "id": "capstone-q3",
    "kind": "mcq",
    "prompt": "Question 3",
    "explanation": "Covered in lessons."
  },
  {
    "id": "capstone-q4",
    "kind": "fill",
    "prompt": "Question 4",
    "explanation": "Covered in lessons."
  },
  {
    "id": "capstone-q5",
    "kind": "predict",
    "prompt": "Question 5",
    "explanation": "Covered in lessons."
  },
  {
    "id": "capstone-q6",
    "kind": "mcq",
    "prompt": "Question 6",
    "explanation": "Covered in lessons."
  },
  {
    "id": "capstone-q7",
    "kind": "fill",
    "prompt": "Question 7",
    "explanation": "Covered in lessons."
  },
  {
    "id": "capstone-q8",
    "kind": "predict",
    "prompt": "Question 8",
    "explanation": "Covered in lessons."
  },
  {
    "id": "capstone-q9",
    "kind": "mcq",
    "prompt": "Question 9",
    "explanation": "Covered in lessons."
  },
  {
    "id": "capstone-q10",
    "kind": "fill",
    "prompt": "Question 10",
    "explanation": "Covered in lessons."
  },
  {
    "id": "capstone-q11",
    "kind": "predict",
    "prompt": "Question 11",
    "explanation": "Covered in lessons."
  },
  {
    "id": "capstone-q12",
    "kind": "mcq",
    "prompt": "Question 12",
    "explanation": "Covered in lessons."
  },
  {
    "id": "capstone-q13",
    "kind": "fill",
    "prompt": "Question 13",
    "explanation": "Covered in lessons."
  },
  {
    "id": "capstone-q14",
    "kind": "predict",
    "prompt": "Question 14",
    "explanation": "Covered in lessons."
  }
];
export const practice_capstone = [
  {
    "id": "capstone-p1",
    "difficulty": "easy",
    "title": "LeetCode Problem 1",
    "prompt": "Solve this algorithm problem in C#.",
    "hints": [
      "Think about the data structure",
      "Time complexity matters"
    ]
  },
  {
    "id": "capstone-p2",
    "difficulty": "easy",
    "title": "LeetCode Problem 2",
    "prompt": "Solve this algorithm problem in C#.",
    "hints": [
      "Think about the data structure",
      "Time complexity matters"
    ]
  },
  {
    "id": "capstone-p3",
    "difficulty": "easy",
    "title": "LeetCode Problem 3",
    "prompt": "Solve this algorithm problem in C#.",
    "hints": [
      "Think about the data structure",
      "Time complexity matters"
    ]
  },
  {
    "id": "capstone-p4",
    "difficulty": "medium",
    "title": "LeetCode Problem 4",
    "prompt": "Solve this algorithm problem in C#.",
    "hints": [
      "Think about the data structure",
      "Time complexity matters"
    ]
  },
  {
    "id": "capstone-p5",
    "difficulty": "medium",
    "title": "LeetCode Problem 5",
    "prompt": "Solve this algorithm problem in C#.",
    "hints": [
      "Think about the data structure",
      "Time complexity matters"
    ]
  },
  {
    "id": "capstone-p6",
    "difficulty": "medium",
    "title": "LeetCode Problem 6",
    "prompt": "Solve this algorithm problem in C#.",
    "hints": [
      "Think about the data structure",
      "Time complexity matters"
    ]
  },
  {
    "id": "capstone-p7",
    "difficulty": "hard",
    "title": "LeetCode Problem 7",
    "prompt": "Solve this algorithm problem in C#.",
    "hints": [
      "Think about the data structure",
      "Time complexity matters"
    ]
  },
  {
    "id": "capstone-p8",
    "difficulty": "hard",
    "title": "LeetCode Problem 8",
    "prompt": "Solve this algorithm problem in C#.",
    "hints": [
      "Think about the data structure",
      "Time complexity matters"
    ]
  },
  {
    "id": "capstone-p9",
    "difficulty": "hard",
    "title": "LeetCode Problem 9",
    "prompt": "Solve this algorithm problem in C#.",
    "hints": [
      "Think about the data structure",
      "Time complexity matters"
    ]
  },
  {
    "id": "capstone-p10",
    "difficulty": "hard",
    "title": "LeetCode Problem 10",
    "prompt": "Solve this algorithm problem in C#.",
    "hints": [
      "Think about the data structure",
      "Time complexity matters"
    ]
  }
];
export const projects_capstone = [
  {
    "id": "capstone-proj-1",
    "difficulty": "intermediate",
    "title": "Tasks App — Backend (EF Core)",
    "brief": "Build the database and services for a task management app.",
    "requirements": [
      "Task entity with due date, priority, tags",
      "EF Core DbContext",
      "CRUD repositories",
      "Unit tests with xUnit",
      "Filter/sort by date and priority"
    ],
    "stretch": [
      "Recurring tasks",
      "Subtasks",
      "Notifications"
    ],
    "concepts": [
      "EF Core",
      "Repositories",
      "xUnit",
      "SOLID"
    ]
  },
  {
    "id": "capstone-proj-2",
    "difficulty": "advanced",
    "title": "Tasks App — Full Stack (Web API + Frontend)",
    "brief": "Complete REST API with authentication, and a simple web UI.",
    "requirements": [
      "ASP.NET Core Web API with JWT auth",
      "All CRUD endpoints tested",
      "Middleware for logging and error handling",
      "HTML/CSS/JS frontend to call the API",
      "Deploy to Azure or similar"
    ],
    "stretch": [
      "Real-time updates with SignalR",
      "Mobile app with Maui",
      "Database migrations and rollback strategy",
      "Performance monitoring"
    ],
    "concepts": [
      "Web API",
      "JWT",
      "Middleware",
      "Frontend integration",
      "Deployment"
    ]
  }
];
