import type { Lesson } from '@/data/types';

export const lesson05: Lesson = {
  slug: 'arithmetic',
  number: 5,
  title: 'Operators',
  objective:
    'Master the four operator families — arithmetic, assignment, comparison, logical — and avoid the integer-division trap that catches every beginner exactly once.',
  blocks: [
    {
      kind: 'lead',
      text:
        "C# operators come in four families. Most are obvious. A handful — integer division, short-circuit evaluation, the difference between `==` and `Equals` — are interview classics. Let's cover them all.",
    },
    {
      kind: 'teachingNotes',
      items: [
        '**Integer division trap first** — `100 / 3 = 33` burns every beginner once; do it now',
        'Cover the **four families in order**: arithmetic → assignment → comparison → logical',
        '**`&&` short-circuits** — demo `obj != null && obj.X` to show why it matters',
        'Drive the **compound assignment** point — `+=`, `-=`, etc. — and the accumulator pattern (init at 0, loop, `+=`)',
        'End on **operator precedence**: when in doubt, **parenthesize for readability**',
      ],
    },

    /* ── Arithmetic ─────────────────────────────────────────── */
    {
      kind: 'heading',
      level: 2,
      text: '1. Arithmetic operators',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Five basic operators',
          items: [
            '`+` addition',
            '`-` subtraction',
            '`*` multiplication',
            '`/` division',
            '`%` remainder (modulo)',
          ],
        },
        {
          title: 'Math class — frequently asked',
          items: [
            '`Math.Pow(2, 10)` → 1024.0',
            '`Math.Sqrt(16)` → 4.0',
            '`Math.Abs(-7)` → 7',
            '`Math.Round(3.5)` → 4 (banker\'s rounding)',
            '`Math.Min(a, b)`, `Math.Max(a, b)`',
          ],
        },
      ],
    },
    {
      kind: 'code',
      filename: 'arithmetic.cs',
      code: `int length = 50;
int width  = 30;

int area      = length * width;
int perimeter = 2 * (length + width);
int remainder = 17 % 5;   // 2 (17 = 3*5 + 2)

Console.WriteLine($"Area      : {area}");
Console.WriteLine($"Perimeter : {perimeter}");
Console.WriteLine($"17 % 5    : {remainder}");`,
    },
    {
      kind: 'output',
      output: `Area      : 1500
Perimeter : 160
17 % 5    : 2`,
    },

    /* ── Math class methods — shown in action ────────── */
    {
      kind: 'heading',
      level: 3,
      text: 'The Math class — power, square root, rounding',
    },
    {
      kind: 'paragraph',
      text:
        'When you need something beyond the basic operators, the static `Math` class has it. The five you will use most:',
    },
    {
      kind: 'code',
      filename: 'math-class.cs',
      code: `// Math.Pow(base, exponent) → double
Console.WriteLine(Math.Pow(2, 10));      // 1024
Console.WriteLine(Math.Pow(5, 3));       // 125

// Math.Sqrt(number) → double
Console.WriteLine(Math.Sqrt(16));        // 4
Console.WriteLine(Math.Sqrt(2));         // 1.4142135623730951

// Math.Abs(number) → absolute value
Console.WriteLine(Math.Abs(-7));         // 7
Console.WriteLine(Math.Abs(-3.14));      // 3.14

// Math.Round(number) — banker's rounding (rounds .5 to nearest even)
Console.WriteLine(Math.Round(3.4));      // 3
Console.WriteLine(Math.Round(3.5));      // 4
Console.WriteLine(Math.Round(2.5));      // 2  ← banker's: rounds to even
Console.WriteLine(Math.Round(3.14159, 2)); // 3.14 — 2 decimal places

// Math.Min / Math.Max
Console.WriteLine(Math.Min(7, 3));       // 3
Console.WriteLine(Math.Max(7, 3));       // 7`,
    },
    {
      kind: 'output',
      output: `1024
125
4
1.4142135623730951
7
3.14
3
4
2
3.14
3
7`,
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Try it yourself',
      text:
        'Compute the diagonal of a 3-by-4 rectangle using `Math.Sqrt(width * width + height * height)`. The answer is exactly **5** (a 3-4-5 right triangle). Try other dimensions and confirm the math.',
    },

    /* ── Division trap ────────────────────────────── */
    {
      kind: 'heading',
      level: 2,
      text: '⚠ The integer-division trap',
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'C# silently drops the decimal',
      text:
        "When both operands of `/` are integers, C# returns an integer. The decimal is **dropped, not rounded**. `100 / 3 == 33`, not `33.33`. This appears in **every** intro C# interview.",
    },
    {
      kind: 'code',
      filename: 'division.cs',
      code: `int totalItems = 100;
int boxes      = 3;

int perBox    = totalItems / boxes;   // 33  (not 33.33!)
int leftover  = totalItems % boxes;   // 1

// Fix: make at least one side floating-point
double exact     = (double)totalItems / boxes;     // 33.333...
double exactToo  = totalItems / 3.0;                // also works
Console.WriteLine($"perBox  : {perBox}");
Console.WriteLine($"exact   : {exact:F2}");`,
    },
    {
      kind: 'output',
      output: `perBox  : 33
exact   : 33.33`,
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'How to remember',
      text:
        '**`int / int → int`**. If either side is a `double` (or `float`/`decimal`), the result is that floating-point type. To force a decimal result, cast one side: `(double)a / b`, or write a literal like `100.0`.',
    },

    /* ── Assignment & compound assignment ───────────── */
    {
      kind: 'heading',
      level: 2,
      text: '2. Assignment operators',
    },
    {
      kind: 'paragraph',
      text:
        "The `=` operator stores a value. The **compound assignment** operators combine an arithmetic op with assignment — shorter and easier to read once you know them.",
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Compound assignment',
          items: [
            '`x += 5` is shorthand for `x = x + 5`',
            '`x -= 5`',
            '`x *= 2`',
            '`x /= 2`',
            '`x %= 3`',
          ],
        },
        {
          title: 'Increment & decrement',
          items: [
            '`x++` and `x--` — add or subtract 1; used by themselves in `for` loops and counters',
            'There is also `++x` / `--x` (pre-increment) — same effect on `x`, returns the new value instead of the old',
            'In real code, **always use them as standalone statements** — `i++;` not `int b = i++;`',
            'Mixing them inside expressions makes code hard to read and is a common code-review reject',
          ],
        },
      ],
    },
    {
      kind: 'code',
      filename: 'assignment.cs',
      code: `// What you'll write every day
int score = 100;
score += 50;       // score = 150
score *= 2;        // score = 300

int count = 0;
count++;           // count = 1
count++;           // count = 2

Console.WriteLine($"score: {score}, count: {count}");`,
    },
    {
      kind: 'output',
      output: `score: 300, count: 2`,
    },

    /* ── Comparison ─────────────────────────────────── */
    {
      kind: 'heading',
      level: 2,
      text: '3. Comparison operators',
    },
    {
      kind: 'paragraph',
      text:
        'Comparison operators always return a `bool`. They are the building blocks of every `if` statement.',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'The six comparisons',
          items: [
            '`==` equal to',
            '`!=` not equal to',
            '`<` less than',
            '`>` greater than',
            '`<=` less than or equal',
            '`>=` greater than or equal',
          ],
        },
        {
          title: 'Returns true/false',
          items: [
            '`5 == 5` → true',
            '`5 != 6` → true',
            '`"alice" == "alice"` → true',
            '`null == null` → true',
            'Comparisons are used in `if`, `while`, ternary, LINQ filters',
          ],
        },
      ],
    },
    {
      kind: 'code',
      code: `int age = 25;
bool isAdult     = age >= 18;
bool isTeen      = age >= 13 && age <= 19;
bool isExactly42 = age == 42;

Console.WriteLine($"adult: {isAdult}");
Console.WriteLine($"teen : {isTeen}");
Console.WriteLine($"42   : {isExactly42}");`,
    },
    {
      kind: 'output',
      output: `adult: True
teen : False
42   : False`,
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Try it yourself',
      text:
        'Set `age = 16` and re-run. Predict which boolean changes, then check. Then try `age = 13` — is `isTeen` still true?',
    },
    {
      kind: 'callout',
      tone: 'note',
      title: '`==` vs `.Equals()` — interview classic',
      text:
        "For value types (int, double, bool, etc.) `==` and `.Equals()` are essentially the same — they compare values. For strings, C# overloads `==` so it also compares characters. For other reference types, `==` compares **references** (do both variables point to the same object?) while `.Equals()` can be overridden to compare contents. You'll dig deeper into this in the OOP topic.",
    },

    /* ── Logical ────────────────────────────────── */
    {
      kind: 'heading',
      level: 2,
      text: '4. Logical operators',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: 'Logical operators',
          items: [
            '`&&` AND — both must be true',
            '`||` OR — either must be true',
            '`!` NOT — flips true ↔ false',
            '`^` XOR — exactly one must be true',
          ],
        },
        {
          title: 'Short-circuit evaluation',
          items: [
            '`&&` stops as soon as left side is false',
            '`||` stops as soon as left side is true',
            "This means `if (user != null && user.IsAdmin)` won't crash even if `user` is null",
            'Interview-favorite: explain why `&` and `&&` differ',
          ],
        },
      ],
    },
    {
      kind: 'code',
      filename: 'logical-truth-table.cs',
      code: `// All four logical operators, shown side-by-side
bool a = true;
bool b = false;

Console.WriteLine($"a && b : {a && b}");   // AND  — both true?
Console.WriteLine($"a || b : {a || b}");   // OR   — at least one?
Console.WriteLine($"!a     : {!a}");        // NOT  — flip
Console.WriteLine($"a ^ b  : {a ^ b}");    // XOR  — exactly one?
Console.WriteLine($"a ^ a  : {a ^ a}");    // both true → XOR is false`,
    },
    {
      kind: 'output',
      output: `a && b : False
a || b : True
!a     : False
a ^ b  : True
a ^ a  : False`,
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: 'Try it yourself',
      text:
        'Make `b = true` and predict each line before running. XOR (`^`) is the only one many developers forget — it returns `true` when **exactly one** of the operands is `true`. Real-world use: "the user can pay with cash OR card, but not both" → `payCash ^ payCard`.',
    },
    {
      kind: 'paragraph',
      text:
        'And here is the **null-safe pattern** that makes `&&` so useful in everyday code:',
    },
    {
      kind: 'code',
      code: `int age = 25;
bool hasLicense = true;

if (age >= 18 && hasLicense)
{
    Console.WriteLine("Can drive.");
}

string? input = null;
// Safe: short-circuits before checking .Length
if (input != null && input.Length > 0)
{
    Console.WriteLine("Has input");
}
else
{
    Console.WriteLine("No input");
}`,
    },
    {
      kind: 'output',
      output: `Can drive.
No input`,
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: '`&` vs `&&` — both work, only one short-circuits',
      text:
        "`a && b` skips evaluating `b` if `a` is false. `a & b` always evaluates both sides. **Always prefer `&&` and `||`** in everyday code — they avoid null-reference crashes and divide-by-zero accidents. `&` and `|` exist for bitwise operations on integers, where both sides must always run.",
    },

    /* ── Precedence ────────────────────────────── */
    {
      kind: 'heading',
      level: 2,
      text: 'Operator precedence — the order things happen',
    },
    {
      kind: 'paragraph',
      text:
        "When multiple operators appear in one expression, C# follows a precedence table. The full table has 14 levels — but for daily code, only these matter:",
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Parentheses** — `( )` always win',
        '**Unary** — `!`, `-`, `++`, `--`',
        '**Multiplicative** — `*`, `/`, `%`',
        '**Additive** — `+`, `-`',
        '**Comparison** — `<`, `>`, `<=`, `>=`',
        '**Equality** — `==`, `!=`',
        '**Logical AND** — `&&`',
        '**Logical OR** — `||`',
        '**Assignment** — `=`, `+=`, etc. (last)',
      ],
    },
    {
      kind: 'callout',
      tone: 'tip',
      title: "When in doubt, parenthesize",
      text:
        "Nobody memorizes the full precedence table. Smart developers add parentheses to make intent obvious — `a + (b * c)` says explicitly what `a + b * c` only implies. Code is read 10× more than it's written.",
    },
    {
      kind: 'code',
      code: `// Without parens — relies on operator precedence
int result1 = 2 + 3 * 4;
Console.WriteLine(result1);   // 14  (* binds tighter than +)

// With parens — intent is obvious
int result2 = (2 + 3) * 4;
Console.WriteLine(result2);   // 20

// Compound expression in an if
int age = 25;
bool ok = age >= 18 && age <= 65 || age == 0;
// Equivalent — but readable:
bool okClear = (age >= 18 && age <= 65) || age == 0;
Console.WriteLine($"ok: {ok}, okClear: {okClear}");`,
    },
    {
      kind: 'output',
      output: `14
20
ok: True, okClear: True`,
    },
    {
      kind: 'keyTakeaways',
      items: [
        '**Integer division drops the decimal** — `100 / 3 = 33`, not `33.33`',
        'To get a decimal result, cast one operand to `double` or use a `.0` literal',
        '**Compound assignment**: `+=`, `-=`, `*=`, `/=`, `%=` are shorthand for `x = x op value`',
        '**`x++` and `x--`** add or subtract 1 — use them as standalone statements (`count++;`), not inside larger expressions',
        '**`&&` and `||` short-circuit** — `a && b` skips `b` if `a` is false; safe for null checks',
        '`&` and `|` (single) **never** short-circuit — they\'re for bitwise math, not boolean logic',
        '**When precedence is unclear, parenthesize** — readability beats clever density',
      ],
    },
  ],

  questions: [
    {
      id: 'q1',
      kind: 'predict',
      prompt: 'What does this print?',
      code: `int x = 7;
int y = 2;
Console.WriteLine(x / y);
Console.WriteLine(x % y);`,
      options: [
        { label: '3.5\\n1' },
        { label: '3\\n1', correct: true },
        { label: '4\\n0' },
        { label: '3\\n0' },
      ],
      explanation:
        "`int / int = int` (decimal dropped), so `7 / 2 = 3`. `7 % 2 = 1` (the remainder). To get `3.5`, you'd need `(double)x / y`.",
    },
    {
      id: 'q2',
      kind: 'predict',
      prompt:
        "This code reads user input. What happens if the user enters nothing (null)?",
      code: `string? input = Console.ReadLine();
if (input != null && input.Length > 0)
{
    Console.WriteLine("Got something");
}
else
{
    Console.WriteLine("Empty");
}`,
      options: [
        { label: 'Throws NullReferenceException' },
        { label: 'Prints "Empty" — no crash', correct: true },
        { label: 'Prints "Got something"' },
        { label: 'Compile error' },
      ],
      explanation:
        "`&&` is short-circuit — if `input != null` is `false`, C# never evaluates `input.Length`, so no NullReferenceException. This is why you always write the null check **before** the property access.",
    },
    {
      id: 'q3',
      kind: 'predict',
      prompt:
        "What's the value of `total` after this typical accumulator pattern runs?",
      code: `int total = 0;
int[] sales = { 120, 85, 230, 95 };
foreach (int amount in sales)
{
    total += amount;
}
Console.WriteLine(total);`,
      options: [
        { label: '4' },
        { label: '95' },
        { label: '530', correct: true },
        { label: '120' },
      ],
      explanation:
        "The `+=` compound assignment adds each value to `total`: 0 + 120 + 85 + 230 + 95 = **530**. This accumulator pattern (start at 0, loop, `+=`) is one of the most-written shapes in everyday code.",
    },
  ],

  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Even or odd',
      prompt:
        "Read an integer from the user. Print `'Even'` if it's evenly divisible by 2, `'Odd'` otherwise. Use the `%` operator. Don't use `if/else` if you've covered the ternary — try `?:` instead.",
      hints: [
        'A number is even when `n % 2 == 0`.',
        'Ternary syntax: `condition ? whenTrue : whenFalse`.',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Average of three',
      prompt:
        "Read three numbers from the user. Print their average with 2 decimal places. Watch out for integer division — if you sum three ints and divide by 3, you'll lose decimals.",
      hints: [
        'Either cast to `double` before dividing, or use `double` throughout.',
        'Format with `:F2`.',
      ],
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'BMI categories',
      prompt:
        "Build a BMI calculator: read height (in meters) and weight (in kg). Compute BMI = weight / (height × height). Print the category: underweight (<18.5), normal (18.5–24.9), overweight (25–29.9), obese (≥30). Combine comparison and logical operators.",
      hints: [
        'BMI is a `double`.',
        'For the normal range: `bmi >= 18.5 && bmi < 25`.',
        'A chain of if/else statements is fine here.',
      ],
    },
  ],
};
