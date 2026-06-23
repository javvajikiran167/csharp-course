import type { Lesson } from '@/data/types';

export const lesson02: Lesson = {
  slug: 'if-else',
  number: 2,
  title: 'if / else / else if',
  objective:
    'Branch program execution based on conditions — the most common control structure in every C# program.',
  blocks: [
    {
      kind: 'lead',
      text:
        '`if` runs a block when a condition is true. `else` runs an alternative. `else if` chains conditions. These three keywords cover roughly 80% of decision logic you will ever write.',
    },
    {
      kind: 'teachingNotes',
      items: [
        '**Always use braces**, even for single-statement bodies — the Apple SSL bug ("goto fail") still haunts the industry',
        'Walk through if → if/else → if/else if/else in **that order**, each one a small step up',
        '**Order of `else if` matters** — first matching branch wins. Show a wrong order to drive this home',
        '**Avoid deep nesting** — flat is better than nested. Tease early returns',
        'Mention `return` early-exits the method; useful for guard clauses',
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The simplest form: `if`',
    },
    {
      kind: 'paragraph',
      text:
        'An `if` evaluates a boolean expression. If `true`, the body runs. If `false`, the body is skipped and execution continues after it.',
    },
    {
      kind: 'code',
      filename: 'simple-if.cs',
      code: `int age = 21;

if (age >= 18)
{
    Console.WriteLine("You may enter.");
}

Console.WriteLine("Welcome to the building.");`,
    },
    {
      kind: 'output',
      output: `You may enter.
Welcome to the building.`,
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Always use braces',
      text:
        'C# lets you write `if (x) DoOne();` without braces — but every senior engineer will tell you to **always brace**. A missing brace caused [Apple\'s 2014 "goto fail" SSL bug](https://www.imperialviolet.org/2014/02/22/applebug.html). Braces are free.',
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Two-way: `if` / `else`',
    },
    {
      kind: 'code',
      filename: 'if-else.cs',
      code: `int score = 73;

if (score >= 60)
{
    Console.WriteLine("Passed");
}
else
{
    Console.WriteLine("Failed");
}`,
    },
    {
      kind: 'output',
      output: `Passed`,
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Many-way: `if` / `else if` / `else`',
    },
    {
      kind: 'paragraph',
      text:
        'For more than two cases, chain with `else if`. **The first matching branch wins** — everything after it is skipped, even if it would also match.',
    },
    {
      kind: 'code',
      filename: 'grades.cs',
      code: `int score = 73;
string grade;

if (score >= 90)
{
    grade = "A";
}
else if (score >= 80)
{
    grade = "B";
}
else if (score >= 70)
{
    grade = "C";
}
else if (score >= 60)
{
    grade = "D";
}
else
{
    grade = "F";
}

Console.WriteLine($"Grade: {grade}");`,
    },
    {
      kind: 'output',
      output: `Grade: C`,
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'Order matters',
      text:
        'If you reversed the chain — checked `>= 60` first — every passing score would get a `D`. **The first matching condition wins.** Always order from most specific to least specific.',
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Multiple variations — same logic, different style',
    },
    {
      kind: 'examples',
      intro: 'Four ways to express "is this user allowed to enter":',
      examples: [
        {
          label: 'Simple if/else',
          code: `int age = 21;
if (age >= 18)
{
    Console.WriteLine("Allowed");
}
else
{
    Console.WriteLine("Denied");
}`,
        },
        {
          label: 'Early return (cleaner in methods)',
          code: `static string CheckEntry(int age)
{
    if (age < 18) return "Denied";
    return "Allowed";
}
Console.WriteLine(CheckEntry(21));`,
        },
        {
          label: 'Guard clause + main path',
          code: `static string CheckEntry(int age)
{
    if (age < 0) return "Invalid age";
    if (age < 18) return "Denied";
    return "Allowed";
}
Console.WriteLine(CheckEntry(21));`,
        },
        {
          label: 'Boolean variable',
          code: `int age = 21;
bool allowed = age >= 18;
Console.WriteLine(allowed ? "Allowed" : "Denied");`,
        },
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Avoid the pyramid of doom',
    },
    {
      kind: 'paragraph',
      text:
        '**Nested ifs that drift to the right** are a code smell. They are hard to read, hard to test, and where bugs hide. Use **guard clauses** to flatten them.',
    },
    {
      kind: 'code',
      filename: 'before.cs',
      code: `// ❌ Hard to follow — eyes drift right
static string Discount(int age, bool isMember, double total)
{
    if (age > 0)
    {
        if (total > 0)
        {
            if (isMember)
            {
                return total > 100 ? "20%" : "10%";
            }
            else
            {
                return "0%";
            }
        }
    }
    return "Invalid";
}`,
    },
    {
      kind: 'code',
      filename: 'after.cs',
      code: `// ✅ Flat with guard clauses
static string Discount(int age, bool isMember, double total)
{
    if (age <= 0)   return "Invalid";
    if (total <= 0) return "Invalid";
    if (!isMember)  return "0%";
    return total > 100 ? "20%" : "10%";
}`,
    },

    {
      kind: 'keyTakeaways',
      items: [
        '`if (condition) { ... }` runs the body when the condition is `true`',
        '**Always use braces**, even for one-line bodies — prevents real-world bugs',
        '`else if` chains conditions; **the first matching branch wins** — order matters',
        '**Guard clauses with early returns flatten nested ifs** — easier to read and test',
        'For two-way checks that return values, **prefer the ternary `? :`** (next lesson)',
      ],
    },
  ],

  questions: [
    {
      id: 'q1',
      kind: 'predict',
      prompt: 'What does this print?',
      code: `int score = 85;

if (score >= 50)
{
    Console.WriteLine("Pass");
}
else if (score >= 80)
{
    Console.WriteLine("Excellent");
}
else
{
    Console.WriteLine("Fail");
}`,
      options: [
        { label: 'Pass', correct: true },
        { label: 'Excellent' },
        { label: 'Pass\\nExcellent' },
        { label: 'Fail' },
      ],
      explanation:
        '`85 >= 50` is true, so the first branch matches — and **the first matching branch wins**. The `>= 80` branch never executes even though it would also be true. Reorder to `>= 80` first if you want the more specific case to win.',
    },
    {
      id: 'q2',
      kind: 'mcq',
      prompt:
        "Which of these is the strongest reason to use guard clauses (early `return`) instead of nested `if` blocks?",
      options: [
        { label: 'Guard clauses are faster at runtime.' },
        {
          label: 'Guard clauses keep the happy path flat and readable, easier to maintain.',
          correct: true,
        },
        { label: 'Nested ifs are a compile warning.' },
        { label: 'Guard clauses use less memory.' },
      ],
      explanation:
        'Performance is identical. The win is **readability** — the main success path stays at one indentation level, and each pre-condition exits immediately. This is one of the most common style-related interview discussions.',
    },
    {
      id: 'q3',
      kind: 'predict',
      prompt: "What's wrong with this code?",
      code: `int age = 15;
if (age >= 18)
    Console.WriteLine("Adult");
    Console.WriteLine("Welcome");`,
      options: [
        { label: 'Compile error — missing braces' },
        {
          label: 'Always prints "Welcome", even for age 15 — only the first line is inside the if',
          correct: true,
        },
        { label: 'Prints both lines for any age' },
        { label: 'Prints nothing' },
      ],
      explanation:
        'Without braces, only the **next statement** is inside the `if`. The indentation is misleading — `Console.WriteLine("Welcome")` always runs. This is the kind of bug braces prevent.',
    },
  ],

  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'FizzBuzz mini',
      prompt:
        "Read a number. If it's divisible by 3, print `Fizz`. If divisible by 5, print `Buzz`. If divisible by both, print `FizzBuzz`. Otherwise print the number. Use `if/else if/else`.",
      hints: [
        '**Check the both case first** — that\'s the most specific.',
        '`n % 3 == 0 && n % 5 == 0` for "both"; `n % 15 == 0` works too.',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Grade calculator with guard clauses',
      prompt:
        'Read a score (0-100). If the input is outside that range, print `Invalid score` and exit. Otherwise print the letter grade (A 90+, B 80+, C 70+, D 60+, F below). Use **guard clauses** for the invalid case, not nested ifs.',
      hints: [
        '`if (score < 0 || score > 100) { Console.WriteLine("..."); return; }` — guard first, then the grade chain.',
      ],
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'Triangle classifier',
      prompt:
        "Read three side lengths. First check whether they form a valid triangle (sum of any two > the third). If invalid, print `Not a triangle`. If valid, classify as `Equilateral` (all three equal), `Isosceles` (exactly two equal), or `Scalene` (none equal).",
      hints: [
        'Validity check is a single bool: `a + b > c && a + c > b && b + c > a`.',
        'For classification, use `else if` from most specific (equilateral) to least specific (scalene).',
      ],
    },
  ],
};
