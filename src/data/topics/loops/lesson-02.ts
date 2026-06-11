import type { Lesson } from '@/data/types';

export const lesson02: Lesson = {
  slug: 'for',
  number: 2,
  title: 'for Loops',
  objective:
    'Iterate a known number of times — the workhorse of numeric loops and the loop you will write most often when you know the count up front.',
  blocks: [
    {
      kind: 'lead',
      text:
        '**`for`** packages init, condition, and update into one tight header. When you know how many times to loop — *"do this 10 times"*, *"walk every index of the array"* — `for` is the natural fit. It is the most-typed loop in C#.',
    },
    {
      kind: 'teachingNotes',
      items: [
        '**The header has three parts** separated by semicolons: `init; condition; update` — break them down one at a time',
        '`for (int i = 0; i < n; i++)` is the canonical loop — **`<` and `0`-indexed** match how arrays work',
        '**Off-by-one is the most common bug** — `<` vs `<=`, starting at 0 vs 1; demo it',
        'Show **decrementing** (`i--`), **stepping** (`i += 2`), and **multiple variables** in the header',
        '**`foreach` is usually nicer for collections** — tease Lesson 3',
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The shape',
    },
    {
      kind: 'paragraph',
      text:
        'Three semicolon-separated parts inside the parentheses: **init**, **condition**, **update**. Then a body.',
    },
    {
      kind: 'code',
      filename: 'count-to-five.cs',
      code: `for (int i = 1; i <= 5; i++)
{
    Console.WriteLine($"i = {i}");
}`,
    },
    {
      kind: 'output',
      output: `i = 1
i = 2
i = 3
i = 4
i = 5`,
    },
    {
      kind: 'paragraph',
      text:
        'Execution order: **init once → check condition → run body → update → check condition →** body → update → … until condition becomes false.',
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The canonical pattern: walking indices 0 to length-1',
    },
    {
      kind: 'code',
      filename: 'walk-array.cs',
      code: `int[] scores = { 85, 92, 78, 95, 88 };

for (int i = 0; i < scores.Length; i++)
{
    Console.WriteLine($"Index {i}: {scores[i]}");
}`,
    },
    {
      kind: 'output',
      output: `Index 0: 85
Index 1: 92
Index 2: 78
Index 3: 95
Index 4: 88`,
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'Off-by-one — the classic bug',
      text:
        "**`<` with `Length` and `0`-indexed** is the safe combination. `<= scores.Length` would crash on the last iteration — there is no index `5` for an array of length `5`. **Always use `<` and start at `0`.**",
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Multiple example variations',
    },
    {
      kind: 'examples',
      intro: 'Six common shapes — each one solves a different problem:',
      examples: [
        {
          label: 'Count up: 1 to 10',
          code: `for (int i = 1; i <= 10; i++)
{
    Console.Write($"{i} ");
}
// 1 2 3 4 5 6 7 8 9 10`,
        },
        {
          label: 'Count down: 10 to 1',
          code: `for (int i = 10; i >= 1; i--)
{
    Console.Write($"{i} ");
}
// 10 9 8 7 6 5 4 3 2 1`,
        },
        {
          label: 'Step by 2: evens',
          code: `for (int i = 0; i <= 20; i += 2)
{
    Console.Write($"{i} ");
}
// 0 2 4 6 8 10 12 14 16 18 20`,
        },
        {
          label: 'Sum first 100 integers',
          code: `int total = 0;
for (int i = 1; i <= 100; i++)
{
    total += i;
}
Console.WriteLine(total);   // 5050`,
        },
        {
          label: 'Two counters',
          code: `for (int i = 0, j = 10; i < j; i++, j--)
{
    Console.WriteLine($"i={i}, j={j}");
}
// stops when i and j meet in the middle`,
        },
        {
          label: 'Infinite — break on condition',
          code: `for (int i = 0; ; i++)        // no condition = forever
{
    if (i * i > 1000) break;
    Console.Write($"{i} ");
}`,
        },
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: '`break`, `continue`, and the update',
    },
    {
      kind: 'paragraph',
      text:
        'Inside a `for` loop, **`continue` still runs the update**. That is a difference from `while`, where `continue` jumps straight to the condition check.',
    },
    {
      kind: 'code',
      code: `// Print odd numbers 1 to 10
for (int i = 1; i <= 10; i++)
{
    if (i % 2 == 0) continue;   // skip evens — i++ still runs
    Console.Write($"{i} ");
}
// 1 3 5 7 9`,
    },

    {
      kind: 'heading',
      level: 2,
      text: 'When NOT to use `for`',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Use `for` when…',
          items: [
            'You **know** the iteration count (or bounds)',
            'You need the **index** during the loop',
            'You step by something other than 1',
          ],
        },
        {
          title: 'Prefer `foreach` (Lesson 3) when…',
          items: [
            'You just need each **element** of a collection',
            'You do not need the index',
            'The collection is not random-access (LINQ result, set, dictionary)',
          ],
        },
      ],
    },

    {
      kind: 'keyTakeaways',
      items: [
        '**`for (init; condition; update)`** — init once, then loop until condition is false',
        'Canonical array walk: **`for (int i = 0; i < arr.Length; i++)`** — `<` and `0`-indexed',
        'Off-by-one is the most common loop bug — **`<=` with `Length`** crashes',
        '**Step** can be anything: `i++`, `i--`, `i += 2`, `i *= 2`',
        'Inside `for`, **`continue` still runs the update step** — different from `while`',
        'If you do not need the **index**, **`foreach`** is usually cleaner',
      ],
    },
  ],

  questions: [
    {
      id: 'q1',
      kind: 'predict',
      prompt: 'How many lines does this print?',
      code: `for (int i = 0; i < 5; i++)
{
    Console.WriteLine(i);
}`,
      options: [
        { label: '4' },
        { label: '5', correct: true },
        { label: '6' },
        { label: 'Infinite' },
      ],
      explanation:
        '`i` takes values 0, 1, 2, 3, 4 — five iterations. The loop stops when `i = 5` and the condition `5 < 5` is false. This pattern (`i < n`) gives exactly `n` iterations.',
    },
    {
      id: 'q2',
      kind: 'predict',
      prompt: 'What does this print?',
      code: `int[] a = { 10, 20, 30, 40 };
for (int i = 0; i < a.Length; i += 2)
{
    Console.Write($"{a[i]} ");
}`,
      options: [
        { label: '10 20 30 40 ' },
        { label: '10 30 ', correct: true },
        { label: '20 40 ' },
        { label: '10 20 ' },
      ],
      explanation:
        '`i` steps by 2: i=0 prints `a[0]=10`, i=2 prints `a[2]=30`, i=4 is not `< 4` so the loop ends. Only the **even indices** are printed.',
    },
    {
      id: 'q3',
      kind: 'predict',
      prompt:
        'What happens with this code?',
      code: `int[] a = { 10, 20, 30, 40, 50 };
for (int i = 0; i <= a.Length; i++)
{
    Console.WriteLine(a[i]);
}`,
      options: [
        { label: 'Prints `a[0]` through `a[4]`' },
        {
          label: 'Throws IndexOutOfRangeException at runtime',
          correct: true,
        },
        { label: 'Prints `a[0]` through `a[3]`' },
        { label: 'Compile error' },
      ],
      explanation:
        '`for (int i = 0; i <= a.Length; i++)` — using `<=` instead of `<` means `i` reaches `a.Length`. Arrays are 0-indexed, so the **last valid index is `Length - 1`**. Accessing `a[a.Length]` throws `IndexOutOfRangeException`. Classic off-by-one bug.',
    },
  ],

  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Multiplication table',
      prompt:
        "Print the multiplication table for 7 — from `7 × 1 = 7` to `7 × 10 = 70`. One line per product.",
      hints: [
        '`for (int i = 1; i <= 10; i++) { Console.WriteLine($"7 × {i} = {7 * i}"); }`',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Sum of even numbers under 100',
      prompt:
        'Use a single `for` loop to sum all even numbers from 0 to 99 (inclusive of 0, exclusive of 100). Print the total.',
      hints: [
        '`for (int i = 0; i < 100; i += 2)` — step by 2.',
        'Or `if (i % 2 != 0) continue;` with `i++` — same result, more code.',
      ],
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'Reverse a string in place',
      prompt:
        "Read a string. Print it reversed using a `for` loop that walks from `str.Length - 1` down to `0` and prints each character. Do NOT use `Array.Reverse` or LINQ.",
      hints: [
        '`for (int i = s.Length - 1; i >= 0; i--) { Console.Write(s[i]); }`',
        'A `string` is indexable like an array.',
      ],
    },
  ],
};
