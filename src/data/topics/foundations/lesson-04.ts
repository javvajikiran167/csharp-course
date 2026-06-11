import type { Lesson } from '@/data/types';

export const lesson04: Lesson = {
  slug: 'variables',
  number: 4,
  title: 'Variables & Types',
  objective:
    "Declare variables of every fundamental C# type with the right range and precision, convert between types safely, and know each type's default value.",
  blocks: [
    {
      kind: 'lead',
      text:
        "A variable in C# is a labelled box that holds one type of value. Picking the right type is the difference between code that works for a hobby project and code that survives production traffic — the most common interview question on types is *'which one would you use for X, and why?'*",
    },
    {
      kind: 'teachingNotes',
      items: [
        "Start with `int` range — get students to **memorize ~±2.1 billion**",
        "Always **demo integer overflow** — `int.MaxValue + 1 → MinValue` is shocking; sticks forever",
        '**`decimal` for money** is interview classic — drive it hard with the `0.1 + 0.2` demo',
        "Cover `var` **last**; don't let students lean on it as their default early",
        "`TryParse > Parse` for any user input — show both, recommend `TryParse`",
        "Default values (`0`, `false`, `null`) come up in roughly 1 in 3 interviews",
      ],
    },

    /* ── Declaration syntax ─────────────────────────────────────── */
    {
      kind: 'heading',
      level: 2,
      text: 'Declaring a variable',
    },
    {
      kind: 'paragraph',
      text:
        'Every variable declaration follows the same pattern: `type name = value;`. The semicolon is mandatory — it ends every C# statement.',
    },
    {
      kind: 'code',
      filename: 'Program.cs',
      code: `int     userScore       = 4280;
double  accountBalance  = 1250.75;
string  username        = "alex_dev";
bool    isLoggedIn      = true;
char    rank            = 'A';

Console.WriteLine($"User    : {username}");
Console.WriteLine($"Score   : {userScore}");
Console.WriteLine($"Balance : \${accountBalance}");
Console.WriteLine($"Online  : {isLoggedIn}");
Console.WriteLine($"Rank    : {rank}");`,
    },
    {
      kind: 'output',
      output: `User    : alex_dev
Score   : 4280
Balance : $1250.75
Online  : True
Rank    : A`,
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'String interpolation',
      text:
        'The `$` before a string activates *interpolation*. Anything inside `{curly braces}` is replaced by the value at runtime. Use this everywhere instead of `+` — cleaner, faster, fewer bugs.',
    },

    /* ── Integer types — the ones you'll actually use ───────── */
    {
      kind: 'heading',
      level: 2,
      text: 'Integer types — what you actually use',
    },
    {
      kind: 'paragraph',
      text:
        "C# has eight predefined integer types, but in real codebases you'll see three of them daily. Knowing the rest exists is enough; you can look up details when you need them.",
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Use these every day',
          items: [
            '**`int`** — 32-bit, −2,147,483,648 to 2,147,483,647 (~±2.1 billion). The default whole number',
            '**`long`** — 64-bit, ~±9.2 quintillion. Database IDs, file sizes, timestamps',
            '**`byte`** — 8-bit, 0 to 255. Image pixels, network buffers, file bytes',
          ],
        },
        {
          title: 'Exist but rarely seen in app code',
          items: [
            '`short` (16-bit), `sbyte` (8-bit signed) — niche, mostly interop',
            '`uint`, `ushort`, `ulong` (unsigned) — only when you need the extra positive range; the .NET style guide recommends against them in public APIs',
            "Skip until you have a specific need — don't memorize",
          ],
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: "Which integer type should I use?",
      text:
        "**Default to `int`.** It's right 95% of the time. Reach for **`long`** when values may exceed ~2 billion — database primary keys, file sizes in bytes, Unix timestamps in milliseconds. Reach for **`byte`** for binary data. That covers virtually all application code.",
    },
    {
      kind: 'code',
      filename: 'integers.cs',
      code: `// Real, everyday C# code
int    userScore     = 4280;
int    productCount  = 48;
long   userId        = 92834712345;     // database IDs grow past int range
byte   rgbRed        = 255;             // RGB channel: 0..255

Console.WriteLine($"User #{userId} scored {userScore}");

// Useful constants on every numeric type
Console.WriteLine($"int range : {int.MinValue} to {int.MaxValue}");
Console.WriteLine($"long max  : {long.MaxValue}");
Console.WriteLine($"byte max  : {byte.MaxValue}");`,
    },
    {
      kind: 'output',
      output: `User #92834712345 scored 4280
int range : -2147483648 to 2147483647
long max  : 9223372036854775807
byte max  : 255`,
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'Integer overflow is silent',
      text:
        "If a value exceeds `int.MaxValue`, C# does NOT throw — it **wraps around** to a negative number. The fix is usually to use `long` instead. The `checked` keyword exists to opt into overflow detection but is rare in production code.",
    },
    {
      kind: 'code',
      code: `int big = int.MaxValue;       // 2147483647
big = big + 1;
Console.WriteLine(big);        // -2147483648 — wrapped around!

// The fix you'll actually use: pick a bigger type
long safer = int.MaxValue;
safer = safer + 1;
Console.WriteLine(safer);      // 2147483648 — no problem`,
    },

    /* ── Floating-point types ──────────────────────────── */
    {
      kind: 'heading',
      level: 2,
      text: 'Decimal numbers — double or decimal',
    },
    {
      kind: 'paragraph',
      text:
        "Two types cover virtually all decimal numbers you'll write in everyday code. The third one (`float`) exists for memory-constrained scenarios you'll rarely hit.",
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'The two you actually use',
          items: [
            "**`double`** — the default for decimal math. ~15–17 significant digits. No suffix. Used for: distances, averages, percentages, scientific math, anything non-financial.",
            "**`decimal`** — exact decimal arithmetic. ~28–29 significant digits. Suffix `m`. Used for: **money**, prices, taxes, anything that has to total to exact cents.",
          ],
        },
        {
          title: 'And one you almost never need',
          items: [
            "`float` — 4 bytes, suffix `f`. Half the precision of `double`.",
            "Used in: 3D graphics (Unity), machine learning, very memory-constrained code.",
            "**For app code, you can ignore it.** Use `double`.",
          ],
        },
      ],
    },
    {
      kind: 'code',
      code: `// Everyday decimal math: use double
double averageScore = 87.5;
double distanceKm   = 12.4;
double percentage   = 0.085;

// Money: always decimal — note the m suffix on literals
decimal productPrice = 49.99m;
decimal taxRate      = 0.0875m;     // 8.75% sales tax
decimal total        = productPrice * (1 + taxRate);

Console.WriteLine($"Distance : {distanceKm} km");
Console.WriteLine($"Price    : \${productPrice:F2}");
Console.WriteLine($"Total    : \${total:F2}");
Console.WriteLine($"Tax      : {taxRate:P2}");`,
    },
    {
      kind: 'output',
      output: `Distance : 12.4 km
Price    : $49.99
Total    : $54.36
Tax      : 8.75%`,
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'The 0.1 + 0.2 problem',
      text:
        "`double` and `float` use binary floating-point — they cannot store `0.1` exactly. So `0.1 + 0.2` produces `0.30000000000000004`. This is fine for physics, graphics, sensor data. It is **NOT** fine for money. For currency, taxes, or anything that has to total to exact pennies, use `decimal`.",
    },
    {
      kind: 'code',
      code: `Console.WriteLine(0.1 + 0.2);            // 0.30000000000000004
Console.WriteLine(0.1m + 0.2m);          // 0.3 — exact

// Real-world: invoice total
decimal subtotal = 19.99m;
decimal taxRate  = 0.08m;
decimal total    = subtotal * (1 + taxRate);
Console.WriteLine($"Total: \${total:F2}");  // $21.59 — exact`,
    },

    /* ── Other types ──────────────────────────────── */
    {
      kind: 'heading',
      level: 2,
      text: 'bool, char, and string',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'bool — true / false',
          items: [
            '1 byte — only two possible values',
            'Use for flags, switches, conditions',
            '`isLoggedIn`, `hasError`, `isAdmin`',
          ],
        },
        {
          title: 'char — a single character',
          items: [
            '2 bytes — a UTF-16 code unit',
            '**Single quotes** — `\'A\'`, not `"A"`',
            'Escape with `\\n`, `\\t`, `\\\\`, `\\\'`',
          ],
        },
      ],
    },
    {
      kind: 'code',
      code: `bool   isActive = true;
bool   hasError = false;
char   grade    = 'A';
char   newline  = '\\n';
string firstName = "Alice";

Console.WriteLine($"Active: {isActive}, Grade: {grade}, Name: {firstName}");`,
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'Single vs double quotes',
      text:
        "`char` uses **single** quotes: `'A'`. `string` uses **double** quotes: `\"A\"`. If you write `char x = \"A\";` you get a compile error. This is the #1 typo in beginner C# code.",
    },

    /* ── Type inference ──────────────────────────── */
    {
      kind: 'heading',
      level: 2,
      text: 'Type inference with `var`',
    },
    {
      kind: 'paragraph',
      text:
        "`var` does NOT mean *'any type'*. The compiler infers the type from the value on the right and locks it in. Once locked, you can't assign a different type.",
    },
    {
      kind: 'code',
      code: `var price    = 49.99;    // inferred as double
var label    = "Pro";    // inferred as string
var quantity = 10;       // inferred as int

quantity = "ten";        // ← compile error: cannot convert string to int`,
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'When to use var',
      text:
        "Use **explicit types** while learning — they reinforce the type-thinking habit. Use **var** when the type is obvious from the right side (`var users = new List<User>();`) or when the type name is verbose. Professional codebases use both, depending on context.",
    },

    /* ── Type casting ────────────────────────────── */
    {
      kind: 'heading',
      level: 2,
      text: 'Type casting — converting between types',
    },
    {
      kind: 'paragraph',
      text:
        "Sometimes you have a value of one type and need it as another. C# offers three mechanisms — and knowing which to use is **interview-grade knowledge**.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Implicit conversion — safe, automatic',
    },
    {
      kind: 'paragraph',
      text:
        "When converting from a *smaller* type to a *larger* one with no risk of data loss, C# does it for you. No syntax needed.",
    },
    {
      kind: 'code',
      code: `int  small = 42;
long big   = small;      // implicit: int → long is always safe
double d   = small;      // implicit: int → double is always safe

Console.WriteLine($"long: {big}, double: {d}");`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Explicit conversion (cast) — you ask for it',
    },
    {
      kind: 'paragraph',
      text:
        "When the conversion *might* lose data, you have to ask explicitly with a cast: `(targetType)value`.",
    },
    {
      kind: 'code',
      code: `double exact = 3.99;
int    truncated = (int)exact;     // 3 (decimal dropped, NOT rounded)

long   huge = 9000000000L;
int    spillover = (int)huge;      // wraps — data lost silently

Console.WriteLine($"{truncated}");   // 3
Console.WriteLine($"{spillover}");`,
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Parse — converting strings to numbers',
    },
    {
      kind: 'code',
      code: `string input = "42";

// Three ways — they differ in how they fail:
int n1 = int.Parse(input);              // throws FormatException on bad input
int n2 = Convert.ToInt32(input);        // also throws — returns 0 if input is null
bool ok = int.TryParse(input, out int n3); // returns false on bad input; n3 = 0

Console.WriteLine($"{n1}, {n2}, ok={ok}, n3={n3}");`,
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Production tip — prefer TryParse for user input',
      text:
        "`int.Parse(\"abc\")` throws an exception that you'd have to wrap in try/catch. `int.TryParse(\"abc\", out var n)` returns `false` cleanly. **The TryParse pattern is everywhere in production .NET code** — and it's what interviewers expect to see.",
    },

    /* ── Default values ────────────────────────── */
    {
      kind: 'heading',
      level: 2,
      text: 'Default values',
    },
    {
      kind: 'paragraph',
      text:
        "Every type has a default value used when a variable is declared but not assigned (in some contexts) — and asked about in roughly 1 in 3 C# interviews.",
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Numeric & bool',
          items: [
            'All integer types → `0`',
            'All floating-point types → `0.0`',
            '`bool` → `false`',
            '`char` → `\'\\0\'` (the null character)',
          ],
        },
        {
          title: 'String & reference types',
          items: [
            '`string` → `null`',
            'Any class type → `null`',
            'Arrays → `null`',
            "You can write `default(T)` or just `default` to get any type's default",
          ],
        },
      ],
    },
    {
      kind: 'code',
      code: `int    n      = default;    // 0
double d      = default;    // 0.0
bool   flag   = default;    // false
string text   = default;    // null (no quotes!)

Console.WriteLine($"n={n}, d={d}, flag={flag}, text={text ?? "<null>"}");`,
    },
    {
      kind: 'output',
      output: `n=0, d=0, flag=False, text=<null>`,
    },
    {
      kind: 'keyTakeaways',
      items: [
        'Default integer type is **`int`** (~±2.1 billion); use **`long`** for IDs, file sizes, or counts above that',
        '**`double`** for general decimals; **`decimal` for money** (suffix `m`) — exact, no `0.1 + 0.2` bug',
        '`int` overflow wraps silently — if a value might exceed ~2 billion, use `long` from the start',
        '`char` uses single quotes `\'A\'`; `string` uses double quotes `"A"` — never the other way',
        '`var` lets the compiler infer the type — it still locks to one type, it is not "anything"',
        'Prefer **`int.TryParse`** for user input; `int.Parse` throws on bad input',
        'Default values: numeric → `0`, `bool` → `false`, `string` and any reference type → `null`',
      ],
    },
  ],

  questions: [
    {
      id: 'q1',
      kind: 'predict',
      prompt: 'What does this code print? (Note the integer overflow.)',
      code: `int x = int.MaxValue;   // 2,147,483,647
x = x + 1;
Console.WriteLine(x);`,
      options: [
        { label: '2147483648' },
        { label: '-2147483648', correct: true },
        { label: '0' },
        { label: 'Throws OverflowException at runtime' },
      ],
      explanation:
        "`int.MaxValue` is 2,147,483,647. Adding 1 wraps to `int.MinValue` = −2,147,483,648 silently — C# does not throw by default. The everyday fix is to use `long` instead of `int` when you expect large values.",
    },
    {
      id: 'q2',
      kind: 'mcq',
      prompt:
        "You're building a payments system that needs to total exact penny amounts. Which type should you use for `Amount`?",
      options: [
        { label: '`float` — it\'s fast' },
        { label: '`double` — it\'s the default for decimals' },
        { label: '`decimal` — it\'s exact for base-10 arithmetic', correct: true },
        { label: '`int` — store cents and multiply' },
      ],
      explanation:
        "`decimal` is the only built-in type that represents decimal fractions exactly. `double` and `float` use binary floating-point, so `0.1 + 0.2 = 0.30000000000000004`. For money, always `decimal`. The `int`-storing-cents trick works too but is harder to read and audit.",
    },
    {
      id: 'q3',
      kind: 'predict',
      prompt: 'What is the value of `n` after this code runs?',
      code: `double price = 3.99;
int n = (int)price;
Console.WriteLine(n);`,
      options: [
        { label: '4 (rounded)' },
        { label: '3 (truncated)', correct: true },
        { label: '3.99' },
        { label: 'Compile error' },
      ],
      explanation:
        "Casting a floating-point value to `int` **truncates** — the decimal part is dropped, not rounded. `3.99` → `3`. To round, use `(int)Math.Round(price)` which gives `4`.",
    },
  ],

  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Pick the right type',
      prompt:
        "For each scenario, declare a variable with the most appropriate type and a sensible name. Justify each in a comment. (1) The current temperature in Celsius. (2) Whether a user is an admin. (3) A user's age. (4) The exact balance of a bank account. (5) The number of bytes in a 10 GB file.",
      hints: [
        'Use `double` for measurements where precision matters but exact decimals don\'t.',
        'Use `decimal` only when exact decimal arithmetic matters.',
        'A 10 GB file in bytes exceeds `int.MaxValue` — pick accordingly.',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Safe input parser',
      prompt:
        "Write a program that asks the user for their age. If they enter something that isn't a valid whole number, print *'That's not a valid age.'* and exit cleanly. If it's valid, print *'Next year you will be X.'*.",
      hints: [
        'Read a line of text with `string? input = Console.ReadLine();` — full coverage comes in Lesson 7.',
        'Use `int.TryParse` — not `int.Parse`.',
        'TryParse signature: `bool int.TryParse(string s, out int result)`.',
        'A `return;` at the top level exits the program.',
      ],
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'Money totals — int, double, decimal compared',
      prompt:
        "Add `0.10 + 0.20 + 0.30` three different ways: as `double`, as `decimal`, and as `int` cents (i.e. `10 + 20 + 30` then divide by 100). Print each result twice — once plain with `Console.WriteLine(sum)`, and once with `:F17` — to see exactly where `double` drifts. Comment on what each version teaches you about choosing the right type for money.",
      hints: [
        '`double` will produce something like `0.6000000000000001` when printed plain with `Console.WriteLine`.',
        '`decimal` gives an exact `0.6000`.',
        'Cents-as-int avoids the issue entirely but requires conversion at display time.',
      ],
    },
  ],
};
