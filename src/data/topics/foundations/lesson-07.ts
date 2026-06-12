import type { Lesson } from '@/data/types';

export const lesson07: Lesson = {
  slug: 'io',
  number: 7,
  title: 'Console Input & Output',
  objective: 'Read user input from the keyboard and safely convert it to numbers.',
  blocks: [
    {
      kind: 'lead',
      text:
        'A program with hardcoded values is a static report. A program that reads input is a tool. Two methods do almost all the work: `Console.WriteLine` for output, `Console.ReadLine` for input.',
    },
    {
      kind: 'teachingNotes',
      items: [
        '**`ReadLine` always returns string** — drive this hard; conversion is mandatory',
        '`Console.Write` vs `Console.WriteLine` — easy confusion point; demo both',
        '**`Parse` vs `TryParse`** — `TryParse` is the .NET idiom for "might fail"',
        'Mention `Convert.ToInt32` returns `0` on null (different from `Parse`) — niche but interview-tested',
        'Connect to Lesson 4 — input is a place where TryParse really pays off',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Writing output — Write vs WriteLine',
    },
    {
      kind: 'paragraph',
      text:
        'Two output methods, one tiny but important difference: **`WriteLine` adds a newline at the end; `Write` does not.** Use `Write` for prompts where you want the cursor to stay on the same line.',
    },
    {
      kind: 'code',
      filename: 'write-vs-writeline.cs',
      code: `// WriteLine — each call lands on its own line
Console.WriteLine("First");
Console.WriteLine("Second");
Console.WriteLine("Third");

Console.WriteLine();   // blank separator line

// Write — calls run together on one line
Console.Write("A");
Console.Write("B");
Console.Write("C");
Console.WriteLine();   // close the line at the end

// The classic prompt pattern
Console.Write("Enter your name: ");
// user types here on the same line`,
    },
    {
      kind: 'output',
      lines: [
        { text: 'First' },
        { text: 'Second' },
        { text: 'Third' },
        { text: '' },
        { text: 'ABC' },
        { text: 'Enter your name: ' },
      ],
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Try it yourself',
      text:
        'Print `Loading` followed by three dots that appear one at a time using `Console.Write(".")` in a row. End with `Console.WriteLine(" done!")`. Result: `Loading... done!` on a single line.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Reading input',
    },
    {
      kind: 'paragraph',
      text:
        '`Console.ReadLine()` pauses the program, waits for the user to type a line and press Enter, then returns whatever they typed — **always as a string**, even if they typed a number.',
    },
    {
      kind: 'code',
      filename: 'greet.cs',
      code: `Console.Write("What is your name? ");
string name = Console.ReadLine();
Console.WriteLine($"Hello, {name}!");`,
    },
    {
      kind: 'output',
      lines: [
        { text: 'What is your name? ' },
        { text: 'Alice', dim: true },
        { text: 'Hello, Alice!' },
      ],
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'Why VS Code underlines this line',
      text:
        "`ReadLine` officially returns `string?` — it can be `null` if the input stream ends. In a default .NET 8 project (nullable enabled), assigning it to a plain `string` shows warning **CS8600**, which is the squiggle you may see under `string name = Console.ReadLine();`. To silence it, write `string name = Console.ReadLine() ?? \"\";` (use an empty string when null) or declare `string? name` — full nullability comes later.",
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Parsing input to numbers',
    },
    {
      kind: 'paragraph',
      text:
        "Because `ReadLine` returns a string, you can't do math on it directly. Convert with `int.Parse` or `double.Parse`:",
    },
    {
      kind: 'code',
      filename: 'doubler.cs',
      code: `Console.Write("Enter a number: ");
string input = Console.ReadLine();
int n = int.Parse(input);

Console.WriteLine($"Doubled: {n * 2}");`,
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'Parse throws if the input is not a number',
      text:
        'If the user types `"hello"`, `int.Parse("hello")` throws a `FormatException` and the program crashes. For anything user-facing, prefer `int.TryParse`:',
    },
    {
      kind: 'code',
      filename: 'safe-input.cs',
      code: `Console.Write("Enter a number: ");
string input = Console.ReadLine();

if (int.TryParse(input, out int n))
{
    Console.WriteLine($"Doubled: {n * 2}");
}
else
{
    Console.WriteLine("That wasn't a number — try again.");
}`,
    },
    {
      kind: 'paragraph',
      text:
        '`TryParse` returns a `bool` (success or not) and puts the parsed value into the `out` parameter. You\'ll see this pattern across .NET: try the operation, get back a success flag, decide what to do.',
    },
    {
      kind: 'keyTakeaways',
      items: [
        '`Console.WriteLine` ends with newline; `Console.Write` does not — use `Write` for prompts',
        '`Console.ReadLine()` **always returns `string`** — convert with `int.Parse` / `double.Parse`',
        '**Prefer `int.TryParse`** for user input — returns `false` on bad input, no exception',
        'The **TryParse pattern** (`bool` return + `out` parameter) is the .NET idiom for "might fail"',
        '`Console.Write("Enter: ")` followed by `ReadLine()` is the standard prompt-and-read pattern',
      ],
    },
  ],
  questions: [
    {
      id: 'q1',
      kind: 'mcq',
      prompt: 'What does `Console.ReadLine()` return?',
      options: [
        { label: 'An `int`' },
        { label: 'A `string` — always, even if the user typed digits', correct: true },
        { label: 'A `char`' },
        { label: 'A `double`' },
      ],
      explanation:
        '`ReadLine` always returns a `string`. If you need a number, convert with `int.Parse`, `double.Parse`, or the safer `int.TryParse` / `double.TryParse`.',
    },
    {
      id: 'q2',
      kind: 'predict',
      prompt: 'A user runs the program and types `3.14`. What happens?',
      code: `string input = Console.ReadLine();
int n = int.Parse(input);
Console.WriteLine(n);`,
      options: [
        { label: 'Prints `3`' },
        { label: 'Prints `3.14`' },
        { label: 'Throws a FormatException at runtime', correct: true },
        { label: 'Won\'t compile' },
      ],
      explanation:
        '`int.Parse("3.14")` throws a `FormatException` — the decimal makes it invalid as an integer. Use `double.Parse` for decimal input, or `int.TryParse` to handle the failure gracefully.',
    },
    {
      id: 'q3',
      kind: 'mcq',
      prompt:
        'Your program reads user input that might be invalid. Which is the safer choice?',
      options: [
        { label: '`int.Parse(input)` inside a try/catch block' },
        { label: '`int.TryParse(input, out int n)` checked with an if', correct: true },
        { label: 'Just trust the user.' },
        { label: 'Convert the input to a string first.' },
      ],
      explanation:
        '`TryParse` is the idiomatic .NET pattern for "operation might fail" — it returns a `bool` and avoids the overhead and ceremony of exception handling for routine validation.',
    },
  ],

  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Greeting + farewell',
      prompt:
        "Ask the user for their name. Greet them. Then ask whether they're staying or leaving (input `y` or `n`). Print *'See you soon!'* or *'Welcome, stay awhile!'* accordingly.",
      hints: [
        'Compare strings with `==` — C# overloads it for strings.',
        'Trim trailing whitespace from input: `input.Trim()`.',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Safe age input',
      prompt:
        "Ask for the user's age. Use `int.TryParse` so the program never crashes. If parsing fails, print a friendly message and exit. If it succeeds, print their birth year (today's year minus age) using `DateTime.Now.Year`.",
      hints: [
        '`DateTime.Now.Year` returns the current year as an `int`.',
        'Don\'t forget `using System;` is implicit in modern .NET console apps.',
      ],
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'Loop until valid input',
      prompt:
        "Build on the previous challenge: instead of exiting on invalid input, keep asking until the user enters a valid number. Use a `while (true)` loop and break out when parsing succeeds. (You haven't learned loops formally yet, but `while (true) { ... break; }` is short enough to try.)",
      hints: [
        '`while (true) { ... }` runs forever until you `break`.',
        '`if (int.TryParse(input, out int age)) { ... break; }`.',
      ],
    },
  ],
};
