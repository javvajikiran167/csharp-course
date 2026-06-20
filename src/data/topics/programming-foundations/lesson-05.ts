import type { Lesson } from '@/data/types';

export const lesson05: Lesson = {
  slug: 'logic-and-control',
  number: 5,
  title: 'How Programs Decide and Repeat',
  objective:
    'Understand the three building blocks of all program logic — sequence, decision, and repetition — and the true/false thinking that powers decisions.',
  blocks: [
    {
      kind: 'lead',
      text:
        "A stunning fact: every program ever written, from a calculator to a search engine, is built from just three kinds of control: doing steps in order, choosing between paths, and repeating steps. Master these three shapes conceptually and you can read the skeleton of any program in any language.",
    },
    {
      kind: 'teachingNotes',
      items: [
        'Name the three explicitly: **sequence, selection, repetition** — students love that *everything* reduces to three ideas',
        'Anchor decisions in **boolean thinking** (true/false) — this is the bridge to `if` statements and `bool`',
        'Use a **flowchart sketch** verbally (diamond = decision) — many learners are visual',
        'Foreshadow the **infinite loop** danger so it is a known risk, not a scary surprise, in the Loops topic',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Block 1 — Sequence: one step after another',
      id: 'sequence',
    },
    {
      kind: 'paragraph',
      text:
        "The default behaviour of every program is to run instructions top to bottom, one after another. This is **sequence**. It sounds trivial, but order is everything: you must pour the water before you can drink it, and you must read a value before you can use it. Most beginner bugs are really sequence bugs — doing things in the wrong order.",
    },
    {
      kind: 'code',
      language: 'text',
      filename: 'sequence.txt',
      code:
        'price = 100\ntax = price * 0.1\ntotal = price + tax\nshow total          // 110 — only works because the steps are in this order',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Block 2 — Selection: choosing a path',
      id: 'selection',
    },
    {
      kind: 'paragraph',
      text:
        "Programs become useful when they can make decisions: *if this is true, do that; otherwise, do something else.* This is **selection**, and it rests on **boolean logic** — every decision comes down to a question that is either true or false. *Is the balance below zero? Is the password correct? Is the user over 18?* Each is a yes/no, and the program branches on the answer.",
    },
    {
      kind: 'code',
      language: 'text',
      filename: 'selection.txt',
      code:
        'if balance < 0\n    show "Account overdrawn!"\notherwise\n    show "Balance is healthy."',
    },
    {
      kind: 'paragraph',
      text:
        "The condition `balance < 0` is a **boolean expression** — it evaluates to either true or false, and nothing else. This is exactly why the `bool` type from last lesson matters: decisions are made of trues and falses. Real programs combine them: *if the user is logged in **and** is an admin*, *if the cart is empty **or** the item is out of stock*.",
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Comparisons produce booleans',
          items: [
            '`age >= 18` → true or false',
            '`password == stored` → true or false',
            '`stock > 0` → true or false',
            '`name == ""` → true (empty) or false',
          ],
        },
        {
          title: 'Combine them with logic',
          items: [
            '**AND** — true only if *both* are true',
            '**OR** — true if *either* is true',
            '**NOT** — flips true to false and back',
            'Example: `loggedIn AND isAdmin`',
          ],
        },
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Block 3 — Repetition: doing it again',
      id: 'repetition',
    },
    {
      kind: 'paragraph',
      text:
        "The third block is **repetition** — a **loop**. Instead of writing the same step a thousand times, you describe it once and tell the computer to repeat it: *for every item in the cart, add its price to the total*, or *while there are unread messages, show the next one*. This is where the computer's tirelessness becomes leverage — it will happily repeat a step a billion times.",
    },
    {
      kind: 'code',
      language: 'text',
      filename: 'repetition.txt',
      code:
        'total = 0\nfor each item in cart\n    total = total + item.price\nshow total          // adds up any number of items with one description',
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'The infinite loop',
      text:
        "Every loop needs a way to *stop*. If the stopping condition is never met — *'keep going while x is positive,'* but x never changes — the program loops forever and freezes. This 'infinite loop' is one of the most common early mistakes. You'll learn to spot and avoid it in the Loops topic; for now, just know a loop must always make progress toward its exit.",
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Three blocks, infinite programs',
      id: 'composition',
    },
    {
      kind: 'paragraph',
      text:
        "That's the entire toolkit: **sequence, selection, repetition.** Everything else is composition — loops inside decisions inside sequences, nested as deeply as the problem requires. When you stare at a large, intimidating program later, remember it's only ever these three shapes stacked together. Reading code becomes the calm act of asking, at each line: *is this a step, a choice, or a repeat?*",
    },
    {
      kind: 'keyTakeaways',
      items: [
        'All program logic is built from three blocks: **sequence** (in order), **selection** (choose a path), **repetition** (loop)',
        'Decisions rest on **boolean logic** — conditions that evaluate to exactly **true or false**, combined with AND / OR / NOT',
        'This is why the `bool` type and comparison operators (`<`, `==`, `>=`) matter so much',
        'Every loop **must make progress toward stopping**, or it runs forever (an infinite loop)',
      ],
    },
  ],
};
