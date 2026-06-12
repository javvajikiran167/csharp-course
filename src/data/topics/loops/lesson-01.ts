import type { Lesson } from '@/data/types';

export const lesson01: Lesson = {
  slug: 'while',
  number: 1,
  title: 'while Loops',
  objective:
    'Repeat work as long as a condition holds — the most flexible loop in C# and the one to reach for when you do not know in advance how many iterations you need.',
  blocks: [
    {
      kind: 'lead',
      text:
        '**`while`** is the simplest loop in C#: *"as long as this condition is true, keep running the body."* When you do not know up-front how many iterations you need — reading until end-of-file, retrying until success, polling until ready — `while` is the natural shape.',
    },
    {
      kind: 'teachingNotes',
      items: [
        '**Three parts always**: init the counter (outside), check the condition, update inside the body — easy to forget the update and create an infinite loop',
        '**Demo an infinite loop on purpose** (then Ctrl+C) — makes the "always update" rule stick',
        'Difference from `for`: `for` packages init/condition/update; `while` keeps them separate — useful when the update is not just `i++`',
        '**`break` and `continue`** apply to all loops — introduce them here, reinforce in `for`',
        'Tease `do-while` for "always run at least once" — Lesson 4',
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The basic shape',
    },
    {
      kind: 'code',
      filename: 'count-to-five.cs',
      code: `int i = 1;
while (i <= 5)
{
    Console.WriteLine($"i = {i}");
    i++;                    // ← the update is YOUR responsibility
}
Console.WriteLine("Done.");`,
    },
    {
      kind: 'output',
      output: `i = 1
i = 2
i = 3
i = 4
i = 5
Done.`,
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'The infinite-loop trap',
      text:
        'If you **forget to update the loop variable** (or the update never makes the condition false), the loop runs forever. Press **Ctrl+C** in the terminal to kill it. Every C# developer creates an infinite loop at least once — it is a rite of passage.',
    },

    {
      kind: 'heading',
      level: 2,
      text: 'When `while` is the right shape',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Use `while` when…',
          items: [
            'You **do not know in advance** how many iterations are needed',
            'The condition depends on **runtime state** — user input, network, file end',
            'You want to **wait until something happens** — polling, retrying',
            'The update is **not a simple counter** — multiple variables advance',
          ],
        },
        {
          title: 'Prefer `for` when…',
          items: [
            'You **know the count** up-front (1 to 10, 0 to length-1)',
            'You want **init + condition + update** in one tight header',
            'Iterating over an **index** to access an array',
          ],
        },
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Variations — five common shapes',
    },
    {
      kind: 'examples',
      intro: 'Each one is a real-world pattern you will write:',
      examples: [
        {
          label: 'Count down',
          code: `int countdown = 5;
while (countdown > 0)
{
    Console.WriteLine(countdown);
    countdown--;
}
Console.WriteLine("Liftoff!");`,
        },
        {
          label: 'Read until valid input',
          code: `int age;
while (!int.TryParse(Console.ReadLine(), out age))
{
    Console.Write("Not a number. Try again: ");
}
Console.WriteLine($"Got age {age}");`,
        },
        {
          label: 'Accumulator — sum until total exceeds N',
          code: `int total = 0;
int n = 1;
while (total < 100)
{
    total += n;
    n++;
}
Console.WriteLine($"Stopped at n={n - 1}, total={total}");
// Stopped at n=14, total=105 — overshoots 100`,
        },
        {
          label: 'Two variables advancing — Fibonacci',
          code: `int a = 0, b = 1;
while (a < 50)
{
    Console.Write($"{a} ");
    int temp = a + b;
    a = b;
    b = temp;
}
// 0 1 1 2 3 5 8 13 21 34`,
        },
        {
          label: 'Endless service loop',
          code: `while (true)
{
    Console.Write("> ");
    string? line = Console.ReadLine();
    if (line == "exit") break;
    Console.WriteLine($"Echo: {line}");
}`,
        },
      ],
    },

    {
      kind: 'callout',
      tone: 'note',
      title: 'The condition is checked only at the top',
      text:
        'A `while` loop does **not** stop the instant its condition becomes false — the condition is tested **only at the top of each iteration**. If it goes false halfway through the body, the rest of the body still runs and the loop exits at the *next* check. That is why the accumulator above stops at `total=105`, not exactly `100`: it adds `n`, the body finishes, and only then does `total < 100` fail. The check happens *between* iterations, not continuously.',
    },

    {
      kind: 'heading',
      level: 2,
      text: '`break` and `continue` — early exits',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: '`break`',
          items: [
            '**Exits the entire loop immediately**',
            'Useful for "we found what we needed"',
            "Exits only the **innermost** loop if nested",
          ],
        },
        {
          title: '`continue`',
          items: [
            '**Skips the rest of the current iteration**, goes back to the condition check',
            'Useful for "skip this one, keep going"',
            'In `for`, the update still runs after `continue`',
          ],
        },
      ],
    },
    {
      kind: 'code',
      filename: 'break-continue.cs',
      code: `int i = 0;
while (i < 10)
{
    i++;

    if (i % 2 == 0) continue;   // skip evens
    if (i == 7)     break;      // stop at 7

    Console.WriteLine(i);
}
// Output: 1, 3, 5`,
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Infinite loop + `break` — a legitimate pattern',
    },
    {
      kind: 'paragraph',
      text:
        '**`while (true) { ... break; }`** is not a bug — it is a common idiom for "loop forever until we explicitly decide to stop". REPL prompts, event-driven loops, and retry-with-backoff often use it.',
    },
    {
      kind: 'code',
      code: `int attempt = 0;
while (true)
{
    attempt++;
    Console.WriteLine($"Attempt {attempt}...");

    bool success = TryConnect();
    if (success) break;

    if (attempt >= 5)
    {
        Console.WriteLine("Giving up.");
        break;
    }
}

static bool TryConnect() => Random.Shared.Next(0, 3) == 0;`,
    },

    {
      kind: 'keyTakeaways',
      items: [
        '`while (condition) { body }` runs the body **as long as condition is true** — checked before each iteration',
        '**You** are responsible for updating the condition variable — forgetting it = infinite loop',
        'Reach for `while` when **the iteration count is unknown in advance**',
        '**`break`** exits the loop; **`continue`** skips to the next iteration',
        '**`while (true) { ... break; }`** is a legitimate idiom for event/retry loops',
      ],
    },
  ],

  questions: [
    {
      id: 'q1',
      kind: 'predict',
      prompt: 'What does this print?',
      code: `int i = 0;
while (i < 5)
{
    Console.Write(i);
    i += 2;
}`,
      options: [
        { label: '012345' },
        { label: '024', correct: true },
        { label: '12345' },
        { label: 'Infinite loop' },
      ],
      explanation:
        '`i` starts at 0, prints 0, becomes 2. Prints 2, becomes 4. Prints 4, becomes 6. `6 < 5` is false → loop ends. Output: `024`.',
    },
    {
      id: 'q2',
      kind: 'predict',
      prompt: 'What happens when you run this?',
      code: `int i = 0;
while (i < 5)
{
    Console.WriteLine(i);
}`,
      options: [
        { label: 'Compiles and prints `0` once' },
        {
          label: 'Compiles and runs forever (infinite loop)',
          correct: true,
        },
        { label: 'Compile error — missing update' },
        { label: 'Runtime exception' },
      ],
      explanation:
        '`int i = 0; while (i < 5) { Console.WriteLine(i); }` — without `i++` or any update, the condition `i < 5` stays true forever. C# compiles it fine; the program hangs. Press Ctrl+C in the terminal.',
    },
    {
      id: 'q3',
      kind: 'predict',
      prompt: 'What does this print?',
      code: `int i = 0;
while (i < 10)
{
    i++;
    if (i % 3 == 0) continue;
    if (i > 6) break;
    Console.Write($"{i} ");
}`,
      options: [
        { label: '1 2 4 5 ', correct: true },
        { label: '1 2 4 5 6 7 8 9 10 ' },
        { label: '3 6 9 ' },
        { label: '1 2 4 5 7 ' },
      ],
      explanation:
        'i=1: print 1. i=2: print 2. i=3: `continue` (skip). i=4: print 4. i=5: print 5. i=6: `continue` (skip). i=7: `i > 6` → `break`. Result: `1 2 4 5 `.',
    },
  ],

  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Sum 1 to 100',
      prompt:
        'Use a `while` loop to sum all integers from 1 to 100. Print the result. (Verify: the answer is 5,050.)',
      hints: [
        '`int total = 0; int i = 1; while (i <= 100) { total += i; i++; }`',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Input until valid',
      prompt:
        'Ask the user for an age. Keep asking until they enter a valid integer between 0 and 120. Use `while` + `int.TryParse`.',
      hints: [
        '`while (!int.TryParse(input, out int age) || age < 0 || age > 120)` — combine with `||`.',
        'Read input inside the loop or at the top with `do-while` (Lesson 4).',
      ],
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'Collatz sequence',
      prompt:
        "Start with any positive integer `n`. Repeatedly apply the rule:\n• if `n` is even, `n = n / 2`\n• if `n` is odd, `n = 3 * n + 1`\nUntil `n == 1`. Print each value. Count how many steps it took.\n\n(The Collatz conjecture says every starting number eventually reaches 1 — an unsolved math problem. Try 27 — it takes 111 steps.)",
      hints: [
        '`while (n != 1) { if (n % 2 == 0) n /= 2; else n = 3 * n + 1; steps++; Console.WriteLine(n); }`',
      ],
    },
  ],
};
