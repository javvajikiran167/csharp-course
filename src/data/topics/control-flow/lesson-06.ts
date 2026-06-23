import type { Lesson } from '@/data/types';

export const lesson06: Lesson = {
  slug: 'short-circuit',
  number: 6,
  title: 'Short-Circuit Evaluation & Boolean Tricks',
  objective:
    "Understand exactly how `&&` and `||` evaluate — the subtle behavior that makes null-safe checks possible and that interviewers love to test.",
  blocks: [
    {
      kind: 'lead',
      text:
        '**`&&` and `||` are lazy.** They stop evaluating as soon as the answer is known. That single behavior is the reason you can write `if (user != null && user.IsAdmin)` without crashing — and it is a top-10 interview topic.',
    },
    {
      kind: 'teachingNotes',
      items: [
        '**Define short-circuit clearly**: `&&` stops at first `false`, `||` stops at first `true`',
        'Always show **side-by-side**: `obj != null && obj.X` (safe) vs `obj.X && obj != null` (crashes)',
        '**`&` and `|` (single) always evaluate both sides** — they are bitwise on ints, and on bools they are "eager boolean"',
        'Demo with a method that prints when called — students *see* the lazy behavior',
        'Connect to LINQ: `Any()`, `All()`, `Where()` all use short-circuit evaluation internally',
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'What short-circuit means',
    },
    {
      kind: 'twoColumn',
      cards: [
        {
          title: '`&&` — short-circuit AND',
          items: [
            '**Stops at the first `false`**',
            '`false && anything` → `false` (right side never evaluated)',
            '`true && X` → returns `X`',
            'Used for safety: check before access',
          ],
        },
        {
          title: '`||` — short-circuit OR',
          items: [
            '**Stops at the first `true`**',
            '`true || anything` → `true` (right side never evaluated)',
            '`false || X` → returns `X`',
            'Used for defaults: try this, else that',
          ],
        },
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Proof — a method that announces when it runs',
    },
    {
      kind: 'code',
      filename: 'short-circuit-demo.cs',
      code: `static bool LoudCheck(string label, bool result)
{
    Console.WriteLine($"  → evaluating {label}");
    return result;
}

Console.WriteLine("Test 1: false && LoudCheck");
bool a = false && LoudCheck("right", true);
Console.WriteLine($"  result = {a}");

Console.WriteLine("\\nTest 2: true || LoudCheck");
bool b = true || LoudCheck("right", false);
Console.WriteLine($"  result = {b}");

Console.WriteLine("\\nTest 3: true && LoudCheck");
bool c = true && LoudCheck("right", false);
Console.WriteLine($"  result = {c}");`,
    },
    {
      kind: 'output',
      output: `Test 1: false && LoudCheck
  result = False

Test 2: true || LoudCheck
  result = True

Test 3: true && LoudCheck
  → evaluating right
  result = False`,
    },
    {
      kind: 'paragraph',
      text:
        'In tests 1 and 2, `"→ evaluating right"` never prints — short-circuit skipped the right side entirely. In test 3 the left was `true`, so `&&` *did* need to evaluate the right.',
    },

    {
      kind: 'heading',
      level: 2,
      text: 'The classic safe-access pattern',
    },
    {
      kind: 'code',
      code: `string? input = null;

// ✅ Safe — short-circuit skips the .Length check when input is null
if (input != null && input.Length > 0)
{
    Console.WriteLine("Got input");
}

// ❌ Crashes — both sides evaluate, .Length on null throws NullReferenceException
if (input.Length > 0 && input != null)
{
    Console.WriteLine("Got input");
}`,
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: 'Order matters — always check null first',
      text:
        'The null check **must come before** the property access. `&&` evaluates left-to-right, so `obj != null && obj.X` is safe — but `obj.X && obj != null` crashes when `obj` is null. **Rule: guard then use.**',
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Eager evaluation: `&` and `|`',
    },
    {
      kind: 'paragraph',
      text:
        '`&` and `|` (single, not double) **always evaluate both sides**, even if the result is already known. On `int`, they are bitwise. On `bool`, they are "eager boolean" — same result as `&&`/`||` but without short-circuit.',
    },
    {
      kind: 'code',
      code: `bool a = false & LoudCheck("right", true);    // → evaluating right
                                                // result = false
bool b = true  | LoudCheck("right", false);    // → evaluating right
                                                // result = true`,
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'When would you want eager?',
      text:
        '**Rarely.** Almost the only real reason is when the right-hand expression has a **side effect you want to happen unconditionally**. Even then, write it as a separate statement above — clearer to the next reader. **Default to `&&` and `||`.**',
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Boolean tricks every C# developer should know',
    },
    {
      kind: 'examples',
      intro: 'Four idioms that appear in every codebase:',
      examples: [
        {
          label: 'Default value with || pattern (via ternary)',
          code: `string? input = Console.ReadLine();
string name = !string.IsNullOrWhiteSpace(input) ? input : "Guest";
// Or with ??: only catches null, not empty/whitespace
string name2 = input ?? "Guest";`,
        },
        {
          label: 'Range check',
          code: `int age = 25;
bool isWorkingAge = age >= 18 && age < 65;`,
        },
        {
          label: 'De Morgan flip',
          code: `// !(A && B)  ==  !A || !B
// !(A || B)  ==  !A && !B
bool ok = !(score < 0 || score > 100);
bool sameThing = score >= 0 && score <= 100;`,
        },
        {
          label: 'Boolean as a return value',
          code: `static bool IsValidEmail(string email)
{
    return !string.IsNullOrWhiteSpace(email)
        && email.Contains('@')
        && email.Length >= 5;
}
Console.WriteLine(IsValidEmail("a@b.co"));   // True`,
        },
      ],
    },

    {
      kind: 'heading',
      level: 2,
      text: 'Common bugs caused by misunderstanding short-circuit',
    },
    {
      kind: 'list',
      items: [
        '**Calling a method with a side effect on the right side of `&&`** — sometimes it runs, sometimes it does not, hard to debug',
        "**Putting the null check second** — `obj.X != null && obj != null` crashes on null `obj`",
        '**Confusing `&` and `&&`** — `&` always evaluates both sides; on bool that is rarely what you want',
        '**Assuming `||` evaluates both for the result** — it does not; left wins if true',
      ],
    },

    {
      kind: 'keyTakeaways',
      items: [
        '**`&&` stops at the first `false`**; **`||` stops at the first `true`** — that is short-circuit',
        '**Always null-check before property access**: `obj != null && obj.X` (left-to-right matters)',
        '**`&` and `|` always evaluate both sides** — bitwise on ints; "eager bool" on bools, rarely useful',
        '**De Morgan\'s laws**: `!(A && B) == !A || !B` — handy for refactoring negations',
        'Use short-circuit in `bool` returns to chain validations: `IsValid() => CheckA() && CheckB() && CheckC()`',
      ],
    },
  ],
};
