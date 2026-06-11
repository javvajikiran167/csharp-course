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

  questions: [
    {
      id: 'q1',
      kind: 'predict',
      prompt: 'What does this print?',
      code: `int x = 5;
int y = 5;
Console.WriteLine(x == y);
Console.WriteLine(x.Equals(y));`,
      options: [
        { label: 'True\\nTrue', correct: true },
        { label: 'True\\nFalse' },
        { label: 'False\\nTrue' },
        { label: 'Compile error' },
      ],
      explanation:
        'For value types like `int`, both `==` and `.Equals()` compare values — they give the same result. The trickiness only appears for reference types like custom classes or arrays.',
    },
    {
      id: 'q2',
      kind: 'mcq',
      prompt:
        "You write `if (age > 0 < 100)` to check that age is between 0 and 100. What happens?",
      options: [
        { label: 'It works correctly.' },
        {
          label: 'It is a compile error — comparison results cannot be compared again.',
          correct: true,
        },
        { label: 'It compiles but always returns true.' },
        { label: 'It compiles but is a runtime error.' },
      ],
      explanation:
        '`age > 0` returns a `bool`, and you cannot compare a `bool` to an `int` with `<`. C# rejects this at compile time. The fix is `age > 0 && age < 100`.',
    },
    {
      id: 'q3',
      kind: 'predict',
      prompt: 'What does this print?',
      code: `int[] a = { 1, 2, 3 };
int[] b = { 1, 2, 3 };
Console.WriteLine(a == b);`,
      options: [
        { label: 'True' },
        { label: 'False', correct: true },
        { label: 'Throws an exception' },
        { label: '1, 2, 3' },
      ],
      explanation:
        'Arrays are reference types. `a` and `b` are two different arrays in memory with the same contents — `==` compares references, so this is `False`. To compare contents, use `a.SequenceEqual(b)` (from `System.Linq`).',
    },
  ],

  challenges: [
    {
      id: 'c1',
      difficulty: 'easy',
      title: 'Voting age check',
      prompt:
        'Read the user\'s age. Print `Can vote` if they are **18 or older**, otherwise `Cannot vote`. Use a single bool variable for the decision.',
      hints: [
        'Use `>= 18`.',
        '`Console.WriteLine` accepts a bool but prints `True/False` — print a label string instead.',
      ],
    },
    {
      id: 'c2',
      difficulty: 'medium',
      title: 'Comfortable room',
      prompt:
        'Read a temperature in Celsius. Print `Too cold`, `Comfortable`, or `Too hot`. Comfortable is **18 to 26 (inclusive)**. Use comparison + `&&` rather than nested ifs (you will learn `if/else` next lesson — for now, three boolean variables and three `WriteLine` calls work fine).',
      hints: [
        'Three booleans: `tooCold`, `comfortable`, `tooHot`.',
        'Range check: `temp >= 18 && temp <= 26`.',
      ],
    },
    {
      id: 'c3',
      difficulty: 'hard',
      title: 'Triangle validity',
      prompt:
        "Read three side lengths. A triangle is valid if **every pair of sides sums to more than the third side**. Print whether the three lengths can form a triangle. Combine three comparisons with `&&`.",
      hints: [
        'a + b > c AND a + c > b AND b + c > a',
        'Read sides as `double`.',
      ],
    },
  ],
};
