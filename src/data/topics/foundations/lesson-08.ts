import type { Lesson } from '@/data/types';

export const lesson08: Lesson = {
  slug: 'style',
  number: 8,
  title: 'Constants & Comments',
  objective: 'Mark unchanging values with `const` and write comments that earn their keep — the two habits that immediately raise code quality.',
  blocks: [
    {
      kind: 'lead',
      text:
        "Code is read ten times more than it is written. Two habits make the biggest difference in readability: replacing magic numbers with named constants, and writing comments that explain *why*. Full naming conventions get their own topic later — once you've met methods and classes — but these two basics belong here.",
    },
    {
      kind: 'teachingNotes',
      items: [
        '**Magic numbers are the enemy** — `const` them and name them',
        'The **golden comment rule**: explain WHY, never WHAT — the code already shows what',
        '**`const` vs `readonly`** is an interview classic — point students to challenge 3',
        'Mention naming briefly — full conventions topic comes after Methods',
        'Comments that say "what" are the most common code review reject',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Constants',
    },
    {
      kind: 'paragraph',
      text:
        'Some values never change inside a program: the tax rate, the maximum number of retries, the value of π. Mark them with `const` so the compiler enforces that nobody overwrites them by accident.',
    },
    {
      kind: 'code',
      code: `const decimal TaxRate = 0.08m;
const int MaxRetries = 3;
const double Pi = 3.14159265;

// TaxRate = 0.10m;   ← compile error: a const cannot be reassigned`,
    },
    {
      kind: 'paragraph',
      text:
        'Constants are also a documentation tool. A magic number `0.08` in the middle of code tells the reader nothing. `TaxRate` tells them everything.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Comments',
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'The rule for comments',
      text:
        'Write comments to explain **why**, never **what**. If the code says `x = x + 1`, a comment saying *"add one to x"* is noise. A comment saying *"compensate for the off-by-one in the SDK"* is gold.',
    },
    {
      kind: 'code',
      code: `// ❌ Says WHAT — useless, the code already says this
i = i + 1;     // increment i

// ✅ Says WHY — explains a non-obvious decision
i = i + 1;     // skip the header row in the CSV`,
    },
    {
      kind: 'paragraph',
      text:
        'Comment syntax in C#:',
    },
    {
      kind: 'list',
      items: [
        '`// single line` — most comments',
        '`/* block comment */` — rare in C#; people use multiple `//` lines instead',
        '`/// XML doc comment` — auto-generates documentation for libraries (you\'ll meet this later)',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Naming — a quick taste',
    },
    {
      kind: 'paragraph',
      text:
        "Two rules every C# developer follows for variables right now: **use `camelCase` for local variables** (`userScore`, `totalAmount`), and **make the name reveal intent** (`userScore` beats `x`). The full set of naming conventions — for classes, methods, properties, interfaces, generics — gets its own topic later in the course, once you've met methods and classes and can put the rules in context.",
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'For now: names reveal intent',
      text:
        'Good: `userScore`, `temperatureCelsius`, `isLoggedIn`. Bad: `x`, `temp`, `flag`. Ask yourself: if someone read this code tomorrow with zero context, would the name be enough?',
    },
    {
      kind: 'keyTakeaways',
      items: [
        '**`const`** for compile-time constants — values that never change at runtime',
        'Comments should explain **WHY**, never **WHAT** — the code already shows what',
        'Local variables use **`camelCase`** — `userScore`, `totalAmount`',
        '**Names should reveal intent** — `userScore` beats `x`, every time',
        'Full naming conventions (classes, methods, interfaces, generics) come in a **dedicated topic later in the course**',
      ],
    },
  ],
  questions: [
    {
      id: 'q1',
      kind: 'mcq',
      prompt:
        'You have a value `0.075` used in three places in your code as a sales-tax rate. What is the best refactor?',
      options: [
        { label: 'Leave it — it\'s only a number.' },
        {
          label: 'Replace each occurrence with `const decimal SalesTaxRate = 0.075m;` declared once at the top.',
          correct: true,
        },
        { label: 'Wrap each `0.075` in a comment that says "tax rate".' },
        { label: 'Use a `string` for clarity.' },
      ],
      explanation:
        'A named constant **removes the magic number**, gives meaning to the value, and creates a single place to change the rate when it updates. Note the `m` suffix because it\'s money — use `decimal`, not `double`.',
    },
    {
      id: 'q2',
      kind: 'mcq',
      prompt: 'Which is the best comment for this line: `quantity *= 1.18;`',
      options: [
        { label: '`// multiply quantity by 1.18`' },
        { label: '`// add 18% VAT`', correct: true },
        { label: '`// math`' },
        { label: 'No comment needed.' },
      ],
      explanation:
        'The first one parrots the code. The right comment explains *why* — that `1.18` represents an 18% tax. A magic number with no meaning is much worse than a slightly slow line of code.',
    },
    {
      id: 'q3',
      kind: 'mcq',
      prompt:
        'Which of these is a value that should be made into a `const`?',
      options: [
        { label: "A user's current age — changes each year" },
        {
          label: 'The mathematical value of Pi to 5 decimal places',
          correct: true,
        },
        { label: "A user's bank balance" },
        { label: 'The number of items in a shopping cart' },
      ],
      explanation:
        "`const` is for values that **never change at runtime**. Pi is a perfect example — `const double Pi = 3.14159;`. Things that vary per user or per session (age, balance, cart contents) are regular variables, not constants.",
    },
  ],

  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Refactor magic numbers',
      prompt:
        "Take this code and refactor it so every magic number is a named constant. Add comments where they explain *why*, not *what*.\n\n```cs\ndouble total = subtotal * 1.18;\nif (retries < 3) { /* retry */ }\nif (temperature > 100.0) { /* alert */ }\n```",
      hints: [
        'Names like `TaxRate`, `MaxRetries`, `BoilingPointCelsius`.',
        '`const` for compile-time constants. Use `decimal` if any of these are money.',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Why, not what',
      prompt:
        "Find any 10-line piece of code you wrote earlier this week (in any language). Add **one** comment that explains *why* — a non-obvious choice, a workaround, a business rule. Remove **any** comment that just restates what the code does. Notice how much shorter the file is.",
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'Constant or readonly?',
      prompt:
        "Research the difference between `const` and `readonly` in C#. Write a 5-line summary in a comment, then write a short program that uses one of each. Hint: `const` is evaluated at **compile time**; `readonly` at **runtime**. This is a top-10 interview question.",
      hints: [
        '`const` values are baked into the compiled assembly — changing them requires recompiling **every** project that references them.',
        '`readonly` values can be set in the constructor and depend on runtime data.',
      ],
    },
  ],
};
