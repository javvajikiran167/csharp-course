import type { Lesson } from '@/data/types';

export const lesson06: Lesson = {
  slug: 'strings',
  number: 6,
  title: 'Strings',
  objective: 'Build strings with interpolation, format numbers cleanly, and use escape sequences for special characters.',
  blocks: [
    {
      kind: 'lead',
      text:
        'Strings are the most common type you\'ll touch — names, messages, error text, log lines. C# gives you three small features that, once mastered, replace 90% of clumsy string handling.',
    },
    {
      kind: 'teachingNotes',
      items: [
        'Push **`$"..."` interpolation hard** — `"a" + b + "c"` is the bad habit to break',
        '**Format specifiers** (`:F2`, `:N0`, `:C`, `:P`) come up in interviews — memorize the top 5',
        'Escape sequences: `\\n`, `\\t`, `\\"`, `\\\\` — practice writing a Windows path',
        'Verbatim strings (`@"..."`) for paths and multi-line — show both styles back-to-back',
        'Combine: `$@"..."` is interpolation + verbatim',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'String interpolation',
    },
    {
      kind: 'paragraph',
      text:
        'Put a `$` before a string and any `{expression}` inside the quotes gets evaluated and inserted. The expression can be a variable, a method call, or arithmetic.',
    },
    {
      kind: 'code',
      code: `string user = "Alice";
int score = 4280;
double balance = 1250.75;

Console.WriteLine($"User: {user}");
Console.WriteLine($"Score: {score + 100}");        // expression
Console.WriteLine($"Balance: \${balance:F2}");      // format specifier`,
    },
    {
      kind: 'output',
      output: `User: Alice
Score: 4380
Balance: $1250.75`,
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Format specifiers',
    },
    {
      kind: 'paragraph',
      text:
        'After the colon inside `{...}`, you can add a format code that controls how the value prints. Below are the specifiers you will actually use — each one shown with real values and the exact output it produces.',
    },

    /* ── Number format specifiers ─────────────────────── */
    {
      kind: 'heading',
      level: 3,
      text: 'Number formatting',
    },
    {
      kind: 'code',
      filename: 'numbers.cs',
      code: `double price = 1250.75;
double rate  = 0.085;

Console.WriteLine($"F0 : {price:F0}");   // no decimals
Console.WriteLine($"F1 : {price:F1}");   // 1 decimal
Console.WriteLine($"F2 : {price:F2}");   // 2 decimals
Console.WriteLine($"N0 : {price:N0}");   // thousands separator
Console.WriteLine($"N2 : {price:N2}");   // thousands + 2 decimals
Console.WriteLine($"C  : {price:C}");    // currency
Console.WriteLine($"P  : {rate:P}");     // percentage
Console.WriteLine($"P1 : {rate:P1}");    // percentage, 1 decimal`,
    },
    {
      kind: 'output',
      output: `F0 : 1251
F1 : 1250.8
F2 : 1250.75
N0 : 1,251
N2 : 1,250.75
C  : $1,250.75
P  : 8.50%
P1 : 8.5%`,
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Try it yourself',
      text:
        'Open VS Code. Make a `double subtotal = 99.95;` and a `double tax = 0.085;`. Print the subtotal as currency (`:C`), the tax as a percentage (`:P`), and the total (`subtotal + subtotal * tax`) as currency. Confirm the cents line up.',
    },

    /* ── Date format specifiers ─────────────────────── */
    {
      kind: 'heading',
      level: 3,
      text: 'Date formatting',
    },
    {
      kind: 'paragraph',
      text:
        '`DateTime` accepts standard codes (`yyyy` = 4-digit year, `MM` = month, `dd` = day, `HH` = 24-hour, `mm` = minutes). You build any format you need by combining them.',
    },
    {
      kind: 'code',
      filename: 'dates.cs',
      code: `var now = new DateTime(2026, 6, 11, 14, 35, 0);

Console.WriteLine($"{now:yyyy-MM-dd}");       // ISO date — most common in APIs
Console.WriteLine($"{now:dd/MM/yyyy}");       // European style
Console.WriteLine($"{now:MMM d, yyyy}");      // short month name
Console.WriteLine($"{now:HH:mm}");            // 24-hour time
Console.WriteLine($"{now:yyyy-MM-dd HH:mm}"); // datetime in one line`,
    },
    {
      kind: 'output',
      output: `2026-06-11
11/06/2026
Jun 11, 2026
14:35
2026-06-11 14:35`,
    },

    /* ── Column alignment ─────────────────────── */
    {
      kind: 'heading',
      level: 3,
      text: 'Column alignment — for tabular console output',
    },
    {
      kind: 'paragraph',
      text:
        'A **comma + number** inside `{}` sets the minimum column width. **Positive** = right-aligned (good for numbers). **Negative** = left-aligned (good for labels). Combine alignment and a format specifier with a colon: `{value,10:F2}`.',
    },
    {
      kind: 'code',
      filename: 'alignment.cs',
      code: `// Header — name left, score right
Console.WriteLine($"{"Name",-10}| {"Score",5}");
Console.WriteLine(new string('-', 18));

// Rows
Console.WriteLine($"{"Alice",-10}| {92,5}");
Console.WriteLine($"{"Bob",-10}| {7,5}");
Console.WriteLine($"{"Charlie",-10}| {110,5}");`,
    },
    {
      kind: 'output',
      output: `Name      | Score
------------------
Alice     |    92
Bob       |     7
Charlie   |   110`,
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Try it yourself',
      text:
        "Build a 3-row leaderboard of your own — 3 names and 3 scores. Use `,-12` for names and `,6` for scores so everything lines up. Add a `:N0` to the score format so a score of 1000 prints as `1,000`.",
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Escape sequences',
    },
    {
      kind: 'paragraph',
      text:
        'Some characters need a backslash to fit inside a string literal:',
    },
    {
      kind: 'code',
      code: `Console.WriteLine("Line one\\nLine two");   // \\n = newline
Console.WriteLine("Name\\tScore");          // \\t = tab
Console.WriteLine("She said \\"hi\\".");     // \\" = a literal quote
Console.WriteLine("C:\\\\Users\\\\alex");    // \\\\ = a literal backslash`,
    },
    {
      kind: 'output',
      output: `Line one
Line two
Name	Score
She said "hi".
C:\\Users\\alex`,
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Verbatim strings',
      text:
        'Prefix a string with `@` and you can write file paths and multi-line text without escaping: `@"C:\\Users\\alex"` is the same as `"C:\\\\Users\\\\alex"`. You can combine: `$@"..."` for both interpolation and verbatim.',
    },
    {
      kind: 'keyTakeaways',
      items: [
        'Use **`$"..."` interpolation**; never concatenate with `+` for output formatting',
        'Format specifiers control the output: `:F2`, `:N0`, `:C` (currency), `:P` (percent)',
        'Escape sequences inside `"..."`: `\\n` newline, `\\t` tab, `\\"` quote, `\\\\` backslash',
        'Verbatim strings `@"..."` treat backslashes literally — perfect for file paths',
        '**Combine both** with `$@"..."` for interpolation + verbatim simultaneously',
      ],
    },
  ],
  questions: [
    {
      id: 'q1',
      kind: 'predict',
      prompt: 'What does this print?',
      code: `double price = 0.085;
Console.WriteLine($"Tax: {price:P}");`,
      options: [
        { label: 'Tax: 0.085' },
        { label: 'Tax: 8.50 %', correct: true },
        { label: 'Tax: 0.085P' },
        { label: 'Tax: 85%' },
      ],
      explanation:
        '`:P` formats the number as a percentage. C# multiplies by 100 and appends the locale\'s percent symbol with two decimal places by default.',
    },
    {
      id: 'q2',
      kind: 'mcq',
      prompt: 'Which escape sequence inserts a newline?',
      options: [
        { label: '`\\\\n`' },
        { label: '`\\n`', correct: true },
        { label: '`/n`' },
        { label: '`<br>`' },
      ],
      explanation:
        '`\\n` is the newline escape sequence in C# strings. It moves the cursor to the next line in the output.',
    },
    {
      id: 'q3',
      kind: 'fill',
      prompt:
        'What character do you add before a string to enable interpolation?',
      template: `___"Hello {name}"`,
      accept: ['$'],
      explanation:
        'The `$` symbol turns a regular string into an *interpolated* string. Anything inside `{...}` is evaluated and inserted.',
    },
  ],

  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Receipt printer',
      prompt:
        "Hard-code three product names and three prices. Print a receipt with columns aligned, prices formatted with `:F2`, and a total at the bottom. Aim for visual clarity — the columns should line up.",
      hints: [
        'Combine `:F2` with a width specifier like `:F2,10` to pad to 10 characters.',
        'Or just use spaces in your format strings.',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Format every way',
      prompt:
        "Take the number `1234567.891`. Print it five times using different format specifiers: as a plain number, with thousands separators (`:N0`), as currency (`:C`), as a percentage of `0.1` (`:P`), and in scientific notation (`:E2`). Comment on which would be appropriate where.",
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'Multi-line poem',
      prompt:
        "Print a short 4-line poem using a single verbatim multi-line string (`@\"...\"`). Then print the same poem using `\\n` escape sequences. Compare which is more readable in code.",
    },
  ],
};
