import type { Lesson } from '@/data/types';

export const lesson02: Lesson = {
  slug: 'how-csharp-runs',
  number: 2,
  title: 'How C# Runs',
  objective:
    'Understand the difference between statically and dynamically typed languages, and what really happens between pressing Run and the program executing.',
  blocks: [
    {
      kind: 'lead',
      text:
        'Programming languages split into two camps based on WHEN they check your code for mistakes. C# belongs to the first camp — and that single design choice shapes everything else about how you work with it.',
    },
    {
      kind: 'teachingNotes',
      items: [
        'Spend the most time on **static vs dynamic** — it underpins every later topic',
        'Draw the compilation pipeline on the board: **.cs → Roslyn → IL → CLR/JIT → machine code**',
        '**Compile error vs runtime error** is daily vocab — make students name both before moving on',
        'Demo the Python vs C# `name + 5` side-by-side if you can — visual impact',
        'Connect **.dll** and **.exe** to files they\'ve seen on Windows',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Statically typed vs dynamically typed',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Statically typed — C#, Java, Rust, Go, TypeScript',
          items: [
            'You declare the type of every value',
            'The compiler verifies all types before running',
            'Most errors caught before the program ever starts',
            'IDE knows exactly what every variable can do',
          ],
        },
        {
          title: 'Dynamically typed — Python, JavaScript, Ruby',
          items: [
            'Types figured out as the program runs',
            'No upfront type declarations needed',
            'Errors only show up when that line actually executes',
            'Faster to scribble, harder to refactor safely',
          ],
        },
      ],
    },
    {
      kind: 'paragraph',
      text:
        "In Python, this code runs fine — until the line with the bug executes. In C#, the same code doesn't even compile:",
    },
    {
      kind: 'code',
      filename: 'Python',
      language: 'python',
      code: `name = "Alice"
name = name + 5
# At runtime: TypeError: can only concatenate str (not "int") to str`,
    },
    {
      kind: 'code',
      filename: 'C#',
      language: 'csharp',
      code: `string name = "Alice";
name = name + 5;
// CS0019: Operator '+' cannot be applied
// to operands of type 'string' and 'int'`,
    },
    {
      kind: 'heading',
      level: 2,
      text: 'What compilation does',
    },
    {
      kind: 'paragraph',
      text:
        'Your CPU does not understand the words `Console.WriteLine`. It understands only millions of tiny instructions made of 1s and 0s. **Compilation** is the translation step between your code and instructions the machine can run.',
    },
    {
      kind: 'paragraph',
      text:
        'When you press Run, this happens in milliseconds: your **.cs file** is read by **Roslyn** (the C# compiler), which produces **IL** (Intermediate Language) packaged inside a **.dll** or **.exe**. The **.NET runtime** loads that IL, and the **JIT** (Just-In-Time) compiler translates it to native machine code your CPU executes.',
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Why two stages?',
      text:
        'Compiling straight to machine code would lock your program to one CPU and OS. Instead, .NET compiles to portable IL once, and the runtime translates IL to native code on whichever machine runs it. The same .dll runs on Windows, macOS, Linux, and ARM.',
    },
    {
      kind: 'heading',
      level: 2,
      text: '.exe vs .dll',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: '.exe — executable',
          items: [
            'Contains IL + an entry point (a Main method)',
            'Can be run directly: double-click or type its name',
            'What you ship to end users',
          ],
        },
        {
          title: '.dll — library',
          items: [
            'Contains IL but no entry point',
            'Cannot run on its own',
            'Used by other programs as reusable code',
            'Every NuGet package is a .dll',
          ],
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'Compile error vs runtime error',
      text:
        "Two words you'll meet every day. A **compile error** means the compiler refused to produce IL because your source code has a problem — you'll see red squiggles in VS Code. A **runtime error** means the program compiled fine, then crashed while running. C# is designed to push as many problems as possible into the compile category.",
    },
    {
      kind: 'keyTakeaways',
      items: [
        '**Statically typed** = types checked at compile time; **dynamically typed** = at runtime',
        'C# compiles into **IL** (Intermediate Language), packaged in a `.dll` or `.exe`',
        'The **CLR** loads the IL; the **JIT** compiles it to native code as the program runs',
        'IL exists so the same compiled program runs on **any CPU and OS** the runtime supports',
        '`.exe` = runnable, has `Main`. `.dll` = library, used by other code',
        '**Compile errors** are caught before running; **runtime errors** crash mid-execution',
      ],
    },
  ],
  questions: [
    {
      id: 'q1',
      kind: 'mcq',
      prompt: 'Which of these languages is statically typed?',
      options: [
        { label: 'Python' },
        { label: 'JavaScript' },
        { label: 'C#', correct: true },
        { label: 'Ruby' },
      ],
      explanation:
        'C# (along with Java, Rust, Go, and TypeScript) is statically typed — types are declared and the compiler verifies them before the program runs.',
    },
    {
      id: 'q2',
      kind: 'mcq',
      prompt:
        'When the C# compiler is done, what does it produce?',
      options: [
        { label: 'Native machine code straight away' },
        { label: 'Intermediate Language (IL) packaged in a .dll or .exe', correct: true },
        { label: 'A Python-like interpreted script' },
        { label: 'A zip file containing the source code' },
      ],
      explanation:
        'C# compiles to portable IL stored in a .dll (library) or .exe (executable). The runtime\'s JIT compiler translates IL to native machine code at the moment the program runs.',
    },
    {
      id: 'q3',
      kind: 'mcq',
      prompt:
        "You see a red squiggly line under `name + 5` in VS Code before you've run the program. Which kind of error is this?",
      options: [
        { label: 'A compile error', correct: true },
        { label: 'A runtime error' },
        { label: 'A logic error' },
        { label: 'A network error' },
      ],
      explanation:
        "The compiler detects the type mismatch before the program runs — that's a compile error. C# tries to surface as many issues as possible at compile time.",
    },
  ],

  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Inspect the build output',
      prompt:
        "Run `dotnet build` on your `HelloCSharp` project from Lesson 3. Look in `bin/Debug/net8.0/`. List the files you see in a comment at the top of `Program.cs`. Identify which one is the IL-containing executable.",
      hints: [
        'You\'ll see at least a `.dll`, a `.pdb`, and a `.deps.json`.',
        'On Windows, look for `HelloCSharp.exe` or `HelloCSharp.dll` as the runnable assembly.',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Make the compiler complain',
      prompt:
        "Write three short C# snippets that each produce a different compile-time error. For each one, paste the error code (`CSxxxx`) and a one-sentence explanation of what went wrong. The point is to learn to read compiler messages — interviewers love candidates who can debug from an error code.",
      hints: [
        'Mix a string with an int. Assign a `double` to an `int`. Forget a semicolon.',
        'Common error codes: CS0019, CS0029, CS1002, CS0103.',
      ],
    },
  ],
};
