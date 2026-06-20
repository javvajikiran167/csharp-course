import type { Lesson } from '@/data/types';

export const lesson04: Lesson = {
  slug: 'variables-and-types',
  number: 4,
  title: 'Variables & Types — The Idea',
  objective:
    'Understand variables as named storage and types as categories of data — the two concepts every language is built on — before meeting C#\'s exact syntax.',
  blocks: [
    {
      kind: 'lead',
      text:
        "Almost every program boils down to: keep track of some values, change them over time, and combine them. A **variable** is how we keep track of a value and give it a name. A **type** is the category that value belongs to. Master these two ideas conceptually now and C#'s syntax will feel like labelling, not learning.",
    },
    {
      kind: 'teachingNotes',
      items: [
        "Use the **labelled box** metaphor relentlessly — name on the outside, value inside, contents can change",
        'Stress that **the name stays, the value can change** — that is literally why it is called a *variable*',
        "Introduce types as **categories** (whole number, decimal, text, true/false) — defer C# keyword names to the C# topic",
        'Contrast **static typing (C#)** vs **dynamic typing (Python)** plainly: *when* the category is decided and checked',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'A variable is a labelled box',
      id: 'variables',
    },
    {
      kind: 'paragraph',
      text:
        "Imagine a box with a label written on the front. The label is the **name**; whatever you put inside is the **value**. You can look inside whenever you know the name, and you can swap the contents for something new. That is a variable. We say a variable *holds* or *stores* a value, and that assigning a new value *overwrites* the old one.",
    },
    {
      kind: 'code',
      language: 'text',
      filename: 'pseudocode.txt',
      code:
        'let score = 0          // make a box labelled "score", put 0 in it\nscore = 10             // replace the contents with 10\nscore = score + 5      // read 10, add 5, put 15 back\n// the box is still called "score"; only its contents changed',
    },
    {
      kind: 'paragraph',
      text:
        "Notice the third line: `score = score + 5` is not a contradiction, because `=` here means *'put the value on the right into the box on the left,'* not *'is equal to'* in the maths sense. The computer reads the current value (10), adds 5, and stores 15 back. The name `score` is constant; the value varies. That's the whole idea behind the word **variable**.",
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: '= means "assign", not "equals"',
      text:
        "This trips up nearly everyone at first. In almost every language, a single `=` *assigns* a value. Testing whether two things are equal uses a different symbol (in C#, `==`). Reading `=` aloud as the word 'becomes' — *'score becomes score plus 5'* — keeps it straight.",
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Types: the category of a value',
      id: 'types',
    },
    {
      kind: 'paragraph',
      text:
        "Every value belongs to a category — a **type** — and the category determines what you can sensibly do with it. You can add two numbers; you can glue two pieces of text together; adding a number to a sentence is usually a mistake. Common categories you'll meet in every language:",
    },
    {
      kind: 'list',
      items: [
        '**Whole numbers** — counts and quantities like `0`, `42`, `-7` (in C#: `int`)',
        '**Decimal numbers** — values with a fractional part like `3.14`, `19.99` (in C#: `double` or `decimal`)',
        '**Text** — sequences of characters like `"hello"`, `"Kiran"` (in C#: `string`)',
        '**True/false** — a single yes-or-no flag (in C#: `bool`)',
      ],
    },
    {
      kind: 'paragraph',
      text:
        "Why bother with categories? Because they prevent nonsense and unlock the right behaviour. `\"5\" + \"3\"` as *text* sensibly produces `\"53\"` (gluing), while `5 + 3` as *numbers* produces `8` (adding). Same symbols, different meaning — the type decides. Choosing the right type is one of the most basic and important decisions you'll make in every program.",
    },
    {
      kind: 'examples',
      intro: 'A type mismatch is a real, everyday source of bugs. Watch what `+` does depending on the types:',
      examples: [
        {
          label: 'Numbers → arithmetic',
          code: '5 + 3',
          output: '8',
        },
        {
          label: 'Text → joining',
          code: '"5" + "3"',
          output: '"53"',
        },
        {
          label: 'Mixed → trouble',
          code: '"Total: " + 8',
          output: '"Total: 8"   (the 8 gets turned into text)',
        },
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Static vs dynamic typing',
      id: 'static-dynamic',
    },
    {
      kind: 'paragraph',
      text:
        "Languages disagree about *when* a variable's type is decided and checked. This is one of the biggest differences between C# and Python, and it shapes how each feels to write.",
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Dynamic typing (Python)',
          items: [
            'A variable can hold any type, and can change type later',
            "The category is figured out as the program runs",
            'Quick to scribble; flexible',
            'Type mistakes surface only when that line actually runs — sometimes in front of a user',
          ],
        },
        {
          title: 'Static typing (C#)',
          items: [
            "A variable's type is fixed when you declare it",
            "The compiler checks every use before the program runs",
            'A little more to write up front',
            "Type mistakes are caught at your desk — the editor underlines them in red",
          ],
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Why this matters for your career',
      text:
        "Large, long-lived codebases — the kind businesses pay for — lean on static typing because it makes change *safe*. When you rename or restructure something, the compiler points at every place that needs updating. That safety net is a big part of why C# is trusted for banking, healthcare, and enterprise systems.",
    },
    {
      kind: 'keyTakeaways',
      items: [
        'A **variable** is a named box: the **name stays**, the **value can change** (`=` means *assign / becomes*, not *equals*)',
        'A **type** is a value\'s category (whole number, decimal, text, true/false) and decides what operations make sense',
        'The **same operator behaves differently** depending on types — `+` adds numbers but joins text',
        'C# is **statically typed**: types are fixed and checked *before* running, trading a little upfront effort for safety at scale',
      ],
    },
  ],
};
