import type { Lesson } from '@/data/types';

export const lesson06: Lesson = {
  slug: 'algorithms',
  number: 6,
  title: 'Algorithms & Breaking Problems Down',
  objective:
    'Learn what an algorithm is, and practice the core professional skill of decomposing a big problem into small, ordered, solvable steps.',
  blocks: [
    {
      kind: 'lead',
      text:
        "The hard part of programming is rarely the syntax — it's the thinking. An **algorithm** is just a step-by-step method for solving a problem, and the skill of breaking a fuzzy problem into precise steps is what separates people who *can* code from people who *struggle* to. The good news: it's a learnable habit, not a talent.",
    },
    {
      kind: 'teachingNotes',
      items: [
        'Define **algorithm** with everyday examples (making toast, finding a name in a phone book) before anything technical',
        'Teach **decomposition** as the headline skill — most stuck beginners are stuck because the step is still too big',
        'Introduce **pseudocode** as thinking-on-paper, deliberately language-free',
        'Show there are **many correct algorithms** for one problem, with different trade-offs — plant the efficiency seed',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'What is an algorithm?',
      id: 'definition',
    },
    {
      kind: 'paragraph',
      text:
        "An algorithm is a finite, unambiguous, ordered set of steps that solves a problem or completes a task. You already use them constantly: a recipe is an algorithm, long division is an algorithm, the route your map app gives you is the output of an algorithm. In programming, an algorithm is the *plan*; the code is just that plan written in a language the computer accepts.",
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Plan first, type second',
      text:
        "Experienced developers spend more time thinking than typing. Working out the algorithm — on paper, in plain words — *before* writing code is not a beginner crutch; it's a professional habit. Code written without a plan is where most bugs are born.",
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Decomposition: the master skill',
      id: 'decomposition',
    },
    {
      kind: 'paragraph',
      text:
        "Faced with *'build a tip calculator,'* a beginner often freezes — the problem is too big to hold in one thought. The cure is **decomposition**: keep splitting the problem until each piece is small enough to be obvious. If a step still feels hard, it isn't small enough yet. Split again.",
    },
    {
      kind: 'paragraph',
      text:
        "Watch a vague goal turn into a concrete plan. 'Calculate a tip' becomes:",
    },
    {
      kind: 'code',
      language: 'text',
      filename: 'tip-algorithm.txt',
      code:
        '1. Ask the user for the bill amount.\n2. Ask the user for the tip percentage.\n3. Turn both answers (which arrive as text) into numbers.\n4. Compute the tip:   tip = bill * (percentage / 100)\n5. Compute the total: total = bill + tip\n6. Show the tip and the total to the user.',
    },
    {
      kind: 'paragraph',
      text:
        "Every one of those six steps is now small enough to translate into a line or two of C# later. That is the whole game: shrink each step until coding it is boring. Notice steps appear in a deliberate **sequence**, step 3 quietly handles a **type** issue (text → number), and a real version might add a **decision** ('if the bill is negative, complain'). The Topic 00 ideas are all already here.",
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Pseudocode: thinking on paper',
      id: 'pseudocode',
    },
    {
      kind: 'paragraph',
      text:
        "What you just read is **pseudocode** — code-like steps written in plain language, ignoring the exact rules of any programming language. It lets you design the logic without fighting syntax. Professionals sketch pseudocode (or just numbered notes) for anything non-trivial, then translate it. There are no strict rules; if a teammate could follow it, it's good pseudocode.",
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Many roads to the same answer',
      id: 'tradeoffs',
    },
    {
      kind: 'paragraph',
      text:
        "Most problems have several correct algorithms with different trade-offs. Suppose you must find one name in a phone book. One algorithm reads every entry from the top until it hits the name — simple, but slow for a big book. Another opens to the middle, decides which half the name is in, and repeats — far fewer steps, but only works because the book is sorted.",
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Check every entry',
          items: [
            'Start at the first name, go one by one',
            'Dead simple to describe and code',
            'For a million names, up to a million checks',
            'Works even if the list is unsorted',
          ],
        },
        {
          title: 'Split in half each time',
          items: [
            'Jump to the middle, discard the wrong half, repeat',
            'For a million names, about 20 checks',
            'Dramatically faster as data grows',
            'Requires the list to be sorted first',
          ],
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'This is what "efficiency" means',
      text:
        "Both algorithms find the name. The difference is how the work grows as the data grows — and at scale, that difference is everything. You'll meet this idea formally later (it's called Big-O), and you'll practice the 'split in half' trick by name (binary search). For now: there's usually more than one right answer, and choosing well is part of the craft.",
    },
    {
      kind: 'keyTakeaways',
      items: [
        'An **algorithm** is an ordered, unambiguous set of steps that solves a problem — the **plan** behind the code',
        '**Decomposition** is the master skill: split a problem until each step is obvious; if a step is still hard, split again',
        '**Pseudocode** lets you design logic in plain language before fighting any syntax',
        'Most problems have **several correct algorithms** with different efficiency trade-offs — choosing well is part of the craft',
      ],
    },
  ],
};
