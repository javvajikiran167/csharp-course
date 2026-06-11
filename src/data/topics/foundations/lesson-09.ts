import type { Lesson } from '@/data/types';

export const lesson09: Lesson = {
  slug: 'mini-project',
  number: 9,
  title: 'Mini Project — Tip Calculator',
  objective: 'Combine everything from Foundations — variables, arithmetic, strings, input, and constants — into one real interactive program.',
  blocks: [
    {
      kind: 'lead',
      text:
        "Foundations is over. Before we move on, let's build a real thing that uses every concept from the topic. The challenge: a tip calculator that reads a bill amount and a tip percentage, then prints the breakdown.",
    },
    {
      kind: 'teachingNotes',
      items: [
        "**Don't read the code** — paste it, run it, then walk through line-by-line",
        'Highlight three concepts from previous lessons: **`TryParse`**, **`100.0`** (not `100`), **`:F2`**',
        '**Run it twice** — once with good input, once with junk input, to show TryParse catching it',
        'Encourage the bonus extensions in challenges — multi-person split is the natural next step',
        '**Tease Control Flow** at the end — `if/else` and `switch` is the next topic',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'The requirements',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Ask the user for the bill amount (decimal).',
        'Ask the user for the tip percentage (decimal — `15` means 15%).',
        'Calculate the tip amount and the total.',
        'Print a tidy breakdown with currency formatting (`:C` or `:F2`).',
        'Validate input — if the user types nonsense, print a friendly message instead of crashing.',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Reference solution',
    },
    {
      kind: 'code',
      filename: 'TipCalculator.cs',
      code: `// ── Tip Calculator ──────────────────────────────────────
// Reads a bill amount and tip percentage, prints the total.

const string Divider = "──────────────────────────────";

Console.WriteLine(Divider);
Console.WriteLine("       TIP CALCULATOR         ");
Console.WriteLine(Divider);

Console.Write("Bill amount    : ");
if (!double.TryParse(Console.ReadLine(), out double bill))
{
    Console.WriteLine("That wasn't a number. Bye!");
    return;
}

Console.Write("Tip percentage : ");
if (!double.TryParse(Console.ReadLine(), out double tipPercent))
{
    Console.WriteLine("That wasn't a number. Bye!");
    return;
}

double tipAmount = bill * (tipPercent / 100.0);
double total     = bill + tipAmount;

Console.WriteLine(Divider);
Console.WriteLine($"Bill           : \${bill:F2}");
Console.WriteLine($"Tip ({tipPercent}%)     : \${tipAmount:F2}");
Console.WriteLine($"Total          : \${total:F2}");
Console.WriteLine(Divider);`,
    },
    {
      kind: 'output',
      lines: [
        { text: '──────────────────────────────' },
        { text: '       TIP CALCULATOR         ' },
        { text: '──────────────────────────────' },
        { text: 'Bill amount    : ' },
        { text: '85.50', dim: true },
        { text: 'Tip percentage : ' },
        { text: '18', dim: true },
        { text: '──────────────────────────────' },
        { text: 'Bill           : $85.50' },
        { text: 'Tip (18%)      : $15.39' },
        { text: 'Total          : $100.89' },
        { text: '──────────────────────────────' },
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'What every line teaches',
    },
    {
      kind: 'list',
      items: [
        '`const string Divider` — a constant, PascalCase, lives at the top so the visual style is in one place.',
        '`double.TryParse(..., out double bill)` — safer than `Parse`. If parsing fails, we exit gracefully.',
        '`tipPercent / 100.0` — note the `.0`! Without it, `15 / 100` would be integer division and equal `0`.',
        '`:F2` — formats both the bill and total as two-decimal numbers.',
        '`return;` — at the top level (no Main method), `return` ends the program immediately.',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Bonus — try these on your own',
    },
    {
      kind: 'list',
      items: [
        'Split the bill among N people — ask for the number of diners, print per-person amounts.',
        'Round the per-person amount up to the nearest dollar (hint: `Math.Ceiling`).',
        'Add a "service was bad" mode that overrides the tip to 0% and prints a snarky message.',
      ],
    },
    {
      kind: 'callout',
      tone: 'success',
      title: 'You finished Foundations',
      text:
        'Every line above uses something from a previous lesson. You can now read, write, modify, and ship a real C# program. The next topic is **Control Flow** — making decisions and repeating actions.',
    },
    {
      kind: 'keyTakeaways',
      items: [
        'A real C# program combines **variables, arithmetic, strings, input, and constants**',
        '**`TryParse` + `100.0` literal + `:F2` format** are tools you will use in every interactive program',
        '**`const`** for values that never change; **meaningful names** everywhere',
        '`return;` at the top level (file-based program) exits the program',
        '**Next up**: Control Flow — `if/else`, `switch`, ternary, pattern matching',
      ],
    },
  ],
  questions: [
    {
      id: 'q1',
      kind: 'predict',
      prompt: 'A user enters `100` for the bill and `15` for the tip. What is printed for `Total`?',
      code: `double bill = 100;
double tipPercent = 15;
double tipAmount = bill * (tipPercent / 100.0);
double total = bill + tipAmount;
Console.WriteLine($"Total: \${total:F2}");`,
      options: [
        { label: 'Total: $100.00' },
        { label: 'Total: $115.00', correct: true },
        { label: 'Total: $1500.00' },
        { label: 'Total: $0.00' },
      ],
      explanation:
        '`100 * (15 / 100.0)` = `100 * 0.15` = `15`. Total is `100 + 15 = 115`. `:F2` formats as `115.00`.',
    },
    {
      id: 'q2',
      kind: 'mcq',
      prompt:
        'Why does the reference solution divide by `100.0` instead of `100`?',
      options: [
        { label: 'Style preference, no difference.' },
        {
          label: "If both sides are int, C# does integer division and the result is 0.",
          correct: true,
        },
        { label: 'Performance.' },
        { label: '`100.0` is shorter to type.' },
      ],
      explanation:
        'When `tipPercent` is `double`, `tipPercent / 100.0` is fine. But if both operands were `int`, `15 / 100` would be `0`. Writing `100.0` (a `double` literal) guarantees the division returns a `double`.',
    },
    {
      id: 'q3',
      kind: 'mcq',
      prompt:
        'The current program uses `double` for money. In a real production tip-calculator service, which type would be better?',
      options: [
        { label: '`int`' },
        { label: '`float`' },
        { label: '`decimal`', correct: true },
        { label: '`string`' },
      ],
      explanation:
        '`decimal` is built for exact decimal arithmetic — no surprises like `0.1 + 0.2 = 0.30000000000000004`. For money in production, use `decimal` and the `m` suffix on literals (e.g. `0.15m`). `double` is fine for learning and for non-financial math.',
    },
  ],
};
