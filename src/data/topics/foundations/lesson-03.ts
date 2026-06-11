import type { Lesson } from '@/data/types';

export const lesson03: Lesson = {
  slug: 'setup',
  number: 3,
  title: 'Setting Up',
  objective: 'Get a working C# development environment in three commands and run your first program.',
  blocks: [
    {
      kind: 'lead',
      text:
        "Three things to install, two commands to run, one program that prints. You'll be coding in under ten minutes.",
    },
    {
      kind: 'teachingNotes',
      items: [
        "**Walk through the three installs live** — don't read; do",
        'If `dotnet --version` fails, the PATH wasn\'t picked up — **close & reopen** the terminal',
        'Create the project on the **Desktop** so students can find it easily later',
        'Show what `Program.cs` and `.csproj` look like **before** running anything',
        'End by typing the **daily cycle on the board**: write → save → `dotnet run`',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: '1. Install the tools',
    },
    {
      kind: 'list',
      items: [
        '**VS Code** — the editor. Download from `code.visualstudio.com`.',
        '**.NET SDK 8 or newer** — the C# compiler and runtime. Download from `dotnet.microsoft.com/download`.',
        '**C# Dev Kit extension** — open the Extensions panel in VS Code (Ctrl/⌘+Shift+X), search "C# Dev Kit" by Microsoft, install.',
      ],
    },
    {
      kind: 'paragraph',
      text:
        'VS Code is the workshop. The .NET SDK is the engine. The C# Dev Kit teaches VS Code what C# is — colors, autocomplete, errors as you type. You need all three.',
    },
    {
      kind: 'heading',
      level: 2,
      text: '2. Verify it works',
    },
    {
      kind: 'paragraph',
      text:
        'Open VS Code, then open a terminal (Terminal → New Terminal). Type:',
    },
    {
      kind: 'code',
      filename: 'terminal',
      language: 'bash',
      code: `dotnet --version`,
    },
    {
      kind: 'output',
      label: '▶ EXPECTED',
      output: `8.0.101`,
    },
    {
      kind: 'paragraph',
      text:
        "If you see a version number, the SDK is installed. If you see *'dotnet is not recognized'*, close VS Code, reopen it, and try again.",
    },
    {
      kind: 'heading',
      level: 2,
      text: '3. Create your first project',
    },
    {
      kind: 'code',
      filename: 'terminal',
      language: 'bash',
      code: `cd Desktop
dotnet new console -n HelloCSharp
cd HelloCSharp
dotnet run`,
    },
    {
      kind: 'output',
      output: `Hello, World!`,
    },
    {
      kind: 'paragraph',
      text:
        "`dotnet new console` creates a new console project folder. `dotnet run` compiles it and runs it in one step. You can open the folder in VS Code by typing `code .` from inside it.",
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'The daily cycle',
      text:
        'Write code → save (Ctrl/⌘+S) → `dotnet run` → see output → repeat. Every C# developer does this hundreds of times a day.',
    },
    {
      kind: 'keyTakeaways',
      items: [
        'Install **three things**: VS Code, .NET SDK 8+, C# Dev Kit extension',
        'Verify with `dotnet --version` — close & reopen the terminal if it fails',
        '`dotnet new console -n Name` **scaffolds** a project; `dotnet run` builds + runs',
        'A C# project is a folder with a `.csproj` file and at least one `.cs` file',
        'The **daily cycle**: write → save → `dotnet run` → observe → repeat',
      ],
    },
  ],
  questions: [
    {
      id: 'q1',
      kind: 'mcq',
      prompt: 'Which command creates a new C# console project?',
      options: [
        { label: '`dotnet build`' },
        { label: '`dotnet new console -n HelloCSharp`', correct: true },
        { label: '`dotnet install csharp`' },
        { label: '`csc Program.cs`' },
      ],
      explanation:
        '`dotnet new console -n HelloCSharp` scaffolds a new console project with a project file (`.csproj`) and a starter `Program.cs`.',
    },
    {
      id: 'q2',
      kind: 'fill',
      prompt: 'Fill in the missing command to compile AND run your program in one step.',
      template: `dotnet ___`,
      accept: ['run', 'run '],
      explanation:
        '`dotnet run` builds the project if needed and runs the resulting program. Use it during development; use `dotnet publish` to produce a distributable build.',
    },
    {
      id: 'q3',
      kind: 'mcq',
      prompt:
        "After installing the .NET SDK, you type `dotnet --version` in the terminal and see *'dotnet is not recognized'*. What's the first thing to try?",
      options: [
        { label: 'Reinstall Windows.' },
        { label: 'Close and reopen VS Code, then try again.', correct: true },
        { label: 'Buy a new computer.' },
        { label: 'Switch to Python.' },
      ],
      explanation:
        "The PATH environment variable gets refreshed on app restart. Closing and reopening VS Code (or your terminal) usually picks up the new SDK location.",
    },
  ],

  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Tweak Hello, World',
      prompt:
        "Open `Program.cs` in your `HelloCSharp` project. Change the message to print your name and today's date on two separate lines. Run with `dotnet run`.",
      hints: [
        'Two separate `Console.WriteLine` calls is the simplest approach.',
        'Or use `\\n` inside one string.',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Build vs run',
      prompt:
        "Run `dotnet build` and then run the produced executable directly (without `dotnet run`). On Windows: `.\\bin\\Debug\\net8.0\\HelloCSharp.exe`. On Mac/Linux: `./bin/Debug/net8.0/HelloCSharp`. Note in a comment what's different from `dotnet run`.",
      hints: [
        '`dotnet run` rebuilds if needed, then runs. Running the .exe directly skips the rebuild — faster but uses stale code if you forgot to build.',
      ],
    },
  ],
};
