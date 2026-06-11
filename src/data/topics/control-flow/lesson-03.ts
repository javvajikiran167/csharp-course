import type { Lesson } from '@/data/types';

export const lesson03: Lesson = {
  slug: 'ternary',
  number: 3,
  title: 'Ternary & Null-Coalescing Operators',
  objective:
    'Choose values inline with `? :` and handle nulls gracefully with `??` and `??=` — the two operators that make C# code feel modern.',
  blocks: [
    {
      kind: 'lead',
      text:
        'Two compact operators replace whole `if/else` blocks: **`condition ? a : b`** picks between two values inline; **`x ?? fallback`** picks `x` unless it is `null`. Both appear in every C# codebase.',
    },
    {
      kind: 'teachingNotes',
      items: [
        '**Ternary is an expression, not a statement** — it returns a value; use it on the right of `=`',
        'Stress: **do not nest more than one ternary deep** — readability falls off a cliff',
        'Show `??` with `string?` — it makes the null-safety story click instantly',
        '**`??=`** is interview-tested in modern C# — "assign only if null"',
        'End with side-by-side `if/else` and ternary versions of the same logic',
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The ternary operator `? :`',
    },
    {
      kind: 'paragraph',
      text:
        'Syntax: **`condition ? whenTrue : whenFalse`**. It returns one of two values. Read it as *"if condition then whenTrue else whenFalse"*.',
    },
    {
      kind: 'code',
      filename: 'ternary.cs',
      code: `int age = 21;
string message = age >= 18 ? "Adult" : "Minor";
Console.WriteLine(message);     // Adult

// The equivalent if/else — 5 lines, same result:
string m;
if (age >= 18) { m = "Adult"; } else { m = "Minor"; }`,
    },
    {
      kind: 'examples',
      intro: 'Five short ternary examples — pick the shape that fits your need:',
      examples: [
        {
          label: 'Min of two',
          code: `int a = 7, b = 12;
int min = a < b ? a : b;
Console.WriteLine(min);   // 7`,
        },
        {
          label: 'Pluralize a word',
          code: `int count = 3;
string label = count == 1 ? "item" : "items";
Console.WriteLine($"{count} {label}");`,
        },
        {
          label: 'Default with sensible fallback',
          code: `int? input = null;
int value = input.HasValue ? input.Value : 0;
Console.WriteLine(value);   // 0`,
        },
        {
          label: 'Inside string interpolation',
          code: `bool isPaid = true;
Console.WriteLine($"Status: {(isPaid ? "Paid" : "Pending")}");`,
        },
        {
          label: 'Two ternaries — readable when short',
          code: `int temp = 22;
string mood = temp < 18 ? "cold" : temp > 26 ? "hot" : "fine";
Console.WriteLine(mood);   // fine`,
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: "Don't nest more than once",
      text:
        '`a ? (b ? c : d) : e` works but reads horribly. Two `if/else` blocks are clearer. **One ternary chain is the limit** — if you need more cases, reach for `switch` (next lesson).',
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The null-coalescing operator `??`',
    },
    {
      kind: 'paragraph',
      text:
        'Returns the **left** value if it is not `null`. Returns the **right** value if it is. The single best way to write defaults.',
    },
    {
      kind: 'code',
      filename: 'null-coalesce.cs',
      code: `string? username = null;
string display = username ?? "Anonymous";
Console.WriteLine(display);   // Anonymous

string? saved = "alex_dev";
string shown = saved ?? "Anonymous";
Console.WriteLine(shown);     // alex_dev`,
    },
    {
      kind: 'examples',
      intro: 'Four common shapes for `??`:',
      examples: [
        {
          label: 'Default for a possibly-null string',
          code: `string? fromInput = Console.ReadLine();
string name = fromInput ?? "Guest";`,
        },
        {
          label: 'Chained — first non-null wins',
          code: `string? a = null;
string? b = null;
string? c = "found!";
string result = a ?? b ?? c ?? "none";
Console.WriteLine(result);  // found!`,
        },
        {
          label: 'Empty fallback for List<T>',
          code: `List<string>? items = null;
foreach (var x in items ?? new List<string>())
{
    Console.WriteLine(x);
}`,
        },
        {
          label: 'Combined with method call',
          code: `string? raw = Console.ReadLine();
int n = int.Parse(raw ?? "0");   // never null going into Parse`,
        },
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The null-coalescing **assignment** `??=`',
    },
    {
      kind: 'paragraph',
      text:
        '**`x ??= value`** assigns `value` to `x` *only if* `x` is currently `null`. Shorthand for `x = x ?? value`. Common in lazy initialization.',
    },
    {
      kind: 'code',
      code: `string? cache = null;

cache ??= "loaded from disk";   // cache is null → assigns
Console.WriteLine(cache);        // loaded from disk

cache ??= "loaded again";        // cache is NOT null → does nothing
Console.WriteLine(cache);        // loaded from disk`,
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'When to reach for which',
      text:
        '**Ternary `? :`** when you want one of two values inline. **`??`** when the only condition is "is it null". **`??=`** when you want to set a default but only if nothing was set yet. They compose — `x ?? (a > b ? a : b)` is fine.',
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The null-conditional operator `?.` (preview)',
    },
    {
      kind: 'paragraph',
      text:
        'A close relative: **`obj?.Property`** returns `null` if `obj` is `null`, otherwise reads the property. Combines beautifully with `??`. You will use it constantly once you reach OOP — here is a taste:',
    },
    {
      kind: 'code',
      code: `string? input = null;
int length = input?.Length ?? 0;     // null-safe: 0 instead of crash

Console.WriteLine(length);            // 0

string? real = "hello";
int realLen = real?.Length ?? 0;
Console.WriteLine(realLen);           // 5`,
    },

    {
      kind: 'keyTakeaways',
      items: [
        '**`condition ? a : b`** is an expression — picks between two values inline',
        '**Do not nest ternaries more than once** — readability drops sharply',
        '**`x ?? fallback`** returns `x` unless null, then returns `fallback`',
        '**`x ??= value`** assigns only when `x` is currently null — perfect for lazy init',
        '**`?.`** safely reads members on possibly-null references; combine with `??` for a default',
        'All three operators are **right-associative** — `a ?? b ?? c` evaluates `a` first, then `b`, then `c`',
      ],
    },
  ],

  questions: [
    {
      id: 'q1',
      kind: 'predict',
      prompt: 'What does this print?',
      code: `string? name = null;
string display = name ?? "Guest";
Console.WriteLine(display);`,
      options: [
        { label: 'null' },
        { label: 'Guest', correct: true },
        { label: 'Empty line' },
        { label: 'Throws NullReferenceException' },
      ],
      explanation:
        '`name` is `null`, so `??` returns the right side: `"Guest"`. No crash, no null check needed — that\'s the win.',
    },
    {
      id: 'q2',
      kind: 'predict',
      prompt: 'What does `result` equal?',
      code: `string? a = null;
string? b = "second";
string? c = "third";
string result = a ?? b ?? c;`,
      options: [
        { label: '"second"', correct: true },
        { label: '"third"' },
        { label: 'null' },
        { label: 'A combined string "secondthird"' },
      ],
      explanation:
        '`??` is **right-associative** and **short-circuits** at the first non-null. `a` is null, so check `b`; `b` is `"second"` (non-null) — return it. `c` is never evaluated.',
    },
    {
      id: 'q3',
      kind: 'mcq',
      prompt:
        "Your colleague writes `int max = a > b ? a > c ? a : c : b > c ? b : c;`. What should you suggest in code review?",
      options: [
        { label: 'Looks good — concise.' },
        {
          label: 'Refactor with `Math.Max` or an `if/else` — nested ternaries hurt readability.',
          correct: true,
        },
        { label: 'Add a comment and merge it.' },
        { label: 'Inline the values to make it shorter.' },
      ],
      explanation:
        "Nested ternaries are notorious for being write-once, read-never. Suggest `Math.Max(a, Math.Max(b, c))` or three lines of `if/else`. **One level deep is the limit** for ternaries.",
    },
  ],

  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Even/odd ternary',
      prompt:
        "Read an integer. Use a single line with `?:` to print `Even` or `Odd`.",
      hints: [
        '`Console.WriteLine(n % 2 == 0 ? "Even" : "Odd");`',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Friendly username',
      prompt:
        "Ask the user for their name. If they press Enter without typing, use `Friend` as the default — using `??` (not `if/else`). Then greet them.",
      hints: [
        '`Console.ReadLine()` returns `string?` in modern .NET.',
        '`string? typed = Console.ReadLine(); string name = string.IsNullOrWhiteSpace(typed) ? "Friend" : typed;` — combine with a ternary because `??` only catches null, not empty strings.',
      ],
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'Lazy welcome message',
      prompt:
        "Declare `string? message = null;`. Use `??=` to assign `\"Welcome\"` to it the first time, then `??=` to *try* to assign `\"Hello again\"` — show that the second assignment does nothing. Print `message` after each step.",
      hints: [
        '`??=` only assigns if the left side is currently null.',
        'Two `Console.WriteLine` calls to prove the second assignment was a no-op.',
      ],
    },
  ],
};
