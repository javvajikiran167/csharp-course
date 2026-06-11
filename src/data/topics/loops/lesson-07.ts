import type { Lesson } from '@/data/types';

export const lesson07: Lesson = {
  slug: 'mini-project-loops',
  number: 7,
  title: 'Mini-Project — FizzBuzz & Multiplication Table',
  objective:
    'Apply every loop concept — `for`, `while`, `foreach`, `break`, `continue`, nested loops — in two classic interview warm-up programs.',
  blocks: [
    {
      kind: 'lead',
      text:
        'Two small programs, both interview classics. **FizzBuzz** is the canonical screening question — millions of candidates have written it. **The multiplication table** is the simplest nested-loop you will write. Together they exercise everything from this topic.',
    },
    {
      kind: 'teachingNotes',
      items: [
        '**Start with FizzBuzz on paper** — many candidates panic; the algorithm is trivial but they overthink it',
        '**Show three versions** of FizzBuzz: if/else chain, switch expression, ternary chain — each one shorter',
        'Multiplication table = **the smallest nested loop** — perfect for showing format strings',
        'Both programs make great interview warm-ups — encourage students to **time themselves** writing FizzBuzz cold',
        'Emphasize: **interviewers test FizzBuzz to filter out candidates who cannot code at all**',
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Part 1 — FizzBuzz',
    },
    {
      kind: 'paragraph',
      text:
        "**The rules.** For numbers 1 to 100:",
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'If the number is divisible by **3 AND 5** (i.e. 15), print **`FizzBuzz`**',
        'Else if divisible by **3**, print **`Fizz`**',
        'Else if divisible by **5**, print **`Buzz`**',
        'Otherwise, print the number itself',
      ],
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'The order matters',
      text:
        'You **must check the "both" case first**. If you check `% 3 == 0` first, `15` will print `Fizz` and never reach the `FizzBuzz` branch. Reverse-order means most specific → least specific.',
    },

    {
      kind: 'heading',
      level: 3,
      text: 'Version 1 — if/else chain',
    },
    {
      kind: 'code',
      filename: 'fizzbuzz-classic.cs',
      code: `for (int i = 1; i <= 100; i++)
{
    if (i % 15 == 0)
    {
        Console.WriteLine("FizzBuzz");
    }
    else if (i % 3 == 0)
    {
        Console.WriteLine("Fizz");
    }
    else if (i % 5 == 0)
    {
        Console.WriteLine("Buzz");
    }
    else
    {
        Console.WriteLine(i);
    }
}`,
    },

    {
      kind: 'heading',
      level: 3,
      text: 'Version 2 — switch expression (modern)',
    },
    {
      kind: 'code',
      filename: 'fizzbuzz-switch.cs',
      code: `for (int i = 1; i <= 100; i++)
{
    string line = i switch
    {
        _ when i % 15 == 0 => "FizzBuzz",
        _ when i %  3 == 0 => "Fizz",
        _ when i %  5 == 0 => "Buzz",
        _                   => i.ToString()
    };
    Console.WriteLine(line);
}`,
    },

    {
      kind: 'heading',
      level: 3,
      text: 'Version 3 — single nested ternary (compact, less readable)',
    },
    {
      kind: 'code',
      filename: 'fizzbuzz-ternary.cs',
      code: `for (int i = 1; i <= 100; i++)
{
    Console.WriteLine(
        i % 15 == 0 ? "FizzBuzz" :
        i %  3 == 0 ? "Fizz" :
        i %  5 == 0 ? "Buzz" :
        i.ToString());
}`,
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: "Which one to use in an interview?",
      text:
        '**Version 1 (if/else)** is the safest answer — clear, correct, every interviewer will accept it. **Version 2 (switch expression)** signals modern C# fluency. **Version 3 (nested ternary)** is the kind of code reviewers will ask you to refactor — clever but harder to read.',
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Part 2 — Multiplication Table',
    },
    {
      kind: 'paragraph',
      text:
        'Print a 1-10 multiplication table — 10 rows, 10 columns, each cell showing `row × col`. Aligned columns for readability.',
    },
    {
      kind: 'code',
      filename: 'mult-table.cs',
      code: `// Header row
Console.Write("    ");
for (int c = 1; c <= 10; c++)
{
    Console.Write($"{c,4}");
}
Console.WriteLine();
Console.WriteLine(new string('-', 44));

// Body
for (int r = 1; r <= 10; r++)
{
    Console.Write($"{r,3}|");
    for (int c = 1; c <= 10; c++)
    {
        Console.Write($"{r * c,4}");
    }
    Console.WriteLine();
}`,
    },
    {
      kind: 'output',
      label: '▶ OUTPUT (first 5 rows)',
      lines: [
        { text: '       1   2   3   4   5   6   7   8   9  10' },
        { text: '--------------------------------------------' },
        { text: '  1|   1   2   3   4   5   6   7   8   9  10' },
        { text: '  2|   2   4   6   8  10  12  14  16  18  20' },
        { text: '  3|   3   6   9  12  15  18  21  24  27  30' },
        { text: '  4|   4   8  12  16  20  24  28  32  36  40' },
        { text: '  5|   5  10  15  20  25  30  35  40  45  50' },
      ],
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Format strings — alignment',
      text:
        '`{r,4}` right-aligns the value in a field 4 characters wide. Negative width (`{r,-4}`) left-aligns. Combine with `:F2` etc. for both alignment and formatting: `{value,8:F2}`.',
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Stretch goals',
    },
    {
      kind: 'list',
      items: [
        '**Parameterise FizzBuzz** — read upper bound from input',
        '**FizzBuzzWoof** — also print `Woof` for multiples of 7, and combinations like `FizzWoof`',
        '**Multiplication table with header row+column** — make it look like a math textbook',
        '**Find Fizzes in a range** — count how many `Fizz` lines (without `Buzz`) appear from 1 to 1000',
      ],
    },

    {
      kind: 'callout',
      tone: 'success',
      title: 'You finished Loops & Iteration',
      text:
        'You have written every kind of loop in C#, understand the three exit keywords, and can recognise when nested loops are too slow. **Next up: Collections** — arrays, lists, dictionaries, sets — the data structures every loop iterates over.',
    },

    {
      kind: 'keyTakeaways',
      items: [
        '**FizzBuzz** can be written with `if/else`, `switch` expression, or a ternary chain — clarity beats cleverness in interviews',
        '**Order matters**: check the most specific (`% 15`) case first',
        '**Multiplication table** is a classic nested-loop exercise — outer for rows, inner for columns',
        '**Format strings** with width specifiers (`{value,4}`) right-align numbers in columns',
        '**Next**: Collections — the data structures these loops will iterate over',
      ],
    },
  ],

  questions: [
    {
      id: 'q1',
      kind: 'predict',
      prompt: 'What does FizzBuzz print for 15?',
      code: `int i = 15;
string line = i switch
{
    _ when i % 15 == 0 => "FizzBuzz",
    _ when i %  3 == 0 => "Fizz",
    _ when i %  5 == 0 => "Buzz",
    _                   => i.ToString()
};
Console.WriteLine(line);`,
      options: [
        { label: 'Fizz' },
        { label: 'Buzz' },
        { label: 'FizzBuzz', correct: true },
        { label: '15' },
      ],
      explanation:
        'The first arm checks `i % 15 == 0` — for `i=15` this is true, so `"FizzBuzz"` is returned. Order matters: if you put the `% 3` check first, `15` would print `"Fizz"` instead.',
    },
    {
      id: 'q2',
      kind: 'predict',
      prompt: 'How many rows does this print?',
      code: `for (int r = 1; r <= 10; r++)
{
    for (int c = 1; c <= 5; c++)
    {
        Console.Write($"{r * c,4}");
    }
    Console.WriteLine();
}`,
      options: [
        { label: '5' },
        { label: '10', correct: true },
        { label: '15' },
        { label: '50' },
      ],
      explanation:
        'The **outer** loop runs 10 times. Each outer iteration ends with `Console.WriteLine()`, which produces one row. The inner loop produces the contents of each row (5 columns wide). Total: **10 rows**.',
    },
    {
      id: 'q3',
      kind: 'mcq',
      prompt:
        "An interviewer asks you to write FizzBuzz. You produce a clean if/else version in 90 seconds. They ask: 'Can you make it more idiomatic for modern C#?' What would you reach for?",
      options: [
        { label: 'A goto statement.' },
        { label: 'A switch expression with `when` clauses.', correct: true },
        { label: 'Reflection.' },
        { label: 'A linked list.' },
      ],
      explanation:
        '**Switch expressions with `when`** are the modern-C# answer. They keep the code linear, exhaustive, and idiomatic. Mentioning the trade-off ("if/else is fine; switch is more declarative") shows architectural thinking.',
    },
  ],

  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Time yourself on FizzBuzz',
      prompt:
        "Open a new project. Without looking back at this lesson, write FizzBuzz from scratch. **Time yourself.** Aim for under 2 minutes. This is the actual benchmark interviewers use for entry-level candidates.",
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Parametric FizzBuzz',
      prompt:
        "Read three integers from the user: `upperBound`, `fizz`, `buzz`. Run FizzBuzz from 1 to `upperBound`, but use the supplied divisors instead of 3 and 5. Try with `(20, 2, 7)` and check the output makes sense.",
      hints: [
        'Use `fizz * buzz` for the "both" case (caveat: only correct if they\'re coprime — but good enough for this exercise).',
        '`int.TryParse` for each input.',
      ],
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'Pretty multiplication table with header',
      prompt:
        "Build a multiplication table that includes:\n• A header row showing column numbers `1` through `10`\n• A leftmost column showing row numbers\n• A horizontal line separating header from body\n• A vertical separator after the row number\n\nAll columns aligned. Look at the example output in the lesson body for the target format.",
      hints: [
        '`{value,4}` for right-aligned 4-char width.',
        '`new string(\'-\', 44)` for the divider line.',
        'Build the header first, then the body.',
      ],
    },
  ],
};
