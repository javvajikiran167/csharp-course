import type { Lesson } from '@/data/types';

export const lesson05: Lesson = {
  slug: 'switch-expression',
  number: 5,
  title: 'switch Expressions & Pattern Matching',
  objective:
    'Write tight, expressive branching with C# 8+ switch expressions — the modern style every real codebase has moved to.',
  blocks: [
    {
      kind: 'lead',
      text:
        "Since C# 8, `switch` is no longer just a statement — it's an **expression** that *returns a value*. Combined with pattern matching, it replaces 15-line statement switches with 5-line expressions. Job interviews ask this constantly.",
    },
    {
      kind: 'teachingNotes',
      items: [
        '**The shape is reversed**: `value switch { pattern => result, ... }` — the variable comes first',
        '`_` (discard) is the default case — omitting it on a non-exhaustive switch is a compiler *warning*, and unmatched values throw `SwitchExpressionException` at runtime',
        'Show `>=`, `<`, and tuple patterns side-by-side — three of the most-used pattern shapes',
        '**The whole expression returns a value** — assign it to a variable or `return` it',
        'Mention property patterns briefly; deep dive happens in OOP topic',
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The shape — value comes first',
    },
    {
      kind: 'paragraph',
      text:
        'In a switch **statement** you write `switch (x) { case ... }`. In a switch **expression** you write `x switch { ... }` — the value is on the left, the switch is the operator, and the whole thing returns a result.',
    },
    {
      kind: 'code',
      filename: 'switch-expression.cs',
      code: `int day = 3;

string name = day switch
{
    1 => "Monday",
    2 => "Tuesday",
    3 => "Wednesday",
    4 => "Thursday",
    5 => "Friday",
    6 => "Saturday",
    7 => "Sunday",
    _ => "Unknown"      // _ is the discard pattern — catches anything else
};

Console.WriteLine(name);   // Wednesday`,
    },
    {
      kind: 'paragraph',
      text:
        '**`_` is the default case.** The compiler tracks which values you have covered — if the arms are not exhaustive it issues a warning (CS8509), and an unmatched value throws `SwitchExpressionException` at runtime. Always include `_` (or otherwise cover every value) for open-ended types like `int` and `string`.',
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Relational patterns — ranges in a single line',
    },
    {
      kind: 'code',
      filename: 'grade.cs',
      code: `int score = 73;

string grade = score switch
{
    >= 90 => "A",
    >= 80 => "B",
    >= 70 => "C",
    >= 60 => "D",
    < 0   => throw new ArgumentException("Negative score"),
    _     => "F"
};

Console.WriteLine($"Grade: {grade}");`,
    },
    {
      kind: 'output',
      output: `Grade: C`,
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Why this is loved in interviews',
      text:
        '**Eight lines** for a five-way classification, no `break` statements, no temporary variables, and the compiler verifies exhaustiveness. Compare to a 25-line `if/else if/else if/else` chain. This is the modern style every senior C# codebase has migrated to.',
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Multiple example variations',
    },
    {
      kind: 'examples',
      intro: 'Five short switch expressions covering different patterns:',
      examples: [
        {
          label: 'Constant patterns (the simplest)',
          code: `string color = "red";
string hex = color switch
{
    "red"   => "#FF0000",
    "green" => "#00FF00",
    "blue"  => "#0000FF",
    _       => "#000000"
};`,
        },
        {
          label: 'Relational patterns',
          code: `int n = 42;
string size = n switch
{
    < 0   => "negative",
    0     => "zero",
    < 10  => "small",
    < 100 => "medium",
    _     => "large"
};`,
        },
        {
          label: 'Tuple pattern — multiple inputs',
          code: `bool isAdmin = true;
bool isPremium = false;

string tier = (isAdmin, isPremium) switch
{
    (true, _)      => "admin",
    (false, true)  => "premium",
    (false, false) => "free"
};`,
        },
        {
          label: 'Combined: relational + when',
          code: `int n = 15;
string fb = n switch
{
    var x when x % 15 == 0 => "FizzBuzz",
    var x when x % 3  == 0 => "Fizz",
    var x when x % 5  == 0 => "Buzz",
    _                       => n.ToString()
};`,
        },
        {
          label: 'Logical patterns: and / or / not (C# 9+)',
          code: `int age = 25;
string bracket = age switch
{
    < 13           => "child",
    >= 13 and < 20 => "teen",
    >= 20 and < 65 => "adult",
    _              => "senior"   // >= 65 — covers the rest, keeps the switch exhaustive
};`,
        },
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Property patterns — pulling fields out of an object',
    },
    {
      kind: 'paragraph',
      text:
        'You can match on **properties of an object** inline. This is the shape you will use most once you reach OOP — for now, here is a taste with an anonymous object:',
    },
    {
      kind: 'code',
      code: `var order = new { Total = 250, IsPriority = true };

string shipping = order switch
{
    { IsPriority: true }              => "express",
    { Total: >= 100 }                 => "free standard",
    { Total: < 100, IsPriority: false } => "paid standard",
    _                                  => "unknown"
};

Console.WriteLine(shipping);   // express`,
    },

    {
      kind: 'heading',
      level: 2,
      text: 'switch statement vs switch expression — when to use which',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Use switch **expression** when…',
          items: [
            'You want a **value** — to assign or return',
            'Each case maps an input to **one output value**',
            'No side effects inside the arms (no `Console.WriteLine` per case)',
            "You want the compiler to **enforce exhaustiveness**",
          ],
        },
        {
          title: 'Use switch **statement** when…',
          items: [
            'Each case does **multiple things** — calls methods, mutates state',
            'You need `break`/`continue` for loops or fall-through behavior',
            'You are working in older code where the team uses statements',
          ],
        },
      ],
    },

    {
      kind: 'keyTakeaways',
      items: [
        '**`value switch { pattern => result, ... }`** is an *expression* — returns a value',
        '**`_`** is the discard pattern — the default; required for non-exhaustive switches',
        '**Relational patterns** (`>=`, `<`, `>`, `<=`) make range checks one-liners',
        '**Logical patterns** combine with `and`, `or`, `not` (C# 9+)',
        '**Tuple patterns** match on multiple inputs at once — `(a, b) switch { ... }`',
        '**Property patterns** pull fields out of objects — heavy use in OOP and APIs',
        'Use the **expression** for value returns; keep the **statement** for multi-line side effects',
      ],
    },
  ],
};
