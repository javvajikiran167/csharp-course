import type { Lesson } from '@/data/types';

export const lesson01: Lesson = {
  slug: 'why-csharp',
  number: 1,
  title: 'Why C#',
  objective: 'Understand what C# is for and when to reach for it instead of another language.',
  blocks: [
    {
      kind: 'lead',
      text:
        "Python is many people's first language for a reason — it gets out of the way fast. But C# is the language behind a huge slice of professional software: games, business systems, mobile apps, cloud services. Learning it well opens doors that Python alone cannot.",
    },
    {
      kind: 'teachingNotes',
      items: [
        "Frame C# as **'professional Python with safety rails'** — most students compare to Python anyway",
        "Hit **Unity** early — every student has played a Unity game; gives instant credibility",
        "Mention **ASP.NET Core** powers Stack Overflow — a site they've used",
        "Avoid arguing *'C# is better'* — emphasize **different tradeoffs**",
        "End with the static-typing teaser so Lesson 2 (How C# Runs) has a hook",
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'What C# is built for',
      id: 'use-cases',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Games & desktop apps',
          items: [
            'Unity — the engine behind most mobile games, indie titles, and AAA games like Pokémon Go',
            'Windows desktop apps and cross-platform UI via .NET MAUI',
            'CAD plugins, simulation tools, internal Windows software',
          ],
        },
        {
          title: 'Web, cloud & business systems',
          items: [
            'ASP.NET Core — banking, e-commerce, government, healthcare, Stack Overflow itself',
            'Cloud functions and microservices on Azure, AWS, and Google Cloud',
            'Microsoft Office plugins and large enterprise back-office systems',
          ],
        },
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'C# vs Python at a glance',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'C# is…',
          items: [
            'Statically typed — you declare the type of every value',
            'Compiled — errors caught before the program runs',
            'Object-oriented from day one',
            'Stricter on day one, fewer surprises on day 100',
          ],
        },
        {
          title: 'Python is…',
          items: [
            'Dynamically typed — types figured out as code runs',
            'Interpreted — errors only show up when that line runs',
            'Multi-paradigm — OOP optional',
            'Faster to scribble, harder to refactor safely',
          ],
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'In 2026, C# runs everywhere',
      text:
        'Windows, macOS, Linux, iOS, Android, in the browser via Blazor WebAssembly, on embedded devices via .NET nanoFramework. One language, every platform.',
    },
    {
      kind: 'keyTakeaways',
      items: [
        'C# powers **Unity games**, **ASP.NET Core web apps**, and **enterprise Windows software**',
        'It is **statically typed and compiled** — types checked before the program runs',
        'Same compiled code runs on **Windows, macOS, Linux, iOS, Android, and the browser** (Blazor)',
        'Choose C# over Python when **reliability, scale, or performance** matter more than scripting speed',
      ],
    },
  ],
  questions: [
    {
      id: 'q1',
      kind: 'mcq',
      prompt: 'Which of these is NOT a typical use case for C#?',
      options: [
        { label: 'Building a Unity game' },
        { label: 'Writing an ASP.NET Core web API' },
        { label: 'Quick one-off data analysis scripts', correct: true },
        { label: 'Building a Windows desktop application' },
      ],
      explanation:
        "Quick data-analysis scripts are usually Python's home turf — pandas, NumPy, and notebooks make it faster. C# can do data work but isn't the default choice for ad-hoc analysis.",
    },
    {
      id: 'q2',
      kind: 'mcq',
      prompt:
        'You\'re building a multiplayer mobile game. Which language is the most natural choice in 2026?',
      options: [
        { label: 'Python', },
        { label: 'C# (via Unity)', correct: true },
        { label: 'Bash' },
        { label: 'HTML' },
      ],
      explanation:
        'Unity, the most popular mobile game engine in the world, is built around C#. Game logic, UI, networking — all C#.',
    },
    {
      id: 'q3',
      kind: 'mcq',
      prompt:
        "You're interviewing for a junior C# role at an e-commerce company. The interviewer asks: \"Why did your previous team choose C# over Python for the backend?\" Which answer best frames C#'s strengths?",
      options: [
        {
          label:
            "Static typing catches bugs at compile time, the .NET runtime offers strong performance and tooling, and ASP.NET Core scales to high request volumes — all important for an e-commerce backend.",
          correct: true,
        },
        {
          label: 'C# is faster to type than Python.',
        },
        {
          label: 'Python cannot do web development.',
        },
        {
          label: 'C# is the only language Microsoft supports.',
        },
      ],
      explanation:
        "The right answer ties C#'s strengths (static typing, performance, ecosystem) to the **business case** (e-commerce reliability and scale). Interviewers love when you frame technical choices in business terms — it shows you think like an engineer who works in a team, not just a language fan.",
    },
  ],

  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Hello, your name',
      prompt:
        "Make a console program that prints `Hello, your name!` where *your name* is hard-coded for now. We'll add real input in a later lesson.",
      hints: [
        'Use `Console.WriteLine`.',
        'String interpolation: `$\"Hello, {name}!\"`.',
      ],
    },
    {
      id: 'c2',
      difficulty: 'easy',
      title: 'Where could C# fit?',
      prompt:
        "Pick a piece of software you use every day. In comments at the top of a `.cs` file, write 2–3 lines on whether C# would be a sensible choice to build it (or part of it), and why.",
    },
  ],
};
