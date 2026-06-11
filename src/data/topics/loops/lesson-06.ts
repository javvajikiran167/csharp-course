import type { Lesson } from '@/data/types';

export const lesson06: Lesson = {
  slug: 'nested',
  number: 6,
  title: 'Nested Loops & Complexity',
  objective:
    'Recognize when nested loops are needed, what they cost in performance, and how to choose between an inner loop and a better data structure — every junior interview tests this.',
  blocks: [
    {
      kind: 'lead',
      text:
        'A nested loop is a loop inside another loop. Each iteration of the outer loop runs the entire inner loop. Two nested loops walking the same list of size *N* do **N × N = N²** work. Knowing when that\'s acceptable — and when it\'s not — is the foundation of performance thinking.',
    },
    {
      kind: 'teachingNotes',
      items: [
        '**Two nested loops over N items = N² operations** — say it out loud',
        'Demo the **multiplication table** — concrete and visual',
        'Then show **the duplicate-finder anti-pattern** — N² vs HashSet N',
        '**Big-O is the language interviewers use** — introduce O(N) vs O(N²) here',
        'Tease Collections topic for the HashSet/Dictionary speedup',
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The classic — multiplication table',
    },
    {
      kind: 'code',
      filename: 'mult-table.cs',
      code: `// 5x5 multiplication table — outer chooses the row,
// inner chooses the column.
for (int row = 1; row <= 5; row++)
{
    for (int col = 1; col <= 5; col++)
    {
        Console.Write($"{row * col,4}");
    }
    Console.WriteLine();
}`,
    },
    {
      kind: 'output',
      output: `   1   2   3   4   5
   2   4   6   8  10
   3   6   9  12  15
   4   8  12  16  20
   5  10  15  20  25`,
    },
    {
      kind: 'paragraph',
      text:
        'Outer loop = rows. Inner loop = columns. For each row, all 5 columns run. Total: **5 × 5 = 25 iterations** of the inner body. This is what *"quadratic"* means.',
    },

    {
      kind: 'heading',
      level: 2,
      text: 'When nested loops are the right shape',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Good fit',
          items: [
            '**Grids and tables** — multiplication, image pixels, game boards',
            '**Compare every pair** of items (with care for cost)',
            '**Iterating a 2D structure** — `int[,]`, `int[][]`, list of lists',
            'Small N — under a few thousand, N² is fine',
          ],
        },
        {
          title: 'Bad fit — find a better way',
          items: [
            '**Duplicate detection** — use a HashSet (O(N) instead of O(N²))',
            '**Lookup by key** — use a Dictionary (O(1) instead of O(N))',
            '**Counting frequencies** — use a Dictionary (O(N))',
            'Large N (10K+) with nested loops → seconds become minutes',
          ],
        },
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The duplicate-finder anti-pattern',
    },
    {
      kind: 'code',
      filename: 'duplicates-slow.cs',
      code: `// ❌ O(N²) — for each item, compare to every other item
int[] nums = { 4, 8, 15, 16, 23, 42, 8 };
bool hasDuplicate = false;

for (int i = 0; i < nums.Length; i++)
{
    for (int j = i + 1; j < nums.Length; j++)
    {
        if (nums[i] == nums[j])
        {
            hasDuplicate = true;
            break;
        }
    }
    if (hasDuplicate) break;
}

Console.WriteLine(hasDuplicate);   // True`,
    },
    {
      kind: 'code',
      filename: 'duplicates-fast.cs',
      code: `// ✅ O(N) — walk once, remember what you've seen
var seen = new HashSet<int>();
bool hasDuplicate = false;

foreach (int n in nums)
{
    if (!seen.Add(n))    // Add returns false if already present
    {
        hasDuplicate = true;
        break;
    }
}

Console.WriteLine(hasDuplicate);   // True`,
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'Why this matters',
      text:
        "For 100 items: 10,000 operations vs 100. For **1 million items**: a trillion vs a million — the slow version takes hours, the fast one takes a tenth of a second. **Recognising 'compare every pair' as a HashSet/Dictionary problem is the most-tested junior interview pattern.**",
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Multiple example variations',
    },
    {
      kind: 'examples',
      intro: 'Five common nested-loop shapes — and when they\'re justified:',
      examples: [
        {
          label: 'Print a square of stars',
          code: `for (int r = 0; r < 5; r++)
{
    for (int c = 0; c < 5; c++)
    {
        Console.Write("*");
    }
    Console.WriteLine();
}`,
        },
        {
          label: 'Right-triangle pattern (variable inner)',
          code: `for (int r = 1; r <= 5; r++)
{
    for (int c = 1; c <= r; c++)
    {
        Console.Write("*");
    }
    Console.WriteLine();
}
// *
// **
// ***
// ****
// *****`,
        },
        {
          label: 'Sum of a 2D matrix',
          code: `int[,] grid = { { 1, 2, 3 }, { 4, 5, 6 } };
int total = 0;
for (int r = 0; r < grid.GetLength(0); r++)
{
    for (int c = 0; c < grid.GetLength(1); c++)
    {
        total += grid[r, c];
    }
}
Console.WriteLine(total);   // 21`,
        },
        {
          label: 'All pairs — careful with cost',
          code: `// For small N this is fine — for N=1000 it's a million pairs
int[] points = { 1, 2, 3, 4 };
for (int i = 0; i < points.Length; i++)
{
    for (int j = i + 1; j < points.Length; j++)
    {
        Console.WriteLine($"({points[i]}, {points[j]})");
    }
}`,
        },
        {
          label: 'Spiral / matrix traversal',
          code: `int[,] m = new int[3, 3];
int k = 1;
for (int r = 0; r < 3; r++)
    for (int c = 0; c < 3; c++)
        m[r, c] = k++;

for (int r = 0; r < 3; r++)
{
    for (int c = 0; c < 3; c++)
        Console.Write($"{m[r, c]} ");
    Console.WriteLine();
}`,
        },
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Reading the cost — O(N), O(N²), O(N³)',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Linear — O(N)',
          items: [
            'Single loop over N items',
            '1,000 items → 1,000 operations',
            '1,000,000 items → 1,000,000 (still fast)',
            'Foreach over a list, single for loop',
          ],
        },
        {
          title: 'Quadratic — O(N²)',
          items: [
            'Two nested loops over N items each',
            '1,000 items → 1,000,000 operations',
            '1,000,000 items → 10¹² (hours)',
            'OK for small N; use HashSet/Dictionary above ~10K',
          ],
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'Interview shorthand',
      text:
        'When asked *"what is the time complexity?"* — count the nested loops. **One loop = O(N). Two nested = O(N²). Three nested = O(N³).** The Big-O ignores constants, so a triple nested loop is `O(N³)` regardless of whether each loop does 3 things or 30.',
    },

    {
      kind: 'keyTakeaways',
      items: [
        'A nested loop runs the inner loop **fully for each outer iteration**',
        'Two nested loops over N items = **N² operations** — *quadratic complexity*',
        '**Good nested-loop fits**: grids, matrices, comparing pairs when N is small',
        '**Bad nested-loop fits**: duplicate detection, key lookup, frequency counting — use **HashSet** or **Dictionary** instead',
        '**Cost matters above ~10,000 items** — N² goes from milliseconds to seconds rapidly',
        'Big-O language: **O(N) = linear**, **O(N²) = quadratic**, **O(N³) = cubic**',
      ],
    },
  ],

  questions: [
    {
      id: 'q1',
      kind: 'predict',
      prompt: 'How many times does the inner body run?',
      code: `for (int i = 0; i < 4; i++)
{
    for (int j = 0; j < 3; j++)
    {
        Console.Write("*");
    }
}`,
      options: [
        { label: '4' },
        { label: '7' },
        { label: '12', correct: true },
        { label: '24' },
      ],
      explanation:
        'The outer loop runs 4 times. For each outer iteration, the inner loop runs 3 times. Total: **4 × 3 = 12** inner body runs. Twelve `*` characters are printed.',
    },
    {
      id: 'q2',
      kind: 'mcq',
      prompt: 'You need to check if a list of 1,000,000 integers contains any duplicates. Which approach should you use?',
      options: [
        { label: 'Nested for loops comparing every pair' },
        {
          label: 'A single loop with a HashSet — add each item and check if it was already present',
          correct: true,
        },
        { label: 'Sort the list, then look for adjacent equal pairs' },
        { label: 'Use a Dictionary with string keys' },
      ],
      explanation:
        '**HashSet is O(N) — the nested-loop approach is O(N²) which is 10¹² operations for 1M items**, far too slow. Sorting is O(N log N) and also viable but slower than HashSet. This is one of the most-asked junior C# interview questions.',
    },
    {
      id: 'q3',
      kind: 'mcq',
      prompt:
        "Two nested loops, each running N times. What is the time complexity?",
      options: [
        { label: 'O(N)' },
        { label: 'O(N²)', correct: true },
        { label: 'O(2N)' },
        { label: 'O(N log N)' },
      ],
      explanation:
        'N iterations of the outer × N iterations of the inner = **N² total inner-body runs**, which is `O(N²)` — quadratic complexity. The constant factor (how many operations are in the body) does not change the Big-O classification.',
    },
  ],

  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Right-triangle of stars',
      prompt:
        "Use nested `for` loops to print a right triangle with **6 rows** — the first row has 1 star, the second has 2, …, the sixth has 6.",
      hints: [
        'Outer loop: rows 1 to 6. Inner loop: 1 to row number.',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Multiplication table 1-10',
      prompt:
        "Print the full 1-10 multiplication table. Each number column-aligned with width 4 using format `{p,4}`.",
      hints: [
        'Outer loop: rows 1-10. Inner: columns 1-10.',
        '`Console.Write($"{row * col,4}");`',
      ],
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'Find duplicates — two ways',
      prompt:
        "Given `int[] nums = { 5, 2, 9, 5, 3, 9, 1 };`, write two methods:\n• `bool HasDupSlow(int[] nums)` — nested loops, O(N²)\n• `bool HasDupFast(int[] nums)` — single loop + HashSet, O(N)\n\nBoth should return `true` for this input. Print the result of each. Comment in the code on which one you would use for a list of 1,000,000 items, and why.",
      hints: [
        'Slow: `for i, for j = i+1 ...`',
        'Fast: `var seen = new HashSet<int>(); foreach (var n in nums) if (!seen.Add(n)) return true;`',
      ],
    },
  ],
};
