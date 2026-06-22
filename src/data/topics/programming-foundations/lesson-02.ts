import type { Lesson } from '@/data/types';

export const lesson02: Lesson = {
  slug: 'what-is-a-language',
  number: 2,
  title: 'What Is a Programming Language?',
  objective:
    'Understand why we need programming languages at all, and the difference between the code you write and the instructions a machine actually runs.',
  blocks: [
    {
      kind: 'lead',
      text:
        "A computer's processor only understands one thing: numbers — patterns of on and off. Nobody wants to write software in raw numbers, so we invented programming languages: a readable middle ground between how humans think and what machines execute. Understanding that gap is the key to understanding everything that follows.",
    },
    {
      kind: 'teachingNotes',
      items: [
        'Show the **machine-code horror** (a screen of hex) for ten seconds — it makes the value of high-level languages visceral',
        'Define **high-level vs low-level** as *distance from the hardware*, not *quality*',
        'Plant the **compiled vs interpreted** seed here; Lesson 7 pays it off with how C# actually runs',
        'Students often think a language *is* the tool (Visual Studio). Separate **language** (the rules) from **tooling** (the programs that process it).',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Machines speak numbers, humans speak ideas',
      id: 'the-gap',
    },
    {
      kind: 'paragraph',
      text:
        "Deep down, a processor executes **machine code** — instructions encoded as numbers, like `10110000 01100001`. It is technically possible to program this way, and the very first programmers did. It is also miserable, unreadable, and almost impossible to get right. A programming language exists to close the distance between that and a human thought like *'add these two prices together.'*",
    },
    {
      kind: 'paragraph',
      text:
        "A programming language is really two things: a **vocabulary and grammar** (the keywords and rules you're allowed to write) and a **translator** (a program that turns what you wrote into something the machine can run). When people say 'C#,' they usually mean both the rules of the language and the .NET tooling that translates and runs it.",
    },
    {
      kind: 'heading',
      level: 2,
      text: 'High-level vs low-level',
      id: 'levels',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Low-level languages',
          items: [
            'Close to the hardware — you manage memory and registers yourself',
            'Examples: machine code, assembly, and (partly) C',
            'Fast and precise, but slow to write and easy to get dangerously wrong',
            'Used where every nanosecond or byte matters: drivers, embedded chips',
          ],
        },
        {
          title: 'High-level languages',
          items: [
            'Close to human thinking — the language handles the fiddly hardware details',
            'Examples: C#, Python, Java, JavaScript',
            'Slower per instruction, but vastly faster to write and safer',
            'Used for almost everything: apps, websites, games, business systems',
          ],
        },
      ],
    },
    {
      kind: 'paragraph',
      text:
        "C# is a high-level language, like Python. You'll write `price + tax` and never think about which slice of memory holds the result. That convenience is the entire point: it lets you spend your attention on the *problem* instead of the *plumbing*.",
    },
    {
      kind: 'heading',
      level: 2,
      text: 'The same idea in three languages',
      id: 'comparison',
    },
    {
      kind: 'examples',
      intro:
        "Here is 'show a greeting on the screen' in three high-level languages. Look how similar they are — once you can think in one, the others are mostly new spelling, not new ideas.",
      examples: [
        {
          label: 'Python',
          code: 'print("Hello!")',
        },
        {
          label: 'JavaScript',
          code: 'console.log("Hello!");',
        },
        {
          label: 'C#',
          code: 'Console.WriteLine("Hello!");',
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'Why so many languages?',
      text:
        "Different jobs favour different trade-offs. Python optimises for quick scripting and data work; JavaScript runs in every web browser; C# balances safety, speed, and a huge ecosystem for apps, games, and back-end services. There is no 'best' language — only the best fit for a task and a team.",
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Compiled vs interpreted (a first look)',
      id: 'compiled-interpreted',
    },
    {
      kind: 'paragraph',
      text:
        "Languages get translated to machine instructions in one of two broad styles. **Interpreted** languages (like classic Python) translate and run your code line by line, as the program runs. **Compiled** languages translate the whole program *ahead of time* into a packaged form, which is then run. C# is compiled — and that single fact is the reason it can catch many mistakes before the program ever starts. We'll see exactly how in Lesson 7.",
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'This is C#\'s superpower',
      text:
        "Because C# is compiled and checks your code first, a whole category of bugs — misspelled names, mismatched data, missing pieces — is caught at your desk with a red squiggle, instead of crashing in front of a user. Python often finds those same bugs only when that exact line happens to run.",
    },
    {
      kind: 'keyTakeaways',
      items: [
        'Processors run **machine code** (numbers); programming languages are the **readable layer** above it plus a **translator**',
        '**High-level** means *far from the hardware* (C#, Python) — easier and safer; **low-level** means *close to it* (assembly) — faster but harder',
        'Most languages express the **same ideas** with different spelling — learning to *think* in code transfers everywhere',
        'C# is **compiled and checked ahead of time**, which catches many bugs before the program runs',
      ],
    },
  ],
};
