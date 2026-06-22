import type { Lesson } from '@/data/types';

export const lesson01: Lesson = {
  slug: 'what-is-a-program',
  number: 1,
  title: 'What Is a Program?',
  objective:
    'Understand what a computer program actually is — a precise list of instructions — and why we write software instead of doing the work by hand.',
  blocks: [
    {
      kind: 'lead',
      text:
        "Before a single line of C#, one idea has to land: a program is nothing more than a list of instructions a computer follows, exactly, in order. The computer is fast and tireless, but it is not clever. Everything that feels intelligent about software is really a human being having thought carefully, in advance, about every step.",
    },
    {
      kind: 'teachingNotes',
      items: [
        'Open with a **non-code analogy** (recipe, IKEA manual) before any tech vocabulary — students relax when they realize they already think this way',
        "Hammer the phrase **'the computer does exactly what you say, not what you mean'** — it explains 90% of beginner bugs",
        'Most of this class has used apps for years but never asked *what is happening underneath* — give them permission to ask naive questions',
        'Avoid binary/CPU detail here — that is Lesson 3. Keep it conceptual.',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'A program is a recipe',
      id: 'recipe',
    },
    {
      kind: 'paragraph',
      text:
        "Think about a recipe for making tea. It is a sequence of steps: *boil water, add a tea bag, wait three minutes, remove the bag, add milk.* A recipe has an **order** (you can't remove the bag before adding it), it has **inputs** (water, tea, milk), and it produces an **output** (a cup of tea). A computer program is the same idea, written for a machine instead of a cook.",
    },
    {
      kind: 'paragraph',
      text:
        "The difference is precision. A human cook fills in gaps automatically — you know 'add milk' means a splash, not the whole carton, and that you should use a cup, not the floor. A computer fills in *nothing*. Every assumption you forget to state becomes a bug. This is the single most important mental shift for a new programmer: **the computer does exactly what you tell it, not what you meant.**",
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'The golden rule',
      text:
        "When a program misbehaves, your first instinct should never be *'the computer is broken.'* It is almost always *'I told it to do something I didn't mean.'* Debugging is the craft of finding the gap between what you said and what you wanted.",
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Why write software at all?',
      id: 'why-software',
    },
    {
      kind: 'paragraph',
      text:
        "We write programs to do work that is too repetitive, too fast, too large, or too error-prone for a human. A bank can't have a clerk recompute every account balance by hand each night. A game can't have an artist redraw the screen sixty times a second. Software is **leverage**: you describe the work once, and the machine performs it a billion times without getting bored or making a typo on the 700-millionth run.",
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Great fit for software',
          items: [
            'Doing the same calculation on millions of records',
            'Responding to events instantly, around the clock',
            'Tasks where a single mistake is expensive (payroll, medical, flight control)',
            'Anything that must be repeated identically, forever',
          ],
        },
        {
          title: 'Where humans still win',
          items: [
            'Judgement calls with messy, unwritten rules',
            'Tasks needing genuine creativity or empathy',
            'One-off jobs where writing the program costs more than doing it by hand',
            'Deciding *what* the software should do in the first place',
          ],
        },
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'A program in plain English',
      id: 'plain-english',
    },
    {
      kind: 'paragraph',
      text:
        "Here is a complete program — a description of how to greet someone — written in ordinary words rather than any programming language. Notice it has inputs, a defined order, and an output.",
    },
    {
      kind: 'code',
      language: 'text',
      filename: 'greet.txt',
      code:
        '1. Ask the person for their name.\n2. Store the answer in a place we will call "name".\n3. Build the sentence: "Hello, " followed by name, followed by "!".\n4. Show that sentence on the screen.',
    },
    {
      kind: 'paragraph',
      text:
        "Every real program — from a calculator to an online bank — is this same shape, just longer and more detailed. In a few lessons you'll write exactly this program in C#, and it will look surprisingly close to the English version. That closeness is not an accident; programming languages are designed so humans can read them.",
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'For the Python-minded',
      text:
        "If you've seen Python, you already know this feeling — `print(\"Hello\")` is step 4 above. C# expresses the same steps; it just asks you to be a little more explicit about a few things (like the *type* of data in `name`). We'll see exactly why that explicitness pays off.",
    },
    {
      kind: 'keyTakeaways',
      items: [
        'A program is a **precise, ordered list of instructions** a computer follows literally',
        'The computer does **exactly what you say, not what you mean** — gaps in your instructions become bugs',
        'We write software for **leverage**: describe work once, run it endlessly without error or boredom',
        'Every program has the shape **input → ordered steps → output**, no matter how large',
      ],
    },
  ],
};
