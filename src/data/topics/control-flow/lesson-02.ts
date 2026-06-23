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
};
