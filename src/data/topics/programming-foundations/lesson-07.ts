import type { Lesson } from '@/data/types';

export const lesson07: Lesson = {
  slug: 'source-to-running',
  number: 7,
  title: 'From Source Code to a Running Program',
  objective:
    'Trace the journey from the text you type to a program the machine runs — compiling, the role of errors, and the debugging mindset — using C# as the concrete example.',
  blocks: [
    {
      kind: 'lead',
      text:
        "You write text in an editor. Somehow that becomes a running program. Understanding the steps in between — and especially where and why errors appear — turns programming from a mysterious black box into a process you can reason about and control. This lesson follows the journey, with C# as the example.",
    },
    {
      kind: 'teachingNotes',
      items: [
        'Walk the pipeline: **source → compiler → check → build → run** — draw it as a conveyor belt',
        'Distinguish the three error families: **compile-time, runtime, logic** — this vocabulary pays off all course long',
        "Frame **compile errors as a feature**, not a punishment — the compiler is a free reviewer catching mistakes early",
        "Introduce the **debugging mindset** (observe, hypothesise, test) so debugging feels methodical, not magical",
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'The journey of your code',
      id: 'pipeline',
    },
    {
      kind: 'paragraph',
      text:
        "The text you write is called **source code** — it's just a file of characters. On its own, the processor can't run it. For a compiled language like C#, a program called the **compiler** reads your source, checks it follows the language's rules, and translates it into a packaged, runnable form. Only then can it execute.",
    },
    {
      kind: 'code',
      language: 'text',
      filename: 'pipeline.txt',
      code:
        'You type C#  →  Compiler reads & checks it  →  Build succeeds  →  Program runs\n     │                      │                          │              │\n  Program.cs        catches rule-breaking         a runnable app    output\n  (just text)       BEFORE anything runs           is produced     on screen',
    },
    {
      kind: 'paragraph',
      text:
        "The critical stop is the **check** step. The compiler refuses to build a program that breaks the language's rules — a misspelled command, a type mismatch, a missing piece. This is the compiled-language advantage from Lesson 2 made concrete: many mistakes are caught *before* the program ever runs, at your desk, where they're cheap to fix.",
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'What .NET actually does (a peek ahead)',
      text:
        "C# compiles to an in-between form called IL (Intermediate Language), and the .NET runtime turns that into machine code as the program runs. That two-step design is how the *same* compiled C# can run on Windows, macOS, and Linux. You don't need the details yet — just know 'compile' for C# means 'check and package,' and .NET handles the rest.",
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Three kinds of errors',
      id: 'errors',
    },
    {
      kind: 'paragraph',
      text:
        "Errors aren't all the same, and naming the kind you're facing is half of fixing it. There are three families, and they appear at different moments in the journey.",
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Compile-time errors',
          items: [
            'Caught by the compiler, before the program runs',
            'You broke a language rule: typo, missing `;`, type mismatch',
            'The most common kind for beginners — and the friendliest',
            'The editor underlines them in red as you type',
          ],
        },
        {
          title: 'Runtime errors',
          items: [
            'Happen while the program is running',
            'The code was valid, but something went wrong: divide by zero, missing file',
            'Often show as a crash with an error message (an "exception")',
            'You learn to anticipate and handle these gracefully',
          ],
        },
      ],
    },
    {
      kind: 'paragraph',
      text:
        "The third family is the sneakiest: a **logic error**. The program compiles, runs, and produces an answer — just the *wrong* answer. You wrote `bill * percentage` but meant `bill * (percentage / 100)`. The machine did exactly what you said (Lesson 1!), which wasn't what you meant. No error message appears; only a careful check against expected results reveals it.",
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Compile errors are your friend',
      text:
        "It's tempting to feel scolded by a wall of red errors. Flip it: the compiler is a free, tireless reviewer catching your mistakes the instant you make them — long before a user could. A language that catches more at compile time (like C#) is doing you a favour. Read the message; it usually tells you the line and the problem.",
    },
    {
      kind: 'heading',
      text: 'The debugging mindset',
      level: 2,
      id: 'debugging',
    },
    {
      kind: 'paragraph',
      text:
        "When something's wrong — especially a logic error — resist the urge to randomly change things until it works. That way lies madness. Debugging is a small scientific method: **observe** what actually happens, **hypothesise** a specific cause, **test** that hypothesis by checking one thing, and repeat. Narrow the problem in half each time, like the phone-book search from Lesson 6.",
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Observe**: what did the program actually do, exactly? What did you expect instead?',
        '**Locate**: which section is responsible? Check a value partway through to split the problem in half.',
        '**Hypothesise**: form one specific guess — *"I bet `percentage` is still text here."*',
        '**Test**: change or check one thing to confirm or kill that guess. Never change several things at once.',
        '**Repeat**: each test halves the search space until the culprit is cornered.',
      ],
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'The humble print statement',
      text:
        "The oldest debugging tool is still one of the best: print a value to the screen to see what it really is at a given moment. *'I thought `total` was 110 here — let me print it… oh, it's 11.'* Showing a value mid-program is how you replace guessing with knowing. Later you'll also use a proper debugger that pauses the program and lets you inspect everything.",
    },
    {
      kind: 'keyTakeaways',
      items: [
        'Source code is **text**; a **compiler** checks and translates it into something runnable — for C#, this catches many bugs *before* the program runs',
        'Three error families: **compile-time** (rule-breaking, caught early), **runtime** (valid code, crashes while running), **logic** (wrong answer, no message)',
        'Compile errors are a **feature** — a free reviewer catching mistakes at your desk; read the message',
        'Debugging is a **method**, not luck: observe, locate, hypothesise, test *one thing*, repeat — and print values to replace guessing with knowing',
      ],
    },
  ],
};
