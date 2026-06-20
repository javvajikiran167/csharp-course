import type { Lesson } from '@/data/types';

export const lesson05: Lesson = {
  "slug": "params",
  "number": 5,
  "title": "params Arrays & Variadic Methods",
  "objective": "Write methods that accept any number of arguments using params, the mechanism behind methods like string.Format.",
  "blocks": [
    {
      "kind": "lead",
      "text": "You have already called a method that accepts any number of arguments hundreds of times: every `Console.WriteLine(\"{0} of {1}\", a, b)` quietly hands a variable-length argument list to the runtime. Today we pull back the curtain on `params` — the keyword that lets *you* write those flexible methods."
    },
    {
      "kind": "teachingNotes",
      "items": [
        "Open by asking students how they'd write a `Sum` that takes 2 numbers, then 3, then 'any amount' — let them feel the pain of writing overload after overload or forcing callers to build an array, *then* introduce `params` as the relief.",
        "The single biggest 'aha' for Python folks: `params` is C#'s `*args`, but strongly typed and with strict compile-time rules (last position, exactly one per method, all elements share a declared type).",
        "Live-demo the `49.50 -> 49.5` formatting surprise; it teaches that `params object?[]` boxes each argument and calls `ToString()`, and it reinforces an earlier lesson on numeric formatting.",
        "If the class is strong, describe the call site: for `params T[]` the compiler allocates a fresh array on every call. That cost is exactly what the modern `params ReadOnlySpan<T>` payoff at the end removes.",
        "Timebox the Span section — for beginners it's a 'be aware this exists and why libraries use it' note, not a deep dive into stack allocation or `ref struct` rules.",
        "Verified on .NET 10 / C# 14: every snippet here compiles and the output blocks are copied from real runs — including `$49.5`, `$99`, `True`, and the empty trailing CSV cell."
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "The problem params solves",
      "id": "the-problem"
    },
    {
      "kind": "paragraph",
      "text": "Imagine a `Sum` helper. With fixed parameters you'd be stuck: `Sum(int a, int b)` works for two numbers, but the moment a caller has three you need another overload, and another, forever. The alternative — forcing every caller to build an array first, `Sum(new[] { 1, 2, 3 })` — works but reads like bureaucracy at every call site. In Python you'd reach for `def total(*nums):` and call `total(1, 2, 3)` freely. C# gives you the same ergonomics with the **`params`** modifier, while keeping everything strongly typed and checked at compile time."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "int Sum(params int[] numbers)\n{\n    int total = 0;\n    foreach (int n in numbers)\n        total += n;\n    return total;\n}\n\nConsole.WriteLine(Sum(1, 2, 3));   // many arguments\nConsole.WriteLine(Sum(42));        // one argument\nConsole.WriteLine(Sum());          // zero arguments\nint[] data = { 10, 20, 30 };\nConsole.WriteLine(Sum(data));      // pass an existing array directly"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "6\n42\n0\n60"
    },
    {
      "kind": "paragraph",
      "text": "Read that carefully — one method definition handled **zero, one, many, and an explicit array** with no extra overloads. That is the whole promise of `params`: the caller writes a comma-separated list, and the compiler bundles those arguments into an array (`int[]`) for you behind the scenes. Inside the method, `numbers` is an ordinary array — you can index it, ask for `.Length`, `foreach` over it, or pass it to LINQ. And when the caller already has an array, the compiler forwards it as-is rather than wrapping it in a second array."
    },
    {
      "kind": "twoColumn",
      "cards": [
        {
          "title": "Python *args",
          "items": [
            "`def total(*nums): ...`",
            "`nums` is a **tuple** of whatever was passed",
            "Any types mixed freely — fully dynamic",
            "`total(1, 2, 3)` or `total(*my_list)` to spread"
          ]
        },
        {
          "title": "C# params",
          "items": [
            "`int Total(params int[] nums) { ... }`",
            "`nums` is a typed **array** (`int[]`)",
            "All elements share one declared type (use `params object?[]` for mixed)",
            "`Total(1, 2, 3)` or `Total(myArray)` — array forwarded as-is, not re-wrapped"
          ]
        }
      ]
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "This is how Console.WriteLine and string.Format work",
      "id": "writeline-and-format"
    },
    {
      "kind": "paragraph",
      "text": "The composite-formatting overloads you have leaned on since lesson one are `params` methods. `string.Format`'s signature is essentially `Format(string format, params object?[] args)`, and `Console.WriteLine` has a matching `WriteLine(string format, params object?[] arg)` overload. The first parameter is the template; everything after it is swept into the array, and the `{0}`, `{1}`, `{2}` placeholders index into that array by position. That is literally why placeholder numbering starts at zero — it's an array index."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "// string.Format ≈ Format(string format, params object?[] args)\nstring line = string.Format(\"{0} ordered {1} items for ${2}\", \"Ada\", 3, 49.50);\nConsole.WriteLine(line);\n\n// Console.WriteLine has its own params object?[] overload:\nConsole.WriteLine(\"{0}-{1}-{2}\", 2026, 6, 21);\n\n// Because it's just an array under the hood, you can pass one explicitly:\nobject[] parts = { \"Grace\", 7, 99.00 };\nConsole.WriteLine(string.Format(\"{0} ordered {1} items for ${2}\", parts));"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "Ada ordered 3 items for $49.5\n2026-6-21\nGrace ordered 7 items for $99"
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Why did $49.50 print as $49.5?",
      "text": "`params object?[]` accepts *any* type, so each argument is boxed and rendered with its default `ToString()`. A `double` of `49.50` has no memory of trailing zeros, so it prints `49.5`; `99.00` prints `99`. This is the hidden cost of `object?[]` flexibility — you lose type-specific control. For money you'd format explicitly: `string.Format(\"${0:F2}\", 49.50)` gives `$49.50`. The `params` mechanism is innocent here; the real lesson is that `object?[]` defers everything to `ToString()`."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "params with regular parameters: it must come last",
      "id": "params-with-others"
    },
    {
      "kind": "paragraph",
      "text": "A method can mix fixed parameters with a `params` array, but the `params` parameter **must be the final one**, and a method may have **at most one**. This makes sense once you picture how the compiler reads a call: it binds the fixed arguments first, then sweeps everything left over into the array. If two parameters were variadic, the compiler couldn't tell where one list ends and the next begins. Here is a small HTML-tag builder — the kind of helper you'd find in a view layer or a test fixture — where the element name is required and the CSS classes are optional and unbounded."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "// 'element' is required; 'classes' soaks up the rest. params is LAST.\nstring Tag(string element, params string[] classes)\n{\n    string classAttr = classes.Length == 0\n        ? \"\"\n        : $\" class=\\\"{string.Join(' ', classes)}\\\"\";\n    return $\"<{element}{classAttr}>\";\n}\n\nConsole.WriteLine(Tag(\"div\"));                                  // no classes\nConsole.WriteLine(Tag(\"div\", \"card\"));                          // one class\nConsole.WriteLine(Tag(\"button\", \"btn\", \"btn-primary\", \"rounded\"));"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "<div>\n<div class=\"card\">\n<button class=\"btn btn-primary rounded\">"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Signature rules to remember",
      "text": "`params` goes on the **last** parameter only, and you can have **only one** per method. You also cannot combine `params` with `out` or `ref` on the same parameter, and a `params` parameter can't carry a default value — a no-argument call already gives you an empty array, which is its natural 'default'."
    },
    {
      "kind": "heading",
      "level": 2,
      "text": "A real-world variadic helper",
      "id": "real-world"
    },
    {
      "kind": "paragraph",
      "text": "Variadic methods shine when the *number* of inputs is genuinely open-ended: structured logging (`Log(string message, params object?[] args)`), building a SQL `IN (...)` clause from however many ids you have, joining path segments, or — below — assembling a CSV row from however many fields a row happens to carry. Here `params object?[]` is the right call because a CSV cell can hold anything, and we normalise each value through `ToString()`, treating `null` as an empty cell."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "string CsvRow(params object?[] fields)\n    => string.Join(\",\", fields.Select(f => f?.ToString() ?? \"\"));\n\nConsole.WriteLine(CsvRow(\"id\", \"name\", \"email\"));\nConsole.WriteLine(CsvRow(1, \"Ada Lovelace\", \"ada@calc.io\"));\nConsole.WriteLine(CsvRow(2, \"Grace Hopper\", null));  // null -> empty cell\nConsole.WriteLine(CsvRow(true, 3.14, 'x'));          // any types welcome"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "id,name,email\n1,Ada Lovelace,ada@calc.io\n2,Grace Hopper,\nTrue,3.14,x"
    },
    {
      "kind": "paragraph",
      "text": "Notice `true` rendered as `True` — C#'s `bool.ToString()` capitalises, unlike Python's `True`/`False` which happen to match by coincidence here — and the third row ends in a comma followed by nothing, the empty trailing cell produced by the `null`. These tiny details are exactly what `params object?[]` invites: total flexibility, with type-specific formatting (currency, dates, escaping commas inside fields) left entirely to you. A production CSV writer would add quoting; this is the variadic skeleton it grows from."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Modern C#: params is no longer just for arrays",
      "id": "params-collections"
    },
    {
      "kind": "paragraph",
      "text": "Classic `params T[]` allocates a brand-new array on the heap for **every** call — usually fine, but wasteful in hot paths (think a logging method called millions of times per minute). Since C# 13, and fully available in your .NET 10 / C# 14 toolchain, **params collections** let you put `params` on `ReadOnlySpan<T>`, `IEnumerable<T>`, and other collection types. The call site looks identical, but with `params ReadOnlySpan<T>` the compiler can hand the arguments over from the stack with **zero heap allocation**."
    },
    {
      "kind": "code",
      "language": "csharp",
      "filename": "Program.cs",
      "code": "// params ReadOnlySpan<int> — same call syntax, no int[] allocated on the heap.\nint Max(params ReadOnlySpan<int> values)\n{\n    if (values.Length == 0)\n        throw new ArgumentException(\"Need at least one value.\");\n    int best = values[0];\n    foreach (int v in values)\n        if (v > best) best = v;\n    return best;\n}\n\nConsole.WriteLine(Max(3, 9, 1, 7));\nConsole.WriteLine(Max(42));"
    },
    {
      "kind": "output",
      "label": "Console",
      "output": "9\n42"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Best practice: pick the right params type",
      "text": "For everyday application code, plain `params T[]` is clear and perfectly fine — don't over-engineer. For performance-sensitive library code on hot paths (logging, string building, math utilities), prefer `params ReadOnlySpan<T>` to skip the per-call array allocation. As a caller you rarely notice the difference; as a library author it can matter a lot, which is exactly why many BCL methods (e.g. `string.Concat`, `string.Join`) gained Span-based overloads in recent .NET versions. One caveat: a `ReadOnlySpan<T>` parameter is a `ref struct`, so you can't store it in a field, `await` across it, or use it inside an iterator — keep it local to the method."
    },
    {
      "kind": "examples",
      "intro": "A quick tour of valid params shapes you'll meet in real codebases:",
      "examples": [
        {
          "label": "Strongly-typed numeric variadic",
          "code": "double Average(params double[] xs) =>\n    xs.Length == 0 ? 0 : xs.Sum() / xs.Length;\n\nConsole.WriteLine(Average(2, 4, 6));",
          "output": "4"
        },
        {
          "label": "Fixed param + params (joining path segments)",
          "code": "string Join(char sep, params string[] parts) =>\n    string.Join(sep, parts);\n\nConsole.WriteLine(Join('/', \"api\", \"v1\", \"users\"));",
          "output": "api/v1/users"
        },
        {
          "label": "Zero-allocation params span (C# 13/14)",
          "code": "int Count(params ReadOnlySpan<string> items) => items.Length;\n\nConsole.WriteLine(Count(\"a\", \"b\", \"c\"));",
          "output": "3"
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Common confusion: empty vs null, and the shared-array footgun",
      "text": "Calling a `params` method with no arguments gives you an **empty** array (`Length == 0`), not `null` — so `foreach` and `.Length` are always safe in that case. But a caller *can* explicitly pass `null` (`Sum(null)` when the parameter is a reference-type array); the compiler warns under nullable reference types, and at runtime it throws `NullReferenceException` the moment you dereference it. Guard public APIs accordingly. Second trap: because passing an existing array forwards it **directly** (no copy), if you mutate the parameter inside the method you are mutating the caller's array — surprising and worth a defensive copy in shared code."
    },
    {
      "kind": "keyTakeaways",
      "items": [
        "`params` lets a method accept **any number of arguments** — zero, one, many, or an explicit array — and is C#'s strongly-typed answer to Python's `*args`.",
        "Inside the method the `params` parameter is an ordinary collection (an **array** with `params T[]`); a no-argument call yields an **empty** (never null) array.",
        "`Console.WriteLine` and `string.Format` are themselves `params object?[]` methods — that's why `{0}`, `{1}`, `{2}` placeholders index a free-form argument list (and why numbering starts at zero).",
        "The `params` parameter must be **last**, there can be only **one** per method, it can't take a default value, and it can't combine with `ref`/`out`.",
        "`params object?[]` accepts any type but renders each value via `ToString()`, so you lose type-specific formatting (e.g. `49.50` prints as `49.5`, `true` prints as `True`) — format explicitly when it matters.",
        "Modern C# (13+ / your C# 14 toolchain) supports **params collections**: prefer `params ReadOnlySpan<T>` on hot paths to avoid the per-call heap allocation, while plain `params T[]` stays the simple default for application code.",
        "Two footguns: a caller can pass `null` (throws on dereference), and passing an existing array forwards it without copying, so mutating it mutates the caller's array."
      ]
    }
  ]
};
