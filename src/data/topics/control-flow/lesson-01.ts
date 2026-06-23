import type { Lesson } from '@/data/types';

export const lesson01: Lesson = {
  slug: 'booleans',
  number: 1,
  title: 'Booleans & Comparisons',
  objective:
    'Form the true/false expressions that every `if`, `while`, and ternary in your code will depend on.',
  blocks: [
    {
      kind: 'lead',
      text:
        'Every decision in your program — whether to send the email, whether to charge a card, whether to show a button — comes down to a `bool`. Three comparison operators and one truth value are the entire foundation.',
    },
    {
      kind: 'teachingNotes',
      items: [
        '**Define the `bool` type first** — only two values, no nuance',
        'Walk through the **six comparison operators** in pairs: `<` `>` then `<=` `>=` then `==` `!=`',
        '**`==` for value types is fine; for reference types it compares references** — tease the deeper OOP lesson',
        'Demo `bool.Parse("true")` so students know strings can become bools too',
        'End with a single bool expression that combines `&&`, `||`, `!` — the bridge to `if`',
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The `bool` type — exactly two values',
    },
    {
      kind: 'paragraph',
      text:
        'A `bool` holds **`true`** or **`false`** and nothing else. No `null`, no `0`, no `"yes"`. C# does not auto-convert numbers to booleans the way C does — `if (1)` is a compile error.',
    },
    {
      kind: 'code',
      filename: 'booleans.cs',
      code: `bool isLoggedIn = true;
bool hasError   = false;

Console.WriteLine(isLoggedIn);   // True
Console.WriteLine(hasError);     // False
Console.WriteLine(typeof(bool)); // System.Boolean

// Parsing a string into a bool:
bool parsed = bool.Parse("true");      // true (case-insensitive)
bool ok     = bool.TryParse("yes", out bool result);  // ok = false`,
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: '`bool.Parse` only accepts "true" and "false"',
      text:
        'It is **case-insensitive** but strict: `"True"`, `"TRUE"`, `"false"` all work. `"yes"`, `"1"`, `"on"` all throw. Use `bool.TryParse` if the input might be anything else.',
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The six comparison operators',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Magnitude',
          items: [
            '`<` less than',
            '`>` greater than',
            '`<=` less than or equal',
            '`>=` greater than or equal',
          ],
        },
        {
          title: 'Equality',
          items: [
            '`==` equal',
            '`!=` not equal',
            'Each comparison returns a `bool`',
            'Comparisons can be **chained with logical operators** but not stacked like `a < b < c` (that is a compile error)',
          ],
        },
      ],
    },
    {
      kind: 'examples',
      intro:
        'Five short examples — each shows a comparison and the boolean it produces:',
      examples: [
        {
          label: 'Age check',
          code: `int age = 17;
bool isAdult = age >= 18;
Console.WriteLine(isAdult);`,
          output: `False`,
        },
        {
          label: 'Exact match',
          code: `string role = "admin";
bool isAdmin = role == "admin";
Console.WriteLine(isAdmin);`,
          output: `True`,
        },
        {
          label: 'Range check (combined)',
          code: `int temp = 22;
bool comfortable = temp >= 18 && temp <= 26;
Console.WriteLine(comfortable);`,
          output: `True`,
        },
        {
          label: 'Negation',
          code: `bool hasError = false;
bool noError = !hasError;
Console.WriteLine(noError);`,
          output: `True`,
        },
        {
          label: 'Chained — but with &&, not stacked',
          code: `int score = 85;
// WRONG: bool good = 60 < score < 90;   // does not compile
bool good = score > 60 && score < 90;
Console.WriteLine(good);`,
          output: `True`,
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: '`=` assigns, `==` compares',
      text:
        'Typing `if (count = 5)` is a **compile error** in C# — `count = 5` produces an `int`, not a `bool` (CS0029), so the compiler saves you (unlike C). But beware bools: `if (isReady = true)` **compiles** and silently assigns `true` to `isReady` before testing it — a real bug. If a condition contains a single `=`, stop and look twice.',
    },

    {
      kind: 'heading',
      level: 2,
      text: '`==` vs `.Equals()` — the classic gotcha',
    },
    {
      kind: 'paragraph',
      text:
        'For **value types** (int, double, bool, char) and `string`, `==` compares values. For **other reference types** (classes you write, arrays, lists), the built-in `==` compares **references** — *do both variables point to the same object?* — not contents.',
    },
    {
      kind: 'code',
      code: `// Value types & strings — == compares the value
int a = 5, b = 5;
Console.WriteLine(a == b);          // True

string s1 = "hi";
string s2 = "hi";
Console.WriteLine(s1 == s2);        // True (C# overloads == for strings)

// Reference types — == is reference equality by default
int[] arr1 = { 1, 2, 3 };
int[] arr2 = { 1, 2, 3 };
Console.WriteLine(arr1 == arr2);    // False — different arrays in memory
Console.WriteLine(arr1.SequenceEqual(arr2));  // True (content comparison)`,
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'Interview-classic question',
      text:
        '"What does `==` compare for reference types?" Answer: **reference identity by default**. Custom classes can override `Equals` and `==` to compare contents instead — you will see this in the OOP topic.',
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'Never compare doubles with `==`',
      text:
        '`0.1 + 0.2 == 0.3` is **false** in C# — binary floating-point cannot store those values exactly (the 0.1 + 0.2 money problem from Foundations Lesson 4). Compare with a tolerance instead: `Math.Abs(a - b) < 1e-9`, or use `decimal` when exact values matter. Raw `==` on `double`/`float` is an instant code-review reject — and a favorite interview trap.',
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Coming from Python?',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Logic & truth',
          items: [
            'Python `and` → C# `&&`',
            'Python `or` → C# `||`',
            'Python `not x` → C# `!x`',
            'Python `True`/`False` → C# `true`/`false` (lowercase)',
          ],
        },
        {
          title: 'Math operators',
          items: [
            'Python `**` → C# `Math.Pow(a, b)` (returns a `double`)',
            'Python `//` floor division → C# integer division: `int / int` already truncates',
            'Comparisons return a `bool`, exactly like Python',
            'No chaining: `0 < x < 10` is a compile error — use `0 < x && x < 10`',
          ],
        },
      ],
    },

    {
      kind: 'keyTakeaways',
      items: [
        '**`bool` holds exactly `true` or `false`** — never `null`, never a number, no implicit conversion',
        'Six comparison operators: **`<` `>` `<=` `>=` `==` `!=`** — each returns a `bool`',
        '**Cannot chain comparisons** like `a < b < c` — combine with `&&` instead',
        'For value types and `string`, `==` compares **values**; for other reference types it compares **references**',
        'Use **`SequenceEqual`** for arrays/lists, **`.Equals`** when types override it, **`==`** for primitives',
      ],
    },
  ],
};
