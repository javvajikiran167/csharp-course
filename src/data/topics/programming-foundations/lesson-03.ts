import type { Lesson } from '@/data/types';

export const lesson03: Lesson = {
  slug: 'how-computers-store-data',
  number: 3,
  title: 'How Computers Store Data',
  objective:
    'Build an accurate mental model of bits, bytes, and memory — enough to understand why programs have data "types" and why numbers and text are stored differently.',
  blocks: [
    {
      kind: 'lead',
      text:
        "Everything a computer holds — this sentence, a photo, your bank balance, a song — is stored as nothing but huge sequences of two symbols: 0 and 1. Understanding how that works, at a comfortable level, demystifies a surprising amount of programming, especially the idea of data 'types' that C# leans on so heavily.",
    },
    {
      kind: 'teachingNotes',
      items: [
        'The goal is **intuition, not electronics** — students need *enough* model to understand types and overflow, no more',
        "Use the **light-switch** image for a bit; **8 switches = a byte** that can show 256 patterns",
        'Connect binary directly to **why types exist**: the same bits mean different things depending on how you agree to read them',
        'Mention **overflow** lightly now so it is not a shock when a number "wraps around" later',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'The bit: one tiny switch',
      id: 'bits',
    },
    {
      kind: 'paragraph',
      text:
        "At the very bottom, a computer is millions of microscopic switches that are either **on** or **off**. We write those two states as **1** and **0**. A single switch is called a **bit**. One bit alone can't say much — just yes or no, true or false. The magic comes from lining many of them up.",
    },
    {
      kind: 'paragraph',
      text:
        "Group **8 bits** together and you have a **byte**. With 8 on/off switches you can make 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 = **256** different patterns. That's the foundational unit of nearly all computer memory. A pattern of bytes can represent a number, a letter, a colour — whatever we *agree* it represents.",
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'Binary is just counting with two symbols',
      text:
        'You count in base-10 (ten symbols, 0–9) because you have ten fingers. Computers count in base-2 (two symbols, 0–1) because switches have two states. `101` in binary is 5 in our everyday numbers: one 4, no 2s, one 1. Same quantity, different notation.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'The same bits can mean different things',
      id: 'meaning',
    },
    {
      kind: 'paragraph',
      text:
        "Here is the crucial insight. The byte `01000001` is just a pattern. Whether it *means* the number 65, or the letter 'A', or a shade of dark red, depends entirely on how the program decides to interpret it. The bits don't carry their own meaning — the program supplies it.",
    },
    {
      kind: 'paragraph',
      text:
        "This is exactly why programming languages have **types**. A type is the program's agreement about how to read a chunk of memory: *'treat these bytes as a whole number,'* or *'treat them as text,'* or *'as a true/false flag.'* Get the agreement wrong and you get nonsense — like reading a phone number as if it were a temperature.",
    },
    {
      kind: 'examples',
      intro: 'One pattern, three interpretations — the type decides which one you get:',
      examples: [
        {
          label: 'As a whole number',
          code: '01000001  →  65',
        },
        {
          label: 'As a text character',
          code: "01000001  →  'A'",
        },
        {
          label: 'As eight true/false flags',
          code: '01000001  →  off,on,off,off,off,off,off,on',
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Why C# asks for types up front',
      text:
        "Python figures out how to read your data as the program runs. C# asks you to state it in advance — `int` for a whole number, `string` for text. It's a little more typing, but it means the compiler can stop you from accidentally treating a price as a sentence before your program ever runs.",
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Memory is a wall of numbered boxes',
      id: 'memory',
    },
    {
      kind: 'paragraph',
      text:
        "Picture your computer's memory (RAM) as an enormous wall of identical boxes, each holding one byte, each with its own **address** (box #0, box #1, box #2, …). When your program stores a value, it really puts bytes into some boxes and remembers the address. A **variable** — which you'll meet next lesson — is simply a friendly name for 'the box (or boxes) where I put this value,' so you never have to remember raw addresses.",
    },
    {
      kind: 'paragraph',
      text:
        "Bigger values need more boxes. A single text character might fit in one or two bytes; a large whole number takes four or eight; a photo takes millions. When you hear that a value is a `4-byte integer`, it now means something concrete: it occupies four of those boxes, giving 2³² ≈ 4.3 billion possible patterns.",
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'A preview of overflow',
      text:
        "Because a number type has a fixed number of boxes, it has a maximum. A standard 4-byte `int` tops out near 2.1 billion. Push past the top and it can 'wrap around' to a negative — a classic, real bug (it's why some old games glitched scores). You don't need the details yet; just know that *sizes have limits* because *boxes are finite*.",
    },
    {
      kind: 'keyTakeaways',
      items: [
        'A **bit** is one on/off switch (1/0); **8 bits = 1 byte**, with 256 possible patterns',
        'Bits carry **no meaning on their own** — a **type** is the program\'s agreement on how to read them (number, text, flag)',
        'This is precisely **why C# wants types**: so it can stop you from misreading data before the program runs',
        'Memory is **numbered boxes of bytes**; a **variable** is a friendly name for the boxes holding a value — bigger values use more boxes, and fixed sizes mean fixed limits',
      ],
    },
  ],
};
