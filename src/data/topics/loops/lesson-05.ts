import type { Lesson } from '@/data/types';

export const lesson05: Lesson = {
  slug: 'break-continue',
  number: 5,
  title: 'break, continue & return',
  objective:
    'Master the three loop-exit keywords — `break` (exit loop), `continue` (skip iteration), and `return` (exit method) — and how they differ from each other.',
  blocks: [
    {
      kind: 'lead',
      text:
        'Three keywords change how a loop flows: **`break`** stops the loop entirely, **`continue`** skips just this iteration, and **`return`** exits the whole method (including the loop). Knowing exactly when to reach for each is a sign of fluency.',
    },
    {
      kind: 'teachingNotes',
      items: [
        '**`break`** exits the **innermost** loop — to break out of nested loops, you need a flag or `goto`',
        '**`continue`** is "skip the rest of this iteration, check the condition" — in `for`, the update still runs',
        '**`return`** exits the whole method — useful as an early-exit shortcut inside loops',
        'Show **all three side-by-side** on the same loop body so the differences land',
        'Mention `goto label;` for breaking nested loops — rare but interview-tested',
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The three exits compared',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: '`break` — leave the loop',
          items: [
            'Stops the **current** loop immediately',
            'Control resumes **after** the loop',
            'Exits only the **innermost** loop if nested',
            'Common use: "I found it, no need to keep searching"',
          ],
        },
        {
          title: '`continue` — skip to next iteration',
          items: [
            'Stops the **current iteration**',
            'In `for`, the **update step still runs**',
            'In `while`/`do-while`, jumps to the **condition check**',
            'Common use: "skip this one, keep going"',
          ],
        },
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Side-by-side on the same loop',
    },
    {
      kind: 'examples',
      intro: 'Same input (1 to 10), different keyword — see the difference:',
      examples: [
        {
          label: 'No keyword — print all',
          code: `for (int i = 1; i <= 10; i++)
{
    Console.Write($"{i} ");
}
// Output: 1 2 3 4 5 6 7 8 9 10`,
        },
        {
          label: 'break at i == 5 — stop',
          code: `for (int i = 1; i <= 10; i++)
{
    if (i == 5) break;
    Console.Write($"{i} ");
}
// Output: 1 2 3 4`,
        },
        {
          label: 'continue at i == 5 — skip 5',
          code: `for (int i = 1; i <= 10; i++)
{
    if (i == 5) continue;
    Console.Write($"{i} ");
}
// Output: 1 2 3 4 6 7 8 9 10`,
        },
        {
          label: 'return in a method — exit the whole method',
          code: `static void PrintUntil(int stop)
{
    for (int i = 1; i <= 10; i++)
    {
        if (i == stop) return;
        Console.Write($"{i} ");
    }
    Console.WriteLine("Done.");
}

PrintUntil(5);
// Output: 1 2 3 4
// (no "Done." printed — return exited before the WriteLine)`,
        },
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Common use — `break` for early exit on found',
    },
    {
      kind: 'code',
      filename: 'find-first.cs',
      code: `int[] numbers = { 4, 8, 15, 16, 23, 42 };
int target = 16;
int foundAt = -1;

for (int i = 0; i < numbers.Length; i++)
{
    if (numbers[i] == target)
    {
        foundAt = i;
        break;                       // ← no need to keep searching
    }
}

Console.WriteLine(foundAt >= 0
    ? $"Found {target} at index {foundAt}"
    : $"{target} not found");`,
    },
    {
      kind: 'output',
      output: `Found 16 at index 3`,
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Common use — `continue` for "skip invalid"',
    },
    {
      kind: 'code',
      filename: 'sum-of-positives.cs',
      code: `int[] nums = { 5, -3, 12, 0, -7, 18 };
int total = 0;

foreach (int n in nums)
{
    if (n <= 0) continue;            // skip zero and negatives
    total += n;
}

Console.WriteLine($"Sum of positives: {total}");
// Output: 35  (5 + 12 + 18)`,
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Breaking out of nested loops — the only tricky case',
    },
    {
      kind: 'paragraph',
      text:
        '`break` only exits the **innermost** loop. To exit an outer loop from inside an inner one, use a **flag**, **`return`**, or (rarely) a **`goto label;`**.',
    },
    {
      kind: 'code',
      filename: 'nested-flag.cs',
      code: `int[,] grid = { { 1, 2, 3 }, { 4, 5, 6 }, { 7, 8, 9 } };
int target = 5;
bool found = false;

for (int r = 0; r < 3 && !found; r++)
{
    for (int c = 0; c < 3; c++)
    {
        if (grid[r, c] == target)
        {
            Console.WriteLine($"Found at row {r}, col {c}");
            found = true;
            break;                   // exits inner loop only
        }
    }
}`,
    },
    {
      kind: 'code',
      filename: 'nested-return.cs',
      code: `// Cleaner — extract into a method, then \`return\` exits everything
static (int, int)? Find(int[,] g, int target)
{
    for (int r = 0; r < g.GetLength(0); r++)
        for (int c = 0; c < g.GetLength(1); c++)
            if (g[r, c] == target)
                return (r, c);
    return null;
}

var pos = Find(grid, 5);
Console.WriteLine(pos);    // (1, 1)`,
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Best fix for nested loops: extract a method',
      text:
        'When nested loops need a clean exit, the cleanest move is **extract them into a method and use `return`**. It reads better, is easier to test, and avoids both flag variables and `goto`. This is a frequent code-review suggestion. As for `goto`: recognize it, but **if you write it in a real pull request, expect it to be rejected** — it survives in the language for generated code and rare state machines, not for everyday application logic.',
    },

    {
      kind: 'heading',
      level: 2,
      text: '`continue` inside `for` vs `while` — subtle difference',
    },
    {
      kind: 'paragraph',
      text:
        'In a **`for`** loop, `continue` jumps to the **update step** (`i++`), then the condition. In a **`while`** loop, `continue` jumps straight to the **condition** — there is no built-in update. **Forgetting to update inside a `while` after `continue` is a top infinite-loop cause.**',
    },
    {
      kind: 'code',
      code: `// ❌ Infinite loop!
int i = 0;
while (i < 5)
{
    if (i == 2) continue;     // jumps to condition, i never advances past 2
    Console.WriteLine(i);
    i++;
}

// ✅ Update before continue
int j = 0;
while (j < 5)
{
    int current = j;
    j++;                       // advance FIRST
    if (current == 2) continue;
    Console.WriteLine(current);
}`,
    },

    {
      kind: 'keyTakeaways',
      items: [
        '**`break`** exits the **innermost** loop immediately',
        '**`continue`** skips the rest of the current iteration; in `for`, the update step still runs',
        '**`return`** exits the entire method — great early-exit pattern from nested loops',
        '**Breaking nested loops** cleanly: a `bool found` flag, or extract into a method + `return`',
        '**`continue` inside `while`** can cause infinite loops if you forget to update the counter first',
      ],
    },
  ],

  questions: [
    {
      id: 'q1',
      kind: 'predict',
      prompt: 'What does this print?',
      code: `for (int i = 1; i <= 10; i++)
{
    if (i == 3) continue;
    if (i == 6) break;
    Console.Write($"{i} ");
}`,
      options: [
        { label: '1 2 4 5 ', correct: true },
        { label: '1 2 3 4 5 ' },
        { label: '1 2 4 5 6 ' },
        { label: '1 2 4 5 7 8 9 10 ' },
      ],
      explanation:
        'i=1: print. i=2: print. i=3: `continue` (skip). i=4: print. i=5: print. i=6: `break` (exit). Output: `1 2 4 5 `.',
    },
    {
      id: 'q2',
      kind: 'mcq',
      prompt:
        "You have nested `for` loops. You call `break;` inside the inner one. Which loop does it exit?",
      options: [
        { label: 'Both loops.' },
        { label: 'Only the inner loop. The outer continues.', correct: true },
        { label: 'Only the outer loop.' },
        { label: 'The whole method.' },
      ],
      explanation:
        '`break` exits **only the innermost** loop. To exit both, use a `bool found` flag in the outer condition, or — much cleaner — extract the nested loops into a method and `return` from inside.',
    },
    {
      id: 'q3',
      kind: 'predict',
      prompt: 'What does this code do?',
      code: `int i = 0;
while (i < 5)
{
    if (i == 2) continue;
    Console.WriteLine(i);
    i++;
}`,
      options: [
        { label: 'Prints 0, 1, 3, 4' },
        { label: 'Prints 0, 1, then infinite loop at i=2', correct: true },
        { label: 'Prints 0, 1, 2, 3, 4' },
        { label: 'Compile error' },
      ],
      explanation:
        '`while` does not have an update step. When `i == 2`, `continue` jumps to the condition. `i` is still 2 — `continue` again. **Infinite loop.** This is exactly why `for` is safer when you need a counter: the update step runs even after `continue`.',
    },
  ],

  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Skip the negatives',
      prompt:
        "Given `int[] nums = { 3, -1, 4, -2, 5, -6, 9 };` — use `foreach` + `continue` to print only the positive numbers.",
      hints: [
        '`if (n < 0) continue;` then `Console.WriteLine(n);`',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Find the first multiple',
      prompt:
        "Read an integer `target`. Loop through 1, 2, 3, ... and print the first number that is divisible by BOTH `target` and 7. Use `break` to stop once found.",
      hints: [
        '`for (int i = 1; ; i++) { if (i % target == 0 && i % 7 == 0) { Console.WriteLine(i); break; } }`',
      ],
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'Linear search method',
      prompt:
        "Write a method `static int IndexOf(int[] arr, int target)` that returns the index of `target` in `arr`, or `-1` if not found. Use a `for` loop and `return` — no `break` needed. Then test it with three different arrays.",
      hints: [
        '`for (int i = 0; i < arr.Length; i++) if (arr[i] == target) return i;`',
        '`return -1;` after the loop.',
      ],
    },
  ],
};
