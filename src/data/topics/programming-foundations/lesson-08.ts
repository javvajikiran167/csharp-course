import type { Lesson } from '@/data/types';

export const lesson08: Lesson = {
  slug: 'your-toolkit',
  number: 8,
  title: 'Your Toolkit — Installing .NET and Running Your First Program',
  objective:
    'Set up the tools every C# developer uses — the .NET SDK and a code editor — and run your very first C# program, connecting every idea from this topic to something real on your screen.',
  blocks: [
    {
      kind: 'lead',
      text:
        "Theory becomes real the moment your own machine prints its first line of output. In this lesson you'll install the two tools every C# developer relies on, then write and run a tiny program. Everything from Topic 00 — instructions, a language, types, the compile-and-run journey — will happen for real, in under five minutes of typing.",
    },
    {
      kind: 'teachingNotes',
      items: [
        'Separate the **two tools** clearly: the **.NET SDK** (compiler + runtime + `dotnet` command) and an **editor** (VS Code or Visual Studio)',
        'Have students run `dotnet --version` first — a successful version number is a confidence win',
        'Use the **command-line** `dotnet new` / `dotnet run` path: it makes the compile→run pipeline from Lesson 7 visible and is OS-agnostic',
        'Reassure: the generated one-liner uses **top-level statements** — the older `class Program { static void Main }` boilerplate is optional in modern .NET',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'The two tools you need',
      id: 'tools',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'The .NET SDK',
          items: [
            'SDK = Software Development Kit',
            'Includes the C# **compiler**, the **runtime** that runs your program, and the `dotnet` command-line tool',
            'This is what actually turns your C# into a running program',
            'Free, from Microsoft, for Windows, macOS, and Linux',
          ],
        },
        {
          title: 'A code editor',
          items: [
            '**Visual Studio Code** — lightweight, free, cross-platform (add the official C# Dev Kit extension)',
            '**Visual Studio** — a larger, full-featured IDE (Windows & Mac)',
            'Either gives you red-squiggle error checking and autocomplete',
            'An editor is for *writing*; the SDK is for *running*',
          ],
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Start with VS Code',
      text:
        "For learning, install **VS Code** plus the **C# Dev Kit** extension — it's quick, free, and works the same on every operating system, so this course's instructions match your screen. You can always move to full Visual Studio later if you build large Windows apps.",
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Step 1 — Install the .NET SDK',
      id: 'install',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Go to the official download page: [dotnet.microsoft.com/download](https://dotnet.microsoft.com/download).',
        'Download the **SDK** (not just the Runtime) for your operating system — pick the latest stable release.',
        'Run the installer and accept the defaults.',
        'Open a terminal (Command Prompt or PowerShell on Windows, Terminal on macOS/Linux) and verify it.',
      ],
    },
    {
      kind: 'code',
      language: 'bash',
      filename: 'terminal',
      code: 'dotnet --version',
    },
    {
      kind: 'output',
      label: 'Expected output (your exact number may differ)',
      output: '9.0.100',
    },
    {
      kind: 'paragraph',
      text:
        "If you see a version number, the SDK is installed and the `dotnet` command works — that's your compiler and runtime, ready to go. If instead you get *'command not found,'* close and reopen the terminal (so it picks up the new install), and reinstall if needed.",
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Step 2 — Create and run your first program',
      id: 'first-run',
    },
    {
      kind: 'paragraph',
      text:
        "The `dotnet` tool can scaffold a starter project for you. In your terminal, create a new console application, move into its folder, and run it:",
    },
    {
      kind: 'code',
      language: 'bash',
      filename: 'terminal',
      code:
        'dotnet new console -o HelloWorld\ncd HelloWorld\ndotnet run',
    },
    {
      kind: 'output',
      label: 'Output',
      output: 'Hello, World!',
    },
    {
      kind: 'paragraph',
      text:
        "That's it — you just compiled and ran a C# program. `dotnet new console` generated the project, and `dotnet run` performed the whole Lesson 7 journey at once: it compiled your source, checked it, built it, and executed the result. The famous *Hello, World!* is now coming from code on your own machine.",
    },
    {
      kind: 'heading',
      level: 2,
      text: 'What\'s in the file',
      id: 'the-code',
    },
    {
      kind: 'paragraph',
      text:
        "Open the generated `Program.cs` in your editor. In modern .NET it is astonishingly short — a single line, thanks to a feature called **top-level statements** that lets a simple program skip the ceremony:",
    },
    {
      kind: 'code',
      language: 'csharp',
      filename: 'Program.cs',
      code: '// See https://aka.ms/new-console-template for more information\nConsole.WriteLine("Hello, World!");',
    },
    {
      kind: 'paragraph',
      text:
        "Connect it to everything you've learned: `Console.WriteLine(...)` is an **instruction** (Lesson 1) to show text on screen; `\"Hello, World!\"` is a value of type **text/string** (Lessons 3–4); the line runs as a one-step **sequence** (Lesson 5); and `dotnet run` took it through **compile → run** (Lesson 7). Now change the message to your own name, save, and `dotnet run` again — watch the output change. You're programming.",
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'You may have seen longer "hello world" code',
      text:
        "Older tutorials wrap that line in `class Program { static void Main(string[] args) { ... } }`. That still works and you'll meet it properly in the OOP topic — but modern C# lets a small program be a single line. We'll introduce each piece of the longer form only when you actually need it.",
    },
    {
      kind: 'callout',
      tone: 'success',
      title: 'You\'ve finished the foundations',
      text:
        "You now know what a program is, what a language is, how data is stored, what variables and types are, how programs decide and repeat, how to break problems into algorithms, and how code becomes a running program — and you've run one yourself. Everything from here is C# specifics layered onto this solid base. Take the topic quiz, work the practice problems, then start **Foundations of C#**.",
    },
    {
      kind: 'keyTakeaways',
      items: [
        'You need two tools: the **.NET SDK** (compiler + runtime + `dotnet` command) and a **code editor** (VS Code is the easy start)',
        'Verify the install with `dotnet --version`; scaffold and run with `dotnet new console` then `dotnet run`',
        '`dotnet run` performs the whole **compile → check → build → run** journey in one command',
        "Modern C# allows a one-line program via **top-level statements**; `Console.WriteLine(\"...\")` is your first real instruction",
      ],
    },
  ],
};
