import type { Lesson } from '@/data/types';

export const lesson04: Lesson = {
  slug: 'switch-statement',
  number: 4,
  title: 'switch Statement',
  objective:
    'Handle many discrete cases cleanly with the classic `switch` statement — and know the three things every C# developer forgets at least once.',
  blocks: [
    {
      kind: 'lead',
      text:
        'When an `if/else if` chain grows past 3 or 4 cases, **`switch`** is the right tool. It branches on the value of one expression — typically a number, a string, or an enum. The compiler can also optimize it into a jump table for speed.',
    },
    {
      kind: 'teachingNotes',
      items: [
        '**Every `case` must end with `break` or `return`** — fall-through is a compile error in C#',
        '**`default` is optional but recommended** — the safety net for unexpected values',
        'Cases can be **stacked** to share a body (e.g. `case 1: case 2: ...`) — show this early',
        '`switch` works on **`int`, `char`, `string`, `enum`, and constants** — not arbitrary expressions',
        'Tease **switch expressions** as the modern replacement — Lesson 5',
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The basic shape',
    },
    {
      kind: 'code',
      filename: 'day-of-week.cs',
      code: `int day = 3;

switch (day)
{
    case 1:
        Console.WriteLine("Monday");
        break;
    case 2:
        Console.WriteLine("Tuesday");
        break;
    case 3:
        Console.WriteLine("Wednesday");
        break;
    default:
        Console.WriteLine("Unknown");
        break;
}`,
    },
    {
      kind: 'output',
      output: `Wednesday`,
    },
    {
      kind: 'paragraph',
      text:
        'C# evaluates the **`switch (expression)`**, finds the matching `case` constant, runs that block until it hits `break` (or `return`, or `throw`), and exits. If no case matches, **`default`** runs.',
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'No silent fall-through',
      text:
        "C# does not let you fall from one case into the next like C or Java. Every case must end with **`break`, `return`, `throw`, or `goto case`**. Forgetting the `break` is a compile error — not a runtime bug — which is one of C#'s safer design choices.",
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Stacked cases — share a body',
    },
    {
      kind: 'code',
      filename: 'weekday-weekend.cs',
      code: `int day = 6;

switch (day)
{
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
        Console.WriteLine("Weekday");
        break;
    case 6:
    case 7:
        Console.WriteLine("Weekend");
        break;
    default:
        Console.WriteLine("Invalid");
        break;
}`,
    },
    {
      kind: 'output',
      output: `Weekend`,
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Switching on strings',
    },
    {
      kind: 'code',
      filename: 'commands.cs',
      code: `string command = Console.ReadLine()?.ToLower() ?? "";

switch (command)
{
    case "start":
        Console.WriteLine("Starting...");
        break;
    case "stop":
        Console.WriteLine("Stopping...");
        break;
    case "help":
    case "?":
        Console.WriteLine("Commands: start, stop, help");
        break;
    default:
        Console.WriteLine($"Unknown: {command}");
        break;
}`,
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Normalize the input first',
      text:
        'Calling `.ToLower()` before the `switch` means **`"Start"`, `"START"`, and `"start"` all match the same case**. Without it, only the exact lowercase string would match. This is the cheapest input-cleanup you can do.',
    },

    {
      kind: 'heading',
      level: 2,
      text: 'when — adding a condition to a case',
    },
    {
      kind: 'paragraph',
      text:
        'Since C# 7, a case can attach a **`when`** filter — extra logic that must also be true for the case to match. Useful when the value alone is not enough.',
    },
    {
      kind: 'code',
      code: `int score = 85;

switch (score)
{
    case int n when n >= 90:
        Console.WriteLine("A");
        break;
    case int n when n >= 80:
        Console.WriteLine("B");
        break;
    case int n when n >= 70:
        Console.WriteLine("C");
        break;
    default:
        Console.WriteLine("F");
        break;
}`,
    },
    {
      kind: 'output',
      output: `B`,
    },

    {
      kind: 'heading',
      level: 2,
      text: 'switch vs if/else — when to choose which',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Use `switch` when…',
          items: [
            'You compare **one expression** against **many constant values**',
            'Cases are roughly equally likely',
            'You may want to **stack** several values to share a body',
            'The compiler can optimize to a jump table (subtle perf win on long chains)',
          ],
        },
        {
          title: 'Stay with `if / else if` when…',
          items: [
            'Conditions involve **different variables** (`x > 5 || y < 3`)',
            'Conditions involve **ranges** with complex math',
            'Only **two or three** cases — `if/else` is shorter',
            'You need the cleaner ternary form for value selection',
          ],
        },
      ],
    },

    {
      kind: 'keyTakeaways',
      items: [
        '**`switch` branches on one expression** — `int`, `char`, `string`, enum, etc.',
        'Each case ends with **`break`**, `return`, `throw`, or `goto case` — no silent fall-through',
        '**Stack cases** with empty bodies to share one block',
        '**`default`** runs when no case matches — include it as a safety net',
        '**`when`** clauses add a condition to a case — useful for ranges',
        'Prefer `switch` when comparing one value to **many constants**; stay with `if/else` for complex conditions',
      ],
    },
  ],

  questions: [
    {
      id: 'q1',
      kind: 'predict',
      prompt: 'What does this print?',
      code: `int day = 5;

switch (day)
{
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
        Console.WriteLine("Weekday");
        break;
    case 6:
    case 7:
        Console.WriteLine("Weekend");
        break;
    default:
        Console.WriteLine("?");
        break;
}`,
      options: [
        { label: 'Weekday', correct: true },
        { label: 'Weekend' },
        { label: '?' },
        { label: 'Weekday\\nWeekend' },
      ],
      explanation:
        '`day = 5` matches `case 5`. The cases `1, 2, 3, 4` above are stacked with empty bodies — execution falls into the shared body that prints `"Weekday"`, then `break` exits.',
    },
    {
      id: 'q2',
      kind: 'mcq',
      prompt: 'What happens if you remove the `break` from `case 1` in a C# `switch`?',
      options: [
        { label: 'It falls through to case 2 silently.' },
        { label: 'It causes a compile error.', correct: true },
        { label: 'It throws an exception at runtime.' },
        { label: 'Nothing — break is optional.' },
      ],
      explanation:
        'Unlike C and Java, C# **forbids implicit fall-through**. The compiler issues error **CS0163**: *"Control cannot fall through from one case label to another"*. This prevents the entire class of fall-through bugs.',
    },
    {
      id: 'q3',
      kind: 'mcq',
      prompt: "Which `switch` value type is **not** allowed?",
      options: [
        { label: '`int`' },
        { label: '`string`' },
        { label: '`enum`' },
        { label: '`double` with non-constant case values', correct: true },
      ],
      explanation:
        'You CAN switch on `double`, but each case must be a **constant**. Switching on a value where cases are non-constant expressions (`case someVariable:`) won\'t work. For ranges or computed conditions, use `when` clauses or `switch` expressions (next lesson).',
    },
  ],

  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Day name from number',
      prompt:
        'Read an integer 1-7. Print the matching day name (`Monday` through `Sunday`). For any other number, print `Invalid day`. Use a single `switch`.',
      hints: [
        'Seven `case` blocks plus `default`.',
        'Each ends with `break`.',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Calculator with operators',
      prompt:
        'Read two numbers and an operator (`+`, `-`, `*`, `/`). Use a `switch` on the operator to compute and print the result. For unknown operators, print an error. For division, watch out for divide-by-zero.',
      hints: [
        '`switch` on the operator character — `case "+":`, `case "-":`, etc.',
        'In the `/` case, check `if (b == 0) { Console.WriteLine("Cannot divide by zero"); break; }`.',
      ],
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'Grade with `when`',
      prompt:
        'Read a score (0-100). Use a single `switch` with `when` clauses to classify it as A (90+), B (80+), C (70+), D (60+), F (below 60), or `Invalid` (out of range).',
      hints: [
        '`case int n when n >= 90:` and so on.',
        'Make `Invalid` the `default` or use `when` for `< 0 || > 100`.',
      ],
    },
  ],
};
